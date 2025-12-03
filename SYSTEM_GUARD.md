# AntiGravity System Guard

## 🛡️ Core Rules
1.  **Layer 1 (System Core)** is **NEVER** to be modified or deleted without explicit, high-level authorization.
2.  **Layer 2 (Modules)** changes must be confined to the **internal implementation** of the module. The structure (interface, props, exports) must remain intact.
3.  **Layer 3 (Features)** can be modified freely, but existing structures should not be damaged.
4.  **Request Handling Protocol**:
    -   **Classify**: Determine if the request targets Layer 1, 2, or 3.
    -   **Layer 1**: REJECT the change and explain why.
    -   **Layer 2**: ADJUST only within the internal scope.
    -   **Layer 3**: EXECUTE freely while preserving structural integrity.
5.  **Preservation**: Do NOT delete existing elements.
6.  **No Over-Simplification**: Do NOT attempt to merge or simplify functions unless explicitly requested.
7.  **Diff Requirement**: ALWAYS provide a Diff comparison against the previous version.
8.  **Isolation**: Only change what is requested; leave the rest exactly as it is.

## 🏗️ Layer Definitions

### 🔒 Layer 1: System Core (Immutable / High Risk)
*Modifications here require explicit user approval and extreme caution.*
-   **Configuration**: `vite.config.js`, `tailwind.config.js`, `package.json`, `postcss.config.js`, `.env`
-   **Entry & Routing**: `src/main.jsx`, `src/App.jsx`
-   **Core Libraries**: `src/lib/` (Authentication, Database, Core Utilities)

### 🛡️ Layer 2: Modules & Components (Interface Locked / Internal Open)
*Internal logic and styles can change; external interfaces (props, exports) must stay fixed.*
-   **UI Components**: `src/components/ui/`
-   **Layouts**: `src/components/layout/`
-   **Global Constants**: `src/constants/`

### ✨ Layer 3: Features & Pages (Flexible)
*Business logic and feature-specific code.*
-   **Pages**: `src/pages/`
-   **Feature Components**: `src/components/sales-lab/`, `src/components/admin/`, etc.
