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
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-white/20 flex flex-col items-center text-center bg-white/50 backdrop-blur-sm">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-4 border-white shadow-lg p-1">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-glow hover:opacity-90 transition-all transform hover:scale-110">
                        <Camera size={16} />
                    </button>
                </div>
                <h2 className="text-2xl font-bold gradient-text">Imjun</h2>
                <p className="text-text-secondary text-sm mb-3 font-medium">Store Lead • Best Buy Gangnam</p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">Level {level}</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">Gold Pro</span>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
                <div className="glass-card rounded-2xl overflow-hidden border border-white/20 bg-white/50 backdrop-blur-sm">
                    <div className="p-4 bg-white/50 border-b border-gray-100 font-bold text-text-primary text-sm backdrop-blur-md">
                        Account Settings
                    </div>
                    <div className="divide-y divide-gray-100">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <User size={20} />
                                </div>
                                <span className="text-text-primary font-medium">Personal Information</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Bell size={20} />
                                </div>
                                <span className="text-text-primary font-medium">Notifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-full">ON</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Globe size={20} />
                                </div>
                                <span className="text-text-primary font-medium">Language</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-text-secondary uppercase font-bold bg-gray-100 px-2 py-1 rounded-full">{language}</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-white/20 bg-white/50 backdrop-blur-sm">
                    <div className="p-4 bg-white/50 border-b border-gray-100 font-bold text-text-primary text-sm backdrop-blur-md">
                        Support & Info
                    </div>
                    <div className="divide-y divide-gray-100">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Shield size={20} />
                                </div>
                                <span className="text-text-primary font-medium">Privacy & Security</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left text-red-500 group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
                                    <LogOut size={20} />
                                </div>
                                <span className="font-medium">Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 pb-8">
                Version 2.5.0 (Build 20241127)
            </div>
        </div>
    );
};

export default function MyPage() {
    const [activeTab, setActiveTab] = useState('progress');

    return (
        <div className="space-y-6 pb-20">
            {/* Top Tabs */}
            <div className="flex p-1 bg-gray-100/50 rounded-xl backdrop-blur-sm border border-gray-200">
                <button
                    onClick={() => setActiveTab('progress')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'progress'
                            ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                    )}
                >
                    <BarChart2 size={16} />
                    My Progress
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'profile'
                            ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/50"
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
