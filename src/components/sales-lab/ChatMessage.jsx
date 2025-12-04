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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "flex w-full mb-6",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "flex max-w-[85%] md:max-w-[75%] gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2",
                    isUser
                        ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                        : "bg-white border-green-100 text-green-600"
                )}>
                    {isUser ? <User size={20} /> : <Bot size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={clsx(
                    "p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words relative overflow-hidden",
                    isUser
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-indigo-200"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-gray-100"
                )}>
                    {/* Streaming Glow Effect */}
                    {isStreaming && !isUser && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                    )}

                    <div className={clsx("prose prose-sm max-w-none", isUser ? "prose-invert" : "")}>
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                            }}
                        >
                            {summary}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="inline-block w-1.5 h-4 ml-1 bg-current align-middle animate-pulse" />
                        )}
                    </div>

                    {/* Show Details Button */}
                    {details && !isUser && (
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                        >
                            <span>{showDetails ? '상세 정보 숨기기' : '상세 정보 보기'}</span>
                            <ChevronDown
                                size={16}
                                className={clsx(
                                    "transition-transform",
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 ml-13 md:ml-16 p-4 bg-blue-50 border-l-4 border-blue-300 rounded-r-lg text-sm prose prose-sm max-w-none"
                >
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
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
