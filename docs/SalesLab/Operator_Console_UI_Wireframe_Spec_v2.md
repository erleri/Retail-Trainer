# Retail AI Trainer – Operator Console UI Spec  
**Desktop + Mobile, Tailwind + Custom Component Set**

---

## 0. 목적

이 문서는 **Retail AI Trainer – Operator Console**의  

- 정보 구조(IA)  
- Desktop / Mobile 레이아웃  
- 주요 화면별 와이어프레임 구조  
- Tailwind 기반 컴포넌트/스타일 가이드  

를 DX팀·AG가 바로 구현할 수 있도록 정리한 **UI/UX 스펙 문서**입니다.

운영자 콘솔은 **Desktop 우선**, 그러나 **Mobile(하단 Bottom Navigation)** 환경에서도 핵심 기능을 사용할 수 있도록 설계합니다.

---

## 1. 공통 UI 원칙

### 1.1 레이아웃 & 브레이크포인트 (Tailwind 기준)

- `lg` 이상 (≥ 1024px): **Desktop 레이아웃**
  - 좌측 Sidebar
  - 우측 Content 영역
- `md` ~ `lg` (768–1023px): **Tablet**
  - Sidebar 축소(아이콘 중심) 또는 상단 탭
  - Content는 단일 컬럼 또는 2컬럼
- `sm` 이하 (≤ 767px): **Mobile 레이아웃**
  - 상단 App Bar + 하단 Bottom Navigation
  - 단일 컬럼, Drawer/Bottom Sheet 적극 활용

### 1.2 컬러 & 타이포 (개략)

- 기본 톤: 중성 그레이 + 하나의 포인트 컬러
  - 배경: `bg-slate-50`, 카드 배경: `bg-white`
  - 테두리: `border-slate-200`
  - 텍스트: `text-slate-900`, `text-slate-500`
  - 포인트: 예) `bg-emerald-600` 또는 `bg-blue-600`
- 폰트 스타일
  - 헤더: `text-xl font-semibold`
  - 섹션 타이틀: `text-lg font-semibold`
  - 본문: `text-sm` / `text-base`
  - 라벨/헬퍼: `text-xs text-slate-500`

### 1.3 공통 컴포넌트 패턴

- 버튼: Primary / Secondary / Ghost
- 탭: 상단 탭 또는 세그먼트 탭
- 카드: `rounded-xl shadow-sm bg-white`
- 테이블: 가로 스크롤 허용, 헤더 고정
- Drawer: Desktop에선 우측 슬라이드, Mobile에선 Bottom Sheet 또는 Fullscreen
- Tooltip: `?` 아이콘 hover/tap 기반
- Slider: Behavior Modifier 조정을 위한 수평 슬라이더

---

## 2. 전체 정보 구조 (IA) – Desktop vs Mobile

### 2.1 Desktop 레이아웃 구조

```text
┌────────────────────────────────────────────────────────────┐
│ Top Bar: 로고 / 프로젝트명 / 환경선택 / 사용자 메뉴           │
├───────────────┬────────────────────────────────────────────┤
│ Sidebar       │ Content                                   │
│ - Dashboard   │ - 상단: Breadcrumb + Page Title          │
│ - Product     │ - 중단: Filter/Controls                  │
│ - Persona     │ - 하단: List/Table/Card Area             │
│ - Traits      │                                          │
│ - Difficulty  │                                          │
│ - Upsell      │                                          │
│ - Scenario    │                                          │
│ - Simulation  │                                          │
│ - Logs        │                                          │
└───────────────┴────────────────────────────────────────────┘
```

- Sidebar 폭: `w-64` (`16rem`)
- Content: `flex-1 max-w-[1440px] mx-auto px-6 py-6`

### 2.2 Mobile 레이아웃 구조

이미 기존 앱에서 사용 중인 방식과 맞춰,  
**Top App Bar + Bottom Navigation** 패턴을 사용합니다.

```text
┌──────────────────────────────┐
│ Top App Bar                 │
│ - 페이지 제목               │
│ - 뒤로가기 / 메뉴 아이콘    │
├──────────────────────────────┤
│ Content (스크롤 영역)       │
│ - 단일 컬럼 리스트/폼       │
│ - 필요 시 FAB/고정 버튼     │
├──────────────────────────────┤
│ Bottom Navigation            │
│ [Catalog] [Customer] [Rules] [Scenario] [More] │
└──────────────────────────────┘
```

