/**
 * User Management Service v2.1 (Mock Implementation)
 * Adheres to User_Management_Integrated_Spec_v2.1.md
 * 
 * Responsibilities:
 * - Handle Login/Logout (Mock)
 * - Manage User Session (Role, Scope, Version context)
 * - Provide Access Control helpers
 */

// Mock User Database
const MOCK_USERS = [
    {
        id: "admin_001",
        email: "admin@retail.com",
        name: "Admin User",
        role: "ADMIN",
        scope: { regionId: "GLOBAL", countryId: null, branchId: null, teamId: null }
    },
    {
        id: "op_br_01",
        email: "operator_br@retail.com",
        name: "Brazil Operator",
        role: "OPERATOR",
        scope: { regionId: "LATAM", countryId: "BR", branchId: null, teamId: null }
    },
    {
        id: "trainer_kr_01",
        email: "trainer_kr@retail.com",
        name: "Korea Trainer",
        role: "TRAINER",
        scope: { regionId: "APAC", countryId: "KR", branchId: "BR_SEOUL_01", teamId: "TEAM_A" }
    }
];

class UserManagementService {
    constructor() {
        this.currentUser = null;
        this.sessionToken = null;
        // Auto-login as Admin for Dev convenience
        this.login("admin@retail.com");
    }

    // --- Auth Actions ---

    async login(email) {
        const user = MOCK_USERS.find(u => u.email === email);
        if (user) {
            this.currentUser = user;
            this.sessionToken = `mock_token_${Date.now()}`;
            console.log(`[UserManagement] Logged in as ${user.name} (${user.role})`);
            return { success: true, user };
        }
        return { success: false, error: "User not found" };
    }

    async logout() {
        this.currentUser = null;
        this.sessionToken = null;
        return { success: true };
    }

    // --- Session Accessors ---

    getUser() {
        return this.currentUser;
    }

    /**
     * Returns standard Scope Context for APIs
     */
    getScopeContext() {
        if (!this.currentUser) return null;
        return this.currentUser.scope;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    hasRole(requiredRole) {
        if (!this.currentUser) return false;
        // Simple hierarchy: ADMIN > OPERATOR > TRAINER > LEARNER
        const ROLES = ["LEARNER", "TRAINER", "OPERATOR", "ADMIN"];
        const userLevel = ROLES.indexOf(this.currentUser.role);
        const reqLevel = ROLES.indexOf(requiredRole);
        return userLevel >= reqLevel;
    }
}

// Singleton
export const userManagement = new UserManagementService();
