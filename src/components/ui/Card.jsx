import React from 'react';

import { twMerge } from 'tailwind-merge';

export const Card = ({
    children,
    className,
    variant = 'glass',
    padding = 'md',
    hover = false,
    onClick,
    ...props
}) => {
    const baseStyles = "rounded-2xl transition-all duration-200";

    const variants = {
        glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-premium",
        panel: "bg-white/60 backdrop-blur-md border border-white/30 shadow-sm",
        solid: "bg-white border border-gray-100 shadow-sm",
        outline: "bg-transparent border border-gray-200",
        flat: "bg-gray-50 border-none"
    };

    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    };

    const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";

    return (
        <div
            className={twMerge(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};
