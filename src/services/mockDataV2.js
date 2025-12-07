// Core Engine Spec v2 Compliant Mock Data

export const INITIAL_PRODUCT_CATALOG = {
    types: ["TV", "Soundbar", "Monitor", "Projector"], // Expanded based on UI image
    categories: {
        "TV": ["OLED evo", "OLED", "QNED", "UHD", "Micro LED"],
        "Soundbar": ["Soundbar"],
        "Monitor": ["Gaming", "Office"],
        "Projector": ["CineBeam"]
    },
    models: {
        "OLED evo": [
            { id: "oled-g5-65", name: "LG OLED evo G5", line: "Premium", categoryKey: "OLED evo", type: "TV", basePrice: 2800, sizes: [55, 65, 77, 83, 97], isActive: true },
            { id: "oled-c5-55", name: "LG OLED evo C5", line: "Mainstream", categoryKey: "OLED evo", type: "TV", basePrice: 1800, sizes: [42, 48, 55, 65, 77, 83], isActive: true }
        ],
        "OLED": [
            { id: "oled-b5-55", name: "LG OLED B5", line: "Entry", categoryKey: "OLED", type: "TV", basePrice: 1500, sizes: [55, 65, 77], isActive: true }
        ]
    }
};

export const INITIAL_TRAITS = [
    // --- Purchase Style ---
    { id: "price_sensitive", label: "Price-sensitive", description: "Focuses heavily on price and value for money.", category: "purchase_style", difficultyRange: { min: 1, max: 5 }, behaviorModifiers: { budgetSensitivity: 0.9, decisionDelay: 0.4 } },
    { id: "quick_decider", label: "Quick-decider", description: "Makes decisions fast, prefers concise info.", category: "purchase_style", difficultyRange: { min: 1, max: 3 }, behaviorModifiers: { decisionDelay: -0.5, infoDemand: -0.3 } },
    { id: "deliberate", label: "Deliberate", description: "Thinks carefully, compares options, slow to decide.", category: "purchase_style", difficultyRange: { min: 3, max: 5 }, behaviorModifiers: { decisionDelay: 0.8, infoDemand: 0.6 } },
    { id: "brand_focused", label: "Brand-focused", description: "Trusts major brands, less sensitive to specs if brand is good.", category: "purchase_style", difficultyRange: { min: 1, max: 4 }, behaviorModifiers: { brandLoyalty: 0.9 } },

    // --- Product Focus ---
    { id: "tech_oriented", label: "Tech-oriented", description: "Loves specs, new technology, and advanced features.", category: "product_focus", difficultyRange: { min: 2, max: 5 }, behaviorModifiers: { techLiteracy: 0.9, responseComplexity: 0.5 } },
    { id: "design_focused", label: "Design-focused", description: "Prioritizes aesthetics, thinness, and how it looks in the room.", category: "product_focus", difficultyRange: { min: 1, max: 4 }, behaviorModifiers: { aestheticConcern: 0.9 } },
    { id: "durability_focused", label: "Durability-focused", description: "Wants a product that lasts long, wary of burn-in or failure.", category: "product_focus", difficultyRange: { min: 2, max: 5 }, behaviorModifiers: { warrantyConcern: 0.8, reliabilityDemand: 0.8 } },
    { id: "ui_simplicity", label: "UI-simplicity", description: "Wants easy-to-use interface, hates complexity.", category: "product_focus", difficultyRange: { min: 1, max: 3 }, behaviorModifiers: { techLiteracy: -0.4, usabilityConcern: 0.9 } },
    { id: "environment_sensitive", label: "Environment-sensitive", description: "Cares about energy efficiency and eco-friendliness.", category: "product_focus", difficultyRange: { min: 2, max: 4 }, behaviorModifiers: { energyConcern: 0.9 } },

    // --- Lifestyle / Usage ---
    { id: "family_oriented", label: "Family-oriented", description: "Buying for the family living room, considers kids/safety/angles.", category: "usage", difficultyRange: { min: 1, max: 4 }, behaviorModifiers: { safetyConcern: 0.7, viewingAngleConcern: 0.8 } },
    { id: "gamer_oriented", label: "Gamer-oriented", description: "Needs 120Hz, VRR, low latency. Hardcore user.", category: "usage", difficultyRange: { min: 2, max: 5 }, behaviorModifiers: { specDemand: 0.9 } },
    { id: "movie_lover", label: "Movie-lover", description: "Wants true black, director's mode, cinematic experience.", category: "usage", difficultyRange: { min: 1, max: 5 }, behaviorModifiers: { pictureQualityDemand: 0.9 } },
    { id: "sports_fan", label: "Sports-fan", description: "Needs good motion handling and brightness for day viewing.", category: "usage", difficultyRange: { min: 1, max: 4 }, behaviorModifiers: { motionHandlingDemand: 0.8, brightnessDemand: 0.7 } },
    { id: "social_host", label: "Social-host", description: "Watches TV with many guests, needs wide angles and size.", category: "usage", difficultyRange: { min: 1, max: 3 }, behaviorModifiers: { viewingAngleConcern: 0.9, sizeDemand: 0.7 } }
];

