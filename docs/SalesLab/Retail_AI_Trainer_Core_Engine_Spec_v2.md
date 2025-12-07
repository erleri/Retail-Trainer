# Retail AI Trainer – Core Engine Spec (v2, 통합 문서)
Products + Customer Engine + Upsell Rule Engine + Scenario Engine

---

## 0. Overview – System Architecture

Retail AI Trainer 엔진은 다음 4개 레이어로 구성됨:

1. Product Catalog – 무엇을 파는가  
2. Customer Engine – Persona + Traits + Difficulty + Size Tier  
3. Upsell Rule Engine – 조건 기반 추천 규칙  
4. Scenario Engine – 대화 흐름/타이밍 제어  

---

## 1. Product Catalog Engine

### 1.1 스키마

```ts
type ProductType = string;

interface ProductModel {
  id: string;
  name: string;
  line: string;
  categoryKey: string;
  typeLabel?: string;
  basePrice: number;
  sizes: number[];
  isActive: boolean;
  regionOverrides?: {
    [regionCode: string]: {
      basePrice?: number;
      isActive?: boolean;
      sizes?: number[];
    }
  };
}

interface ProductCatalog {
  types: ProductType[];
  categories: Record<string, string[]>;
  models: Record<string, ProductModel[]>;
}
```

---

## 2. Customer Engine

### 2.1 TraitDefinition

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
  min: number;
  max: number;
}

interface HiddenActivation {
  minDifficulty: number;
  intensityByDifficulty?: { [level: string]: number };
}

interface TraitDefinition {
  id: string;
  label: string;
  description: string;
  category: string;
  iconKey?: string;
  colorKey?: string;
  isSelectable: boolean;
  difficultyRange?: DifficultyRange;
  behaviorModifiers?: { [key in BehaviorKey]?: number };
  hiddenActivation?: HiddenActivation;
}
```

### 2.2 TraitLinkages

```ts
interface TraitLinkages {
  [traitId: string]: string[];
}
```

### 2.3 Persona

```ts
type AgeGroup = "20s" | "30s" | "40s" | "50s" | "60s_plus" | "20s_30s";
type Gender = "male" | "female" | "other";

interface Persona {
  id: string;
  name: string;
  shortDescription: string;
  ageGroup: AgeGroup;
  gender: Gender;
  mainTraits: string[];
  hiddenTrait: string;
  regions?: string[];
  inferredTraits?: string[];
}
```

### 2.4 Difficulty

```ts
interface DifficultyBehavior {
  infoDemand: number;
  budgetSensitivity: number;
  objectionStrength: number;
  decisionDelay: number;
  responseComplexity: number;
  techLiteracy: number;
  engagementResistance: number;
}

interface DifficultyLevel {
  level: number;
  label: string;
  description: string;
  behavior: DifficultyBehavior;
  suggestedTraitCategories?: string[];
}
```

### 2.5 Size Tier Config

```ts
interface SizeTierConfig {
  region: string;
  tiers: {
    name: string;
    minInch: number;
    maxInch?: number;
  }[];
}
```

### 2.6 최종 행동 계산

```ts
finalBehavior = clamp01(
  difficulty.behavior + sum(trait.behaviorModifiers)
)
```

---

## 3. Upsell Rule Engine

### 3.1 UpsellRule

```ts
interface UpsellRule {
  id: string;
  label: string;
  description: string;
  customer?: CustomerCondition;
  product?: ProductCondition;
  scenario?: ScenarioCondition;
  actions: UpsellAction[];
  messages: UpsellMessage[];
}
```

### 3.2 CustomerCondition

```ts
interface CustomerCondition {
  personaIds?: string[];
  includeTraits?: string[];
  excludeTraits?: string[];
  minDifficulty?: number;
  maxDifficulty?: number;
}
```

### 3.3 ProductCondition

```ts
interface ProductCondition {
  type?: string;
  category?: string;
  currentMinSize?: number;
  currentMaxSize?: number;
  currentSizeTiers?: string[];
  disallowTiers?: string[];
}
```

### 3.4 ScenarioCondition

```ts
interface ScenarioCondition {
  stage?: string;
  customerQuestionType?: string;
}
```

### 3.5 UpsellAction

```ts
type UpsellActionType =
  | "recommend_size"
  | "recommend_model"
  | "recommend_category"
  | "recommend_accessory"
  | "highlight_feature"
  | "highlight_competitive_advantage";

interface UpsellAction {
  type: UpsellActionType;
  params?: Record<string, any>;
}
```

### 3.6 UpsellMessage

```ts
interface UpsellMessage {
  id: string;
  template: string;
  tone?: "friendly" | "professional" | "energetic";
}
```

---

## 4. Scenario Engine

### 4.1 ScenarioStage

```ts
interface ScenarioStage {
  id: string;
  label: string;
  description: string;
  allowedUpsellCategories?: string[];
  maxUpsellIntensity?: number;
  behaviorModifiers?: Partial<DifficultyBehavior>;
}
```

### 4.2 ScenarioTrigger

```ts
interface ScenarioTrigger {
  id: string;
  stage: string;
  nextStage: string;
  conditions: ScenarioTriggerCondition[];
}

interface ScenarioTriggerCondition {
  customerSentiment?: "positive" | "neutral" | "negative";
  customerQuestionType?: string;
  minTurns?: number;
  minUpsellAttempts?: number;
}
```

---

## 5. End-to-End AI Behavior Flow

1. Persona 로딩  
2. Traits → inferredTraits 계산  
3. Difficulty behavior 로딩  
4. Trait behaviorModifiers 적용 → finalBehavior 생성  
5. Scenario Stage = greeting 시작  
6. 턴마다 Trigger 검사 → Stage 변경  
7. Stage 허용 업셀만 사용  
8. Rule 조건 충족 시 메시지 템플릿 발동  
9. 자연스러운 고객 대화 패턴 재현  

---

## 6. AG Implementation Rules

1. 스키마 필드명 변경 금지  
2. 스키마 외 필드 자동 생성 금지  
3. Trait behaviorModifiers는 Difficulty 기반 behavior에 더하고 0~1로 클램프  
4. Stage behaviorModifiers도 적용  
5. Stage에서 허용되지 않은 Upsell Rule은 발동 금지  
6. Size Tier 비교는 인치보다 우선  
7. hiddenTrait는 hiddenActivation 규칙 적용  
8. Upsell 메시지는 template 기반  
9. Trigger는 매 턴 평가  
10. 전체 데이터는 Operator Console에서 CRUD 가능해야 함  

---

End of Document (v2)
