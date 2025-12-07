import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PulseButton({
    children,
    onClick,
    className,
    variant = 'primary', // primary, neon, ghost
    icon: Icon,
    disabled = false,
    pulse = false
}) {
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover",
        neon: "bg-accent-neon text-primary-dark shadow-lg shadow-accent-neon/30 hover:bg-white",
        ghost: "bg-transparent text-primary hover:bg-white/10 hover:text-primary-hover"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={twMerge(
                "relative flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        >
            {pulse && (
                <span className="absolute -inset-1 rounded-xl bg-inherit opacity-30 animate-pulse-glow" />
            )}

            <div className="relative flex items-center gap-2 z-10">
                {Icon && <Icon size={20} />}
                {children}
            </div>
        </motion.button>
    );
}
