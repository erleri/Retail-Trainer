import { StorageAdapter } from './storageAdapter';

import {
    INITIAL_PRODUCT_CATALOG,
    INITIAL_TRAITS,
    INITIAL_TRAIT_LINKAGES,
    INITIAL_PERSONAS,
    INITIAL_DIFFICULTIES,
    INITIAL_STAGES,
    INITIAL_SCENARIOS,
    INITIAL_PROMPTS,
    INITIAL_GAMIFICATION,
    INITIAL_USER_GAMIFICATION,
    INITIAL_MISSION_TEMPLATES,
    INITIAL_QUESTS,
    INITIAL_STUDY_MATERIALS,
    INITIAL_MODULES,
    INITIAL_QUIZZES,
    INITIAL_UPM_LOGS,
    INITIAL_INSIGHTS
} from './mockDataV2';


// --- Mock Session Context ---
// In a real app, this comes from auth token. Here we simulate it.
let sessionContext = {
    userId: "admin_001",
    role: "ADMIN", // ADMIN, OPERATOR, TRAINER, LEARNER
    scope: {
        regionId: "GLOBAL", // GLOBAL, NA, APAC, EMEA
        countryId: null,
        branchId: null
    }
};

// --- Mock Database (In-Memory) ---
const INITIAL_DB_STATE = {
    catalog: INITIAL_PRODUCT_CATALOG || [],
    traits: INITIAL_TRAITS || [],
    personas: INITIAL_PERSONAS || [],
    difficulties: INITIAL_DIFFICULTIES || [],
    stages: INITIAL_STAGES || [],
    scenarios: INITIAL_SCENARIOS || [],
    prompts: INITIAL_PROMPTS || [],
    upsellRules: [],
    traitLinkages: [],
    gamification: INITIAL_GAMIFICATION || { xpRules: [], badges: [], levels: [] },
    userGamification: INITIAL_USER_GAMIFICATION || {},
    missionTemplates: INITIAL_MISSION_TEMPLATES || [],
    quests: INITIAL_QUESTS || [],
    materials: INITIAL_STUDY_MATERIALS || [],
    modules: INITIAL_MODULES || [],
    quizzes: INITIAL_QUIZZES || [],
    upm: INITIAL_UPM_LOGS || {},
    insights: INITIAL_INSIGHTS || []
};

// Load from Storage or fallback to Initial
let db = StorageAdapter.load(INITIAL_DB_STATE);

// Helper to save DB on every change
const saveDb = () => {
    StorageAdapter.save(db);
};

// --- Helper: Standard Response Envelope ---
const createResponse = (data, meta = {}) => ({
    success: true,
    data,
    meta: {
        timestamp: new Date().toISOString(),
        version: "v2.0.0-mock",
        scope: sessionContext.scope,
        ...meta
    },
    error: null
});

const createError = (code, message, details = null) => ({
    success: false,
    data: null,
    meta: {
        timestamp: new Date().toISOString(),
        version: "v2.0.0-mock"
    },
    error: { code, message, details }
});

// --- Helper: Middleware Simulation ---
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

const checkScope = (requiredScope) => {
    // Admin bypass
    if (sessionContext.role === 'ADMIN') return true;
    if (sessionContext.scope.regionId === 'GLOBAL') return true;
    return true;
};

// --- Main API Class ---
// --- Main API Class ---
class OperatorApiClient {

    // === Event System (AG_EXPORT) ===
    constructor() {
        this.webhookUrl = null; // Plaeholder: Set this via setWebhookUrl()
        this.enableLogging = true;
        saveDb();
    }

    setWebhookUrl(url) {
        this.webhookUrl = url;
        console.log(`[AG] Webhook URL connected: ${url}`);
    }

