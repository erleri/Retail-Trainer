# Operator Console API Contract v2 — Step 6  
## Gamification Engine API v2 (Enterprise Full Spec)

Status: FINAL — Defines the complete, multi-layer gamification engine powering  
XP / Level / Streak / Badge / Mastery / Leaderboard / Rewards / Mission Sync.

본 문서는 Retail AI Trainer Gamification Engine의 **유일한 SSOT(Single Source of Truth)**이며,  
User Dashboard, Insights Engine, Mission Engine, Scenario/Quiz 성과와 직접적으로 연결된다.

---

# 0. 목적 (Purpose)

Gamification Engine API v2는 다음을 관리한다:

### ① XP Engine  
학습·시나리오·퀴즈·미션 성과를 기반으로 점수를 계산하는 규칙

### ② Level Engine  
레벨 업/다운, Progress %, Threshold, 성장곡선(Level Curve)

### ③ Streak Engine  
연속 학습 기록, 끊김 규칙, 회복 규칙

### ④ Badge Engine  
도전과제(Achievement) 획득, 진행형(Progressive) 뱃지 관리

### ⑤ Mastery Engine  
스킬 트리 기반의 능력 숙련도 구조  
(예: Upsell, Objection Handling, Product Knowledge 등)

### ⑥ Leaderboard Engine  
Branch / Country / Region / Global 리더보드

### ⑦ Reward Engine  
레벨/스킬/업적 기반 실제 보상(가상 보상 포함) 생성 규칙

### ⑧ User Performance Sync  
Quiz/Scenario/Content 학습 결과를 Gamification Sink에 반영

---

# 1. 공통 Gamification User Object

Gamification 엔진이 관리하는 사용자 상태 기본 구조.

```json
{
  "userId": "string",

  "xp": {
    "total": 2300,
    "weekly": 450,
    "daily": 120,
    "history": []
  },

  "level": {
    "current": 7,
    "progress": 0.62,
    "nextLevelXp": 2600
  },

  "streak": {
    "count": 5,
    "lastActiveDate": "2025-01-24",
    "maxStreak": 14
  },

  "badges": [
    {
      "badgeId": "achievement_upsell_master",
      "progress": 1.0,
      "earnedAt": 1712233444
    }
  ],

  "mastery": {
    "upsell": { "score": 0.71, "tier": "Silver" },
    "product_knowledge": { "score": 0.54, "tier": "Bronze" },
    "objection_handling": { "score": 0.39, "tier": "Beginner" }
  },

  "leaderboard": {
    "rankBranch": 4,
    "rankCountry": 22,
    "rankRegion": 102,
    "rankGlobal": 880
  }
}
```

---

# =========================================================
# 2. XP ENGINE API  
# =========================================================

XP 획득/차감 규칙을 모두 다루는 엔진.

## 2.1 XP Rule Object

```json
{
  "ruleId": "string",
  "event": "quiz.correct | scenario.completed | mission.completed | content.module.completed",
  "baseXp": 20,
  "multipliers": {
    "difficulty": 1.2,
    "streakBonus": 1.1,
    "timeBonus": 1.15
  },
  "cap": {
    "daily": 300,
    "weekly": 1500
  },
  "scope": "global"
}
```

---

## 2.2 Add XP  
`POST /operator/gamification/xp/add`

```json
{
  "userId": "u_0021",
  "event": "quiz.correct",
  "value": 15,
  "sourceId": "quizSession_1231"
}
```

Response → 업데이트된 XP/Level/Streak 반환

---

## 2.3 Remove XP  
`POST /operator/gamification/xp/remove`

---

## 2.4 Configure XP Rule  
`POST /operator/gamification/xp/rule`

---

## 2.5 Get XP Summary  
`GET /operator/gamification/xp/{userId}`

---

## 2.6 XP Calculation Formula (Enterprise Spec)

```
XP = baseXp
    × difficultyMultiplier(difficulty)
    × streakMultiplier(streakCount)
    × timeBonus(submissionSpeed)
```

제약:

- dailyCap 초과 시 soft cap (0.2 multiplier) 적용  
- negative XP 방지  
- cheat 패턴 감지(QPS limit)

---

# =========================================================
# 3. LEVEL ENGINE API  
# =========================================================

레벨은 XP 누적에 따라 변화하며, 성장 곡선(Level Curve)을 따른다.

## 3.1 Level Curve (Exponential Hybrid)

```
requiredXp(L) = 50 * L^2 + 100 * L
```

예시:
- Level 1 → 150 XP  
- Level 5 → 1750 XP  
- Level 10 → 6000 XP

---

## 3.2 Level Up API  
`POST /operator/gamification/level/apply`

자동 적용되므로 직접 호출보다는 XP Add 후 내부 동작.

Response Example:
```json
{
  "level": 8,
  "progress": 0.12,
  "reward": {
    "type": "badge",
    "badgeId": "level_8_reached"
  }
}
```

---

## 3.3 Get Level Info  
`GET /operator/gamification/level/{userId}`

---

# =========================================================
# 4. STREAK ENGINE API  
# =========================================================

연속 학습 참여에 보상.

