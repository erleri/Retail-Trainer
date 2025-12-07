import React, { useState } from 'react';
import GamificationConsole from './GamificationConsole';
import MissionManager from './MissionManager';
import { LayoutDashboard, Award, Target, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

export default function GamificationManager() {
    const [activeTab, setActiveTab] = useState('gamification'); // gamification | missions

    const TABS = [
        { id: 'gamification', label: 'Gamification Engine', icon: Trophy, component: GamificationConsole },
        { id: 'missions', label: 'Mission Control', icon: Target, component: MissionManager }
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen">
            {/* Sidebar / Sub-nav */}
            <div className="w-64 bg-slate-900 text-white flex flex-col p-4 border-r border-slate-800">
                <div className="mb-6 px-2 flex items-center gap-2 text-indigo-400">
                    <LayoutDashboard size={20} />
                    <span className="font-bold text-sm tracking-wider">GAME OPS</span>
                </div>

                <nav className="space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-4 bg-slate-800 rounded-xl text-xs text-slate-400">
                    <strong className="text-white block mb-1">XP System Status</strong>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto h-screen">
                <header className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-800">
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h1>
                </header>
                <div className="p-8">
                    {activeTab === 'gamification' && <GamificationConsole />}
                    {activeTab === 'missions' && <MissionManager />}
                </div>
            </div>
        </div>
    );
}
