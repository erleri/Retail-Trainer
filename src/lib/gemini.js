import { GoogleGenerativeAI } from "@google/generative-ai";
import { operatorApi } from '../services/operatorApi';
import { useAppStore } from '../store/appStore';

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

let tutorSession = null;
let roleplaySession = null;

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_SCRIPTS = {
    start: (name) => `안녕하세요! 매장 디스플레이를 보고 들어왔는데, 새로 나온 TV 모델들 좀 볼 수 있을까요? 제가 요즘 넷플릭스를 많이 봐서 화질 좋은 걸로 찾고 있어요.`,
    responses: [
        `음, 넷플릭스를 주로 보긴 하는데, 가끔 주말에 축구 경기도 봐요. 그래서 잔상 없이 깔끔하게 나오는 게 중요할 것 같아요. 어떤 모델이 좋을까요?`,
        `OLED가 화질이 좋다는 건 들어봤는데, 가격이 좀 비싸지 않나요? QNED랑 비교하면 어떤 점이 더 나은지 궁금해요.`,
        `아, 그렇군요! OLED가 확실히 검은색 표현이 좋아서 영화 볼 때 몰입감이 좋겠네요. 번인 현상은 요즘 어떤가요? 걱정 안 해도 될까요?`,
        `설명 들어보니 안심이 되네요. 5년 패널 보증까지 된다니 믿음이 가요. 사이즈는 65인치 정도로 생각하는데, 지금 프로모션 같은 게 있나요?`,
        `가격 조건도 괜찮네요. 사운드바도 같이 하면 할인된다고요? 그럼 같이 견적 한번 뽑아주세요. 바로 결정할게요!`
    ],
    objection: `음... 가격이 생각보다 좀 나가네요. 인터넷 최저가랑 비교해도 경쟁력이 있는 건가요?`,
    closing: `네, 알겠습니다. 설명도 잘 해주시고 혜택도 좋아서 여기서 할게요. 배송은 언제쯤 받을 수 있을까요?`
};
const MOCK_TUTOR_SCRIPTS = {
    fallback: `### 📌 Demo Mode Helper
I am currently in Demo Mode (Offline).

### 🔧 Available Topics
- Try asking about **"OLED vs QNED"**
- Ask about **"Price"** negotiation
- **"Closing"** techniques

---SPEECH---
I am in demo mode. Please ask about OLED, Price, or Closing.`,

    oled: `### 📌 OLED vs QNED Difference
**OLED (Organic Light Emitting Diode)** uses self-lit pixels for perfect black and infinite contrast.
**QNED** combines Quantum Dot and NanoCell technology for rich colors and high brightness with a backlight.

### 🔧 Key Selling Points
- **OLED**: Best for movies, dark rooms, and gaming (fast response).
- **QNED**: Great for bright rooms and vibrant sports viewing.

---SPEECH---
OLED uses self-lit pixels for perfect blacks, while QNED uses Quantum Dot and NanoCell for vibrant colors. OLED is best for movies, QNED for bright rooms.`,

    price: `### 📌 Handling Price Objections
When a customer says it's too expensive:
1. **Acknowledge**: "I understand it's a significant investment."
2. **Value**: Reiterate the long-term benefits (5-year warranty, energy saving).
3. **Breakdown**: "If you use it for 10 years, it's only a cup of coffee a day."

---SPEECH---
Acknowledge the price, then emphasize the long-term value and daily usage cost.`,

    closing: `### 📌 Effective Closing Techniques
- **Alternative Close**: "Would you prefer delivery on Tuesday or Saturday?"
- **Now or Never**: "This promotion ends this weekend."
- **Assumptive Close**: "I'll get the paperwork ready for you."

---SPEECH---
Try offering two delivery dates, or mention the promotion deadline to encourage a decision.`
};

