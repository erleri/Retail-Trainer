import React, { useState, useEffect } from 'react';
import {
    Gauge, Activity, ArrowUpRight, ShieldAlert, BrainCircuit, BarChart2, Save, RotateCcw
} from 'lucide-react';
import { operatorApi } from '../../services/operatorApi';
import { clsx } from 'clsx';

export default function DifficultyTuner() {
    const [loading, setLoading] = useState(true);
    const [levels, setLevels] = useState([]);
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [editParams, setEditParams] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getDifficulties();
        if (res.success) {
            setLevels(res.data.levels);
            if (!selectedLevelId && res.data.levels.length > 0) {
                // Default to level 3
                const l3 = res.data.levels.find(l => l.level === 3) || res.data.levels[0];
                handleSelectLevel(l3);
            }
        }
        setLoading(false);
    };

    const handleSelectLevel = (level) => {
        if (hasUnsavedChanges && !window.confirm("Discard changes?")) return;
        setSelectedLevelId(level.difficultyId);
        setEditParams({ ...level.parameters });
        setHasUnsavedChanges(false);
    };

    const handleParamChange = (key, value) => {
        setEditParams(prev => ({
            ...prev,
            [key]: parseFloat(value)
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        // Mock save
        const newLevels = levels.map(l => {
            if (l.difficultyId === selectedLevelId) {
                return { ...l, parameters: editParams, versionId: "v1.1-draft" };
            }
            return l;
        });
        await operatorApi.updateDifficulties(newLevels); // Using the wrapper currently
        setLevels(newLevels);
        setHasUnsavedChanges(false);
        alert("Saved difficulty parameters.");
    };

    const selectedLevel = levels.find(l => l.difficultyId === selectedLevelId);

    // Param Definitions for UI
    const PARAM_CONFIG = [
        { key: 'upsellResistance', label: 'Upsell Resistance', icon: ShieldAlert, color: 'text-red-500' },
        { key: 'objectionFrequency', label: 'Objection Frequency', icon: Activity, color: 'text-orange-500' },
        { key: 'emotionalVariance', label: 'Emotional Variance', icon: Gauge, color: 'text-purple-500' },
        { key: 'knowledgeDepth', label: 'Knowledge Depth', icon: BrainCircuit, color: 'text-blue-500' },
        { key: 'responseComplexity', label: 'Response Complexity', icon: BarChart2, color: 'text-emerald-500' }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Left: Level Selector */}
            <div className="w-full lg:w-1/4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Global Difficulty Levels</h3>
                <div className="space-y-2">
                    {levels.map(l => (
                        <div
                            key={l.difficultyId}
                            onClick={() => handleSelectLevel(l)}
                            className={clsx(
                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                                selectedLevelId === l.difficultyId
                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                selectedLevelId === l.difficultyId ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                            )}>
                                {l.level}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-800">{l.label}</h4>
                                <p className="text-[10px] text-slate-400">{l.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center: Tuner */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {selectedLevel?.label} Tuning
                            <span className="text-xs px-2 py-0.5 bg-slate-200 rounded-full font-mono text-slate-600 font-normal">
                                {selectedLevel?.versionId}
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500">Adjust behavioral parameters for this difficulty level.</p>
                    </div>
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
                        <Save size={16} /> Update Model
                    </button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                    {editParams && PARAM_CONFIG.map(conf => (
                        <div key={conf.key} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <conf.icon size={18} className={conf.color} />
                                    {conf.label}
                                </label>
                                <span className="font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                    {(editParams[conf.key] * 100).toFixed(0)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={editParams[conf.key]}
                                onChange={(e) => handleParamChange(conf.key, e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium">
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Predictive Preview (Mock) */}
            <div className="w-full lg:w-1/4 bg-slate-900 text-slate-300 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full rotate-45" />
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-white">{(selectedLevel?.level || 0) * 20}%</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Overall Load</span>
                    </div>
                </div>
                <div className="space-y-4 w-full">
                    <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center text-sm">
                        <span>Success Rate</span>
                        <span className="font-bold text-green-400">{(100 - (selectedLevel?.level || 1) * 15)}%</span>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center text-sm">
                        <span>Avg Turns</span>
                        <span className="font-bold text-yellow-400">{(selectedLevel?.level || 1) * 3 + 5}</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                    *Based on historical simulation data.
                </p>
            </div>
        </div>
    );
}
