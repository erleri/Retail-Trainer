import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Star, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Share2, Download, Mic, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useChatStore } from '../store/chatStore';
import { useAppStore } from '../store/appStore';
import { translations } from '../constants/translations';
import { aiService } from '../lib/gemini';

const Card = ({ children, className, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={clsx("bg-surface rounded-2xl p-6 shadow-sm border border-gray-100", className)}
    >
        {children}
    </motion.div>
);

export default function FeedbackReport() {
    const { messages } = useChatStore();
    const { language } = useAppStore();
    const t = translations[language];
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (messages.length < 2) {
                // Use mock data if not enough messages
                setLoading(false);
                setReport({
                    totalScore: 82,
                    rank: 'Top 10%',
                    summary: language === 'en'
                        ? "Not enough conversation data to analyze. Please chat more with the AI."
                        : "AI가 분석할 대화 내용이 부족합니다. 챗봇과 대화를 더 진행해주세요. (현재는 예시 데이터입니다)",
                    pros: ["Perfectly explained the warranty policy.", "Used 'Feel-Felt-Found' technique effectively."],
                    improvements: ["Missed the 'Brightness' objection counter-logic.", "Closing attempt was too passive."],
                    practiceSentence: "I understand your concern about brightness. However, with our new MLA technology, this model is 70% brighter than previous generations.",
                    recommendedMission: { title: "Brightness Master", xp: 50, type: "Roleplay" },
                    scores: [
                        { subject: 'Product Knowledge', A: 85 },
                        { subject: 'Objection Handling', A: 65 },
                        { subject: 'Empathy', A: 90 },
                        { subject: 'Policy', A: 95 },
                        { subject: 'Conversation', A: 75 },
                    ]
                });
                return;
            }

            try {
                const generatedReport = await aiService.generateFeedback(messages);
                if (generatedReport) {
                    setReport(generatedReport);
                }
            } catch (error) {
                console.error("Failed to generate report", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [messages, language]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-text-secondary font-medium">{t.feedback.loading}</p>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t.feedback.title}</h1>
                    <p className="text-text-secondary">{t.feedback.subtitle} • {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Overview (Left Column) */}
                <div className="space-y-6">
                    {/* Total Score Card */}
                    <Card className="text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <h3 className="text-text-secondary font-medium mb-2">{t.feedback.totalScore}</h3>
                        <div className="relative inline-block">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                <circle cx="64" cy="64" r="60" stroke="#00C7B1" strokeWidth="8" fill="none" strokeDasharray={377} strokeDashoffset={377 - (377 * report.totalScore) / 100} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-text-primary">{report.totalScore}</span>
                                <span className="text-sm text-text-secondary">/ 100</span>
                            </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                            <Star size={14} fill="currentColor" /> {report.rank}
                        </div>
                    </Card>

                    {/* Radar Chart */}
                    <Card className="overflow-hidden">
                        <h3 className="font-bold text-text-primary mb-4">{t.feedback.skillAnalysis}</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.scores}>
                                    <PolarGrid stroke="#E5E7EB" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                                    <Radar name="My Score" dataKey="A" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Detailed Feedback (Middle & Right Column) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Summary */}
                    <Card delay={0.2}>
                        <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                            <span className="text-2xl">🤖</span> {t.feedback.aiFeedback}
                        </h3>
                        <p className="text-text-secondary leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {report.summary}
                        </p>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pros */}
                        <Card delay={0.3} className="border-l-4 border-l-green-500">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500" /> {t.feedback.pros}
                            </h3>
                            <ul className="space-y-3">
                                {report.pros.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-text-secondary">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Improvements */}
                        <Card delay={0.4} className="border-l-4 border-l-orange-500">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                <TrendingUp className="text-orange-500" /> {t.feedback.improvements}
                            </h3>
                            <ul className="space-y-3">
                                {report.improvements.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-text-secondary">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Practice & Mission */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card delay={0.5}>
                            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                                <AlertTriangle className="text-secondary" size={20} />
                                {t.feedback.practice}
                            </h3>
                            <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10 text-sm text-text-primary italic">
                                "{report.practiceSentence}"
                            </div>
                            <button className="mt-4 text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
                                <Mic size={16} /> {t.feedback.record}
                            </button>
                        </Card>

                        <Card delay={0.6} className="bg-primary text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-primary-light text-xs font-bold uppercase tracking-wider">{t.feedback.mission}</span>
                                    <h3 className="text-xl font-bold mt-1">{report.recommendedMission.title}</h3>
                                    <p className="text-primary-light text-sm mt-1">Type: {report.recommendedMission.type}</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <span className="font-bold">+{report.recommendedMission.xp} XP</span>
                                </div>
                            </div>
                            <button className="mt-6 w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                {t.feedback.startMission} <ArrowRight size={18} />
                            </button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
