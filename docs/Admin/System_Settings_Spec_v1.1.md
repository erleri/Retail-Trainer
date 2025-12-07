# **System Settings Spec v1.1 — Full Rewrite (Format D: Enterprise + AG-Friendly)**  
Status: FINAL • Author: GPT (for 주인님) • Scope: Admin Console / Core Engine / DX / AG Integration

---

# **0. Executive Summary**

This document defines the **complete, authoritative specification** for *System Settings* in Retail AI Trainer v1.1.  
It unifies enterprise-grade technical requirements with AG-friendly directives to ensure:

- deterministic behavior across engines  
- immediate and predictable runtime reload (Immediate Hot Reload Model)  
- strict prompt override rules  
- feature toggle risk management  
- stable integration with authentication, security, and external systems  
- complete clarity for DX팀 & AntiGravity 엔진  

System Settings controls *all* runtime behavior of the platform.  
Improper handling → inconsistent simulations, incorrect analytics, prompt drift, or permission leaks.

This v1.1 rewrite standardizes all rules, schemas, and runtime semantics.

---

# **1. High-Level Architecture**

```
System Settings (entire config object)
      │
      ▼   (Immediate Hot Reload)
Core Engine Reload Controller
      │
      ├── SalesLab Engine
      ├── Content Engine (Module/Quiz)
      ├── Upsell Engine
      ├── Persona/Trait/Difficulty Engine
      ├── Gamification Engine
      ├── Insights Engine
      ├── Logging & Analytics Engine
      └── Authentication/Security Layer
```

Each engine must reload settings **on every successful save**, without blocking active sessions.

**Session Rule:**  
> “Existing sessions retain old config; new sessions use newest config version.”

---

# **2. Requirements (Enterprise Style)**

## **2.1 Functional Requirements (FR)**

### **FR-01 — Global Config Management**
System Settings SHALL provide a single unified configuration object accessible across all engines.

### **FR-02 — Immediate Hot Reload**
All engines SHALL reload their respective configuration modules immediately after settings are saved.

### **FR-03 — Versioning**
Every modification SHALL generate a new immutable version entry.

### **FR-04 — Prompt Override Hierarchy**
AG MUST apply overrides strictly in this order:
1. **Function-specific Override**  
2. **Category Override**  
3. **Global System Prompt**

### **FR-05 — Feature Toggle Enforcement**
Feature Toggles SHALL apply across:
- UI visibility  
- API allow/deny  
- AG engine mode switching  

Feature Toggles SHALL include risk levels (High/Med/Low).

### **FR-06 — Secure Storage of Secrets**
All sensitive values (API keys, SSO secrets, SMTP credentials) SHALL be encrypted.

### **FR-07 — SSO + Password Coexistence (optional fallback)**
If SSO fails and `allowPasswordFallback=true`, password login SHALL activate.

### **FR-08 — Locale & Format Enforcement**
Language/Tone/DateFormat SHALL propagate to User UI and Generative Models.

---

## **2.2 Non-Functional Requirements (NFR)**

- Settings save operation SHALL complete under 150ms.
- Engine reload MUST be non-blocking.
- Config delivery MUST be atomic.

---

# **3. AG Directives (Machine-Readable, Must Follow)**

AG MUST follow all rules below.

### **AG-01 — Never rewrite or infer missing configuration values.**  
AG MUST NOT “guess” defaults.

### **AG-02 — On config save, AG MUST:**
1. Clear cache  
2. Reload only affected engine modules  
3. Log version  
4. Apply new settings for next request

### **AG-03 — Apply prompt hierarchy EXACTLY:**
```
functionOverride > categoryOverride > globalPrompt
```

### **AG-04 — Feature Toggles MUST disable engine routes.**

If `teamMissions=false` → engine MUST NOT accept mission-related requests.

### **AG-05 — All analytics events MUST include:**
```
scope {
  regionId: ...
  countryId: ...
  branchId: ...
  teamId: ...
}
version: {
  moduleVersion: ...
  scenarioVersion: ...
  promptVersion: ...
}
```

---

# **4. JSON Schema (Final v1.1)**

