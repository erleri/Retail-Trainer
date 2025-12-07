# Operator Console API Contract v2 — Step 10  
## System Operations API v2 (Ops / Governance / Release Control)

Status: FINAL — Defines operational APIs for model config, AI runtime controls,  
feature toggles, release versioning, health checks, and hot reload of all engines.

---

# 0. 목적 (Purpose)

System Operations API v2는 Retail AI Trainer 전체 엔진의 실행 환경을 통제한다:

1. AI 모델 설정(Model Config)  
2. Temperature/Max Tokens/Tone Profile  
3. Feature Toggle 관리  
4. 엔진 Hot Reload  
5. Release/Version 관리  
6. Health & Diagnostics  
7. Rate Limit & Safety Layer  

---

# 1. Model Configuration API

## 1.1 Get Model Config  
`GET /operator/ops/model-config`

```json
{
  "model": "gpt-5.1",
  "temperature": 0.4,
  "maxTokens": 4096,
  "toneProfile": "professional",
  "language": "auto",
  "enabled": true
}
```

## 1.2 Update Model Config  
`PATCH /operator/ops/model-config`

```json
{
  "model": "gpt-5.1",
  "temperature": 0.2,
  "toneProfile": "coaching",
  "language": "ko"
}
```

---

# 2. Feature Toggle API

## 2.1 Get Feature Toggles  
`GET /operator/ops/features`

```json
{
  "mission_auto_assign": true,
  "insight_generation": true,
  "quiz_auto_generate": false,
  "content_ai_transform": true
}
```

## 2.2 Update Feature Toggle  
`PATCH /operator/ops/features/{featureKey}`

```json
{
  "enabled": false
}
```

---

# 3. Engine Hot Reload API

## 3.1 Hot Reload Trigger  
`POST /operator/ops/hot-reload`

```json
{
  "type": "scenario | prompt | difficulty | content | gamification | upm | insights | mission | system",
  "targetId": "ruleset_v12"
}
```

---

# 4. Release Versioning API

## 4.1 List Release Versions  
`GET /operator/ops/releases`

```json
[
  { "version": "1.0.4", "notes": "Updated difficulty rules", "date": 1712100000 },
  { "version": "1.0.5", "notes": "Added new mission templates", "date": 1712200000 }
]
```

## 4.2 Create New Release  
`POST /operator/ops/releases`

```json
{
  "version": "1.0.6",
  "notes": "Insight scoring adjustments + new content modules",
  "includedEngines": ["insights", "content", "missions"]
}
```

## 4.3 Rollback Release  
`POST /operator/ops/releases/rollback`

```json
{
  "targetVersion": "1.0.4"
}
```

---

# 5. System Health & Diagnostics

## 5.1 System Health  
`GET /operator/ops/health`

```json
{
  "status": "ok",
  "latencyMs": 122,
  "uptimeHours": 552,
  "engines": {
    "scenario": "ok",
    "prompt": "ok",
    "difficulty": "ok",
    "content": "ok",
    "gamification": "ok",
    "missions": "ok",
    "upm": "ok",
    "insights": "ok"
  }
}
```

## 5.2 Diagnostics Report  
`GET /operator/ops/diagnostics`

```json
{
  "cpu": 0.41,
  "memory": 0.63,
  "errorRate": 0.002,
  "timeouts": 12,
  "slowQueries": [
    { "endpoint": "/operator/upm/summary", "avgMs": 862 }
  ]
}
```

---

# 6. Rate Limit & Safety Layer

## 6.1 Get Limits  
`GET /operator/ops/limits`

```json
{
  "aiCallsPerMinute": 60,
  "fileUploadLimitMb": 200,
  "maxConcurrentSessions": 30
}
```

## 6.2 Update Limits  
`PATCH /operator/ops/limits`

---

# 7. Audit Logging

## 7.1 Query Audit Log  
`GET /operator/ops/audit`

Query:
```
?userId=
?action=predict|publish|reload|update_config
?from=timestamp
?to=timestamp
```

---

# 8. Scope Enforcement

| Operation | Branch | Country | Region | Admin |
|----------|--------|---------|--------|--------|
| Model Config | ❌ | ❌ | ❌ | ✅ |
| Feature Toggle | ❌ | ❌ | ⚠️ 일부 | ✅ |
| Hot Reload | ❌ | ⚠️ | ⚠️ | ✅ |
| Release Create | ❌ | ❌ | ❌ | ✅ |
| Health Check | ⚠️ 제한 | ⚠️ | ⚠️ | ✅ |

---

# 9. DX & AG Notes

### AG MUST:
- Ops 설정(temperature, tone, features)을 항상 준수  
- Hot Reload 반영  
- Diagnostics/Release 데이터 조작 금지  

### DX MUST:
- 모든 엔진 변경은 Ops Layer에서 versioned 적용  
- Hot Reload 실패 대비 rollback 구현  
- Audit Log를 tamper-proof로 유지  

---

# END — Step 10 (System Operations API v2)
