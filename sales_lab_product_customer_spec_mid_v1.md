# Sales Lab – Product & Customer Configuration Spec (Mid Summary v1)
주인님용 / AG 설정용 중간 정리 문서  
Scope: **제품(카탈로그) + 고객 모델(Persona / Trait / Difficulty)**

---

## 0. 목적 (AG가 이해해야 할 핵심 개념)

Sales Lab은 “TV 판매 롤플레잉”을 위한 엔진이며,  
이 문서는 그 중 **제품 + 고객 모델**에 해당하는 설정 규칙을 정의합니다.

AG는 이 문서를 기반으로 다음을 수행해야 합니다.

1. **제품(Product)**
   - 타입(Type) / 카테고리(Category) / 모델(Model) / 사이즈(Size) / 가격(Price)을
     `PRODUCT_CATALOG` 구조로 관리하고,  
     SalesLabSetup 화면에 그대로 반영한다.

2. **고객(Customer)**  
   - 고객은 `Persona + Traits + Difficulty` 조합으로 정의된다.
   - Persona: “어떤 사람인가(Who)”
   - Traits: “어떤 성향을 가졌는가(성격/취향 벡터)”
   - Difficulty: “오늘 이 사람이 얼마나 까다롭게 나오는가(행동 난이도)”

3. **행동 엔진(Behavior Engine)**  
   - Difficulty가 전체 난이도(공격성/정보요구/복잡도)를 결정하는 “볼륨” 역할
   - Traits가 각 축(가격, 리스크, 영화, 게임 등)에 어떤 보정값을 줄지 결정하는 “EQ” 역할
   - 최종적으로 **Difficulty + TraitModifiers → 행동 벡터**를 만들고,  
     이를 기반으로 AI 대화 스타일을 바꾼다.

---

## 1. Product Catalog (제품 카탈로그)

### 1.1 개념

PRODUCT_CATALOG는 SalesLabSetup 화면의 **왼쪽 Product Setup 패널**에서 사용하는 데이터 구조입니다.

- Type 탭: TV / Soundbar / Monitor / Projector
- Category 탭: 제품 타입별 라인업 (예: OLED evo / OLED / QNED …)
- Model 리스트: 카테고리별 모델들 (이름, 라인, 가격, 사이즈)
- Size 버튼: 55 / 65 / 77 / 83 등

이 정보는 전부 Operator가 **Product Catalog Manager**에서 CRUD 할 수 있어야 합니다.

### 1.2 스키마

```ts
type ProductType = string; // "TV" | "Soundbar" | "Monitor" | "Projector" | ...

interface ProductModel {
  id: string;           // "oled-g5-55"
  name: string;         // "LG OLED evo G5"
  line: string;         // "Premium" | "Mainstream" | "Entry" | ...
  categoryKey: string;  // "OLED evo" 등, 해당 타입의 카테고리 키
  typeLabel?: string;   // 카드에 보일 라벨(없으면 line 사용)
  basePrice: number;    // 기본 가격
  sizes: number[];      // [55, 65, 77, 83]
  isActive: boolean;    // false면 UI에서 숨김

  // (옵션) 리전별 override
  regionOverrides?: {
    [regionCode: string]: {
      basePrice?: number;
      isActive?: boolean;
      sizes?: number[];
    }
  };
}

interface ProductCatalog {
  types: ProductType[];                       // ["TV","Soundbar","Monitor","Projector"]
  categories: Record<string, string[]>;       // { "TV": ["OLED evo","OLED","QNED"], ... }
  models: Record<string, ProductModel[]>;     // { "OLED evo": [ProductModel, ...], ... }
}
```

### 1.3 예시 (간단)

```json
{
  "types": ["TV"],
  "categories": {
    "TV": ["OLED evo", "OLED"]
  },
  "models": {
    "OLED evo": [
      {
        "id": "oled-g5-55",
        "name": "LG OLED evo G5",
        "line": "Premium",
        "categoryKey": "OLED evo",
        "basePrice": 2800,
        "sizes": [55, 65, 77, 83],
        "isActive": true
      },
      {
        "id": "oled-c5-55",
        "name": "LG OLED evo C5",
        "line": "Mainstream",
        "categoryKey": "OLED evo",
        "basePrice": 2300,
        "sizes": [55, 65, 77],
        "isActive": true
      }
    ]
  }
}
```

AG는 이 구조를 그대로 SalesLabSetup의 탭/카테고리/카드/사이즈 버튼에 매핑해야 합니다.

---

## 2. Customer Model Overview (고객 모델 개요)

고객은 아래 요소들의 조합으로 정의됩니다.

1. **Persona**
   - 나이대 / 성별 / 역할(예: Senior Simple User, Hardcore Gamer 등)
   - 메인 Trait 2개 + 히든 Trait 1개

2. **Traits**
   - 고객의 성향 축
   - 예: price_sensitive, gamer_oriented, movie_lover, family_oriented…
   - 각 Trait은 난이도에 영향을 주는 behaviorModifiers와  
     자연스러운 난이도 범위(difficultyRange)를 갖는다.

