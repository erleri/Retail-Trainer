# **User Management Integrated Spec v2.1 — Full Rewrite (Format D: Enterprise + AG-Friendly)**  
Status: FINAL • Scope: User / Role / Permission / Scope / Session / Bulk Import  
Aligned with: **System Settings Spec v1.1**

---

# **0. Executive Summary**

This document defines the full specification for **User Management** in Retail AI Trainer v2.1.  
It unifies enterprise-grade RBAC/ABAC principles with AntiGravity-compatible deterministic rules to guarantee:

- Consistent global access control across Region → Country → Branch → Team  
- Strict and predictable propagation of Role & Scope to all engines  
- Guaranteed non-ambiguous behavior for SalesLab, Content, Gamification, Insights, and Analytics  
- Secure user lifecycle, session enforcement, and mixed-mode authentication  
- Safe and scalable bulk import pipeline  

This is the authoritative reference for DX팀 and AntiGravity 엔진.

---

# **1. High-Level Architecture Overview**

```
User Management System
│
├── User Directory
├── Role Model (RBAC)
├── Permission Matrix
├── Scope Model (ABAC)
├── Authentication & Session Layer
└── Bulk Import / Export
```

User/Role/Scope directly determine actions across:

- SalesLab Engine  
- Content Engine  
- Gamification Engine  
- Insights Engine  
- Analytics Engine  
- Admin Console  

---

# **2. Functional Requirements (FR)**

### **FR-01 — Unified User Directory**
All users SHALL be stored in a common global directory.

### **FR-02 — Role-Based Access Control**
Roles SHALL determine *what* actions the user can perform.

### **FR-03 — Attribute-Based Access Control via Scope**
Scope SHALL determine *where* the user can operate:

```
Global → Region → Country → Branch → Team
```

### **FR-04 — Mixed Authentication**
Both SSO and password-based authentication SHALL be supported.

### **FR-05 — Session Enforcement**
- Role change SHALL force logout  
- MFA SHALL enforce session upgrade  

### **FR-06 — Bulk Import**
Large-scale CSV/XLSX import SHALL be supported with validation rules.

### **FR-07 — Scope Propagation**
All engines MUST automatically enforce scope limitations.

---

# **3. User Lifecycle**

```
Invite → Onboarding → Activation → Session → Role Change → Deactivate → Soft Delete
```

### Invite States
```
invited → pending_activation → active
```

---

# **4. Role Model v2.1**

| Role | Description |
|------|-------------|
| Admin | Full system configuration, analytics, user management |
| Operator | Content/SalesLab operations |
| Trainer | Manages learners, reviews SalesLab sessions |
| Learner | Accesses training modules & quizzes |

---

# **5. Permission Matrix v2.1**

| Feature | Admin | Operator | Trainer | Learner |
|---------|--------|----------|---------|---------|
| User Management | ✓ | ✗ | ✗ | ✗ |
| Content Management | ✓ | ✓ | ✗ | ✗ |
| SalesLab Management | ✓ | ✓ | ✓ | ✗ |
| Analytics Access | ✓ | ✓ | limited | self-only |
| Gamification Admin | ✓ | ✗ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ | ✗ |

---

# **6. Scope Model v2.1**

Scope hierarchy:

```
Global
  └─ Region
       └─ Country
            └─ Branch
                 └─ Team
```

---

# **6.1 Scope Enforcement Rules**

### **S-01 — Admin**
Ignores all scope limitations (full access).

### **S-02 — Operator**
Bound to Region/Country based on assignment.

### **S-03 — Trainer**
Bound to Branch/Team.

### **S-04 — Learner**
Bound to personal data only.

---

# **7. Engine-Level Scope Mapping**

| Engine | Rule |
|--------|------|
| SalesLab | Scenarios & session logs filtered by region/country. |
| Content Engine | Modules/Quizzes filtered to learner’s country/branch. |
| Gamification | Leaderboards computed per region/country/branch/team. |
| Analytics | ALL metrics filtered to requesting user's scope. |
| Insights | Only insights matching user's scope returned. |
| Logging | Every log event MUST include scope & version. |

---

# **8. Bulk Import Specification v2.1**

### Required Columns
```
email, name, role, regionId, countryId, branchId, teamId
```

### Auto-Mapping Rules
If `branchId` missing:
```
branchId = default_branch(countryId)
```

If `teamId` missing:
```
teamId = default_team(branchId)
```

### Conflict Resolution
- Invalid region/country → reject  
- Invalid branch/team → reject (no auto-create allowed)  
- Duplicate email → update or skip (configurable)

---

# **9. Session Management**

### **SESS-01 — forceLogoutOnRoleChange = true**
Session MUST invalidate immediately.

### **SESS-02 — MFA upgrade**
Required whenever privileged action attempted.

### **SESS-03 — Session Context Payload**
All API requests MUST include:

```
userId
role
scope
version {
  moduleVersion
  scenarioVersion
  promptVersion
}
```

---

# **10. AG Directives**

AG MUST:

### **AG-UM-01** Enforce scope filtering on **all GET APIs**  
### **AG-UM-02** NEVER return data outside scope  
### **AG-UM-03** Use strict equality for scope comparisons  
### **AG-UM-04** NOT create branches/teams automatically  
### **AG-UM-05** Log every action with full scope + version context  
### **AG-UM-06** Evaluate role & scope BEFORE running any engine logic  

---

# **11. API Specification (v2.1)**

### **GET /admin/users**
Filters:
```
role, regionId, countryId, branchId, teamId
```

### **POST /admin/users/bulk-import**
Payload: file  
Options:
```
updateExisting: boolean
skipInvalid: boolean
```

### **PATCH /admin/user/:id**
Role or scope change triggers:
```
session.invalidate(userId)
```

---

# **12. Error Handling**

| Code | Meaning |
|------|---------|
| E_SCOPE_VIOLATION | User attempted out-of-scope action |
| E_ROLE_INVALID | Invalid role assignment |
| E_IMPORT_MISSING_COLUMN | Bulk import missing required columns |
| E_SSO_MAPPING_FAIL | SSO identity not matched |

---

# **13. Dependency Map**

```
User Mgmt
   ↓
Role + Scope
   ↓
Engine Filtering (SalesLab/Content/Gamification)
   ↓
Analytics & Dashboard
```

---

# **14. END OF DOCUMENT — User Management Integrated Spec v2.1**
