import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, FileText, Video, MessageSquare, MoreHorizontal, Edit3, Eye, Upload, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { localDB } from '../../lib/storage';
// import { fileProcessor } from '../../lib/fileProcessor';
import { aiService } from '../../lib/gemini';
import { useAppStore } from '../../store/appStore';

export default function ContentManagement() {
    const [activeTab, setActiveTab] = useState('resources'); // resources, courses, faqs
    const [files, setFiles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [generatingId, setGeneratingId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const { language } = useAppStore();



    const loadFiles = useCallback(async () => {
        try {
            const savedFiles = await localDB.getFiles();
            setFiles(savedFiles.sort((a, b) => b.date - a.date));
        } catch (e) {
            console.error("Failed to load files", e);
        }
    }, []);

    const loadCourses = useCallback(async () => {
        try {
            const savedCourses = await localDB.getCourses();
            // Filter only generated courses if needed, or show all
            setCourses(savedCourses.filter(c => c.isCustom).sort((a, b) => (b.id > a.id ? 1 : -1)));
        } catch (e) {
            console.error("Failed to load courses", e);
        }
    }, []);

    const loadFAQs = useCallback(async () => {
        try {
            const savedFaqs = await localDB.getFAQs();
            setFaqs(savedFaqs.reverse()); // Show newest first
        } catch (e) {
            console.error("Failed to load FAQs", e);
        }
    }, []);

    const loadAllData = useCallback(async () => {
        await Promise.all([loadFiles(), loadCourses(), loadFAQs()]);
    }, [loadFiles, loadCourses, loadFAQs]);

    useEffect(() => {
        if (localDB) {
            loadAllData().catch(e => console.error("loadAllData failed", e));
        }
    }, [loadAllData]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    };

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    const processFiles = async (newFiles) => {
        setUploading(true);
        try {
            for (const file of newFiles) {
                let type = 'other';
                if (file.type.startsWith('image/')) type = 'image';
                else if (file.type.startsWith('video/')) type = 'video';
                else if (file.type === 'application/pdf') type = 'pdf';

                const newFile = {
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    type: type,
                    date: new Date(),
                    fileObj: file,
                    status: 'Uploaded'
                };

                await localDB.saveFile(newFile);
            }
            await loadFiles();
            setActiveTab('resources');
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (id) => {
        if (confirm("Are you sure you want to delete this file?")) {
            await localDB.deleteFile(id);
            await loadFiles();
            alert("File deleted successfully.");
        }
    };

    const handleDeleteCourse = async (id) => {
        if (confirm("Are you sure you want to delete this course? This will also delete its quiz.")) {
            await localDB.deleteCourse(id);
            await loadCourses();
            alert("Course deleted successfully.");
        }
    };

    const handleDeleteFAQ = async (id) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            await localDB.deleteFAQ(id);
            await loadFAQs();
            alert("FAQ deleted successfully.");
        }
    };

    const handleGenerateCourse = async (file) => {
        if (generatingId) return;
        setGeneratingId(file.id);

        try {
            let content = "";
            if (file.fileObj) {
                try {
                    // content = await fileProcessor.extractText(file.fileObj);
                    console.warn("File processing temporarily disabled");
                } catch (e) {
                    console.warn("Text extraction failed", e);
                }
            }

            if (!content) {
                content = `File Name: ${file.name}. (Content extraction not supported or failed).`;
            }

            const topic = file.name.replace(/\.[^/.]+$/, "");
            const result = await aiService.generateCourse(topic, content, language);

            if (result && result.course && result.quiz) {
                const newCourse = { ...result.course, id: `gen_${Date.now()}`, isCustom: true };
                await localDB.saveCourse(newCourse);
                await localDB.saveQuiz(newCourse.id, result.quiz);

                if (result.faq) {
                    // Remove ID from AI generated FAQs to allow autoIncrement to work
                    // eslint-disable-next-line no-unused-vars
                    const faqsToSave = result.faq.map(({ id: _, ...rest }) => rest);
                    await localDB.saveFAQs(faqsToSave);
                }

                // Update file status locally to show "Generated"
                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, isGenerated: true } : f));

                await loadCourses();
                await loadFAQs();
                alert("Course and FAQs generated successfully!");
            }
        } catch (error) {
            console.error("Failed to generate course", error);
            alert("Failed to generate course.");
        } finally {
            setGeneratingId(null);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon className="text-purple-500" size={24} />;
            case 'video': return <Video className="text-red-500" size={24} />;
            case 'pdf': return <FileText className="text-orange-500" size={24} />;
            default: return <FileText className="text-blue-500" size={24} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Content Management</h1>
                    <p className="text-text-secondary">Manage resources, courses, and FAQs.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('resources')}
                    className={clsx(
                        "px-4 py-2 font-bold text-sm transition-colors relative",
                        activeTab === 'resources' ? "text-primary" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Resource Library
                    {activeTab === 'resources' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('courses')}
                    className={clsx(
                        "px-4 py-2 font-bold text-sm transition-colors relative",
                        activeTab === 'courses' ? "text-primary" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Generated Courses
                    {activeTab === 'courses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('faqs')}
                    className={clsx(
                        "px-4 py-2 font-bold text-sm transition-colors relative",
                        activeTab === 'faqs' ? "text-primary" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Generated FAQs
                    {activeTab === 'faqs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'resources' && (
                <div className="space-y-6">
                    {/* Upload Area */}
                    <div
                        className={clsx(
                            "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group",
                            isDragging
                                ? "border-primary bg-primary/5 scale-[1.01]"
                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            {uploading ? <Sparkles className="animate-spin" size={32} /> : <Upload size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">
                            Click or Drag files here
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                            Support for PDF, Text, Images
                        </p>
                        <button
                            onClick={() => document.getElementById('cms-file-upload').click()}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
                        >
                            Select Files
                        </button>
                        <input
                            id="cms-file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.txt,.doc,.docx,.png,.jpg"
                        />
                    </div>

                    {/* File List */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Uploaded Files</h3>
                            <span className="text-sm text-gray-500">{files.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {files.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    No resources uploaded yet.
                                </div>
                            )}
                            {files.map((file) => (
                                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            {getIcon(file.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-primary">{file.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                <span>{file.size}</span>
                                                <span>•</span>
                                                <span>{new Date(file.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleGenerateCourse(file)}
                                            disabled={generatingId !== null || file.isGenerated}
                                            className={clsx(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                                                file.isGenerated
                                                    ? "bg-green-50 text-green-600 cursor-default"
                                                    : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                            )}
                                        >
                                            {generatingId === file.id ? <Sparkles size={16} className="animate-spin" /> :
                                                file.isGenerated ? <Sparkles size={16} /> : <Sparkles size={16} />}
                                            {file.isGenerated ? "Course Generated" : "Generate Course"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFile(file.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Generated Courses</h3>
                        <span className="text-sm text-gray-500">{courses.length} items</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {courses.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                No generated courses found.
                            </div>
                        )}
                        {courses.map((course) => (
                            <div key={course.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary">{course.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span>{course.category}</span>
                                            <span>•</span>
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Course"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'faqs' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Generated FAQs</h3>
                        <span className="text-sm text-gray-500">{faqs.length} items</span>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {faqs.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                No generated FAQs found.
                            </div>
                        )}
                        {faqs.map((faq) => (
                            <div key={faq.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                                                {faq.category}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-text-primary text-sm mb-1">
                                            Q: {faq.question[language] || faq.question['en']}
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            A: {faq.answer[language] || faq.answer['en']}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFAQ(faq.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
