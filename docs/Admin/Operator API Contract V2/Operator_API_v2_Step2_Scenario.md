# Operator Console API Contract v2 — Step 2  
## Scenario API v2 (Conversation Flow Engine)

Status: FINAL — Defines the full structure and behavior logic of SalesLab Scenario Engine.

---

# 0. 목적 (Purpose)

Scenario API v2는 **AI 고객의 대화 흐름(Stages), 의도/트리거, 난이도 연동, 페르소나/트레잇 적용**을 통제한다.  
SalesLab Engine의 핵심 엔진으로, Prompt·Difficulty와 함께 사용자 트레이닝 품질을 결정한다.

---

# 1. Scenario Object Structure

```json
{
  "scenarioId": "string",
  "versionId": "string",
  "title": "string",
  "description": "string",
  "personaPool": ["gamer", "movie_lover"],
  "traitPool": ["price_sensitive"],
  "difficultyRange": [1, 3],
  "stages": [
    {
      "stageId": "uuid",
      "order": 1,
      "prompt": "Hello, how can I help you?",
      "triggers": [
        { "type": "intent", "value": "greeting" }
      ],
      "personaOverride": null,
      "traitOverride": null,
      "difficultyOverride": 1
    }
  ],
  "published": false,
  "createdAt": 0,
  "updatedAt": 0,
  "scope": "BR"
}
```

---

# 2. Endpoints

## 2.1 Create Scenario  
`POST /operator/scenario`

Request:
```json
{
  "title": "Upsell Starter Scenario",
  "description": "Basic objection handling",
  "personaPool": ["gamer"],
  "traitPool": ["budget_sensitive"],
  "difficultyRange": [1, 2],
  "scope": "BR"
}
```

Response:
```json
{
  "scenarioId": "uuid",
  "versionId": "uuid",
  "published": false
}
```

---

## 2.2 Get Scenario  
`GET /operator/scenario/{scenarioId}?versionId=optional`

---

## 2.3 Update Scenario  
`PATCH /operator/scenario/{scenarioId}`  
→ 수정하면 항상 새 `versionId` 생성  
→ `published = false`

---

## 2.4 Delete Scenario  
`DELETE /operator/scenario/{scenarioId}`  
- published version은 히스토리에 남고 삭제 불가  
- scenario 자체는 삭제 가능

---

## 2.5 Duplicate Scenario  
`POST /operator/scenario/{scenarioId}/duplicate`

Response:
```json
{
  "scenarioId": "new_uuid",
  "versionId": "new_uuid"
}
```

---

# 3. Stage Management API

Stages define the decision flow and branching logic.

---

## 3.1 Create Stage  
`POST /operator/scenario/{scenarioId}/stages`

Request:
```json
{
  "order": 1,
  "prompt": "Hello, how can I help?",
  "triggers": [
    { "type": "intent", "value": "greeting" }
  ],
  "personaOverride": null,
  "traitOverride": null,
  "difficultyOverride": 1
}
```

---

## 3.2 Update Stage  
`PATCH /operator/scenario/{scenarioId}/stages/{stageId}`

---

## 3.3 Delete Stage  
`DELETE /operator/scenario/{scenarioId}/stages/{stageId}`  
→ 최소 1개 Stage는 존재해야 함

---

## 3.4 Reorder Stages  
`POST /operator/scenario/{scenarioId}/stages/reorder`

```json
{
  "order": ["stage3", "stage1", "stage2"]
}
```

---

# 4. Validation API

`POST /operator/scenario/validate`

검사 항목:
- Stage 순서 오류  
- Trigger 누락  
- Circular transition  
- Difficulty override 오류  
- Persona/Trait mismatch  
- Empty scenario  

Response:
```json
{
  "valid": false,
  "errors": [
    "Stage 3 has no triggers"
  ]
}
```

---

# 5. Test Run Simulation API

운영자가 시나리오를 미리 테스트해볼 수 있음.  
AG는 이 API를 호출하여 “시나리오 상호작용”을 시뮬레이션한다.

`POST /operator/scenario/{scenarioId}/test-run`

Request:
```json
{
  "persona": "gamer",
  "traits": ["price_sensitive"],
  "difficulty": 2,
  "maxTurns": 10
}
```

Response:
```json
{
  "turns": [
    { "role": "customer", "text": "I'm not sure about the price..." },
    { "role": "operator", "text": "Let me show you affordable options." }
  ],
  "summary": {
    "objections": 3,
    "upsellSuccessLikelihood": 0.61
  }
}
```

---

# 6. Publish Scenario API

`POST /operator/scenario/{scenarioId}/publish`

결과:
- 해당 versionId 고정  
- publishedVersion 필드 업데이트  
- Learner/Trainer는 published version만 접근 가능

---

# 7. Version History API

`GET /operator/scenario/{scenarioId}/versions`

---

# 8. Scope Enforcement

모든 Scenario API는 Foundation 규칙을 따른다.

예시:

- BR Operator → BR 시나리오 → OK  
- BR Operator → MX 시나리오 → INVALID_SCOPE  
- Admin → 모든 접근 허용

---

# 9. Hot Reload

Scenario가 수정·검증·발행되면 SalesLab Engine에 즉시 반영.

`POST /operator/ops/hot-reload`

```json
{
  "type": "scenario",
  "targetId": "scenario_001",
  "scope": "BR"
}
```

---

# 10. Notes for DX & AntiGravity

- AG는 시나리오 구조를 **직접 수정하면 안 되며**,  
  항상 Operator Scenario API를 사용해야 한다.
- Prompt·Difficulty는 Scenario와 독립 계층이지만  
  Stage-level Override가 존재하는 경우  
  AG는 Prompt Resolution API를 반드시 사용해야 한다.
- Scenario 설계는 Content/Gamification/Missions와 상호작용하기 때문에  
  엔진 간 일관성 유지가 필수다.

---

# END — Step 2 (Scenario API v2)
