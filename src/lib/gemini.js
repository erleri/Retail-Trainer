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
당신은 **"최고의 LG TV 셀아웃 전문가"**입니다.
고객의 거절(Objection)을 극복하고, 구매로 이어지게 만드는 **실전 판매 스크립트**를 제공하는 것이 목표입니다.

**핵심 지침 (Strict Guidelines):**

1. **답변 형식 (Response Format):**
   - **화면 텍스트 (Display Text)**와 **음성 텍스트 (Speech Text)**를 반드시 구분하세요.
   - 구분자: \`---SPEECH---\`

2. **화면 텍스트 (Display Text):**
   - **가독성 위주:** 표(Table), 불렛포인트, 볼드체를 적극 활용하여 핵심 정보를 구조화하세요.
   - 상세한 스펙 비교나 논리적인 근거를 포함하세요.

   - **Coaching Style:** Do not just lecture. Ask questions to check the user's understanding. Guide them to the answer.
   - **Interactive:** Be Socratic. Instead of saying "Do X," ask "What do you think is the best way to handle X?"
   - **Tone:** Professional but encouraging mentor.
   - **Length:** Keep explanations concise (3-4 sentences) but meaningful.
   - **Speech:** Speak naturally with emotion.
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
                maxOutputTokens: 1000,
                temperature: 0.7,
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
            
            **Conversation Rules:**
            - If the salesperson addresses your needs well, show interest.
            - If the salesperson ignores your concerns, become skeptical or resistant.
            - Adjust your objection frequency based on the Difficulty Level.
            - For Level 4-5, be very critical and ask for detailed specs or comparisons.
            - For Level 1-2, be friendly and easily convinced.

            **IMPORTANT:** You are NOT the AI Trainer. You are the CUSTOMER. Do not give advice. Just roleplay.
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

    sendMessage: async (message, language = 'ko', isRoleplay = false) => {
        if (!API_KEY) {
            console.error("Gemini API Key is missing!");
            return { text: "시스템 오류: API 키가 설정되지 않았습니다.", speech: "API 키 오류가 발생했습니다." };
        }

        if (!chatSession) {
            await aiService.initChat(TRAINER_INSTRUCTION);

        }

        let langInstruction = "";
        if (!isRoleplay) {
            switch (language) {
                case 'en':
                    langInstruction = "\n(Please respond in English. Keep the same format: Display Text ---SPEECH--- Speech Text)";
                    break;
                case 'es':
                    langInstruction = "\n(Por favor responde en Español. Mantén el mismo formato: Texto de Pantalla ---SPEECH--- Texto de Voz)";
                    break;
                case 'pt-br':
                    langInstruction = "\n(Por favor responda em Português do Brasil. Mantenha o mesmo formato: Texto de Exibição ---SPEECH--- Texto de Fala)";
                    break;
                default:
                    langInstruction = "\n(한국어로 답변해주세요. 형식은 동일하게 유지하세요: 화면 텍스트 ---SPEECH--- 음성 텍스트)";
            }
        }

        try {
            const result = await chatSession.sendMessage(message + langInstruction);
            const response = await result.response;
            const fullText = response.text();

            if (isRoleplay) {
                return { text: fullText, speech: fullText };
            } else {
                const parts = fullText.split('---SPEECH---');
                const displayText = parts[0].trim();
                const speechText = parts.length > 1 ? parts[1].trim() : displayText.replace(/[*#`]/g, '');
                return { text: displayText, speech: speechText };
            }
        } catch (error) {
            console.error("Gemini API Error Details:", error);
            return { text: "오류가 발생했습니다.", speech: "오류가 발생했습니다." };
        }
    },

    sendMessageStream: async (message, language = 'ko', isRoleplay = false, onChunk) => {
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
                    langInstruction = "\n(Please respond in English. Keep the same format: Display Text ---SPEECH--- Speech Text)";
                    break;
                case 'es':
                    langInstruction = "\n(Por favor responde en Español. Mantén el mismo formato: Texto de Pantalla ---SPEECH--- Texto de Voz)";
                    break;
                case 'pt-br':
                    langInstruction = "\n(Por favor responda em Português do Brasil. Mantenha o mesmo formato: Texto de Exibição ---SPEECH--- Texto de Fala)";
                    break;
                default:
                    langInstruction = "\n(한국어로 답변해주세요. 형식은 동일하게 유지하세요: 화면 텍스트 ---SPEECH--- 음성 텍스트)";
            }
        }

        try {
            const result = await chatSession.sendMessageStream(message + langInstruction);

            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                onChunk(chunkText);
            }

            if (isRoleplay) {
                return { text: fullText, speech: fullText };
            } else {
                const parts = fullText.split('---SPEECH---');
                const displayText = parts[0].trim();
                const speechText = parts.length > 1 ? parts[1].trim() : displayText.replace(/[*#`]/g, '');
                return { text: displayText, speech: speechText };
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

        let prompt = "";

        if (language === 'en') {
            prompt = `
            Analyze the following sales training roleplay conversation log.
            Generate a feedback report in the following JSON format.

            Conversation Log:
            ${JSON.stringify(history)}

            JSON Format:
            {
                "totalScore": Integer between 0-100,
                "rank": "Top 1% ~ Top 50% String",
                "summary": "Overall feedback summary (in English)",
                "pros": ["Strength 1", "Strength 2"],
                "improvements": ["Improvement 1", "Improvement 2"],
                "practiceSentence": "One key sentence to practice",
                "recommendedMission": {
                    "title": "Recommended Mission Title",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Product Knowledge", "A": 0~100 },
                    { "subject": "Objection Handling", "A": 0~100 },
                    { "subject": "Empathy", "A": 0~100 },
                    { "subject": "Policy", "A": 0~100 },
                    { "subject": "Conversation", "A": 0~100 }
                ]
            }
            Return only the JSON string. No markdown formatting.
            `;
        } else if (language === 'es') {
            prompt = `
            Analiza el siguiente registro de conversación de juego de roles de entrenamiento de ventas.
            Genera un informe de retroalimentación en el siguiente formato JSON.

            Registro de Conversación:
            ${JSON.stringify(history)}

            Formato JSON:
            {
                "totalScore": Entero entre 0-100,
                "rank": "Top 1% ~ Top 50% Cadena",
                "summary": "Resumen general de retroalimentación (en Español)",
                "pros": ["Fortaleza 1", "Fortaleza 2"],
                "improvements": ["Mejora 1", "Mejora 2"],
                "practiceSentence": "Una frase clave para practicar",
                "recommendedMission": {
                    "title": "Título de Misión Recomendada",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Conocimiento del Producto", "A": 0~100 },
                    { "subject": "Manejo de Objeciones", "A": 0~100 },
                    { "subject": "Empatía", "A": 0~100 },
                    { "subject": "Política", "A": 0~100 },
                    { "subject": "Conversación", "A": 0~100 }
                ]
            }
            Devuelve solo la cadena JSON. Sin formato markdown.
            `;
        } else if (language === 'pt-br') {
            prompt = `
            Analise o seguinte registro de conversa de roleplay de treinamento de vendas.
            Gere um relatório de feedback no seguinte formato JSON.

            Registro de Conversa:
            ${JSON.stringify(history)}

            Formato JSON:
            {
                "totalScore": Inteiro entre 0-100,
                "rank": "Top 1% ~ Top 50% String",
                "summary": "Resumo geral do feedback (em Português)",
                "pros": ["Ponto Forte 1", "Ponto Forte 2"],
                "improvements": ["Melhoria 1", "Melhoria 2"],
                "practiceSentence": "Uma frase chave para praticar",
                "recommendedMission": {
                    "title": "Título da Missão Recomendada",
                    "xp": 50,
                    "type": "Roleplay"
                },
                "scores": [
                    { "subject": "Conhecimento do Produto", "A": 0~100 },
                    { "subject": "Tratamento de Objeções", "A": 0~100 },
                    { "subject": "Empatia", "A": 0~100 },
                    { "subject": "Política", "A": 0~100 },
                    { "subject": "Conversa", "A": 0~100 }
                ]
            }
            Retorne apenas a string JSON. Sem formatação markdown.
            `;
        } else {
            // Default to Korean
            prompt = `
            다음은 세일즈 트레이닝 롤플레잉 대화 로그입니다. 
            이 대화를 분석하여 다음 JSON 형식으로 피드백 리포트를 생성해주세요.
            
            대화 로그:
            ${JSON.stringify(history)}

            JSON 형식:
            {
                "totalScore": 0~100 사이 정수,
                "rank": "Top 1% ~ Top 50% 문자열",
                "summary": "전체적인 피드백 요약 (한글)",
                "pros": ["잘한 점 1", "잘한 점 2"],
                "improvements": ["개선할 점 1", "개선할 점 2"],
                "practiceSentence": "연습이 필요한 핵심 문장 1개",
                "recommendedMission": {
                "title": "추천 미션 제목",
                "xp": 50,
                "type": "Roleplay"
                },
                "scores": [
                { "subject": "Product Knowledge", "A": 0~100 },
                { "subject": "Objection Handling", "A": 0~100 },
                { "subject": "Empathy", "A": 0~100 },
                { "subject": "Policy", "A": 0~100 },
                { "subject": "Conversation", "A": 0~100 }
                ]
            }
            
            응답은 오직 JSON 문자열만 반환하세요. 마크다운 포맷팅 없이.
            `;
        }

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Feedback Generation Error:", error);
            return null;
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
