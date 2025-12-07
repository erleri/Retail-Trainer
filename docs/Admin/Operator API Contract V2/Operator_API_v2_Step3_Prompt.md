# Operator Console API Contract v2 — Step 3  
## Prompt Engineering API v2 (Hierarchical Prompt Override Engine)

Status: FINAL — Defines the full multi-layer prompt system controlling AI customer behavior.

---

# 0. 목적 (Purpose)

Prompt Engineering API v2는 SalesLab Engine의 **고객 발화 스타일, 맥락, 감정 톤, 지식 수준** 등을 결정하는 핵심 계층 구조를 정의한다.  
프롬프트는 다음 4단계 Override 모델을 사용한다:

```
Stage Override  >  Scenario Override  >  Persona Override  >  Global Prompt
```

AG는 **반드시 Prompt Resolution API를 통해 최종 Prompt를 조회**해야 하며  
어떠한 상황에서도 임의로 Prompt Layer를 우회하거나 직접 덮어쓸 수 없다.

---

# 1. Prompt Object Structure

```json
{
  "promptId": "string",
  "versionId": "string",
  "layer": "global | persona | scenario | stage",
  "target": {
    "personaId": "optional string",
    "scenarioId": "optional string",
    "stageId": "optional string"
  },
  "content": "string",
  "metadata": {
    "lastEditedBy": "operator123",
    "createdAt": 1712233444,
    "updatedAt": 1712233555
  },
  "published": false
}
```

필수 규칙:
- 모든 Prompt는 **versionId 기반 immutable 구조** 사용  
- publish 전까지는 override 가능  
- publish 후에는 수정 불가 → 새 versionId로만 변경 가능  

---

# 2. Global Prompt API  
시스템 전체 기본 톤 규정.

### GET Global Prompt  
`GET /operator/prompt/global`

### UPDATE Global Prompt  
`PATCH /operator/prompt/global`

Request:
```json
{
  "content": "You are a customer interacting with a salesperson..."
}
```

Response → versionId 자동 생성.

---

# 3. Persona-level Prompt API  
페르소나(Character Type)에 따른 캐릭터 부여.

Base URL: `/operator/prompt/persona`

### GET Persona Prompt  
`GET /operator/prompt/persona/{personaId}`

### UPDATE Persona Prompt  
`PATCH /operator/prompt/persona/{personaId}`

Example:
```json
{
  "content": "As a gamer-type customer, you prefer short, casual responses."
}
```

### DELETE Persona Override  
`DELETE /operator/prompt/persona/{personaId}`  
→ Persona Prompt 제거 → Global Prompt 사용.

---

# 4. Scenario-level Prompt API  
특정 시나리오에서만 적용될 지시문.

`GET /operator/prompt/scenario/{scenarioId}`  
`PATCH /operator/prompt/scenario/{scenarioId}`  
`DELETE /operator/prompt/scenario/{scenarioId}`

Example:
```json
{
  "content": "In this scenario, emphasize price objections and focus on discount inquiries."
}
```

---

# 5. Stage-level Prompt API  
우선순위 최상위. Stage Override 존재 시 모든 하위 계층 무시.

`GET /operator/prompt/stage/{stageId}`  
`PATCH /operator/prompt/stage/{stageId}`  
`DELETE /operator/prompt/stage/{stageId}`

Example:
```json
{
  "content": "Customer becomes more cautious. Respond briefly and demand clarity."
}
```

---

# 6. Prompt Resolution API (AI MUST USE)

AG는 시나리오 실행 시 **무조건 이 API를 호출**해 최종 Prompt를 얻어야 한다.

### GET `/operator/prompt/resolve`

Query:
```
?personaId=xxx  
?scenarioId=yyy  
?stageId=zzz  
```

Response:
```json
{
  "resolvedPrompt": "string",
  "source": "stage",
  "layers": {
    "global": "...",
    "persona": "...",
    "scenario": "...",
    "stage": "..."
  }
}
```

장점:
- 운영자가 Override 우선순위를 완전히 통제  
- AG가 잘못된 프롬프트를 사용하는 위험 제거  

---

# 7. Prompt Validation API  
프롬프트 안전성 검사.

### POST `/operator/prompt/validate`

Checks:
- 금지 단어/토큰 포함 여부  
- 모델 직접 호출 문구 존재 여부  
- 민감 데이터 포함 여부  
- jailbreak 위험  

Response:
```json
{
  "valid": true,
  "warnings": []
}
```

---

# 8. Prompt Versioning API  
문서 이력 추적.

`GET /operator/prompt/versions/{promptId}`

---

# 9. Publish Prompt API  
발행된 Prompt는 immutable.

`POST /operator/prompt/{promptId}/publish`

---

# 10. Hot Reload

Prompt가 변경되면 SalesLab Engine은 즉시 반영해야 한다.

`POST /operator/ops/hot-reload`

```json
{
  "type": "prompt",
  "target": "persona | scenario | stage | global"
}
```

---

# 11. Scope Enforcement

예시:

- BR Operator → BR Persona Prompt 수정 가능  
- BR Operator → MX Scenario Prompt 수정 불가 → INVALID_SCOPE  
- Admin → 모든 Prompt 계층 접근 가능

---

# 12. AG / DX Implementation Notes

1. AG는 절대 Prompt 구조를 직접 변경하면 안 된다.  
2. AG는 Prompt Resolution API로만 최종 Prompt를 얻는다.  
3. 오퍼레이터가 수정을 하면 반드시 Hot Reload 발생.  
4. Prompt Layer는 Scenario/Stage와 독립적이지만 Stage Override가 존재하면 **그게 절대적 우선순위**.

---

# END — Step 3 (Prompt Engineering API v2)