export const INITIAL_TRAIT_LINKAGES = {
    "movie_lover": ["tech_oriented"],
    "gamer_oriented": ["tech_oriented", "spec_sensitive"],
    "family_oriented": ["durability_focused", "ui_simplicity"]
};

export const INITIAL_PERSONAS = [
    { id: "family_user", name: "Family User", shortDescription: "Looking for a durable TV for the living room.", ageGroup: "40s", gender: "Female", mainTraits: ["family_oriented", "durability_focused"], hiddenTrait: "price_sensitive", regions: ["GLOBAL"] },
    { id: "smart_budget_shopper", name: "Smart Budget Shopper", shortDescription: "Tech-savvy student looking for best value.", ageGroup: "20s", gender: "Male", mainTraits: ["price_sensitive", "tech_oriented"], hiddenTrait: "brand_focused", regions: ["GLOBAL"] },
    { id: "premium_gamer", name: "Premium Gamer", shortDescription: "Console gamer wants the best OLED performance.", ageGroup: "20s", gender: "Male", mainTraits: ["gamer_oriented", "tech_oriented"], hiddenTrait: "brand_focused", regions: ["GLOBAL"] },
    { id: "retired_movie_buff", name: "Retired Movie Buff", shortDescription: "Wants a cinema at home, price is not the main issue.", ageGroup: "60s+", gender: "Male", mainTraits: ["movie_lover", "ui_simplicity"], hiddenTrait: "design_focused", regions: ["GLOBAL"] },
    { id: "tech_early_adopter", name: "Tech Early Adopter", shortDescription: "Must have the latest tech immediately.", ageGroup: "30s", gender: "Male", mainTraits: ["tech_oriented", "quick_decider"], hiddenTrait: "brand_focused", regions: ["GLOBAL"] },
    { id: "interior_designer", name: "Interior Designer", shortDescription: "Looking for a TV that looks like art/furniture.", ageGroup: "30s", gender: "Female", mainTraits: ["design_focused", "brand_focused"], hiddenTrait: "environment_sensitive", regions: ["GLOBAL"] },
    { id: "sports_bar_owner", name: "Sports Bar Owner", shortDescription: "Needs durable, bright TVs for business use.", ageGroup: "40s", gender: "Male", mainTraits: ["sports_fan", "durability_focused"], hiddenTrait: "social_host", regions: ["GLOBAL"] },
    { id: "newlyweds", name: "Newlyweds", shortDescription: "Setting up their first home, budget conscious but want nice things.", ageGroup: "20s", gender: "Female", mainTraits: ["design_focused", "price_sensitive"], hiddenTrait: "family_oriented", regions: ["GLOBAL"] },
    { id: "grandparents_gift", name: "Grandparents' Gift", shortDescription: "Buying a simple, reliable TV for aging parents.", ageGroup: "50s", gender: "Female", mainTraits: ["ui_simplicity", "durability_focused"], hiddenTrait: "price_sensitive", regions: ["GLOBAL"] },
    { id: "home_office_worker", name: "Home Office Worker", shortDescription: "Needs a TV that doubles as a high-end monitor.", ageGroup: "30s", gender: "Male", mainTraits: ["tech_oriented", "ui_simplicity"], hiddenTrait: "durability_focused", regions: ["GLOBAL"] },
    { id: "busy_professional", name: "Busy Professional", shortDescription: "No time to research, wants the best brand quickly.", ageGroup: "40s", gender: "Female", mainTraits: ["quick_decider", "brand_focused"], hiddenTrait: "price_sensitive", regions: ["GLOBAL"] },
    { id: "college_student", name: "College Student", shortDescription: "Dorm room TV, mainly for gaming and streaming.", ageGroup: "20s", gender: "Male", mainTraits: ["price_sensitive", "gamer_oriented"], hiddenTrait: "social_host", regions: ["GLOBAL"] },
    { id: "eco_conscious_buyer", name: "Eco-Conscious Buyer", shortDescription: "Strictly checks energy rating and materials.", ageGroup: "30s", gender: "Female", mainTraits: ["environment_sensitive", "deliberate"], hiddenTrait: "durability_focused", regions: ["GLOBAL"] },
    { id: "second_tv_buyer", name: "Bedroom TV Buyer", shortDescription: "Looking for a smaller secondary TV for the bedroom.", ageGroup: "50s", gender: "Female", mainTraits: ["price_sensitive", "ui_simplicity"], hiddenTrait: "movie_lover", regions: ["GLOBAL"] }
];

