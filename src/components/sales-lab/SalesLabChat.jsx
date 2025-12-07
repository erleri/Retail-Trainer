import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlocker, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, ArrowLeft, Sparkles, X, Lightbulb, ChevronRight, CheckCircle2, Circle, PlayCircle, StopCircle, Save, LogOut, Target, ShieldAlert, Award, Zap, Brain, MessageSquare, ThumbsUp } from 'lucide-react';
import { aiService } from '../../lib/gemini';
import ChatMessage from './ChatMessage';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import { MotionCard } from '../ui/modern/MotionCard';
import { PulseButton } from '../ui/modern/PulseButton';
import { VoiceVisualizer } from './VoiceVisualizer';

const SALES_STEPS = [
    { id: 'greeting', label: 'Greeting', fullLabel: 'Greeting & Rapport', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'needs', label: 'Needs Analysis', fullLabel: 'Needs Analysis', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'proposal', label: 'Proposal', fullLabel: 'Value Proposition', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'objection', label: 'Objection', fullLabel: 'Objection Handling', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'closing', label: 'Closing', fullLabel: 'Closing', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' }
];

const SalesLabChat = ({ config, onEnd, initialState }) => {
    const { language, isDemoMode } = useAppStore();
    const [messages, setMessages] = useState(initialState?.messages || []);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(initialState?.currentStep || 'greeting');
    const [discoveredTraits, setDiscoveredTraits] = useState(initialState?.discoveredTraits || []);
    const [objectionHint, setObjectionHint] = useState(initialState?.objectionHint || null);
    const [solvedObjections, setSolvedObjections] = useState(initialState?.solvedObjections || []);
    const [showGuide, setShowGuide] = useState(true);
    const [streamingText, setStreamingText] = useState('');
    const [isAutoMode, setIsAutoMode] = useState(isDemoMode);
    const [isSessionEnded, setIsSessionEnded] = useState(false);
    const [showResultButton, setShowResultButton] = useState(false);
    const [voices, setVoices] = useState([]);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);

    // Rich Selling Points (Mock or Dynamic)
    const sellingPoints = [
        "AI Processor Alpha 11 - Optimizes picture and sound",
        "Brightness Booster Max - 70% brigher than standard OLED",
        "One Wall Design - Flush fit mounting",
        "webOS 24 - Personalized user profiles",
        "5-Year Panel Warranty - Peace of mind"
    ];

    const navigate = useNavigate();

    // Blocker to intercept navigation
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            !isSessionEnded && messages.length > 0 && currentLocation.pathname !== nextLocation.pathname
    );

    const messagesEndRef = useRef(null);
    const inputRef = useRef('');
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const chatContainerRef = useRef(null); // For auto-scroll

    // Translations
    const t = {
        en: {
            common: { loading: "Processing...", error: "An error occurred." },
            lab: {
                title: "Sales Roleplay Lab",
                guide: "Tactical HUD",
                inputPlaceholder: "Type your response...",
                listening: "Listening...",
                stageStrategy: "Current Phase",
                objectionHint: "Objection Detected",
                solvedObjections: "Resolved Objections",
                sellingPoints: "Key Selling Points",
                demoMode: "DEMO MODE",
                strategies: {
                    greeting: "Build rapport and introduce yourself professionally.",
                    needs: "Ask open-ended questions to understand customer needs.",
                    proposal: "Present the product benefits tailored to their needs.",
                    objection: "Empathize, Clarify, and Address the concern.",
                    closing: "Summarize benefits and ask for the sale."
                }
            }
        },
        ko: {
            common: { loading: "처리 중...", error: "오류가 발생했습니다." },
            lab: {
                title: "세일즈 롤플레이 랩",
                guide: "전술 HUD",
                inputPlaceholder: "답변을 입력하세요...",
                listening: "듣고 있습니다...",
                stageStrategy: "현재 진행 단계",
                objectionHint: "거절 신호 감지",
                solvedObjections: "해결된 거절/질문",
                sellingPoints: "핵심 판매 포인트",
                demoMode: "체험 모드",
                strategies: {
                    greeting: "라포를 형성하고 전문적으로 자신을 소개하세요.",
                    needs: "개방형 질문으로 고객의 니즈를 파악하세요.",
                    proposal: "니즈에 맞춰 제품의 혜택을 제안하세요.",
                    objection: "공감하고, 명확히 하고, 우려를 해소하세요.",
                    closing: "혜택을 요약하고 구매를 권유하세요."
                }
            }
        }
    }[language] || {
        common: { loading: "Processing...", error: "An error occurred." },
        lab: {
            title: "Sales Roleplay Lab",
            guide: "Tactical HUD",
            inputPlaceholder: "Type your response...",
            listening: "Listening...",
            stageStrategy: "Current Phase",
            objectionHint: "Objection Detected",
            solvedObjections: "Resolved Objections",
            sellingPoints: "Key Selling Points",
            demoMode: "DEMO MODE",
            strategies: {
                greeting: "Build rapport and introduce yourself professionally.",
                needs: "Ask open-ended questions to understand customer needs.",
                proposal: "Present the product benefits tailored to their needs.",
                objection: "Empathize, Clarify, and Address the concern.",
                closing: "Summarize benefits and ask for the sale."
            }
        }
    };

    const tLab = t.lab;

    // Load Voices
    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) {
                setVoices(available);
                setVoicesLoaded(true);
            }
        };

        loadVoices();

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        const timeoutId = setTimeout(() => {
            setVoicesLoaded(prev => {
                if (!prev) {
                    console.warn("Voices loading timed out, proceeding with default.");
                    return true;
                }
                return prev;
            });
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) { /* Already started */ }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    useEffect(() => {
        if (blocker.state === "blocked") {
            window.speechSynthesis.cancel();
            stopListening();
            setShowSavePrompt(true);
        }
    }, [blocker.state, stopListening]);

    const speakText = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        const langMap = { 'en': 'en-US', 'ko': 'ko-KR', 'es': 'es-ES', 'pt-br': 'pt-BR' };
        const targetLangCode = isKorean ? 'ko-KR' : (langMap[language] || 'en-US');
        utterance.lang = targetLangCode;

        const gender = config.customer.gender?.toLowerCase() || 'male';
        const age = config.customer.age;

        let selectedVoice = null;
        const voiceLangSearch = isKorean ? 'ko' : (language === 'pt-br' ? 'pt' : language);
        const languageVoices = voices.filter(v => v.lang.toLowerCase().includes(voiceLangSearch));

        if (languageVoices.length > 0) {
            selectedVoice = languageVoices.find(v =>
                v.name.toLowerCase().includes(gender) &&
                (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Neural'))
            );

            if (!selectedVoice) {
                selectedVoice = languageVoices.find(v => v.name.toLowerCase().includes(gender));
            }

            if (!selectedVoice) {
                selectedVoice = languageVoices.find(v =>
                    (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Neural'))
                );
            }

            if (!selectedVoice) selectedVoice = languageVoices[0];
        }

        if (age === '60s+') { utterance.rate = 0.85; utterance.pitch = 0.9; }
        else if (age === '20s') { utterance.rate = 1.1; utterance.pitch = 1.0; }
        else { utterance.rate = 1.0; utterance.pitch = 1.0; }

        if (selectedVoice) utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
    }, [config.customer.age, config.customer.gender, language, voices]);

    const handleSend = useCallback(async (isAuto = false) => {
        const textToSend = isAuto ? inputRef.current : input;
        if (!textToSend.trim() || isProcessing || isSessionEnded) return;

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        stopListening();
        window.speechSynthesis.cancel();

        const userMessage = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        inputRef.current = '';
        setIsProcessing(true);
        setStreamingText('');

        // Logic for Objection Resolution (Simulated/Heuristic)
        if (objectionHint && textToSend.length > 10) {
            // If there was a hint and user replied (mocking successful resolution for demo effect)
            // In real app, AI analysis would return 'objection_resolved' flag
            setTimeout(() => {
                setSolvedObjections(prev => [...prev, objectionHint]);
                setObjectionHint(null);
            }, 1500);
        } else {
            setObjectionHint(null); // Clear hint on new turn anyway
        }

        try {
            // Check Demo Mode
            const analysisPromise = aiService.analyzeInteraction(textToSend, messages, config, language);

            analysisPromise.then(analysis => {
                if (analysis.error === 'QUOTA_EXCEEDED') return;
                if (analysis.nextStep && SALES_STEPS.findIndex(s => s.id === analysis.nextStep) > SALES_STEPS.findIndex(s => s.id === currentStep)) {
                    setCurrentStep(analysis.nextStep);
                }
                if (analysis.discoveredTrait) {
                    const trait = config.customer.traits.find(t => t.id === analysis.discoveredTrait);
                    if (trait && !discoveredTraits.includes(trait.id)) setDiscoveredTraits(prev => [...prev, trait.id]);
                }
                if (analysis.objectionDetected) setObjectionHint(analysis.objectionHint);
            });

            const response = await aiService.sendMessageStream(
                textToSend,
                language,
                !isDemoMode, // Use steam only if not demo
                (chunk) => setStreamingText(prev => prev + chunk),
                messages
            );

            // In demo mode, stream is instantaneous or simulated, so we might need to set msg here
            if (isDemoMode) {
                setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
                speakText(response.text);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
                setStreamingText('');
                speakText(response.speech);
            }

            const lowerResponse = response.text.toLowerCase();
            const endKeywords = {
                en: ['goodbye', 'bye', 'see you', 'take care', 'have a nice day', 'farewell', 'see ya', 'catch you'],
                ko: ['안녕', '안녕히', '가볼게요', '다음에', '잘 가세요', '뵙겠습니다', '안녕히 가세요', '그럼 이만'],
                es: ['adiós', 'bye', 'hasta luego', 'nos vemos', 'que te vaya bien', 'chao'],
                pt: ['tchau', 'adeus', 'até logo', 'até breve', 'falou', 'até mais']
            };

            const langKeywords = endKeywords[language] || [...endKeywords.en, ...endKeywords.ko];
            const isEnding = langKeywords.some(k => lowerResponse.includes(k.toLowerCase()));

            const closingKeywords = {
                en: ['perfect', 'great', 'sounds good', 'i\'ll take it', 'let\'s do it', 'count me in', 'deal', 'yes please', 'absolutely'],
                ko: ['좋습니다', '괜찮습니다', '그렇게', '진행', '괜찮아요', '됐어요', '네 좋습니다', '그럴게요'],
                es: ['perfecto', 'está bien', 'me lo llevo', 'de acuerdo', 'claro'],
                pt: ['perfeito', 'tá bom', 'vou levar', 'combinado', 'claro']
            };

            const closingLangKeywords = closingKeywords[language] || [...closingKeywords.en, ...closingKeywords.ko];
            const isClosing = closingLangKeywords.some(k => lowerResponse.includes(k.toLowerCase()));

            if (isEnding || (isClosing && currentStep === 'closing') || messages.length >= 40) {
                console.log("Session ending triggered:", { isEnding, isClosing, currentStep, messageCount: messages.length });
                setIsSessionEnded(true);
                setIsAutoMode(false);
            }

        } catch (error) {
            console.error("Error in chat loop:", error);
            setMessages(prev => [...prev, { role: 'ai', text: t.common.error }]);
        } finally {
            setIsProcessing(false);
            if (isAutoMode && !isSessionEnded) setTimeout(() => startListening(), 500);
        }
    }, [config, currentStep, discoveredTraits, input, isAutoMode, isProcessing, isSessionEnded, language, messages, speakText, startListening, stopListening, t.common.error, isDemoMode, objectionHint]);

    const resetSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            handleSend(true);
        }, 2000);
    }, [handleSend]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            setIsAutoMode(false);
        } else {
            setIsAutoMode(true);
            startListening();
        }
    };

    const handleEndSession = async () => {
        setIsProcessing(true);
        try {
            const feedback = await aiService.generateFeedback(messages, language);
            if (!feedback) throw new Error("Empty feedback received");
            onEnd(feedback);
        } catch (error) {
            console.error("Failed to generate feedback:", error);
            onEnd({ totalScore: 75, summary: "Feedback generation failed.", scores: [] });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language === 'en' ? 'en-US' : (language === 'ko' ? 'ko-KR' : (language === 'es' ? 'es-ES' : 'pt-BR'));

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
                    else interimTranscript += event.results[i][0].transcript;
                }
                if (finalTranscript) {
                    setInput(prev => {
                        const newVal = prev + finalTranscript + ' ';
                        inputRef.current = newVal;
                        return newVal;
                    });
                    if (isAutoMode) resetSilenceTimer();
                } else if (interimTranscript) {
                    if (isAutoMode) resetSilenceTimer();
                }
            };
            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        }
    }, [isAutoMode, isProcessing, language, isSessionEnded, resetSilenceTimer]);

    useEffect(() => { inputRef.current = input; }, [input]);

    useEffect(() => {
        if (isAutoMode && !isProcessing && !isListening && !isSessionEnded) startListening();
        else if ((!isAutoMode || isSessionEnded) && isListening) stopListening();
    }, [isAutoMode, isProcessing, isSessionEnded, startListening, stopListening, isListening]);

    useEffect(() => {
        if (!voicesLoaded) return;
        if (messages.length > 0 || initialState) return;

        const initChat = async () => {
            setIsProcessing(true);
            try {
                const initialMessage = await aiService.startRoleplay(config, language);
                setMessages([{ role: 'ai', text: initialMessage }]);
                speakText(initialMessage);
            } catch (error) {
                console.error("Failed to start roleplay:", error);
                setMessages([{ role: 'ai', text: t.common.error }]);
            } finally {
                setIsProcessing(false);
            }
        };
        initChat();
    }, [voicesLoaded]);

    const handleExitAttempt = () => {
        window.speechSynthesis.cancel();
        stopListening();
        setShowExitWarning(true);
    };

    const confirmExit = () => {
        onEnd(null);
    };

    const cancelExit = () => {
        setShowExitWarning(false);
    };

    const handleSaveAndExit = () => {
        const sessionData = {
            messages,
            currentStep,
            config,
            discoveredTraits,
            objectionHint,
            solvedObjections,
            timestamp: Date.now()
        };
        localStorage.setItem('salesLab_savedSession', JSON.stringify(sessionData));
        if (blocker.state === "blocked") {
            blocker.proceed();
        } else {
            onEnd(null);
        }
    };

    const handleExitWithoutSave = () => {
        if (blocker.state === "blocked") {
            blocker.proceed();
        } else {
            onEnd(null);
        }
    };

    const handleCancelNavigation = () => {
        if (blocker.state === "blocked") {
            blocker.reset();
        }
        setShowSavePrompt(false);
    };

    // Auto-scroll logic
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, streamingText, solvedObjections]);

    const currentStepIndex = SALES_STEPS.findIndex(s => s.id === currentStep);
    const activeStep = SALES_STEPS[currentStepIndex];

    return (
        <div className="h-full flex flex-col relative overflow-hidden font-sans text-slate-900 bg-white md:rounded-xl md:shadow-sm md:border md:border-slate-200">
            {/* --- TOP HEADER (Prominent Phase Display) --- */}
            <div className="flex-none bg-white border-b border-slate-100 z-20">
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={handleExitAttempt} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                {config.product.name}
                                {isDemoMode && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{tLab.demoMode}</span>}
                            </h2>
                        </div>
                    </div>
                    <button onClick={() => setShowGuide(!showGuide)} className={clsx("p-2 rounded-lg transition-all md:hidden", showGuide ? "bg-indigo-50 text-priority" : "text-slate-400")}>
                        <Brain size={20} />
                    </button>
                </div>

                {/* Visual Phase Progress Bar */}
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-2">
                        {SALES_STEPS.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isPast = SALES_STEPS.findIndex(s => s.id === currentStep) > idx;
                            return (
                                <div key={step.id} className="flex-1">
                                    <div className={clsx("h-1.5 rounded-full mb-2 transition-all duration-500", isActive ? "bg-primary" : (isPast ? "bg-indigo-200" : "bg-slate-100"))} />
                                    <div className={clsx("text-[10px] font-bold uppercase transition-colors text-center hidden sm:block", isActive ? "text-primary" : "text-slate-300")}>
                                        {step.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-2 text-center md:hidden">
                        <span className="text-xs font-bold text-primary">{activeStep.label}</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN COCKPIT BODY --- */}
            <div className="flex-1 flex overflow-hidden">

                {/* 1. LEFT: COMMUNICATION ZONE (Flex Column for Fixed Bottom) */}
                <div className="flex-1 flex flex-col relative min-w-0 bg-slate-50/50">

                    {/* Chat Stream (Flex Grow) */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                        {streamingText && <ChatMessage message={{ role: 'ai', text: streamingText }} isStreaming />}
                        {/* Spacer for bottom */}
                        <div className="h-4" />
                    </div>

                    {/* Fixed Input Footer (No absolute positioning) */}
                    <div className="flex-none p-4 md:p-6 bg-white border-t border-slate-200">
                        <div className="max-w-3xl mx-auto flex items-end gap-3">
                            {/* Actions Menu (End) */}
                            {messages.length > 2 && !isSessionEnded && (
                                <button onClick={handleEndSession} disabled={isProcessing} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 rounded-xl transition-colors" title="End Session">
                                    <LogOut size={20} />
                                </button>
                            )}

                            {/* Main Input Bar */}
                            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 hover:border-slate-300 transition-all rounded-2xl p-2 flex items-center gap-3 relative">
                                {/* Mic Toggle */}
                                <button
                                    onClick={toggleListening}
                                    className={clsx(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                                        isAutoMode
                                            ? isListening ? "bg-red-50 text-red-500 ring-1 ring-red-200" : "bg-indigo-50 text-primary"
                                            : "bg-white text-slate-400 hover:bg-slate-100 shadow-sm border border-slate-200"
                                    )}
                                >
                                    {isAutoMode ? (isListening ? <MicOff size={18} className="animate-pulse" /> : <MicOff size={18} />) : <Mic size={18} />}
                                </button>

                                {/* Input Field / Visualizer */}
                                <div className="flex-1 relative h-10 flex items-center overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {isListening && isAutoMode ? (
                                            <motion.div
                                                key="visualizer"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full flex items-center gap-2"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listening...</span>
                                                <VoiceVisualizer isActive={true} color="#EF4444" />
                                            </motion.div>
                                        ) : (
                                            <input
                                                key="text-input"
                                                type="text"
                                                ref={inputRef}
                                                value={input}
                                                onChange={(e) => {
                                                    setInput(e.target.value);
                                                    if (isAutoMode && e.target.value.trim()) {
                                                        setIsAutoMode(false);
                                                        stopListening();
                                                    }
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                placeholder={tLab.inputPlaceholder}
                                                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium text-sm p-0"
                                                disabled={isProcessing || isSessionEnded}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Send Button */}
                                <PulseButton
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isProcessing || isSessionEnded}
                                    className="w-10 h-10 !p-0 !rounded-xl flex-shrink-0 shadow-sm"
                                    pulse={input.trim().length > 0}
                                >
                                    <Send size={18} />
                                </PulseButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT: TACTICAL HUD (Collapsible on Mobile) */}
                <AnimatePresence>
                    {showGuide && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden md:flex flex-col border-l border-slate-200 bg-white z-10"
                        >
                            {/* HUD Header */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                                    <Brain size={14} className="text-indigo-500" />
                                    {tLab.guide}
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                {/* Objection Alert (Active) */}
                                <AnimatePresence>
                                    {objectionHint && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-4 rounded-xl bg-red-50 border border-red-100 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                                                <ShieldAlert size={14} /> {tLab.objectionHint}
                                            </div>
                                            <p className="text-sm text-red-800 leading-relaxed font-medium">
                                                {objectionHint}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Solved Objections History (New Feature) */}
                                {solvedObjections.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 size={12} /> {tLab.solvedObjections}
                                        </div>
                                        <div className="space-y-2">
                                            <AnimatePresence>
                                                {solvedObjections.map((obj, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2"
                                                    >
                                                        <ThumbsUp size={12} className="mt-0.5 flex-shrink-0" />
                                                        <span>{obj}</span>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {/* Target Profile Summary */}
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Profile</div>
                                    <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-3 bg-white">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                            {config.customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{config.customer.name}</div>
                                            <div className="text-xs text-slate-500">{config.customer.age} • {config.customer.gender}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {config.customer.traits.map(t => (
                                            <span key={t.id} className={clsx("text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 transition-all", discoveredTraits.includes(t.id) ? "bg-green-50 text-green-700 border-green-200 font-bold" : "opacity-70")}>
                                                {t.label} {discoveredTraits.includes(t.id) && "✓"}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Points (Enriched) */}
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tLab.sellingPoints}</div>
                                    <div className="space-y-2">
                                        {sellingPoints.map((point, idx) => (
                                            <div key={idx} className="flex gap-2 text-xs text-slate-600 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                <CheckCircle2 size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strategy for Phase */}
                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                        {tLab.stageStrategy}
                                    </div>
                                    <div className={clsx("p-4 rounded-xl border text-sm leading-relaxed", activeStep.bg, activeStep.border, activeStep.color)}>
                                        <div className="font-bold mb-1 flex items-center gap-2"><activeStep.icon size={14} /> {activeStep.label}</div>
                                        <div className="opacity-90 text-slate-700">{tLab.strategies[currentStep]}</div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals & Overlays */}
            <AnimatePresence>
                {/* Simplified Loading Overlay */}
                {!voicesLoaded && (
                    <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-slate-900">Initializing Neural Voice...</h2>
                    </div>
                )}

                {/* Exit Warning and Save Modals (Same as before) */}
                {showExitWarning && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><X size={24} /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Exit Roleplay?</h3>
                            <p className="text-slate-500 mb-6 text-sm">Progress will be lost. Save?</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleSaveAndExit} className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2"><Save size={18} /> Save & Exit</button>
                                <button onClick={confirmExit} className="w-full px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"><LogOut size={18} /> Exit without Saving</button>
                                <button onClick={cancelExit} className="w-full px-4 py-3 text-slate-500 font-medium">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {showSavePrompt && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500"><Save size={24} /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Save Progress?</h3>
                            <button onClick={handleSaveAndExit} className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl mt-4">Save & Exit</button>
                            <button onClick={handleExitWithoutSave} className="w-full px-4 py-3 text-red-500 font-bold mt-2">Exit without Saving</button>
                        </motion.div>
                    </div>
                )}

                {/* Session End Modal - View Analysis */}
                {isSessionEnded && !showResultButton && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative overflow-hidden">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"><CheckCircle2 size={40} /></div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Roleplay Complete!</h2>
                            <PulseButton onClick={handleEndSession} className="w-full py-4 text-lg font-bold mt-6 shadow-xl shadow-primary/25">View Analysis</PulseButton>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesLabChat;
