import React from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { clsx } from 'clsx';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) { // eslint-disable-line no-unused-vars
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("SalesLabFeedback Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h2>
                    <p className="text-gray-600 mb-4">We encountered an error while displaying the feedback.</p>
                    <details className="text-left bg-gray-100 p-4 rounded text-xs overflow-auto max-w-2xl mx-auto">
                        <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                        <pre>{this.state.error && this.state.error.toString()}</pre>
                        <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

function SalesLabFeedbackContent({ result, onRestart, onBack, onViewHistory }) { // eslint-disable-line no-unused-vars
    const { language } = useAppStore();
    const t = translations[language] || translations['en'];
    // Defensive check: Ensure t and t.salesLab.feedback exist
    const tFeedback = (t && t.salesLab && t.salesLab.feedback) ? t.salesLab.feedback : translations['en'].salesLab.feedback;

    // Sanitize & Default Data
    const safeResult = result || {};
    const score = typeof safeResult.totalScore === 'number' ? safeResult.totalScore : 0;
    const summary = typeof safeResult.summary === 'string' ? safeResult.summary : "No summary available.";

    const pros = Array.isArray(safeResult.pros) ? safeResult.pros : ["Active Listening", "Clear Value Proposition"];
    const cons = Array.isArray(safeResult.improvements) ? safeResult.improvements : ["Missed closing signal", "Could ask more open questions"];

    const recommendedMission = safeResult.recommendedMission || { title: "Closing Techniques", xp: 50 };

    // Chart Data
    const rawScores = (Array.isArray(safeResult.scores) && safeResult.scores.length > 0) ? safeResult.scores : [];
    const chartData = rawScores.map(s => ({
        subject: typeof s.subject === 'string' ? s.subject : 'Unknown',
        A: typeof s.A === 'number' ? s.A : 0,
        fullMark: 100
    }));

    // Fallback if empty after sanitization
    if (chartData.length === 0) {
        chartData.push(
            { subject: 'Product Knowledge', A: 0, fullMark: 100 },
            { subject: 'Objection Handling', A: 0, fullMark: 100 },
            { subject: 'Empathy', A: 0, fullMark: 100 },
            { subject: 'Policy', A: 0, fullMark: 100 },
            { subject: 'Conversation', A: 0, fullMark: 100 }
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 h-full overflow-y-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-text-primary">{tFeedback.title}</h1>
                <p className="text-text-secondary">{tFeedback.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score & Bar Chart (Replaced RadarChart for Stability) */}
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 flex flex-col justify-center min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center">
                            <span className="text-5xl font-bold gradient-text">{score}</span>
                            <span className="text-sm text-gray-400 block">/ 100</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-text-primary">Skill Analysis</div>
                            <div className="text-xs text-text-secondary">Performance Breakdown</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {chartData.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-text-secondary">
                                    <span>{item.subject}</span>
                                    <span>{item.A}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.A}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={clsx(
                                            "h-full rounded-full",
                                            item.A >= 80 ? "bg-green-500" :
                                                item.A >= 60 ? "bg-yellow-500" : "bg-red-500"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Award className="text-primary" size={20} />
                        {tFeedback.aiFeedback}
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{summary}</p>
                </div>

                {/* Pros */}
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} /> {tFeedback.pros}
                    </h3>
                    <ul className="space-y-3">
                        {pros.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-green-700 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cons */}
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                        <XCircle size={20} /> {tFeedback.improvements}
                    </h3>
                    <ul className="space-y-3">
                        {cons.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-red-700 text-sm">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recommended Mission */}
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 md:col-span-2 flex items-center justify-between bg-gradient-to-r from-white/50 to-primary/5">
                    <div>
                        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-text-primary">
                            <Award className="text-primary" /> {tFeedback.mission}
                        </h3>
                        <p className="text-text-secondary text-sm">{recommendedMission.title} (+{recommendedMission.xp} XP)</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2 shadow-lg">
                        {tFeedback.startMission} <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <div className="flex gap-4 w-full max-w-md">
                    <button
                        onClick={onBack}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={20} /> {tFeedback.backToLab}
                    </button>
                    <button
                        onClick={onViewHistory}
                        className="flex-[2] btn-primary flex items-center justify-center gap-2 shadow-glow"
                    >
                        <Award size={24} fill="currentColor" /> {tFeedback.viewHistory}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SalesLabFeedback({ feedback, onRestart, onBack, onViewHistory }) {
    return (
        <ErrorBoundary>
            <SalesLabFeedbackContent result={feedback} onRestart={onRestart} onBack={onBack} onViewHistory={onViewHistory} />
        </ErrorBoundary>
    );
}