export const INITIAL_DIFFICULTIES = [
    { difficultyId: 1, level: 1, label: "Beginner", description: "Friendly customer, clear needs, no objections.", parameters: { patience: 1.0, ambiguity: 0.1, objectionRate: 0.0 } },
    { difficultyId: 2, level: 2, label: "Easy", description: "Polite, some questions, minor hesitation.", parameters: { patience: 0.9, ambiguity: 0.2, objectionRate: 0.2 } },
    { difficultyId: 3, level: 3, label: "Normal", description: "Standard customer, compares options, standard objections.", parameters: { patience: 0.7, ambiguity: 0.4, objectionRate: 0.5 } },
    { difficultyId: 4, level: 4, label: "Hard", description: "Demanding, vague needs, strong objections.", parameters: { patience: 0.5, ambiguity: 0.7, objectionRate: 0.8 } },
    { difficultyId: 5, level: 5, label: "Expert", description: "Hostile or confused, complex constraints, very impatient.", parameters: { patience: 0.3, ambiguity: 0.9, objectionRate: 1.0 } }
];

export const INITIAL_STAGES = [
    { stageId: "st_opening", label: "Opening", description: "Greet and Build Rapport" },
    { stageId: "st_discovery", label: "Needs Discovery", description: "Ask questions to understand needs" },
    { stageId: "st_proposal", label: "Product Proposal", description: "Recommend a suitable product" },
    { stageId: "st_objection", label: "Objection Handling", description: "Resolve concerns" },
    { stageId: "st_closing", label: "Closing", description: "Ask for the sale" }
];

export const INITIAL_PROMPTS = [
    { promptId: "global_system", scope: "GLOBAL", content: "You are a realistic customer for a retail sales training simulation." }
];

export const INITIAL_UPSELL_RULES = [
    {
        id: "upsell_movie_lover_size",
        label: "Movie Lover – Size Upgrade",
        description: "Encourage larger screens for movie lovers.",
        customer: { includeTraits: ["movie_lover"], minDifficulty: 2 },
        product: { type: "TV", currentSizeTiers: ["standard", "large"] },
        scenario: { stage: "recommendation" },
        actions: [{ type: "recommend_size", params: { targetMinTier: "xl", minTierIncrease: 1 } }],
        messages: [{ id: "msg_movie_size_1", template: "Since you love movies, a larger screen like {recommendedSize} would give you a true cinema feel.", tone: "friendly" }]
    }
];

