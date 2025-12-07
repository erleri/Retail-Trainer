# **DB Schema & Analytics Engine Spec v1.1 — Full Rewrite (Format D: Enterprise + AG-Friendly)**  
Status: FINAL • Authoritative Data Layer Specification  
Aligned With:  
- System Settings Spec v1.1  
- User Management Integrated Spec v2.1  
- (Upcoming) Admin Dashboard v1.2, Insights Engine v1.1, Gamification Engine v1.2  

---

# **0. Executive Summary**

This document defines the **entire data architecture** for Retail AI Trainer v1.1, including:

- Version-aware logging  
- Scope-aware aggregation  
- Deterministic schemas for AG engines  
- KPI standardization  
- Insights Engine input layer  
- Snapshot and aggregation strategies  

This is the authoritative reference for DX팀 and AntiGravity 엔진.  
AG MUST strictly follow all schema and version/scope rules.

---

# **1. High-Level Architecture Overview**

```
Event Log Layer (raw events)
   ↓
Interaction Log (structured user actions)
   ↓
Session Log (per-session summary)
   ↓
Snapshot Tables (daily/hourly)
   ↓
Aggregation Tables (region/country/branch/team)
   ↓
Dashboard API + Insights Engine
```

This layered architecture ensures:

- append-only raw logs  
- reproducible KPIs  
- stable analytics under version changes  
- no ambiguity for AG or DX implementation  

---

# **2. Core Principles (Mandatory Requirements)**

## **P-01 — Version-Aware Everything**
ALL logs MUST include:

```
moduleVersion
scenarioVersion
promptVersion
```

## **P-02 — Scope-Aware Everything**
ALL logs MUST include:

```
regionId
countryId
branchId
teamId
```

## **P-03 — Append-Only Data Model**
Raw logs SHALL never be updated or deleted.

## **P-04 — Deterministic Schemas**
AG MUST NOT infer or generate new schema fields.

## **P-05 — Aggregation MUST NOT read raw logs directly**
Snapshot tables MUST be used for performance and correctness.

---

# **3. Mandatory Schemas (Final v1.1)**

---

# **3.1 event_log**

Atomic user actions.

```json
{
  "eventId": "uuid",
  "timestamp": "ISO8601",
  "userId": "string",

  "eventType": "login | module_start | module_complete | quiz_answer | saleslab_turn | reward_claim | ...",

  "context": {
    "moduleId": "string|null",
    "quizId": "string|null",
    "scenarioId": "string|null",
    "turnIndex": "number|null",
    "action": "string|null"
  },

  "version": {
    "moduleVersion": "string|null",
    "scenarioVersion": "string|null",
    "promptVersion": "string|null"
  },

  "scope": {
    "regionId": "string",
    "countryId": "string",
    "branchId": "string",
    "teamId": "string"
  }
}
```

---

# **3.2 interaction_log**

Detailed interactions within SalesLab / Modules / Quizzes.

```json
{
  "interactionId": "uuid",
  "sessionId": "uuid",
  "timestamp": "...",
  "userId": "...",
  "engine": "saleslab | module | quiz",

  "input": "string",
  "output": "string|null",

  "metadata": {
    "difficultyLevel": "number|null",
    "personaId": "string|null",
    "traitActivation": ["string"],
    "upsellTriggered": "boolean"
  },

  "version": {...},
  "scope": {...}
}
```

---

# **3.3 session_log**

Session summary.

```json
{
  "sessionId": "uuid",
  "userId": "string",
  "engine": "saleslab | learning | quiz",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "durationSec": "number",

  "outcome": "success | fail | partial | null",

  "summary": {
    "turnCount": "number",
    "correctAnswers": "number|null",
    "upsellAttempts": "number|null",
    "upsellSuccess": "boolean|null"
  },

  "version": {...},
  "scope": {...}
}
```

---

# **3.4 snapshot_daily_user**

One row per user per day.

```json
{
  "date": "YYYY-MM-DD",
  "userId": "...",

  "moduleCompleted": "number",
  "quizCompleted": "number",
  "saleslabSessions": "number",

  "xpTotal": "number",
  "badgesOwned": ["string"],

  "version": {
    "latestModuleVersion": "...",
    "latestScenarioVersion": "...",
    "latestPromptVersion": "..."
  },

  "scope": {...}
}
```

---

# **3.5 Aggregation Tables (region/country/branch/team)**

## Example: agg_region

```json
{
  "date": "YYYY-MM-DD",
  "regionId": "...",

  "activeUsers": "number",
  "totalSalesLabSessions": "number",

  "moduleCompletionRate": "number",
  "quizPassRate": "number",

  "avgUpsellSuccessRate": "number",

  "version": {
    "scenarioVersion": "...",
    "moduleVersion": "...",
    "promptVersion": "..."
  }
}
```

Scope-specific tables MUST follow identical structure.

---

# **4. KPI Definitions (Standardized for Admin Dashboard v1.2)**

---

## **4.1 Active Users Today**

```
count(distinct userId)
from event_log
where eventType = "login"
and date(timestamp) = today
```

---

## **4.2 Module Completion Rate**

```
completedModules / startedModules
```

---

## **4.3 Quiz Pass Rate**

```
#passed / #completed
```

---

## **4.4 SalesLab Upsell Success Rate**

```
sessions where upsellSuccess=true
/
sessions where upsellAttempts>0
```

---

## **4.5 Region/Country/Branch Ranking**

Rank by:
```
avg(xpTotal)
or moduleCompletionRate
or quizPassRate
```

---

# **5. Insights Engine Input Contract**

Insights Engine MUST receive the following structured payloads:

```
userPerformanceSnapshot (snapshot_daily_user)
saleslabSessionLogs
quizPerformanceLog
upsellMetrics
versionContext
scopeContext
```

AG MUST NOT omit version or scope.

---

# **6. Data Validation Rules**

- Missing scope → reject  
- Missing version → reject  
- eventType MUST follow allowed list  
- snapshot_daily_user MUST be unique per (userId, date)  
- No schema deviation allowed  

---

# **7. Error Handling**

| Code | Meaning |
|------|---------|
| E_SCHEMA_MISMATCH | Payload does not match schema |
| E_VERSION_MISSING | version fields missing |
| E_SCOPE_MISSING | scope fields missing |
| E_AGG_CONFLICT | inconsistent aggregation state |
| E_DUPLICATE_SNAPSHOT | snapshot already exists |

---

# **8. AG Directives (Mandatory)**

AG MUST:

### **AG-DATA-01** Always include version + scope  
### **AG-DATA-02** Never alter historical logs  
### **AG-DATA-03** Use only snapshot for aggregation  
### **AG-DATA-04** Reject out-of-scope data  
### **AG-DATA-05** Maintain deterministic schemas  
### **AG-DATA-06** Attach versionContext to all analytics outputs  

---

# **9. END OF DOCUMENT — DB Schema & Analytics Engine Spec v1.1**
