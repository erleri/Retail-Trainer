export const PERSONAS = [
    {
        id: 'budget_seeker',
        name: 'Budget Seeker',
        description: 'Price-sensitive 20s Male',
        base_profile: { age_group: '20s', gender: 'Male' },
        surface_traits: ['Price-sensitive', 'Quick-decider'],
        hidden_traits: { price_resistance: 'extreme', skepticism_level: 'medium' },
        default_context: 'Looking for the cheapest option for a studio apartment.',
        default_tone: 'Direct, impatient, focused on numbers.'
    },
    {
        id: 'tech_expert',
        name: 'Tech Expert Pro',
        description: 'Tech-savvy 30s Male',
        base_profile: { age_group: '30s', gender: 'Male' },
        surface_traits: ['Tech-oriented', 'Deliberate', 'Gamer-oriented'],
        hidden_traits: { technical_depth: 'expert', skepticism_level: 'high' },
        default_context: 'Upgrading home theater, cares about specs and gaming performance.',
        default_tone: 'Analytical, uses jargon, asks specific technical questions.'
    },
    {
        id: 'brand_loyalist',
        name: 'Brand Loyalist',
        description: 'Brand-focused 40s Female',
        base_profile: { age_group: '40s', gender: 'Female' },
        surface_traits: ['Brand-focused', 'Design-focused'],
        hidden_traits: { price_resistance: 'low', skepticism_level: 'low' },
        default_context: 'Replacing an old LG TV, trusts the brand implicitly.',
        default_tone: 'Polite, trusting, values reputation and aesthetics.'
    },
    {
        id: 'premium_lifestyle',
        name: 'Premium Lifestyle',
        description: 'Premium-focused 50s Male',
        base_profile: { age_group: '50s', gender: 'Male' },
        surface_traits: ['Brand-focused', 'Quick-decider'],
        hidden_traits: { price_resistance: 'low', technical_depth: 'basic' },
        default_context: 'Want the best TV for a large living room, money is not an issue.',
        default_tone: 'Confident, demanding, expects premium service.'
    },
    {
        id: 'family_user',
        name: 'Family User',
        description: 'Family-oriented 40s Parent',
        base_profile: { age_group: '40s', gender: 'Female' }, // Could be Male too, defaulting to Female for variety
        surface_traits: ['Family-oriented', 'Durability-focused'],
        hidden_traits: { price_resistance: 'medium', decision_latency: 'slow' },
        default_context: 'TV for the living room, watched by kids and grandparents.',
        default_tone: 'Warm, concerned about safety and ease of use.'
    },
    {
        id: 'hardcore_gamer',
        name: 'Hardcore Gamer',
        description: 'Gaming-focused 20-30s',
        base_profile: { age_group: '20s', gender: 'Male' },
        surface_traits: ['Gamer-oriented', 'Tech-oriented'],
        hidden_traits: { technical_depth: 'expert', scenario_bias: ['gaming'] },
        default_context: 'Connecting PS5 and PC, needs 120Hz and low latency.',
        default_tone: 'Excited about gaming features, critical of lag.'
    },
    {
        id: 'senior_simple',
        name: 'Senior Simple User',
        description: 'Simplicity-focused Senior',
        base_profile: { age_group: '60s+', gender: 'Male' },
        surface_traits: ['UI-simplicity', 'Brand-focused'],
        hidden_traits: { technical_depth: 'basic', decision_latency: 'slow' },
        default_context: 'Needs a TV that is easy to control, confused by smart features.',
        default_tone: 'Slow, asks for repetition, values kindness.'
    },
    {
        id: 'bright_room',
        name: 'Bright Room Consumer',
        description: 'Environment-sensitive',
        base_profile: { age_group: '30s', gender: 'Female' },
        surface_traits: ['Environment-sensitive', 'Design-focused'],
        hidden_traits: { scenario_bias: ['brightness'] },
        default_context: 'Living room has huge windows, worried about reflections.',
        default_tone: 'Worried, specific about viewing conditions.'
    },
    {
        id: 'design_first',
        name: 'Design-First Shopper',
        description: 'Aesthetics-focused',
        base_profile: { age_group: '30s', gender: 'Female' },
        surface_traits: ['Design-focused', 'Brand-focused'],
        hidden_traits: { technical_depth: 'basic', price_resistance: 'medium' },
        default_context: 'Interior design is paramount, TV must look like art.',
        default_tone: 'Artistic, visual, cares about bezels and mounting.'
    },
    {
        id: 'durability_first',
        name: 'Durability First',
        description: 'Longevity-focused',
        base_profile: { age_group: '50s', gender: 'Male' },
        surface_traits: ['Durability-focused', 'Price-sensitive'],
        hidden_traits: { skepticism_level: 'high', scenario_bias: ['durability'] },
        default_context: 'Last TV broke after 2 years, wants something that lasts 10 years.',
        default_tone: 'Skeptical, asks about warranty and parts.'
    },
    {
        id: 'second_room',
        name: '2nd Room Buyer',
        description: 'Practicality-focused',
        base_profile: { age_group: '40s', gender: 'Male' },
        surface_traits: ['Price-sensitive', 'UI-simplicity'],
        hidden_traits: { price_resistance: 'high' },
        default_context: 'Small TV for the bedroom or kitchen, doesn\'t need high specs.',
        default_tone: 'Practical, dismissive of unnecessary features.'
    },
    {
        id: 'review_skeptic',
        name: 'Review-Driven Skeptic',
        description: 'Research-heavy Skeptic',
        base_profile: { age_group: '30s', gender: 'Male' },
        surface_traits: ['Tech-oriented', 'Deliberate'],
        hidden_traits: { skepticism_level: 'high', technical_depth: 'intermediate' },
        default_context: 'Read online that OLED has burn-in issues, needs convincing.',
        default_tone: 'Challenging, cites "internet reviews", hard to please.'
    },
    {
        id: 'movie_lover',
        name: 'Movie Lover',
        description: 'Cinema Enthusiast',
        base_profile: { age_group: '30s', gender: 'Female' },
        surface_traits: ['Movie-lover', 'Design-focused'],
        hidden_traits: { scenario_bias: ['cinema'], technical_depth: 'medium' },
        default_context: 'Wants to recreate the cinema experience at home. Cares about black levels.',
        default_tone: 'Passionate about movies, asks about HDR and Dolby Vision.'
    },
    {
        id: 'sports_fan',
        name: 'Sports Mania',
        description: 'Sports Enthusiast',
        base_profile: { age_group: '40s', gender: 'Male' },
        surface_traits: ['Sports-fan', 'Social-host'],
        hidden_traits: { scenario_bias: ['sports'], decision_latency: 'fast' },
        default_context: 'Needs a big TV for the upcoming World Cup. Friends are coming over.',
        default_tone: 'Energetic, wants smooth motion and wide viewing angles.'
    }
];

