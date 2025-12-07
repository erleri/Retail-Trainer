/**
 * StorageAdapter
 * Persists the in-memory mock DB to LocalStorage so changes survive refreshes.
 */

const STORAGE_KEY = "AG_RETAIL_TRAINER_DB_V1";

export const StorageAdapter = {
    save: (dbState) => {
        try {
            const serialized = JSON.stringify(dbState);
            localStorage.setItem(STORAGE_KEY, serialized);
            // console.log("[StorageAdapter] Saved DB state.");
        } catch (e) {
            console.error("[StorageAdapter] Save failed", e);
        }
    },

    load: (initialState) => {
        try {
            const serialized = localStorage.getItem(STORAGE_KEY);
            if (!serialized) {
                console.log("[StorageAdapter] No saved DB found. Using Initial Mock Data.");
                return initialState;
            }
            const saved = JSON.parse(serialized);
            // Deep merge logic could go here, but for now effective replacement
            console.log("[StorageAdapter] Loaded DB from LocalStorage.");
            return { ...initialState, ...saved };
        } catch (e) {
            console.error("[StorageAdapter] Load failed", e);
            return initialState;
        }
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
};
