# Operator Console API Contract v2 — Step 1  
## Foundation Layer (Global Principles & Common Structures)

Status: FINAL • Applies to Steps 2–10 (Scenario, Prompt, Difficulty, Content, Gamification, UPM, Insights, Missions, System Ops)

---

## 0. 목적 (Scope & Purpose)

본 문서는 **Operator Console API Contract v2** 전체에 공통으로 적용되는  
기초 규약(Foundation Layer)을 정의한다.

이 규약은 다음 모든 영역에 **동일하게** 적용된다:

- Step 2: Scenario API v2  
- Step 3: Prompt API v2  
- Step 4: Difficulty API v2  
- Step 5: Content Management API v2  
- Step 6: Gamification API v2  
- Step 7: User Performance Monitor API v2  
- Step 8: Insights Engine API v2  
- Step 9: Mission & Quest API v2  
- Step 10: System Operations API v2  

DX팀·AntiGravity(AG)·백엔드가 **동일한 전역 규칙**을 사용하도록 하는 것이 목적이다.

---

## 1. API 철학 (Design Philosophy)

### 1.1 Predictable & Uniform

- 모든 엔드포인트는 **CRUD + ACTION 패턴**을 따른다.
- URL, HTTP Method, Request/Response 구조는 **일관된 규칙**을 갖는다.
- 같은 타입의 엔티티는 항상 유사한 이름과 스키마를 사용한다.

### 1.2 Immutable Versioning

- Scenario, Prompt, Difficulty, Content, Gamification, Missions 등  
  **모든 핵심 리소스는 `versionId`를 가진다.**
- `publish` 된 버전은 **수정 금지(immutable)** 이며,  
  수정이 필요한 경우 **항상 새 `versionId`**가 생성된다.
- 학습자/트레이너가 본 화면·시나리오는 언제나 **당시 버전 그대로** 유지되어야 한다.

### 1.3 Scope-based Access Control

- Operator의 작업 가능 범위는 항상 **Scope**에 의해 제한된다.
- 예시 Scope:
  - `global`
  - `region` (예: LATAM)
  - `country` (예: BR, MX)
  - `branch` (지점/매장 단위)
  - `team` (교육 팀 단위)
- Admin만이 **global 전체 Scope**에 접근 가능하다.

### 1.4 Hot Reload First

- Scenario / Prompt / Difficulty / Gamification / Insights / Missions / Content / Analytics 설정 변경은  
  최대한 **실시간에 가깝게 AI 엔진에 반영**되어야 한다.
- 이를 위해 공통 Hot Reload API를 두고,  
  모든 엔진 변경이 해당 API를 통해 동기화되도록 한다.

---

## 2. API 네임스페이스 구조 (High-level Tree)

최상위 Operator Console v2 API Tree는 다음 구조를 따른다.

```text
/operator
  /scenario          # Step 2
  /prompt            # Step 3
  /difficulty        # Step 4
  /content           # Step 5
  /gamification      # Step 6
  /user-monitor      # Step 7
  /insights          # Step 8
  /missions          # Step 9
  /ops               # Step 10 (System Operations, 공통 Hot Reload 포함)
```

각 Step 문서는 위 트리를 세부적으로 확장하는 형태로 작성된다.

---

## 3. 공통 헤더 & 인증 (Headers & Auth)

모든 Operator API 호출에는 최소한 다음 헤더가 포함되어야 한다.

```http
X-User-Id: string                # 호출자 계정 ID
X-Role: admin | operator         # 권한 유형
X-Scope: global|region|country|branch|team
X-Client-Version: string         # 클라이언트 앱 버전(선택)
```

- **Role**이 `admin`일 경우, Scope 제한을 초월할 수 있으나  
  Audit Log에 반드시 기록된다.
- **Role**이 `operator`일 경우, 항상 Scope 제한을 받는다.

실제 인증 방식(JWT, OAuth 등)은 인프라 레벨에서 관리하며  
본 문서에서는 **역할/스코프 처리 규칙만** 정의한다.

---

## 4. 공통 Response / Error 구조

### 4.1 성공 응답

```json
{
  "success": true,
  "data": { },
  "meta": {
    "version": "v2",
    "timestamp": 1712233444
  }
}
```

### 4.2 실패 응답

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SCOPE",
    "message": "You cannot access resources outside your permitted scope."
  },
  "meta": {
    "version": "v2",
    "timestamp": 1712233444
  }
}
```

### 4.3 에러 코드 예시

- `INVALID_SCOPE`  
- `UNAUTHORIZED`  
- `FORBIDDEN`  
- `NOT_FOUND`  
- `VALIDATION_ERROR`  
- `CONFLICT`  
- `INTERNAL_ERROR`

각 Step별 문서에서 엔티티 특화 에러 코드가 추가될 수 있다.

---

## 5. Versioning 규약 (Global Versioning Rules)

### 5.1 공통 필드

대부분의 주요 리소스는 아래 필드를 가진다.

```json
{
  "id": "string",
  "versionId": "string",
  "createdAt": 0,
  "updatedAt": 0,
  "published": false,
  "publishedVersion": "optional string"
}
```

### 5.2 규칙

1. **생성(Create)**  
   - 새 `id` + `versionId` 생성  
   - `published = false`

2. **수정(Update)**  
   - 기존 `id`는 유지  
   - **항상 새 `versionId` 생성**  
   - 이전 버전은 히스토리로 남김  
   - `published`는 기본적으로 false (publish API 호출 전까지)

3. **발행(Publish)**  
   - 특정 `versionId`를 `publishedVersion`으로 고정  
   - publishedVersion은 수정 불가(immutable)  
   - 학습자/트레이너는 publishedVersion만 보게 됨

4. **히스토리 조회**  
   - `/versions` 엔드포인트로 해당 `id`의 version 리스트 조회

---

## 6. Scope Enforcement 규칙

Scope는 모든 Operator API에 **자동으로 적용되어야 하는 1차 필터**이다.

### 6.1 공통 로직

1. 요청자의 `X-Role`과 `X-Scope`를 확인한다.  
2. 대상 리소스의 `scope` 필드를 확인한다.  
3. 다음 조건 중 하나라도 충족하지 않으면 요청을 거부한다.

```text
- 요청자 Role이 admin 이고, global-level 작업을 수행하는 경우 → 허용
- 요청자 Role이 operator 이고, 대상 리소스의 scope 가
  요청자 scope 의 하위/동일 범위인 경우 → 허용
