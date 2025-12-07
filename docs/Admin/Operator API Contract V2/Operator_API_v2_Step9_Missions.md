# Operator Console API Contract v2 — Step 9  
## Mission & Quest Engine API v2 (Enterprise Full Spec)

Status: FINAL — Defines the complete mission system: templates, assignment, tracking, branching quests, rewards, integration with Insights/Gamification/UPM.

---

# 0. 목적 (Purpose)

Mission & Quest Engine v2는 다음을 제공한다:

1. **미션 템플릿 정의**
2. **자동 미션 발행 (Insights → Mission)**
3. **퀘스트(Quest) 시스템** – 다단계/분기형 학습 루트
4. **팀·지점 단위 미션 (Branch/Country Missions)**
5. **보상 연결 (Gamification Reward Engine 연동)**

Mission은 Gamification, UPM, Insights가 만든 “해석 결과”를  
실제 행동으로 전환하는 실행 레이어이다.

---

# 1. Mission Template Object

```json
{
  "missionTemplateId": "string",
  "title": "Practice handling price objections",
  "description": "User must complete scenario X twice with success.",
  "category": "objection | upsell | learning | streak | product_knowledge",

  "requirements": {
    "scenario": {
      "scenarioId": "sc_001",
      "successRequired": true,
      "minAttempts": 2
    },
    "quiz": {
      "quizId": "q_101",
      "minAccuracy": 0.7
    },
    "content": {
      "moduleId": "module_22",
      "mustComplete": true
    }
  },

  "reward": {
    "type": "badge | xp | item",
    "value": "badge_objection_iron"
  },

  "difficulty": 2,
  "durationDays": 7,
  "scope": "global",
  "published": false
}
```

---

# 2. Mission Template API

## 2.1 Create Template  
`POST /operator/missions/template`

## 2.2 Update Template  
`PATCH /operator/missions/template/{templateId}`

## 2.3 Delete Template  
`DELETE /operator/missions/template/{templateId}`

## 2.4 Publish Template  
`POST /operator/missions/template/{templateId}/publish`

- publish된 Template은 **immutable**
- 수정 시 항상 새 Template 생성 또는 version 관리 전략 사용

---

# 3. Mission Assignment API

미션 템플릿을 실제 사용자에게 배정하는 단계.

## 3.1 Assign Mission  
`POST /operator/missions/assign`

```json
{
  "userId": "u_01",
  "missionTemplateId": "mission_objection_01",
  "reason": "insight_recommendation",
  "sourceInsightId": "ins_883"
}
```

Response:
```json
{
  "missionId": "mission_inst_442"
}
```

---

## 3.2 Get Active Missions (User)  
`GET /operator/missions/active/{userId}`

---

## 3.3 Get Mission Detail  
`GET /operator/missions/{missionId}`

---

# 4. Mission Progress Update API

사용자의 Scenario/Quiz/Module 이벤트가 미션을 자동으로 업데이트 한다.

`POST /operator/missions/update`

Request 예:
```json
{
  "missionId": "mission_inst_442",
  "event": {
    "type": "scenario",
    "scenarioId": "sc_001",
    "success": true
  }
}
```

엔진은 `requirements`와 비교하여 진행도(progress)를 갱신한다.

---

# 5. Mission Completion API

`POST /operator/missions/complete/{missionId}`

조건:
- 모든 requirements 충족 시에만 완료 처리

자동 보상 발동:
- XP 지급
- Badge 지급
- Reward Engine 호출

Response:
```json
{
  "completed": true,
  "reward": {
    "type": "badge",
    "value": "badge_objection_iron"
  }
}
```

---

# 6. Quest Engine (멀티스텝 미션 구조)

퀘스트는 여러 미션으로 구성된 “장기 학습 경로(Path)”이다.

## 6.1 Quest Object

```json
{
  "questId": "string",
  "title": "Upsell Expert Growth Path",
  "description": "From basics to expert-level upsell skills.",
  "steps": [
    {
      "stepOrder": 1,
      "missionTemplateId": "mission_intro_upsell",
      "unlockCondition": "always"
    },
    {
      "stepOrder": 2,
      "missionTemplateId": "mission_mid_upsell",
      "unlockCondition": "prev_success"
    },
    {
      "stepOrder": 3,
      "missionTemplateId": "mission_advanced_upsell",
      "unlockCondition": "skill.upsell > 0.7"
    }
  ],
  "reward": {
    "type": "badge",
    "value": "upsell_master_gold"
  },
  "scope": "global",
  "published": false
}
```

