import React from 'react';
import { Calendar, User, Monitor, ChevronRight } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import clsx from 'clsx';

export default function SalesLabHistory({ onBack, onSelectSession }) {
    const { sessions } = useChatStore();

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 md:p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ChevronRight size={20} className="rotate-180 md:w-6 md:h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">Session History</h1>
                        <p className="text-sm md:text-base text-slate-500 mt-1">Review your past roleplay sessions.</p>
                    </div>
                </div>
                {sessions.length > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
                                useChatStore.setState({ sessions: [] });
                            }
                        }}
                        className="text-xs md:text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                        Clear History
                    </button>
                )}
            </div>

            <div className="space-y-3 md:space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-center py-12 md:py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Monitor size={24} className="md:w-8 md:h-8" />
                        </div>
                        <p className="text-slate-500 font-medium text-sm md:text-base">No history yet.</p>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Complete your first simulation to see results here.</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => onSelectSession && onSelectSession(session.id)}
                            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className={clsx(
                                    "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shadow-sm border",
                                    (session.totalScore || 0) >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        (session.totalScore || 0) >= 60 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-red-50 text-red-600 border-red-100"
                                )}>
                                    {session.totalScore || 0}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors text-lg">
                                        {session.product?.name || 'Unknown Product'}
                                    </h3>
                                    <div className="text-sm text-slate-500 flex items-center gap-4 mt-1.5 font-medium">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="flex items-center gap-1.5">
                                            <User size={14} />
                                            {session.customer?.traits?.map(t => t.label).join(', ') || 'Unknown Customer'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded-full text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
