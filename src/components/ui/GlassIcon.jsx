import React from 'react';
import { twMerge } from 'tailwind-merge';

export const GlassIcon = ({
    icon: Icon, // eslint-disable-line no-unused-vars
    size = 'md',
    variant = 'primary',
    className,
    ...rest
}) => {
    // eslint-disable-next-line no-unused-vars
    const { icon: _Icon, className: _className, size: _size, ...props } = rest;

    const sizes = {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
        xl: "p-6"
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32
    };

    const variants = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-green-100 text-green-600",
        warning: "bg-yellow-100 text-yellow-600",
        danger: "bg-red-100 text-red-600",
        gold: "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 border border-yellow-200",
        premium: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-indigo-100",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner"
    };

    return (
        <div className={twMerge(
            "rounded-2xl flex items-center justify-center transition-all duration-300",
            variants[variant],
            sizes[size],
            className
        )}>
            <Icon size={iconSizes[size]} strokeWidth={2.5} />
        </div>
    );
};
