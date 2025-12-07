# Operator Console API Contract v2 — Step 4  
## Difficulty Engine API v2 (Behavioral Complexity & Resistance Model)

Status: FINAL — Defines the complete difficulty model controlling customer resistance, objection patterns, emotional variance, knowledge depth, and response complexity.

---

# 0. 목적 (Purpose)

Difficulty API v2는 AI 고객의 **종합적 난이도(Behavioral Difficulty)**를 수치화하고,  
Persona/Trait/Scenario 조건에 따라 행동 난이도를 동적으로 조정할 수 있도록 설계된 엔진이다.

Difficulty는 SalesLab Engine의 3대 핵심 축 중 하나로:  
- Scenario 흐름의 난이도 제한  
- Prompt 톤 및 복잡도 영향  
- Objection 패턴 및 Upsell 저항성 조절  
에 직접 관여한다.

---

# 1. Difficulty Object Structure

```json
{
  "difficultyId": "string",
  "versionId": "string",
  "level": 1,
  "parameters": {
    "upsellResistance": 0.2,
    "objectionFrequency": 0.4,
    "emotionalVariance": 0.1,
    "knowledgeDepth": 0.2,
    "responseComplexity": 0.3
  },
  "modifiers": {
    "persona": {
      "gamer": +0.1
    },
    "trait": {
      "price_sensitive": +0.2
    }
  },
  "scenarioBands": {
    "scenario_001": [1, 3]
  },
  "createdAt": 0,
  "updatedAt": 0,
  "published": false,
  "scope": "global"
}
```

### 필드 설명
- **parameters**  
  AI 행동의 핵심 파라미터(0~1 사이 수치).
- **modifiers.persona**  
  특정 페르소나가 난이도를 올리거나 낮춤.
- **modifiers.trait**  
  특정 트레잇이 난이도를 추가로 조정.
- **scenarioBands**  
  시나리오별 허용 난이도 범위(예: 1~3 레벨만 사용 가능).

---

# 2. Global Difficulty Preset API  
기본 레벨(1~5)의 난이도를 조정하는 API.

## GET Global Difficulty  
`GET /operator/difficulty/global`

## UPDATE Global Difficulty Level  
`PATCH /operator/difficulty/global/{level}`

Request:
```json
{
  "parameters": {
    "upsellResistance": 0.3,
    "objectionFrequency": 0.6,
    "emotionalVariance": 0.3,
    "knowledgeDepth": 0.3,
    "responseComplexity": 0.5
  }
}
```

Response → versionId 생성, published=false

---

# 3. Persona Difficulty Modifier API

특정 Persona가 난이도에 미치는 기본 효과.

`PATCH /operator/difficulty/modifier/persona/{personaId}`  
`DELETE /operator/difficulty/modifier/persona/{personaId}`

Example:
```json
{
  "modifier": +0.15
}
```

---

# 4. Trait Difficulty Modifier API

특정 Trait이 난이도에 미치는 추가 효과.

`PATCH /operator/difficulty/modifier/trait/{traitId}`  
`DELETE /operator/difficulty/modifier/trait/{traitId}`

Example:
```json
{
  "modifier": -0.2
}
```

---

# 5. Scenario Difficulty Band API

Scenario에 허용된 난이도 제한 정의.

`GET /operator/difficulty/scenario/{scenarioId}`  
`PATCH /operator/difficulty/scenario/{scenarioId}`  
`DELETE /operator/difficulty/scenario/{scenarioId}`

Example:
```json
{
  "range": [2, 4]
}
```

---

# 6. Predictive Preview API  
Difficulty 수준에 따른 예상 행동 패턴을 예측.

`POST /operator/difficulty/preview`

Request:
```json
{
  "level": 3,
  "persona": "gamer",
  "traits": ["price_sensitive"],
  "scenarioId": "scenario_001"
}
```

Response:
```json
{
  "estimatedObjections": 3,
  "estimatedTurns": 12,
  "upsellSuccessLikelihood": 0.41,
  "behaviorProfile": "price-focused, factual tone"
}
```

---

# 7. Validation API

`POST /operator/difficulty/validate`

Checks:
- parameters 수치 범위(0~1)  
- persona/trait modifier 충돌  
- scenario band 논리 오류  
- composite difficulty 음수/초과 방지  

Response:
```json
{
  "valid": true,
  "errors": []
}
```

---

# 8. Publish Difficulty Model

`POST /operator/difficulty/{difficultyId}/publish`

결과:
- versionId → publishedVersion으로 고정  
- 수정 불가(immutable)  

---

# 9. Version History

`GET /operator/difficulty/versions/{difficultyId}`

---

# 10. Scope Enforcement

규칙:
- Operator는 자신의 scope 내 difficulty 설정만 변경 가능  
- 국가/지점 외 엔진에 접근 시 → INVALID_SCOPE  
- Admin은 글로벌 전체 허용

---

# 11. Hot Reload (Required)

Difficulty 변경은 즉시 SalesLab Engine에 반영해야 한다.

`POST /operator/ops/hot-reload`

Payload:
```json
{
  "type": "difficulty",
  "targetId": "difficulty_global_v23",
  "scope": "BR"
}
```

---

# 12. Notes for DX & AG

- Difficulty는 Scenario/Stage 실행 시 **고객 행동의 기반값**으로 사용됨.  
- Difficulty Modifier(persona/trait) 적용 순서:  
```
Global Difficulty → Persona Modifier → Trait Modifier → Scenario Band
```
- ScenarioBand는 최종 허용 범위로, 범위 밖의 difficulty는 자동 보정된다.
- AG는 Difficulty를 직접 변경할 수 없으며 Preview API만 조회 가능.
- Difficulty 변화는 Prompt Resolution 및 Scenario 흐름 변화에도 영향을 미침.

---

# END — Step 4 (Difficulty API v2)
