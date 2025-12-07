# **Gamification Engine Spec v1.2 — Full Engine Specification (Format D)**  
Status: FINAL • Authoritative Gamification Engine Spec  
Aligned with:  
- **System Settings v1.1 (Immediate Hot Reload)**  
- **User Management Integrated Spec v2.1**  
- **DB & Analytics Engine Spec v1.1**  
- **Cross-Mapping Table v1.1**  
- Future: **Admin Dashboard v1.2**, **User Dashboard v2.2**, **Insights Engine v1.1**

---

# **0. Executive Summary**

The Gamification Engine is the motivational core of Retail AI Trainer.  
It transforms user actions into:

- XP  
- Streaks  
- Badges  
- Mastery Levels  
- Leaderboard Rankings  
- Team Mission Contributions (feature toggle)  

Gamification outputs feed into:
- User Dashboard  
- Admin Dashboard  
- Analytics Engine  
- Insights Engine  
- Learning Progress Indicators  

This v1.2 specification defines the **complete logic, computation model, APIs, and AG behavioral guarantees**, ensuring absolute consistency across DX, backend, and AntiGravity engines.

---

# **1. High-Level Architecture**

```
event_log
   ↓
XP Engine
Badge Engine
Streak Engine
Mastery Engine
Leaderboard Engine
   ↓
snapshot_daily_user
   ↓
agg_region / agg_country / agg_branch / agg_team
   ↓
Admin Dashboard v1.2
User Dashboard v2.2
Insights Engine v1.1
```

All engines MUST use deterministic rules and MUST NOT diverge from this specification.

---

# **2. XP Engine Specification (v1.2)**

XP Engine extracts events from `event_log` and applies the official XP mapping rules.

## **2.1 XP Award Rules**

| Action | XP | Notes |
|--------|------|------|
| Module Complete | **+50 XP** | version-aware source event |
| Quiz Completed | **+20 XP** | |
| Quiz Perfect Score | **+10 XP bonus** | |
| SalesLab Session Completed | **+40 XP** | |
| Upsell Success | **+25 XP** | attempts>0 & success=true |
| Difficulty ≥ 4 Session | **+15 XP** | |
| Daily Login | **+5 XP** | once/day |
| Team Mission Contribution | configurable | feature toggle-dependent |

XP MUST be **additive-only** (no reductions).

---

## **2.2 XP Engine Input Contract**

```json
{
  "eventId": "...",
  "userId": "...",
  "eventType": "...",
  "timestamp": "...",
  "context": {},
  "version": {},
  "scope": {}
}
```

## **2.3 XP Engine Output Contract**

```json
{
  "userId": "...",
  "xpAdded": 50,
  "xpTotal": 3400,
  "reason": "module_complete",
  "timestamp": "..."
}
```

---

# **3. Streak Engine Specification (v1.2)**

A streak day occurs when ≥1 meaningful action happens.

### Meaningful Actions:
```
module_complete  
quiz_complete  
saleslab_session_complete
```

### Streak Logic:
```
if today_has_meaningful_action:
    if yesterday_streak_exists:
        streak += 1
    else:
        streak = 1
else:
    streak = 0
```

### Streak Rewards:

| Streak Length | Reward |
|---------------|--------|
| 3 days | +10 XP |
| 7 days | +30 XP |
| 14 days | +50 XP |
| 30 days | Badge: Consistency Mastery I |

Streak values MUST be stored in `snapshot_daily_user`.

---

# **4. Badge Engine Specification (v1.2)**

Badges represent milestone achievements.  
Badge Engine evaluates snapshot_daily_user for badge unlock conditions.

## **4.1 Skill Progress Badges**

| Condition | Badge |
|-----------|--------|
| 10 modules completed | Skill Builder I |
| 30 modules | Skill Builder II |
| 70 modules | Skill Builder III |

## **4.2 Upsell Badges**

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

Badge Engine MUST NOT award duplicates.

---

# **5. Mastery Engine Specification (v1.2)**

Mastery Level estimates learner competency.

## **5.1 Mastery Score Formula**

```
MasteryScore =
  0.4 * ModulePerformanceScore
+ 0.3 * QuizPerformanceScore
+ 0.3 * SalesLabPerformanceScore
```

## **5.2 Mastery Levels**

| Level | Score Range |
|--------|--------------|
| 0 | <10 |
| 1 | 10–30 |
| 2 | 30–55 |
| 3 | 55–75 |
| 4 | 75–90 |
| 5 | 90+ |

Mastery MUST be recalculated daily and saved in snapshot tables.

---

# **6. Leaderboard Engine Specification (v1.2)**

Leaderboards MUST be filtered by the requesting user’s scope:

```
Region → Country → Branch → Team → Personal
```

## **6.1 Ranking Metric Options**

Admin may choose:

```
xp
module_completion_rate
quiz_pass_rate
saleslab_performance
composite (normalized sum)
```

## **6.2 Scope Enforcement (Hard Rule)**

```
User with regionId = R
→ may only see leaderboard rows with regionId = R
```

Learner:
```
only sees personal rank
```

AG MUST enforce scope boundaries.

---

# **7. Daily Snapshot Processor Specification (v1.2)**

Runs at 00:00 per region.

## Inputs:
- event_log  
- session_log  
- interaction_log  

## Outputs:
- snapshot_daily_user  
- streak updates  
- mastery updates  
- badge unlock checks  

Snapshot processing ensures deterministic daily state.

---

# **8. Version-Aware Computation Rules (v1.2)**

| Component | Version Behavior |
|-----------|------------------|
| XP | version-agnostic |
| Badges | version-agnostic |
| Streak | version-agnostic |
| Mastery | version-weighted |
| Analytics | version-separated |
| Insights | latest-version only |
| Leaderboard | version-combined |

This ensures module/scenario updates do not break achievements.

---

# **9. Gamification Engine AG Directives (MUST)**

AG MUST:

### **G-01** Apply XP rules EXACTLY (no inference).  
### **G-02** Never alter badge lists.  
### **G-03** Always attach `scope` + `version` to logs.  
### **G-04** Enforce strict leaderboard scope filtering.  
### **G-05** Use snapshot tables for aggregation.  
### **G-06** Recalculate streaks per day, not per event.  
### **G-07** Preserve XP/Badge/Mastery across version shifts.  
### **G-08** Apply System Settings via Immediate Hot Reload.  

---

# **10. API Contract (Gamification Engine v1.2)**

## **GET /gamification/xp/:userId**
Returns:
```
xpTotal
xpHistory
achievementBreakdown
```

## **GET /gamification/streak/:userId**
Returns:
```
currentStreak
streakHistory
nextThreshold
```

## **GET /gamification/badges/:userId**
Returns:
```
badgeList
unlockDates
```

## **GET /gamification/mastery/:userId**
Returns:
```
masteryLevel
masteryScore
skillBreakdown
```

## **GET /gamification/leaderboard**
Params:
```
scopeLevel=region|country|branch|team|personal
metric=xp|module|quiz|saleslab|composite
```

---

# **11. END OF DOCUMENT — Gamification Engine Spec v1.2**
