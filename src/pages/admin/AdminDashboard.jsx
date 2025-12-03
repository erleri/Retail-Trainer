import React from 'react';
import { Users, Activity, AlertTriangle, TrendingUp, BarChart2, Search, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, trend, icon: IconComponent, color, trendColor }) => ( // eslint-disable-line no-unused-vars
    <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-text-primary mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} shadow-sm`}>
                <IconComponent size={22} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className={`font-bold ${trendColor} flex items-center gap-1`}>
                {trend.startsWith('+') ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                {trend}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

const data = [
    { name: 'Jan', users: 400, sessions: 240 },
    { name: 'Feb', users: 300, sessions: 139 },
    { name: 'Mar', users: 200, sessions: 980 },
    { name: 'Apr', users: 278, sessions: 390 },
    { name: 'May', users: 189, sessions: 480 },
    { name: 'Jun', users: 239, sessions: 380 },
    { name: 'Jul', users: 349, sessions: 430 },
];

const activityData = [
    { user: 'Kim Minji', action: 'Completed Module 3', time: '2 mins ago', type: 'success' },
    { user: 'Lee Junho', action: 'Failed Objection: Price', time: '15 mins ago', type: 'warning' },
    { user: 'Park Sooyoung', action: 'Achieved Gold Rank', time: '1 hour ago', type: 'info' },
    { user: 'Choi Woosik', action: 'Started Sales Lab', time: '2 hours ago', type: 'neutral' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
                    <p className="text-text-secondary">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <Filter size={20} />
                    </button>
                    <button className="btn-primary shadow-lg">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="1,245"
                    trend="+12%"
                    icon={Users}
                    color="bg-blue-50 text-blue-600"
                    trendColor="text-green-500"
                />
                <StatCard
                    title="Active Sales Labs"
                    value="856"
                    trend="+24%"
                    icon={Activity}
                    color="bg-green-50 text-green-600"
                    trendColor="text-green-500"
                />
                <StatCard
                    title="Objection Fail Rate"
                    value="12.5%"
                    trend="-2.1%"
                    icon={AlertTriangle}
                    color="bg-red-50 text-red-600"
                    trendColor="text-green-500"
                />
                <StatCard
                    title="Avg. Completion"
                    value="78%"
                    trend="+5%"
                    icon={BarChart2}
                    color="bg-purple-50 text-purple-600"
                    trendColor="text-green-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-sm border border-white/20 bg-white/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-text-primary">User Growth & Activity</h3>
                        <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg p-2 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/20 bg-white/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-text-primary">Recent Activity</h3>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {activityData.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${item.type === 'success' ? 'bg-green-500' :
                                    item.type === 'warning' ? 'bg-red-500' :
                                        item.type === 'info' ? 'bg-yellow-500' : 'bg-gray-300'
                                    }`} />
                                <div>
                                    <p className="text-sm font-bold text-text-primary">{item.user}</p>
                                    <p className="text-xs text-text-secondary">{item.action}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