export const DIFFICULTY_LEVELS = [
    {
        level: 1,
        label: 'Lv1 Friendly',
        description: 'Easy, few questions, easy closing.',
        modifiers: { price_res: 0.20, tech: 0.25, question: 0.5, close: 0.8 }
    },
    {
        level: 2,
        label: 'Lv2 Balanced',
        description: 'Average store customer.',
        modifiers: { price_res: 0.40, tech: 0.40, question: 0.8, close: 0.6 }
    },
    {
        level: 3,
        label: 'Lv3 Challenging',
        description: 'Increased price/tech demands.',
        modifiers: { price_res: 0.55, tech: 0.55, question: 1.1, close: 0.4 }
    },
    {
        level: 4,
        label: 'Lv4 Hard',
        description: 'High pressure on tech/price/AS.',
        modifiers: { price_res: 0.75, tech: 0.75, question: 1.4, close: 0.25 }
    },
    {
        level: 5,
        label: 'Lv5 Expert',
        description: 'Expert specs, frequent objections, hard close.',
        modifiers: { price_res: 0.90, tech: 0.95, question: 1.8, close: 0.10 }
    }
];

export const TRAIT_DEFINITIONS = {
    'Price-sensitive': { icon: '💰', label: 'Price-sensitive' },
    'Quick-decider': { icon: '⚡', label: 'Quick-decider' },
    'Tech-oriented': { icon: '🤓', label: 'Tech-oriented' },
    'Deliberate': { icon: '🤔', label: 'Deliberate' },
    'Gamer-oriented': { icon: '🎮', label: 'Gamer-oriented' },
    'Brand-focused': { icon: '💎', label: 'Brand-focused' },
    'Design-focused': { icon: '🎨', label: 'Design-focused' },
    'Family-oriented': { icon: '👨‍👩‍👧‍👦', label: 'Family-oriented' },
    'Durability-focused': { icon: '🛡️', label: 'Durability-focused' },
    'UI-simplicity': { icon: '👵', label: 'UI-simplicity' },
    'Environment-sensitive': { icon: '☀️', label: 'Environment-sensitive' },
    'Movie-lover': { icon: '🎬', label: 'Movie-lover' },
    'Sports-fan': { icon: '⚽', label: 'Sports-fan' },
    'Social-host': { icon: '🥂', label: 'Social-host' }
};

