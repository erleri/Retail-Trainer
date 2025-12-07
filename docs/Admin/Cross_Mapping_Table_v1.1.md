# **Admin ↔ User ↔ Gamification Cross-Mapping Table v1.1 — Full Rewrite (Format D)**  
Status: FINAL • Scope: XP / Badge / Streak / Mastery / Leaderboard  
Aligned with:  
- **System Settings v1.1 (Immediate Hot Reload)**  
- **User Management Integrated Spec v2.1**  
- **DB & Analytics Engine Spec v1.1**  
- Precursor to: Gamification Engine Spec v1.2 / Admin Dashboard v1.2 / Insights Engine v1.1

---

# **0. Executive Summary**

This document defines the **authoritative linkage** between:

```
Admin → User → Gamification → Analytics → Dashboard
```

It ensures:

- deterministic XP/Badge/Streak/Mastery calculation  
- strict scope-aware leaderboard behavior  
- version-aware data flow  
- consistent reward logic across SalesLab / Learning Modules / Quizzes  
- AG-compliant deterministic rules  

This is the central integration blueprint for Gamification across the platform.

---

# **1. High-Level Architecture**

```
User Actions
   ↓ event_log
Module Complete → XP Engine →
Quiz Complete   → XP Engine →
SalesLab Session→ XP Engine →
   ↓
XP / Badge / Streak / Mastery Calculation
   ↓ snapshot_daily_user
   ↓ aggregation (region/country/branch/team)
   ↓ Leaderboards + Insights + Dashboard KPIs
```

---

# **2. XP Mapping Table (Authoritative v1.1)**

| Action | XP | Notes |
|--------|-----|-------|
| Module Complete | **+50 XP** | version-aware source event |
| Quiz Completed | **+20 XP** | |
| Quiz Perfect Score | **+10 XP bonus** | |
| SalesLab Session Completed | **+40 XP** | |
| SalesLab Upsell Success | **+25 XP** | attempts>0 & success=true |
| Difficulty Level 4+ (SalesLab) | **+15 XP** | |
| Daily Login | **+5 XP** | once/day |
| Team Mission Contribution | toggle-dependent | |

XP values MUST NOT be altered by AG.

---

# **3. Streak Rules v1.1**

A streak day is recorded when the user performs ≥1 meaningful action:

```
module_complete OR quiz_complete OR saleslab_session
```

| Streak | Reward |
|--------|--------|
| 3 days | +10 XP |
| 7 days | +30 XP |
| 14 days | +50 XP |
| 30 days | Badge: Consistency Mastery I |

Streak MUST be recorded in `snapshot_daily_user`.

---

# **4. Badge Mapping Rules v1.1**

## **4.1 Skill Progress Badges**
| Condition | Badge |
|-----------|--------|
| 10 modules completed | Skill Builder I |
| 30 modules | Skill Builder II |
| 70 modules | Skill Builder III |

## **4.2 Upsell Performance Badges**
| Condition | Badge |
|-----------|--------|
| 5 upsell successes | Persuasion Adept |
| 20 successes | Persuasion Expert |
| 50 successes | Persuasion Master |

## **4.3 Quiz Mastery Badges**
| Condition | Badge |
|-----------|--------|
| 10 perfect quizzes | Accuracy Ace |
| 30 perfect quizzes | Logic Expert |
| 100 perfect quizzes | Precision Master |

## **4.4 Streak Badges**
| Condition | Badge |
|-----------|--------|
| 7-day streak | Consistency Starter |
| 14-day streak | Consistency Pro |
| 30-day streak | Consistency Mastery I |

AG MUST NOT invent badges beyond this list.

---

# **5. Mastery Engine v1.1 (Competency Model)**

Mastery Levels:
```
0 — Untrained
1 — Basic
2 — Intermediate
3 — Advanced
4 — Expert
5 — Mastery
```

## **5.1 Mastery Score Formula (v1.1)**

```
MasteryScore =
  0.4 * ModulePerformanceScore
+ 0.3 * QuizPerformanceScore
+ 0.3 * SalesLabPerformanceScore
```

## **5.2 Level Thresholds**

| Level | Score |
|--------|-------|
| 0 | <10 |
| 1 | 10–30 |
| 2 | 30–55 |
| 3 | 55–75 |
| 4 | 75–90 |
| 5 | 90+ |

Mastery MUST be computed daily and stored in snapshot tables.

---

# **6. Scope-Aware Leaderboard Rules**

Leaderboard MUST be filtered by the user’s assigned scope:

```
Region Leaderboard  
Country Leaderboard  
Branch Leaderboard  
Team Leaderboard  
Personal Rank (Learner only)
```

### **Ranking Metric Options (Admin-selectable):**
```
XP (default)
Module Completion Rate
Quiz Pass Rate
SalesLab Performance
Composite Score
```

### Mandatory Rule:
**AG MUST only return leaderboard entries within the user’s scope.**

---

# **7. Version-Aware Gamification Model**

| Component | Behavior |
|-----------|----------|
| XP | version-agnostic |
| Badges | version-agnostic |
| Mastery | version-weighted |
| Analytics | version-separated |
| Insights | latest-version only |
| Leaderboard | version-combined (operational metric) |

This ensures stability even when learning modules or SalesLab scenarios update frequently.

---

# **8. Cross-Mapping Table (v1.1 Integrative)**

## **8.1 Admin → User**

| Admin Action | Gamification Effect |
|--------------|---------------------|
| Assign Role | Defines allowed XP events |
| Assign Scope | Defines leaderboard visibility |
| Toggle Features | Enables/disables XP pathways |

---

## **8.2 User → Gamification Mapping**

| User Event | Result |
|-------------|--------|
| module_complete | +50 XP |
| quiz_complete | +20 XP |
| quiz_perfect | +10 XP |
| saleslab_session | +40 XP |
| upsell_success | +25 XP |
| login_daily | +5 XP |

---

## **8.3 Gamification → Analytics**

| Data | Role |
|-------|------|
| XP totals | ranking, progress |
| Badges | user classification |
| Mastery Level | competency |
| Streak | engagement |

---

## **8.4 Analytics → Dashboard**

Derived from:

```
snapshot_daily_user
agg_region/country/branch/team
session_log
upsell metrics
quiz performance
learning metrics
```

---

# **9. AG Directives (Mandatory Rules)**

AG MUST:

### **AG-GAME-01** Apply XP rules EXACTLY as described.  
### **AG-GAME-02** NEVER generate badges not listed in this document.  
### **AG-GAME-03** ALWAYS include `scope` + `version` in logs.  
### **AG-GAME-04** Enforce strict scope filtering on leaderboards.  
### **AG-GAME-05** Preserve XP/Badge/Mastery across version updates.  
### **AG-GAME-06** Recalculate streaks daily, not per event.  

---

# **10. END OF DOCUMENT — Cross-Mapping Table v1.1**