    async emitEvent(eventName, payload) {
        const eventPacket = {
            event: eventName,
            timestamp: new Date().toISOString(),
            payload: payload
        };

        // 1. Dev Logging (So User sees it working)
        if (this.enableLogging) {
            console.log(`%c[AG_EXPORT] ${eventName}`, 'color: #10B981; font-weight: bold;', payload);
        }

        // 2. Global Window Exposure (For GPT Console Reading if needed)
        if (typeof window !== 'undefined') {
            window.LAST_AG_EVENT = eventPacket;
        }

        // 3. Webhook Dispatch (Active when URL is provided)
        if (this.webhookUrl) {
            try {
                fetch(this.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventPacket)
                }).catch(e => console.warn("[AG] Webhook failed (network):", e));
            } catch (e) {
                console.warn("[AG] Webhook failed (setup):", e);
            }
        }
    }

    // === 1. Product Catalog ===
    async getProductCatalog() {
        await delay();
        // if (!checkScope('READ_CATALOG')) return createError("FORBIDDEN", "Scope violation");
        return createResponse({ catalog: db.catalog });
    }

    async updateProductCatalog(newCatalog) {
        await delay(300);
        if (sessionContext.role !== 'ADMIN') return createError("FORBIDDEN", "Admin only");
        db.catalog = newCatalog;
        saveDb();

        this.emitEvent("catalog.updated", { itemCount: newCatalog.length });
        return createResponse({ catalog: db.catalog });
    }

    // === 2. Customer Engine (Traits/Personas) ===
    async getTraits() {
        await delay();
        return createResponse({ traits: db.traits });
    }

    async updateTraits(newTraits) {
        await delay();
        db.traits = newTraits;
        saveDb();
        this.emitEvent("traits.updated", { count: newTraits.length });
        return createResponse({ traits: db.traits });
    }

    async getTraitLinkages() {
        await delay();
        return createResponse({ linkages: db.traitLinkages });
    }

    async getPersonas(regionFilter) {
        await delay();
        let list = db.personas;
        if (regionFilter) {
            list = list.filter(p => p.regions.includes(regionFilter) || p.regions.includes("GLOBAL"));
        }
        return createResponse({ personas: list });
    }

    async getDifficulties() {
        await delay();
        return createResponse({ levels: db.difficulties });
    }

    async updateDifficulties(l) {
        await delay();
        db.difficulties = l;
        this.emitEvent("difficulties.updated", { count: l.length });
        return createResponse({ levels: l });
    }

    // === 3. Scenario Engine ===
    async getStages() {
        await delay();
        return createResponse({ stages: db.stages });
    }

    async updateStages(s) {
        await delay();
        db.stages = s;
        this.emitEvent("stages.updated", { count: s.length });
        return createResponse({ stages: s });
    }

    // === 3.1 Scenario Management (V2) ===
    async getScenarios() {
        await delay();
        return createResponse({ scenarios: db.scenarios || [] });
    }

    async getScenario(id) {
        await delay();
        const s = (db.scenarios || []).find(x => x.scenarioId === id);
        return s ? createResponse({ scenario: s }) : createError("NOT_FOUND");
    }

    async createScenario(scenario) {
        await delay();
        if (!db.scenarios) db.scenarios = [];
        const newScenario = { ...scenario, scenarioId: `sc_${Date.now()}`, versionId: "v1.0", published: false };
        db.scenarios.push(newScenario);

        this.emitEvent("scenario.created", { scenarioId: newScenario.scenarioId, title: newScenario.title });
        return createResponse({ scenario: newScenario });
    }

    // === 4. Prompt Engine (V2) ===
    async getPrompts() {
        await delay();
        return createResponse({ prompts: db.prompts });
    }

    async resolvePrompt(context) {
        await delay();
        return createResponse({ resolvedPrompt: "Mock resolved prompt based on hierarchy." });
    }

    async updatePrompt(promptId, content) {
        await delay();
        const idx = db.prompts.findIndex(p => p.promptId === promptId);
        if (idx !== -1) {
            db.prompts[idx] = { ...db.prompts[idx], ...content };

            this.emitEvent("prompt.updated", { promptId, updates: Object.keys(content) });
            return createResponse({ prompt: db.prompts[idx] });
        }
        return createError("NOT_FOUND");
    }

    // === Legacy / Upsell Rules ===
    async createUpsellRule(rule) {
        await delay();
        db.upsellRules.push(rule);
        return createResponse({ rule });
    }

    async updateUpsellRule(id, rule) {
        await delay();
        const idx = db.upsellRules.findIndex(r => r.id === id);
        if (idx !== -1) db.upsellRules[idx] = rule;
        return createResponse({ rule });
    }

    async deleteUpsellRule(id) {
        await delay();
        db.upsellRules = db.upsellRules.filter(r => r.id !== id);
        return createResponse({ success: true });
    }

    async getUpsellRules() {
        await delay();
        return createResponse({ rules: db.upsellRules });
    }

    // === 5. Gamification Engine (V2) ===
    async getGamificationSettings() {
        await delay();
        return createResponse({
            xpRules: db.gamification.xpRules,
            badges: db.gamification.badges,
            levels: db.gamification.levels
        });
    }

    async updateXpRule(id, updates) {
        await delay();
        const idx = db.gamification.xpRules.findIndex(r => r.ruleId === id);
        if (idx !== -1) {
            db.gamification.xpRules[idx] = { ...db.gamification.xpRules[idx], ...updates };

            this.emitEvent("gamification.rule_updated", { ruleId: id, updates });
            return createResponse({ rule: db.gamification.xpRules[idx] });
        }
        return createError("NOT_FOUND");
    }

    // === 6. Mission Engine (V2) ===
    async getMissionTemplates() {
        await delay();
        return createResponse({ templates: db.missionTemplates });
    }

    async createMissionTemplate(template) {
        await delay();
        const newTemplate = { ...template, templateId: `mt_${Date.now()}`, published: false };
        db.missionTemplates.push(newTemplate);

        this.emitEvent("mission.template_created", { templateId: newTemplate.templateId });
        return createResponse({ template: newTemplate });
    }

    async getQuests() {
        await delay();
        return createResponse({ quests: db.quests });
    }

    // === 8. Content Engine (V2) ===
    async getMaterials() {
        await delay();
        return createResponse({ materials: db.materials });
    }

    async createMaterial(material) {
        await delay();
        const newMaterial = {
            ...material,
            materialId: `mat_${Date.now()}`,
            createdAt: new Date().toISOString(),
            autoGeneratedModule: { moduleId: null, status: 'pending' }
        };
        db.materials.push(newMaterial);

        this.emitEvent("file.uploaded", { materialId: newMaterial.materialId, title: newMaterial.title });

        // Mock async module generation trigger
        setTimeout(() => {
            const modId = `mod_${Date.now()}`;
            db.modules.push({
                moduleId: modId,
                sourceMaterialId: newMaterial.materialId,
                title: `Module: ${newMaterial.title}`,
                summary: "Auto-generated summary from AI analysis...",
                sections: [
                    { sectionId: "s1", title: "Key Concept 1", body: "Mock content extracted from file..." },
                    { sectionId: "s2", title: "Key Concept 2", body: "More mock content..." }
                ],
                createdAt: new Date().toISOString()
            });
            newMaterial.autoGeneratedModule = { moduleId: modId, status: 'completed' };

            // Limit complexity of async firing for now
        }, 2000);

        return createResponse({ material: newMaterial });
    }

    async updateMaterial(materialId, updates) {
        await delay();
        const idx = db.materials.findIndex(m => m.materialId === materialId);
        if (idx !== -1) {
            const currentVersion = db.materials[idx].version || 1;
            db.materials[idx] = {
                ...db.materials[idx],
                ...updates,
                version: currentVersion + 1, // Auto-increment version
                lastUpdated: new Date().toISOString()
            };

            this.emitEvent("content.updated", { materialId, version: db.materials[idx].version });
            return createResponse({ material: db.materials[idx] });
        }
        return createError("NOT_FOUND");
    }

    async getModule(moduleId) {
        await delay();
        const m = db.modules.find(x => x.moduleId === moduleId);
        return m ? createResponse({ module: m }) : createError("NOT_FOUND");
    }

    // === 5. Quiz Engine ===
    async getQuizzes() {
        await delay();
        return createResponse({ quizzes: db.quizzes || [] });
    }

    async getQuiz(quizId) {
        await delay();
        const q = (db.quizzes || []).find(x => x.quizId === quizId);
        return q ? createResponse({ quiz: q }) : createError("NOT_FOUND");
    }

    async createQuiz(quiz) {
        await delay();
        if (!db.quizzes) db.quizzes = [];
        const newQuiz = {
            ...quiz,
            quizId: quiz.quizId || `quiz_${Date.now()}`,
            createdAt: new Date().toISOString(),
            version: 1
        };
        db.quizzes.push(newQuiz);
        saveDb();
        this.emitEvent("quiz.created", { quizId: newQuiz.quizId });
        return createResponse({ quiz: newQuiz });
    }

    async updateQuiz(quizId, updates) {
        await delay();
        const idx = (db.quizzes || []).findIndex(q => q.quizId === quizId);
        if (idx !== -1) {
            db.quizzes[idx] = { ...db.quizzes[idx], ...updates, version: (db.quizzes[idx].version || 1) + 1 };
            saveDb();
            this.emitEvent("quiz.updated", { quizId });
            return createResponse({ quiz: db.quizzes[idx] });
        }
        return createError("NOT_FOUND");
    }

    async deleteQuiz(quizId) {
        await delay();
        const initialLen = (db.quizzes || []).length;
        db.quizzes = (db.quizzes || []).filter(q => q.quizId !== quizId);
        if (db.quizzes.length < initialLen) {
            saveDb();
            this.emitEvent("quiz.deleted", { quizId });
            return createResponse({ success: true });
        }
        return createError("NOT_FOUND");
    }

    async generateQuiz(materialId) {
        await delay(1500); // Simulate AI processing

        // Check if material exists
        const material = (db.materials || []).find(m => m.materialId === materialId);
        if (!material) return createError("NOT_FOUND", "Material not found");

        const quiz = {
            quizId: `quiz_${Date.now()}`,
            materialId,
            title: `Quiz: ${material.title}`,
            questions: [
                {
                    questionId: "q1",
                    type: "mcq",
                    question: `What is the key selling point of ${material.title}?`,
                    options: ["Price", "Performance", "Design", "All of the above"],
                    answer: 3,
                    explanation: "AI analyzed the content and determined these factors."
                }
            ],
            difficulty: 2,
            tags: ["auto", "generated"],
            createdAt: new Date().toISOString(),
            version: 1
        };

        if (!db.quizzes) db.quizzes = [];
        db.quizzes.push(quiz);

        // Update material status
        const matIdx = db.materials.findIndex(m => m.materialId === materialId);
        if (matIdx !== -1) {
            db.materials[matIdx].autoGeneratedModule = { status: 'completed', moduleId: quiz.quizId };
        }

        saveDb();
        this.emitEvent("quiz.generated", { materialId, quizId: quiz.quizId });

        return createResponse({ quiz });
    }


    // === 9. Intelligence Engine (V2) ===
    async getUserPerformance(userId) {
        await delay();
        // Return mock data for a fixed user if not found
        const stats = db.upm[userId] || db.upm["u_01"];
        return createResponse({ performance: stats });
    }

    async getInsights(userId) {
        await delay();
        // Return all insights for now, filtered by user in real app
        return createResponse({ insights: db.insights });
    }

    async generateInsights(userId) {
        await delay(1000); // Simulate AI analysis
        const newInsight = {
            insightId: `ins_${Date.now()}`,
            userId,
            type: "recommendation",
            category: "learning",
            score: 0.8,
            confidence: 0.7,
            message: "Based on recent activity, this user is ready for advanced closing techniques.",
            actions: [{ type: "assign_mission", value: "mt_objection_mastery" }],
            createdAt: new Date().toISOString()
        };
        db.insights.unshift(newInsight); // Add to top

        this.emitEvent("insight.generated", { userId, type: newInsight.type });
        return createResponse({ insights: [newInsight] });
    }

    async getUserGamificationState(userId) {
        await delay();
        const state = db.userGamification[userId] || db.userGamification["u_01"];
        return createResponse({ state });
    }

    async runSimulation(params) {
        await delay(500);

        // --- MOCK PIPELINE: Simulate Session Log & UPM Update ---
        const userId = "u_01";
        const currentStats = db.upm[userId];
        const gameState = db.userGamification[userId]; // Get Gamification State

        if (currentStats) {
            // 1. Simulate new session log
            currentStats.scenario.totalSessions += 1;

            // 2. Simulate random performance fluctuation
            const drift = (Math.random() - 0.5) * 0.1;
            currentStats.scenario.behaviorScore = Math.max(0, Math.min(1, currentStats.scenario.behaviorScore + drift));

            // 3. Simulate specific skill improvement
            if (params.productContext && params.productContext.type === 'TV') {
                currentStats.skill.product_knowledge = Math.min(1.0, currentStats.skill.product_knowledge + 0.05);
            }

            // 4. Upsell simulation
            const isUpsell = Math.random() > 0.7;
            if (isUpsell) {
                const n = currentStats.scenario.totalSessions;
                const oldRate = currentStats.scenario.upsellSuccessRate;
                currentStats.scenario.upsellSuccessRate = ((oldRate * (n - 1)) + 1) / n;
            } else {
                const n = currentStats.scenario.totalSessions;
                const oldRate = currentStats.scenario.upsellSuccessRate;
                currentStats.scenario.upsellSuccessRate = ((oldRate * (n - 1)) + 0) / n;
            }

            // Save back to DB (Mock Commit)
            db.upm[userId] = { ...currentStats };
        }

        // --- 5. GAMIFICATION SYNC (Refinement #2) ---
        // Award XP for completing simulation
        if (gameState) {
            gameState.currentXp += 50; // Award 50 XP
            if (gameState.currentXp >= gameState.nextLevelXp) {
                gameState.level += 1;
                gameState.nextLevelXp += 1000;
                this.emitEvent("user.levelup", { userId, newLevel: gameState.level });
            }
            db.userGamification[userId] = { ...gameState };
        }

        this.emitEvent("session.completed", {
            userId,
            xpAwarded: 50,
            behaviorScore: currentStats?.scenario.behaviorScore
        });

        return createResponse({
            turns: [{
                turnIndex: 1,
                speaker: "customer",
                utterance: `(Simulated V2) Hello. I am interested in ${params.productContext?.type || 'this product'}. [MOCK: UPM Stats & XP Updated]`,
                firedRules: [],
                stageId: params.initialStageId
            }]
        });
    }

    // === 8. User Management ===
    async getUsers() {
        await delay();
        return createResponse({ users: db.users || [] });
    }

    async createUser(user) {
        await delay();
        if (!db.users) db.users = [];
        const newUser = {
            ...user,
            id: `u_${Date.now()}`,
            joined: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        db.users.push(newUser);
        saveDb();
        this.emitEvent("user.created", { userId: newUser.id });
        return createResponse({ user: newUser });
    }

    async updateUser(userId, updates) {
        await delay();
        const idx = (db.users || []).findIndex(u => u.id === userId);
        if (idx !== -1) {
            db.users[idx] = { ...db.users[idx], ...updates };
            saveDb();
            this.emitEvent("user.updated", { userId });
            return createResponse({ user: db.users[idx] });
        }
        return createError("NOT_FOUND");
    }

    async deleteUser(userId) {
        await delay();
        const initialLen = (db.users || []).length;
        db.users = (db.users || []).filter(u => u.id !== userId);
        if (db.users.length < initialLen) {
            saveDb();
            this.emitEvent("user.deleted", { userId });
            return createResponse({ success: true });
        }
        return createError("NOT_FOUND");
    }


    // === 10. Dashboard Engine ===
    async getDashboardWidgets() {
        await delay();
        // Initialize if empty
        if (!db.dashboardWidgets) {
            db.dashboardWidgets = [
                { id: 'w_active_users', type: 'kpi', title: 'Active Learners', endpoint: 'stats.activeUsers', size: 'small', order: 1, visible: true },
                { id: 'w_sessions', type: 'kpi', title: 'SalesLab Sessions', endpoint: 'stats.sessions', size: 'small', order: 2, visible: true },
                { id: 'w_pass_rate', type: 'kpi', title: 'Quiz Pass Rate', endpoint: 'stats.passRate', size: 'small', order: 3, visible: true },
                { id: 'w_completion', type: 'kpi', title: 'Module Completion', endpoint: 'stats.completionRate', size: 'small', order: 4, visible: true },
                { id: 'w_daily_activity', type: 'chart', title: 'Weekly Engagement Trends', endpoint: 'stats.activityData', size: 'large', order: 5, visible: true },
                { id: 'w_module_dropoff', type: 'chart', title: 'Module Completion vs. Drop-off', endpoint: 'stats.moduleDropoff', size: 'medium', order: 6, visible: true },
            ];
            saveDb();
        }
        return createResponse({ widgets: db.dashboardWidgets });
    }

    async updateDashboardWidgets(widgets) {
        await delay();
        db.dashboardWidgets = widgets;
        saveDb();
        return createResponse({ widgets: db.dashboardWidgets });
    }

    async getWidgetData(endpoint, filter) {
        await delay(); // Simulate network
        // Mock Data Generation based on endpoint
        const scopeMultiplier = filter?.scope === 'GLOBAL' ? 1 : filter?.scope === 'REGION' ? 0.3 : 0.1;

        switch (endpoint) {
            case 'stats.activeUsers': return createResponse({ value: Math.floor(1245 * scopeMultiplier), trend: "+12%" });
            case 'stats.sessions': return createResponse({ value: Math.floor(856 * scopeMultiplier), trend: "+24%" });
            case 'stats.passRate': return createResponse({ value: 78 + (filter?.scope === 'BRANCH' ? 5 : 0), trend: "-2.1%" });
            case 'stats.completionRate': return createResponse({ value: 64, trend: "+5%" });
            case 'stats.activityData':
                return createResponse({
                    data: [
                        { name: 'Mon', users: 400, sessions: 240, completions: 180 },
                        { name: 'Tue', users: 300, sessions: 139, completions: 220 },
                        { name: 'Wed', users: 200, sessions: 980, completions: 340 },
                        { name: 'Thu', users: 278, sessions: 390, completions: 290 },
                        { name: 'Fri', users: 189, sessions: 480, completions: 420 },
                        { name: 'Sat', users: 239, sessions: 380, completions: 200 },
                        { name: 'Sun', users: 349, sessions: 430, completions: 150 },
                    ].map(d => ({ ...d, sessions: Math.floor(d.sessions * scopeMultiplier) }))
                });
            case 'stats.moduleDropoff':
                return createResponse({
                    data: [
                        { name: 'Intro', users: 400, completions: 380 },
                        { name: 'Product', users: 380, completions: 300 },
                        { name: 'Sales', users: 300, completions: 220 },
                        { name: 'Objection', users: 220, completions: 150 },
                        { name: 'Closing', users: 150, completions: 120 },
                    ].map(d => ({ ...d, users: Math.floor(d.users * scopeMultiplier) }))
                });
            default: return createError("NOT_FOUND", "Widget endpoint not found");
        }
    }

} // End Class

