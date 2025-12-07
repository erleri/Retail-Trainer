import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FlaskConical, Bot, BookOpen, User, Settings, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { translations } from '../../../constants/translations';
import { useAppStore } from '../../../store/appStore';
import { useUserStore } from '../../../store/userStore';

export function Sidebar() {
    const location = useLocation();
    const { language } = useAppStore();
    const t = translations[language] || translations['en'];
    const { role, toggleRole } = useUserStore();

    const menuItems = [
        { icon: LayoutDashboard, label: t.nav.home, path: '/' },
        { icon: FlaskConical, label: t.nav.salesLab, path: '/sales-lab' },
        { icon: Bot, label: t.nav.aiTrainer, path: '/ai-trainer' },
        { icon: BookOpen, label: t.nav.study, path: '/study' },
        { icon: User, label: t.nav.my, path: '/my' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 p-4">
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl border border-white/40 shadow-float rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-cosmic flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Shield size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-cosmic">
                                Retail Trainer
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">AI Coaching System</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative block"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border-l-4 border-primary"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div
                                    className={clsx(
                                        "relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                        isActive ? "text-primary font-bold" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                                    )}
                                >
                                    <Icon
                                        size={20}
                                        className={clsx(isActive && "drop-shadow-sm text-primary")}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer/Admin */}
                <div className="p-4 border-t border-white/20 bg-white/30">
                    <button
                        onClick={() => {
                            if (role !== 'admin') toggleRole();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/50 transition-all border border-dashed border-slate-300 hover:border-slate-400 group"
                    >
                        <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                        <Link to="/admin" className="flex-1 text-left text-sm font-medium">Admin Console</Link>
                    </button>

                    <div className="mt-4 flex items-center justify-between px-2 text-xs text-slate-400 font-medium">
                        <span>v1.2.0 Cosmic</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Online
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
