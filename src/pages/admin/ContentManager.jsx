import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operatorApi } from '../../services/operatorApi';
import { FileText, Video, Link as LinkIcon, Upload, Play, Brain, CheckCircle, Clock, AlertCircle, Layers, ClipboardCheck, Search, Plus, Filter, MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';

// Extended Mock Data generator for demo purposes
const generateMockContent = (type) => {
    if (type === 'module') return [
        { materialId: 'm1', title: 'Premium TV Sales Tech', type: 'scorm', category: 'module', status: 'published', date: '2024.11.10', tags: ['tv', 'sales'] },
        { materialId: 'm2', title: 'Customer Empathy 101', type: 'video', category: 'module', status: 'published', date: '2024.11.15', tags: ['soft-skills'] }
    ];
    if (type === 'quiz') return [
        { materialId: 'q1', title: 'OLED vs QNED Test', type: 'quiz', category: 'quiz', status: 'active', date: '2024.11.22', tags: ['assessment'] },
        { materialId: 'q2', title: 'Final Certification', type: 'exam', category: 'quiz', status: 'draft', date: '2024.12.01', tags: ['certification'] }
    ];
    return [];
};

export default function ContentManager() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('material'); // material, module, quiz
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        loadContent();
    }, [activeTab]);

    const loadContent = async () => {
        setLoading(true);
        setSelectedItem(null);

        // In a real app, we would pass the type to the API
        // const res = await operatorApi.getContent({ type: activeTab });

        let data = [];
        if (activeTab === 'material') {
            const res = await operatorApi.getMaterials();
            if (res.success) {
                // Enrich with category for clarity
                data = res.data.materials.map(m => ({ ...m, category: 'material' }));
            }
        } else {
            // Mock data for new tabs
            data = generateMockContent(activeTab);
            // Simulate network delay
            await new Promise(r => setTimeout(r, 500));
        }

        setContentList(data);
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
        // Mock file upload
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        // Simulate upload delay
        await new Promise(r => setTimeout(r, 1000));

        const newMat = {
            title: file.name.split('.')[0],
            description: "Uploaded via Console",
            type: file.type.includes('pdf') ? 'pdf' : 'video',
            category: activeTab, // Assign current tab as category
            tags: ['upload'],
            file: { fileName: file.name, fileSize: file.size },
            date: new Date().toLocaleDateString()
        };

        // In real app, call different APIs based on tab
        if (activeTab === 'material') {
            const res = await operatorApi.createMaterial(newMat);
            if (res.success) {
                setContentList([...contentList, res.data.material]);
            }
        } else {
            // Mock success for other types
            const mockId = Math.random().toString(36).substr(2, 9);
            setContentList([...contentList, { ...newMat, materialId: mockId }]);
        }

        setUploading(false);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const tabs = [
        { id: 'material', label: 'Materials', icon: FileText },
        { id: 'module', label: 'Modules', icon: Layers },
        { id: 'quiz', label: 'Quizzes', icon: ClipboardCheck },
    ];

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Left: Content List */}
            <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header with Tabs */}
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex bg-slate-200/50 p-1 rounded-lg mb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all",
                                    activeTab === tab.id
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
                            disabled={uploading}
                        >
                            <Plus size={14} />
                            {uploading ? '...' : 'Upload'}
                        </button>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {loading ? <div className="p-8 text-center text-slate-400 text-sm">Loading components...</div> :
                        contentList.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No items found</div> :
                            contentList.map(item => (
                                <div
                                    key={item.materialId}
                                    onClick={() => setSelectedItem(item)}
                                    className={clsx(
                                        "p-3 rounded-lg border cursor-pointer transition-all flex gap-3 items-start",
                                        selectedItem?.materialId === item.materialId
                                            ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                            : "bg-white border-slate-100 hover:border-slate-300"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        activeTab === 'material' ? "bg-blue-50 text-blue-600" :
                                            activeTab === 'module' ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {activeTab === 'material' && <FileText size={20} />}
                                        {activeTab === 'module' && <Layers size={20} />}
                                        {activeTab === 'quiz' && <ClipboardCheck size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.type}</span>
                                            {item.date && <span className="text-[10px] text-slate-400">• {item.date}</span>}
                                            {item.autoGeneratedModule?.status === 'completed' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">
                                                    <Brain size={10} /> AI Ready
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>

            {/* Right: Content Preview & AI Status */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {selectedItem ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                            activeTab === 'material' ? "bg-blue-100 text-blue-700" :
                                                activeTab === 'module' ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                                        )}>
                                            {selectedItem.category || activeTab}
                                        </span>
                                        {selectedItem.status && (
                                            <span className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-0.5 rounded-full">
                                                {selectedItem.status}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedItem.title}</h2>
                                    <p className="text-slate-500 text-sm mt-1">{selectedItem.description || "No description provided."}</p>
                                </div>
                                <div className="flex gap-2">
                                    {(selectedItem.tags || []).map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            {/* AI Extraction Status (Only for Materials for now) */}
                            {activeTab === 'material' && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Brain size={16} className="text-indigo-600" />
                                        AI Content Extraction
                                    </h3>

                                    {selectedItem.autoGeneratedModule?.status === 'completed' ? (
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                                            <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                                                <CheckCircle size={18} />
                                                Extraction Complete
                                            </div>
                                            <p className="text-sm text-indigo-600 mb-4">
                                                Successfully generated training module <strong>{selectedItem.autoGeneratedModule.moduleId}</strong>.
                                            </p>
                                            <button
                                                onClick={() => window.location.href = `#/admin/cms/quiz?id=${selectedItem.autoGeneratedModule.moduleId}&materialId=${selectedItem.materialId}`}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                            >
                                                Review Training Module
                                            </button>
                                        </div>
                                    ) : selectedItem.autoGeneratedModule?.status === 'pending' ? (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                                            <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                                                <Clock size={18} className="animate-spin" />
                                                AI Processing in Progress...
                                            </div>
                                            <p className="text-sm text-amber-600">
                                                Analyzing document structure, extracting key concepts, and generating quiz questions.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                                            <p className="text-sm text-slate-500">No AI module generated yet.</p>
                                            <button className="text-xs font-bold text-indigo-600 hover:underline">Start Extraction</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Specific details based on type */}
                            {activeTab === 'quiz' && (
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6">
                                    <h3 className="font-bold text-emerald-800 mb-2">Quiz Statistics</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-emerald-600">85%</div>
                                            <div className="text-xs text-emerald-500">Pass Rate</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-emerald-600">12m</div>
                                            <div className="text-xs text-emerald-500">Avg Time</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-emerald-600">342</div>
                                            <div className="text-xs text-emerald-500">Attempts</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Meta */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Properties</h3>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                                        {activeTab === 'material' ? (selectedItem.type === 'pdf' ? <FileText size={24} /> : <Video size={24} />) :
                                            activeTab === 'module' ? <Layers size={24} /> : <ClipboardCheck size={24} />}
                                    </div>
                                    <div>
                                        <div className="font-mono text-sm text-slate-700">{selectedItem.file?.fileName || selectedItem.title}</div>
                                        <div className="text-xs text-slate-400">{selectedItem.file?.fileSize ? (selectedItem.file.fileSize / 1024 / 1024).toFixed(2) + " MB" : "Managed Asset"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        {activeTab === 'material' && <FileText size={48} className="mb-4 opacity-20" />}
                        {activeTab === 'module' && <Layers size={48} className="mb-4 opacity-20" />}
                        {activeTab === 'quiz' && <ClipboardCheck size={48} className="mb-4 opacity-20" />}
                        <p>Select a {activeTab} to preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}
