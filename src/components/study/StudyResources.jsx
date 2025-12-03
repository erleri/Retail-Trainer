
import React, { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, Film, Lock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { localDB } from '../../lib/storage';

export default function StudyResources() {
    const { language } = useAppStore();
    const t = translations[language]?.study?.resources || translations['en'].study.resources;

    // State
    const [files, setFiles] = useState([]);

    const loadFiles = async () => {
        try {
            const savedFiles = await localDB.getFiles();
            setFiles(savedFiles.sort((a, b) => b.date - a.date));
        } catch (e) {
            console.error("Failed to load resources", e);
        }
    };

    // Load files from IndexedDB on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Learning Resources</h3>
                <p className="text-blue-600">
                    Access study materials uploaded by administrators. Use these resources to prepare for quizzes and improve your sales skills.
                </p>
            </div>

            {/* File List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        {t?.empty || "No resources uploaded yet."}
                    </div>
                )}

                {files.map(file => (
                    <div key={file.id} className="glass-card p-4 rounded-xl border border-white/20 bg-white/50 flex items-center gap-4 group hover:shadow-md transition-all">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            {getIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-text-primary truncate">{file.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{new Date(file.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