**Bottom Nav 탭 구성 예시**

- **Catalog**: Product Catalog Manager  
- **Customer**: Persona + Trait + Difficulty (상단 탭으로 세분화)  
- **Rules**: Upsell Rule 목록 및 편집  
- **Scenario**: Stage & Trigger 관리  
- **More**: Simulation / Logs / Settings 등

---

## 3. Product Catalog Manager – UI 상세

### 3.1 Desktop 화면 구성

```text
[Header]
- Title: Product Catalog Manager
- Actions: + Add Model, Import, Export

[Filter Bar]
- Type Dropdown (TV / Soundbar / Monitor / Projector)
- Region Dropdown
- Search Input (모델명/ID)

[Body]
┌───────────────┬─────────────────────────────────────────┐
│ Category List │ Model List                              │
│ (좌)          │ (우) Cards + Inline Filters             │
└───────────────┴─────────────────────────────────────────┘
```

#### 좌측 Category List (Column)

- 구성: 카테고리 이름 리스트 + "+ Add Category" 버튼
- 스타일:
  - Wrapper: `bg-white rounded-xl shadow-sm p-3`
  - 항목: `px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer`
  - 선택 항목: `bg-slate-900 text-white`

#### 우측 Model List (Card Grid)

- 레이아웃: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`
- 카드 요소:
  - 헤더: 모델명, 라인(Premium/Main/Entry) Tag, Active Badge
  - 바디: 가격, 사이즈(Chip 리스트)
  - 푸터: Edit / Duplicate / Disable 버튼

Tailwind 구조 예시 (요약):

```html
<article class="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3">
  <header class="flex items-center justify-between">
    <div>
      <h3 class="text-sm font-semibold">LG OLED evo C5</h3>
      <p class="text-xs text-slate-500">Premium • OLED evo</p>
    </div>
    <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
      Active
    </span>
  </header>
  <div class="flex items-baseline gap-2">
    <p class="text-lg font-semibold">$2,300</p>
    <p class="text-xs text-slate-500">Base price</p>
  </div>
  <div class="flex flex-wrap gap-1">
    <span class="chip">55"</span>
    <span class="chip chip-muted">65"</span>
  </div>
  <footer class="flex justify-end gap-2 pt-2 border-t border-slate-100">
    <button class="btn-ghost">Duplicate</button>
    <button class="btn-secondary">Edit</button>
  </footer>
</article>
```

#### Edit Drawer (Desktop)

- 열기: “Edit” 클릭 → 우측 Slide-over (`w-[420px]`)
- 내용:
  - 텍스트 입력: Model Name, Line, Category Key
  - 숫자 입력: Base Price
  - 체크박스 그룹: Sizes
  - Region Overrides(아코디언)

툴팁 예시:  
> “Region Override는 글로벌 기본값을 덮어쓰는 설정입니다.”

### 3.2 Mobile 화면 구성

```text
Top App Bar: [<] Product Catalog

Filter Row (가로 스크롤)
- Type 버튼 그룹 (Segmented Control)
- Region 버튼
- Search 아이콘

Model List (세로 카드)
- Desktop 카드 구조를 세로 1컬럼으로 재배치
- 주요 정보만 한눈에 보이도록 압축
```

Edit는 **Bottom Sheet 또는 Fullscreen Form**으로 열기:

- 상단: 제목 + 닫기
- 중간: 섹션별 (기본 정보 / 가격·사이즈 / Region Overrides)
- 하단: Save 버튼을 `sticky bottom-0`로 고정

---

## 4. Persona / Trait / Difficulty Manager – 패턴

### 4.1 Persona Manager – Desktop

```text
Header
- Title: Persona Manager
- Actions: + Add Persona