export const INITIAL_SCENARIOS = [
    {
        scenarioId: "sc_001",
        versionId: "v1.0",
        title: "Standard TV Sales",
        description: "General flow for selling a TV to a typical customer.",
        personaPool: ["family_user", "smart_budget"],
        traitPool: ["price_sensitive", "brand_focused"],
        difficultyRange: [1, 3],
        stages: [
            { stageId: "st_001", order: 1, label: "Opening", description: "Greet the customer.", triggers: [{ type: "intent", value: "greeting" }] },
            { stageId: "st_002", order: 2, label: "Needs Discovery", description: "Identify usage features.", triggers: [{ type: "intent", value: "needs_stated" }] },
            { stageId: "st_003", order: 3, label: "Product Proposal", description: "Propose a model.", triggers: [{ type: "intent", value: "proposal_made" }] },
            { stageId: "st_004", order: 4, label: "Objection Handling", description: "Handle concerns.", triggers: [{ type: "intent", value: "objection_raised" }] },
            { stageId: "st_005", order: 5, label: "Closing", description: "Ask for sale.", triggers: [{ type: "intent", value: "closing" }] }
        ],
        content: "In this scenario, you are open to suggestions but have a fixed budget.",
        metadata: { updatedAt: new Date().toISOString() }
    }
];

export const INITIAL_GAMIFICATION = {
    xpRules: [
        { ruleId: "xp_scenario_complete", event: "scenario.completed", baseXp: 50, multipliers: { difficulty: 1.5, streak: 1.1 } },
        { ruleId: "xp_quiz_perfect", event: "quiz.perfect", baseXp: 30, multipliers: { streak: 1.2 } },
        { ruleId: "xp_daily_login", event: "user.login", baseXp: 10, multipliers: {} }
    ],
    badges: [
        { badgeId: "badge_closer_bronze", title: "Closer I", description: "Close 5 sales scnearios", category: "sales", tier: "Bronze", icon: "🏆", goal: 5 },
        { badgeId: "badge_closer_silver", title: "Closer II", description: "Close 20 sales scenarios", category: "sales", tier: "Silver", icon: "🥈", goal: 20 },
        { badgeId: "badge_upsell_king", title: "Upsell King", description: "Successful upsell > $500", category: "upsell", tier: "Gold", icon: "👑", goal: 1 }
    ],
    levels: [
        { level: 1, requiredXp: 0 },
        { level: 2, requiredXp: 200 },
        { level: 3, requiredXp: 500 },
        { level: 4, requiredXp: 1000 },
        { level: 5, requiredXp: 2000 }
    ]
};

export const INITIAL_MISSION_TEMPLATES = [
    {
        templateId: "mt_daily_warmup",
        title: "Daily Warmup",
        description: "Complete 1 scenario and read 1 product update.",
        category: "streak",
        requirements: { scenarioCount: 1, contentCount: 1 },
        reward: { type: "xp", value: 50 },
        durationDays: 1,
        frequency: "daily"
    },
    {
        templateId: "mt_objection_mastery",
        title: "Objection Mastery",
        description: "Successfully handle 'Price High' objection 3 times.",
        category: "learning",
        requirements: { specificIntent: "objection_price", count: 3 },
        reward: { type: "badge", value: "badge_closer_bronze" },
        durationDays: 7
    }
];

export const INITIAL_QUESTS = [
    {
        questId: "quest_new_hire_onboarding",
        title: "New Hire Onboarding Path",
        description: "Complete the essential training modules to start selling.",
        steps: [
            { step: 1, missionTemplateId: "mt_daily_warmup", label: "Day 1: Basics" },
            { step: 2, missionTemplateId: "mt_objection_mastery", label: "Week 1: Handling Customers" }
        ],
        reward: { type: "badge", value: "badge_new_hire_grad" }
    }
];

