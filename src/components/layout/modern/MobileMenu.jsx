import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, LogOut, Shield, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppStore } from '../../../store/appStore';
import { useUserStore } from '../../../store/userStore';
import { translations } from '../../../constants/translations';

export function MobileMenu({ isOpen, onClose }) {
    const { language, setLanguage, isDemoMode, toggleDemoMode } = useAppStore();
    const { user, role, toggleRole } = useUserStore();
    const t = translations[language] || translations['en'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl z-50 md:hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-bold text-lg text-slate-800">Menu</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-200">
                                    {user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500">{role === 'admin' ? 'Administrator' : 'Sales Advisor'}</p>
                                </div>
                            </div>

                            {/* Settings Group */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Settings</h3>

                                {/* Language */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                            <Globe size={18} />
                                        </div>
                                        <span className="text-sm font-medium">Language</span>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer text-right"
                                    >
                                        <option value="en">English</option>
                                        <option value="ko">한국어</option>
                                        <option value="es">Español</option>
                                        <option value="pt-br">Português</option>
                                    </select>
                                </div>

                                {/* Demo Mode Toggle */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                                            <Sparkles size={18} />
                                        </div>
                                        <span className="text-sm font-medium">Demo Mode</span>
                                    </div>
                                    <button
                                        onClick={toggleDemoMode}
                                        className={clsx(
                                            "relative w-10 h-6 rounded-full transition-colors",
                                            isDemoMode ? "bg-indigo-500" : "bg-slate-300"
                                        )}
                                    >
                                        <span
                                            className={clsx(
                                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                                                isDemoMode ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Admin Links */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">System</h3>
                                <Link
                                    to="/admin"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <Settings size={18} />
                                    </div>
                                    <span className="text-sm font-medium">Admin Console</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        if (role !== 'admin') toggleRole();
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <Shield size={18} />
                                    </div>
                                    <span className="text-sm font-medium">
                                        Switch Role ({role === 'admin' ? 'User' : 'Admin'})
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">v1.2.0 Cosmic · LG Retail Mentor AI</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