export const ALL_TRAITS = Object.keys(TRAIT_DEFINITIONS);

export const PRODUCT_CATALOG = {
    types: ['TV', 'Soundbar', 'Monitor', 'Projector'],
    categories: {
        'TV': ['OLED', 'QNED', 'UHD', 'Micro LED']
    },
    models: {
        'OLED': [
            { id: 'oled_g5', name: 'LG OLED evo G5', sizes: [55, 65, 77, 83, 97], basePrice: 2800, type: 'Premium' },
            { id: 'oled_c5', name: 'LG OLED evo C5', sizes: [42, 48, 55, 65, 77, 83], basePrice: 1800, type: 'Mainstream' },
            { id: 'oled_b5', name: 'LG OLED B5', sizes: [55, 65, 77], basePrice: 1500, type: 'Entry' }
        ],
        'QNED': [
            { id: 'qned_99', name: 'LG QNED 99 (8K)', sizes: [75, 86], basePrice: 3500, type: 'Premium' },
            { id: 'qned_90', name: 'LG QNED 90', sizes: [65, 75, 86], basePrice: 1600, type: 'Mainstream' },
            { id: 'qned_85', name: 'LG QNED 85', sizes: [55, 65, 75, 86], basePrice: 1300, type: 'Entry' }
        ],
        'UHD': [
            { id: 'uhd_80', name: 'LG UHD 80', sizes: [43, 50, 55, 65, 75, 86], basePrice: 600, type: 'Entry' },
            { id: 'uhd_75', name: 'LG UHD 75', sizes: [43, 50, 55, 65, 75], basePrice: 500, type: 'Budget' }
        ],
        'Micro LED': [
            { id: 'magnit', name: 'LG MAGNIT', sizes: [136], basePrice: 20000, type: 'Luxury' }
        ]
    }
};

export const UPSELL_TRIGGERS = {
    'budget_seeker': {
        text: "Focus on value per inch. 75\" UHD offers best size-to-price ratio.",
        recommendedSizes: [65, 75],
        highlight: 'value'
    },
    'tech_expert': {
        text: "Larger screens enhance HDR impact and gaming immersion.",
        recommendedSizes: [77, 83, 86],
        highlight: 'tech'
    },
    'brand_loyalist': {
        text: "Premium models like G5 deserve the largest canvas.",
        recommendedSizes: [77, 83, 97],
        highlight: 'premium'
    },
    'premium_lifestyle': {
        text: "For a true cinema room experience, 83\"+ is essential.",
        recommendedSizes: [83, 97, 136],
        highlight: 'luxury'
    },
    'family_user': {
        text: "75\"+ ensures everyone has a great view from any spot.",
        recommendedSizes: [75, 86],
        highlight: 'family'
    },
    'hardcore_gamer': {
        text: "Immersive gaming requires filling your field of view.",
        recommendedSizes: [65, 77, 83],
        highlight: 'gaming'
    },
    'senior_simple': {
        text: "Larger screens make text and UI elements easier to read.",
        recommendedSizes: [65, 75],
        highlight: 'readability'
    },
    'bright_room': {
        text: "QNED 86\" offers high brightness to combat reflections.",
        recommendedSizes: [75, 86],
        highlight: 'brightness'
    },
    'design_first': {
        text: "Gallery Design (G5) looks like art, especially at 77\"+.",
        recommendedSizes: [77, 83, 97],
        highlight: 'design'
    },
    'durability_first': {
        text: "Larger chassis often have better heat dissipation.",
        recommendedSizes: [65, 75],
        highlight: 'durability'
    },
    'second_room': {
        text: "Even for 2nd rooms, 55\" is the new standard.",
        recommendedSizes: [48, 55],
        highlight: 'compact'
    },
    'review_skeptic': {
        text: "See the difference yourself. 83\" OLED vs 86\" QNED.",
        recommendedSizes: [77, 83, 86],
        highlight: 'comparison'
    },
    'movie_lover': {
        text: "Cinematic immersion requires a screen that fills your vision.",
        recommendedSizes: [77, 83, 97],
        highlight: 'cinema'
    },
    'sports_fan': {
        text: "Feel like you're in the stadium with a massive screen.",
        recommendedSizes: [75, 86],
        highlight: 'stadium'
    },
    'social_host': {
        text: "A large screen ensures every guest has a perfect view.",
        recommendedSizes: [75, 86, 97],
        highlight: 'party'
    }
};

