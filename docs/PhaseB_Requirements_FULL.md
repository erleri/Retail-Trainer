# 📘 AntiGravity Retail AI Trainer – Phase B 요구사항서
_저장 & 액션 연결 (Storage & Actions Implementation)_  
**버전:** Phase B / 2025  
**작성:** GTM AI Agent

---

## # 1. 개요

Phase B의 목표는 **“사용자가 누른 액션이 실제로 저장·수정·삭제·조회되는 운영 가능한 상태”**를 만드는 것이다.  
**공통 패턴 확립 → Sales Lab 적용 → 전 모듈 확장** 순서로 진행한다.

---

## # 2. 전체 전략

1. **2-1 공통 인프라**  
   - Storage 전략  
   - UploadedFile 스키마  
   - 공통 액션 패턴(useOperatorAction)  
2. **2-2 Sales Lab Management에 우선 적용하여 패턴 검증**
3. **2-3~2-6 모든 모듈에 동일 패턴 재적용**

---

## # 3. 공통 인프라 (2-1)

---

### ## 3.1 Storage 전략

#### 3.1.1 파일 구성
- 저장소: S3 또는 AG 오브젝트 스토리지  
- 메타데이터: `files` 테이블  

#### 3.1.2 UploadedFile 스키마

```ts
export type FileContextType =
  | "scenario"
  | "prompt_template"
  | "quiz"
  | "resource"
  | "session_log";

export interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;

  contextType: FileContextType;
  contextId?: string;

  scope?: {
    region?: string;
    country?: string;
    branch?: string;
  };

  version?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
}
```

#### 3.1.3 파일 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/files` | 파일 업로드 + 메타데이터 저장 |
| PATCH | `/files/:id` | contextId, version, tags 등 업데이트 |
| GET | `/files?contextType=&contextId=` | 특정 엔티티의 파일 조회 |

---

### ## 3.2 공통 액션 패턴 (Save/Update/Delete)

모든 CRUD UI는 **동일 플로우**를 따른다.

1. Save/Delete 실행  
2. 성공 토스트 출력  
3. 관련 리스트 invalidate  
4. Drawer/Form 자동 닫힘  

#### 공통 훅 (useOperatorAction)

```ts
export function useOperatorAction(options) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (data, vars) => {
      showToast({ type: "success", message: options.successMessage });
      (options.invalidateKeys ?? []).forEach((key) =>
        qc.invalidateQueries({ queryKey: key })
      );
      options.onCloseDrawer?.();
    },
    onError: () => {
      showToast({ type: "error", message: options.errorMessage });
    },
  });
}
```

#### 개발 규칙

- queryKey는 **배열 기반 통일**  
  예:  
  - `['scenarios']`  
  - `['scenario-rules', scenarioId]`
- 모든 CRUD는 반드시 `useOperatorAction` 사용
- 토스트는 공통 Toast 컴포넌트 사용

---

## # 4. Sales Lab Management (2-2)

---

### ## 4.1 Scenario Builder

#### 4.1.1 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scenarios` | 리스트 조회 |
| GET | `/scenarios/:id` | 단일 조회 |
| POST | `/scenarios` | 생성 |
| PATCH | `/scenarios/:id` | 수정 |
| DELETE | `/scenarios/:id` | 삭제 |
| GET | `/scenario-rules?scenarioId=` | Rule 목록 조회 |

#### 4.1.2 액션 플로우

1. Scenario 폼 저장  
2. invalidate  
   - `['scenarios']`  
   - `['scenario-rules', scenarioId]`  
3. Drawer 닫힘  

#### 4.1.3 예시

```ts
const scenarioAction = useOperatorAction({
  mutationFn: (v) => (v.id ? api.updateScenario(v) : api.createScenario(v)),
  invalidateKeys: [['scenarios'], ['scenario-rules', v.id]],
  successMessage: "Scenario saved.",
  onCloseDrawer: closeScenarioDrawer,
});
```

---

### ## 4.2 Prompt Engineering

#### 4.2.1 PromptTemplate 스키마

```ts
export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  version: string;
  scenarioId?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
```

