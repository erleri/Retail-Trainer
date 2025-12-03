import { create } from 'zustand';

export const useUserStore = create((set) => ({
    // User Profile
    level: 12,
    xp: 2450,
    nextLevelXp: 5000,
    role: 'user', // 'user' | 'admin'

    // Weakness Analysis (Mock Data)
    weakness: {
        category: 'Brightness Objection',
        score: 65,
        trend: -12, // -12% vs last week
        description: 'Difficulty handling "OLED is too dark" objections.',
        recommendedAction: {
            type: 'study', // 'study' or 'roleplay'
            title: 'QNED Brightness Comparison',
            link: '/study',
            moduleId: 'm3' // Link to specific module if possible
        }
    },

    // Recent Roleplay Sessions (Mock Data)
    recentSessions: [
        { id: 1, product: 'LG OLED G5', customer: 'Price Sensitive', score: 82, date: '2024-11-26' },
        { id: 2, product: 'LG QNED 90', customer: 'Tech Savvy', score: 75, date: '2024-11-25' },
        { id: 3, product: 'LG UHD UT80', customer: 'Elderly', score: 78, date: '2024-11-24' },
    ],

    // Learning Progress (Mock Data)
    learningProgress: [
        { id: 'g5-usp', title: 'OLED G5 USP Master', progress: 65 },
        { id: 'qned-tech', title: 'QNED Technology', progress: 40 },
        { id: 'objection-basic', title: 'Objection Handling Basics', progress: 80 },
    ],

    // Active Missions (Mock Data)
    missions: [
        {
            id: 1,
            type: 'Daily',
            title: "Morning Warm-up",
            description: "Complete 1 Product Knowledge quiz.",
            xp: 50,
            progress: 0,
            total: 1,
            status: 'active',
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 2,
            type: 'Scenario',
            title: "Price Defense Master",
            description: "Successfully handle 3 price objections in Roleplay.",
            xp: 150,
            progress: 1,
            total: 3,
            status: 'active',
            color: 'text-yellow-500',
            bg: 'bg-yellow-50'
        },
        {
            id: 3,
            type: 'Co-op',
            title: "Team Challenge",
            description: "Achieve 100% team participation this week.",
            xp: 300,
            progress: 8,
            total: 10,
            status: 'active',
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            id: 4,
            type: 'Event',
            title: "OLED G5 Launch",
            description: "Complete the new product training module.",
            xp: 500,
            progress: 0,
            total: 1,
            status: 'locked',
            color: 'text-gray-400',
            bg: 'bg-gray-100'
        }
    ],

    // Daily Mission State
    dailyMission: null,
    dailyMissionDate: null, // To check if we need to generate a new one

    // Actions
    setDailyMission: (mission) => set({ dailyMission: mission, dailyMissionDate: new Date().toDateString() }),
    completeDailyMission: () => set((state) => {
        if (!state.dailyMission) return {};
        const newProgress = Math.min(state.dailyMission.progress + 1, state.dailyMission.target);
        return {
            dailyMission: { ...state.dailyMission, progress: newProgress }
        };
    }),

    updateWeakness: (newWeakness) => set({ weakness: newWeakness }),
    addSession: (session) => set((state) => ({ recentSessions: [session, ...state.recentSessions].slice(0, 5) })),
    updateProgress: (courseId, progress) => set((state) => ({
        learningProgress: state.learningProgress.map(c => c.id === courseId ? { ...c, progress } : c)
    })),
    toggleRole: () => set((state) => ({ role: state.role === 'user' ? 'admin' : 'user' }))
}));
