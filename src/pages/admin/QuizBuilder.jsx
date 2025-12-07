import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { operatorApi } from '../../services/operatorApi';
import { useOperatorAction } from '../../hooks/useOperatorAction';
import { Brain, Plus, Trash2, Save, Wand2, ArrowLeft, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function QuizBuilder() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const quizId = searchParams.get('id');
    const sourceMaterialId = searchParams.get('materialId');

    const [generating, setGenerating] = useState(false);
    const [quiz, setQuiz] = useState({
        title: "New Quiz",
        questions: [],
        difficulty: 2,
        tags: []
    });

    // --- Load Existing Quiz ---
    const { data: existingQuiz, isLoading } = useQuery({
        queryKey: ['quiz', quizId],
        queryFn: async () => {
            if (!quizId) return null;
            const res = await operatorApi.getQuiz(quizId);
            return res.data?.quiz;
        },
        enabled: !!quizId
    });

    useEffect(() => {
        if (existingQuiz) {
            setQuiz(existingQuiz);
        } else if (sourceMaterialId) {
            // Suggest title based on material (mock)
            setQuiz(prev => ({ ...prev, title: `Quiz for Material ${sourceMaterialId}`, materialId: sourceMaterialId }));
        }
    }, [existingQuiz, sourceMaterialId]);

    // --- Actions ---
    const saveAction = useOperatorAction({
        mutationFn: (data) => quizId
            ? operatorApi.updateQuiz(quizId, data)
            : operatorApi.createQuiz(data),
        invalidateKeys: [['quizzes'], ['quiz', quizId]],
        successMessage: `Quiz ${quizId ? 'updated' : 'created'} successfully.`
    });

    const handleSave = () => {
        saveAction.mutate(quiz);
    };

    const handleGenerate = async () => {
        if (!sourceMaterialId && !quiz.materialId) {
            alert("No source material linked. Cannot auto-generate.");
            return;
        }
        setGenerating(true);
        const mid = sourceMaterialId || quiz.materialId;
        const res = await operatorApi.generateQuiz(mid);
        if (res.success) {
            setQuiz(res.data.quiz);
            // If it was a new creation via generation, update URL to edit mode? 
            // Ideally yes, but for now we just load the data into the form.
        }
        setGenerating(false);
    };

    const addQuestion = () => {
        const newQ = {
            questionId: `q_${Date.now()}`,
            type: 'mcq',
            question: "New Question",
            options: ["Option A", "Option B"],
            answer: 0,
            explanation: ""
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQ] });
    };

    const updateQuestion = (idx, field, val) => {
        const newQs = [...quiz.questions];
        newQs[idx] = { ...newQs[idx], [field]: val };
        setQuiz({ ...quiz, questions: newQs });
    };

    const updateOption = (qIdx, optIdx, val) => {
        const newQs = [...quiz.questions];
        newQs[qIdx].options[optIdx] = val;
        setQuiz({ ...quiz, questions: newQs });
    };

    const removeQuestion = (idx) => {
        const newQs = quiz.questions.filter((_, i) => i !== idx);
        setQuiz({ ...quiz, questions: newQs });
    };

    if (isLoading) return <div className="p-10 text-center">Loading Quiz...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quiz Builder</h1>
                        <p className="text-slate-500">{quizId ? "Edit existing assessment" : "Create new assessment"}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerate}
                        disabled={generating || (!sourceMaterialId && !quiz.materialId)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                        <Wand2 size={18} className={generating ? "animate-spin" : ""} />
                        {generating ? "AI Generating..." : "AI Auto-Generate"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveAction.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
                    >
                        {saveAction.isPending ? "Saving..." : <><Save size={18} /> Save Quiz</>}
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-1">Quiz Title</label>
                <input
                    type="text"
                    value={quiz.title}
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                    className="w-full text-lg font-bold border-b-2 border-slate-200 focus:border-indigo-600 outline-none py-2 transition-colors"
                />
                <div className="mt-4 flex gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Material ID</label>
                        <input
                            type="text"
                            disabled
                            value={quiz.materialId || sourceMaterialId || "None"}
                            className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded text-sm border border-slate-200"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Difficulty</label>
                        <select
                            value={quiz.difficulty}
                            onChange={(e) => setQuiz({ ...quiz, difficulty: parseInt(e.target.value) })}
                            className="bg-white text-slate-700 px-3 py-1.5 rounded text-sm border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value={1}>Beginner</option>
                            <option value={2}>Intermediate</option>
                            <option value={3}>Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, idx) => (
                    <div key={q.questionId} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={() => removeQuestion(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                {idx + 1}
                            </span>
                            <select
                                value={q.type}
                                onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border-none outline-none cursor-pointer hover:bg-slate-200"
                            >
                                <option value="mcq">Multiple Choice</option>
                                <option value="tf">True/False</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                                className="w-full font-medium text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-indigo-200 p-2 outline-none transition-colors"
                                placeholder="Enter question text..."
                            />
                        </div>

                        <div className="space-y-2 pl-11">
                            {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-3">
                                    <div
                                        onClick={() => updateQuestion(idx, 'answer', optIdx)}
                                        className={clsx(
                                            "w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors",
                                            q.answer === optIdx ? "border-green-500 bg-green-50" : "border-slate-300 hover:border-slate-400"
                                        )}>
                                        {q.answer === optIdx && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                        className="flex-1 text-sm text-slate-600 border border-transparent hover:border-slate-200 focus:border-indigo-200 rounded px-2 py-1 outline-none"
                                        placeholder={`Option ${optIdx + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pl-11">
                            <div className="flex items-center gap-2 mb-1">
                                <Brain size={14} className="text-blue-500" />
                                <span className="text-xs font-bold text-blue-500 uppercase">Explanation</span>
                            </div>
                            <textarea
                                value={q.explanation || ""}
                                onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                                className="w-full text-xs text-slate-600 p-2 bg-slate-50 rounded border border-transparent focus:bg-white focus:border-blue-200 outline-none resize-none"
                                placeholder="Explain why the answer is correct..."
                                rows={2}
                            />
                        </div>
                    </div>
                ))}

                <button
                    onClick={addQuestion}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                >
                    <Plus size={20} />
                    Add Question
                </button>
            </div>
        </div>
    );
}
