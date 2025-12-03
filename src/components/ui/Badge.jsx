import React from 'react';

import { twMerge } from 'tailwind-merge';

export const Badge = ({
    children,
    variant = 'primary',
    type = 'soft',
    className,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap";

    const variants = {
        primary: {
            soft: "bg-primary/10 text-primary",
            solid: "bg-primary text-white",
            outline: "border border-primary text-primary"
        },
        success: {
            soft: "bg-green-100 text-green-700",
            solid: "bg-green-500 text-white",
            outline: "border border-green-500 text-green-600"
        },
        warning: {
            soft: "bg-yellow-100 text-yellow-700",
            solid: "bg-yellow-500 text-white",
            outline: "border border-yellow-500 text-yellow-600"
        },
        danger: {
            soft: "bg-red-100 text-red-700",
            solid: "bg-red-500 text-white",
            outline: "border border-red-500 text-red-600"
        },
        info: {
            soft: "bg-blue-100 text-blue-700",
            solid: "bg-blue-500 text-white",
            outline: "border border-blue-500 text-blue-600"
        },
        neutral: {
            soft: "bg-gray-100 text-gray-700",
            solid: "bg-gray-500 text-white",
            outline: "border border-gray-300 text-gray-600"
        },
        gold: {
            soft: "bg-yellow-50 text-yellow-700 border border-yellow-200",
            solid: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md shadow-yellow-200",
            outline: "border border-yellow-500 text-yellow-600"
        },
        premium: {
            soft: "bg-indigo-50 text-indigo-700 border border-indigo-100",
            solid: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-200",
            outline: "border border-indigo-500 text-indigo-600"
        },
        shiny: {
            soft: "bg-white/50 backdrop-blur-md border border-white/50 text-gray-700 shadow-sm",
            solid: "bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-white/30 text-white shadow-glass",
            outline: "border border-white/50 text-white backdrop-blur-sm"
        }
    };

    const selectedVariant = variants[variant]?.[type] || variants.neutral.soft;

    return (
        <span
            className={twMerge(baseStyles, selectedVariant, className)}
            {...props}
        >
            {Icon && <Icon size={10} />}
            {children}
        </span>
    );
};