// --- 5. Content Engine (V2) ---
export const INITIAL_STUDY_MATERIALS = [
    {
        materialId: "mat_001",
        title: "OLED Evo Technology Guide",
        description: "Deep dive into the 2025 OLED Evo panel improvements.",
        type: "pdf",
        category: "product",
        tags: ["oled", "panel", "tech"],
        file: {
            fileId: "file_pdf_123",
            fileName: "OLED_Evo_2025_Spec.pdf",
            fileType: "application/pdf",
            fileSize: 4500000,
            storageUrl: "#"
        },
        autoGeneratedModule: {
            moduleId: "mod_001",
            status: "completed"
        },
        scope: "GLOBAL",
        createdAt: new Date().toISOString()
    },
    {
        materialId: "mat_002",
        title: "Handling Price Objections",
        description: "Video training on how to handle price sensitivity.",
        type: "video",
        category: "sales_skill",
        tags: ["objection", "price", "closing"],
        file: {
            fileId: "file_vid_442",
            fileName: "Price_Objection_Masterclass.mp4",
            fileType: "video/mp4",
            fileSize: 150000000,
            storageUrl: "#"
        },
        autoGeneratedModule: {
            moduleId: "mod_002",
            status: "pending"
        },
        scope: "GLOBAL",
        createdAt: new Date().toISOString()
    }
];

export const INITIAL_MODULES = [
    {
        moduleId: "mod_001",
        sourceMaterialId: "mat_001",
        title: "OLED Evo Core Concepts",
        summary: "Key takeaways about the new brightness booster and heat dissipation.",
        sections: [
            {
                sectionId: "sec_1",
                title: "What is Brightness Booster?",
                body: "The new G5 series features a dedicated heat sink and advanced algorithms...",
                media: { type: "image", url: "#" }
            },
            {
                sectionId: "sec_2",
                title: "Comparison vs C5",
                body: "While C5 is excellent, G5 offers 30% higher peak brightness...",
                media: null
            }
        ],
        createdAt: new Date().toISOString()
    }
];

export const INITIAL_QUIZZES = [
    {
        quizId: "quiz_001",
        materialId: "mat_001",
        title: "OLED Wisdom Check",
        questions: [
            {
                questionId: "q1",
                type: "mcq",
                question: "What is the main benefit of the G5's heat sink?",
                options: ["Lighter weight", "Higher sustained brightness", "Better sound", "Lower cost"],
                answer: 1,
                explanation: "The heat sink allows the panel to be driven harder for brighter highlights without risk."
            },
            {
                questionId: "q2",
                type: "true_false",
                question: "OLED panels require a backlight.",
                options: ["True", "False"],
                answer: 1,
                explanation: "OLEDs are self-emissive and do not need a backlight."
            }
        ],
        difficulty: 2,
        tags: ["oled", "tech"],
        createdAt: new Date().toISOString()
    }
];

export const INITIAL_UPM_LOGS = {
    "u_01": {
        scenario: { behaviorScore: 0.85, upsellSuccessRate: 0.4, totalSessions: 12 },
        learning: { completedModules: 5, repeatCount: 2 },
        quiz: { avgAccuracy: 0.9, totalQuizzes: 4 },
        skill: { product_knowledge: 0.8, empathy: 0.7, closing: 0.6 }
    }
};

export const INITIAL_INSIGHTS = [
    {
        insightId: "ins_001",
        userId: "u_01",
        type: "weakness",
        category: "closing",
        score: 0.4,
        confidence: 0.85,
        message: "User struggles with closing high-value sales.",
        actions: [{ type: "assign_mission", value: "mt_objection_mastery" }],
        createdAt: new Date().toISOString()
    },
    {
        insightId: "ins_002",
        userId: "u_01",
        type: "strength",
        category: "product_knowledge",
        score: 0.9,
        confidence: 0.95,
        message: "Excellent mastery of OLED technical specs.",
        actions: [],
        createdAt: new Date().toISOString()
    }
];

export const INITIAL_USER_GAMIFICATION = {
    "u_01": {
        userId: "u_01",
        level: 12,
        currentXp: 1250,
        nextLevelXp: 2000,
        streak: 15,
        rankLabel: "Gold Pro",
        badges: ["badge_closer_bronze", "badge_upsell_king"]
    }
};
