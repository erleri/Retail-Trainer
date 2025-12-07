import React, { useState } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { operatorApi } from '../../services/operatorApi';
import {
    Users, Activity, AlertTriangle, TrendingUp, BarChart2,
    Search, Filter, Map, Layers, Zap, Brain, Settings, Eye, EyeOff, GripVertical
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import InsightsConsole from './InsightsConsole';
import { useOperatorAction } from '../../hooks/useOperatorAction';

// --- Scope Selector ---
const ScopeSelector = ({ scope, setScope }) => (
    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
        {['GLOBAL', 'REGION', 'COUNTRY', 'BRANCH'].map((s) => (
            <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scope === s
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
            >
                {s}
            </button>
        ))}
    </div>
);

// --- Widget Component ---
const WidgetRenderer = ({ widget, scope }) => {
    const { data: widgetData, isLoading, isError } = useQuery({
        queryKey: ['widgetData', widget.id, scope],
        queryFn: async () => {
            const res = await operatorApi.getWidgetData(widget.endpoint, { scope });
            return res.data;
        }
    });

    if (isLoading) return <div className="h-full w-full bg-slate-50 rounded-xl animate-pulse" />;
    if (isError) return <div className="h-full flex items-center justify-center text-red-400 text-xs">Error loading data</div>;

    if (widget.type === 'kpi') {
        const icons = { Users, Zap, Brain, Layers };
        const Icon = icons[Object.keys(icons).find(k => widget.title.includes(k))] || Activity;

        // Dynamic Color Logic based on IDs
        const colors = widget.id.includes('users') ? 'indigo' :
            widget.id.includes('sessions') ? 'amber' :
                widget.id.includes('pass') ? 'violet' : 'emerald';

        return (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{widget.title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{widgetData?.value?.toLocaleString() || 0}</h3>
                    </div>
                    <div className={`p-2.5 rounded-lg bg-${colors}-50 text-${colors}-600`}>
                        <Icon size={20} />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                    <span className={`font-bold ${widgetData?.trend?.startsWith('+') ? 'text-green-600' : 'text-red-500'} flex items-center gap-1`}>
                        <TrendingUp size={12} className={widgetData?.trend?.startsWith('-') ? "rotate-180" : ""} />
                        {widgetData?.trend}
                    </span>
                    <span className="text-slate-400">vs last period</span>
                </div>
            </div>
        );
    }

    if (widget.type === 'chart') {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">{widget.title}</h3>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {widget.id === 'w_daily_activity' ? (
                            <AreaChart data={widgetData?.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                                <Area type="monotone" dataKey="sessions" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                                <Area type="monotone" dataKey="users" stroke="#CBD5E1" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        ) : (
                            <BarChart data={widgetData?.data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                <Bar dataKey="completions" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="users" name="Started" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    return null;
};

// --- Widget Config Drawer ---
const WidgetConfigDrawer = ({ widgets, onClose }) => {
    const [localWidgets, setLocalWidgets] = useState(widgets);
    const updateAction = useOperatorAction({
        mutationFn: (data) => operatorApi.updateDashboardWidgets(data),
        invalidateKeys: [['dashboardWidgets']],
        successMessage: "Dashboard layout updated."
    });

    const handleSave = () => {
        updateAction.mutate(localWidgets);
        onClose();
    };

    const toggleVisible = (id) => {
        setLocalWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
    };

    const moveWidget = (dragIndex, hoverIndex) => {
        const newWidgets = [...localWidgets];
        const [removed] = newWidgets.splice(dragIndex, 1);
        newWidgets.splice(hoverIndex, 0, removed);
        setLocalWidgets(newWidgets);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Customize Dashboard</h3>
                    <button onClick={onClose} className="text-sm text-slate-500">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {localWidgets.map((w, index) => (
                        <div key={w.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <GripVertical size={16} className="text-slate-300 cursor-grab" />
                                <span className="text-sm font-bold text-slate-700">{w.title}</span>
                            </div>
                            <button onClick={() => toggleVisible(w.id)} className="text-slate-400 hover:text-indigo-600">
                                {w.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                    >
                        Save Layout
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function AdminDashboard() {
    const [scope, setScope] = useState('GLOBAL');
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const { data: widgets = [], isLoading } = useQuery({
        queryKey: ['dashboardWidgets'],
        queryFn: async () => {
            const res = await operatorApi.getDashboardWidgets();
            return res.data?.widgets?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
        }
    });

    const activeWidgets = widgets.filter(w => w.visible);
    const kpiWidgets = activeWidgets.filter(w => w.type === 'kpi');
    const chartWidgets = activeWidgets.filter(w => w.type === 'chart');

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
                    <p className="text-slate-500 text-sm">Real-time overview of training performance.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ScopeSelector scope={scope} setScope={setScope} />
                    <div className="h-8 w-px bg-slate-200"></div>
                    <button
                        onClick={() => setIsConfigOpen(true)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
                        title="Customize Dashboard"
                    >
                        <Settings size={18} />
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                        Export Report
                    </button>
                </div>
            </header>

            {/* Widgets Grid */}
            {isLoading ? <div>Loading Dashboard...</div> : (
                <>
                    {/* KPI Section */}
                    {kpiWidgets.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {kpiWidgets.map(w => (
                                <WidgetRenderer key={w.id} widget={w} scope={scope} />
                            ))}
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Charts Area */}
                        <div className="lg:col-span-2 space-y-8">
                            {chartWidgets.map(w => (
                                <WidgetRenderer key={w.id} widget={w} scope={scope} />
                            ))}
                        </div>

                        {/* Insights Feed (Fixed) */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden h-fit">
                            <div className="p-4 bg-white border-b border-slate-200">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Brain className="text-indigo-500" size={18} />
                                    AI Insights Feed
                                </h3>
                            </div>
                            <div className="p-4 max-h-[800px] overflow-y-auto">
                                <InsightsConsole />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isConfigOpen && (
                <WidgetConfigDrawer widgets={widgets} onClose={() => setIsConfigOpen(false)} />
            )}
        </div>
    );
}
