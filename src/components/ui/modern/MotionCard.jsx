import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function MotionCard({
    children,
    className,
    onClick,
    delay = 0,
    hoverScale = 1.02,
    glass = true
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={onClick || hoverScale ? {
                y: -5,
                transition: { duration: 0.2 }
            } : {}}
            onClick={onClick}
            className={twMerge(
                "relative overflow-hidden rounded-2xl border transition-colors",
                glass ? "glass-card" : "bg-white border-slate-200 shadow-sm",
                onClick && "cursor-pointer hover:shadow-neon hover:border-primary/30",
                className
            )}
        >
            {/* Optional Gradient Overlay for Premium Feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
