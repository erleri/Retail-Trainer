import React, { useState, useMemo, useEffect } from 'react';
import { Play, User, Monitor, Shuffle, History, Info, BarChart, Check, ChevronDown, ChevronUp, Lock, List, X, Star, ArrowLeft, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { PERSONAS, DIFFICULTY_LEVELS, ALL_TRAITS, TRAIT_DEFINITIONS, PRODUCT_CATALOG, UPSELL_TRIGGERS, AGES, GENDERS } from '../../constants/salesLabData';
import { recommendationEngine } from '../../lib/recommendationEngine';

export default function SalesLabSetup({ onStart, onViewHistory }) {
    const { language } = useAppStore();
    const t = translations[language] || translations['en'];

    // State
    const [selectedType, setSelectedType] = useState(PRODUCT_CATALOG.types[0]);
    const [selectedCategory, setSelectedCategory] = useState(PRODUCT_CATALOG.categories['TV'][0]);
    const [selectedModel, setSelectedModel] = useState(PRODUCT_CATALOG.models['OLED'][0]);
    const [selectedSize, setSelectedSize] = useState(55);
    const [selectedTraits, setSelectedTraits] = useState([ALL_TRAITS[0], ALL_TRAITS[2]]);
    const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[1]);
    const [age, setAge] = useState('30s');
    const [gender, setGender] = useState('Male');
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [activeMobileSection, setActiveMobileSection] = useState(null);
    const [hasSavedSession, setHasSavedSession] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('salesLab_savedSession');
        if (saved) {
            setHasSavedSession(true);
        }
    }, []);

    // Derived State
    const matchedPersona = PERSONAS.find(p =>
        p.surface_traits.every(t => selectedTraits.includes(t))
    ) || null;

    const upsellInfo = matchedPersona ? UPSELL_TRIGGERS[matchedPersona.id] : null;

    const mappedTraits = useMemo(() => {
        return selectedTraits.map(t => {
            const key = Object.keys(TRAIT_DEFINITIONS).find(k => k === t);
            if (!key) {
                console.warn(`Trait not found in definitions: ${t}`);
                return { id: t.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') };
            }
            return { id: key.toLowerCase().replace(/-/g, '_') };
        });
    }, [selectedTraits]);

    const productScores = useMemo(() => {
        if (!matchedPersona || !difficulty) return null;
        try {
            return recommendationEngine.calculateProductScores(mappedTraits, matchedPersona, difficulty);
        } catch (error) {
            console.error("Error calculating recommendations:", error);
            return null;
        }
    }, [mappedTraits, matchedPersona, difficulty]);

    const upsellScore = useMemo(() => {
        if (!matchedPersona) return null;
        try {
            return recommendationEngine.calculateUpsellScore(mappedTraits, matchedPersona, age);
        } catch (error) {
            console.error("Error calculating recommendations:", error);
            return null;
        }
    }, [mappedTraits, matchedPersona, age]);

    // Handlers
    const toggleTrait = (trait) => {
        if (selectedTraits.includes(trait)) {
            setSelectedTraits(prev => prev.filter(t => t !== trait));
        } else {
            if (selectedTraits.length >= 2) return;
            setSelectedTraits(prev => [...prev, trait]);
        }
    };

    const handlePresetSelect = (persona) => {
        setSelectedTraits(persona.surface_traits);
        setAge(persona.base_profile.age_group);
        setGender(persona.base_profile.gender);
        setIsPresetModalOpen(false);
    };

    const randomizeProduct = () => {
        const types = PRODUCT_CATALOG.types;
        const randomType = types[Math.floor(Math.random() * types.length)];
        setSelectedType(randomType);

        const cats = PRODUCT_CATALOG.categories[randomType] || [];
        if (cats.length > 0) {
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            setSelectedCategory(randomCat);

            const models = PRODUCT_CATALOG.models[randomCat] || [];
            if (models.length > 0) {
                const randomModel = models[Math.floor(Math.random() * models.length)];
                setSelectedModel(randomModel);

                const sizes = randomModel.sizes;
                const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                setSelectedSize(randomSize);
            }
        }
    };

    const randomizeConfig = () => {
        // Randomize Configuration
        const randomPersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
        const randomDifficulty = DIFFICULTY_LEVELS[Math.floor(Math.random() * DIFFICULTY_LEVELS.length)];

        // Set state
        setSelectedTraits(randomPersona.surface_traits);
        setDifficulty(randomDifficulty);
        setAge(randomPersona.base_profile.age_group);
        setGender(randomPersona.base_profile.gender);

        // Randomize Product
        const types = PRODUCT_CATALOG.types;
        const randomType = types[Math.floor(Math.random() * types.length)];
        setSelectedType(randomType);

        const categories = PRODUCT_CATALOG.categories[randomType] || [];
        if (categories.length > 0) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            setSelectedCategory(randomCategory);

            const models = PRODUCT_CATALOG.models[randomCategory] || [];
            if (models.length > 0) {
                const randomModel = models[Math.floor(Math.random() * models.length)];
                setSelectedModel(randomModel);
                setSelectedSize(randomModel.sizes[Math.floor(Math.random() * randomModel.sizes.length)]);
            }
        }
    };

    // Auto-randomize on mount
    useEffect(() => {
        randomizeConfig();
    }, []);

    const handleStart = () => {
        // Map traits to objects with ID and details
        const mappedTraits = selectedTraits.map(t => {
            const snakeCaseId = t.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
            return {
                id: snakeCaseId,
                ...TRAIT_DEFINITIONS[t]
            };
        });

        onStart({
            customer: {
                name: matchedPersona ? matchedPersona.name : "Custom Customer",
                persona: matchedPersona,
                traits: mappedTraits,
                age,
                gender
            },
            product: {
                ...selectedModel,
                size: selectedSize
            },
            difficulty
        });
    };

    const renderProductContent = () => (
        <div className="space-y-6">
            {/* Step 1: Type */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
                {PRODUCT_CATALOG.types.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={clsx(
                            "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                            selectedType === type ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Step 2: Category (with Badges) */}
            <div className="flex flex-wrap gap-2">
                {PRODUCT_CATALOG.categories[selectedType]?.map(cat => {
                    const isBest = productScores?.bestMatch === cat;
                    const isAlt = productScores?.alternative === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setSelectedModel(PRODUCT_CATALOG.models[cat][0]); }}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-bold border transition-all relative",
                                selectedCategory === cat
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-text-secondary border-gray-200 hover:border-gray-300",
                                (isBest || isAlt) && "pr-2"
                            )}
                        >
                            {cat}
                            {isBest && <span className="ml-1 text-[10px] bg-yellow-400 text-black px-1 rounded-full">BEST</span>}
                            {isAlt && <span className="ml-1 text-[10px] bg-gray-200 text-gray-600 px-1 rounded-full">ALT</span>}
                        </button>
                    );
                })}
            </div>

            {/* Step 3: Model List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {PRODUCT_CATALOG.models[selectedCategory]?.map(model => (
                    <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model); setSelectedSize(model.sizes[0]); }}
                        className={clsx(
                            "w-full p-3 rounded-xl border text-left transition-all",
                            selectedModel.id === model.id
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-gray-100 hover:border-gray-300 bg-white"
                        )}
                    >
                        <div className="font-bold text-text-primary text-sm">{model.name}</div>
                        <div className="text-xs text-text-secondary flex justify-between mt-1">
                            <span>{model.type}</span>
                            <span>${model.basePrice}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Upselling & Details Area */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
                {/* Upsell Recommendation Banner */}
                {upsellScore?.recommendation === 'Strong' && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
                        <span>🔥</span> Large Screen Highly Recommended (75"+)
                    </div>
                )}

                {/* Size Selection */}
                <div>
                    <div className="text-xs font-bold text-text-secondary mb-2 flex justify-between">
                        <span>Select Size</span>
                        <span className="text-primary">{selectedSize}"</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedModel.sizes.map(size => {
                            // Highlight large sizes if Strong recommendation
                            const isUpsellTarget = upsellScore?.recommendation === 'Strong' && size >= 75;
                            const isRecommended = upsellInfo?.recommendedSizes.includes(size) || isUpsellTarget;

                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all relative",
                                        selectedSize === size
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-gray-200 text-text-secondary hover:border-gray-300",
                                        isRecommended && "ring-1 ring-yellow-400 border-yellow-400",
                                        isUpsellTarget && "bg-orange-50 border-orange-400 text-orange-600"
                                    )}
                                >
                                    {size}"
                                    {isRecommended && <Star size={8} className="absolute -top-1 -right-1 fill-yellow-400 text-yellow-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Upsell Trigger Card (Existing Logic + New Score Context) */}
                {upsellInfo && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100">
                        <div className="flex items-start gap-2">
                            <Info size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-xs font-bold text-indigo-700 mb-1">
                                    {matchedPersona ? `For ${matchedPersona.name}` : "Recommendation"}
                                </div>
                                <p className="text-[11px] text-indigo-600 leading-relaxed">
                                    {upsellInfo.text}
                                    {upsellScore?.recommendation === 'Strong' && " (Customer is likely open to 75\"+)"}
                                </p>
                            </div>
                        </div>

                        {/* Cost per Inch & Scaled View */}
                        <div className="mt-3 flex items-end justify-between">
                            <div className="text-[10px] text-text-secondary">
                                Cost Efficiency: <span className="font-bold text-text-primary">${(selectedModel.basePrice / selectedSize).toFixed(1)}/inch</span>
                            </div>

                            {/* Mini Scaled View */}
                            <div className="flex items-end gap-1 h-8">
                                <div className="w-4 bg-gray-300 rounded-t-sm h-3" title="Sofa"></div>
                                <div
                                    className="bg-primary rounded-sm transition-all duration-300"
                                    style={{
                                        width: `${selectedSize * 0.4}px`,
                                        height: `${selectedSize * 0.25}px`
                                    }}
                                    title={`${selectedSize}" TV`}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomerContent = () => (
        <div className="space-y-6">
            {/* Persona Match Indicator with Preset Button */}
            <div className="mb-6 p-4 bg-secondary/5 rounded-xl border border-secondary/20 flex items-center justify-between">
                <div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Matched Persona</div>
                    <div className="text-xl font-bold text-text-primary flex items-center gap-2">
                        {matchedPersona ? matchedPersona.name : "Custom Customer"}
                        {matchedPersona && <Check className="text-secondary" size={20} />}
                    </div>
                </div>
                <button
                    onClick={() => setIsPresetModalOpen(true)}
                    className="px-4 py-2 bg-white border border-secondary/30 text-secondary rounded-lg text-sm font-bold hover:bg-secondary hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                    <List size={16} /> Presets
                </button>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Difficulty Level</label>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {DIFFICULTY_LEVELS.map((diff) => (
                        <button
                            key={diff.level}
                            onClick={() => setDifficulty(diff)}
                            className={clsx(
                                "flex-shrink-0 px-4 py-2 rounded-lg border transition-all whitespace-nowrap",
                                difficulty.level === diff.level
                                    ? "border-red-500 bg-red-50 text-red-700 font-bold"
                                    : "border-gray-200 hover:border-gray-300 text-text-secondary"
                            )}
                        >
                            Lv.{diff.level}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-text-light">{difficulty.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Age</label>
                    <div className="flex flex-wrap gap-2">
                        {AGES.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAge(a)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg border text-sm transition-all",
                                    age === a
                                        ? "border-secondary bg-secondary/10 text-secondary font-bold"
                                        : "border-gray-200 hover:border-gray-300 text-text-secondary"
                                )}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Gender</label>
                    <div className="flex gap-2">
                        {GENDERS.map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className={clsx(
                                    "flex-1 px-3 py-1.5 rounded-lg border text-sm transition-all",
                                    gender === g
                                        ? "border-secondary bg-secondary/10 text-secondary font-bold"
                                        : "border-gray-200 hover:border-gray-300 text-text-secondary"
                                )}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Traits */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-text-secondary">Traits (Select 2 + 1 Hidden)</label>
                    <span className="text-xs text-text-light">{selectedTraits.length}/2 Selected</span>
                </div>

                {/* Selected Traits Display (Integrated Hidden Trait) */}
                <div className="flex gap-2 mb-3">
                    {/* Slot 1 */}
                    <div className={clsx("flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all", selectedTraits[0] ? "bg-secondary/10 border-secondary text-secondary font-bold" : "bg-gray-50 border-gray-100 text-gray-400 border-dashed")}>
                        {selectedTraits[0] ? <>{TRAIT_DEFINITIONS[selectedTraits[0]]?.icon} {selectedTraits[0]}</> : "Select Trait 1"}
                    </div>
                    {/* Slot 2 */}
                    <div className={clsx("flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all", selectedTraits[1] ? "bg-secondary/10 border-secondary text-secondary font-bold" : "bg-gray-50 border-gray-100 text-gray-400 border-dashed")}>
                        {selectedTraits[1] ? <>{TRAIT_DEFINITIONS[selectedTraits[1]]?.icon} {selectedTraits[1]}</> : "Select Trait 2"}
                    </div>
                    {/* Slot 3 (Hidden) */}
                    <div className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 font-bold flex items-center justify-center gap-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-200/50" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        <span className="relative z-10 flex items-center gap-2">🔒 ???</span>
                    </div>
                </div>

                {/* Trait Selector */}
                <div className="flex flex-wrap gap-2">
                    {ALL_TRAITS.map((trait) => (
                        <button
                            key={trait}
                            onClick={() => toggleTrait(trait)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full border text-sm transition-all flex items-center gap-1.5",
                                selectedTraits.includes(trait)
                                    ? "border-secondary bg-secondary text-white shadow-md"
                                    : "border-gray-200 hover:border-gray-300 text-text-secondary bg-white"
                            )}
                        >
                            <span>{TRAIT_DEFINITIONS[trait]?.icon}</span>
                            {trait}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    // --- Mobile Components ---




    // --- Desktop Section Component ---


    // Preset Modal


    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">{t.salesLab.title} 🧪</h1>
                    <p className="text-text-secondary hidden lg:block">{t.salesLab.subtitle}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={randomizeConfig}
                        className="btn-secondary flex items-center gap-2 px-4 py-2"
                    >
                        <Shuffle size={18} /> <span className="hidden sm:inline">Randomize Customer</span>
                    </button>
                    <button
                        onClick={onViewHistory}
                        className="btn-secondary flex items-center gap-2 px-4 py-2"
                    >
                        <History size={18} /> <span className="hidden sm:inline">History</span>
                    </button>
                </div>
            </div>

            {/* Mobile Dashboard View (< lg) */}
            <div className="lg:hidden flex-1 flex flex-col gap-4">
                <MobileSummaryCard
                    title="Product"
                    subtitle={`${selectedModel.name} (${selectedSize}")`}
                    icon={Monitor}
                    colorClass="bg-blue-500"
                    onClick={() => setActiveMobileSection('product')}
                />
                <MobileSummaryCard
                    title="Customer"
                    subtitle={matchedPersona ? matchedPersona.name : "Custom Customer"}
                    icon={User}
                    colorClass="bg-purple-500"
                    onClick={() => setActiveMobileSection('customer')}
                />
            </div>

            {/* Desktop Grid View (>= lg) */}
            <div className="hidden lg:grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Left Column: Product Setup */}
                <div className="col-span-4 h-full">
                    <Section
                        title="Product Setup"
                        icon={Monitor}
                        headerAction={
                            <button onClick={(e) => { e.stopPropagation(); randomizeProduct(); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1 text-text-secondary transition-colors">
                                <Shuffle size={12} /> Random
                            </button>
                        }
                    >
                        {renderProductContent()}
                    </Section>
                </div>

                {/* Right Column: Customer Profile */}
                <div className="col-span-8 h-full">
                    <Section title="Customer Profile" icon={User}>
                        {renderCustomerContent()}
                    </Section>
                </div>
            </div>

            {/* Mobile Config Modals */}
            <ConfigModal
                isOpen={activeMobileSection === 'product'}
                onClose={() => setActiveMobileSection(null)}
                title="Configure Product"
            >
                {renderProductContent()}
            </ConfigModal>

            <ConfigModal
                isOpen={activeMobileSection === 'customer'}
                onClose={() => setActiveMobileSection(null)}
                title="Configure Customer"
            >
                {renderCustomerContent()}
            </ConfigModal>

            {/* Floating Start Button (Always Visible) */}
            <div className="mt-auto pt-4 lg:pt-6 border-t border-gray-100 bg-white lg:bg-transparent lg:static z-10 flex gap-3">
                {hasSavedSession && (
                    <button
                        onClick={() => {
                            const saved = JSON.parse(localStorage.getItem('salesLab_savedSession'));
                            if (saved) {
                                onStart(saved.config, saved); // Pass config as first arg, full saved state as second
                            }
                        }}
                        className="flex-1 btn-secondary py-4 text-xl shadow-sm flex items-center justify-center gap-3 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5"
                    >
                        <History size={28} /> Resume Last Session
                    </button>
                )}
                <button
                    onClick={handleStart}
                    className="flex-[2] btn-primary py-4 text-xl shadow-glow flex items-center justify-center gap-3 rounded-2xl"
                >
                    <Play size={28} fill="currentColor" /> Start Simulation
                </button>
            </div>

            {isPresetModalOpen && (
                <PresetModal
                    onClose={() => setIsPresetModalOpen(false)}
                    onSelect={handlePresetSelect}
                />
            )}
        </div>
    );
}

const MobileSummaryCard = ({ title, subtitle, icon: Icon, onClick, colorClass }) => ( // eslint-disable-line no-unused-vars
    <button
        onClick={onClick}
        className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all active:scale-[0.98]"
    >
        <div className="flex items-center gap-4">
            <div className={clsx("p-3 rounded-xl", colorClass)}>
                <Icon size={24} className="text-white" />
            </div>
            <div className="text-left">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</div>
                <div className="text-lg font-bold text-text-primary">{subtitle}</div>
            </div>
        </div>
        <Settings size={20} className="text-gray-300" />
    </button>
);

const ConfigModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-text-primary" />
                </button>
                <h2 className="text-lg font-bold text-text-primary">{title}</h2>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                {children}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white">
                <button onClick={onClose} className="w-full btn-primary py-3 rounded-xl">
                    Done
                </button>
            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, children, headerAction }) => ( // eslint-disable-line no-unused-vars
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
        <div className="w-full p-4 flex items-center justify-between bg-white border-b border-gray-50">
            <div className="flex items-center gap-2 font-bold text-text-primary">
                <Icon className="text-primary" size={20} /> {title}
            </div>
            <div className="flex items-center gap-2">
                {headerAction}
            </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    </div>
);

const PresetModal = ({ onClose, onSelect }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <User className="text-primary" /> Select Persona Preset
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-secondary"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONAS.map((persona) => (
                    <button
                        key={persona.id}
                        onClick={() => onSelect(persona)}
                        className="p-3 rounded-xl border border-gray-200 bg-white hover:border-primary hover:shadow-md transition-all text-left"
                    >
                        <div className="font-bold text-text-primary">{persona.name}</div>
                        <div className="text-xs text-text-secondary mb-2">{persona.description}</div>
                        <div className="flex flex-wrap gap-1">
                            {persona.surface_traits.map(t => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-text-secondary">
                                    {TRAIT_DEFINITIONS[t]?.icon} {t}
                                </span>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);
