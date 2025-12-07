import React, { useState, useEffect } from 'react';
import {
    Users, Activity, Signal, Plus, Search, Filter,
    MoreHorizontal, Edit2, Shield, Lock, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { operatorApi } from '../../services/operatorApi';

export default function CustomerManager() {
    const [activeTab, setActiveTab] = useState('personas'); // personas | traits | difficulty
    const [loading, setLoading] = useState(true);

    // Data States
    const [personas, setPersonas] = useState([]);
    const [traits, setTraits] = useState([]);
    const [difficulties, setDifficulties] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [pRes, tRes, dRes] = await Promise.all([
            operatorApi.getPersonas(),
            operatorApi.getTraits(),
            operatorApi.getDifficulties()
        ]);

        if (pRes.success) setPersonas(pRes.data.personas);
        if (tRes.success) setTraits(tRes.data.traits);
        if (dRes.success) setDifficulties(dRes.data.levels);
        setLoading(false);
    };

    const renderPersonas = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search personas..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">
                    <Plus size={18} /> New Persona
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {personas.map(p => (
                    <article key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                                ${p.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}
                            `}>
                                {p.gender === 'male' ? 'M' : 'F'}
                            </div>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                        </div>
                        <h3 className="font-bold text-slate-900">{p.name}</h3>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.shortDescription}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {p.mainTraits.map(t => (
                                <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                                    {t.replace('_', ' ')}
                                </span>
                            ))}
                            {p.hiddenTrait && (
                                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded flex items-center gap-1">
                                    <Lock size={8} /> {p.hiddenTrait}
                                </span>
                            )}
                        </div>
                        <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                            <span>{p.ageGroup}</span>
                            <span>{p.regions?.join(', ')}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );

    const renderTraits = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Trait ID</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Difficulty Range</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {traits.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                            <td className="p-4 font-mono text-xs font-bold text-blue-600">{t.id}</td>
                            <td className="p-4 text-sm font-medium text-slate-700 capitalize">{t.category}</td>
                            <td className="p-4 text-sm text-slate-500">{t.description}</td>
                            <td className="p-4 text-right">
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600">
                                    {t.difficultyRange?.min} - {t.difficultyRange?.max}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderDifficulty = () => (
        <div className="space-y-4">
            {difficulties.map(d => (
                <div key={d.level} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">Level {d.level}</span>
                            <h3 className="text-lg font-bold text-slate-900">{d.label}</h3>
                            <p className="text-sm text-slate-500">{d.description}</p>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Edit</button>
                    </div>
                    {/* Visualizing Behavior Modifiers as Sliders (Read Only) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl">
                        {Object.entries(d.parameters || {}).slice(0, 4).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500 capitalize">{key}</span>
                                    <span className="font-mono font-bold">{val}</span>
                                </div>
                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${val * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Customer Engine</h1>
                <p className="text-sm text-slate-500">Manage personas, traits, and difficulty logic.</p>
            </header>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-4">
                {[
                    { id: 'personas', label: 'Personas', icon: Users },
                    { id: 'traits', label: 'Traits', icon: Activity },
                    { id: 'difficulty', label: 'Difficulty', icon: Signal },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-2 px-2 py-3 border-b-2 font-medium text-sm transition-colors",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            )}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <main>
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading Engine Data...</div>
                ) : (
                    <>
                        {activeTab === 'personas' && renderPersonas()}
                        {activeTab === 'traits' && renderTraits()}
                        {activeTab === 'difficulty' && renderDifficulty()}
                    </>
                )}
            </main>
        </div>
    );
}
