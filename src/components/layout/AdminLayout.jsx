import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText, FlaskConical, Bot,
    BarChart2, Bell, Settings, LogOut, Menu, X, Shield
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '../../store/userStore';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleRole } = useUserStore();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: FileText, label: 'Content (CMS)', path: '/admin/cms' },
        { icon: FlaskConical, label: 'Sales Lab', path: '/admin/sales-lab' },
        { icon: Bot, label: 'AI Quality', path: '/admin/ai-quality' },
        { icon: BarChart2, label: 'KPI / Analytics', path: '/admin/analytics' },
        { icon: Bell, label: 'Campaigns', path: '/admin/campaigns' },
        { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        // For demo purposes, just toggle role back to user and go home
        toggleRole();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                !isSidebarOpen && "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Shield className="text-blue-400" />
                        <span>Admin Console</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="px-4 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Exit Admin Mode</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between lg:justify-end">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <Shield size={20} className="text-slate-500" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
