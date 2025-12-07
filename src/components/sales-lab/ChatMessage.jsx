import React, { useState } from 'react';
import { User, Bot, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isStreaming = false }) => {
    const isUser = message.role === 'user';
    const [showDetails, setShowDetails] = useState(false);

    // Parse AI response to separate core summary and details
    const parseAIResponse = (text) => {
        if (isUser) return { summary: text, details: null };

        const summaryMatch = text.match(/### 📌 핵심 요약.*?(?=###|---SPEECH---|$)/s);
        const tipsMatch = text.match(/### 🔧 실전 팁.*?(?=###|---SPEECH---|$)/s);
        const scriptMatch = text.match(/\[실전 스크립트.*?(?=###|---SPEECH---|$)/s);
        const detailsMatch = text.match(/### 📚 상세 정보.*?(?=---SPEECH---|$)/s);

        let summary = text;
        let details = null;

        if (summaryMatch) {
            summary = summaryMatch[0];
            if (tipsMatch) summary += '\n' + tipsMatch[0];
            if (scriptMatch) summary += '\n' + scriptMatch[0];
            if (detailsMatch) details = detailsMatch[0];
        }

        return { summary, details };
    };

    const { summary, details } = parseAIResponse(message.text);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx(
                "flex w-full mb-6",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "flex max-w-[85%] md:max-w-[75%] gap-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden",
                    isUser
                        ? "bg-primary text-white"
                        : "bg-white text-primary border border-slate-200"
                )}>
                    {isUser ? <User size={20} /> : <Bot size={20} className="text-primary" />}
                    {/* Status Dot */}
                    <div className={clsx(
                        "absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                        isUser ? "bg-green-500" : "bg-blue-500 animate-pulse"
                    )} />
                </div>

                {/* Message Bubble */}
                <div className={clsx(
                    "p-5 rounded-3xl shadow-sm border text-[15px] leading-relaxed break-words relative overflow-hidden transition-all duration-200",
                    isUser
                        ? "bg-primary text-white rounded-tr-sm border-primary"
                        : "bg-white text-slate-700 rounded-tl-sm border-slate-200"
                )}>
                    {/* Streaming Glow Effect */}
                    {isStreaming && !isUser && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/50 to-transparent animate-shimmer pointer-events-none" />
                    )}

                    <div className={clsx("prose prose-sm max-w-none", isUser ? "prose-invert" : "prose-slate")}>
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                strong: ({ node, ...props }) => <span className={isUser ? "font-bold" : "font-bold bg-yellow-50 text-slate-900 px-1 rounded"} {...props} />
                            }}
                        >
                            {summary}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="inline-flex gap-1 ml-2 align-middle">
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </span>
                        )}
                    </div>

                    {/* Show Details Button */}
                    {details && !isUser && (
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-primary hover:text-indigo-700 font-bold text-xs uppercase tracking-wide transition-colors w-full justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles size={14} className="group-hover:text-amber-500 transition-colors" />
                                {showDetails ? 'Hide Analysis' : 'View Analysis'}
                            </span>
                            <ChevronDown
                                size={16}
                                className={clsx(
                                    "transition-transform bg-indigo-50 text-indigo-500 rounded-full p-0.5",
                                    showDetails ? "rotate-180" : ""
                                )}
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Details */}
            {details && !isUser && showDetails && (
                <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    className="mt-3 ml-[3.5rem] md:ml-[4rem] p-5 bg-slate-50 border border-slate-200 border-l-4 border-l-secondary rounded-r-2xl text-sm prose prose-sm max-w-[85%] md:max-w-[75%] shadow-inner"
                >
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0 text-slate-600" {...props} />,
                            li: ({ node, ...props }) => <li className="marker:text-secondary" {...props} />
                        }}
                    >
                        {details}
                    </ReactMarkdown>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
