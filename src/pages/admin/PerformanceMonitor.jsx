import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/operatorApi';
import { Activity, Target, Zap, BookOpen, Brain, TrendingUp, HelpCircle } from 'lucide-react';
import InsightsConsole from './InsightsConsole';
import ScopeSelector from '../../components/admin/ScopeSelector';

export default function PerformanceMonitor() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const skillDescriptions = {
        product_knowledge: "Understanding of technical specs and benefits.",
        empathy: "Ability to connect with customer emotions and needs.",
        closing: "Effectiveness in asking for the sale.",
        objection_handling: "Skill in resolving customer concerns.",
        needs_discovery: "Asking right questions to identify needs."
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        // Fetching for a default/dummy user "u_01" for visualization
        const res = await operatorApi.getUserPerformance('u_01');
        if (res.success) {
            setStats(res.data.performance);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Coaching Center...</div>;
    if (!stats) return <div className="p-8 text-center text-slate-500">No data found.</div>;

    const MetricCard = ({ icon: Icon, title, value, subtext, color }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-lg ${color} text-white`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                <p className="text-slate-400 text-xs mt-1">{subtext}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Coaching Center (UPM)</h1>
                    <p className="text-slate-500">Real-time skills tracking and AI recommendations.</p>
                </div>
                <ScopeSelector />
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={Activity}
                    title="Scenario Avg Score"
                    value={(stats.scenario.behaviorScore * 100).toFixed(0)}
                    subtext="Behavior analysis score"
                    color="bg-indigo-600"
                />
                <MetricCard
                    icon={Target}
                    title="Upsell Success"
                    value={`${(stats.scenario.upsellSuccessRate * 100).toFixed(0)}%`}
                    subtext={`${stats.scenario.totalSessions} sessions total`}
                    color="bg-emerald-600"
                />
                <MetricCard
                    icon={BookOpen}
                    title="Module Completion"
                    value={stats.learning.completedModules}
                    subtext={`${stats.learning.repeatCount} module repeats`}
                    color="bg-blue-600"
                />
                <MetricCard
                    icon={Brain}
                    title="Quiz Accuracy"
                    value={`${(stats.quiz.avgAccuracy * 100).toFixed(0)}%`}
                    subtext={`${stats.quiz.totalQuizzes} quizzes taken`}
                    color="bg-violet-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skill Radar (Simulated List) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} /> Skill Proficiency Matrix
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.skill).map(([skill, score]) => (
                            <div key={skill} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="capitalize text-slate-700">{skill.replace('_', ' ')}</span>
                                        <div className="group relative">
                                            <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                            {/* Custom Tooltip */}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                                {skillDescriptions[skill] || "Skill metric tracked by AI."}
                                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-slate-900">{(score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${score >= 0.8 ? 'bg-emerald-500' :
                                            score >= 0.6 ? 'bg-indigo-500' : 'bg-amber-500'
                                            }`}
                                        style={{ width: `${score * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed / Missions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Zap size={18} /> Active Missions
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-amber-700 uppercase">Active</span>
                                <span className="text-xs text-amber-600">2/3</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Daily Warmup</h4>
                            <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '66%' }}></div>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Completed</span>
                                <span className="text-xs text-green-600 font-bold">Done</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Objection Mastery</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights Console Integration */}
            <div className="pt-6 border-t border-slate-200">
                <InsightsConsole />
            </div>
        </div>
    );
}
