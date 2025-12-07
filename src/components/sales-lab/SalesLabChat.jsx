import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlocker, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, ArrowLeft, Sparkles, X, Lightbulb, ChevronRight, CheckCircle2, Circle, PlayCircle, StopCircle, Save, LogOut } from 'lucide-react';
import { aiService } from '../../lib/gemini';
import ChatMessage from './ChatMessage';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import { MotionCard } from '../ui/modern/MotionCard';
import { PulseButton } from '../ui/modern/PulseButton';
import { VoiceVisualizer } from './VoiceVisualizer';

const SALES_STEPS = [
    { id: 'greeting', label: 'Greeting', fullLabel: 'Greeting & Rapport' },
    { id: 'needs', label: 'Needs', fullLabel: 'Needs Analysis' },
    { id: 'proposal', label: 'Proposal', fullLabel: 'Value Proposition' },
    { id: 'objection', label: 'Objection', fullLabel: 'Objection Handling' },
    { id: 'closing', label: 'Closing', fullLabel: 'Closing' }
];

const SalesLabChat = ({ config, onEnd, initialState }) => {
    const { language } = useAppStore();
    const [messages, setMessages] = useState(initialState?.messages || []);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(initialState?.currentStep || 'greeting');
    const [discoveredTraits, setDiscoveredTraits] = useState(initialState?.discoveredTraits || []);
    const [objectionHint, setObjectionHint] = useState(initialState?.objectionHint || null);
    const [showGuide, setShowGuide] = useState(true);
    const [streamingText, setStreamingText] = useState('');
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [isSessionEnded, setIsSessionEnded] = useState(false);
    const [showResultButton, setShowResultButton] = useState(false);
    const [voices, setVoices] = useState([]);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

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

    // Translations
    const t = {
        en: {
            common: { loading: "Processing...", error: "An error occurred." },
            lab: {
                title: "Sales Roleplay Lab",
                guide: "Strategy Guide",
                inputPlaceholder: "Type your response...",
                listening: "Listening...",
                stageStrategy: "Current Strategy",
                objectionHint: "Objection Tip",
                sellingPoints: "Selling Points",
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
                guide: "전략 가이드",
                inputPlaceholder: "답변을 입력하세요...",
                listening: "듣고 있습니다...",
                stageStrategy: "현재 단계 전략",
                objectionHint: "거절 처리 팁",
                sellingPoints: "핵심 판매 포인트",
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
            guide: "Strategy Guide",
            inputPlaceholder: "Type your response...",
            listening: "Listening...",
            stageStrategy: "Current Strategy",
            objectionHint: "Objection Tip",
            sellingPoints: "Selling Points",
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
        setObjectionHint(null);

        try {
            aiService.analyzeInteraction(textToSend, messages, config, language).then(analysis => {
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
                true,
                (chunk) => setStreamingText(prev => prev + chunk),
                messages
            );

            setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
            setStreamingText('');
            speakText(response.speech);

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
    }, [config, currentStep, discoveredTraits, input, isAutoMode, isProcessing, isSessionEnded, language, messages, speakText, startListening, stopListening, t.common.error]);

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

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const currentStepIndex = SALES_STEPS.findIndex(s => s.id === currentStep);

    return (
        <div className="h-full flex flex-col relative overflow-hidden font-sans text-slate-800 bg-slate-50">
            {/* Header: Arena HUD - Light Mode */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 sticky top-0 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={handleExitAttempt} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
                                    <Sparkles size={18} className="text-primary" />
                                    {tLab.title}
                                </h2>
                                <p className="text-xs text-slate-500 font-medium flex gap-2">
                                    <span className="text-slate-700 font-bold">{config.product.name}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-primary">{config.customer.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowGuide(!showGuide)}
                                className={clsx(
                                    "p-2.5 rounded-xl transition-all relative border",
                                    showGuide
                                        ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                )}
                            >
                                <Lightbulb size={20} />
                                {!showGuide && objectionHint && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar (HUD Style) */}
                    <div className="relative pt-2 pb-1">
                        <div className="flex items-center justify-between relative z-10">
                            {SALES_STEPS.map((step, index) => {
                                const isActive = index === currentStepIndex;
                                const isCompleted = index < currentStepIndex;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 relative group">
                                        <div
                                            className={clsx(
                                                "w-3 h-3 rounded-full transition-all duration-300 relative z-10 box-content border-2",
                                                isActive ? "bg-white border-primary shadow-lg scale-125" :
                                                    isCompleted ? "bg-primary border-primary" : "bg-slate-200 border-slate-300"
                                            )}
                                        />
                                        <span className={clsx(
                                            "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 absolute top-5 w-24 text-center select-none",
                                            isActive ? "text-primary opacity-100" :
                                                isCompleted ? "text-slate-500" : "text-slate-300"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Connecting Line */}
                        <div className="absolute top-[5px] left-0 w-full h-[2px] bg-slate-200 -z-0 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStepIndex / (SALES_STEPS.length - 1)) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Arena */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative z-0 min-w-0">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth pb-32 md:pb-40 overscroll-contain">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} message={msg} />
                            ))}
                            {streamingText && <ChatMessage message={{ role: 'ai', text: streamingText }} isStreaming />}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>

                    {/* Floating Input Control Deck */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white/95 to-transparent pt-20 z-20">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col gap-3">
                                {messages.length > 2 && !isSessionEnded && (
                                    <button
                                        onClick={handleEndSession}
                                        disabled={isProcessing}
                                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest rounded-lg transition-all border border-slate-200 shadow-sm"
                                    >
                                        End Session & Evaluate
                                    </button>
                                )}

                                <MotionCard className="!bg-white !backdrop-blur-xl !border-slate-200 p-2 flex items-center gap-3 !rounded-2xl shadow-xl shadow-slate-200/50 overflow-visible" glass={false}>
                                    {/* Auto / Mic Toggle */}
                                    <button
                                        onClick={toggleListening}
                                        className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                                            isAutoMode
                                                ? isListening ? "bg-red-50 text-red-500 ring-1 ring-red-200" : "bg-indigo-50 text-primary"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                                        )}
                                    >
                                        {isAutoMode ? (
                                            isListening ? (
                                                <div className="relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <MicOff size={20} className="relative z-10" />
                                                </div>
                                            ) : <MicOff size={20} />
                                        ) : <Mic size={20} />}
                                    </button>

                                    {/* Dynamic Input / Visualizer Area */}
                                    <div className="flex-1 relative h-12 flex items-center">
                                        <AnimatePresence mode="wait">
                                            {isListening && isAutoMode ? (
                                                <motion.div
                                                    key="visualizer"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="w-full flex items-center justify-center"
                                                >
                                                    <VoiceVisualizer isActive={true} color="#4F46E5" />
                                                </motion.div>
                                            ) : (
                                                <motion.input
                                                    key="text-input"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
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
                                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium"
                                                    disabled={isProcessing || isSessionEnded}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Send Button */}
                                    <PulseButton
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isProcessing || isSessionEnded}
                                        className="w-12 h-12 !p-0 !rounded-xl"
                                        pulse={input.trim().length > 0}
                                    >
                                        <Send size={20} />
                                    </PulseButton>
                                </MotionCard>
                            </div>
                            <div className="text-center mt-3 h-4">
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                    {isAutoMode ? "Voice Mode Active" : "Text Mode Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy Panel (Desktop) - Light Mode */}
                <AnimatePresence mode="wait">
                    {showGuide && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 340, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden xl:flex border-l border-slate-200 bg-white/60 backdrop-blur-xl flex-col z-10"
                        >
                            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Lightbulb size={16} className="text-amber-500" />
                                    {tLab.guide}
                                </h3>
                                <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                                {/* Current Strategy */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tLab.stageStrategy}</h4>
                                    <MotionCard className="!bg-indigo-50 !border-indigo-100 text-sm text-indigo-800 leading-relaxed p-4" glass={false}>
                                        {tLab.strategies[currentStep]}
                                    </MotionCard>
                                </div>

                                {/* Objection Hint */}
                                <AnimatePresence>
                                    {objectionHint && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3"
                                        >
                                            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={12} /> {tLab.objectionHint}
                                            </h4>
                                            <MotionCard className="!bg-red-50 !border-red-100 text-sm text-red-600 leading-relaxed p-4" glass={false}>
                                                {objectionHint}
                                            </MotionCard>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Selling Points */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tLab.sellingPoints}</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-3 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>AI Processor Alpha 11</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals (Session End, Loading, etc.) - Light Mode */}
            <AnimatePresence>
                {/* Simplified Loading Overlay */}
                {!voicesLoaded && (
                    <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-slate-900">Initializing Neural Voice...</h2>
                    </div>
                )}

                {/* Exit Warning Modal */}
                {showExitWarning && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <X size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Exit Roleplay?</h3>
                            <p className="text-slate-500 mb-6 text-sm">
                                If you leave now, your progress and evaluation data will be lost. Are you sure?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSaveAndExit}
                                    className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Save & Exit
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="w-full px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} /> Exit without Saving
                                </button>
                                <button
                                    onClick={cancelExit}
                                    className="w-full px-4 py-3 text-slate-500 font-medium hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Save & Exit Prompt Modal (Navigation Block) */}
                {showSavePrompt && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Save size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Save Progress?</h3>
                            <p className="text-slate-500 mb-6 text-sm">
                                Do you want to save your current session before leaving? You can resume it later.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSaveAndExit}
                                    className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Save & Exit
                                </button>
                                <button
                                    onClick={handleExitWithoutSave}
                                    className="w-full px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} /> Exit without Saving
                                </button>
                                <button
                                    onClick={handleCancelNavigation}
                                    className="w-full px-4 py-3 text-slate-500 font-medium hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Session End Modal */}
                {isSessionEnded && !showResultButton && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 relative">
                                <span className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
                                <CheckCircle2 size={40} />
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-2">Roleplay Complete!</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Great job! The customer has reached a satisfactory conclusion. Ready to see your performance analysis?
                            </p>

                            <PulseButton
                                onClick={handleEndSession}
                                className="w-full py-4 text-lg font-bold shadow-xl shadow-primary/25"
                            >
                                View Analysis
                            </PulseButton>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesLabChat;