#### 4.2.2 요구사항
- 템플릿 CRUD  
- 버전 관리(`baseVersionId`)  
- Scenario/Mission/Role 매핑  
- 최신/전체 보기 토글  

---

### ## 4.3 파일 처리

#### 플로우

1. Scenario 상세 화면 → “리소스 업로드”
2. `POST /files` (contextType=scenario, contextId=scenarioId)
3. 성공 → invalidate:  
   - `['files', scenarioId]`

#### 다음 세션 자동 로드
- Scenario fetch 시 파일 리스트 포함 조회  
- 또는 React Query 별도 쿼리 캐싱 활용

---

## # 5. Admin Dashboard (2-3)

---

### ## 5.1 Widget Config

```ts
export interface DashboardWidgetConfig {
  id: string;
  type: "kpi" | "chart" | "table";
  queryKey: string[];
  endpoint: string;
  defaultFilters?: Record<string, any>;
}
```

### ## 5.2 공통 훅: useDashboardWidget

- queryKey = `[config.queryKey, filters]`
- filters 변경 시 자동 refetch

### ## 5.3 Drill-down 규칙

- onClick →  
  - `navigate('/admin/detail', { state: { filter } })`  
  또는  
  - `openDrawer('detail', { filter })`

---

## # 6. Content Management (2-4)

---

### ## 6.1 파일 업로드 + 콘텐츠 등록

- `POST /files` 후  
- `POST /contents`  
- 성공 후 리스트 invalidate

### ## 6.2 Quiz 데이터 구조

```ts
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  scenarioId?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: "single" | "multi" | "text";
  prompt: string;
  options?: { id: string; text: string; isCorrect?: boolean }[];
}
```

### ## 6.3 기능 요구사항

- Quiz CRUD  
- Scenario 매핑 (`PATCH /quizzes/:id/scenario`)  
- 저장 후 invalidate + 토스트

---

## # 7. Data & Analytics (2-5)

---

### ## 7.1 로그 저장

#### 저장 원칙
- 프론트는 최소 이벤트만 전송  
  - 세션 시작 / 종료  
  - 주요 스텝 이동  
  - 정답 제출  

#### 로그 스키마

```ts
export interface SessionLog {
  id: string;
  userId: string;
  sessionId: string;
  scenarioId?: string;
  startedAt: string;
  endedAt?: string;
}

export interface InteractionLog {
  id: string;
  sessionId: string;
  step: string;
  actionType: string;
  payload: any;
  createdAt: string;
}
```

### ## 7.2 Analytics 조회

- 공통 훅: `useAnalytics(queryKey, filters)`
- 필터 변경 → 자동 refetch  
- Dashboard 패턴과 동일

---

## # 8. User & Settings (2-6)

---

### ## 8.1 User 스키마

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "operator" | "trainer" | "promoter" | "admin";
  scopes?: {
    region?: string;
    country?: string;
    branch?: string;
  }[];
}
```

### ## 8.2 기능 요구사항
- User CRUD  
- Role 변경  
- Scope 지정  
- 모든 저장/삭제는 `useOperatorAction` 사용

---

### ## 8.3 시스템 설정 + Audit Log

#### Setting 스키마

```ts
export interface SystemSetting {
  key: string;
  value: any;
  updatedAt: string;
  updatedBy: string;
}
```

#### 요구사항
- `PATCH /settings/:key` 로 변경  
- 변경 시 서버에서 Audit Log 자동 기록  
- Audit Log 조회: `GET /audit-logs`

---

## # 9. Phase B 개발 체크리스트

| 항목 | 설명 |
|------|-------|
| Storage 전략 확정 | S3/AG 스토리지 + files 테이블 |
| UploadedFile 스키마 | contextType 포함 |
| 공통 액션 패턴 | useOperatorAction |
| queryKey 규칙 | 배열 기반 통일 |
| Scenario Builder 적용 | CRUD + Rule invalidate |
| Prompt Engine | 버전관리 + 매핑 |
| File Upload | context 연동 |
| Dashboard | Widget + Filters |
| Content | Quiz CRUD + 매핑 |
| Analytics | 로그 저장 + 조회 |
| User & Settings | Role/Scope + Audit Log |

---