```json
{
  "version": "2025.01.01-002",
  "updatedAt": "2025-12-08T00:00:00Z",
  "updatedBy": "admin@example.com",

  "aiModel": {
    "provider": "openai",
    "modelName": "gpt-5.1",
    "temperature": 0.4,
    "maxTokens": 3000,
    "topP": 1.0,

    "defaultSystemPrompt": "...",
    "salesLabOverride": null,
    "contentTransformOverride": null,
    "quizGenerationOverride": null,

    "promptVersions": []
  },

  "languageTone": {
    "defaultLanguage": "en",
    "supportedLanguages": ["en","ko","es","pt"],
    "autoDetect": true,
    "tonePreset": "tutor",
    "customToneRule": null,
    "dateFormat": "YYYY-MM-DD",
    "timeFormat": "24h"
  },

  "authentication": {
    "enableSSO": true,
    "allowPasswordFallback": false,

    "provider": "okta",
    "metadataUrl": "",
    "clientId": "",
    "clientSecret": "",

    "passwordPolicy": {
      "minLength": 8,
      "requireNumber": true,
      "requireSymbol": true,
      "rotationDays": 90
    },

    "sessionTimeoutMinutes": 30,
    "forceLogoutOnRoleChange": true,
    "mfaRequired": false
  },

  "integrations": {
    "whatsapp": {
      "enabled": true,
      "apiKey": "",
      "phoneNumber": "",
      "webhookUrl": "",
      "enableVoice": true,
      "enableFlows": true,
      "flowTimeoutSeconds": 30
    },
    "lms": { "endpointUrl": "" },
    "slack": { "webhookUrl": null },
    "email": {
      "smtpHost": "",
      "port": 587,
      "username": "",
      "password": ""
    },
    "eventSubscriptions": {
      "quizCompleted": true,
      "modulePublished": true,
      "saleslabSessionCreated": false
    }
  },

  "featureToggles": {
    "saleslabAdvancedMode": { "enabled": true, "risk": "medium" },
    "aiInsightsDashboard": { "enabled": true, "risk": "low" },
    "gamificationXpV2": { "enabled": false, "risk": "medium" },
    "contentAutoTransform": { "enabled": true, "risk": "high" },
    "microQuiz": { "enabled": true, "risk": "low" },
    "teamMissions": { "enabled": false, "risk": "high" }
  },

  "securityPolicy": {
    "ipAllowlist": ["192.168.0.0/24"],
    "loggingLevel": "info",
    "dataRetentionDays": {
      "eventLogs": 180,
      "moduleVersions": "unlimited"
    },
    "userDeletePolicy": "soft_delete",
    "maxConcurrentSessions": 3
  }
}
```

---

# **5. Priority / Override Rules**

## **5.1 Prompt Override Priority Table**

| Level | Source | AG Behavior |
|------|--------|-------------|
| 1 | Function Override | MUST use |
| 2 | Category Override | Use if level 1 null |
| 3 | Default System Prompt | Fallback |
| 4 | Engine fallback | NEVER allowed |

---

# **6. Runtime Reload Semantics (Immediate Hot Reload)**

### **R-01 — On Successful Save**
```
invalidate_cache()
reload(aiModel)
reload(languageTone)
reload(authentication)
reload(integrations)
reload(featureToggles)
reload(securityPolicy)
```

### **R-02 — No session interruption**
Session maintains previous config snapshot.

### **R-03 — Logging**
Every save MUST log:
```
{
  "event": "config_reload",
  "version": "...",
  "changedKeys": [...],
  "triggeredAt": "...",
  "actor": "...",
  "reloadMode": "hot"
}
```

### **R-04 — AG MUST differentiate between:**
- “Config applied at turn start”
- “Config applied mid-session (ignored until next turn)”

---

# **7. Dependency Matrix**

| Category | Impacted Engines |
|----------|------------------|
| aiModel | SalesLab, Content, Quiz, Insights |
| languageTone | Content UI, AG generation |
| authentication | Login/Session engine |
| integrations | event dispatcher, webhooks |
| featureToggles | UI + engines enabling/disabling |
| securityPolicy | gateways/firewalls/auth enforcement |

---

# **8. Versioning & Rollback**

```
rollback(versionId):
    newVersion = copy(config[versionId])
    save(newVersion)
    apply_immediately()
```

Rollback MUST NOT overwrite history.

---

# **9. Error / Fallback Rules**

- Invalid SSO metadata → save blocked  
- WhatsApp unreachable → save allowed but warns  
- contentAutoTransform risk=high → confirmation modal required  
- SMTP failure → save allowed but send-test required before use  

---

# **10. Appendix — AG Must-Not Deviate Examples**

### Example: NEVER do
- Auto-fill missing prompt values  
- Guess default temperature  
- Apply mixed version settings  
- Apply config mid-turn in SalesLab  

### Example: ALWAYS do
- Respect override order  
- Log each reload  
- Keep session-config constant  

---

# **END OF DOCUMENT — System Settings Spec v1.1**
