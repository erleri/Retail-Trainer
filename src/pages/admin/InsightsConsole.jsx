import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/operatorApi';
import { Sparkles, AlertTriangle, CheckCircle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export default function InsightsConsole() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

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
            strength: { bg: 'bg-green-50', border: 'border-green-100', icon: 'text-green-600', title: 'text-green-800' },
            weakness: { bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-500', title: 'text-red-800' },
            recommendation: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-600', title: 'text-blue-800' }
        };
        const s = styles[insight.type] || styles.recommendation;

        return (
            <div className={clsx("rounded-xl border p-5 transition-all hover:shadow-md", s.bg, s.border)}>
                <div className="flex items-start gap-4">
                    <div className={clsx("p-2 bg-white rounded-lg shadow-sm shrink-0", s.icon)}>
                        {insight.type === 'strength' && <Sparkles size={20} />}
                        {insight.type === 'weakness' && <AlertTriangle size={20} />}
                        {insight.type === 'recommendation' && <Lightbulb size={20} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={clsx("font-bold capitalize", s.title)}>{insight.type} • {insight.category.replace('_', ' ')}</h4>
                            <span className="text-xs font-bold text-slate-400 bg-white/50 px-2 py-1 rounded">
                                Conf: {(insight.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                        <p className="text-slate-700 mt-2 leading-relaxed font-medium">
                            {insight.message}
                        </p>

                        {insight.actions && insight.actions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-black/5 flex gap-2">
                                {insight.actions.map((act, idx) => (
                                    <button
                                        key={idx}
                                        className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm text-slate-700 flex items-center gap-2 hover:bg-slate-50"
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

    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-indigo-500" />
                        Insights Engine
                    </h1>
                    <p className="text-slate-500">AI-driven analysis of user performance and needs.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                    <RefreshCw size={18} className={generating ? "animate-spin" : ""} />
                    {generating ? "AI Analyzing..." : "Generate New Insights"}
                </button>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading Intelligence...</div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No insights generated yet. Click the button above.
                    </div>
                ) : (
                    insights.map(ins => <InsightCard key={ins.insightId} insight={ins} />)
                )}
            </div>
        </div>
    );
}