---

## 4.1 Update Streak  
`POST /operator/gamification/streak/update`

Rules:

- 하루 1번 이상 학습 → streak+1  
- n일 미참여 → streak = 0  
- Recovery Token(선택) 가능

---

## 4.2 Get Streak Info  
`GET /operator/gamification/streak/{userId}`

---

## 4.3 Streak Bonus Formula

```
streakMultiplier = 1 + (0.02 * streakCount), capped at 1.3
```

최대 30% 보너스.

---

# =========================================================
# 5. BADGE ENGINE API  
# =========================================================

Badge: 성취 기반 보상.

## 5.1 Badge Object

```json
{
  "badgeId": "upsell_master_1",
  "title": "Upsell Master I",
  "description": "Successfully upsell 10 times",
  "category": "upsell",
  "goal": 10,
  "progressType": "count | percent",
  "iconUrl": "https://...",
  "tier": "Bronze | Silver | Gold | Platinum",
  "scope": "global"
}
```

---

## 5.2 Create Badge  
`POST /operator/gamification/badge`

## 5.3 Update Badge  
`PATCH /operator/gamification/badge/{badgeId}`

## 5.4 Delete Badge  
`DELETE /operator/gamification/badge/{badgeId}`

---

## 5.5 Assign Badge Progress  
자동으로 User Performance Engine이 호출

`POST /operator/gamification/badge/progress`

---

# =========================================================
# 6. MASTERY ENGINE API  
# =========================================================

Upsell · Product · Objection Handling 등 스킬 기반 성장 구조.

---

## 6.1 Mastery Metric Object

```json
{
  "skillId": "upsell",
  "score": 0.74,
  "tier": "Silver",
  "history": []
}
```

---

## 6.2 Mastery Update API  
`POST /operator/gamification/mastery/update`

Input:
```json
{
  "userId": "u_001",
  "skillId": "upsell",
  "delta": 0.12,
  "source": "scenario"
}
```

Tier Rules Example:
```
0–0.29 : Beginner  
0.30–0.59 : Bronze  
0.60–0.79 : Silver  
0.80–1.00 : Gold  
```

---

# =========================================================
# 7. LEADERBOARD ENGINE API  
# =========================================================

지역 기반 랭킹.

## 7.1 Get Leaderboard  
`GET /operator/gamification/leaderboard`

Query:
```
?scope=branch|country|region|global
?metric=xp|mastery|badges|streak
?limit=50
```

Anti-cheat 포함:
- Sudden XP spikes  
- Repeated identical missions  
- Server-side rate-limiting

---

# =========================================================
# 8. REWARD ENGINE API  
# =========================================================

레벨업/스킬업/뱃지 달성 시 자동 보상.

## 8.1 Reward Rule Object

```json
{
  "rewardId": "reward_lvl8",
  "trigger": "level_reached",
  "condition": { "level": 8 },
  "reward": {
    "type": "badge | xp | item | mission",
    "value": "level_8_badge"
  }
}
```

---

## 8.2 Create/Update/Delete Reward Rules

- `POST /operator/gamification/reward`
- `PATCH /operator/gamification/reward/{rewardId}`
- `DELETE /operator/gamification/reward/{rewardId}`

---

# =========================================================
# 9. USER PERFORMANCE SYNC  
# =========================================================

Gamification은 다른 엔진의 결과를 흡수한다.

---

## 9.1 Quiz 결과 → XP/Badge/Mastery

```
quiz.correct → XP + Mastery(product_knowledge)
quiz.incorrect → Mastery - small penalty
```

---

## 9.2 Scenario 결과 → XP/Mastery/Badge

```
upsell_success → XP large + Mastery(upsell)
objection_resolved → Badge progress
```

---

## 9.3 Mission 결과 → XP + Reward

---

# =========================================================
# 10. Mobile Read API (Learner Read-only)

학습자 대시보드용 데이터.

`GET /operator/learner/gamification/summary/{userId}`

Response Example:
```json
{
  "xp": {...},
  "level": {...},
  "streak": {...},
  "badges": [...],
  "mastery": {...},
  "leaderboard": {...}
}
```

---

# =========================================================
# 11. Scope Enforcement

- Branch Operator → 자신의 지점 사용자만 수정 가능  
- Country Operator → 해당 국가만  
- Admin → 전체 가능  

---

# =========================================================
# 12. Hot Reload

Gamification Rule 변경 시 즉시 반영.

`POST /operator/ops/hot-reload`

```json
{
  "type": "gamification",
  "targetId": "xp_ruleset_v12"
}
```

---

# =========================================================
# 13. DX & AG Implementation Notes

### AG must not:
- XP/Level/Badge 데이터를 직접 수정  
- Mastery 계산을 직접 변경  
- Leaderboard를 모델이 변경하게 해서는 안 됨

### AG must:
- Scenario/Quiz 결과를 Gamification Sink로 전달  
- XP/Badge 정해진 규칙만 사용  
- Reward Engine에서 규정된 보상만 사용자에게 언급

---

# END — Step 6 (Gamification Engine API v2 — Enterprise Full Spec)
