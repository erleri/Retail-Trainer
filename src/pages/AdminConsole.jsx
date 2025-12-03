import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

import { Users, FileText, Settings, Bell, Search, Plus, MoreVertical, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
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
    { label: 'Active Users', value: '1,240', trend: '+12%', color: 'text-primary' },
    { label: 'Content Completion', value: '85%', trend: '+5%', color: 'text-secondary' },
    { label: 'Avg. Session Time', value: '12m', trend: '-2%', color: 'text-yellow-500' },
];

const Card = ({ children, className }) => (
    <div className={clsx("bg-surface rounded-2xl p-6 shadow-sm border border-gray-100", className)}>
        {children}
    </div>
);

export default function AdminConsole() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'content', label: 'Content CMS', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Admin Console</h1>
                    <p className="text-text-secondary">Manage users, content, and system settings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-secondary hover:text-primary relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap",
                            activeTab === tab.id ? "text-primary" : "text-text-secondary hover:text-text-primary"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ADMIN_KPI.map((kpi) => (
                                <Card key={kpi.label}>
                                    <p className="text-sm text-text-secondary">{kpi.label}</p>
                                    <h3 className="text-3xl font-bold text-text-primary mt-2">{kpi.value}</h3>
                                    <p className={clsx("text-sm font-bold mt-1", kpi.color)}>{kpi.trend} vs last month</p>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="font-bold text-text-primary mb-4">Regional Usage Heatmap</h3>
                                <div className="h-[200px] bg-gray-50 rounded-xl flex items-center justify-center text-text-light">
                                    Map Visualization Placeholder
                                </div>
                            </Card>
                            <Card>
                                <h3 className="font-bold text-text-primary mb-4">System Alerts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                        <AlertTriangle className="text-red-500 mt-0.5" size={18} />
                                        <div>
                                            <h4 className="text-sm font-bold text-red-700">High Failure Rate Detected</h4>
                                            <p className="text-xs text-red-600 mt-1">"Price Objection" module has 45% failure rate in Vietnam region.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <Bell className="text-blue-500 mt-0.5" size={18} />
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-700">New Content Published</h4>
                                            <p className="text-xs text-blue-600 mt-1">OLED G5 Guide is now live in all regions.</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex justify-between">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                                <Plus size={18} /> Add User
                            </button>
                        </div>

                        <Card className="!p-0 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100 text-text-secondary">
                                    <tr>
                                        <th className="p-4 font-medium">Name</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Store</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Last Active</th>
                                        <th className="p-4 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {USER_LIST.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-bold text-text-primary">{user.name}</td>
                                            <td className="p-4 text-text-secondary">{user.role}</td>
                                            <td className="p-4 text-text-secondary">{user.store}</td>
                                            <td className="p-4">
                                                <span className={clsx(
                                                    "px-2 py-1 rounded-full text-xs font-bold",
                                                    user.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-text-secondary">{user.lastActive}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-text-light hover:text-primary">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'content' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">All</button>
                                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Published</button>
                                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Drafts</button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors">
                                <Plus size={18} /> Create Content
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CONTENT_LIST.map((content) => (
                                <Card key={content.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-lg text-xs font-bold",
                                            content.type === 'Training' ? "bg-blue-50 text-blue-600" :
                                                content.type === 'Objection' ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                                        )}>
                                            {content.type}
                                        </span>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-light hover:text-primary">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-text-primary mb-2">{content.title}</h3>
                                    <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t border-gray-50">
                                        <span className={clsx(
                                            "flex items-center gap-1",
                                            content.status === 'Published' ? "text-green-500" : "text-text-light"
                                        )}>
                                            {content.status === 'Published' && <CheckCircle size={14} />}
                                            {content.status}
                                        </span>
                                        <span className="text-text-light">{content.date}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
