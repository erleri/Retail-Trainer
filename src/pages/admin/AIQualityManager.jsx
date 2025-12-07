import React from 'react';
import { BarChart2, Zap, AlertTriangle, DollarSign, Activity, Server } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TOKEN_DATA = [
    { day: 'Mon', flash: 15000, pro: 5000 },
    { day: 'Tue', flash: 22000, pro: 7000 },
    { day: 'Wed', flash: 18000, pro: 4500 },
    { day: 'Thu', flash: 25000, pro: 8000 },
    { day: 'Fri', flash: 30000, pro: 12000 },
    { day: 'Sat', flash: 12000, pro: 3000 },
    { day: 'Sun', flash: 10000, pro: 2000 },
];

const LATENCY_DATA = [
    { time: '10:00', ms: 450 },
    { time: '11:00', ms: 520 },
    { time: '12:00', ms: 480 },
    { time: '13:00', ms: 800 }, // Spike
    { time: '14:00', ms: 420 },
    { time: '15:00', ms: 380 },
    { time: '16:00', ms: 410 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="glass-card p-6 flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} />
        </div>
    </div>
);

export default function AIQualityManager() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Analytics & AI Quality</h1>
                    <p className="text-text-secondary">Monitor model performance, costs, and infrastructure health.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                        <Activity size={14} /> Systems Normal
                    </span>
                    <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                        <option>Last 7 Days</option>
                        <option>Today</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Cost (Est.)"
                    value="$42.50"
                    subtext="vs $35.20 last week"
                    icon={DollarSign}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Total Tokens"
                    value="1.2M"
                    subtext="15% increase"
                    icon={Zap}
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Avg Latency"
                    value="480ms"
                    subtext="P95: 1200ms"
                    icon={Server}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Error Rate"
                    value="0.8%"
                    subtext="2 failed requests today"
                    icon={AlertTriangle}
                    color="bg-red-50 text-red-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Usage Chart */}
                <div className="glass-card p-6 border border-gray-100 bg-white">
                    <h3 className="font-bold text-lg text-text-primary mb-6">Token Usage by Model</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOKEN_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="flash" name="Gemini Flash" stackId="a" fill="#60A5FA" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="pro" name="Gemini Pro" stackId="a" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latency Chart */}
                <div className="glass-card p-6 border border-gray-100 bg-white">
                    <h3 className="font-bold text-lg text-text-primary mb-6">Response Latency (ms)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={LATENCY_DATA}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="ms" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
