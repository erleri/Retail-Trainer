import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Trophy, Zap, Star, MessageSquare, ArrowRight, CheckCircle2,
    Target, Play, BookOpen, Flame, Award, Sparkles, User, Bell,
    Lightbulb, TrendingUp, Monitor, Bot
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { operatorApi } from '../services/operatorApi';
import { translations } from '../constants/translations';
import { MotionCard } from '../components/ui/modern/MotionCard';
import { PulseButton } from '../components/ui/modern/PulseButton';
import { HeroProgress } from '../components/dashboard/HeroProgress';
import { USER_NAME, LAST_STUDY_SESSION, MISSION_DATA, AI_BRIEFING_MOCK } from '../constants/mockData';

export default function HomeDashboard() {
    const { language } = useAppStore();
    const t = translations[language];
    const navigate = useNavigate();
    const [streak, setStreak] = useState(15);
    const [aiBriefing, setAiBriefing] = useState(AI_BRIEFING_MOCK[0]);
    const [gameData, setGameData] = useState({
        level: 1, currentXp: 0, nextLevelXp: 1000, rankLabel: "Loading...", badges: []
    });

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const res = await operatorApi.getUserGamificationState("u_01");
                if (res.success) {
                    setGameData({
                        ...res.data.state,
                        // Mock Badges for Demo if empty
                        badges: res.data.state.badges?.length > 0 ? res.data.state.badges : [
                            { id: 1, icon: '🥇', name: 'First Sale' },
                            { id: 2, icon: '⚡', name: 'Speedster' },
                            { id: 3, icon: '🧠', name: 'Knowledgeable' }
                        ]
                    });
                    setStreak(res.data.state.streak);
                }
            } catch (error) {
                console.error("Failed to sync gamification:", error);
            }
        };
        fetchGameData();
        setAiBriefing(AI_BRIEFING_MOCK[Math.floor(Math.random() * AI_BRIEFING_MOCK.length)]);
    }, []);

    // Calculate Progress
    const xpPercentage = Math.min(100, (gameData.currentXp / gameData.nextLevelXp) * 100);


    return (
        <div className="space-y-6 pb-24 md:pb-8">
            {/* 1. Header & Profile Actions */}
            <div className="flex justify-between items-center pt-2">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        <Sparkles size={14} /> <span>Welcome Back</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        Hello, {USER_NAME}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 relative rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button onClick={() => navigate('/my')} className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-primary hover:scale-105 transition-transform">
                        <User size={20} />
                    </button>
                </div>
            </div>

            {/* 2. Unified Status Card */}
            <MotionCard className="card-base p-0 overflow-hidden relative group" glass={false}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="p-5 flex items-center gap-6 relative z-10">
                    <HeroProgress level={gameData.level} xpPercentage={xpPercentage} />

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Title</div>
                                <div className="flex items-center gap-3">
                                    <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        {gameData.rankLabel} <Award size={16} className="text-amber-500" />
                                    </div>
                                    {/* Badges Display */}
                                    <div className="flex -space-x-2">
                                        {gameData.badges?.slice(0, 3).map((b, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs" title={b.name}>
                                                {b.icon || '🏅'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                                    <Flame size={16} fill="currentColor" /> {streak} Day Streak
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>XP Progress</span>
                                <span>{gameData.currentXp} / {gameData.nextLevelXp}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpPercentage}%` }}
                                    className="h-full bg-primary rounded-full"
                                />
                            </div>
                            <div className="text-[10px] text-slate-400 text-right">
                                {100 - xpPercentage.toFixed(0)}% to Level {gameData.level + 1}
                            </div>
                        </div>
                    </div>
                </div>
            </MotionCard>

            {/* 3. Daily Insight & Continue Learning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* AI Coach Briefing Card */}
                <MotionCard
                    className={clsx(
                        "card-base p-5 border relative overflow-hidden",
                        aiBriefing.mode === 'coaching' ? "bg-red-50/50 border-red-100" :
                            aiBriefing.mode === 'praise' ? "bg-blue-50/50 border-blue-100" : "bg-amber-50/50 border-amber-100"
                    )}
                    glass={false}
                    delay={0.1}
                >
                    <div className="flex items-start gap-4 relative z-10">
                        <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border",
                            aiBriefing.mode === 'coaching' ? "bg-white text-red-500 border-red-50" :
                                aiBriefing.mode === 'praise' ? "bg-white text-blue-500 border-blue-50" : "bg-white text-amber-500 border-amber-50"
                        )}>
                            <Bot size={24} />
                        </div>
                        <div className="flex-1">
                            <div className={clsx(
                                "text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1",
                                aiBriefing.mode === 'coaching' ? "text-red-600" :
                                    aiBriefing.mode === 'praise' ? "text-blue-600" : "text-amber-600"
                            )}>
                                AI Coach Briefing
                            </div>
                            <p className="text-slate-900 font-bold leading-snug mb-3 text-sm md:text-base">
                                "{aiBriefing.message}"
                            </p>
                            <button
                                onClick={() => navigate(aiBriefing.link)}
                                className={clsx(
                                    "text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors",
                                    aiBriefing.mode === 'coaching' ? "bg-red-100 text-red-700 hover:bg-red-200" :
                                        aiBriefing.mode === 'praise' ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                )}
                            >
                                {aiBriefing.action} <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </MotionCard>

                {/* Continue Learning Card */}
                <MotionCard
                    className="card-base p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
                    glass={false}
                    delay={0.2}
                    onClick={() => navigate('/study')}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <BookOpen size={80} className="text-indigo-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                <Play size={14} fill="currentColor" /> Continue Learning
                            </div>
                            <span className="text-xs font-bold text-indigo-500 bg-white/50 px-2 py-1 rounded-md">{LAST_STUDY_SESSION.progress}%</span>
                        </div>

                        <div className="mb-3">
                            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{LAST_STUDY_SESSION.title}</h3>
                            <p className="text-xs text-slate-500">{LAST_STUDY_SESSION.lastModule}</p>
                        </div>

                        <div className="w-full h-1.5 bg-indigo-200/50 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${LAST_STUDY_SESSION.progress}%` }} />
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold uppercase tracking-wide">
                            Resume Session <ArrowRight size={10} />
                        </div>
                    </div>
                </MotionCard>
            </div>

            {/* 4. Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <MotionCard
                    className="bg-primary hover:bg-primary-hover text-white border-none flex flex-col items-center justify-center p-4 py-6 shadow-md transition-colors cursor-pointer gap-2 text-center"
                    onClick={() => navigate('/sales-lab')}
                    glass={false}
                    delay={0.2}
                >
                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Zap size={20} className="text-white fill-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none mb-1">Sales Lab</h3>
                        <p className="text-indigo-100 text-xs">Start Roleplay</p>
                    </div>
                </MotionCard>

                <MotionCard
                    className="card-base card-hover flex flex-col items-center justify-center p-4 py-6 cursor-pointer bg-white gap-2 text-center"
                    onClick={() => navigate('/study')}
                    glass={false}
                    delay={0.3}
                >
                    <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-none mb-1">Study</h3>
                        <p className="text-slate-500 text-xs">Review Materials</p>
                    </div>
                </MotionCard>
            </div>

            {/* 5. Missions (Vertical Stack) */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Target className="text-primary" /> Today's Missions
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {MISSION_DATA.map((Mission, idx) => (
                        <motion.div
                            key={Mission.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                        >
                            <MotionCard
                                glass={false}
                                className={clsx(
                                    "card-base p-4 h-full flex flex-row md:flex-col items-center md:items-start justify-between gap-4 md:gap-0 relative overflow-hidden group hover:shadow-lg transition-all",
                                    Mission.type === 'saleslab' ? "border-l-[4px] border-l-primary" :
                                        Mission.type === 'quiz' ? "border-l-[4px] border-l-emerald-500" : "border-l-[4px] border-l-amber-500"
                                )}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={clsx(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border",
                                            Mission.type === 'saleslab' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                                Mission.type === 'quiz' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                        )}>
                                            {Mission.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">{Mission.duration}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight group-hover:text-primary transition-colors">
                                        {Mission.title}
                                    </h4>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-slate-500 text-xs font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <Zap size={12} className="text-amber-500 fill-amber-500" />
                                        {Mission.xp} XP
                                    </div>
                                    <button className={clsx(
                                        "p-1.5 rounded-lg transition-all mt-1",
                                        Mission.status === 'locked' ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-primary shadow-sm"
                                    )}>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </MotionCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div >
    );
}
