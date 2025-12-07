/**
 * System Settings Service v2 (Mock Implementation)
 * Adheres to System_Settings_Spec_v1.1.md
 * 
 * Responsibilities:
 * - Maintain global configuration (AI Model, Auth, Feature Toggles)
 * - Implement "Immediate Hot Reload" pattern
 * - Enforce Versioning on updates
 */

// Initial Default Configuration (Factory Reset State)
const DEFAULT_CONFIG = {
    version: "v2.0.0-default",
    updatedAt: new Date().toISOString(),
    aiModel: {
        provider: "openai", // or 'gemini'
        modelName: "gpt-4o",
        temperature: 0.7,
        maxTokens: 2048,
        tonePreset: "standard"
    },
    authentication: {
        enableSSO: false, // Mock
        allowPasswordFallback: true
    },
    featureToggles: {
        salesLabAdvancedMode: { enabled: true, risk: "medium" },
        gamification: { enabled: true, risk: "low" },
        insightsEngine: { enabled: true, risk: "low" },
        teamMissions: { enabled: false, risk: "high" } // Disabled by default
    },
    securityPolicy: {
        maxConcurrentSessions: 3,
        dataRetentionDays: 90
    }
};

class SystemSettingsService {
    constructor() {
        // In a real app, load from DB/LocalStorage. Here, memory.
        this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        this.listeners = [];
    }

    // --- Accessors ---

    getConfig() {
        return { ...this.config }; // Return copy to prevent mutation
    }

    getAiConfig() {
        return { ...this.config.aiModel };
    }

    getFeatureStatus(featureKey) {
        const feature = this.config.featureToggles[featureKey];
        return feature ? feature.enabled : false;
    }

    // --- Mutators (The "Hot Reload" Logic) ---

    /**
     * Updates partial settings and triggers Hot Reload
     * @param {Object} partialConfig - e.g. { aiModel: { temperature: 0.9 } }
     */
    async updateSettings(partialConfig) {
        // 1. Version Bump
        const oldVersion = this.config.version;
        const newVersion = `v2.${Date.now()}`;

        // 2. Merge Config (Deep mock merge)
        // Note: Real implementation needs deep merge util like lodash.merge
        // Here we do simple top-level merge for demo
        this.config = {
            ...this.config,
            ...partialConfig,
            version: newVersion,
            updatedAt: new Date().toISOString()
        };

        // 3. Log Event (Audit)
        console.log(`[SystemSettings] Hot Reload Triggered: ${oldVersion} -> ${newVersion}`);
        console.log(`[SystemSettings] Changes:`, partialConfig);

        // 4. Notify Listeners (The "Reload" part)
        this._notifyListeners();

        return { success: true, version: newVersion };
    }

    /**
     * Subscribe to configuration changes
     * Engines (SalesLab, etc.) will call this to react to changes.
     */
    onReload(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    _notifyListeners() {
        this.listeners.forEach(cb => {
            try {
                cb(this.config);
            } catch (e) {
                console.error("[SystemSettings] Listener Error:", e);
            }
        });
    }
}

// Singleton Export
export const systemSettings = new SystemSettingsService();
