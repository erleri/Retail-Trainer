# Retail AI Trainer – Operator API Contract v1
Base path: `/api/operator`  
Purpose: Operator Console(웹·모바일) ↔ Core Engine 간 통신 규약 정의

---

## 0. 공통 규칙 (Common Conventions)

### 0.1 Transport
- Protocol: HTTPS
- Format: JSON (UTF-8)
- Base Path: `/api/operator`

### 0.2 HTTP 메서드 규칙
- `GET`   : 조회
- `POST`  : 생성
- `PUT`   : 전체 업데이트(대체)
- `PATCH` : 부분 업데이트 (필요 시)
- `DELETE`: 삭제/비활성화

### 0.3 공통 응답 형식

```json
{
  "success": true,
  "data": { },
  "error": null
}
```

- `success`: boolean, 요청 성공 여부
- `data`: 성공 시 응답 페이로드 (엔티티/리스트/메타 정보)
- `error`: 실패 시 에러 정보 객체, 성공 시 `null`

에러 예시:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "mainTraits must have exactly 2 items.",
    "details": {
      "field": "mainTraits",
      "expected": 2,
      "actual": 1
    }
  }
}
```

---

## 1. Product Catalog API

Product Catalog는 Sales Lab의 제품 구조 전체(타입·카테고리·모델·사이즈·지역별 override)를 관리한다.

### 1.1 전체 카탈로그 조회

`GET /api/operator/product-catalog`

#### Response

```json
{
  "success": true,
  "data": {
    "catalog": {
      "types": ["TV", "Soundbar"],
      "categories": {
        "TV": ["OLED evo", "OLED", "QNED"]
      },
      "models": {
        "OLED evo": [
          {
            "id": "oled-c5-55",
            "name": "LG OLED evo C5",
            "line": "Premium",
            "categoryKey": "OLED evo",
            "typeLabel": "Premium",
            "basePrice": 2300,
            "sizes": [55, 65, 77],
            "isActive": true,
            "regionOverrides": {
              "BR": {
                "basePrice": 2499,
                "sizes": [65, 77]
              }
            }
          }
        ]
      }
    }
  },
  "error": null
}
```

> `catalog`는 **Core Engine Spec v2의 `ProductCatalog` 스키마**를 그대로 사용한다.

---

### 1.2 카탈로그 저장/전체 업데이트

`PUT /api/operator/product-catalog`

- 설명: 전체 ProductCatalog를 대체 저장
- 사용 시점: Operator가 대량 편집 후 “Save All” 할 때

#### Request Body

```json
{
  "catalog": {
    "types": ["TV", "Soundbar"],
    "categories": { "TV": ["OLED evo", "OLED"] },
    "models": { "OLED evo": [ /* ProductModel[] */ ] }
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "catalog": { /* 저장된 ProductCatalog */ }
  },
  "error": null
}
```

---

### 1.3 개별 모델 CRUD (선택 구현)

#### 1.3.1 모델 생성

`POST /api/operator/products/models`

```json
{
  "model": { /* ProductModel */ }
}
```

#### 1.3.2 모델 수정

`PUT /api/operator/products/models/{id}`

```json
{
  "model": { /* ProductModel */ }
}
```

#### 1.3.3 모델 비활성화/삭제

`DELETE /api/operator/products/models/{id}`

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

---

## 2. Size Tier Config API

초대형(75, 80+) 전략 등 사이즈 티어 규칙 관리.

### 2.1 조회

`GET /api/operator/size-tiers`

```json
{
  "success": true,
  "data": {
    "configs": [
      {
        "region": "GLOBAL",
        "tiers": [
          { "name": "standard", "minInch": 0, "maxInch": 55 },
          { "name": "large", "minInch": 60, "maxInch": 65 },
          { "name": "xl", "minInch": 70, "maxInch": 75 },
          { "name": "xxl", "minInch": 80 }
        ]
      }
    ]
  },
  "error": null
}
```

### 2.2 저장(전체 갱신)

`PUT /api/operator/size-tiers`

```json
{
  "configs": [ /* SizeTierConfig[] */ ]
}
```

---

## 3. Trait API

TraitDefinition + TraitLinkages 관리.

### 3.1 TraitDefinitions 조회

`GET /api/operator/traits`

```json
{
  "success": true,
  "data": {
    "traits": [ /* TraitDefinition[] */ ]
  },
  "error": null
}
```

### 3.2 TraitDefinitions 저장(배치)

`PUT /api/operator/traits`

```json
{
  "traits": [ /* TraitDefinition[] */ ]
}
```

### 3.3 개별 Trait CRUD (선택)

- `POST /api/operator/traits` – 생성
- `PUT /api/operator/traits/{id}` – 수정
- `DELETE /api/operator/traits/{id}` – 삭제/비활성화

---

### 3.4 TraitLinkages 조회/저장

`GET /api/operator/traits/linkages`

```json
{
  "success": true,
  "data": {
    "linkages": {
      "gamer_oriented": ["tech_oriented", "quick_decider"]
    }
  },
  "error": null
}
```

`PUT /api/operator/traits/linkages`

```json
{
  "linkages": { /* TraitLinkages */ }
}
```

---

## 4. Persona API

### 4.1 전체 조회

`GET /api/operator/personas`

Query Params (선택):
- `region` (예: `BR`, `GLOBAL`)

```json
{
  "success": true,
  "data": {
    "personas": [ /* Persona[] */ ]
  },
  "error": null
}
```

### 4.2 단일 조회

`GET /api/operator/personas/{id}`

```json
{
  "success": true,
  "data": {
    "persona": { /* Persona */ }
  },
  "error": null
}
```

### 4.3 생성

`POST /api/operator/personas`

```json
{
  "persona": {
    "id": "budget_seeker",
    "name": "Budget Seeker",
    "shortDescription": "Price-sensitive 20s",
    "ageGroup": "20s_30s",
    "gender": "male",
    "mainTraits": ["price_sensitive", "quick_decider"],
    "hiddenTrait": "risk_averse",
    "regions": ["GLOBAL"]
  }
}
```

### 4.4 수정

`PUT /api/operator/personas/{id}`

```json
{
  "persona": { /* Persona */ }
}
```

### 4.5 삭제

`DELETE /api/operator/personas/{id}`

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

> Validation: `mainTraits.length`는 항상 2, `hiddenTrait`는 1개여야 한다.

---

## 5. Difficulty API

### 5.1 조회

`GET /api/operator/difficulties`

```json
{
  "success": true,
  "data": {
    "levels": [ /* DifficultyLevel[] */ ]
  },
  "error": null
}
```

### 5.2 저장(배치)

`PUT /api/operator/difficulties`

```json
{
  "levels": [ /* DifficultyLevel[] */ ]
}
```

> 레벨(`level`) 값은 1~5 정수로 고정.  

---

## 6. Upsell Rule API

UpsellRule CRUD 및 Rule 활성/비활성 관리.

### 6.1 리스트 조회

`GET /api/operator/upsell-rules`

Query Params (선택):
- `active` (true/false)
- `stage`
- `traitId`

```json
{
  "success": true,
  "data": {
    "rules": [ /* UpsellRule[] */ ]
  },
  "error": null
}
```

### 6.2 단일 Rule 조회

`GET /api/operator/upsell-rules/{id}`

```json
{
  "success": true,
  "data": {
    "rule": { /* UpsellRule */ }
  },
  "error": null
}
```

### 6.3 Rule 생성

`POST /api/operator/upsell-rules`

```json
{
  "rule": {
    "id": "upsell_movie_lover_size",
    "label": "Movie Lover – Size Upgrade",
    "description": "영화/가족 고객을 XL 이상으로 유도",
    "customer": {
      "includeTraits": ["movie_lover", "family_oriented"],
      "minDifficulty": 2
    },
    "product": {
      "type": "TV",
      "currentSizeTiers": ["standard", "large"]
    },
    "scenario": {
      "stage": "recommendation"
    },
    "actions": [
      {
        "type": "recommend_size",
        "params": {
          "targetMinTier": "xl",
          "minTierIncrease": 1,
          "allowXXL": true,
          "respectBudgetSensitivity": true
        }
      }
    ],
    "messages": [
      {
        "id": "movie_xl_msg1",
        "template": "영화를 자주 보신다면, {recommendedSize}\" 이상에서 몰입감 차이가 확실합니다.",
        "tone": "friendly"
      }
    ]
  }
}
```

### 6.4 Rule 수정

`PUT /api/operator/upsell-rules/{id}`

```json
{
  "rule": { /* UpsellRule */ }
}
```

### 6.5 Rule 삭제

`DELETE /api/operator/upsell-rules/{id}`

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

(필요 시 soft-delete / `isActive` 필드 추가는 구현단에서 가능하나, Contract에서는 필수로 강제하지 않음.)

---

## 7. Scenario API

Stage / Trigger 관리.

### 7.1 Stage 조회

`GET /api/operator/scenario/stages`

```json
{
  "success": true,
  "data": {
    "stages": [ /* ScenarioStage[] */ ]
  },
  "error": null
}
```

### 7.2 Stage 저장(배치)

`PUT /api/operator/scenario/stages`

```json
{
  "stages": [ /* ScenarioStage[] */ ]
}
```

### 7.3 Trigger 조회

`GET /api/operator/scenario/triggers`

```json
{
  "success": true,
  "data": {
    "triggers": [ /* ScenarioTrigger[] */ ]
  },
  "error": null
}
```

### 7.4 Trigger 저장(배치)

`PUT /api/operator/scenario/triggers`

```json
{
  "triggers": [ /* ScenarioTrigger[] */ ]
}
```

---

## 8. Simulation API

Operator Console에서 설정을 테스트하기 위한 간단한 시뮬레이션 엔드포인트.

### 8.1 시뮬레이션 실행

`POST /api/operator/simulation/run`

#### Request

```json
{
  "personaId": "budget_seeker",
  "difficultyLevel": 3,
  "traitsOverride": ["price_sensitive", "movie_lover"],
  "initialStageId": "greeting",
  "productContext": {
    "type": "TV",
    "category": "OLED evo",
    "modelId": "oled-c5-55",
    "size": 55,
    "region": "GLOBAL"
  },
  "maxTurns": 8
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "turns": [
      {
        "turnIndex": 1,
        "speaker": "customer",
        "utterance": "안녕하세요, 거실에 둘 TV를 보고 있어요.",
        "firedRules": [],
        "stageId": "greeting"
      },
      {
        "turnIndex": 4,
        "speaker": "customer",
        "utterance": "영화 자주 보는 편인데, 사이즈는 얼마나 큰 게 좋을까요?",
        "firedRules": ["upsell_movie_lover_size"],
        "stageId": "recommendation"
      }
    ]
  },
  "error": null
}
```

> 이 엔드포인트는 **디버깅/교육용**이며, 실제 고객 세션 엔드포인트와 분리할 것을 권장한다.

---

## 9. Content Management API

Content Management API는 **학습 자료(SourceContent) 업로드 → AI 기반 LearningModule/QuizDraft 생성 → 모듈 편집/배포**를 위해 Admin/Operator가 사용하는 엔드포인트를 정의한다.

Base path: `/api/operator/content`

### 9.1 SourceContent 업로드

`POST /api/operator/content/source`

관리자가 PDF/PPT/텍스트 등 원본 학습 자료를 업로드할 때 사용한다.

#### Request (JSON 메타데이터 + 파일 업로드의 경우 multipart/form-data)

```json
{
  "title": "OLED vs QNED 세일즈톡 스크립트",
  "rawType": "pdf",              // pdf | ppt | text 등
  "language": "ko",
  "productTags": ["OLED", "QNED"],
  "skillTags": ["BrightnessObjection", "ColorVolume"]
}
```

> 파일 본문은 인프라 구성에 따라 `multipart/form-data` 또는 사전 업로드된 `fileUrl` 방식 중 하나를 사용한다.  
> 이 Contract는 메타데이터 구조만을 정의한다.

#### Response

```json
{
  "success": true,
  "data": {
    "sourceContentId": "src_123",
    "title": "OLED vs QNED 세일즈톡 스크립트"
  },
  "error": null
}
```

---

### 9.2 SourceContent 목록 조회

`GET /api/operator/content/source`

#### Query 예시

- `?page=1&pageSize=20`
- `?language=ko&productTag=OLED`

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "src_123",
        "title": "OLED vs QNED 세일즈톡 스크립트",
        "rawType": "pdf",
        "language": "ko",
        "createdAt": "2025-12-01T10:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 5
  },
  "error": null
}
```