export const aiService = {
    // Initialize or reset AI Tutor session
    initTutor: async (systemInstruction = TRAINER_INSTRUCTION) => {
        const isDemo = useAppStore.getState().isDemoMode;
        if (isDemo) return { demo: true };

        // Persistence check: Reuse existing session to maintain memory
        if (tutorSession) {
            console.log("Resuming existing AI Tutor session");
            return tutorSession;
        }

        console.log("Initializing New AI Tutor Session with model: gemini-2.0-flash");
        const genAI = getGenAI();
        if (!genAI) return null;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction
        });

        tutorSession = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.9,
            },
        });
        return tutorSession;
    },

    // Send message to Gemini
    startRoleplay: async (config, language = 'en') => {
        const isDemo = useAppStore.getState().isDemoMode;

        if (isDemo) {
            console.log("DEMO MODE: Starting Roleplay");
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
            return MOCK_SCRIPTS.start(config.customer.name);
        }

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

            // --- FETCH OPERATOR LOGIC (The "Brain" Connection) ---
            const [rulesRes, stagesRes] = await Promise.all([
                operatorApi.getUpsellRules(),
                operatorApi.getStages()
            ]);

            const allRules = rulesRes.success ? rulesRes.data.rules : [];
            const stages = stagesRes.success ? stagesRes.data.stages : [];

            // Filter Applicable Rules based on Context
            const relevantRules = allRules.filter(rule => {
                // Check Customer Match (Persona or Traits)
                const customerMatch = !rule.customer || (
                    (!rule.customer.personaId || rule.customer.personaId === customer.personaId) &&
                    (!rule.customer.includeTraits || rule.customer.includeTraits.some(t => {
                        const tId = typeof t === 'string' ? t : t.id;
                        // check surface traits
                        return surfaceTraits.includes(tId) || JSON.stringify(hiddenTraits).includes(tId);
                    }))
                );
                // Check Product Match
                const productMatch = !rule.product || (
                    (!rule.product.type || rule.product.type === product.type)
                );
                return customerMatch && productMatch;
            });

            // Format Rules for Prompt
            const ruleInstructions = relevantRules.map(r => {
                const triggers = r.conditions?.map(c => c.description).join(' AND ') || "Salesperson mentions relevant feature";
                const actions = r.actions?.map(a => `Action: ${a.type} (${JSON.stringify(a.params)})`).join(', ');
                const messages = r.messages?.map(m => `Response Line: "${m.template}" (Tone: ${m.tone})`).join('\n');
                return `- TRIGGER: ${triggers}\n  REACTION: ${actions}\n  ${messages}`;
            }).join('\n\n');

            const stageInstructions = stages.map((s, idx) => {
                return `${idx + 1}. ${s.label}: ${s.description}`;
            }).join('\n');


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

            **Logic Engine (Absolute Rules):**
            You MUST conditionaly rules if the situation arises:
            ${ruleInstructions}
            
            **Sales Process Stages (Expected Flow):**
            ${stageInstructions}

            **Your Instructions:**
            1.  **Language:** Speak ONLY in ${targetLang}.
            2.  **Format:** Write ONLY the dialogue. DO NOT use descriptive text like *smiles* or (pauses). Just the spoken words.
            3.  **Tone:** Act natural. Use fillers (um, ah) if appropriate for the personality. Be reactive to the salesperson.
            4.  **Goal:** You are interested but have specific needs and concerns defined by the scenario. You need to be convinced.
            5.  **Opening Line:** Start the conversation with a natural greeting or question based on your situation.
            
            **REALISTIC CONVERSATION FLOW - Very Important:**
            - START with just a greeting or vague reason. DO NOT reveal all your needs upfront.
            - Only reveal deeper concerns and hidden traits when the salesperson asks good questions.
            - Follow the "Logic Engine" rules above strictly when triggers occur.
            - For Level 4-5: Be skeptical and ask for justification. For Level 1-2: Be friendly and quick to warm up.

            **IMPORTANT:** You are NOT the AI Trainer. You are the CUSTOMER. Just roleplay naturally like a real store customer.
            `;

            // Initialize chat session with this persona
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: prompt
            });

            roleplaySession = model.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 2000,
                    temperature: 0.9,
                },
            });

            // Generate first message
            const result = await roleplaySession.sendMessage("Start the roleplay now with the opening line.");
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Error starting roleplay:", error);
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return "⚠️ API Quota Exceeded. Please try again later or wait a moment.";
            }
            throw error;
        }
    },

    analyzeInteraction: async (lastUserMessage, conversationHistory, config, language = 'en') => {
        const isDemo = useAppStore.getState().isDemoMode;

        if (isDemo) {
            // Simple mock analysis logic based on turn count
            const turn = conversationHistory.length;
            let nextStep = 'greeting';
            if (turn > 2) nextStep = 'needs';
            if (turn > 6) nextStep = 'proposal';
            if (turn > 10) nextStep = 'closing';

            return {
                nextStep,
                discoveredTrait: turn === 4 ? config.customer.traits[0]?.id : null,
                objectionDetected: false,
                objectionHint: null
            };
        }

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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return { nextStep: null, discoveredTrait: null, objectionDetected: false, objectionHint: null, error: 'QUOTA_EXCEEDED' };
            }
            return { nextStep: null, discoveredTrait: null, objectionDetected: false, objectionHint: null };
        }
    },

    sendMessage: async (message, language = 'ko', isRoleplay = false, conversationHistory = null) => {
        const isDemo = useAppStore.getState().isDemoMode;

        if (!API_KEY && !isDemo) {
            console.error("Gemini API Key is missing!");
            return { text: "시스템 오류: API 키가 설정되지 않았습니다.", speech: "API 키 오류가 발생했습니다." };
        }

        if (isDemo) {
            // Mock Response Logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isRoleplay) {
                const turn = conversationHistory ? conversationHistory.length : 0;
                const mockIndex = Math.floor(turn / 2) % MOCK_SCRIPTS.responses.length;
                const mockResponse = MOCK_SCRIPTS.responses[mockIndex] || MOCK_SCRIPTS.closing;
                return { text: mockResponse, speech: mockResponse };
            } else {
                // Tutor Logic (Keyword Matching)
                const lowerMsg = message.toLowerCase();
                let mockResponse = MOCK_TUTOR_SCRIPTS.fallback;

                if (lowerMsg.includes('oled') || lowerMsg.includes('qned')) mockResponse = MOCK_TUTOR_SCRIPTS.oled;
                else if (lowerMsg.includes('price') || lowerMsg.includes('expensive') || lowerMsg.includes('cost') || lowerMsg.includes('비싸')) mockResponse = MOCK_TUTOR_SCRIPTS.price;
                else if (lowerMsg.includes('close') || lowerMsg.includes('closing') || lowerMsg.includes('마무리')) mockResponse = MOCK_TUTOR_SCRIPTS.closing;

                const parts = mockResponse.split('---SPEECH---');
                return { text: parts[0].trim(), speech: parts[1] ? parts[1].trim() : parts[0].trim() };
            }
        }

        let activeSession = isRoleplay ? roleplaySession : tutorSession;

        if (!activeSession) {
            if (isRoleplay) {
                console.error("Roleplay session missing during sendMessage");
                return { text: "⚠️ Session Error: Please restart the Sales Lab.", speech: "Session error." };
            }
            // For Tutor, auto-recover
            activeSession = await aiService.initTutor(TRAINER_INSTRUCTION);
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
            const result = await activeSession.sendMessage(message + langInstruction + roleplayInstruction);
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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return { text: "⚠️ AI 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요. (429 Quota Exceeded)", speech: "사용량이 초과되었습니다. 잠시 기다려주세요.", error: 'QUOTA_EXCEEDED' };
            }
            return { text: "오류가 발생했습니다.", speech: "오류가 발생했습니다." };
        }
    },

    sendMessageStream: async (message, language = 'ko', isRoleplay = false, onChunk, conversationHistory = null) => {
        const isDemo = useAppStore.getState().isDemoMode;

        if (isDemo) {
            // Mock Stream Logic
            await new Promise(resolve => setTimeout(resolve, 800));
            let mockResponse = "";
            let speechText = "";

            if (isRoleplay) {
                const turn = conversationHistory ? conversationHistory.length : 0;
                const mockIndex = Math.floor(turn / 2) % MOCK_SCRIPTS.responses.length;
                const rawResponse = MOCK_SCRIPTS.responses[mockIndex] || MOCK_SCRIPTS.closing;
                mockResponse = rawResponse;
                speechText = rawResponse;
            } else {
                // Tutor Logic
                const lowerMsg = message.toLowerCase();
                let rawResponse = MOCK_TUTOR_SCRIPTS.fallback;

                if (lowerMsg.includes('oled') || lowerMsg.includes('qned')) rawResponse = MOCK_TUTOR_SCRIPTS.oled;
                else if (lowerMsg.includes('price') || lowerMsg.includes('expensive') || lowerMsg.includes('cost') || lowerMsg.includes('비싸')) rawResponse = MOCK_TUTOR_SCRIPTS.price;
                else if (lowerMsg.includes('close') || lowerMsg.includes('closing') || lowerMsg.includes('마무리')) rawResponse = MOCK_TUTOR_SCRIPTS.closing;

                const parts = rawResponse.split('---SPEECH---');
                mockResponse = parts[0].trim();
                speechText = parts[1] ? parts[1].trim() : parts[0].trim();
            }

            // Simulate streaming
            const chars = mockResponse.split('');
            for (let i = 0; i < chars.length; i += 3) {
                const chunk = chars.slice(i, i + 3).join('');
                onChunk(chunk);
                await new Promise(r => setTimeout(r, 20));
            }
            return { text: mockResponse, speech: speechText };
        }

        if (!API_KEY) {
            console.error("Gemini API Key is missing!");
            onChunk("시스템 오류: API 키가 설정되지 않았습니다.");
            return { text: "시스템 오류: API 키가 설정되지 않았습니다.", speech: "API 키 오류가 발생했습니다." };
        }

        let activeSession = isRoleplay ? roleplaySession : tutorSession;

        if (!activeSession) {
            if (isRoleplay) {
                const msg = "⚠️ Session Error: Please restart the activity.";
                onChunk(msg);
                return { text: msg, speech: "" };
            }
            activeSession = await aiService.initTutor(TRAINER_INSTRUCTION);
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
            const result = await activeSession.sendMessageStream(message + langInstruction + roleplayInstruction);

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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                const msg = "⚠️ AI 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
                onChunk(msg);
                return { text: msg, speech: "", error: 'QUOTA_EXCEEDED' };
            }
            return { text: "오류가 발생했습니다.", speech: "오류가 발생했습니다." };
        }
    },

    generateDailyMission: async (userHistory, language = 'ko') => {
        const isDemo = useAppStore.getState().isDemoMode;
        if (isDemo) {
            return {
                title: "[Demo] Daily Warmup",
                description: "Complete 1 Roleplay Session (Demo Mode)",
                target: 1,
                reward: "Demo Badge",
                type: "roleplay"
            };
        }

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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return { error: 'QUOTA_EXCEEDED', title: "Quota Exceeded", description: "Please wait a moment." };
            }
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
        const isDemo = useAppStore.getState().isDemoMode;
        if (isDemo) {
            return {
                totalScore: 92,
                rank: "Top 10%",
                summary: "[Demo] Excellent performance! You followed the sales process perfectly and handled customer inquiries with great product knowledge.",
                pros: ["Clear product explanation", "Good empathy", "Proper use of demo mode script"],
                improvements: ["Try asking more open-ended questions next time"],
                practiceSentence: "How does this feature match your daily usage?",
                recommendedMission: {
                    title: "Advanced Negotiation (Demo)",
                    xp: 100,
                    type: "Roleplay"
                },
                scores: [
                    { "subject": "Product Knowledge", "A": 95 },
                    { "subject": "Objection Handling", "A": 88 },
                    { "subject": "Empathy", "A": 92 },
                    { "subject": "Policy", "A": 90 },
                    { "subject": "Conversation", "A": 95 }
                ]
            };
        }

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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return { error: 'QUOTA_EXCEEDED', summary: "⚠️ AI 사용량 초과로 분석할 수 없습니다." };
            }
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
        const isDemo = useAppStore.getState().isDemoMode;
        if (isDemo) {
            return {
                course: {
                    id: "demo_course",
                    title: "Demo Course: OLED TVs",
                    category: "Product",
                    level: "Beginner",
                    duration: "5 min",
                    modules: [
                        { id: "m1", title: "What is OLED?", content: [{ type: "text", heading: "Definition", body: "Organic Light Emitting Diode" }] },
                        { id: "m2", title: "Benefits", content: [{ type: "list", heading: "Key Pros", items: ["Perfect Black", "Infinite Contrast"] }] }
                    ]
                },
                quiz: [
                    { id: 1, question: { en: "What does OLED stand for?", ko: "OLED의 약자는?" }, options: [{ id: "a", text: { en: "Organic Light Emitting Diode", ko: "Organic Light Emitting Diode" }, correct: true }, { id: "b", text: { en: "Old Light", ko: "오래된 빛" }, correct: false }] }
                ],
                faq: [
                    { category: "Product", question: { en: "Is OLED bright?", ko: "OLED는 밝나요?" }, answer: { en: "Yes, modern OLEDs are very bright.", ko: "네, 최신 OLED는 매우 밝습니다." } }
                ]
            };
        }

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
            if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
                return { error: 'QUOTA_EXCEEDED' };
            }
            return null;
        }
    }
};
