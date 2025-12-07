# Operator Console API Contract v2 — Step 7  
## User Performance Monitor (UPM) API v2  
### High-Resolution Skill/Behavior Tracking Engine

Status: FINAL — Defines the complete pipeline for collecting, aggregating, and exposing
user performance metrics across Scenario, Quiz, Content Module, Missions, and Gamification.

---

# 0. 목적 (Purpose)

User Performance Monitor API v2(UPM)는 아래 데이터를 표준 규격으로 수집·저장·제공한다:

1) **Scenario Performance**  
- objection handling 능력  
- upsell 시도/성공  
- 회유·설득 프로세스의 품질  
- 대화 길이, turn-by-turn behavior score  

2) **Quiz Performance**  
- 정답률, 개별 문제 난이도, 지식 영역별 스코어  

3) **Learning Module Completion**  
- 모듈 완료율, 반복 학습 기록  

4) **Mission Performance**  
- 성공률, 목표 달성도, 성향 파악  

5) **Gamification Sync**  
- mastery 업데이트, badge progress, reward triggers

UPM은 **Insights Engine(8단계)** 및 **Gamification(6단계)**의 입력이자  
Mission Engine(9단계)의 자동 발행 조건으로 사용된다.

---

# 1. UPM Data Model (Aggregated Profile)

```json
{
  "userId": "string",

  "scenario": {
    "totalSessions": 42,
    "avgTurns": 11.2,
    "upsellSuccessRate": 0.38,
    "avgObjections": 2.9,
    "behaviorScore": 0.63
  },

  "quiz": {
    "totalQuizzes": 18,
    "avgAccuracy": 0.72,
    "strengths": ["brightness", "oled_basics"],
    "weaknesses": ["sound_features"]
  },

  "learning": {
    "completedModules": 12,
    "repeatCount": 5,
    "engagementScore": 0.58
  },

  "missions": {
    "completed": 14,
    "failed": 3,
    "active": 2
  },

  "skill": {
    "upsell": 0.68,
    "objection_handling": 0.57,
    "product_knowledge": 0.62
  },

  "updatedAt": 1712233444
}
```

---

# 2. Scenario Performance Logging API

## 2.1 Log Scenario Session  
`POST /operator/upm/scenario/log`

```json
{
  "userId": "u_01",
  "scenarioId": "sc_001",
  "turns": 13,
  "upsellSuccess": true,
  "objections": 2,
  "behaviorScore": 0.71
}
```

---

## 2.2 Get Scenario Summary  
`GET /operator/upm/scenario/{userId}`

---

# 3. Quiz Performance Logging API

## 3.1 Log Quiz Result  
`POST /operator/upm/quiz/log`

```json
{
  "userId": "u_01",
  "quizId": "q_55",
  "correct": 7,
  "total": 10,
  "topic": "oled_basics",
  "difficulty": 2
}
```

---

## 3.2 Get Quiz Summary  
`GET /operator/upm/quiz/{userId}`

---

# 4. Learning Module Completion Logging API

## 4.1 Log Module Completion  
`POST /operator/upm/learning/log`

```json
{
  "userId": "u_01",
  "moduleId": "m_22",
  "durationMinutes": 14,
  "completed": true
}
```

---

## 4.2 Get Learning Summary  
`GET /operator/upm/learning/{userId}`

---

# 5. Mission Performance Logging API

## 5.1 Log Mission Result  
`POST /operator/upm/mission/log`

```json
{
  "userId": "u_01",
  "missionId": "mission_10",
  "success": true,
  "score": 0.83
}
```

---

## 5.2 Get Mission Summary  
`GET /operator/upm/mission/{userId}`

---

# 6. Skill Metric API (Mastery Sync)

UPM은 Gamification Mastery Engine(6단계)을 업데이트하는 주요 소스.

## 6.1 Update Skill Metric (auto)  
`POST /operator/upm/skill/update`

```json
{
  "userId": "u_01",
  "skillId": "upsell",
  "delta": 0.07,
  "source": "scenario"
}
```

---

## 6.2 Get Skill Summary  
`GET /operator/upm/skill/{userId}`

---

# 7. Full User Performance Summary API

User Dashboard v2에서 사용하는 핵심 API.

`GET /operator/upm/summary/{userId}`

Response:
```json
{
  "scenario": {...},
  "quiz": {...},
  "learning": {...},
  "missions": {...},
  "skill": {...}
}
```

---

# 8. Scope Enforcement

- Branch Operator → 해당 지점 사용자 데이터만 조회 가능  
- Country Operator → 국가 단위  
- Admin → 모든 사용자  

---

# 9. Hot Reload (간접적)

UPM 자체는 규칙이 적지만:  
- Skill Weight 변경  
- BehaviorScore 알고리즘 변경  
- Scenario Performance 기준 변경  
→ Hot Reload 트리거 필요

`POST /operator/ops/hot-reload`

```json
{
  "type": "upm",
  "targetId": "behavior_score_v3"
}
```

---

# 10. DX & AG Notes

### AG must send:  
- quiz result  
- scenario performance  
- mission result  
- learning completion  

### AG must not:  
- 직접 mastery/skill 값을 변경  
- Scenario/Quiz 성과를 임의 변형 후 전송  

### DX must:  
- 모든 성과는 UPM → Insights → Missions/Gamification 순으로 흐르도록  
  파이프라인을 유지해야 한다.

---

# END — Step 7 (User Performance Monitor API v2)
