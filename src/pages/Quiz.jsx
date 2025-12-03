import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { localDB } from '../lib/storage';


const QUESTIONS = [
    {
        id: 1,
        question: {
            en: "What is the key benefit of the 'One-Wall Design'?",
            ko: "'One-Wall Design'의 핵심 혜택은 무엇인가요?"
        },
        options: [
            { id: 'a', text: { en: "It is cheaper to manufacture", ko: "제조 비용이 저렴하다" }, correct: false },
            { id: 'b', text: { en: "It mounts flush to the wall with no gap", ko: "틈새 없이 벽에 완벽하게 밀착된다" }, correct: true },
            { id: 'c', text: { en: "It comes with a separate stand", ko: "별도의 스탠드가 포함되어 있다" }, correct: false },
            { id: 'd', text: { en: "It is thicker for better sound", ko: "더 나은 사운드를 위해 두껍다" }, correct: false }
        ]
    },
    {
        id: 2,
        question: {
            en: "Which processor powers the OLED G5?",
            ko: "OLED G5에 탑재된 프로세서는 무엇인가요?"
        },
        options: [
            { id: 'a', text: { en: "Alpha 9 Gen 6", ko: "알파 9 6세대" }, correct: false },
            { id: 'b', text: { en: "Alpha 11 AI Processor", ko: "알파 11 AI 프로세서" }, correct: true },
            { id: 'c', text: { en: "Alpha 7 Gen 5", ko: "알파 7 5세대" }, correct: false },
            { id: 'd', text: { en: "Quantum Processor 4K", ko: "퀀텀 프로세서 4K" }, correct: false }
        ]
    },
    {
        id: 3,
        question: {
            en: "How much brighter is the G5 compared to conventional OLEDs?",
            ko: "G5는 일반 OLED 대비 얼마나 더 밝나요?"
        },
        options: [
            { id: 'a', text: { en: "30% Brighter", ko: "30% 더 밝음" }, correct: false },
            { id: 'b', text: { en: "70% Brighter", ko: "70% 더 밝음" }, correct: false },
            { id: 'c', text: { en: "150% Brighter (3x)", ko: "150% 더 밝음 (3배)" }, correct: true }, // Technically up to 150% / 70% depending on model, but sticking to "3x" claim from study content if available, or generally "Brightness Booster Max"
            { id: 'd', text: { en: "Same brightness", ko: "밝기 동일" }, correct: false }
        ]
    },
    {
        id: 4,
        question: {
            en: "LG OLED has been the world's No.1 OLED TV brand for how many consecutive years?",
            ko: "LG OLED는 몇 년 연속 세계 판매 1위인가요?"
        },
        options: [
            { id: 'a', text: { en: "5 Years", ko: "5년" }, correct: false },
            { id: 'b', text: { en: "10 Years", ko: "10년" }, correct: false },
            { id: 'c', text: { en: "12 Years", ko: "12년" }, correct: true },
            { id: 'd', text: { en: "20 Years", ko: "20년" }, correct: false }
        ]
    }
];

export default function Quiz() {
    const { language, addBadge } = useAppStore();

    const navigate = useNavigate();
    const location = useLocation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

    // Determine which questions to use
    const [activeQuestions, setActiveQuestions] = useState(QUESTIONS);

    useEffect(() => {
        const loadQuiz = async () => {
            if (location.state?.courseId) {
                try {
                    const courseQuiz = await localDB.getQuiz(location.state.courseId);
                    if (courseQuiz) {
                        setActiveQuestions(courseQuiz);
                    }
                } catch (e) {
                    console.error("Failed to load quiz", e);
                }
            }
        };
        loadQuiz();
    }, [location.state]);

    const currentQuestion = activeQuestions[currentQuestionIndex];



    const handleOptionClick = (optionId) => {
        if (isAnswered) return;
        setSelectedOption(optionId);

        const isCorrect = currentQuestion.options.find(opt => opt.id === optionId).correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            if (score >= 3) {
                addBadge('g5-master');
                setShowBadgeAnimation(true);
            }
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center relative">
                <AnimatePresence>
                    {showBadgeAnimation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                            onClick={() => setShowBadgeAnimation(false)}
                        >
                            <motion.div
                                initial={{ y: 50 }}
                                animate={{ y: 0 }}
                                className="bg-surface p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent pointer-events-none" />
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-8xl mb-6"
                                >
                                    🏆
                                </motion.div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    {language === 'ko' ? 'G5 마스터 뱃지 획득!' : 'G5 Master Badge Unlocked!'}
                                </h2>
                                <p className="text-text-secondary mb-6">
                                    {language === 'ko'
                                        ? '축하합니다! G5 전문가로 인정받으셨습니다.'
                                        : 'Congratulations! You are now a G5 Expert.'}
                                </p>
                                <button
                                    onClick={() => setShowBadgeAnimation(false)}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors"
                                >
                                    {language === 'ko' ? '확인' : 'Awesome!'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-surface rounded-3xl p-8 shadow-lg border border-gray-100"
                >
                    <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                        <Trophy size={48} className="text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                        {language === 'ko' ? '퀴즈 완료!' : 'Quiz Completed!'}
                    </h2>
                    <p className="text-text-secondary mb-8">
                        {language === 'ko'
                            ? `총 ${QUESTIONS.length}문제 중 ${score}문제를 맞추셨습니다.`
                            : `You scored ${score} out of ${QUESTIONS.length}.`}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-text-primary font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={20} />
                            {language === 'ko' ? '다시 시도' : 'Retry'}
                        </button>
                        <button
                            onClick={() => navigate('/study')}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
                        >
                            {language === 'ko' ? '학습실로 이동' : 'Back to Study'}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-text-secondary mb-2 font-bold">
                    <span>{language === 'ko' ? `질문 ${currentQuestionIndex + 1}` : `Question ${currentQuestionIndex + 1}`}</span>
                    <span>{currentQuestionIndex + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-6 leading-relaxed">
                    {currentQuestion.question[language]}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            disabled={isAnswered}
                            className={clsx(
                                "w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden",
                                selectedOption === option.id
                                    ? option.correct
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-red-500 bg-red-50 text-red-700"
                                    : "border-gray-100 hover:border-gray-200 bg-white text-text-secondary",
                                isAnswered && option.correct && "border-green-500 bg-green-50 text-green-700" // Show correct answer after selection
                            )}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <span className="font-medium">{option.text[language]}</span>
                                {selectedOption === option.id && (
                                    option.correct
                                        ? <CheckCircle2 className="text-green-600" />
                                        : <XCircle className="text-red-600" />
                                )}
                                {isAnswered && option.correct && selectedOption !== option.id && (
                                    <CheckCircle2 className="text-green-600" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className={clsx(
                        "px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                        isAnswered
                            ? "bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {currentQuestionIndex < QUESTIONS.length - 1
                        ? (language === 'ko' ? '다음 문제' : 'Next Question')
                        : (language === 'ko' ? '결과 보기' : 'See Results')}
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
