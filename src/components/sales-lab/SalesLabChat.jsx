import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlocker, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, ArrowLeft, Sparkles, X, Lightbulb, ChevronRight, CheckCircle2, Circle, PlayCircle, StopCircle, Save, LogOut } from 'lucide-react';
import { aiService } from '../../lib/gemini';
import ChatMessage from './ChatMessage';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';

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
    // Load Voices with Timeout
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

        // Fallback: If voices don't load within 3 seconds, proceed anyway
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
            // Priority 1: Gender Match + High Quality
            selectedVoice = languageVoices.find(v =>
                v.name.toLowerCase().includes(gender) &&
                (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Neural'))
            );

            // Priority 2: Gender Match (Standard Quality)
            if (!selectedVoice) {
                selectedVoice = languageVoices.find(v => v.name.toLowerCase().includes(gender));
            }

            // Priority 3: High Quality (Any Gender) - Fallback only if NO gender match
            if (!selectedVoice) {
                selectedVoice = languageVoices.find(v =>
                    (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Neural'))
                );
            }

            // Priority 4: First available
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
                (chunk) => setStreamingText(prev => prev + chunk)
            );

            setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
            setStreamingText('');
            speakText(response.speech);

            const lowerResponse = response.text.toLowerCase();
            const endKeywords = ['goodbye', 'bye', 'see you', '안녕', '가볼게요', '다음에', 'adios', 'tchau'];
            if (currentStep === 'closing' && endKeywords.some(k => lowerResponse.includes(k))) {
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

    // Initialize Speech Recognition
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

        // Skip initialization if resuming a session
        if (initialState) return;

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
    }, [config, language, speakText, t.common.error, voicesLoaded, initialState]);

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
            onEnd(null); // Or navigate home if triggered manually
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
        <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

            {/* Header: Glassmorphism & Stepper */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 sticky top-0 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={handleExitAttempt} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg leading-tight">{tLab.title}</h2>
                                <p className="text-xs text-gray-500">{config.product.name} • {config.customer.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowGuide(!showGuide)}
                                className={clsx(
                                    "p-2 rounded-full transition-colors relative",
                                    showGuide ? "bg-yellow-100 text-yellow-600" : "hover:bg-gray-100 text-gray-500"
                                )}
                            >
                                <Lightbulb size={20} />
                                {!showGuide && objectionHint && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />}
                            </button>
                            <button onClick={handleExitAttempt} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between relative px-2">
                        {/* Progress Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-10"
                            style={{ width: `${(currentStepIndex / (SALES_STEPS.length - 1)) * 100}%` }}
                        />

                        {SALES_STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-1 bg-white px-1">
                                    <div
                                        className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                                            isActive ? "border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/30" :
                                                isCompleted ? "border-primary bg-white text-primary" : "border-gray-300 bg-white text-gray-300"
                                        )}
                                    >
                                        {isCompleted ? <CheckCircle2 size={16} /> : isActive ? <PlayCircle size={16} /> : <Circle size={16} />}
                                    </div>
                                    <span className={clsx(
                                        "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 absolute top-8 w-20 text-center",
                                        isActive ? "text-primary" : isCompleted ? "text-gray-600" : "text-gray-300"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Chat Area - Full width on mobile, constrained on desktop */}
                <div className="flex-1 flex flex-col relative z-0 min-w-0">
                    {/* Messages Container - Always scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth pb-56 md:pb-44 lg:pb-32">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} message={msg} />
                            ))}
                            {streamingText && <ChatMessage message={{ role: 'ai', text: streamingText }} isStreaming />}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>

                    {/* Floating Input Bar */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white/90 to-transparent pt-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex items-center gap-2 relative">
                                {/* Auto Mode Toggle */}
                                <button
                                    onClick={toggleListening}
                                    className={clsx(
                                        "p-3 rounded-xl transition-all duration-300 flex items-center gap-2",
                                        isAutoMode
                                            ? isListening ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
                                            : "hover:bg-gray-100 text-gray-500"
                                    )}
                                    title="Auto Conversation Mode"
                                >
                                    {isAutoMode ? (
                                        isListening ? (
                                            <>
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                                <span className="text-xs font-bold">ON AIR</span>
                                            </>
                                        ) : <MicOff size={20} />
                                    ) : <Mic size={20} />}
                                </button>

                                <input
                                    type="text"
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isAutoMode ? tLab.listening : tLab.inputPlaceholder}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400"
                                    disabled={isProcessing || isAutoMode || isSessionEnded}
                                />

                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isProcessing || isSessionEnded}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-400">
                                    {isAutoMode ? "Auto-conversation active. Speak naturally." : "Type your response or click the mic for auto mode."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Guide Panel - Desktop Only (xl: screens and above) */}
                <AnimatePresence mode="wait">
                    {showGuide && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="hidden xl:flex border-l border-gray-200 bg-white/50 backdrop-blur-sm flex-col z-10"
                        >
                            <div className="w-80 flex flex-col h-full">
                                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Lightbulb size={18} className="text-yellow-500" />
                                        {tLab.guide}
                                    </h3>
                                    <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                    {/* Current Strategy */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tLab.stageStrategy}</h4>
                                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed">
                                            {tLab.strategies[currentStep]}
                                        </div>
                                    </div>

                                    {/* Objection Hint */}
                                    <AnimatePresence>
                                        {objectionHint && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Sparkles size={12} /> {tLab.objectionHint}
                                                </h4>
                                                <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-sm text-red-800 leading-relaxed shadow-sm">
                                                    {objectionHint}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Selling Points */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tLab.sellingPoints}</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>AI Processor Alpha 11</span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>Brightness Booster Max</span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>One Wall Design</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Sheet Guide Panel - Mobile/Tablet (xl: hidden) */}
                <AnimatePresence mode="wait">
                    {showGuide && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowGuide(false)}
                                className="xl:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                            />

                            {/* Bottom Sheet */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="xl:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 max-h-[70vh] flex flex-col z-50"
                            >
                                {/* Drag Handle */}
                                <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setShowGuide(false)}>
                                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                                </div>

                                <div className="px-5 pb-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                                        <Lightbulb size={18} className="text-yellow-500" />
                                        {tLab.guide}
                                    </h3>
                                    <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar pb-10">
                                    {/* Current Strategy */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tLab.stageStrategy}</h4>
                                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed">
                                            {tLab.strategies[currentStep]}
                                        </div>
                                    </div>

                                    {/* Objection Hint */}
                                    <AnimatePresence>
                                        {objectionHint && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Sparkles size={12} /> {tLab.objectionHint}
                                                </h4>
                                                <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-sm text-red-800 leading-relaxed shadow-sm">
                                                    {objectionHint}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Selling Points */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tLab.sellingPoints}</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>AI Processor Alpha 11</span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>Brightness Booster Max</span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>One Wall Design</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Session End Modal */}
            <AnimatePresence>
                {isSessionEnded && !showResultButton && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500" />
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                                <Sparkles size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Session Completed!</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Great job! The customer has ended the conversation. Ready to see how you performed?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowResultButton(true)}
                                    className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Review Later
                                </button>
                                <button
                                    onClick={handleEndSession}
                                    disabled={isProcessing}
                                    className="flex-1 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5"
                                >
                                    {isProcessing ? t.common.loading : "View Results"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Result Button */}
            <AnimatePresence>
                {showResultButton && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleEndSession}
                        disabled={isProcessing}
                        className="absolute bottom-24 right-6 z-40 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles size={18} />
                        {isProcessing ? t.common.loading : "View Results"}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Voice Loading Overlay */}
            <AnimatePresence>
                {!voicesLoaded && (
                    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Initializing AI Voices...</h2>
                        <p className="text-gray-500 mt-2">Getting ready for the best experience.</p>
                    </div>
                )}
            </AnimatePresence>

            {/* Exit Warning Modal */}
            <AnimatePresence>
                {showExitWarning && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <X size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Exit Roleplay?</h3>
                            <p className="text-gray-600 mb-6 text-sm">
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
                                    className="w-full px-4 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Save & Exit Prompt Modal (Navigation Block) */}
            <AnimatePresence>
                {showSavePrompt && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Save size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Save Progress?</h3>
                            <p className="text-gray-600 mb-6 text-sm">
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
                                    className="w-full px-4 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesLabChat;
