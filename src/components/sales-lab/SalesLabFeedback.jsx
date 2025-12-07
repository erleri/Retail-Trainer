import React from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="h-full bg-slate-50 p-4 md:p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2 mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {tFeedback.title}
                </h1>
                <p className="text-slate-500">{tFeedback.subtitle}</p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div>
                            <div className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">{score}</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Total Score</div>
                        </div>
                        <div className="w-full max-w-lg h-4 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className={clsx(
                                    "h-full rounded-full transition-all",
                                    score >= 80 ? "bg-emerald-500" :
                                        score >= 60 ? "bg-amber-500" :
                                            "bg-red-500"
                                )}
                            />
                        </div>
                        <p className="font-bold text-slate-600">
                            {score >= 85 ? "Excellent! 🎯" : score >= 70 ? "Good work! 👏" : score >= 50 ? "Keep improving! 💪" : "More practice needed! 📚"}
                        </p>
                    </div>
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100"
                >
                    <h3 className="font-bold text-lg text-indigo-900 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-indigo-100 text-indigo-600"><Award size={20} /></div>
                        {tFeedback.aiFeedback}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">{summary}</p>
                </motion.div>

                {/* Skills Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200"
                >
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Skill Analysis</h3>
                    <div className="space-y-5">
                        {chartData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-700">{item.subject}</span>
                                    <span className={clsx(
                                        "text-sm font-bold",
                                        item.A >= 80 ? "text-emerald-600" : item.A >= 60 ? "text-amber-600" : "text-red-600"
                                    )}>
                                        {item.A}%
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.A}%` }}
                                        transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                                        className={clsx(
                                            "h-full rounded-full transition-all",
                                            item.A >= 80 ? "bg-emerald-500" :
                                                item.A >= 60 ? "bg-amber-500" :
                                                    "bg-red-500"
                                        )}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Pros */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} /> {tFeedback.pros}
                        </h3>
                        <ul className="space-y-3">
                            {pros.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Cons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                            <XCircle size={20} /> {tFeedback.improvements}
                        </h3>
                        <ul className="space-y-3">
                            {cons.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Recommended Mission Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-indigo-100 mb-2 uppercase tracking-wider text-xs">
                                🎯 {tFeedback.nextMission || "Recommended Next Training"}
                            </h3>
                            <p className="text-xl font-bold">{recommendedMission?.title || "Improve Your Skills"}</p>
                            <p className="text-indigo-200 text-sm mt-1">Perfect for your next training session</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl font-black text-2xl border border-white/20">+{recommendedMission?.xp || 50} XP</div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex flex-col-reverse md:flex-row gap-4 pt-6"
                >
                    <button
                        onClick={onBack}
                        className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-all"
                    >
                        ← {tFeedback.backButton || "Back"}
                    </button>
                    <button
                        onClick={onRestart}
                        className="flex-1 px-6 py-4 bg-primary text-white hover:bg-primary-dark font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={18} />
                        {tFeedback.retryButton || "Try Again"}
                    </button>
                </motion.div>
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
