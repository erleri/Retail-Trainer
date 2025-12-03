import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, Target, BarChart2, Settings, Menu, X, Globe, BookOpen, Bot, ChevronDown, Check, Sparkles, Undo2, FlaskConical, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../../store/appStore';
import { useUserStore } from '../../store/userStore';
import { translations } from '../../constants/translations';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt-br', label: 'Português', flag: '🇧🇷' },
];

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const location = useLocation();
    const { language, setLanguage } = useAppStore();

    const t = translations[language] || translations['en'];
    const langMenuRef = useRef(null);

    // Close language menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setIsLangMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: t.nav.home, path: '/' },
        { icon: FlaskConical, label: t.nav.salesLab, path: '/sales-lab' },
        { icon: Bot, label: t.nav.aiTrainer, path: '/ai-trainer' },
        { icon: BookOpen, label: t.nav.study, path: '/study' },
        { icon: User, label: t.nav.my, path: '/my' },
    ];

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden bg-white/80 backdrop-blur-md p-4 flex justify-between items-center shadow-sm sticky top-0 z-30 border-b border-white/20">
                <h1 className="text-xl font-bold gradient-text">{t.header.title}</h1>
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Button Removed as per request */}
                </div>
            </header>

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={twMerge(
                "fixed md:static inset-y-0 left-0 z-50 w-64 bg-primary text-white shadow-2xl transform transition-transform duration-300 ease-in-out md:transform-none flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{t.header.title}</h1>
                </div>

                <nav className="mt-4 px-4 space-y-2 flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={20} className={clsx("transition-colors", isActive ? "text-secondary" : "group-hover:text-white")} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Entry Point (Conditional) */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => {
                            const isCurrentlyAdmin = useUserStore.getState().role === 'admin';
                            if (!isCurrentlyAdmin) {
                                useUserStore.getState().toggleRole();
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all border border-dashed border-gray-700 hover:border-gray-500"
                    >
                        <Settings size={20} />
                        <Link to="/admin" className="flex-1 text-left">Admin Console</Link>
                    </button>
                </div>

                {/* Language Dropdown (Bottom of Sidebar) */}
                <div className="p-4 border-t border-gray-800 relative" ref={langMenuRef}>
                    <button
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center justify-between px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-white/5 transition-colors border border-gray-700 bg-gray-800/50"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{currentLang.flag}</span>
                            <span className="font-medium text-sm">{currentLang.label}</span>
                        </div>
                        <ChevronDown size={16} className={clsx("transition-transform", isLangMenuOpen && "rotate-180")} />
                    </button>

                    {isLangMenuOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors",
                                        language === lang.code ? "text-secondary font-bold bg-white/5" : "text-gray-400"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </div>
                                    {language === lang.code && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100dvh-64px-80px)] md:h-screen bg-gradient-to-br from-background to-gray-100 pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto h-full">
                    <Outlet />


                    {/* Overlay for mobile sidebar */}
                    {
                        isSidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        )
                    }
                </div>
            </main>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-2 flex justify-between items-center z-40 pb-safe safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                                isActive
                                    ? "text-primary bg-primary/5"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <div className="relative">
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={clsx("transition-transform duration-200", isActive && "scale-110")} />
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </div>
                            <span className={clsx("text-[10px] font-medium transition-colors", isActive ? "text-primary font-bold" : "text-gray-500")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