---

### 9.3 SourceContent 상세 조회

`GET /api/operator/content/source/{sourceId}`

원본 텍스트/추출된 텍스트, 태그 정보 등을 확인할 때 사용한다.

#### Response (예시)

```json
{
  "success": true,
  "data": {
    "id": "src_123",
    "title": "OLED vs QNED 세일즈톡 스크립트",
    "rawType": "pdf",
    "language": "ko",
    "productTags": ["OLED", "QNED"],
    "skillTags": ["BrightnessObjection"],
    "rawText": "세일즈톡 본문 일부...",
    "createdAt": "2025-12-01T10:00:00Z"
  },
  "error": null
}
```

---

### 9.4 LearningModule 자동 생성 트리거

`POST /api/operator/content/source/{sourceId}/generate`

지정된 SourceContent로부터 **LearningModule + QuizDraft**를 자동 생성한다.

#### Request

```json
{
  "forceRegenerate": false
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "learningModuleId": "lm_456",
    "quizDraftId": "qzd_789",
    "status": "draft"        // 항상 draft 상태로 생성
  },
  "error": null
}
```

> 실제 생성 규칙은 `Content Management Spec v1` 및  
> `AG_Content_Transformation_Compact_Prompt` 문서를 따라야 한다.

---

### 9.5 LearningModule 조회/수정

