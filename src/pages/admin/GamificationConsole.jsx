import React, { useState, useEffect } from 'react';
import {
    Trophy, Star, Zap, Activity, Users, Award, Briefcase
} from 'lucide-react';
import { operatorApi } from '../../services/operatorApi';
import { clsx } from 'clsx';

export default function GamificationConsole() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [activeTab, setActiveTab] = useState('xp'); // xp | badges | levels

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getGamificationSettings();
        if (res.success) {
            setSettings(res.data);
        }
        setLoading(false);
    };

    const handleMultiplierChange = async (ruleId, type, value) => {
        // Mock update
        const newRules = settings.xpRules.map(r => {
            if (r.ruleId === ruleId) {
                return {
                    ...r,
                    multipliers: { ...r.multipliers, [type]: parseFloat(value) }
                };
            }
            return r;
        });
        setSettings({ ...settings, xpRules: newRules });
        await operatorApi.updateXpRule(ruleId, { multipliers: newRules.find(r => r.ruleId === ruleId).multipliers });
    };

    if (loading || !settings) return <div className="p-8 text-center text-slate-400">Loading Gamification Engine...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard icon={Zap} label="Active XP Rules" value={settings.xpRules.length} color="text-yellow-500" bg="bg-yellow-50" />
                <MetricCard icon={Award} label="Total Badges" value={settings.badges.length} color="text-purple-500" bg="bg-purple-50" />
                <MetricCard icon={Users} label="Level Cap" value={settings.levels.length} color="text-blue-500" bg="bg-blue-50" />
                <MetricCard icon={Activity} label="Engagement" value="High" color="text-green-500" bg="bg-green-50" />
            </div>

            <div className="flex gap-6 h-[600px]">
                {/* Left: Navigation */}
                <div className="w-64 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 font-bold text-slate-700 text-xs uppercase tracking-wider">
                        Engine Modules
                    </div>
                    {[
                        { id: 'xp', label: 'XP Rules Engine', icon: Zap },
                        { id: 'badges', label: 'Badge System', icon: Award },
                        { id: 'levels', label: 'Level Curve', icon: Trophy }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left",
                                activeTab === tab.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Right: Content */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {activeTab === 'xp' && (
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">XP Calculation Rules</h3>
                                <button className="text-xs font-bold text-blue-600 hover:underline">+ Add Event Rule</button>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Event Trigger</th>
                                        <th className="p-4">Base XP</th>
                                        <th className="p-4">Multipliers (Diff / Streak)</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {settings.xpRules.map(rule => (
                                        <tr key={rule.ruleId} className="hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{rule.ruleId}</div>
                                                <div className="text-xs text-slate-400 font-mono">{rule.event}</div>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-blue-600">{rule.baseXp} xp</td>
                                            <td className="p-4">
                                                <div className="flex gap-2 text-xs">
                                                    <div className="flex flex-col">
                                                        <label className="text-slate-400 text-[10px]">Difficulty</label>
                                                        <input
                                                            type="number" step="0.1"
                                                            value={rule.multipliers?.difficulty || 1.0}
                                                            onChange={(e) => handleMultiplierChange(rule.ruleId, 'difficulty', e.target.value)}
                                                            className="w-12 border bg-white rounded p-1"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-slate-400 text-[10px]">Streak</label>
                                                        <input
                                                            type="number" step="0.1"
                                                            value={rule.multipliers?.streak || 1.0}
                                                            onChange={(e) => handleMultiplierChange(rule.ruleId, 'streak', e.target.value)}
                                                            className="w-12 border bg-white rounded p-1"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                            {settings.badges.map(badge => (
                                <div key={badge.badgeId} className="border border-slate-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{badge.title}</h4>
                                        <p className="text-xs text-slate-500 mb-2">{badge.description}</p>
                                        <div className="flex gap-2">
                                            <BadgeTag label={badge.tier} color="bg-yellow-100 text-yellow-800" />
                                            <BadgeTag label={badge.category} color="bg-blue-100 text-blue-800" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'levels' && (
                        <div className="p-8 flex items-end gap-1 h-full overflow-x-auto pb-12">
                            {settings.levels.map((lvl, idx) => (
                                <div key={lvl.level} className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div
                                        className="w-12 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600 relative"
                                        style={{ height: `${(lvl.requiredXp / 2500) * 300 + 20}px` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {lvl.requiredXp} XP
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-700 text-sm">Lv.{lvl.level}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MetricCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <div className="text-xl font-bold text-slate-900">{value}</div>
            <div className="text-xs font-medium text-slate-400 uppercase">{label}</div>
        </div>
    </div>
);

const BadgeTag = ({ label, color }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
        {label}
    </span>
);
