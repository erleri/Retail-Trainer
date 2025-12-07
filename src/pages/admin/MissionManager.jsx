import React, { useState, useEffect } from 'react';
import {
    Target, Map, Calendar, Plus, List, CheckCircle
} from 'lucide-react';
import { operatorApi } from '../../services/operatorApi';
import { clsx } from 'clsx';

export default function MissionManager() {
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [quests, setQuests] = useState([]);
    const [activeTab, setActiveTab] = useState('missions'); // missions | quests

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [mRes, qRes] = await Promise.all([
            operatorApi.getMissionTemplates(),
            operatorApi.getQuests()
        ]);
        if (mRes.success) setTemplates(mRes.data.templates);
        if (qRes.success) setQuests(qRes.data.quests);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Mission Control</h1>
                    <p className="text-indigo-200 text-sm">Manage Learning Objectives and Career Quests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm flex items-center gap-2">
                        <Plus size={16} /> New Mission
                    </button>
                    <button className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg font-bold text-sm flex items-center gap-2">
                        <Map size={16} /> New Quest
                    </button>
                </div>
            </div>

            <div className="flex gap-6 h-[600px]">
                {/* Left: Filter/Nav */}
                <div className="w-64 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('missions')}
                        className={clsx("w-full text-left p-3 rounded-lg flex items-center gap-3 font-bold text-sm", activeTab === 'missions' ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Target size={18} /> Mission Templates
                        <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{templates.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('quests')}
                        className={clsx("w-full text-left p-3 rounded-lg flex items-center gap-3 font-bold text-sm", activeTab === 'quests' ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Map size={18} /> Quest Logic
                        <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{quests.length}</span>
                    </button>
                </div>

                {/* Right: List */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 overflow-y-auto">
                    {activeTab === 'missions' && (
                        <div className="grid grid-cols-1 gap-4">
                            {templates.map(t => (
                                <div key={t.templateId} className="border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-all group">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                                            <List size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{t.title}</h3>
                                            <p className="text-sm text-slate-500 mb-1">{t.description}</p>
                                            <div className="flex gap-2">
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium uppercase">
                                                    {t.category}
                                                </span>
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                                    Reward: {t.reward.value}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono text-slate-400 mb-2">{t.templateId}</div>
                                        <button className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'quests' && (
                        <div className="space-y-6">
                            {quests.map(q => (
                                <div key={q.questId} className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            <Map className="text-slate-400" size={20} />
                                            <div>
                                                <h3 className="font-bold text-slate-800">{q.title}</h3>
                                                <p className="text-xs text-slate-500">{q.description}</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-lg bg-blue-50">View Graph</button>
                                    </div>
                                    <div className="p-6 relative">
                                        <div className="absolute left-10 top-6 bottom-6 w-0.5 bg-slate-200" />
                                        <div className="space-y-6 relative">
                                            {q.steps.map(step => (
                                                <div key={step.step} className="flex gap-4 items-center">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center z-10 relative shadow-sm">
                                                        {step.step}
                                                    </div>
                                                    <div className="flex-1 border border-slate-200 rounded-lg p-3 bg-white flex justify-between items-center">
                                                        <span className="font-bold text-sm text-slate-700">{step.label}</span>
                                                        <span className="text-xs font-mono text-slate-400">{step.missionTemplateId}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex gap-4 items-center">
                                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 font-bold flex items-center justify-center z-10 relative shadow-md">
                                                    <TrophyBig size={16} />
                                                </div>
                                                <div className="font-bold text-sm text-yellow-700 uppercase tracking-wide">
                                                    Quest Complete: {q.reward.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TrophyBig = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
);
