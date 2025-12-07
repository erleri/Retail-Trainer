import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, Bell, Search, Plus, MoreVertical, AlertTriangle, CheckCircle, BarChart2, Layout, Star, Shield, Database, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const USER_LIST = [
    { id: 1, name: 'Minji Kim', role: 'Promoter', store: 'Best Buy Gangnam', status: 'Active', lastActive: '2m ago' },
    { id: 2, name: 'John Doe', role: 'Store Lead', store: 'Lotte Main', status: 'Active', lastActive: '1h ago' },
    { id: 3, name: 'Sarah Lee', role: 'Promoter', store: 'Hyundai Seoul', status: 'Inactive', lastActive: '3d ago' },
];

const CONTENT_LIST = [
    { id: 1, title: 'OLED G5 USP Guide', type: 'Training', status: 'Published', date: '2024.11.20' },
    { id: 2, title: 'Price Objection Script v2', type: 'Objection', status: 'Draft', date: '2024.11.24' },
    { id: 3, title: 'Q1 Sales Policy', type: 'Policy', status: 'Review', date: '2024.11.25' },
];

const ADMIN_KPI = [
    { label: 'Active Users', value: '1,240', trend: '+12%', color: 'text-indigo-600' },
    { label: 'Content Completion', value: '85%', trend: '+5%', color: 'text-emerald-600' },
    { label: 'Avg. Session Time', value: '12m', trend: '-2%', color: 'text-amber-600' },
];

const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
            { label: 'Active Users', value: '1,234', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Completion Rate', value: '85%', change: '+5%', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Avg. Score', value: '78/100', change: '+2.4', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'System Health', value: '99.9%', change: 'Stable', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        {stat.change}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
        ))}
    </div>
);

const UserManagement = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">User Management</h3>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                    <Plus size={18} /> Add User
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {USER_LIST.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        JD
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500">john@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={clsx(
                                    "px-3 py-1 rounded-lg text-xs font-bold border",
                                    user.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                                )}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Settings size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ContentCMS = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Content Modules</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    View All
                </button>
            </div>
            <div className="p-6 grid gap-4">
                {CONTENT_LIST.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{module.title}</h4>
                                <p className="text-xs text-slate-500">Last updated {module.date}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Database size={120} />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">System Storage</h3>
                <p className="text-indigo-200 text-sm mb-6">Manage your content assets and database usage.</p>

                <div className="space-y-4 mb-8">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-indigo-200">
                            <span>Documents</span>
                            <span>45%</span>
                        </div>
                        <div className="w-full bg-indigo-800 rounded-full h-1.5">
                            <div className="bg-white h-full rounded-full" style={{ width: '45%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-indigo-200">
                            <span>Media</span>
                            <span>72%</span>
                        </div>
                        <div className="w-full bg-indigo-800 rounded-full h-1.5">
                            <div className="bg-indigo-400 h-full rounded-full" style={{ width: '72%' }} />
                        </div>
                    </div>
                </div>

                <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                    Manage Storage
                </button>
            </div>
        </div>
    </div>
);

export default function AdminConsole() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Console</h1>
                <p className="text-slate-500">Manage your organization and content.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
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

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && <DashboardStats />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'content' && <ContentCMS />}
                {activeTab === 'settings' && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Settings size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">Global settings configuration.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
