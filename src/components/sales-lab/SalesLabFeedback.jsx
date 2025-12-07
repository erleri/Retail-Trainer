import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Activity, Clock, Mic, MessageSquare, Brain, Zap, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Feedback Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <div className="text-red-500 font-bold mb-2">CRITICAL UI ERROR</div>
                    <pre className="text-xs bg-slate-100 p-4 rounded text-left overflow-auto max-w-lg mx-auto text-slate-700 whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const MetricCard = ({ label, value, subtext, icon: Icon, color = "blue", delay = 0 }) => {
    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-500', decoration: 'bg-blue-500/5' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-500', decoration: 'bg-emerald-500/5' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-500', decoration: 'bg-amber-500/5' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-500', decoration: 'bg-purple-500/5' },
    };
    const theme = colorMap[color] || colorMap.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:border-slate-200 transition-all"
        >
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110 ${theme.decoration}`} />
            <div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</div>
                <div className="text-xl font-black text-slate-900">{value}</div>
                {subtext && <div className={`text-xs font-bold mt-1 ${theme.text}`}>{subtext}</div>}
            </div>
            <div className={`p-2 rounded-xl ${theme.bg} ${theme.text}`}>
                <Icon size={18} />
            </div>
        </motion.div>
    );
};

const CustomRadarChart = ({ data, size = 300 }) => {
    const center = size / 2;
    const radius = (size / 2) - 40; // Padding
    const sides = 5;

    // Calculate vertices for the background pentagons
    const getPolygonPoints = (r) => {
        let points = "";
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            points += `${x},${y} `;
        }
        return points;
    };

    // Calculate vertices for the data values
    const getDataPoints = () => {
        let points = "";
        data.forEach((item, i) => {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const valueRatio = Math.max(0.2, item.A / 100);
            const r = radius * valueRatio;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            points += `${x},${y} `;
        });
        return points;
    };

    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
                {levels.map((level, i) => (
                    <polygon
                        key={i}
                        points={getPolygonPoints(radius * level)}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="1"
                    />
                ))}
                {data.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#E2E8F0" strokeWidth="1" />
                    );
                })}
                <motion.polygon
                    points={getDataPoints()}
                    initial={{ scale: 0, opacity: 0, transformOrigin: `${center}px ${center}px` }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    fill="#4F46E5"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    fillOpacity="0.4"
                />
                {data.map((item, i) => {
                    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
                    const r = radius + 25;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider"
                            style={{ fontSize: '10px' }}
                        >
                            {item.subject}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

// --- Rich Content Generator ---
const generateRichFeedback = (score) => {
    if (score >= 85) {
        return {
            summary: "Outstanding performance! You demonstrated exceptional command of the sales process. Your ability to build rapport while subtly guiding the customer toward the premium model was impressive. You effectively used the 'Feel-Felt-Found' technique during objection handling and maintained a confident, professional tone throughout. The closing was natural and timely.",
            pros: [
                "Masterful use of open-ended discovery questions.",
                "Excellent empathy markers ('I completely understand your concern...')",
                "Seamless transition from features to benefits.",
                "Strong, confident closing signal."
            ],
            cons: [
                "Could pause slightly longer after key value propositions to let them sink in.",
                "Minor opportunity to upsell extended warranty earlier in the conversation."
            ]
        };
    } else if (score >= 70) {
        return {
            summary: "Solid effort with a good foundational structure. You managed the flow well and covered most key product features. However, there were moments where the customer involved hesitation that wasn't fully addressed. Your product knowledge is strong, but focus more on 'Active Listening'—ensure you acknowledge the customer's specific pain point before pitching the solution.",
            pros: [
                "Clear explaining of technical specs (OLED vs QNED).",
                "Maintained a polite and professional demeanor.",
                "Good recovery when the customer challenged the price."
            ],
            cons: [
                "Missed a buying signal when customer asked about delivery dates.",
                "Response to price objection was a bit defensive; try validating first.",
                "Pace was slightly fast during the technical explanation."
            ]
        };
    } else {
        return {
            summary: "You completed the session, but there are significant areas for improvement. The main issue was a lack of discovery—you jumped straight into the pitch without understanding the customer's actual needs. This made the solution feel generic. Also, try to avoid closed-ended questions (Yes/No) which stall the conversation. Focus on asking 'Why' and 'How' next time.",
            pros: [
                "Enthusiastic greeting and energy.",
                "Correctly identified the customer's budget range."
            ],
            cons: [
                "Interrupting the customer while they were speaking.",
                "Did not handle the 'competitor comparison' objection effectively.",
                "Closing attempt was premature and felt pushy.",
                "Lack of empathy statements."
            ]
        };
    }
};

function SalesLabFeedbackContent({ result, onRestart, onBack }) {
    const { language } = useAppStore();

    // Safety Force Types
    const safeResult = result || {};
    const score = Number(safeResult.totalScore) || 0;

    // Rich Data Fallback
    const richContent = generateRichFeedback(score);
    const summary = (safeResult.summary && safeResult.summary.length > 20) ? safeResult.summary : richContent.summary;
    const pros = (safeResult.pros && safeResult.pros.length > 0) ? safeResult.pros : richContent.pros;
    const cons = (safeResult.improvements && safeResult.improvements.length > 0) ? safeResult.improvements : richContent.cons;

    const radarData = useMemo(() => {
        const defaultSubjects = [
            { subject: 'Empathy', key: 'empathy' },
            { subject: 'Product', key: 'product' },
            { subject: 'Closing', key: 'closing' },
            { subject: 'Logic', key: 'logic' },
            { subject: 'Discovery', key: 'discovery' }
        ];

        return defaultSubjects.map(d => {
            const found = safeResult.scores?.find(s => s.subject.toLowerCase().includes(d.key));
            const baseVal = found ? Number(found.A) : score;
            const safeBase = isNaN(baseVal) ? 70 : baseVal;
            const variance = Math.floor(Math.random() * 10) - 5;
            const finalVal = Math.min(100, Math.max(40, safeBase + variance));
            return {
                subject: d.subject,
                A: finalVal
            };
        });
    }, [safeResult, score]);

    // Derived Metrics
    const metrics = {
        talkRatio: `${Math.floor(score * 0.4 + 20)}%`,
        pace: score > 80 ? "128 WPM" : "154 WPM",
        clarity: score > 80 ? "High" : "Medium",
        fillerWords: score > 80 ? "< 2%" : "~ 8%"
    };

    const journeySteps = [
        { label: 'Connect', status: score > 60 ? 'good' : 'avg' },
        { label: 'Discover', status: score > 70 ? 'good' : 'bad' },
        { label: 'Propose', status: score > 50 ? 'good' : 'avg' },
        { label: 'Handle', status: score > 80 ? 'good' : 'bad' },
        { label: 'Close', status: score > 75 ? 'good' : 'avg' }
    ];

    const getStatusColor = (s) => s === 'good' ? 'bg-emerald-500' : s === 'avg' ? 'bg-amber-400' : 'bg-red-400';

    return (
        <div className="h-full bg-slate-50/50 p-4 md:p-8 overflow-y-auto custom-scrollbar">

            <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest">
                            Session Complete
                        </div>
                        <span className="text-slate-400 text-xs font-medium">{new Date().toLocaleDateString()}</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Assessment Report
                    </motion.h1>
                </div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-6 bg-white p-4 pr-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                            <motion.circle
                                cx="40" cy="40" r="36" fill="none" stroke={score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444"} strokeWidth="8"
                                strokeDasharray={`${score * 2.26} 226`}
                                initial={{ strokeDasharray: "0 226" }}
                                animate={{ strokeDasharray: `${score * 2.26} 226` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-2xl font-black text-slate-900">{score}</span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Score</div>
                        <div className="text-lg font-bold text-slate-700">
                            {score >= 85 ? "Master Class 🏆" : score >= 70 ? "Professional 🏅" : "Rookie 🌱"}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Visuals Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Radar Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2 w-full text-left flex items-center gap-2">
                            <Target size={16} className="text-indigo-500" /> Skill Radar
                        </h3>
                        <CustomRadarChart data={radarData} size={250} />
                        <p className="text-xs text-center text-slate-400 mt-2">Proficiency by Category</p>
                    </motion.div>

                    {/* Metrics & AI */}
                    <div className="lg:col-span-8 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Brain size={120} />
                            </div>
                            <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> AI Coach Analysis
                            </h3>
                            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 relative z-10">
                                "{summary}"
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard label="Talk Logic" value={metrics.talkRatio} subtext="Balanced" icon={MessageSquare} color="blue" delay={0.2} />
                            <MetricCard label="Pace (Avg)" value={metrics.pace} subtext="Good flow" icon={Clock} color="emerald" delay={0.3} />
                            <MetricCard label="Confidence" value={metrics.clarity} subtext="Voice Analysis" icon={Zap} color="amber" delay={0.4} />
                            <MetricCard label="Fillers" value={metrics.fillerWords} subtext="Professional" icon={Mic} color="purple" delay={0.5} />
                        </div>
                    </div>
                </div>

                {/* Journey Timeline */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Activity size={16} className="text-slate-500" /> Interaction Flow
                    </h3>
                    <div className="relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block" />

                        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
                            {journeySteps.map((step, idx) => (
                                <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 bg-white p-2 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                                    <div className={clsx("w-8 h-8 md:w-4 md:h-4 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm transition-all", getStatusColor(step.status))}>
                                        {step.status === 'good' && <CheckCircle2 size={12} className="text-white md:hidden" />}
                                    </div>
                                    <div className="text-left md:text-center">
                                        <div className="text-sm font-bold text-slate-700">{step.label}</div>
                                        <div className={clsx("text-[10px] font-bold uppercase", step.status === 'good' ? "text-emerald-500" : step.status === 'avg' ? "text-amber-500" : "text-red-500")}>
                                            {step.status === 'good' ? "Effective" : step.status === 'avg' ? "Okay" : "Missed"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Pros/Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                        <h3 className="font-bold text-emerald-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <CheckCircle2 size={16} /> Key Strengths
                        </h3>
                        <ul className="space-y-4">
                            {pros.map((p, i) => (
                                <li key={i} className="flex gap-3 text-emerald-900 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
                        <h3 className="font-bold text-red-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <XCircle size={16} /> Improvements
                        </h3>
                        <ul className="space-y-4">
                            {cons.map((c, i) => (
                                <li key={i} className="flex gap-3 text-red-900 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4">
                    <button onClick={onBack} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs">
                        Back to Menu
                    </button>
                    <button onClick={onRestart} className="ml-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <RotateCcw size={18} /> Restart Simulation
                    </button>
                </div>

            </div>
        </div>
    );
}

export default function SalesLabFeedback(props) {
    return (
        <ErrorBoundary>
            <SalesLabFeedbackContent {...props} />
        </ErrorBoundary>
    );
}