// Singleton Instance
const apiInstance = new OperatorApiClient();

// --- Backward Compatibility Wrapper ---
export const operatorApi = {
    instance: apiInstance,

    // User Management
    getUsers: () => apiInstance.getUsers(),
    createUser: (u) => apiInstance.createUser(u),
    updateUser: (id, u) => apiInstance.updateUser(id, u),
    deleteUser: (id) => apiInstance.deleteUser(id),

    // Product Catalog
    getProductCatalog: () => apiInstance.getProductCatalog(),
    updateProductCatalog: (c) => apiInstance.updateProductCatalog(c),

    // Customer / Traits
    getTraits: () => apiInstance.getTraits(),
    updateTraits: (t) => apiInstance.updateTraits(t),
    getTraitLinkages: () => apiInstance.getTraitLinkages(),
    getPersonas: (r) => apiInstance.getPersonas(r),
    getPersona: (id) => apiInstance.getPersona(id),
    createPersona: (p) => apiInstance.createPersona(p),
    updatePersona: (id, p) => apiInstance.updatePersona(id, p),
    deletePersona: (id) => apiInstance.deletePersona(id),

    // Difficulties & Stages
    getDifficulties: () => apiInstance.getDifficulties(),
    updateDifficulties: (l) => apiInstance.updateDifficulties(l),
    getStages: () => apiInstance.getStages(),
    updateStages: (s) => apiInstance.updateStages(s),

    // Scenarios & Prompts
    getScenarios: () => apiInstance.getScenarios(),
    getScenario: (id) => apiInstance.getScenario(id),
    createScenario: (s) => apiInstance.createScenario(s),
    updateScenario: (id, u) => apiInstance.updateScenario(id, u),
    deleteScenario: (id) => apiInstance.deleteScenario(id),
    getPrompts: () => apiInstance.getPrompts(),
    resolvePrompt: (ctx) => apiInstance.resolvePrompt(ctx),
    updatePrompt: (id, c) => apiInstance.updatePrompt(id, c),

    // Upsell Rules
    getUpsellRules: async () => {
        const res = await apiInstance.getUpsellRules();
        return res.data ? res.data.rules : [];
    },
    createUpsellRule: (r) => apiInstance.createUpsellRule(r),
    updateUpsellRule: (id, r) => apiInstance.updateUpsellRule(id, r),
    deleteUpsellRule: (id) => apiInstance.deleteUpsellRule(id),

    // Gamification
    getGamificationSettings: () => apiInstance.getGamificationSettings(),
    getUserGamificationState: (uid) => apiInstance.getUserGamificationState(uid),
    updateXpRule: (id, u) => apiInstance.updateXpRule(id, u),
    getMissionTemplates: () => apiInstance.getMissionTemplates(),
    createMissionTemplate: (t) => apiInstance.createMissionTemplate(t),
    getQuests: () => apiInstance.getQuests(),

    // Content
    getMaterials: () => apiInstance.getMaterials(),
    createMaterial: (m) => apiInstance.createMaterial(m),
    updateMaterial: (id, u) => apiInstance.updateMaterial(id, u),
    getModule: (id) => apiInstance.getModule(id),

    // Quiz (V2)
    getQuizzes: () => apiInstance.getQuizzes(),
    getQuiz: (id) => apiInstance.getQuiz(id),
    createQuiz: (q) => apiInstance.createQuiz(q),
    updateQuiz: (id, u) => apiInstance.updateQuiz(id, u),
    deleteQuiz: (id) => apiInstance.deleteQuiz(id),
    generateQuiz: (mid) => apiInstance.generateQuiz(mid),

    // Intelligence
    getUserPerformance: (uid) => apiInstance.getUserPerformance(uid),
    getInsights: (uid) => apiInstance.getInsights(uid),
    generateInsights: (uid) => apiInstance.generateInsights(uid),
    runSimulation: (params) => apiInstance.runSimulation(params),

    // Dashboard
    getDashboardWidgets: () => apiInstance.getDashboardWidgets(),
    updateDashboardWidgets: (w) => apiInstance.updateDashboardWidgets(w),
    getWidgetData: (ep, f) => apiInstance.getWidgetData(ep, f)
};
