import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { operatorApi } from '../../services/operatorApi';
import { useOperatorAction } from '../../hooks/useOperatorAction';
import { Plus, Search, Edit2, Trash2, MoreVertical, FileText, ChevronRight } from 'lucide-react';

const ScenarioManagement = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // --- Data Fetching ---
    const { data: scenariosData, isLoading } = useQuery({
        queryKey: ['scenarios'],
        queryFn: async () => {
            const res = await operatorApi.getScenarios();
            return res.data?.scenarios || [];
        }
    });

    const scenarios = scenariosData ? scenariosData.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // --- Actions ---
    const deleteAction = useOperatorAction({
        mutationFn: (id) => operatorApi.deleteScenario(id),
        invalidateKeys: [['scenarios']],
        successMessage: "Scenario deleted successfully."
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this scenario?")) {
            deleteAction.mutate(id);
        }
    };

    const openCreate = () => {
        setSelectedScenario(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (scenario) => {
        setSelectedScenario(scenario);
        setIsDrawerOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Sales Lab Scenarios
                    </h1>
                    <p className="text-slate-500 mt-1">Manage roleplay scenarios and evaluation criteria.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                    <Plus className="w-4 h-4" />
                    New Scenario
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search scenarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-20 text-slate-400">Loading scenarios...</div>
            ) : scenarios.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No scenarios found.</p>
                    <button onClick={openCreate} className="text-blue-600 font-medium hover:underline mt-2">Create your first one</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {scenarios.map(s => (
                        <div key={s.scenarioId} className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {s.published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded dark:bg-slate-800">{s.versionId || 'v1.0'}</span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-1">{s.description || "No description provided."}</p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(s)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(s.scenarioId)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drawer (Inline for simplicity in this step, ideally separate component) */}
            {isDrawerOpen && (
                <ScenarioDrawer
                    scenario={selectedScenario}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}
        </div>
    );
};

// --- Sub-component: Edit/Create Drawer ---
const ScenarioDrawer = ({ scenario, onClose }) => {
    const isEditing = !!scenario;
    const [formData, setFormData] = useState({
        title: scenario?.title || "",
        description: scenario?.description || "",
        difficulty: scenario?.difficulty || 1,
        published: scenario?.published || false
    });

    const mutation = useOperatorAction({
        mutationFn: (data) => isEditing
            ? operatorApi.updateScenario(scenario.scenarioId, data)
            : operatorApi.createScenario(data),
        invalidateKeys: [['scenarios']],
        successMessage: isEditing ? "Scenario updated." : "Scenario created.",
        onCloseDrawer: onClose
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditing ? "Edit Scenario" : "New Scenario"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">Close</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty (1-5)</label>
                            <input
                                type="number" min="1" max="5"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center cursor-pointer gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                    checked={formData.published}
                                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                />
                                <span className="text-sm font-medium text-slate-700">Published</span>
                            </label>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
                    >
                        {mutation.isPending ? "Saving..." : "Save Scenario"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScenarioManagement;
