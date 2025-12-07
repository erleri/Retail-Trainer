import React, { useState, useEffect } from 'react';
import {
    Layers, Plus, Search, MoreHorizontal, Edit2, Trash2,
    ArrowRight, CheckCircle, AlertCircle, Play, FileText, ChevronRight
} from 'lucide-react';
import { operatorApi } from '../../services/operatorApi';
import { clsx } from 'clsx';

export default function ScenarioBuilder() {
    const [loading, setLoading] = useState(true);
    const [scenarios, setScenarios] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getScenarios();
        if (res.success) {
            setScenarios(res.data.scenarios);
            if (!selectedId && res.data.scenarios.length > 0) {
                setSelectedId(res.data.scenarios[0].scenarioId);
            }
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newTitle.trim()) return;
        const res = await operatorApi.createScenario({
            title: newTitle,
            description: newDesc,
            stages: [] // Start empty
        });
        if (res.success) {
            setScenarios([...scenarios, res.data.scenario]);
            setSelectedId(res.data.scenario.scenarioId);
            setIsCreateModalOpen(false);
            setNewTitle('');
            setNewDesc('');
        }
    };

    const selectedScenario = scenarios.find(s => s.scenarioId === selectedId);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Left: Scenario List */}
            <div className="w-full lg:w-1/4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Scenarios</h3>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {scenarios.map(s => (
                        <div
                            key={s.scenarioId}
                            onClick={() => setSelectedId(s.scenarioId)}
                            className={clsx(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                selectedId === s.scenarioId
                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={clsx("font-bold text-sm", selectedId === s.scenarioId ? "text-blue-900" : "text-slate-700")}>{s.title}</h4>
                                {s.published && <CheckCircle size={12} className="text-green-500" />}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">
                                    {s.versionId}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                    {s.stages?.length || 0} Stages
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center/Right: Stage Builder */}
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col relative">
                {selectedScenario ? (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    {selectedScenario.title}
                                    <span className="text-xs px-2 py-0.5 bg-slate-200 rounded-full font-mono font-normal text-slate-600">
                                        {selectedScenario.versionId}
                                    </span>
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedScenario.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50">
                                    Test Run
                                </button>
                                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700">
                                    Publish
                                </button>
                            </div>
                        </div>

                        {/* Stage Flow (Vertical) */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {selectedScenario.stages?.map((stage, idx) => (
                                <div key={stage.stageId} className="group relative pl-8 border-l-2 border-slate-200 last:border-l-0 pb-8">
                                    {/* Valid Connector Node */}
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10" />

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">
                                                    Step {idx + 1}
                                                </span>
                                                <button className="text-slate-300 hover:text-slate-600">
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1">{stage.label}</h3>
                                            <p className="text-sm text-slate-600 mb-3">{stage.description}</p>

                                            {/* Triggers */}
                                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Triggers (Intent)</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {stage.triggers?.map((t, ti) => (
                                                        <span key={ti} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-600">
                                                            {t.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Details/Preview (Simplified) */}
                                        <div className="w-1/3 hidden xl:block opacity-50 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-500">
                                                <p className="font-bold mb-1">AI Behavior</p>
                                                <p>Overrides: {stage.difficultyOverride ? `Difficulty ${stage.difficultyOverride}` : 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add Stage Button */}
                            <div className="pl-8 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 z-10" />
                                <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:bg-slate-100 hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2">
                                    <Plus size={20} /> Add Next Stage
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="m-auto text-center text-slate-400">
                        <Layers size={48} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-500">No Scenario Selected</h3>
                        <p className="text-sm">Select a scenario from the left to start editing.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px]">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Scenario</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg"
                                    placeholder="e.g., Advanced Closing Tech"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg h-24 resize-none"
                                    placeholder="What is this scenario for?"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
