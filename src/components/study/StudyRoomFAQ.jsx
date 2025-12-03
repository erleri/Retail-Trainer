import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, ChevronDown, BookOpen, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useAppStore } from '../../store/appStore';
import { translations } from '../../constants/translations';
import { staticFaqs } from '../../data/staticFaqs';
import { localDB } from '../../lib/storage';

const StudyRoomFAQ = () => {
    const { language } = useAppStore();
    console.log("Current language:", language);

    const t = translations[language]?.study?.faq || translations['en']?.study?.faq;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [dynamicFaqs, setDynamicFaqs] = useState([]);

    useEffect(() => {
        const loadDynamicFaqs = async () => {
            try {
                let savedFaqs = await localDB.getFAQs();
                console.log("Loaded FAQs:", savedFaqs);
                if (!Array.isArray(savedFaqs)) {
                    console.warn("savedFaqs is not an array, defaulting to empty array");
                    savedFaqs = [];
                }
                setDynamicFaqs(savedFaqs);
            } catch (e) {
                console.error("Failed to load FAQs", e);
                setDynamicFaqs([]);
            }
        };
        loadDynamicFaqs();
    }, []);



    const categories = ['all', 'Product', 'Usage', 'Technology', 'Basic'];

    const filteredFaqs = useMemo(() => {
        const allFaqs = [...staticFaqs, ...dynamicFaqs];
        return allFaqs.filter(faq => {
            if (!faq || !faq.question || !faq.answer) return false;

            const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
            const qText = faq.question[language] || faq.question['en'] || "";
            const aText = faq.answer[language] || faq.answer['en'] || "";

            const question = qText.toLowerCase();
            const answer = aText.toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = question.includes(query) || answer.includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory, language, dynamicFaqs]);

    if (!t) {
        return <div className="p-4 text-red-500">Error loading translations.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {t.categories[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                    <motion.div
                        key={faq.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                            className="w-full px-6 py-4 flex items-start justify-between text-left"
                        >
                            <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
                                        {faq.category}
                                    </span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {faq.views} {t.views}
                                    </span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {faq.question[language]}
                                </h3>
                            </div>
                            <div className={`mt-1 transition-transform duration-200 ${expandedId === faq.id ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedId === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer[language]}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No FAQs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

import ErrorBoundary from '../common/ErrorBoundary';

const StudyRoomFAQWithBoundary = () => (
    <ErrorBoundary>
        <StudyRoomFAQ />
    </ErrorBoundary>
);

export default StudyRoomFAQWithBoundary;
