import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, Volume2, StopCircle, MicOff, Play, BookOpen, AlertCircle, ArrowRight, HelpCircle, FileText, Scale, ShieldCheck, Trash2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../store/chatStore';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { aiService } from '../lib/gemini';
import { translations } from '../constants/translations';
import { useNavigate } from 'react-router-dom';

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default function AIChatbot() {
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const { language } = useAppStore();
  const { weakness } = useUserStore();
  const navigate = useNavigate();

  const t = translations[language] || translations['en'];

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [voices, setVoices] = useState([]);



  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef('');
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load Voices
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Update inputRef manually
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const [isAutoMode, setIsAutoMode] = useState(false);
  const isAutoModeRef = useRef(isAutoMode);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    const initChat = async () => {
      try {
        // Initialize Backend Session (Reuses if exists)
        await aiService.initTutor();

        // Check if we have existing messages in the store (Persistence)
        const currentMessages = useChatStore.getState().messages;
        const hasHistory = currentMessages.length > 0;

        // Reset and Add Welcome Message only if NO history exists
        if (!hasInitialized.current) {
          if (hasHistory) {
            console.log("Resuming AI Tutor chat with existing history.");
            hasInitialized.current = true;
          } else {
            console.log("Starting fresh AI Tutor chat.");
            useChatStore.getState().resetChat();
            hasInitialized.current = true;
            const welcomeText = language === 'ko'
              ? "안녕하세요! LG TV 세일즈 튜터입니다. 제품 지식부터 판매 노하우까지, 무엇이든 물어보세요! 😊"
              : (language === 'es'
                ? "¡Hola! Soy tu tutor de ventas de LG TV. Pregúntame lo que quieras sobre productos o ventas. 😊"
                : (language === 'pt-br'
                  ? "Olá! Sou seu tutor de vendas de TV LG. Pergunte-me qualquer coisa sobre produtos ou vendas. 😊"
                  : "Hello! I'm your LG TV Sales Tutor. Ask me anything about products or sales know-how! 😊"));

            addMessage({ role: 'ai', text: welcomeText });
          }
        }

        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ko-KR';

            recognitionRef.current.onresult = (event) => {
              let interimTranscript = '';
              let finalTranscript = '';

              for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
                } else {
                  interimTranscript += event.results[i][0].transcript;
                }
              }

              if (finalTranscript) {
                setInput(prev => {
                  const newVal = prev + finalTranscript + ' ';
                  inputRef.current = newVal;
                  return newVal;
                });
                if (isAutoModeRef.current) resetSilenceTimer();
              } else if (interimTranscript) {
                if (isAutoModeRef.current) resetSilenceTimer();
              }
            };

            recognitionRef.current.onerror = (event) => {
              console.error("Speech recognition error", event.error);
              setIsListening(false);
            };

            recognitionRef.current.onend = () => {
              if (isAutoModeRef.current && !isTyping) {
                try {
                  recognitionRef.current.start();
                } catch {
                  // ignore
                }
              } else {
                setIsListening(false);
              }
            };
          } catch (e) {
            console.error("Speech Recognition initialization failed", e);
          }
        }
      } catch (error) {
        console.error("Failed to start chat:", error);
      }
    };

    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const langMap = {
      'en': 'en-US',
      'ko': 'ko-KR',
      'es': 'es-ES',
      'pt-br': 'pt-BR'
    };
    const targetLangCode = langMap[language] || 'en-US';

    if (recognitionRef.current) {
      recognitionRef.current.lang = targetLangCode;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      handleSend(true);
    }, 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/[*#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cleanText);

      const langMap = {
        'en': 'en-US',
        'ko': 'ko-KR',
        'es': 'es-ES',
        'pt-br': 'pt-BR'
      };

      const targetLangCode = isKorean ? 'ko-KR' : (langMap[language] || 'en-US');
      utterance.lang = targetLangCode;

      const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const voiceLangSearch = isKorean ? 'ko' : (language === 'pt-br' ? 'pt' : language);

      const preferredVoice = currentVoices.find(v => v.name.includes('Google') && v.lang.toLowerCase().includes(voiceLangSearch)) ||
        currentVoices.find(v => v.name.includes('Microsoft') && v.lang.toLowerCase().includes(voiceLangSearch)) ||
        currentVoices.find(v => v.lang.toLowerCase().includes(voiceLangSearch));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (isContinuousMode || isAutoMode) {
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch {
                // ignore
              }
            }
          }, 500);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsContinuousMode(false);
  };

  const recommendedTopics = [
    { id: 'oled_qned', text: t?.aiTutor?.topics?.oledVsQned || "OLED vs QNED 차이점" },
    { id: 'price_objection', text: t?.aiTutor?.topics?.priceObjection || "가격 저항 극복 팁" },
    { id: 'closing', text: t?.aiTutor?.topics?.closing || "효과적인 클로징 멘트" },
    { id: 'competitor', text: t?.aiTutor?.topics?.competitor || "경쟁사 비교 포인트" }
  ];

  const handleTopicClick = (topicText) => {
    setInput(topicText);
    handleSend(false, topicText); // Pass text directly
  };

  const handleSend = async (isAuto = false, manualText = null) => {
    const textToSend = manualText || (isAuto ? inputRef.current : input);

    if (!textToSend.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    stopListening();

    setInput('');
    inputRef.current = '';
    addMessage({ role: 'user', text: textToSend });
    setTyping(true);

    try {
      const { text, speech } = await aiService.sendMessage(textToSend, language);

      setTyping(false);
      addMessage({ role: 'ai', text: text });

      // Only speak if in Voice mode (isAutoMode is true)
      if (isAutoModeRef.current) {
        speakText(speech);
      }

    } catch {
      setTyping(false);
      addMessage({ role: 'ai', text: t?.common?.error || 'Error' });
    }
  };





  const [expandedMessages, setExpandedMessages] = useState({});

  const toggleMessageDetails = (msgId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleClearChat = () => {
    useChatStore.getState().clearMessages();
    hasInitialized.current = false;
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full gap-4 py-4 lg:p-0">
      {/* Weakness Indicator Panel (Top) */}
      {weakness && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm border border-red-100 flex-shrink-0">
              <AlertCircle size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-red-900">Weakness: {weakness.category}</p>
              <p className="text-xs text-red-700 truncate">Accuracy low ({weakness.score}%). {weakness.recommendedAction.title}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(weakness.recommendedAction.link)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors border border-red-200 shadow-sm whitespace-nowrap"
          >
            Learn <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-w-0">
          {/* Header */}
          <div className="border-b border-slate-100 bg-white">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary border border-indigo-100">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">AI Tutor</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {isSpeaking && (
                  <button onClick={stopSpeaking} className="p-2 text-primary bg-indigo-50 rounded-full animate-pulse transition-colors">
                    <Volume2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    isAutoMode
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {isAutoMode ? <Mic size={14} /> : <FileText size={14} />}
                  <span className="hidden sm:inline">{isAutoMode ? "Voice Mode" : "Text Mode"}</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => {
              // Parse AI response to separate core summary and details
              const parseAIResponse = (text) => {
                if (msg.role === 'user') return { summary: text, details: null };

                const summaryMatch = text.match(/### 📌 핵심 요약.*?(?=###|---SPEECH---|$)/s);
                const tipsMatch = text.match(/### 🔧 실전 팁.*?(?=###|---SPEECH---|$)/s);
                const scriptMatch = text.match(/\[실전 스크립트.*?(?=###|---SPEECH---|$)/s);
                const detailsMatch = text.match(/### 📚 상세 정보.*?(?=---SPEECH---|$)/s);

                let summary = text;
                let details = null;

                if (summaryMatch) {
                  summary = summaryMatch[0];
                  if (tipsMatch) summary += '\n' + tipsMatch[0];
                  if (scriptMatch) summary += '\n' + scriptMatch[0];
                  if (detailsMatch) details = detailsMatch[0];
                }

                return { summary, details };
              };

              const { summary, details } = parseAIResponse(msg.text);
              const isExpanded = expandedMessages[msg.id] || false;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={clsx(
                    "flex gap-4 max-w-[90%] md:max-w-[80%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border",
                    msg.role === 'user' ? "bg-indigo-600 text-white border-indigo-700" : "bg-white text-emerald-600 border-slate-200"
                  )}>
                    {msg.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className={clsx(
                      "p-5 rounded-2xl shadow-sm text-sm leading-relaxed",
                      msg.role === 'user'
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-200"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                    )}>
                      {msg.role === 'ai' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ ...props }) => <table className="border-collapse border border-slate-200 w-full my-2 text-xs" {...props} />,
                            th: ({ ...props }) => <th className="border border-slate-200 bg-slate-50 p-2 text-left font-bold" {...props} />,
                            td: ({ ...props }) => <td className="border border-slate-200 p-2" {...props} />,
                            strong: ({ ...props }) => <strong className="font-bold text-indigo-600" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {summary}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>

                    {/* Show Details Button */}
                    {details && msg.role === 'ai' && (
                      <button
                        onClick={() => toggleMessageDetails(msg.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-indigo-700 font-bold text-xs transition-colors self-start"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                        <ChevronDown
                          size={14}
                          className={clsx(
                            "transition-transform",
                            isExpanded ? "rotate-180" : ""
                          )}
                        />
                      </button>
                    )}

                    {/* Expanded Details */}
                    {details && msg.role === 'ai' && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg text-sm text-slate-700"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ ...props }) => <table className="border-collapse border border-slate-200 w-full my-2 text-xs" {...props} />,
                            th: ({ ...props }) => <th className="border border-slate-200 bg-slate-50 p-2 text-left font-bold" {...props} />,
                            td: ({ ...props }) => <td className="border border-slate-200 p-2" {...props} />,
                            strong: ({ ...props }) => <strong className="font-bold text-indigo-600" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {details}
                        </ReactMarkdown>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Recommended Topics */}
            {messages.length === 1 && messages[0].role === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 mt-4 ml-12"
              >
                {recommendedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic.text)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold rounded-full hover:shadow-sm transition-all"
                  >
                    {topic.text}
                  </button>
                ))}
              </motion.div>
            )}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs">AI</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0">
                <ImageIcon size={20} />
              </button>
              <button
                onClick={toggleListening}
                className={clsx(
                  "p-2 transition-colors rounded-full flex-shrink-0",
                  isListening ? "bg-red-50 text-red-500 animate-pulse" : "text-slate-400 hover:text-indigo-600"
                )}
              >
                {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
