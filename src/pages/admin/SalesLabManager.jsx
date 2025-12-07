import React, { useState, useEffect } from 'react';
import {
    GitBranch, MessageSquare, Play, Plus, Search, Filter,
    MoreHorizontal, Edit2, Trash2, ArrowRight, Layers, Settings,
    CheckCircle, AlertCircle, ShoppingBag, Users, Gauge
} from 'lucide-react';
import { clsx } from 'clsx';
import { operatorApi } from '../../services/operatorApi';
import ScenarioBuilder from './ScenarioBuilder';
import PromptEngine from './PromptEngine';
import DifficultyTuner from './DifficultyTuner';

export default function SalesLabManager() {
    const [activeTab, setActiveTab] = useState('rules'); // rules | scenario | simulation
    const [loading, setLoading] = useState(true);

    // Data States
    const [rules, setRules] = useState([]);
    const [stages, setStages] = useState([]);
    const [simResult, setSimResult] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [rRes, sRes] = await Promise.all([
            operatorApi.getUpsellRules(),
            operatorApi.getStages()
        ]);
        if (rRes.success) setRules(rRes.data.rules);
        if (sRes.success) setStages(sRes.data.stages);
        setLoading(false);
    };

    const handleRunSim = async () => {
        setSimResult({ loading: true });
        const res = await operatorApi.runSimulation({
            productContext: { type: 'TV' },
            initialStageId: 'greeting'
        });
        if (res.success) setSimResult({ data: res.data, loading: false });
    };

    // --- SUB-VIEWS ---

    const renderRules = () => (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Left: Rule List */}
            <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search rules..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg">Active</button>
                        <button className="flex-1 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-50 rounded-lg">Inactive</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {rules.map(rule => (
                        <div key={rule.id} className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all bg-slate-50">
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{rule.label}</h4>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{rule.description}</p>
                            <div className="flex gap-2">
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                                    {rule.scenario?.stage || 'Any Stage'}
                                </span>
                                {rule.customer?.includeTraits?.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-medium rounded">
                                        {t.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-sm hover:bg-slate-50">
                        + New Rule
                    </button>
                </div>
            </div>

            {/* Right: Detail Panel */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                {rules[0] ? (
                    <>
                        <div className="p-4 border-b border-slate-200 flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{rules[0].label}</h2>
                                <p className="text-sm text-slate-500">{rules[0].description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Conditions */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Filter size={14} /> Conditions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                            <Users size={16} /> Customer Context
                                        </h4>
                                        <ul className="text-xs space-y-1 text-slate-600">
                                            <li>• Traits: <span className="font-medium text-slate-900">Movie Lover</span></li>
                                            <li>• Min Difficulty: <span className="font-medium text-slate-900">2</span></li>
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                            <ShoppingBag size={16} /> Product Context
                                        </h4>
                                        <ul className="text-xs space-y-1 text-slate-600">
                                            <li>• Type: <span className="font-medium text-slate-900">TV</span></li>
                                            <li>• Tiers: <span className="font-medium text-slate-900">Standard, Large</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Actions & Messages */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <MessageSquare size={14} /> Response Logic
                                </h3>
                                <div className="space-y-4">
                                    {rules[0].actions.map((act, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                                            <CheckCircle size={16} />
                                            <span className="font-bold">{act.type}</span>
                                            <span className="opacity-75 text-xs font-mono">{JSON.stringify(act.params)}</span>
                                        </div>
                                    ))}
                                    {rules[0].messages.map(msg => (
                                        <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Template</span>
                                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{msg.tone}</span>
                                            </div>
                                            <p className="text-slate-800 font-medium font-mono text-sm">"{msg.template}"</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">Select a rule</div>
                )}
            </div>
        </div>
    );

    // renderScenario replaced by ScenarioBuilder component

    const renderSimulation = () => (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
            {/* Settings */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Sim Context</h3>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Persona</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        <option>Smart Budget Shopper</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Product</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        <option>OLED TV (Global)</option>
                    </select>
                </div>
                <div className="mt-auto">
                    <button
                        onClick={handleRunSim}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <Play size={18} /> Test Run
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-slate-900 rounded-xl p-6 text-white flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-slate-800/50 p-3 flex justify-between items-center px-6">
                    <span className="text-xs font-bold text-slate-400 tracking-wider">PREVIEW CONSOLE</span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                </div>

                {simResult?.loading ? (
                    <div className="m-auto text-slate-500 animate-pulse">Initializing Neural Engine...</div>
                ) : simResult?.data ? (
                    <div className="mt-8 space-y-4">
                        {simResult.data.turns.map(turn => (
                            <div key={turn.turnIndex} className="animate-in slide-in-from-bottom fade-in duration-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-blue-400 uppercase">{turn.speaker}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Stage: {turn.stageId}</span>
                                </div>
                                <div className="font-mono text-sm leading-relaxed text-slate-200">
                                    "{turn.utterance}"
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="m-auto text-slate-600 text-sm">Ready to simulate.</div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Lab Manager</h1>
                    <p className="text-sm text-slate-500">Core Engine Logic: Rules, Scenarios & Simulation.</p>
                </div>
            </header>

            {/* Main Tabs */}
            <div className="border-b border-slate-200 flex gap-6">
                {[
                    { id: 'scenario', label: 'Scenarios', icon: Layers },
                    { id: 'prompt', label: 'Prompt Engine', icon: MessageSquare },
                    { id: 'difficulty', label: 'Difficulty Tuner', icon: Gauge },
                    { id: 'rules', label: 'Upsell Rules', icon: GitBranch },
                    { id: 'simulation', label: 'Simulation', icon: Play },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-2 px-1 py-4 border-b-2 font-bold text-sm transition-all",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-400 hover:text-slate-700"
                            )}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <main className="min-h-[500px]">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading Core Engine...</div>
                ) : (
                    <>
                        {activeTab === 'scenario' && <ScenarioBuilder />}
                        {activeTab === 'prompt' && <PromptEngine />}
                        {activeTab === 'difficulty' && <DifficultyTuner />}
                        {activeTab === 'rules' && renderRules()}
                        {activeTab === 'simulation' && renderSimulation()}
                    </>
                )}
            </main>
        </div>
    );
}