`GET /api/operator/content/modules/{moduleId}`  
`PUT /api/operator/content/modules/{moduleId}`

Admin이 AI가 생성한 모듈 블록을 검토·수정할 수 있어야 한다.

#### GET Response (예시)

```json
{
  "success": true,
  "data": {
    "id": "lm_456",
    "sourceContentId": "src_123",
    "title": "OLED vs QNED 핵심 포인트",
    "description": "프로모터용 요약 학습 모듈",
    "blocks": [
      {
        "id": "blk_1",
        "type": "title",
        "order": 1,
        "content": "왜 OLED인가?"
      },
      {
        "id": "blk_2",
        "type": "key_points",
        "order": 2,
        "content": "- 완벽한 블랙\n- 빠른 응답속도"
      }
    ],
    "estimatedMinutes": 7,
    "skillTags": ["BrightnessObjection"],
    "difficultyLevel": 2,
    "status": "draft"
  },
  "error": null
}
```

#### PUT Request (예시)

```json
{
  "title": "OLED vs QNED 핵심 요약 (수정본)",
  "description": "수정된 프로모터용 학습 모듈",
  "blocks": [
    {
      "id": "blk_1",
      "type": "title",
      "order": 1,
      "content": "왜 OLED인가? (업데이트)"
    }
  ],
  "estimatedMinutes": 8,
  "skillTags": ["BrightnessObjection"],
  "difficultyLevel": 2,
  "status": "draft"
}
```

---

### 9.6 LearningModule Publish

`POST /api/operator/content/modules/{moduleId}/publish`

모듈을 `published` 상태로 전환하여 User App에 노출할 수 있도록 한다.

#### Request

```json
{
  "publish": true
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "moduleId": "lm_456",
    "status": "published"
  },
  "error": null
}
```

> Quiz 확정/활성화 엔드포인트는 추후 `Quiz API` 섹션에서 별도 정의할 수 있다.  
> 본 v1.1에서는 최소한 LearningModule 수명주기만 포함한다.


---

## 10. 요약

- 이 API Contract v1은 **Core Engine Spec v2** 및 **Operator Console UI Spec**과 1:1로 매핑된다.
- AG/백엔드는 이 규약을 기준으로:
  - DB 스키마,
  - REST API,
  - Operator Console 연동,
  - Simulation 기능
  을 구현해야 한다.
- **필드명·엔드포인트·JSON 구조를 임의 변경하지 않는 것**이 핵심이다.
