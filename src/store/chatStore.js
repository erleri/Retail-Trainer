import { create } from 'zustand';

export const useChatStore = create((set) => ({
    messages: [],
    isTyping: false,
    currentScenario: null,
    feedback: null,
    sessions: [
        {
            id: 1,
            date: new Date(Date.now() - 86400000).toISOString(),
            totalScore: 85,
            product: { name: 'LG OLED evo G5' },
            customer: { traits: [{ label: 'Tech Savvy' }, { label: 'Male' }] },
            summary: 'Great job explaining the technical features. Try to focus more on emotional benefits next time.',
            pros: ['Strong product knowledge', 'Clear explanation'],
            improvements: ['Missed closing signal', 'Could use more empathy'],
            scores: [
                { subject: 'Product Knowledge', A: 90, fullMark: 100 },
                { subject: 'Objection Handling', A: 75, fullMark: 100 },
                { subject: 'Empathy', A: 80, fullMark: 100 },
                { subject: 'Policy', A: 85, fullMark: 100 },
                { subject: 'Conversation', A: 88, fullMark: 100 },
            ],
            recommendedMission: { title: 'Emotional Selling', xp: 50 }
        },
        {
            id: 2,
            date: new Date(Date.now() - 172800000).toISOString(),
            totalScore: 72,
            product: { name: 'LG QNED 90' },
            customer: { traits: [{ label: 'Price Sensitive' }, { label: 'Female' }] },
            summary: 'Good effort handling the price objection. Remember to emphasize value over cost.',
            pros: ['Patient listening', 'Polite tone'],
            improvements: ['Struggled with price justification', 'Hesitant closing'],
            scores: [
                { subject: 'Product Knowledge', A: 70, fullMark: 100 },
                { subject: 'Objection Handling', A: 65, fullMark: 100 },
                { subject: 'Empathy', A: 85, fullMark: 100 },
                { subject: 'Policy', A: 70, fullMark: 100 },
                { subject: 'Conversation', A: 75, fullMark: 100 },
            ],
            recommendedMission: { title: 'Value Proposition', xp: 40 }
        }
    ],

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, { ...message, id: Date.now() }]
    })),

    setTyping: (status) => set({ isTyping: status }),

    addSession: (session) => set((state) => ({
        sessions: [session, ...state.sessions]
    })),

    resetChat: () => set({ messages: [] }),
}));
