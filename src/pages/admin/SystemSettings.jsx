import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Smartphone, Key, Bot } from 'lucide-react';
import { clsx } from 'clsx';

export default function SystemSettings() {
    const [activeSection, setActiveSection] = useState('ai');
    const [apiKey, setApiKey] = useState('************************');
    const [model, setModel] = useState('gemini-2.0-flash');

    const sections = [
        { id: 'ai', icon: Bot, label: 'AI Configuration' },
        { id: 'integrations', icon: Smartphone, label: 'Integrations & Channels' },
        { id: 'system', icon: Settings, label: 'General System' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
                {sections.map(section => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={clsx(
                                "w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                                activeSection === section.id
                                    ? "bg-white text-primary shadow-sm ring-1 ring-gray-950/5"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <Icon size={18} />
                            {section.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Form */}
            <div className="lg:col-span-3 space-y-6">
                <div className="glass-card p-6 border border-gray-100 bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">
                                {sections.find(s => s.id === activeSection)?.label}
                            </h2>
                            <p className="text-sm text-text-secondary">Configure global settings for the platform.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>

                    {activeSection === 'ai' && (
                        <div className="space-y-6">
                            {/* API Key Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Key size={14} /> Gemini API Key
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-mono text-sm"
                                    />
                                    <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium">
                                        Check Quota
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Recommended: Use a secured API key with restricted scope.
                                </p>
                            </div>

                            {/* Model Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Active Model</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setModel('gemini-2.0-flash')}
                                        className={clsx(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            model === 'gemini-2.0-flash' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm">Gemini 2.0 Flash</span>
                                            {model === 'gemini-2.0-flash' && <div className="w-3 h-3 bg-primary rounded-full" />}
                                        </div>
                                        <p className="text-xs text-gray-500">Fast, cost-effective. Best for quick roleplay interactions.</p>
                                    </div>

                                    <div
                                        onClick={() => setModel('gemini-2.0-pro')}
                                        className={clsx(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            model === 'gemini-2.0-pro' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm">Gemini 2.0 Pro</span>
                                            {model === 'gemini-2.0-pro' && <div className="w-3 h-3 bg-primary rounded-full" />}
                                        </div>
                                        <p className="text-xs text-gray-500">High reasoning capability. Best for complex feedback analysis.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trainer System Prompt */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <label className="text-sm font-bold text-gray-700">Global Trainer Persona (Instruction)</label>
                                <textarea
                                    className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm leading-relaxed"
                                    defaultValue={"You are an expert sales trainer specialized in consumer electronics..."}
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'integrations' && (
                        <div className="py-12 text-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone size={32} className="opacity-50" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">No Integrations Active</h3>
                            <p className="text-sm max-w-xs mx-auto mt-2">WhatsApp Business API and Webhook configurations will appear here.</p>
                            <button className="mt-6 px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                                + Add Channel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
