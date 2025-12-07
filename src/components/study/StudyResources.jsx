
import React, { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, Film, Lock, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { operatorApi } from '../../services/operatorApi'; // Changed source

export default function StudyResources() {
    const { language } = useAppStore();
    const t = translations[language]?.study?.resources || translations['en'].study.resources;

    // State
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFiles = async () => {
        setLoading(true);
        try {
            // Refinement #3: Fetch from Content Engine (Mock)
            const res = await operatorApi.getMaterials();
            if (res.success) {
                setFiles(res.data.materials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (e) {
            console.error("Failed to load resources", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon className="text-purple-500" size={24} />;
            case 'video': return <Film className="text-red-500" size={24} />;
            case 'pdf': return <FileText className="text-orange-500" size={24} />;
            default: return <FileText className="text-blue-500" size={24} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Learning Resources</h3>
                    <p className="text-blue-600">
                        Access study materials uploaded by administrators.
                    </p>
                </div>
                <button onClick={loadFiles} className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transaction-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* File List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        {t?.empty || "No resources uploaded yet."}
                    </div>
                )}

                {loading && <div className="p-10 text-center">Loading Content Engine...</div>}

                {files.map(file => (
                    <div key={file.materialId} className="glass-card p-4 rounded-xl border border-white/20 bg-white/50 flex items-center gap-4 group hover:shadow-md transition-all relative overflow-hidden">
                        {/* Version Indicator (Refinement #3) */}
                        {(file.version && file.version > 1) && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                v{file.version}
                            </div>
                        )}

                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            {getIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-text-primary truncate">{file.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <span className="uppercase bg-slate-100 px-1 rounded">{file.category}</span>
                                <span>•</span>
                                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
