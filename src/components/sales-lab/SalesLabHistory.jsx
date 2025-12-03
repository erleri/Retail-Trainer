import React from 'react';
import { Calendar, User, Monitor, ChevronRight } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export default function SalesLabHistory({ onBack, onSelectSession }) {
    const { sessions } = useChatStore();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronRight size={24} className="rotate-180 text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Session History</h1>
                        <p className="text-text-secondary">Review your past roleplay sessions.</p>
                    </div>
                </div>
                {sessions.length > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
                                useChatStore.setState({ sessions: [] });
                            }
                        }}
                        className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Clear History
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                        <p>No history yet. Start your first roleplay!</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => onSelectSession && onSelectSession(session.id)}
                            className="glass-card p-4 rounded-xl border border-white/20 shadow-sm flex justify-between items-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group bg-white/50 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center font-bold text-primary text-lg shadow-inner">
                                    {session.totalScore || 0}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary flex items-center gap-2 group-hover:text-primary transition-colors text-lg">
                                        <Monitor size={18} className="text-gray-400 group-hover:text-primary" /> {session.product?.name || 'Unknown Product'}
                                    </h3>
                                    <div className="text-sm text-text-secondary flex items-center gap-4 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {session.customer?.traits?.map(t => t.label).join(', ') || 'Unknown Customer'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