3. **Difficulty (Lv1~5)**
   - 전체 난이도(정보요구량, 반박 강도, 가격 민감도, 응답 복잡도 등)를 결정하는 기본값 세트
   - Traits가 이 값에 보정값을 더해 최종 행동 벡터를 만든다.

엔진은:

- Persona에서 main_traits + hidden_trait 로딩
- TraitLinkages로 inferred_traits 계산
- Difficulty에서 base behavior 로딩
- 각 Trait의 behaviorModifiers를 합산 → base behavior에 더함
- 0~1 사이로 클램프한 최종 behavior 벡터를 기반으로 프롬프트를 구성한다.

---

## 3. TraitDefinition (traits) – 성향 정의

### 3.1 스키마

```ts
type BehaviorKey =
  | "infoDemand"
  | "budgetSensitivity"
  | "objectionStrength"
  | "decisionDelay"
  | "responseComplexity"
  | "techLiteracy"
  | "engagementResistance";

interface DifficultyRange {
  min: number; // 1~5
  max: number; // 1~5
}

interface HiddenActivation {
  minDifficulty: number;               // 히든 트레잇이 의미 있게 드러나는 최소 난이도
  intensityByDifficulty?: {            // 난이도별 발현 강도(0.0~1.0)
    [level: string]: number;
  };
}

interface TraitDefinition {
  id: string;                // "price_sensitive"
  label: string;             // "Price-sensitive"
  description: string;       // 툴팁/내부 설명
  category: string;          // "budget" | "interest" | "tech_literacy" | ...
  iconKey?: string;          // UI 아이콘 키
  colorKey?: string;         // UI 컬러 토큰
  isSelectable: boolean;     // main/hidden으로 선택 가능 여부

  // 이 Trait이 자연스럽게 사용되는 난이도 범위 (옵션)
  difficultyRange?: DifficultyRange;

  // Difficulty 행동값에 주는 보정값 (옵션)
  behaviorModifiers?: {
    [key in BehaviorKey]?: number;     // -1.0 ~ +1.0 권장 (최종 결과는 0~1로 클램프)
  };

  // 히든 트레잇인 경우, 난이도별 발현 규칙 (옵션)
  hiddenActivation?: HiddenActivation;
}
```

### 3.2 Trait Linkages (traitLinkages)

하나의 Trait가 있을 때 자동으로 따라오는 보조 성향(derived traits)을 정의합니다.

```ts
type TraitLinkages = {
  [traitId: string]: string[];
};
```

예시:

```json
{
  "gamer_oriented": ["tech_oriented", "quick_decider"],
  "family_oriented": ["durability_focused"]
}
```

AG는 Persona의 main_traits를 읽은 뒤, traitLinkages를 이용해 inferred_traits를 계산해야 합니다.

---

## 4. Persona (personas) – 고객 프리셋

### 4.1 스키마

```ts
type AgeGroup =
  | "20s"
  | "30s"
  | "40s"
  | "50s"
  | "60s_plus"
  | "20s_30s"
  | "30s_40s"
  | "40s_50s";

type Gender = "male" | "female" | "other";

interface Persona {
  id: string;                 // "budget_seeker"
  name: string;               // "Budget Seeker"
  shortDescription: string;   // UI 요약 ("Price-sensitive 20s Male")

  ageGroup: AgeGroup;
  gender: Gender;

  mainTraits: string[];       // 길이 2, TraitDefinition.id 참조
  hiddenTrait: string;        // 길이 1, TraitDefinition.id 참조

  regions?: string[];         // ["global", "BR", "MX" ...]

  // 런타임에서 자동 계산(옵션 저장 가능)
  inferredTraits?: string[];  // mainTraits + traitLinkages를 반영한 derived traits
}
```

### 4.2 고객 프로파일 구조 (엔진에서 사용하는 형태)

```ts
interface CustomerProfileForAI {
  personaId: string;
  ageGroup: AgeGroup;
  gender: Gender;
  mainTraits: string[];      // Persona.mainTraits
  hiddenTrait: string;       // Persona.hiddenTrait
  inferredTraits: string[];  // traitLinkages 적용 결과
}
```

AG는 **Persona + Traits + Difficulty**를 종합해 이 프로파일을 만들고,  
이를 System Prompt에 녹여서 고객 행동을 제어해야 합니다.

---

## 5. Difficulty (difficulties) – 행동 난이도 엔진

### 5.1 스키마

