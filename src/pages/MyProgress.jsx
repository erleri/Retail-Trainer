import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Clock, Award, ArrowUp, ArrowDown, Download, Filter, ChevronRight, BookOpen, MessageSquare, Target, Zap, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

// Mock Data
const LEARNING_DATA = [
    { day: 'Mon', score: 65, xp: 120 },
    { day: 'Tue', score: 72, xp: 250 },
    { day: 'Wed', score: 68, xp: 180 },
    { day: 'Thu', score: 85, xp: 320 },
    { day: 'Fri', score: 82, xp: 280 },
    { day: 'Sat', score: 90, xp: 450 },
    { day: 'Sun', score: 88, xp: 380 },
];

const SELLOUT_DATA = [
    { week: 'W1', sales: 12000, target: 10000 },
    { week: 'W2', sales: 15000, target: 12000 },
    { week: 'W3', sales: 11000, target: 12000 },
    { week: 'W4', sales: 18000, target: 15000 },
];

const KPI_CARDS = [
    { title: 'Avg. Score', value: '82.5', trend: '+5.2%', icon: Award, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Learning Time', value: '4.5h', trend: '+12%', icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Total XP', value: '2,450', trend: '+850', icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { title: 'Completion Rate', value: '94%', trend: '-2%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', trendDown: true },
];

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

export default function MyProgress() {
    const { level, xp, nextLevelXp, weakness, recentSessions, learningProgress, missions } = useUserStore();
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">My Progress</h1>
                    <p className="text-text-secondary">Track your growth and achievements.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Last 30 Days
                    </button>
                </div>
            </div>

            {/* 1. Today's Coaching (Top Priority) */}
            {weakness && (
                <Card className="bg-gradient-to-r from-red-50 to-white border-red-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-red-500">
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-900 text-lg">Today's Coaching Focus</h3>
                                <p className="text-red-700 mt-1">
                                    Your performance in <span className="font-bold">"{weakness.category}"</span> dropped by <span className="font-bold">{Math.abs(weakness.trend)}%</span>.
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                    Recommended: {weakness.recommendedAction.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => navigate(weakness.recommendedAction.link)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Start Learning <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => navigate('/sales-lab')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors"
                            >
                                Practice Roleplay
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* 2. Level & XP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">Current Level</span>
                            <h2 className="text-4xl font-black text-text-primary mt-1">LV. {level}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-text-secondary">Next Level</span>
                            <p className="text-lg font-bold text-text-primary">{nextLevelXp - xp} XP remaining</p>
                        </div>
                    </div>
                    <div className="relative h-4 bg-white/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(xp / nextLevelXp) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                        />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-primary shadow-sm">🏆 Top 5%</span>
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-secondary shadow-sm">🔥 7 Day Streak</span>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" /> Recent Badges
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl" title="First Sale">🥇</div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl" title="Tech Master">🤖</div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl" title="Fast Learner">⚡</div>
                        <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </Card>
            </div>

            {/* 3. Personal KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Score', value: '82.5', trend: '+5%', color: 'text-primary', bg: 'bg-primary/10', icon: Zap },
                    { label: 'Roleplay Count', value: '12', trend: '+2', color: 'text-blue-500', bg: 'bg-blue-50', icon: MessageSquare },
                    { label: 'Learning Time', value: '4.5h', trend: '+15%', color: 'text-green-500', bg: 'bg-green-50', icon: Clock },
                    { label: 'Completion', value: '94%', trend: '0%', color: 'text-purple-500', bg: 'bg-purple-50', icon: BookOpen },
                ].map((stat, i) => (
                    <Card key={i} delay={0.2 + (i * 0.1)} className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-xs text-text-secondary font-bold uppercase">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h4>
                            <span className="text-xs font-medium text-green-500 bg-green-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
                        </div>
                        <div className={clsx("p-3 rounded-xl", stat.bg)}>
                            <stat.icon size={20} className={stat.color} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 4. Recent Roleplay Summary */}
                <Card delay={0.4}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <MessageSquare size={20} className="text-blue-500" /> Recent Roleplay
                        </h3>
                        <button onClick={() => navigate('/sales-lab')} className="text-sm text-primary font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-bold text-text-primary">{session.product}</p>
                                    <p className="text-xs text-text-secondary">{session.customer} • {session.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={clsx(
                                        "px-2 py-1 rounded-lg text-xs font-bold",
                                        session.score >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {session.score} pts
                                    </span>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 5. Learning Progress */}
                <Card delay={0.5}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <BookOpen size={20} className="text-purple-500" /> Learning Progress
                        </h3>
                        <button onClick={() => navigate('/study')} className="text-sm text-primary font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {learningProgress.map((course) => (
                            <div key={course.id}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-text-primary">{course.title}</span>
                                    <span className="font-bold text-primary">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 6. Active Missions */}
            <div className="space-y-4">
                <h3 className="font-bold text-text-primary text-xl flex items-center gap-2">
                    <Target size={24} className="text-red-500" /> Active Missions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {missions && missions.map((mission, index) => (
                        <Card key={mission.id} delay={0.6 + (index * 0.1)} className={clsx("relative overflow-hidden", mission.status === 'locked' && "opacity-75 bg-gray-50")}>
                            <div className="flex items-start gap-4">
                                <div className={clsx("p-3 rounded-xl", mission.bg, mission.color)}>
                                    <Target size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block", mission.bg, mission.color)}>
                                                {mission.type}
                                            </span>
                                            <h3 className="text-lg font-bold text-text-primary">{mission.title}</h3>
                                        </div>
                                        <span className="font-bold text-secondary">+{mission.xp} XP</span>
                                    </div>

                                    <p className="text-sm text-text-secondary mt-2 mb-4">{mission.description}</p>

                                    {mission.status !== 'locked' && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-text-secondary">
                                                <span>Progress</span>
                                                <span>{mission.progress} / {mission.total}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                    style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {mission.status === 'active' && (
                                        <button className="mt-4 w-full py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm flex items-center justify-center gap-1">
                                            Start Now <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
