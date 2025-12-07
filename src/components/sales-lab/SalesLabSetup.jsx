import React, { useState, useMemo, useEffect } from 'react';
import { Play, User, Monitor, Shuffle, History, Info, List, X, Star, ArrowLeft, Settings, Check, Sparkles, Target, Database, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { operatorApi } from '../../services/operatorApi';
import { recommendationEngine } from '../../lib/recommendationEngine';
import { AGES, GENDERS } from '../../constants/salesLabData';
import { MotionCard } from '../ui/modern/MotionCard';
import { PulseButton } from '../ui/modern/PulseButton';

export default function SalesLabSetup({ onStart, onViewHistory }) {
    const { language, isDemoMode, toggleDemoMode } = useAppStore();
    const t = translations[language] || translations['en'];

    // --- Loading State ---
    const [isLoading, setIsLoading] = useState(true);
    const [catalog, setCatalog] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [traits, setTraits] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [upsellRules, setUpsellRules] = useState([]);

    // --- Selection State ---
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedSize, setSelectedSize] = useState(0);

    const [selectedTraits, setSelectedTraits] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const [age, setAge] = useState('30s');
    const [gender, setGender] = useState('Male');

    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [hasSavedSession, setHasSavedSession] = useState(false);

    // --- Data Fetching ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [catRes, perRes, traitRes, diffRes, ruleRes] = await Promise.all([
                    operatorApi.getProductCatalog(),
                    operatorApi.getPersonas(),
                    operatorApi.getTraits(),
                    operatorApi.getDifficulties(),
                    operatorApi.getUpsellRules()
                ]);

                if (catRes.success) setCatalog(catRes.data.catalog);
                if (perRes.success) setPersonas(perRes.data.personas);
                if (traitRes.success) setTraits(traitRes.data.traits);
                if (diffRes.success) setDifficulties(diffRes.data.levels);
                if (ruleRes.success) setUpsellRules(ruleRes.data.rules);

                // Initialize defaults
                if (catRes.success && catRes.data.catalog) {
                    const c = catRes.data.catalog;
                    const type = c.types[0];
                    const cat = c.categories[type]?.[0];
                    const model = c.models[cat]?.[0];
                    if (model) {
                        setSelectedType(type);
                        setSelectedCategory(cat);
                        setSelectedModel(model);
                        setSelectedSize(model.sizes[0]);
                    }
                }

                if (diffRes.success && diffRes.data.levels.length > 0) {
                    setDifficulty(diffRes.data.levels[1] || diffRes.data.levels[0]);
                }

                if (traitRes.success && traitRes.data.traits.length >= 2) {
                    setSelectedTraits([traitRes.data.traits[0].id, traitRes.data.traits[1].id]);
                }

            } catch (e) {
                console.error("Failed to load Operator Data", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('salesLab_savedSession');
        if (saved) {
            setHasSavedSession(true);
        }
    }, []);

    // --- Derived Lookup & Scoring ---
    const traitDefinitions = useMemo(() => {
        return traits.reduce((acc, t) => ({ ...acc, [t.id]: t }), {});
    }, [traits]);

    const matchedPersona = useMemo(() => {
        return personas.find(p => {
            return p.mainTraits.every(tId => selectedTraits.includes(tId));
        }) || null;
    }, [personas, selectedTraits]);

    const upsellInfo = useMemo(() => {
        if (!matchedPersona) return null;
        const rule = upsellRules.find(r =>
            r.customer?.includeTraits?.some(t => matchedPersona.mainTraits.includes(t))
        );
        if (rule && rule.messages.length > 0) {
            return {
                text: rule.messages[0].template.replace('{recommendedSize}', 'larger size'),
                recommendedSizes: [75, 77, 83, 86, 97]
            };
        }
        return null;
    }, [matchedPersona, upsellRules]);

    const mappedTraits = useMemo(() => {
        return selectedTraits.map(id => traitDefinitions[id] || { id });
    }, [selectedTraits, traitDefinitions]);

    const productScores = useMemo(() => {
        if (!matchedPersona || !difficulty) return null;
        try {
            return recommendationEngine.calculateProductScores(mappedTraits, matchedPersona, difficulty);
        } catch (error) {
            return null;
        }
    }, [mappedTraits, matchedPersona, difficulty]);

    const upsellScore = useMemo(() => {
        if (!matchedPersona) return null;
        try {
            return recommendationEngine.calculateUpsellScore(mappedTraits, matchedPersona, age);
        } catch (error) {
            return null;
        }
    }, [mappedTraits, matchedPersona, age]);

    // --- Handlers ---
    const toggleTrait = (traitId) => {
        if (selectedTraits.includes(traitId)) {
            setSelectedTraits(prev => prev.filter(t => t !== traitId));
        } else {
            if (selectedTraits.length >= 2) return;
            setSelectedTraits(prev => [...prev, traitId]);
        }
    };

    const handlePresetSelect = (persona) => {
        setSelectedTraits(persona.mainTraits);
        setAge(persona.ageGroup);
        setGender(persona.gender);
        setIsPresetModalOpen(false);
    };

    const randomizeProduct = () => {
        if (!catalog) return;
        const types = catalog.types;
        const randomType = types[Math.floor(Math.random() * types.length)];
        setSelectedType(randomType);

        const cats = catalog.categories[randomType] || [];
        if (cats.length > 0) {
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            setSelectedCategory(randomCat);

            const models = catalog.models[randomCat] || [];
            if (models.length > 0) {
                const randomModel = models[Math.floor(Math.random() * models.length)];
                setSelectedModel(randomModel);
                const sizes = randomModel.sizes;
                setSelectedSize(sizes[Math.floor(Math.random() * sizes.length)]);
            }
        }
    };

    const randomizeConfig = () => {
        if (!catalog || personas.length === 0) return;
        const randomPersona = personas[Math.floor(Math.random() * personas.length)];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        setSelectedTraits(randomPersona.mainTraits);
        setDifficulty(randomDifficulty);
        setAge(randomPersona.ageGroup);
        setGender(randomPersona.gender);
        randomizeProduct();
    };

    const handleStart = () => {
        onStart({
            customer: {
                name: matchedPersona ? matchedPersona.name : "Custom Customer",
                personaId: matchedPersona?.id,
                persona: matchedPersona,
                traits: mappedTraits,
                age,
                gender,
                difficulty
            },
            product: { ...selectedModel, size: selectedSize },
            difficulty
        });
    };

    // --- Renderers ---
    const renderProductContent = () => {
        if (!catalog || !selectedModel) return <div className="text-slate-500">Loading Catalog...</div>;
        return (
            <div className="space-y-6">
                <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                    {catalog.types.map(type => (
                        <button key={type} onClick={() => setSelectedType(type)} className={clsx("flex-1 py-2 text-xs font-bold rounded-md transition-all", selectedType === type ? "bg-white text-primary shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900")}>{type}</button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {catalog.categories[selectedType]?.map(cat => {
                        const isBest = productScores?.bestMatch === cat;
                        const isAlt = productScores?.alternative === cat;
                        return (
                            <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedModel(catalog.models[cat][0]); }} className={clsx("px-4 py-2 rounded-full text-xs font-bold border transition-all relative", selectedCategory === cat ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900", (isBest || isAlt) && "pr-3")}>
                                {cat}
                                {isBest && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white" />}
                                {isAlt && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-400 rounded-full border border-white" />}
                            </button>
                        );
                    })}
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {catalog.models[selectedCategory]?.map(model => (
                        <button key={model.id} onClick={() => { setSelectedModel(model); setSelectedSize(model.sizes[0]); }} className={clsx("w-full p-4 rounded-xl border text-left transition-all", selectedModel.id === model.id ? "bg-indigo-50 border-primary/50 text-indigo-900" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700")}>
                            <div className="font-bold text-sm flex justify-between">{model.name} {selectedModel.id === model.id && <Check size={16} className="text-primary" />}</div>
                            <div className="text-xs opacity-70 flex justify-between mt-1"><span>{model.line || model.type}</span><span>${model.basePrice}</span></div>
                        </button>
                    ))}
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="text-xs font-bold text-slate-400 mb-3 flex justify-between uppercase tracking-wider"><span>Select Size</span><span className="text-primary">{selectedSize}"</span></div>
                    <div className="flex flex-wrap gap-2">
                        {selectedModel.sizes.map(size => {
                            const isRecommended = upsellInfo?.recommendedSizes?.includes(size) || (upsellScore?.recommendation === 'Strong' && size >= 75);
                            return <button key={size} onClick={() => setSelectedSize(size)} className={clsx("px-4 py-2 rounded-lg border text-xs font-bold transition-all relative", selectedSize === size ? "border-primary bg-indigo-50 text-primary" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300", isRecommended && "ring-1 ring-yellow-500/50 border-yellow-500/50")}>{size}" {isRecommended && <Star size={10} className="absolute -top-1.5 -right-1.5 fill-yellow-400 text-yellow-400" />}</button>
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderCustomerContent = () => {
        if (!difficulty) return <div className="text-slate-500">Loading Customer Data...</div>;
        return (
            <div className="space-y-6">
                <MotionCard className="!bg-indigo-50 !border-indigo-100 flex items-center justify-between !p-4 group" glass={false}>
                    <div>
                        <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">Target Profile</div>
                        <div className="text-xl font-black text-slate-900 flex items-center gap-3">{matchedPersona ? matchedPersona.name : "Custom Target"} {matchedPersona && <Check className="text-white bg-indigo-500 rounded-full p-0.5" size={20} />}</div>
                    </div>
                    <button onClick={() => setIsPresetModalOpen(true)} className="btn-secondary text-xs font-bold flex items-center gap-2"><List size={14} /> LOADER</button>
                </MotionCard>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simulation Level</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {difficulties.map((diff) => (
                            <button key={diff.level} onClick={() => setDifficulty(diff)} className={clsx("flex-shrink-0 px-4 py-2 rounded-xl border transition-all whitespace-nowrap text-xs font-bold", difficulty.level === diff.level ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 hover:border-slate-300 text-slate-500 bg-white")}>Lv.{diff.level}</button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200">{difficulty.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Age Group</label>
                        <div className="flex flex-wrap gap-2">
                            {AGES.map((a) => <button key={a} onClick={() => setAge(a)} className={clsx("px-3 py-1.5 rounded-lg border text-xs transition-all", age === a ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold" : "border-slate-200 hover:border-slate-300 text-slate-500 bg-white")}>{a}</button>)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gender</label>
                        <div className="flex gap-2">
                            {GENDERS.map((g) => <button key={g} onClick={() => setGender(g)} className={clsx("flex-1 px-3 py-1.5 rounded-lg border text-xs transition-all", gender === g ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold" : "border-slate-200 hover:border-slate-300 text-slate-500 bg-white")}>{g}</button>)}
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Psychographics (Select 2)</label><span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{selectedTraits.length}/2 Active</span></div>
                    <div className="flex gap-3 mb-4">
                        {[0, 1].map(index => (
                            <div key={index} className={clsx("flex-1 p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all h-20 text-center relative overflow-hidden", selectedTraits[index] ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-400 border-dashed")}>
                                {selectedTraits[index] ? <><CheckCircle2 size={14} className="mb-1 opacity-50" /><span className="text-xs leading-tight">{traitDefinitions[selectedTraits[index]]?.label}</span></> : <span className="text-xs">Empty Slot</span>}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {traits.map((trait) => (
                            <button key={trait.id} onClick={() => toggleTrait(trait.id)} className={clsx("px-3 py-1.5 rounded-full border text-xs transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95", selectedTraits.includes(trait.id) ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/30" : "border-slate-200 hover:border-slate-300 text-slate-500 bg-white")}>{trait.label}</button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="h-full flex flex-col items-center justify-center text-slate-900 gap-4"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /><div className="text-sm font-bold uppercase tracking-widest text-slate-500 animate-pulse">Initializing Arena...</div></div>;

    return (
        <div className="h-full flex flex-col text-slate-900 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto w-full p-3 md:p-6 lg:p-8 h-full flex flex-col relative z-10">
                <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-slate-200 pb-4 md:pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Mission Setup
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {t.salesLab.title}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 mt-1">Configure your roleplay scenario.</p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={toggleDemoMode}
                            className={clsx(
                                "flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all border",
                                isDemoMode
                                    ? "bg-amber-50 border-amber-200 text-amber-600"
                                    : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                            )}
                        >
                            <div className={clsx(
                                "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full",
                                isDemoMode ? "bg-amber-500 animate-pulse" : "bg-slate-300"
                            )} />
                            <span className="text-[10px] md:text-xs font-bold">
                                {isDemoMode ? "DEMO" : "API"}
                            </span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <button onClick={randomizeConfig} className="btn-secondary text-xs px-2 md:px-3"><Shuffle size={14} /> <span className="hidden sm:inline">Randomize</span></button>
                        <button onClick={onViewHistory} className="btn-secondary text-xs px-2 md:px-3"><History size={14} /> <span className="hidden sm:inline">Records</span></button>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 flex-1 overflow-visible lg:overflow-hidden pb-24 md:pb-0">
                    <div className="lg:col-span-4 h-auto lg:h-full flex flex-col">
                        <Section title="Product" icon={Monitor} headerAction={<button onClick={(e) => { e.stopPropagation(); randomizeProduct(); }} className="text-[10px] uppercase font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md flex items-center gap-1 text-slate-500 transition-colors"><Shuffle size={10} /> Auto</button>}>
                            {renderProductContent()}
                        </Section>
                    </div>
                    <div className="lg:col-span-8 h-auto lg:h-full flex flex-col">
                        <Section title="Target Profile" icon={Target}>
                            {renderCustomerContent()}
                        </Section>
                    </div>
                </div>

                <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 lg:static pt-4 lg:pt-6 z-20 flex gap-4 bg-white/80 backdrop-blur-md lg:bg-transparent p-4 lg:p-0 border-t border-slate-200 lg:border-none rounded-t-2xl lg:rounded-none shadow-[0_-5px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
                    {hasSavedSession && (
                        <button onClick={() => { const saved = JSON.parse(localStorage.getItem('salesLab_savedSession')); if (saved) onStart(saved.config, saved); }} className="flex-1 py-4 text-sm md:text-lg font-bold flex items-center justify-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-primary/30 bg-indigo-50 text-primary hover:bg-indigo-100 hover:scale-[1.01] transition-all"><History size={20} /> <span className="hidden sm:inline">Resume</span></button>
                    )}
                    <PulseButton onClick={handleStart} className="flex-[2] py-4 md:py-5 text-base md:text-xl font-bold tracking-wide flex items-center justify-center gap-3 !rounded-xl md:!rounded-2xl !bg-primary shadow-lg shadow-primary/30">
                        <Play size={20} fill="currentColor" /> START SIMULATION
                    </PulseButton>
                </div>

                {isPresetModalOpen && <PresetModal onClose={() => setIsPresetModalOpen(false)} onSelect={handlePresetSelect} personas={personas} />}
            </div>
        </div>
    );
}

const Section = ({ title, icon: Icon, children, headerAction }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-full p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 font-bold text-slate-800 text-sm md:text-base">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary border border-slate-200 shadow-sm"><Icon size={16} /></div>
                {title}
            </div>
            <div className="flex items-center gap-2">{headerAction}</div>
        </div>
        <div className="flex-1 overflow-hidden relative"><div className="p-4 h-full overflow-y-auto custom-scrollbar">{children}</div></div>
    </div>
);

const PresetModal = ({ onClose, onSelect, personas }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3"><Database className="text-primary" /> Load Target Preset</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar">
                {personas.map((persona) => (
                    <button key={persona.id} onClick={() => onSelect(persona)} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/50 hover:shadow-md transition-all text-left group">
                        <div className="flex justify-between items-start mb-1"><div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{persona.name}</div><div className="text-[10px] font-bold text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">{persona.ageGroup}</div></div>
                        <div className="text-xs text-slate-500 mb-3 leading-relaxed">{persona.shortDescription}</div>
                        <div className="flex flex-wrap gap-1">{persona.mainTraits.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">{t}</span>)}</div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);