Content
- 상단: Filter (Region / Trait)
- 중단: Persona 카드 Grid (2~4열)
- 하단: Pagination
```

Persona 카드:

- 이름
- Short description (“Price-sensitive 20s male” 등)
- Traits: Chip 2개 + Hidden은 아이콘(자물쇠, ? 등)으로 표시
- Edit 버튼

**Edit Drawer**

- Basic Info: Name, Description, AgeGroup, Gender
- Traits:
  - Main Trait #1 (select)
  - Main Trait #2 (select)
  - Hidden Trait (select, 라벨 옆에 작은 “숨김” 아이콘)
- Linked Traits Preview: TraitLinkages 정보를 읽어 자동 표시
- Regions: 체크박스 또는 Tag selector

### 4.2 Persona Manager – Mobile

- 상단 탭: `[Persona] [Traits] [Difficulty]`
- Persona 리스트: 하나당 카드 1개씩 세로 스택
- Edit는 Fullscreen Form

---

### 4.3 Trait Manager – Desktop

- 메인: 테이블 형태

```text
┌───────────────────────────────┬───────────┬──────────────┬────────────┐
│ Trait ID                      │ Category  │ Selectable   │ Diff Range │
├───────────────────────────────┼───────────┼──────────────┼────────────┤
│ price_sensitive               │ budget    │ Yes          │ 2 ~ 5      │
│ gamer_oriented                │ interest  │ Yes          │ 1 ~ 5      │
└───────────────────────────────┴───────────┴──────────────┴────────────┘
```

- 행 클릭 시 우측에 Detail Drawer 열림:

  - Label, Description, Category
  - Selectable 토글
  - Difficulty Range (Min/Max)
  - Behavior Modifiers: 슬라이더 (−1.0 ~ +1.0)
  - Hidden Activation: minDifficulty, intensityByDifficulty 맵

툴팁 예시:  
> “이 값은 Difficulty 기본값에 더해져 최종 고객 행동에 영향을 줍니다. −1.0 ~ +1.0 범위를 권장합니다.”

### 4.4 Difficulty Manager – Desktop

- Difficulty Level 리스트(테이블 또는 카드):

```text
Lv1  | "Very Easy"   | InfoDemand:0.1 | Objection:0.1 | ...
Lv3  | "Normal"      | InfoDemand:0.5 | Objection:0.5 | ...
Lv5  | "Very Hard"   | InfoDemand:0.95| Objection:0.95| ...
```

- 특정 Level 클릭 → Detail Panel:

  - Level, Label, Description
  - Behavior 슬라이더 7개 (0~1)
  - SuggestedTraitCategories (optional tag 셀렉터)

- Preview 영역:  
  “이 레벨에서는 고객이 중간 정도로 질문하고, 가격과 기술 모두 적당히 민감합니다.”  
  같은 자연어 요약을 표시.

---

## 5. Upsell Rule Manager – 고정 패턴

Upsell Rule은 Condition + Action + Message 3단으로 항상 보이게.

### 5.1 Desktop 레이아웃

```text
Header
- Title: Upsell Rule Manager
- Actions: + New Rule, Duplicate, Enable/Disable

Body
┌────────────────────────┬───────────────────────────────────────┐
│ Rule List (좌)         │ Rule Detail (우)                      │
└────────────────────────┴───────────────────────────────────────┘
```

#### Rule List (좌측)

- 검색: Rule 이름/설명 검색바
- 필터:
  - Active/Inactive
  - Stage (recommendation, closing 등)
  - Trait (includeTraits 기반)
- 각 항목:
  - Rule Label
  - 요약: “Persona: movie_lover, Stage: recommendation, Action: recommend_size”

#### Rule Detail (우측) – 3 섹션

1. **Conditions**  
   - Customer Condition Card  
   - Product Condition Card  
   - Scenario Condition Card  

2. **Actions**  
   - Action pill 목록 (`recommend_size`, `recommend_model` 등)  
   - 선택된 Action의 파라미터 폼 (Tier, allowXXL 등)

3. **Messages**  
   - 템플릿 리스트 (id, tone, 미리보기)  
   - 선택하면 아래에 텍스트 에디터/톤 선택

섹션은 모두 `card` 패턴 사용:  
`rounded-xl border border-slate-200 bg-white p-4 space-y-3`

툴팁 예시:  
> “조건이 모두 충족될 때 이 Rule이 발동합니다. 여러 Rule이 동시에 일치하면 우선순위가 높은 Rule부터 평가합니다.”

### 5.2 Mobile 레이아웃

- Bottom Nav의 **Rules** 탭에서 진입
- 상단에는 Rule 리스트(스크롤), Rule 선택 시 상세 화면으로 이동
- 상세 화면은 상단 탭으로 구성:

  - `[Conditions] [Actions] [Messages]`

- 각 탭은 세로 스크롤 폼
- Action/Message 추가는 상단 우측 `+` 아이콘 또는 하단 FAB

---

## 6. Scenario Manager – Stage & Trigger UI

### 6.1 Desktop – Stage Management

```text
Header
- Title: Scenario Manager
- Tabs: [Stages] [Triggers]

