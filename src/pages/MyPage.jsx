import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { User, Settings, BarChart2, Bell, Globe, LogOut, Shield, ChevronRight, Camera } from 'lucide-react';
import { clsx } from 'clsx';
import MyProgress from './MyProgress';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';

const MyProfile = () => {
    const { language } = useAppStore();
    const { level } = useUserStore();

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-md p-1">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors">
                        <Camera size={16} />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Imjun</h2>
                <p className="text-slate-500 text-sm mb-4 font-medium">Store Lead • Best Buy Gangnam</p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">Level {level}</span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">Gold Pro</span>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 font-bold text-slate-900 text-sm">
                        Account Settings
                    </div>
                    <div className="divide-y divide-slate-100">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <User size={20} />
                                </div>
                                <span className="text-slate-700 font-bold">Personal Information</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Bell size={20} />
                                </div>
                                <span className="text-slate-700 font-bold">Notifications</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">ON</span>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Globe size={20} />
                                </div>
                                <span className="text-slate-700 font-bold">Language</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 uppercase font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">{language}</span>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 font-bold text-slate-900 text-sm">
                        Support & Info
                    </div>
                    <div className="divide-y divide-slate-100">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Shield size={20} />
                                </div>
                                <span className="text-slate-700 font-bold">Privacy & Security</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left text-red-500 group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-red-50 text-red-500 group-hover:bg-white group-hover:shadow-sm transition-colors">
                                    <LogOut size={20} />
                                </div>
                                <span className="font-bold">Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 pb-8 mt-8">
                Version 2.5.0 (Build 20241127) • Retail Trainer
            </div>
        </div>
    );
};

export default function MyPage() {
    const [activeTab, setActiveTab] = useState('progress');

    return (
        <div className="space-y-6 pb-20 p-4 md:p-0">
            {/* Top Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                    onClick={() => setActiveTab('progress')}
                    className={clsx(
                        "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'progress'
                            ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                >
                    <BarChart2 size={16} />
                    My Progress
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={clsx(
                        "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'profile'
                            ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                >
                    <Settings size={16} />
                    My Profile
                </button>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'progress' ? <MyProgress /> : <MyProfile />}
            </motion.div>
        </div>
    );
}
