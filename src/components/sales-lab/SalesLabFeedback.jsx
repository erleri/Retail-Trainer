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
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-blue-50/30 p-3 md:p-6 space-y-6 md:space-y-8 h-full overflow-y-auto">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    {tFeedback.title}
                </h1>
                <p className="text-sm md:text-base text-text-secondary">{tFeedback.subtitle}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                {/* Score Card - Full Width on Mobile */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-white/20 text-center"
                >
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                        <div>
                            <div className="text-6xl md:text-8xl font-black gradient-text">{score}</div>
                            <div className="text-xs md:text-sm text-gray-400 mt-1">/ 100</div>
                        </div>
                        <div className="w-full h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className={clsx(
                                    "h-full rounded-full transition-all",
                                    score >= 80 ? "bg-gradient-to-r from-green-400 to-green-600" :
                                        score >= 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                                            "bg-gradient-to-r from-red-400 to-red-600"
                                )}
                            />
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-text-secondary">
                            {score >= 85 ? "Excellent! 🎯" : score >= 70 ? "Good work! 👏" : score >= 50 ? "Keep improving! 💪" : "More practice needed! 📚"}
                        </p>
                    </div>
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-blue-100 shadow-lg"
                >
                    <h3 className="font-bold text-lg md:text-xl text-text-primary mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                        <Award className="text-primary flex-shrink-0" size={24} />
                        {tFeedback.aiFeedback}
                    </h3>
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">{summary}</p>
                </motion.div>

                {/* Skills Breakdown - Responsive Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-white/20"
                >
                    <h3 className="font-bold text-lg md:text-xl text-text-primary mb-6 md:mb-8">Skill Analysis</h3>
                    <div className="space-y-4 md:space-y-5">
                        {chartData.map((item, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm md:text-base font-bold text-text-primary">{item.subject}</span>
                                    <span className={clsx(
                                        "text-sm md:text-base font-bold",
                                        item.A >= 80 ? "text-green-600" : item.A >= 60 ? "text-yellow-600" : "text-red-600"
                                    )}>
                                        {item.A}%
                                    </span>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.A}%` }}
                                        transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                                        className={clsx(
                                            "h-full rounded-full transition-all",
                                            item.A >= 80 ? "bg-gradient-to-r from-green-400 to-green-600" :
                                                item.A >= 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                                                    "bg-gradient-to-r from-red-400 to-red-600"
                                        )}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Strengths & Improvements - Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Pros */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-green-50 to-green-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-green-100 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="font-bold text-base md:text-lg text-green-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
                            <CheckCircle2 size={20} className="md:w-6 md:h-6 flex-shrink-0" /> {tFeedback.pros}
                        </h3>
                        <ul className="space-y-3 md:space-y-4">
                            {pros.map((item, idx) => (
                                <motion.li 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.05 }}
                                    className="flex items-start gap-2 md:gap-3 text-green-700 text-sm md:text-base leading-relaxed"
                                >
                                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-1.5 md:mt-2" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Cons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-orange-100 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="font-bold text-base md:text-lg text-orange-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
                            <XCircle size={20} className="md:w-6 md:h-6 flex-shrink-0" /> {tFeedback.improvements}
                        </h3>
                        <ul className="space-y-3 md:space-y-4">
                            {cons.map((item, idx) => (
                                <motion.li 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 + idx * 0.05 }}
                                    className="flex items-start gap-2 md:gap-3 text-orange-700 text-sm md:text-base leading-relaxed"
                                >
                                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5 md:mt-2" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Recommended Mission Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-purple-100 shadow-lg"
                >
                    <h3 className="font-bold text-base md:text-lg text-purple-800 mb-3 md:mb-4">
                        🎯 {tFeedback.nextMission || "Recommended Next Training"}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm md:text-base font-semibold text-purple-900">{recommendedMission?.title || "Improve Your Skills"}</p>
                            <p className="text-xs md:text-sm text-purple-700 mt-1">Perfect for your next training session</p>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-purple-600">+{recommendedMission?.xp || 50} XP</div>
                    </div>
                </motion.div>

                {/* Action Buttons - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200"
                >
                    <button
                        onClick={onBack}
                        className="flex-1 px-4 md:px-6 py-3 md:py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm md:text-base rounded-xl md:rounded-2xl transition-all duration-200 hover:shadow-md"
                    >
                        ← {tFeedback.backButton || "Back"}
                    </button>
                    <button
                        onClick={onRestart}
                        className="flex-1 px-4 md:px-6 py-3 md:py-3.5 bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg text-white font-bold text-sm md:text-base rounded-xl md:rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={18} className="md:w-5 md:h-5" />
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