[Stages 탭]

┌─────────────────────────────────────┬──────────────────────────────┐
│ Stage List                         │ Stage Detail                 │
└─────────────────────────────────────┴──────────────────────────────┘
```

#### Stage List

- 각 Stage:
  - 이름 (ID/Label)
  - 설명
  - 허용 Upsell Category 간단 표시
- Drag Handle 아이콘으로 순서 변경 가능 (드래그 정렬)

#### Stage Detail

- ID, Label, Description
- AllowedUpsellCategories: Multi-select Tag 리스트
- MaxUpsellIntensity: Slider (0~1)
- BehaviorModifiers: 슬라이더 (필요한 항목만)

### 6.2 Desktop – Trigger Management

[Scenario Manager]의 두 번째 탭: **Triggers**

- Trigger 리스트:

```text
greeting → needs_discovery   (minTurns=2)
needs_discovery → recommendation (questionType=movie)
recommendation → closing     (minUpsellAttempts=2)
```

- 항목 클릭 시 Drawer/Detail Panel:

  - Current Stage
  - Next Stage
  - Conditions:
    - minTurns
    - customerSentiment
    - customerQuestionType
    - minUpsellAttempts

### 6.3 Mobile – Scenario

- Bottom Nav의 **Scenario** 탭
- 상단 탭: `[Stages] [Triggers]`
- 각 Stage/Trigger는 카드 리스트로 노출
- Edit는 Fullscreen Form

---

## 7. System Preview (Simulation)

### 7.1 Desktop

```text
┌───────────────────────────────┬───────────────────────────────┐
│ Simulation Settings (좌)      │ Chat Preview (우)             │
└───────────────────────────────┴───────────────────────────────┘
```

- Settings:
  - Persona 선택
  - Difficulty 선택
  - Traits Override (옵션)
  - Product Context (Type/Category/Model/Size/Region)
  - Initial Stage / maxTurns
- Run Simulation 버튼 클릭 → 우측 Chat Preview에 5~10 턴 가상 대화 표시
- 각 턴 옆에 작은 Tag로 `firedRules` / `stageId` 표시

### 7.2 Mobile

- 상단: Chat Preview 전체 화면
- 하단: “Settings” Bottom Sheet로 설정 열고 수정

---

## 8. 컴포넌트 스타일 가이드 (요약)

### 8.1 버튼

- Primary  
  `class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"`

- Secondary  
  `class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50"`

- Ghost  
  `class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"`

### 8.2 카드(Card)

- `class="rounded-xl border border-slate-200 bg-white shadow-sm p-4"`

### 8.3 입력폼

- Input  
  `class="block w-full h-9 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"`

- Select  
  동일한 스타일에 오른쪽 Chevron 아이콘

### 8.4 Chip / Tag

- 기본:  
  `class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"`

- 강조:  
  `class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"`

### 8.5 Tooltip

- Trigger: 작은 `?` 아이콘 (`text-slate-400 hover:text-slate-600`)
- Tooltip:  
  `class="rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg"`

---

## 9. 정리

이 **Operator Console UI Spec (Desktop + Mobile, Tailwind + Custom)** 문서는:

- Core Engine Spec v2의 스키마를  
- 운영자가 다루는 실제 UI 패턴으로 매핑한 설계서이며,
- Desktop에서는 **Sidebar + Content**,  
- Mobile에서는 **Top App Bar + Bottom Navigation** 구조를 사용한다.

DX팀과 AG는 이 문서를 기준으로:

- 공통 컴포넌트 라이브러리 구성  
- 메뉴별 화면 구현  
- Desktop/Mobile 반응형 레이아웃 통일  

을 진행해야 한다.  
UI 구성 요소의 추가/삭제가 필요하면,  
먼저 이 스펙을 수정한 뒤 구현을 변경하는 것을 원칙으로 한다.

