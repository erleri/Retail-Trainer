import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Trophy, TrendingUp, Star, MessageSquare, ArrowRight, CheckCircle2, Target, HelpCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { BarChart, Bar, Tooltip, ReferenceLine, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { aiService } from '../lib/gemini';
import { translations } from '../constants/translations';
import { staticFaqs } from '../data/staticFaqs';
import { Card as UICard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GlassIcon } from '../components/ui/GlassIcon';

// Mock Data
const USER_NAME = "Imjun";
const DAILY_GOAL = {
    title: "Master the OLED G5 USP",
    progress: 65,
    total: 100,
    xp: 150
};

// Chart Data
const SALES_DATA = [
    { day: 'M', achievement: 85 },
    { day: 'T', achievement: 92 },
    { day: 'W', achievement: 110 },
    { day: 'T', achievement: 78 },
    { day: 'F', achievement: 65 },
    { day: 'S', achievement: 125 },
    { day: 'S', achievement: 140 },
];

const XP_DATA = [
    { name: 'XP', value: 75, fill: '#EAB308' },
];

const AI_FEED = [
    { id: 1, type: 'insight', text: "Customers asking about 'Burn-in' are 30% more likely to buy if you mention the new 'Heat Dissipation' tech.", time: '2h ago' },
    { id: 2, type: 'recommendation', text: "Try the 'Price Objection' simulation to boost your closing rate.", time: '4h ago' },
];


const Card = ({ children, className, delay = 0, ...props }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <UICard className={clsx("border-white/20 h-full", className)} {...props}>
            {children}
        </UICard>
    </motion.div>
);

export default function HomeDashboard() {
    const { language } = useAppStore();
    const { weakness, dailyMission, dailyMissionDate, setDailyMission, recentSessions } = useUserStore();
    const t = translations[language];
    const navigate = useNavigate();

    useEffect(() => {
        const checkDailyMission = async () => {
            const today = new Date().toDateString();
            if (dailyMissionDate !== today) {
                // Generate new mission
                const mission = await aiService.generateDailyMission(recentSessions, language);
                if (mission) {
                    setDailyMission({
                        ...mission,
                        progress: 0,
                        status: 'active'
                    });
                }
            }
        };
        checkDailyMission();
    }, [dailyMissionDate, language, recentSessions, setDailyMission]);

    const activeMission = dailyMission || {
        title: "Loading Mission...",
        description: "Analyzing your performance...",
        progress: 0,
        target: 1,
        reward: "..."
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-8">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                        {t.home.greeting} <span className="gradient-text">{USER_NAME}</span>! 👋
                    </h1>
                    <p className="text-sm md:text-base text-text-secondary mt-1 md:mt-2">{t.home.subtitle}</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm text-text-secondary">{t.home.currentLevel}</p>
                    <p className="text-xl font-bold gradient-text-gold">Gold Pro</p>
                </div>
            </div>

            {/* KPI Stats Grid (Enhanced with Charts) */}
            <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible snap-x snap-mandatory hide-scrollbar">
                {/* XP Card (Radial Gauge) */}
                <Card delay={0} className="relative overflow-hidden min-w-[85vw] md:min-w-0 snap-center">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-text-secondary font-medium">{t.home.kpi.xp}</p>
                            <h3 className="text-2xl font-bold text-text-primary mt-1">2,450</h3>
                        </div>
                        <div className="p-2 rounded-xl bg-yellow-50 text-yellow-500 shadow-sm">
                            <Star size={20} fill="currentColor" />
                        </div>
                    </div>
                    <div className="h-16 md:h-24 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={10}
                                data={XP_DATA}
                                startAngle={180}
                                endAngle={0}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar
                                    background
                                    clockWise
                                    dataKey="value"
                                    cornerRadius={10}
                                    fill="url(#gradientGold)"
                                />
                                <defs>
                                    <linearGradient id="gradientGold" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#FCD34D" />
                                        <stop offset="100%" stopColor="#F59E0B" />
                                    </linearGradient>
                                </defs>
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-0 text-center">
                            <span className="text-xl md:text-2xl font-bold text-text-primary">75%</span>
                        </div>
                    </div>
                    <div className="text-center text-xs text-text-secondary -mt-2 md:-mt-4">
                        <span className="text-green-500 font-bold">+12%</span> {t.home.kpi.trend}
                    </div>
                </Card>

                {/* Sales Card (Vertical Bar Chart % vs Target) */}
                <Card delay={0.1} className="relative overflow-hidden min-w-[85vw] md:min-w-0 snap-center">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-text-secondary font-medium">{t.home.kpi.sellout}</p>
                            <h3 className="text-2xl font-bold text-text-primary mt-1">$12.5k</h3>
                        </div>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="h-16 md:h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SALES_DATA}>
                                <defs>
                                    <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="achievement" fill="url(#gradientBar)" radius={[4, 4, 0, 0]} />
                                <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="3 3" />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ display: 'none' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                {/* Rank Card (Badge) */}
                <Card delay={0.2} className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-premium min-w-[85vw] md:min-w-0 snap-center">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{t.home.kpi.rank}</p>
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mt-1">Top 5%</h3>
                        </div>
                        <div className="p-2 rounded-xl bg-white/10 text-white backdrop-blur-sm">
                            <Trophy size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-bold border border-white/10">
                            #42 Global
                        </div>
                        <span className="text-xs text-slate-300">Keep it up!</span>
                    </div>
                    <Trophy className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 rotate-12" />
                </Card>
            </div >

            {/* Today's Coaching (New) */}
            {
                weakness && (
                    <Card className="bg-gradient-to-r from-red-50 to-white border-red-100">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-red-500 shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                {/* Mobile Title visible here if needed, but keeping structure simple for now */}
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-red-900 text-lg">Today's Coaching Focus</h3>
                                        <p className="text-red-700 mt-1">
                                            Your performance in <span className="font-bold">"{weakness.category}"</span> dropped by <span className="font-bold">{Math.abs(weakness.trend)}%</span>.
                                        </p>
                                    </div>
                                    <Button
                                        variant="danger"
                                        onClick={() => navigate(weakness.recommendedAction.link)}
                                        icon={ArrowRight}
                                        className="w-full md:w-auto justify-center"
                                    >
                                        Start Learning
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )
            }

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (Left 2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Daily Goal Card */}
                    <Card delay={0.3} className="relative overflow-hidden border-primary/10">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Target size={120} className="text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2 border border-primary/10">
                                        {t.home.dailyGoal.label}
                                    </span>
                                    <h2 className="text-xl font-bold text-text-primary">{DAILY_GOAL.title}</h2>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-secondary">+{DAILY_GOAL.xp} XP</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-text-secondary">
                                    <span>{t.home.dailyGoal.progress}</span>
                                    <span>{DAILY_GOAL.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${DAILY_GOAL.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                className="mt-6 w-full"
                                onClick={() => navigate('/study')}
                                icon={ArrowRight}
                            >
                                {t.home.dailyGoal.continue}
                            </Button>
                        </div>
                    </Card>

                    {/* AI Trainer Feed */}
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <MessageSquare className="text-secondary" size={20} />
                            {t.home.aiFeed.title}
                        </h3>
                        <div className="space-y-4">
                            {AI_FEED.map((feed, index) => (
                                <Card key={feed.id} delay={0.4 + (index * 0.1)} padding="sm">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-text-primary leading-relaxed">{feed.text}</p>
                                            <p className="text-xs text-text-light mt-2">{feed.time}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Column (Right 1/3) */}
                <div className="space-y-8">
                    {/* Attendance Check (NEW) */}
                    <Card delay={0.4} className="bg-gradient-to-br from-green-50/50 to-white border-green-100/50">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="text-green-600" size={20} />
                            <h3 className="text-lg font-bold text-text-primary">{t.home.attendance.title}</h3>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">15</p>
                                <p className="text-xs text-text-secondary">{t.home.attendance.streak}</p>
                            </div>
                            <div className="text-right">
                                <Button
                                    className="bg-gradient-to-r from-green-500 to-green-600 border-none shadow-md hover:shadow-green-200"
                                    size="sm"
                                >
                                    {t.home.attendance.checkIn}
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between gap-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-text-light">{day}</span>
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        i < 5 ? "bg-green-100 text-green-700 shadow-sm" : "bg-gray-50 text-gray-300"
                                    )}>
                                        {i < 5 ? "✓" : ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    {/* Active Mission */}
                    <Card delay={0.5} className="bg-gradient-to-br from-secondary/5 to-transparent border-secondary/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="text-secondary" size={20} />
                            <h3 className="text-lg font-bold text-text-primary">{t.home.activeMission.title}</h3>
                        </div>

                        <div className="text-center py-4">
                            <div className="mx-auto mb-3">
                                <GlassIcon icon={Trophy} size="xl" variant="gold" className="w-20 h-20 mx-auto rounded-full shadow-premium" />
                            </div>
                            <h4 className="font-bold text-text-primary">{activeMission.title}</h4>
                            <p className="text-sm text-text-secondary mt-1">{activeMission.description}</p>
                        </div>

                        <div className="mt-4 p-4 bg-white/50 rounded-xl border border-gray-100 backdrop-blur-sm">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-text-secondary">{t.home.activeMission.progress}</span>
                                <span className="font-bold text-secondary">{activeMission.progress}/{activeMission.target}</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[...Array(activeMission.target || 1)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "h-2 flex-1 rounded-full transition-all",
                                            i < activeMission.progress ? "bg-secondary shadow-sm" : "bg-gray-100"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* FAQ Quick Access */}
                    <Card delay={0.6}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-text-primary">{t.home.faqCard.title}</h3>
                            <button
                                onClick={() => navigate('/study', { state: { activeTab: 'faq' } })}
                                className="text-sm text-primary font-medium hover:underline"
                            >
                                {t.home.faqCard.viewAll}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {Array.isArray(staticFaqs) && staticFaqs.length > 0 ? (
                                staticFaqs.slice(0, 3).map((faq) => (
                                    <button
                                        key={faq.id}
                                        onClick={() => navigate('/study', { state: { activeTab: 'faq' } })}
                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm group-hover:text-blue-600">
                                                <HelpCircle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-primary line-clamp-2">
                                                    {faq.question[language]}
                                                </p>
                                                <p className="text-xs text-text-secondary mt-1">
                                                    {faq.views} views • {faq.category}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Loading FAQs...</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}
