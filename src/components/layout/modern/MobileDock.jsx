import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FlaskConical, Bot, BookOpen, User } from 'lucide-react';
import { clsx } from 'clsx';
import { translations } from '../../../constants/translations';
import { useAppStore } from '../../../store/appStore';

export function MobileDock() {
    const location = useLocation();
    const { language } = useAppStore();
    const t = translations[language] || translations['en'];

    const menuItems = [
        { icon: LayoutDashboard, label: t.nav.home, path: '/' },
        { icon: FlaskConical, label: t.nav.salesLab, path: '/sales-lab' },
        { icon: Bot, label: t.nav.aiTrainer, path: '/ai-trainer' },
        { icon: BookOpen, label: t.nav.study, path: '/study' },
        { icon: User, label: t.nav.my, path: '/my' },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <nav className="bg-surface-glass backdrop-blur-xl border border-white/40 shadow-glass rounded-2xl flex justify-between items-center px-2 py-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex-1 flex flex-col items-center justify-center py-2"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-active"
                                    className="absolute inset-0 bg-white/50 rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    "relative z-10 flex flex-col items-center gap-1 transition-colors",
                                    isActive ? "text-primary" : "text-slate-500"
                                )}
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={clsx(isActive && "drop-shadow-sm")}
                                />
                                <span className="text-[10px] font-bold">
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
