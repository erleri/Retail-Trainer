import { create } from 'zustand';

export const useAppStore = create((set) => ({
    language: 'ko', // 'ko', 'en', 'es', 'pt-br'
    earnedBadges: [],
    isDemoMode: false,
    setLanguage: (lang) => set({ language: lang }),
    toggleLanguage: () => set((state) => ({ language: state.language === 'ko' ? 'en' : 'ko' })),
    toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),

    addBadge: (badgeId) => set((state) => ({
        earnedBadges: state.earnedBadges.includes(badgeId)
            ? state.earnedBadges
            : [...state.earnedBadges, badgeId]
    })),
}));
