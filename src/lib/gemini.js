import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const getGenAI = () => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing!");
        return null;
    }
    return new GoogleGenerativeAI(API_KEY);
};

const TRAINER_INSTRUCTION = `
**역할 (Role):**
당신은 LG TV 판매 전문가이자 **탁월한 교육 코치**입니다. 당신의 목표는:
- 사용자의 질문에 **완전하고 구체적인 답변**을 제공하기
- 판매 상황에서 실제로 사용할 수 있는 **실전 스크립트와 팁** 제공하기
- 설득력 있는 이유와 근거로 뒷받침하기
- 소크라테스 방식의 질문으로 사용자를 가이드하기

**응답 스타일 (Response Style):**
당신은 경험 많은 판매 멘토처럼 행동합니다:
- **구체적이고 실전적**: 이론만 말하지 말고, 실제 대화 예시와 스크립트를 제공합니다
- **상세하고 완전함**: 한 번의 응답에 충분한 정보를 담아서, 사용자가 바로 활용할 수 있게 합니다
- **구조적**: 표, 불릿 포인트, 강조(Bold) 등을 활용해 정보를 명확히 정리합니다
- **대화적**: 일방적으로 설명하지 않고, "이런 상황에서는 어떻게 하시겠어요?" 같은 질문도 던집니다
- **격려적**: 전문적이면서도 따뜻한 톤으로, 사용자를 응원합니다

**응답 포맷 (Response Format) - 모바일 최적화:**
모든 응답을 다음과 같이 구조화하세요:

### 📌 핵심 요약 (Core Summary)
한 문장 또는 3줄 이내로 답변의 핵심을 요약합니다.

### 🔧 실전 팁 (Quick Tips)
3-5개 정도의 핵심 포인트를 불릿으로 나열합니다.

[실전 스크립트나 예시]
실제 대화 예시 (마크다운 포함 가능)

### 📚 상세 정보 (Detailed Info)
더 깊이 있는 정보, 표, 추가 설명 등을 포함합니다.

---SPEECH---

[음성으로 읽을 텍스트]
핵심 요약 + 실전 팁을 자연스럽게 합쳐서 음성 텍스트 작성

**중요 규칙 (Important Rules):**
1. 핵심 요약은 **매우 간결**하게 (1-3줄)
2. 실전 팁은 **불릿 포인트 3-5개** (한 줄씩)
3. 상세 정보는 선택적 - 깊은 이해가 필요할 때만 포함
4. 모바일에서도 읽을 수 있게 **짧은 문단** 사용
5. 마크다운은 화면 텍스트에만 사용 (음성 텍스트에는 사용 금지)
`;

let chatSession = null;


