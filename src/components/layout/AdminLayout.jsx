import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Box, Users, GitBranch, MessageSquare,
    MoreHorizontal, Settings, LogOut, Shield, Menu,
    ShoppingBag, Activity, FileText, Trophy
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '../../store/userStore';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { AdminProvider } from '../../context/AdminContext';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleRole } = useUserStore();
    const { language } = useAppStore();
    const t = translations[language] || translations['en'];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Desktop Sidebar Items
    const desktopMenuItems = [
        { icon: LayoutDashboard, label: t.adminMenu.dashboard, path: '/admin' },
        { icon: Users, label: t.adminMenu.users, path: '/admin/users' },
        { icon: ShoppingBag, label: t.adminMenu.products, path: '/admin/products' },
        { icon: Users, label: t.adminMenu.customer, path: '/admin/customer' },
        { icon: GitBranch, label: t.adminMenu.salesLab, path: '/admin/sales-lab' },
        { icon: Trophy, label: t.adminMenu.gamification, path: '/admin/gamification' },
        { icon: FileText, label: t.adminMenu.cms, path: '/admin/cms' },
        { icon: Activity, label: t.adminMenu.coaching, path: '/admin/ai-quality' },
        { icon: Settings, label: t.adminMenu.settings, path: '/admin/settings' },
    ];

    // Mobile Bottom Nav Items (5 tabs max)
    const mobileNavItems = [
        { icon: ShoppingBag, label: 'Catalog', path: '/admin/products' },
        { icon: Users, label: 'Customer', path: '/admin/customer' },
        { icon: GitBranch, label: 'Sales Lab', path: '/admin/sales-lab' },
        { icon: LayoutDashboard, label: 'Dash', path: '/admin' },
        { icon: MoreHorizontal, label: 'More', action: () => setIsMobileMenuOpen(true) },
    ];

    const handleLogout = () => {
        toggleRole();
        navigate('/');
    };

    return (
        <AdminProvider>
            <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
                {/* --- DESKTOP: Sidebar (Hidden on Mobile) --- */}
                <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-40">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <Shield className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 text-lg leading-tight">Retail AI</h1>
                            <p className="text-slate-500 text-xs">Operator Console</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        {desktopMenuItems.map((item) => {
                            const Icon = item.icon;
                            // Fix: Dashboard (/admin) should not match others like /admin/users
                            const isActive = item.path === '/admin'
                                ? location.pathname === '/admin'
                                : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                                        isActive
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <LogOut size={18} />
                            <span>Exit Console</span>
                        </button>
                    </div>
                </aside>

                {/* --- MOBILE: Top App Bar --- */}
                <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
                    <div className="font-bold text-slate-900 text-lg">
                        {desktopMenuItems.find(i => i.path === location.pathname)?.label || 'Admin'}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <Shield size={16} className="text-slate-600" />
                        </div>
                    </div>
                </header>

                {/* --- MAIN CONTENT AREA --- */}
                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
                    <Outlet />
                </main>

                {/* --- MOBILE: Bottom Navigation --- */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-50 flex items-center justify-around pb-safe">
                    {mobileNavItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

                        return (
                            <button
                                key={idx}
                                onClick={item.action ? item.action : () => navigate(item.path)}
                                className="flex flex-col items-center justify-center w-full h-full gap-1"
                            >
                                <Icon
                                    size={24}
                                    className={clsx(isActive ? "text-blue-600" : "text-slate-400")}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={clsx("text-[10px] font-medium", isActive ? "text-blue-600" : "text-slate-500")}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* --- MOBILE: More Menu (Drawer) --- */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom">
                            <h3 className="font-bold text-lg mb-4">More Options</h3>
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {desktopMenuItems.slice(3).map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex flex-col items-center gap-2 p-2"
                                        >
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700">
                                                <Icon size={24} />
                                            </div>
                                            <span className="text-xs text-center font-medium text-slate-600">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl"
                            >
                                Exit Console
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminProvider>
    );
}
