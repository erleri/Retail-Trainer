import React from 'react';

import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-white text-primary border border-gray-100 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline: "bg-transparent text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-primary",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-primary",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md",
        glass: "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30"
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
        icon: "p-2"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
            {children}
        </button>
    );
};