---

## 6.2 Quest Template API  

- `POST /operator/missions/quest/template`  
- `PATCH /operator/missions/quest/template/{questId}`  
- `POST /operator/missions/quest/template/{questId}/publish`  

---

## 6.3 Quest Assignment API  

`POST /operator/missions/quest/assign`

```json
{
  "userId": "u_01",
  "questId": "quest_upsell_path"
}
```

---

## 6.4 Quest Progress API  

`POST /operator/missions/quest/update`

- 내부적으로 각 step별 Mission progress를 추적  
- 모든 step 완료 시 Quest 완료로 전환

---

# 7. Team / Branch Missions

팀·지점 단위 목표 설정.

## 7.1 Assign Branch Mission  
`POST /operator/missions/branch/assign`

```json
{
  "branchId": "BR_SAO_PAULO_03",
  "missionTemplateId": "mission_branch_sales_push",
  "durationDays": 14
}
```

---

## 7.2 Get Branch Mission Status  
`GET /operator/missions/branch/{branchId}`

Response 예:
```json
{
  "branchId": "BR_SAO_PAULO_03",
  "missions": [
    {
      "missionId": "branch_mission_001",
      "title": "Sell 50 OLED units",
      "progress": 0.64,
      "endsAt": 1713000000
    }
  ]
}
```

---

# 8. Mission Recommendation API (from Insights)

Insights Engine과의 공식 연동 엔드포인트.

`POST /operator/missions/recommend`

Request:
```json
{
  "userId": "u_02",
  "missionType": "learning_recovery",
  "reason": "Low engagement detected",
  "sourceInsightId": "ins_1933"
}
```

Mission Engine 내부에서:
- missionType에 맞는 Template pool에서 후보를 선택  
- 사용자 기존 미션/퀘스트/스킬 상태를 고려  
- 중복/과도 발행 방지 후, 최종 미션 assign

---

# 9. Scope Enforcement

- Branch Operator → 자신의 Branch 사용자 및 Branch Mission만 관리 가능  
- Country Operator → 해당 국가 전체 사용자/Branch에 대해 미션 할당 가능  
- Admin → 글로벌 전체 Template 및 Mission/Quest 제어 가능  

Scope 제한 원칙:
- Template 생성/수정/삭제: Admin 또는 상위 Scope 운영자  
- 개인 미션 할당: 동일/하위 Scope 사용자만 가능  
- Branch Mission: 해당 Branch 수준 또는 상위 Scope에서만 가능

---

# 10. Hot Reload

미션 규칙/퀘스트 로직 패치 시, 즉시 엔진에 반영.

`POST /operator/ops/hot-reload`

```json
{
  "type": "mission",
  "targetId": "mission_ruleset_v4"
}
```

---

# 11. DX & AG Implementation Notes

### 11.1 AG가 해야 하는 것 (MUST)

- Scenario/Quiz/Module 이벤트 발생 시  
  `/operator/missions/update`를 호출하여 미션 진행도 갱신  
- Insights Engine이 추천한 미션을  
  `/operator/missions/recommend`로 넘겨서 실제 Assignment 트리거
- Mission 완료 시 Gamification Reward Engine과의 동기화 고려

### 11.2 AG가 하면 안 되는 것 (MUST NOT)

- Mission Template 내용을 임의로 수정  
- Quest 구조를 재조합하거나 Step을 스킵  
- Reward를 임의로 생성(항상 Reward Engine 규칙을 따를 것)

### 11.3 DX 구현 관점

- Mission State Machine 필수:
  ```text
  assigned → active → completed → rewarded
  ```
- Quest는 Mission State를 이용해 고수준 Progress를 관리  
- Branch Mission은 동시에 많은 사용자를 타겟으로 하므로  
  배치 처리 방식으로 구현하는 것이 안전

---

# END — Step 9 (Mission & Quest Engine API v2)
