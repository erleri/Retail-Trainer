export const USER_NAME = "Imjun";

export const LAST_STUDY_SESSION = {
    id: 'g5-usp',
    title: 'Mastering OLED Evo',
    progress: 75,
    lastModule: 'Structure & Efficiency'
};

export const MISSION_DATA = [
    { id: 1, type: 'learning', title: 'OLED Refresh Rate', xp: 50, duration: '5m', status: 'new' },
    { id: 2, type: 'saleslab', title: 'Price Objection', xp: 100, duration: '10m', status: 'urgent' },
    { id: 3, type: 'quiz', title: 'Weekly Knowledge Check', xp: 30, duration: '3m', status: 'locked' }
];

export const AI_BRIEFING_MOCK = [
    { mode: 'coaching', message: "Imjun, your 'Price Objection' score dropped yesterday. Let's focus on value-selling today!", action: 'Fix Weakness', link: '/sales-lab' },
    { mode: 'praise', message: "Amazing! You've maintained a 15-day streak. Keep it up to reach Level 2!", action: 'View Progress', link: '/my' },
    { mode: 'insight', message: "Tip: Use open-ended questions to uncover customer needs faster.", action: 'Learn More', link: '/study' }
];

export const DAILY_INSIGHTS = [
    { type: 'tip', title: "Closing Tip", content: "Ask 'How about we schedule the delivery for this Saturday?' instead of 'Do you want to buy?'" },
    { type: 'fact', title: "OLED Fact", content: "OLED pixels generate their own light, allowing for perfect blacks and infinite contrast." },
    { type: 'quote', title: "Motivation", content: "The best sales presentation is a conversation, not a monologue." }
];