export const TRAIT_WEIGHTS = {
    'price_sensitive': { OLED: -2, MRGB: -1, QNED: 1, UHD: 3 },
    'tech_oriented': { OLED: 2, MRGB: 2, QNED: 1, UHD: 0 },
    'design_focused': { OLED: 3, MRGB: 2, QNED: 1, UHD: 0 },
    'family_oriented': { OLED: 1, MRGB: 2, QNED: 2, UHD: 1 },
    'quick_decider': { OLED: 0, MRGB: 1, QNED: 1, UHD: 2 },
    'deliberate': { OLED: 1, MRGB: 1, QNED: 1, UHD: 0 },
    'gamer_oriented': { OLED: 3, MRGB: 2, QNED: 1, UHD: 0 },
    'ui_simplicity': { OLED: 0, MRGB: 0, QNED: 0, UHD: 0 },
    'environment_sensitive': { OLED: 0, MRGB: 3, QNED: 2, UHD: 1 },
    'durability_focused': { OLED: 0, MRGB: 2, QNED: 2, UHD: 1 },
    'movie_lover': { OLED: 3, MRGB: 1, QNED: 0, UHD: 0 },
    'sports_fan': { OLED: 1, MRGB: 3, QNED: 3, UHD: 1 },
    'social_host': { OLED: 2, MRGB: 2, QNED: 3, UHD: 1 },
};

export const OPENING_TEMPLATES = {
    'family_user': [
        "거실에서 가족이 같이 볼 TV를 하나 알아보려고 해요.",
        "멀리서 봐도 잘 보이는 게 좋을 것 같아요.",
        "아이들이랑 주말에 영화를 자주 보는데, 어떤 게 좋을까요?"
    ],
    'premium_lifestyle': [
        "집에 영화 볼 공간을 좀 꾸미고 싶어서요.",
        "거실이 넓어서 화면이 너무 작지 않았으면 좋겠어요.",
        "인테리어랑 잘 어울리는 고급스러운 모델을 찾고 있어요."
    ],
    'gamer': [
        "게임이랑 영화 둘 다 즐길 TV를 찾고 있어요.",
        "PS5를 샀는데, 거기에 맞는 TV가 뭐가 있나요?",
        "화면이 크면 좋은데 게임할 때 어지럽진 않을까 걱정되네요."
    ],
    'design_focused': [
        "거실 벽 한 면을 TV로 꽉 채우는 느낌이 좋더라고요.",
        "TV가 꺼져 있을 때도 예뻤으면 좋겠어요.",
        "벽걸이로 했을 때 가장 깔끔한 모델이 뭔가요?"
    ],
    'review_skeptic': [
        "유튜브에서 큰 인치가 좋다는 말이 많아서요, 실제로 어떤지 궁금하네요.",
        "65인치를 생각하고 있는데, 더 크게 가도 괜찮을까요?",
        "OLED가 좋다고는 하는데, 번인이 걱정돼서요."
    ],
    'default': [
        "TV를 좀 보러 왔는데요.",
        "요즘 어떤 모델이 제일 잘 나가나요?",
        "화질 좋은 걸로 추천 좀 해주세요."
    ]
};

export const AGES = ['20s', '30s', '40s', '50s', '60s+'];
export const GENDERS = ['Male', 'Female', 'Other'];
