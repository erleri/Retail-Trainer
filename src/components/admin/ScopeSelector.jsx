import React from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { clsx } from 'clsx';
import { Globe, Map, Building, Store } from 'lucide-react';

export default function ScopeSelector() {
    const { scope, setScope } = useAdminContext();

    const scopes = [
        { id: 'GLOBAL', label: 'Global', icon: Globe },
        { id: 'REGION', label: 'Region', icon: Map },
        { id: 'COUNTRY', label: 'Country', icon: Building },
        { id: 'BRANCH', label: 'Branch', icon: Store },
    ];

    return (
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {scopes.map((s) => (
                <button
                    key={s.id}
                    onClick={() => setScope(s.id)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                        scope === s.id
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    )}
                >
                    <s.icon size={12} className={scope === s.id ? "text-slate-300" : "text-slate-400"} />
                    {s.label}
                </button>
            ))}
        </div>
    );
}
