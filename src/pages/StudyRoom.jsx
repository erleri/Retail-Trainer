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
                            className="glass-card p-8 rounded-2xl shadow-sm border border-white/20 bg-white/50 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl text-primary shadow-inner">
                                    {activeModule.id === 'm1' && <Star size={24} />}
                                    {activeModule.id === 'm2' && <Cpu size={24} />}
                                    {activeModule.id === 'm3' && <Zap size={24} />}
                                    {activeModule.id === 'm4' && <Layout size={24} />}
                                </div>
                                <h2 className="text-2xl font-bold text-text-primary">{activeModule.title}</h2>
                            </div>

                            <div className="space-y-8">
                                {activeModule.content.map((block, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-lg font-bold text-text-primary">{block.heading}</h3>

                                        {block.type === 'text' && (
                                            <p className="text-text-secondary leading-relaxed">{block.body}</p>
                                        )}

                                        {block.type === 'key-point' && (
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900">
                                                <p className="font-medium">{block.body}</p>
                                            </div>
                                        )}

                                        {block.type === 'list' && (
                                            <ul className="space-y-2">
                                                {block.items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-text-secondary">
                                                        <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
                                                        }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    const prevIndex = Math.max(0, activeModuleIndex - 1);
                                    setActiveModuleId(activeCourse.modules[prevIndex].id);
                                }}
                                disabled={activeModuleIndex === 0}
                                className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-gray-200"
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
                                className="btn-primary flex items-center gap-2 shadow-lg"
                            >
                                {activeModuleIndex === activeCourse.modules.length - 1
                                    ? (t?.study?.finishCourse || 'Finish')
                                    : (t?.study?.nextModule || 'Next')}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar: Module List */}
                    <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 h-fit bg-white/50 backdrop-blur-sm">
                        <h3 className="font-bold text-text-primary mb-4">Course Curriculum</h3>
                        <div className="space-y-2">
                            {activeCourse.modules.map((module, idx) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModuleId(module.id)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                                        module.id === activeModuleId
                                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md transform scale-105"
                                            : "hover:bg-white/50 text-text-secondary hover:text-primary"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                                        module.id === activeModuleId ? "border-white text-white" : "border-gray-300 text-gray-500"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-medium truncate">{module.title}</span>
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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">{t?.study?.title || 'Study Room'}</h1>
                <p className="text-text-secondary">{t?.study?.subtitle || 'Welcome'}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/study/${tab.id}`)}
                        className={clsx(
                            "px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors",
                            activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-700"
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
                                className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 hover:shadow-lg transition-all cursor-pointer group bg-white/50 backdrop-blur-sm hover:-translate-y-1"
                                onClick={() => {
                                    setActiveCourseId(course.id);
                                    setActiveModuleId(course.modules[0].id);
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        {course.category}
                                    </span>
                                    <span className="text-text-secondary text-sm flex items-center gap-1">
                                        <PlayCircle size={16} /> {course.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <BookOpen size={16} />
                                        <span>{course.modules.length} Modules</span>
                                    </div>

                                    {/* Mock Progress Bar */}
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: `0%` }} />
                                    </div>

                                    <button className="w-full py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm shadow-sm">
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
                    <div className="text-center py-20 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Discussion forum coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
