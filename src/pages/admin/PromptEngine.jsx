import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Layers, Search, Save, RotateCcw, Play, CheckCircle, AlertTriangle
} from 'lucide-react';
import { operatorApi } from '../../services/operatorApi';
import { clsx } from 'clsx';

export default function PromptEngine() {
    const [loading, setLoading] = useState(true);
    const [prompts, setPrompts] = useState([]);
    const [activeLayer, setActiveLayer] = useState('global'); // global | persona | scenario
    const [selectedPromptId, setSelectedPromptId] = useState(null);

    // Editor State
    const [editContent, setEditContent] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Simulation State
    const [simContext, setSimContext] = useState({ personaId: '', scenarioId: '' });
    const [resolvedResult, setResolvedResult] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getPrompts();
        if (res.success) {
            setPrompts(res.data.prompts);
        }
        setLoading(false);
    };

    // Filter prompts by active layer
    const filteredPrompts = prompts.filter(p => p.layer === activeLayer);

    const handleSelectPrompt = (p) => {
        if (hasUnsavedChanges && !window.confirm("Discard changes?")) return;
        setSelectedPromptId(p.promptId);
        setEditContent(p.content);
        setHasUnsavedChanges(false);
    };

    const handleSave = async () => {
        if (!selectedPromptId) return;
        const res = await operatorApi.updatePrompt(selectedPromptId, editContent);
        if (res.success) {
            setPrompts(prompts.map(p => p.promptId === selectedPromptId ? res.data.prompt : p));
            setHasUnsavedChanges(false);
            alert("Saved!");
        }
    };

    const handleSimulate = async () => {
        const res = await operatorApi.resolvePrompt(simContext);
        if (res.success) {
            setResolvedResult(res.data);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Left: Layer & List */}
            <div className="w-full lg:w-1/4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                    {['global', 'persona', 'scenario'].map(layer => (
                        <button
                            key={layer}
                            onClick={() => setActiveLayer(layer)}
                            className={clsx(
                                "flex-1 py-3 text-xs font-bold uppercase tracking-wide",
                                activeLayer === layer ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {layer}
                        </button>
                    ))}
                </div>
                <div className="p-3 bg-slate-50 border-b border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Filter..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredPrompts.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-400">No prompts in this layer</div>
                    )}
                    {filteredPrompts.map(p => (
                        <div
                            key={p.promptId}
                            onClick={() => handleSelectPrompt(p)}
                            className={clsx(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                selectedPromptId === p.promptId
                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <h4 className="font-bold text-sm text-slate-800 mb-1">
                                {p.layer === 'global' ? 'System Default' : (p.target?.personaId || p.target?.scenarioId || p.promptId)}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 font-mono bg-slate-50 p-1 rounded">
                                {p.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center: Editor */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Edit2Icon size={16} /> Prompt Editor
                    </h3>
                    <button
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all",
                            hasUnsavedChanges
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
                <div className="flex-1 p-0 relative">
                    <textarea
                        value={editContent}
                        onChange={(e) => { setEditContent(e.target.value); setHasUnsavedChanges(true); }}
                        className="w-full h-full p-6 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800"
                        placeholder="Select a prompt to edit..."
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Right: Resolution Simulator */}
            <div className="w-full lg:w-1/4 bg-slate-900 text-slate-300 rounded-xl shadow-lg p-4 flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <Play size={14} /> Resolution Simulator
                </h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Persona Context</label>
                        <input
                            value={simContext.personaId}
                            onChange={e => setSimContext({ ...simContext, personaId: e.target.value })}
                            placeholder="e.g. gamer"
                            className="w-full bg-slate-800 border-slate-700 text-white text-xs p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Scenario Context</label>
                        <input
                            value={simContext.scenarioId}
                            onChange={e => setSimContext({ ...simContext, scenarioId: e.target.value })}
                            placeholder="e.g. sc_001"
                            className="w-full bg-slate-800 border-slate-700 text-white text-xs p-2 rounded"
                        />
                    </div>
                    <button
                        onClick={handleSimulate}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition-colors"
                    >
                        Run Resolution
                    </button>
                </div>

                <div className="flex-1 bg-black/30 rounded-lg p-3 text-xs font-mono overflow-y-auto border border-slate-800">
                    {resolvedResult ? (
                        <>
                            <div className="mb-2 pb-2 border-b border-slate-700 flex justify-between">
                                <span className="text-green-400">Resolved Source:</span>
                                <span className="font-bold text-white uppercase">{resolvedResult.source}</span>
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap">
                                {resolvedResult.resolvedPrompt}
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-600 text-center mt-10">
                            Run simulation to see final prompt output.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Edit2Icon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