```ts
interface DifficultyBehavior {
  infoDemand: number;          // 0.0~1.0, 추가 정보/근거/비교 요청 빈도
  budgetSensitivity: number;   // 0.0~1.0, 가격 민감도/가격 반박 강도
  objectionStrength: number;   // 0.0~1.0, 반박/의심/도전적 질문 강도
  decisionDelay: number;       // 0.0~1.0, 구매 결정 지연 정도
  responseComplexity: number;  // 0.0~1.0, 문장 길이·복잡도
  techLiteracy: number;        // 0.0~1.0, 기술 용어 이해/사용 수준
  engagementResistance: number;// 0.0~1.0, 대화 난항·호감 저항 정도
}

interface DifficultyLevel {
  level: number;               // 1~5
  label: string;               // "Lv.1" ...
  description: string;         // UI/트레이너용 설명
  behavior: DifficultyBehavior;

  // 이 난이도에서 주로 추천할 Trait 카테고리 (옵션)
  suggestedTraitCategories?: string[]; // 예: ["budget","tech_literacy","risk_service"]
}
```

### 5.2 Lv1~Lv5 초기값(v1) 예시

```json
[
  {
    "level": 1,
    "label": "Lv.1",
    "description": "Simple, agreeable customer with minimal objections.",
    "behavior": {
      "infoDemand": 0.1,
      "budgetSensitivity": 0.1,
      "objectionStrength": 0.1,
      "decisionDelay": 0.1,
      "responseComplexity": 0.1,
      "techLiteracy": 0.1,
      "engagementResistance": 0.1
    }
  },
  {
    "level": 3,
    "label": "Lv.3",
    "description": "Balanced interaction with moderate questions and objections.",
    "behavior": {
      "infoDemand": 0.5,
      "budgetSensitivity": 0.5,
      "objectionStrength": 0.5,
      "decisionDelay": 0.4,
      "responseComplexity": 0.45,
      "techLiteracy": 0.5,
      "engagementResistance": 0.4
    }
  },
  {
    "level": 5,
    "label": "Lv.5",
    "description": "Highly demanding, skeptical customer requiring detailed justification.",
    "behavior": {
      "infoDemand": 0.95,
      "budgetSensitivity": 0.9,
      "objectionStrength": 0.95,
      "decisionDelay": 0.8,
      "responseComplexity": 0.9,
      "techLiteracy": 0.95,
      "engagementResistance": 0.85
    }
  }
]
```

---

## 6. 최종 행동 벡터 계산 로직 (개념)

AG는 한 번의 롤플레잉 세션을 시작할 때 다음 순서로 고객 행동을 계산해야 합니다.

1. **Difficulty 기본값 로딩**
   ```ts
   const base = difficulty.behavior; // DifficultyLevel.behavior
   ```

2. **Persona에서 main_traits, hidden_trait 로딩**

3. **traitLinkages를 이용해 inferred_traits 계산**
   ```ts
   inferredTraits = resolveTraitLinkages(mainTraits, traitLinkages);
   ```

4. **Trait behaviorModifiers 합산**
   ```ts
   const traitModifiers = aggregateTraitBehaviorModifiers(
     mainTraits,
     inferredTraits,
     hiddenTrait
   );
   ```

5. **최종 behavior = base + traitModifiers, 0~1로 클램프**
   ```ts
   const finalBehavior: DifficultyBehavior = clamp01Vector(
     addVectors(base, traitModifiers)
   );
   ```

6. **hiddenActivation 규칙 적용**
   - hiddenTrait의 hiddenActivation.minDifficulty보다
     난이도가 낮으면 거의 드러나지 않게 처리
   - 난이도별 intensityByDifficulty를 참고해
     대화 중 히든 트레잇을 얼마나 자주/강하게 드러낼지 결정

7. 이 최종 behavior를 기반으로 System Prompt를 생성
   - infoDemand가 높을수록 “왜?”, “비교”, “근거” 질문을 자주 던짐
   - budgetSensitivity가 높을수록 가격/가성비 관련 반박을 자주 언급
   - techLiteracy가 높을수록 HDR/니트/백라이트 구조 등 기술 질문을 사용
   - objectionStrength가 높을수록 세일즈의 주장에 의심과 반박을 섞어서 응답

---

## 7. AG에게 기대하는 동작 요약

1. 이 문서의 스키마대로
   - `PRODUCT_CATALOG`
   - `traits`
   - `traitLinkages`
   - `personas`
   - `difficulties`
   를 저장/로드할 수 있게 한다.

2. SalesLabSetup 화면에서
   - 제품 선택 패널 = PRODUCT_CATALOG 기반
   - Persona/Trait/Difficulty 선택 = personas/traits/difficulties 기반

3. SalesLabChat(롤플레잉)에서
   - Persona + Traits + Difficulty를 조합해
     `CustomerProfileForAI`와 `finalBehavior`를 계산하고,
   - 이를 기반으로 **고객의 말투/질문/반박 패턴**을 제어한다.

4. Operator Console이 생기면
   - 위 스키마를 기준으로 Product / Persona / Trait / Difficulty를
     CRUD할 수 있도록 설계한다.

이 문서는 어디까지나 **“제품 + 고객 모델”에 대한 중간 정리**이며,  
이후 Upsell Rule / Scenario / Prompt Management가 추가로 얹힐 예정이다.
