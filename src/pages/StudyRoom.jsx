import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { BookOpen, ChevronRight, PlayCircle, CheckCircle2, Star, Cpu, Zap, Layout, ArrowLeft, Sparkles, Undo2, MessageSquare, FolderOpen, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store/appStore';
import { translations } from '../constants/translations';
import StudyRoomFAQ from '../components/study/StudyRoomFAQ';
import StudyResources from '../components/study/StudyResources';
import { localDB } from '../lib/storage';

export default function StudyRoom() {
    const { language } = useAppStore();
    const [showOriginal, setShowOriginal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { tabId } = useParams();

    // Determine which language to display
    const displayLanguage = showOriginal ? 'ko' : language;
    const t = translations[displayLanguage] || translations['en'];
    const isAiTranslated = language === 'es' || language === 'pt-br';

    // Get courses from translations with safety check
    const defaultCourses = t?.study?.courses || [];
    const [customCourses, setCustomCourses] = useState([]);

    const loadCustomCourses = async () => {
        try {
            const saved = await localDB.getCourses();
            setCustomCourses(saved);
        } catch (e) {
            console.error("Failed to load custom courses", e);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCustomCourses();
    }, []);

    const COURSES = [...customCourses, ...defaultCourses];

    // Tab State
    const [activeTab, setActiveTab] = useState('curriculum');

    // Course Navigation State
    const [activeCourseId, setActiveCourseId] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState('m1');

    // Check for navigation state or URL params to switch tabs
    useEffect(() => {
        if (tabId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab(tabId);
        } else if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            // Clear state to prevent stuck navigation
            window.history.replaceState({}, document.title);
        }
    }, [location.state, tabId]);

    const activeCourse = activeCourseId ? COURSES.find(c => c.id === activeCourseId) : null;
    const activeModuleIndex = activeCourse ? activeCourse.modules.findIndex(m => m.id === activeModuleId) : 0;
    const activeModule = activeCourse ? activeCourse.modules[activeModuleIndex] : null;

    const tabs = [
        { id: 'curriculum', label: t?.study?.tabs?.curriculum || 'Curriculum', icon: BookOpen },
        { id: 'resources', label: t?.study?.tabs?.resources || 'Resources', icon: FolderOpen },
        { id: 'discussion', label: t?.study?.tabs?.discussion || 'Discussion', icon: MessageSquare },
        { id: 'faq', label: t?.study?.tabs?.faq || 'FAQ', icon: HelpCircle },
    ];

    // Render Course Content (Existing Logic)
    if (activeCourse && activeModule) {
        return (
            <div className="h-full flex flex-col">
                {/* Course Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setActiveCourseId(null)}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                            {activeCourse.title}
                            {isAiTranslated && (
                                <button
                                    onClick={() => setShowOriginal(!showOriginal)}
                                    className={clsx(
                                        "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 transition-colors shadow-sm",
                                        showOriginal
                                            ? "bg-white/50 text-gray-600 border border-gray-200"
                                            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-glow"
                                    )}
                                >
                                    {showOriginal ? <Undo2 size={12} /> : <Sparkles size={12} />}
                                    {showOriginal ? "Original" : "AI Translated"}
                                </button>
                            )}
                        </h1>
                        <p className="text-sm text-text-secondary">
                            Module {activeModuleIndex + 1} of {activeCourse.modules.length}
                        </p>
                    </div>
                </div>

                {/* Module Content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            key={activeModule.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    {activeModule.id === 'm1' && <Star size={24} />}
                                    {activeModule.id === 'm2' && <Cpu size={24} />}
                                    {activeModule.id === 'm3' && <Zap size={24} />}
                                    {activeModule.id === 'm4' && <Layout size={24} />}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">{activeModule.title}</h2>
                            </div>

                            <div className="space-y-8">
                                {activeModule.content.map((block, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-lg font-bold text-slate-900">{block.heading}</h3>

                                        {block.type === 'text' && (
                                            <p className="text-slate-600 leading-relaxed text-base">{block.body}</p>
                                        )}

                                        {block.type === 'key-point' && (
                                            <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 text-amber-900 flex gap-3">
                                                <Sparkles className="flex-shrink-0 text-amber-500 mt-1" size={18} />
                                                <p className="font-medium">{block.body}</p>
                                            </div>
                                        )}

                                        {block.type === 'list' && (
                                            <ul className="space-y-3 mt-2">
                                                {block.items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                                        <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
                                                        }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => {
                                    const prevIndex = Math.max(0, activeModuleIndex - 1);
                                    setActiveModuleId(activeCourse.modules[prevIndex].id);
                                }}
                                disabled={activeModuleIndex === 0}
                                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
                            >
                                {t?.study?.prevModule || 'Prev'}
                            </button>
                            <button
                                onClick={() => {
                                    if (activeModuleIndex < activeCourse.modules.length - 1) {
                                        const nextIndex = activeModuleIndex + 1;
                                        setActiveModuleId(activeCourse.modules[nextIndex].id);
                                    } else {
                                        navigate('/quiz', { state: { courseId: activeCourse.id } }); // Go to Quiz with ID
                                    }
                                }}
                                className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all"
                            >
                                {activeModuleIndex === activeCourse.modules.length - 1
                                    ? (t?.study?.finishCourse || 'Finish')
                                    : (t?.study?.nextModule || 'Next')}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar: Module List */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6">
                        <h3 className="font-bold text-slate-900 mb-4 px-2">Course Curriculum</h3>
                        <div className="space-y-2">
                            {activeCourse.modules.map((module, idx) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModuleId(module.id)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border",
                                        module.id === activeModuleId
                                            ? "bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm"
                                            : "border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                        module.id === activeModuleId ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-bold truncate">{module.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Study Room View (with Tabs)
    return (
        <div className="space-y-8 p-4 md:p-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t?.study?.title || 'Study Room'}</h1>
                <p className="text-slate-500">{t?.study?.subtitle || 'Welcome'}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/study/${tab.id}`)}
                        className={clsx(
                            "px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors",
                            activeTab === tab.id
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'curriculum' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {COURSES.map(course => (
                            <div
                                key={course.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 hover:border-indigo-100"
                                onClick={() => {
                                    setActiveCourseId(course.id);
                                    setActiveModuleId(course.modules[0].id);
                                }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                                        {course.category}
                                    </span>
                                    <span className="text-slate-400 text-sm flex items-center gap-1 font-medium">
                                        <PlayCircle size={16} /> {course.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <BookOpen size={16} />
                                        <span>{course.modules.length} Modules</span>
                                    </div>

                                    {/* Mock Progress Bar */}
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `0%` }} />
                                    </div>

                                    <button className="w-full py-2.5 border border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all text-sm shadow-sm group-hover:shadow-md">
                                        {t?.common?.startNow || 'Start Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'faq' && <StudyRoomFAQ />}

                {activeTab === 'resources' && <StudyResources />}

                {activeTab === 'discussion' && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-medium">Discussion forum coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
