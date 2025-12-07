import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, MoreVertical, Edit2, Copy, Trash2,
    Monitor, Speaker, LayoutGrid
} from 'lucide-react';
import { clsx } from 'clsx';
import { operatorApi } from '../../services/operatorApi';

export default function ProductCatalogManager() {
    const [catalog, setCatalog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await operatorApi.getProductCatalog();
        if (res.success) {
            setCatalog(res.data.catalog);
        }
        setLoading(false);
    };

    if (loading || !catalog) return <div className="p-8 text-center">Loading Catalog...</div>;

    // Flatten models for display
    const allModels = Object.entries(catalog.models).flatMap(([catKey, models]) => models);
    const filteredModels = allModels.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = activeCategory === 'All' || m.categoryKey === activeCategory;
        return matchSearch && matchCat;
    });

    const categories = ['All', ...Object.keys(catalog.categories).flatMap(type => catalog.categories[type])];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* --- Header --- */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Product Catalog Manager</h1>
                    <p className="text-sm text-slate-500">Manage device specifications, pricing, and regional availability.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50">
                        <Filter size={18} /> Import
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">
                        <Plus size={18} /> Add Model
                    </button>
                </div>
            </header>

            {/* --- Filter Bar --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by model name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 min-w-[140px]">
                        <option>Region: Global</option>
                        <option>Brazil (BR)</option>
                        <option>Korea (KR)</option>
                    </select>
                </div>
            </div>

            {/* --- Main Content Split --- */}
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">

                {/* Left: Categories */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase px-3 mb-2">Categories</h3>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center",
                                        activeCategory === cat ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <span>{cat}</span>
                                    {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                </button>
                            ))}
                        </div>
                        <button className="w-full mt-4 flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Plus size={14} /> Add Category
                        </button>
                    </div>
                </aside>

                {/* Right: Model Grid */}
                <main className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
                        {filteredModels.map(model => (
                            <article key={model.id} className="relative group rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <header className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            {model.categoryKey.includes('Soundbar') ? <Speaker size={20} /> : <Monitor size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 leading-tight">{model.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">{model.line} • {model.categoryKey}</p>
                                        </div>
                                    </div>
                                    {model.isActive && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                                            Active
                                        </span>
                                    )}
                                </header>

                                {/* Card Body */}
                                <div className="mt-1">
                                    <div className="flex items-baseline gap-1.5 mb-3">
                                        <span className="text-lg font-bold text-slate-900">${model.basePrice.toLocaleString()}</span>
                                        <span className="text-xs text-slate-400">Base</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {model.sizes.map(size => (
                                            <span key={size} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600">
                                                {size}"
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <footer className="flex justify-end gap-2 pt-3 mt-auto border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg" title="Duplicate">
                                        <Copy size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Disable">
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-sm">
                                        <Edit2 size={12} /> Edit
                                    </button>
                                </footer>
                            </article>
                        ))}

                        {/* New Item Placeholder */}
                        <button className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500 transition-all min-h-[200px]">
                            <Plus size={32} className="mb-2 opacity-50" />
                            <span className="text-sm font-bold">Add New Model</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
