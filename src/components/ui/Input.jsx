import React, { forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
    className,
    icon: Icon,
    error,
    label,
    ...props
}, ref) => {
    const baseStyles = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50 backdrop-blur-sm disabled:bg-gray-50 disabled:text-gray-400";
    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "";
    const iconStyles = Icon ? "pl-11" : "";

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(baseStyles, errorStyles, iconStyles, className)}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
