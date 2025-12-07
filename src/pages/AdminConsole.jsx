import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, Bell, Search, Plus, MoreVertical, AlertTriangle, CheckCircle, BarChart2, Layout, Star, Shield, Database, ChevronRight, Sparkles, Layers, ClipboardCheck, Brain, PieChart } from 'lucide-react';
import { clsx } from 'clsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const USER_LIST = [
    { id: 1, name: 'Minji Kim', role: 'Promoter', store: 'Best Buy Gangnam', status: 'Active', lastActive: '2m ago' },
    { id: 2, name: 'John Doe', role: 'Store Lead', store: 'Lotte Main', status: 'Active', lastActive: '1h ago' },
    { id: 3, name: 'Sarah Lee', role: 'Promoter', store: 'Hyundai Seoul', status: 'Inactive', lastActive: '3d ago' },
];

const CONTENT_LIST = [
    { id: 1, title: 'OLED G5 USP Guide', type: 'PDF', category: 'material', status: 'Published', date: '2024.11.20' },
    { id: 2, title: 'Price Objection Script', type: 'Doc', category: 'material', status: 'Draft', date: '2024.11.24' },
    { id: 3, title: 'Q1 Sales Policy', type: 'PDF', category: 'material', status: 'Review', date: '2024.11.25' },
    { id: 4, title: 'Premium TV Sales Tech', type: 'Scorm', category: 'module', status: 'Published', date: '2024.11.10' },
    { id: 5, title: 'Customer Empathy 101', type: 'Video', category: 'module', status: 'Published', date: '2024.11.15' },
    { id: 6, title: 'OLED vs QNED Test', type: 'Quiz', category: 'quiz', status: 'Active', date: '2024.11.22' },
    { id: 7, title: 'Final Certification', type: 'Exam', category: 'quiz', status: 'Draft', date: '2024.12.01' },
];

const InsightEngineWidget = () => (
    <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden col-span-1 lg:col-span-2">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain size={180} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-amber-400" size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300">AI Insight Engine</h3>
                </div>
                <h2 className="text-2xl font-bold mb-4">Real-time Field Analysis</h2>
                <p className="text-indigo-200 text-sm max-w-lg mb-6 leading-relaxed">
                    The Insight Engine analyzes thousands of role-play sessions to identify coaching opportunities.
                    It detects common objections, skill gaps, and sentiment trends across all stores.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-800/50 p-4 rounded-xl backdrop-blur-sm border border-indigo-700/50">
                    <div className="text-xs font-bold text-indigo-300 mb-1">Top Objection</div>
                    <div className="font-bold text-lg">"Too Expensive"</div>
                    <div className="text-xs text-red-300 mt-1">↑ 15% this week</div>
                </div>
                <div className="bg-indigo-800/50 p-4 rounded-xl backdrop-blur-sm border border-indigo-700/50">
                    <div className="text-xs font-bold text-indigo-300 mb-1">Skill Gap</div>
                    <div className="font-bold text-lg">Closing</div>
                    <div className="text-xs text-amber-300 mt-1">Needs Attention</div>
                </div>
                <div className="bg-indigo-800/50 p-4 rounded-xl backdrop-blur-sm border border-indigo-700/50">
                    <div className="text-xs font-bold text-indigo-300 mb-1">Sentiment</div>
                    <div className="font-bold text-lg">Positive</div>
                    <div className="text-xs text-emerald-300 mt-1">88% Score</div>
                </div>
            </div>
        </div>
    </div>
);

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

        {/* Insight Engine Widget takes full width on small screens, 2 cols on large */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <InsightEngineWidget />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <PieChart size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Traffic Distribution</h3>
            <p className="text-slate-500 text-sm mb-4">Mobile vs Desktop usage analysis</p>
            <div className="w-full h-32 bg-slate-50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-400 text-xs uppercase tracking-widest">Chart Placeholder</div>
            </div>
        </div>
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

const ContentCMS = () => {
    const [activeCategory, setActiveCategory] = useState('material');

    const categories = [
        { id: 'material', label: 'Materials', icon: FileText },
        { id: 'module', label: 'Modules', icon: Layers },
        { id: 'quiz', label: 'Quizzes', icon: ClipboardCheck },
    ];

    const filteredContent = CONTENT_LIST.filter(item => item.category === activeCategory);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Content CMS</h3>
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={clsx(
                                        "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
                                        activeCategory === cat.id
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <cat.icon size={16} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeCategory}s...`}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap">
                            <Plus size={18} /> Upload {activeCategory === 'quiz' ? 'Quiz' : activeCategory === 'module' ? 'Module' : 'File'}
                        </button>
                    </div>
                </div>

                <div className="p-4 grid gap-3 overflow-y-auto max-h-[600px] custom-scrollbar">
                    {filteredContent.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                {categories.find(c => c.id === activeCategory)?.icon && React.createElement(categories.find(c => c.id === activeCategory).icon, { size: 32 })}
                            </div>
                            <p className="text-slate-400 font-medium">No {activeCategory}s found.</p>
                        </div>
                    ) : (
                        filteredContent.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "p-3 rounded-xl border transition-colors",
                                        activeCategory === 'material' ? "bg-blue-50 text-blue-500 border-blue-100 group-hover:bg-blue-100" :
                                            activeCategory === 'module' ? "bg-purple-50 text-purple-500 border-purple-100 group-hover:bg-purple-100" :
                                                "bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-100"
                                    )}>
                                        {activeCategory === 'material' && <FileText size={20} />}
                                        {activeCategory === 'module' && <Layers size={20} />}
                                        {activeCategory === 'quiz' && <ClipboardCheck size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                                            <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-bold border",
                                                item.status === 'Published' || item.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    item.status === 'Draft' ? "bg-slate-100 text-slate-500 border-slate-200" :
                                                        "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>{item.status}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider bg-slate-50 px-1.5 rounded">{item.type}</span>
                                            <span className="text-xs text-slate-400">Updated {item.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                                        <Settings size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Database size={18} className="text-indigo-500" /> Storage
                </h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2 text-slate-500">
                            <span>Documents (PDF, Doc)</span>
                            <span>4.2 GB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2 text-slate-500">
                            <span>Media (Video, Scorm)</span>
                            <span>12.8 GB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '72%' }} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm">
                            Manage Plans
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminConsole() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'content', label: 'Content CMS', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="space-y-8 p-4 md:p-0 pb-20 md:pb-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Console</h1>
                <p className="text-slate-500">Manage your organization and content.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
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
