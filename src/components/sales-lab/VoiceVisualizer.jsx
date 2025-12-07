import React from 'react';
import { motion } from 'framer-motion';

export const VoiceVisualizer = ({ isActive }) => {
    if (!isActive) return null;

    return (
        <div className="flex items-center gap-1 h-8 px-4 bg-red-500/10 rounded-full border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
            <span className="text-xs font-bold text-red-500 uppercase mr-2 tracking-wider">Listening</span>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-red-500 rounded-full"
                    animate={{
                        height: [8, 16, 8],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );
};