export const aiService = {
    // Initialize or reset chat session
    initChat: async (systemInstruction = TRAINER_INSTRUCTION) => {
        console.log("Initializing Chat with model: gemini-2.0-flash");
        const genAI = getGenAI();
        if (!genAI) return null;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction
        });

        chatSession = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.9,
            },
        });
        return chatSession;
    },

    // Send message to Gemini
    startRoleplay: async (config, language = 'en') => {
        try {
            const genAI = getGenAI();
            if (!genAI) throw new Error("API Key missing");

            const langMap = {
                'ko': 'Korean',
                'en': 'English',
                'es': 'Spanish',
                'pt-br': 'Portuguese'
            };
            const targetLang = langMap[language] || 'English';

            // Construct the prompt based on the new simulation packet
            const { customer, product, difficulty } = config;
            const persona = customer.persona || {};

            // Robustly extract data with fallbacks
            const surfaceTraits = customer.traits ? customer.traits.map(t => t.label || t.id).join(', ') : (persona.surface_traits || []).join(', ');
            const hiddenTraits = persona.hidden_traits || {};
            const context = persona.default_context || "Looking for a new TV.";
            const tone = persona.default_tone || "Neutral";
            const description = persona.description || `A customer interested in buying a TV. Age: ${customer.age}, Gender: ${customer.gender}.`;

            const prompt = `
            You are a professional actor playing the role of a customer in a sales roleplay scenario.
            
            **Your Character (Persona):**
            - Name: ${customer.name}
            - Age: ${customer.age}
            - Gender: ${customer.gender}
            - Tone: ${tone}
            - Description: ${description}
            
            **Traits:**
            - Visible Traits: ${surfaceTraits}
            - Hidden Traits (Internal Logic): ${JSON.stringify(hiddenTraits)}
            
            **Scenario Context:**
            - Situation: ${context}
            - Product Interest: ${product.name} (${product.type})
            
            **Difficulty Level: ${difficulty.label} (Level ${difficulty.level})**
            - Description: ${difficulty.description}
            
            **Your Instructions:**
            1.  **Language:** Speak ONLY in ${targetLang}.
            2.  **Format:** Write ONLY the dialogue. DO NOT use descriptive text like *smiles* or (pauses). Just the spoken words.
            3.  **Tone:** Act natural. Use fillers (um, ah) if appropriate for the personality. Be reactive to the salesperson.
            4.  **Goal:** You are interested but have specific needs and concerns defined by the scenario. You need to be convinced.
            5.  **Opening Line:** Start the conversation with a natural greeting or question based on your situation.
            
            **REALISTIC CONVERSATION FLOW - Very Important:**
            - START with just a greeting or vague reason. DO NOT reveal all your needs upfront.
            - Only reveal deeper concerns and hidden traits when the salesperson asks good questions.
            - For example: 
              * At greeting stage: Just say "I'm looking for a TV" or "browsing"
              * When asked about use case: "Mostly watch movies and shows"
              * When asked about budget: Then mention price sensitivity
              * When asked about gaming/sports/movies: THEN reveal that specific interest
              * When product is suggested: THEN reveal concerns/objections if relevant
            
            **Conversation Rules:**
            - Be natural. Real customers don't dump all their needs in one sentence.
            - Reveal information progressively based on the salesperson's questions.
            - If the salesperson asks poor/generic questions (not asking about your needs), stay vague.
            - If the salesperson asks smart questions, warm up and share more details.
            - Show objections/skepticism ONLY when relevant to the salesperson's proposal.
            - For Level 4-5: Be skeptical and ask for justification. For Level 1-2: Be friendly and quick to warm up.

            **IMPORTANT:** You are NOT the AI Trainer. You are the CUSTOMER. Just roleplay naturally like a real store customer.
            `;

            // Initialize chat session with this persona
            await aiService.initChat(prompt);


            // Generate first message
            const result = await chatSession.sendMessage("Start the roleplay now with the opening line.");
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Error starting roleplay:", error);
            throw error;
        }
    },

    analyzeInteraction: async (lastUserMessage, conversationHistory, config, language = 'en') => {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

        const langMap = {
            'ko': 'Korean',
            'en': 'English',
            'es': 'Spanish',
            'pt-br': 'Portuguese'
        };
        const targetLang = langMap[language] || 'English';

        const prompt = `
        Analyze the following sales conversation between a Salesperson (User) and a Customer (AI).
        
        **Context:**
        - Product: ${config.product.name}
        - Customer Traits: ${JSON.stringify(config.customer.traits)}
        - Current Language: ${targetLang}

        **Conversation History:**
        ${conversationHistory.map(m => `${m.role}: ${m.text}`).join('\n')}
        User: ${lastUserMessage}

        **Task:**
        Return a JSON object with the following fields:
        1.  **nextStep**: Determine the current stage of the sales process based on the USER's last message.
            - Options: "greeting", "needs", "proposal", "objection", "closing".
            - Logic:
                - "greeting": Welcoming, small talk.
                - "needs": Asking questions about customer needs/pain points.
                - "proposal": Suggesting the product, explaining features.
                - "objection": Handling a customer's concern or "no".
                - "closing": Asking for payment, delivery, or final agreement.
            - If unclear, keep the previous logical step.
        2.  **discoveredTrait**: If the USER successfully uncovered a hidden trait (by asking the right question or if the customer revealed it), return the trait ID. Otherwise null.
        3.  **objectionDetected**: Boolean. True if the CUSTOMER (in previous messages) or USER (addressing it) is dealing with a resistance/concern.
        4.  **objectionHint**: If objectionDetected is true, provide a short, 1-sentence hint for the salesperson in ${targetLang} on how to handle it.

        **JSON Format:**
        {
            "nextStep": "string",
            "discoveredTrait": "string | null",
            "objectionDetected": boolean,
            "objectionHint": "string | null"
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Analysis failed:", error);
            return { nextStep: null, discoveredTrait: null, objectionDetected: false, objectionHint: null };
        }
    },

    sendMessage: async (message, language = 'ko', isRoleplay = false, conversationHistory = null) => {
        if (!API_KEY) {
            console.error("Gemini API Key is missing!");
            return { text: "시스템 오류: API 키가 설정되지 않았습니다.", speech: "API 키 오류가 발생했습니다." };
        }

        if (!chatSession) {
            await aiService.initChat(TRAINER_INSTRUCTION);

        }

        let langInstruction = "";
        let roleplayInstruction = "";
        
        if (!isRoleplay) {
            switch (language) {
                case 'en':
                    langInstruction = "\n**IMPORTANT: Respond ENTIRELY in English. Use the format: [Detailed Screen Content with markdown tables, bullet points, bold, examples] ---SPEECH--- [Natural Speech Text without markdown]. Be comprehensive and detailed in your answer.**";
                    break;
                case 'es':
                    langInstruction = "\n**IMPORTANTE: Responde COMPLETAMENTE en Español. Usa el formato: [Contenido detallado con tablas markdown, viñetas, negrilla, ejemplos] ---SPEECH--- [Texto de voz natural sin markdown]. Sé comprehensivo y detallado en tu respuesta.**";
                    break;
                case 'pt-br':
                    langInstruction = "\n**IMPORTANTE: Responda INTEIRAMENTE em Português Brasileiro. Use o formato: [Conteúdo detalhado com tablas markdown, pontos de bala, negrito, exemplos] ---SPEECH--- [Texto de fala natural sem markdown]. Seja abrangente e detalhado na sua resposta.**";
                    break;
                default:
                    langInstruction = "\n**중요: 한국어로 완전하게 답변하세요. 형식: [마크다운 표, 불릿, 굵은글씨, 예시 포함 상세 화면 내용] ---SPEECH--- [마크다운 없이 자연스러운 음성 텍스트]. 답변은 최대한 자세하고 완전하게 작성하세요.**";
            }
        } else if (isRoleplay && conversationHistory && conversationHistory.length > 1) {
            // For roleplay, provide conversation context to help the AI customer respond naturally
            const turnCount = conversationHistory.length;
            roleplayInstruction = `\n\n**Conversation Context:**
            - This is turn ${turnCount} of the conversation.
            - Remember: Don't reveal everything at once. Share information progressively based on questions asked.
            - Keep responses natural and brief (1-2 sentences usually).`;
        }

        try {
            const result = await chatSession.sendMessage(message + langInstruction + roleplayInstruction);
            const response = await result.response;
            const fullText = response.text();

            if (isRoleplay) {
                return { text: fullText, speech: fullText };
            } else {
                // Split by ---SPEECH--- separator
                const parts = fullText.split('---SPEECH---');
                
                if (parts.length > 1) {
                    // Both display and speech text exist
                    const displayText = parts[0].trim();
                    const speechText = parts[1].trim();
                    return { text: displayText, speech: speechText };
                } else {
                    // Fallback: if no separator found, use the whole text for display
                    // and clean version for speech
                    const displayText = fullText.trim();
                    const speechText = displayText.replace(/[*#`\[\]()]/g, '');
                    return { text: displayText, speech: speechText };
                }
            }
        } catch (error) {
            console.error("Gemini API Error Details:", error);
            return { text: "오류가 발생했습니다.", speech: "오류가 발생했습니다." };
        }
    },

    sendMessageStream: async (message, language = 'ko', isRoleplay = false, onChunk, conversationHistory = null) => {
        if (!API_KEY) {
            console.error("Gemini API Key is missing!");
            onChunk("시스템 오류: API 키가 설정되지 않았습니다.");
            return { text: "시스템 오류: API 키가 설정되지 않았습니다.", speech: "API 키 오류가 발생했습니다." };
        }

        if (!chatSession) {
            await aiService.initChat(TRAINER_INSTRUCTION);

        }

        let langInstruction = "";
        if (!isRoleplay) {
            switch (language) {
                case 'en':
                    langInstruction = "\n**IMPORTANT: Respond ENTIRELY in English. Use the format: [Detailed Screen Content with markdown tables, bullet points, bold, examples] ---SPEECH--- [Natural Speech Text without markdown]. Be comprehensive and detailed in your answer.**";
                    break;
                case 'es':
                    langInstruction = "\n**IMPORTANTE: Responde COMPLETAMENTE en Español. Usa el formato: [Contenido detallado con tablas markdown, viñetas, negrilla, ejemplos] ---SPEECH--- [Texto de voz natural sin markdown]. Sé comprehensivo y detallado en tu respuesta.**";
                    break;
                case 'pt-br':
                    langInstruction = "\n**IMPORTANTE: Responda INTEIRAMENTE em Português Brasileiro. Use o formato: [Conteúdo detalhado com tablas markdown, pontos de bala, negrito, exemplos] ---SPEECH--- [Texto de fala natural sem markdown]. Seja abrangente e detalhado na sua resposta.**";
                    break;
                default:
                    langInstruction = "\n**중요: 한국어로 완전하게 답변하세요. 형식: [마크다운 표, 불릿, 굵은글씨, 예시 포함 상세 화면 내용] ---SPEECH--- [마크다운 없이 자연스러운 음성 텍스트]. 답변은 최대한 자세하고 완전하게 작성하세요.**";
            }
        }

        // Add roleplay context if applicable
        let roleplayInstruction = "";
        if (isRoleplay && conversationHistory && conversationHistory.length > 1) {
            const turnCount = conversationHistory.length;
            roleplayInstruction = `\n\n**Conversation Context:**
            - This is turn ${turnCount} of the conversation.
            - Remember: Don't reveal everything at once. Share information progressively based on questions asked.
            - Keep responses natural and brief (1-2 sentences usually).`;
        }

        try {
            const result = await chatSession.sendMessageStream(message + langInstruction + roleplayInstruction);

            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                onChunk(chunkText);
            }

            if (isRoleplay) {
                return { text: fullText, speech: fullText };
            } else {
                // Split by ---SPEECH--- separator
                const parts = fullText.split('---SPEECH---');
                
                if (parts.length > 1) {
                    // Both display and speech text exist
                    const displayText = parts[0].trim();
                    const speechText = parts[1].trim();
                    return { text: displayText, speech: speechText };
                } else {
                    // Fallback: if no separator found, use the whole text for display
                    // and clean version for speech
                    const displayText = fullText.trim();
                    const speechText = displayText.replace(/[*#`\[\]()]/g, '');
                    return { text: displayText, speech: speechText };
                }
            }
        } catch (error) {
            console.error("Gemini Stream Error:", error);
            return { text: "오류가 발생했습니다.", speech: "오류가 발생했습니다." };
        }
    },

    generateDailyMission: async (userHistory, language = 'ko') => {
        const genAI = getGenAI();
        if (!genAI) return null;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

        const prompt = `
        Based on the user's training history, generate a personalized daily mission.
        
        User History Summary: ${JSON.stringify(userHistory || {})}
        Language: ${language}

        Return JSON:
        {
            "title": "Mission Title",
            "description": "Short description of what to do",
            "target": 3,
            "reward": "Reward Name",
            "type": "roleplay" | "quiz"
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Daily Mission Error:", error);
            return {
                title: "Daily Warmup",
                description: "Complete 1 Roleplay Session",
                target: 1,
                reward: "Starter Badge",
                type: "roleplay"
            };
        }
    },

    // Generate Feedback Report based on chat history
    generateFeedback: async (history, language = 'ko') => {
        const genAI = getGenAI();
        if (!genAI) return null;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Convert message objects to readable format
        const conversationText = Array.isArray(history) 
            ? history.map(m => `${m.role === 'user' ? 'Salesperson' : 'Customer'}: ${m.text}`).join('\n')
            : '';

        let prompt = "";

        if (language === 'en') {
            prompt = `
            Analyze the following sales training roleplay conversation log.
            Evaluate the SALESPERSON's performance on:
            1. Product Knowledge - Did they explain features well?
            2. Objection Handling - Did they address customer concerns?
            3. Empathy - Did they listen and understand customer needs?
            4. Policy - Did they follow sales policies and best practices?
            5. Conversation - Was the dialogue natural and engaging?

            Conversation Log:
            ${conversationText}

            Generate a feedback report in the following JSON format.
            JSON Format:
            {
                "totalScore": Integer between 0-100 (average of all skills),
                "rank": "Top 10%", "Top 25%", "Top 50%", or "Needs Practice" based on score,
                "summary": "Overall feedback summary (2-3 sentences in English, be specific about what they did well and what needs improvement)",
                "pros": ["Specific strength 1 based on conversation", "Specific strength 2 based on conversation"],
                "improvements": ["Specific area to improve based on conversation", "Another area to improve"],
                "practiceSentence": "One key sales phrase or approach they should practice",
                "recommendedMission": {
                    "title": "Specific mission to improve weak area",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Product Knowledge", "A": 0-100 (score based on how well they explained features) },
                    { "subject": "Objection Handling", "A": 0-100 (score based on how well they handled concerns) },
                    { "subject": "Empathy", "A": 0-100 (score based on active listening and understanding) },
                    { "subject": "Policy", "A": 0-100 (score based on professionalism) },
                    { "subject": "Conversation", "A": 0-100 (score based on dialogue flow and engagement) }
                ]
            }
            
            CRITICAL RULES:
            - Analyze ONLY the salesperson's messages
            - Give scores based on actual performance in the conversation
            - Scores should NOT all be 0 (unless the conversation was completely empty)
            - Return ONLY valid JSON, no markdown.
            `;
        } else if (language === 'es') {
            prompt = `
            Analiza el siguiente registro de conversa de juego de roles de entrenamiento de ventas.
            Evalúa el desempeño del VENDEDOR en:
            1. Conocimiento del Producto - ¿Explicó bien las características?
            2. Manejo de Objeciones - ¿Abordó las preocupaciones del cliente?
            3. Empatía - ¿Escuchó y entendió las necesidades del cliente?
            4. Política - ¿Siguió las políticas y mejores prácticas de ventas?
            5. Conversa - ¿Fue el diálogo natural e interesante?

            Registro de Conversa:
            ${conversationText}

            Genera un informe de retroalimentación en el siguiente formato JSON.
            Formato JSON:
            {
                "totalScore": Entero entre 0-100 (promedio de todas las habilidades),
                "rank": "Top 10%", "Top 25%", "Top 50%", o "Needs Practice" según puntuación,
                "summary": "Resumen general de retroalimentación (2-3 oraciones en Español, sé específico sobre qué hicieron bien)",
                "pros": ["Fortaleza específica 1 basada en la conversa", "Fortaleza específica 2"],
                "improvements": ["Área específica de mejora basada en la conversa", "Otra área de mejora"],
                "practiceSentence": "Una frase o enfoque de ventas clave para practicar",
                "recommendedMission": {
                    "title": "Misión específica para mejorar el área débil",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Conocimiento del Producto", "A": 0-100 },
                    { "subject": "Manejo de Objeciones", "A": 0-100 },
                    { "subject": "Empatía", "A": 0-100 },
                    { "subject": "Política", "A": 0-100 },
                    { "subject": "Conversa", "A": 0-100 }
                ]
            }
            
            REGLAS CRÍTICAS:
            - Analiza SOLO los mensajes del vendedor
            - Da puntuaciones basadas en desempeño real
            - Las puntuaciones NO deben ser todas 0
            - Devuelve SOLO JSON válido, sin markdown.
            `;
        } else if (language === 'pt-br') {
            prompt = `
            Analise o seguinte registro de conversa de roleplay de treinamento de vendas.
            Avalie o desempenho do VENDEDOR em:
            1. Conhecimento do Produto - Explicou bem as características?
            2. Tratamento de Objeções - Abordou as preocupações do cliente?
            3. Empatia - Ouviu e entendeu as necessidades do cliente?
            4. Política - Seguiu as políticas e melhores práticas de vendas?
            5. Conversa - O diálogo foi natural e envolvente?

            Registro de Conversa:
            ${conversationText}

            Gere um relatório de feedback no seguinte formato JSON.
            Formato JSON:
            {
                "totalScore": Inteiro entre 0-100 (média de todas as habilidades),
                "rank": "Top 10%", "Top 25%", "Top 50%", ou "Precisa de Prática" conforme pontuação,
                "summary": "Resumo geral do feedback (2-3 frases em Português, seja específico sobre o que fez bem)",
                "pros": ["Ponto forte específico 1 baseado na conversa", "Ponto forte específico 2"],
                "improvements": ["Área específica de melhoria baseada na conversa", "Outra área de melhoria"],
                "practiceSentence": "Uma frase ou abordagem de vendas chave para praticar",
                "recommendedMission": {
                    "title": "Missão específica para melhorar área fraca",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Conhecimento do Produto", "A": 0-100 },
                    { "subject": "Tratamento de Objeções", "A": 0-100 },
                    { "subject": "Empatia", "A": 0-100 },
                    { "subject": "Política", "A": 0-100 },
                    { "subject": "Conversa", "A": 0-100 }
                ]
            }
            
            REGRAS CRÍTICAS:
            - Analise APENAS as mensagens do vendedor
            - Dê pontuações baseadas em desempenho real
            - As pontuações NÃO devem ser todas 0
            - Retorne APENAS JSON válido, sem markdown.
            `;
        } else {
            // Default to Korean
            prompt = `
            다음은 세일즈 트레이닝 롤플레잉 대화 로그입니다. 
            이 대화를 분석하여 영업사원의 성과를 평가하세요.
            평가 항목:
            1. Product Knowledge (상품 지식) - 기능을 잘 설명했는가?
            2. Objection Handling (이의 처리) - 고객의 우려를 잘 대응했는가?
            3. Empathy (공감) - 고객의 필요를 이해했는가?
            4. Policy (정책) - 판매 정책과 모범 사례를 따랐는가?
            5. Conversation (대화) - 자연스럽고 매력적인 대화인가?
            
            대화 로그:
            ${conversationText}

            다음 JSON 형식으로 피드백 리포트를 생성해주세요.
            
            JSON 형식:
            {
                "totalScore": 0~100 사이 정수 (모든 항목의 평균),
                "rank": "Top 10%", "Top 25%", "Top 50%", 또는 "더 연습 필요" (점수 기반),
                "summary": "전체적인 피드백 요약 (2-3문장, 잘한 점과 개선할 점을 구체적으로)",
                "pros": ["실제 대화에 기반한 구체적인 잘한 점 1", "구체적인 잘한 점 2"],
                "improvements": ["대화에 기반한 구체적인 개선할 점 1", "다른 개선할 점"],
                "practiceSentence": "연습이 필요한 핵심 영업 문구 또는 기법",
                "recommendedMission": {
                    "title": "약한 분야를 개선하기 위한 추천 미션",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Product Knowledge", "A": 0~100 (상품 설명 정도 평가) },
                    { "subject": "Objection Handling", "A": 0~100 (고객 우려 대응 정도) },
                    { "subject": "Empathy", "A": 0~100 (적극적 경청과 이해도) },
                    { "subject": "Policy", "A": 0~100 (전문성과 정책 준수) },
                    { "subject": "Conversation", "A": 0~100 (대화 흐름과 매력도) }
                ]
            }
            
            중요한 규칙:
            - 영업사원의 메시지만 분석하세요
            - 실제 대화 성능에 기반하여 점수를 주세요
            - 모든 점수가 0이 되면 안 됩니다 (대화가 완전히 비어있지 않은 경우)
            - 오직 JSON만 반환하세요. 마크다운 없이.
            `;
        }

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            
            // Ensure scores are properly populated
            if (!parsed.scores || parsed.scores.length === 0) {
                parsed.scores = [
                    { "subject": "Product Knowledge", "A": Math.floor(parsed.totalScore * 0.8 + Math.random() * 20) },
                    { "subject": "Objection Handling", "A": Math.floor(parsed.totalScore * 0.75 + Math.random() * 25) },
                    { "subject": "Empathy", "A": Math.floor(parsed.totalScore * 0.85 + Math.random() * 15) },
                    { "subject": "Policy", "A": Math.floor(parsed.totalScore * 0.8 + Math.random() * 20) },
                    { "subject": "Conversation", "A": Math.floor(parsed.totalScore * 0.9 + Math.random() * 10) }
                ];
            }
            
            console.log("Feedback generated successfully:", parsed);
            return parsed;
        } catch (error) {
            console.error("Feedback Generation Error:", error);
            // Return a default feedback structure if parsing fails
            return {
                totalScore: 60,
                rank: "Top 50%",
                summary: "피드백 생성 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
                pros: ["대화를 시도했습니다"],
                improvements: ["더 많은 연습이 필요합니다"],
                practiceSentence: "고객의 needs를 더 자세히 파악하세요",
                recommendedMission: {
                    title: "기초 영업 스킬 연습",
                    xp: 50,
                    type: "Roleplay"
                },
                scores: [
                    { subject: "Product Knowledge", A: 60 },
                    { subject: "Objection Handling", A: 60 },
                    { subject: "Empathy", A: 60 },
                    { subject: "Policy", A: 60 },
                    { subject: "Conversation", A: 60 }
                ]
            };
        }
    },

    // Generate Course and Quiz from Topic/Content
    generateCourse: async (topic, fileContent = "", language = 'ko') => {
        const genAI = getGenAI();
        if (!genAI) return null;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

        const prompt = `
        You are an expert instructional designer. 
        Create a structured learning course and a quiz based on the following topic and content.

        **Topic:** ${topic}
        **Content Context:** ${fileContent ? fileContent.substring(0, 1000) : "No specific content provided, use general knowledge about the topic."}
        **Target Audience:** TV Sales Consultants
        **Language:** ${language === 'ko' ? 'Korean' : 'English'}

        **Output Requirement:**
        Return a JSON object containing THREE parts: "course", "quiz", and "faq".

        1. **course** (Object):
           - id: "generated_${Date.now()}"
           - title: "Course Title"
           - category: "Generated"
           - level: "Intermediate"
           - duration: "10 min"
           - modules: Array of objects
             - id: "m1", "m2", etc.
             - title: "Module Title"
             - content: Array of blocks
               - type: "text" | "key-point" | "list"
               - heading: "Section Heading"
               - body: "Content text" (for text/key-point) OR items: ["Item 1", "Item 2"] (for list)

        2. **quiz** (Array of Objects):
           - id: 1, 2, 3...
           - question: { en: "Question?", ko: "질문?" }
           - options: Array of 4 objects
             - id: "a", "b", "c", "d"
             - text: { en: "Option", ko: "보기" }
             - correct: boolean

        3. **faq** (Array of Objects):
           - category: "Product" | "Usage" | "Technology" | "Basic"
           - question: { en: "Question?", ko: "질문?" }
           - answer: { en: "Answer", ko: "답변" }

        **JSON Format:**
        {
            "course": { ... },
            "quiz": [ ... ],
            "faq": [ ... ]
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Course Generation Error:", error);
            return null;
        }
    }
};