- 그 외 → INVALID_SCOPE
```

예시:

- BR Operator가 MX 콘텐츠를 수정하려 할 경우  
  → `INVALID_SCOPE` 반환

- LATAM Region Operator가 BR 리소스에 접근하는 것은  
  → 조직 정책에 따라 허용/불허를 선택할 수 있으며,  
    구현 시 Scope 계층 관계를 명시적으로 정의해야 한다.

---

## 7. Hot Reload 공통 규칙

Hot Reload는 **엔진 설정 변경 → 런타임 반영**을 위한 통합 채널이다.  
각 Step에서 정의되는 엔진별 Hot Reload를 모두  
아래 공통 엔드포인트로 수렴할 수 있다.

### 7.1 공통 엔드포인트

`POST /operator/ops/hot-reload`

### 7.2 Request 예시

```json
{
  "type": "scenario | prompt | difficulty | content | gamification | insights | mission | analytics | all",
  "targetId": "optional",
  "scope": "BR"
}
```

- `type`  
  - 어떤 엔진 카테고리에 대한 Hot Reload인지 지정  
- `targetId`  
  - 특정 리소스/릴리즈 버전만 다시 로드할 경우 사용  
- `scope`  
  - 적용 지역(예: BR, MX 등)

각 Step 문서에서 구체적인 `type` 사용 패턴을 별도로 정의한다.

---

## 8. Audit Log (권장)

운영 환경에서는 주요 변경 작업에 대해 Audit Log를 남기는 것이 강력히 권장된다.

### 8.1 Audit Event 구조

```json
{
  "actor": "operator123",
  "action": "scenario.publish",
  "targetId": "scenario_0823",
  "scope": "BR",
  "timestamp": 1712223333,
  "details": {
    "versionId": "v3",
    "previousPublishedVersion": "v2"
  }
}
```

### 8.2 Audit 대상 예시

- Scenario Publish  
- Prompt Publish / Override  
- Difficulty Model 변경  
- Gamification Rule 변경 (XP/Badge/Mastery/Streak)  
- Mission Template Publish  
- System Ops (AI Config, Feature Toggle, Release Schedule) 변경  

Audit Log는 별도 DB/스토리지에 저장하되,  
Operator API Contract에서는 **“어떤 이벤트가 로그 대상인지”**만 정의한다.

---

## 9. 엔진 간 공통 합의사항

### 9.1 엔진 상호 의존성

- Scenario ↔ Prompt ↔ Difficulty  
  - SalesLab Engine의 기본 행동 3축  
- Content ↔ Gamification ↔ Missions  
  - 학습 경험 + 동기부여 구조  
- User Monitor ↔ Insights ↔ Missions  
  - 진단 → 추천 → 미션 자동 발행  
- System Ops ↔ 전 엔진  
  - 모델 설정, Feature Toggle, Release Schedule, Hot Reload

### 9.2 AG(LLM) 사용 규칙

- AG는 Scenario/Prompt/Difficulty/Content/Gamification/Insights 등  
  **엔진 설정 값을 “직접 수정”해서는 안 된다.**
- 모든 구조/설정 변경은 반드시  
  **Operator API를 통해서만 수행**되어야 한다.
- AG는 `resolve` 계열 API(예: `/prompt/resolve`, Difficulty Preview 등)를 사용하여  
  현재 활성 설정을 조회할 수는 있으나,  
  설정 값을 마음대로 조합/변형하여 외부에 저장하면 안 된다.

---

## 10. 이 문서 이후 Step 구조

- **Step 2 — Scenario API v2**  
  - `/operator/scenario/*` 전체 정의
- **Step 3 — Prompt Engineering API v2**  
  - `/operator/prompt/*` 전체 정의
- **Step 4 — Difficulty API v2**  
  - `/operator/difficulty/*` 전체 정의
- **Step 5 — Content API v2**
- **Step 6 — Gamification API v2**
- **Step 7 — User Performance Monitor API v2**
- **Step 8 — Insights Engine API v2**
- **Step 9 — Mission & Quest API v2**
- **Step 10 — System Operations API v2**

본 Foundation Layer 문서는  
위 Step 2–10 문서의 **상위 규범**으로서,  
향후 변경 시 모든 하위 문서도 함께 업데이트되어야 한다.
