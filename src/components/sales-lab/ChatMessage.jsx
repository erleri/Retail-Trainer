import React from 'react';
import { User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isStreaming = false }) => {
    const isUser = message.role === 'user';

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
                            {message.text}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="inline-block w-1.5 h-4 ml-1 bg-current align-middle animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
