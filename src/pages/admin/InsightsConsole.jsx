import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/operatorApi';
import { Sparkles, AlertTriangle, CheckCircle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export default function InsightsConsole() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getInsights('u_01');
        if (res.success) {
            setInsights(res.data.insights);
        }
        setLoading(false);
    };

    const handleGenerate = async () => {
        setGenerating(true);
        const res = await operatorApi.generateInsights('u_01');
        if (res.success) {
            setInsights(prev => [res.data.insights[0], ...prev]);
        }
        setGenerating(false);
    };

    const InsightCard = ({ insight }) => {
        const styles = {
            strength: {
                border: 'border-l-emerald-500',
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                badge: 'bg-emerald-100 text-emerald-700'
            },
            weakness: {
                border: 'border-l-rose-500',
                iconBg: 'bg-rose-50',
                iconColor: 'text-rose-600',
                badge: 'bg-rose-100 text-rose-700'
            },
            recommendation: {
                border: 'border-l-indigo-500',
                iconBg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                badge: 'bg-indigo-100 text-indigo-700'
            }
        };
        const s = styles[insight.type] || styles.recommendation;

        return (
            <div className={clsx("bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all border-l-4", s.border)}>
                <div className="flex items-start gap-4">
                    <div className={clsx("p-2 rounded-full shrink-0", s.iconBg, s.iconColor)}>
                        {insight.type === 'strength' && <Sparkles size={18} />}
                        {insight.type === 'weakness' && <AlertTriangle size={18} />}
                        {insight.type === 'recommendation' && <Lightbulb size={18} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className={clsx("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded", s.badge)}>
                                    {insight.type}
                                </span>
                                <span className="text-sm font-bold text-slate-700 capitalize">
                                    {insight.category.replace('_', ' ')}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                                Conf: {(insight.confidence * 100).toFixed(0)}%
                            </span>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed">
                            {insight.message}
                        </p>

                        {insight.actions && insight.actions.length > 0 && (
                            <div className="mt-4 flex gap-2">
                                {insight.actions.map((act, idx) => (
                                    <button
                                        key={idx}
                                        className="text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 flex items-center gap-2 hover:bg-slate-100 transition-colors"
                                    >
                                        <ArrowRight size={12} />
                                        {act.type === 'assign_content' ? 'Assign Content' :
                                            act.type === 'assign_mission' ? 'Assign Mission' : 'View Action'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const displayedInsights = showAll ? insights : insights.slice(0, 5);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-indigo-500" size={20} />
                        Insights Engine
                    </h2>
                    <p className="text-slate-500 text-sm">AI-driven analysis of user data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">
                        {insights.length} Total Analysis
                    </span>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                    >
                        <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
                        {generating ? "Analyzing..." : "Generate New"}
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin text-indigo-500 mb-2">
                            <RefreshCw size={24} className="mx-auto" />
                        </div>
                        <p className="text-slate-400 text-sm">Loading Intelligence...</p>
                    </div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No insights generated yet.
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {displayedInsights.map(ins => <InsightCard key={ins.insightId} insight={ins} />)}
                        </div>

                        {insights.length > 5 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            >
                                {showAll ? "Show Less" : `Show ${insights.length - 5} More Insights`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
