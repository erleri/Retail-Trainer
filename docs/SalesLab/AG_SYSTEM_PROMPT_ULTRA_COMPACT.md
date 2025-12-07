# Retail AI Trainer – AG SYSTEM PROMPT (Ultra-Compact Final)

본 문서는 AntiGravity/AG Builder가 Retail AI Trainer 엔진을 구현·조작할 때  
**절대적으로 따라야 하는 기준(Core Contract)**이다.  
스키마/필드명/구조의 변경·추론·요약은 금지한다.

---

## 1. Product Catalog Schema

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

## 2. Customer Engine Schema (Persona / Trait / Difficulty / SizeTier)

### TraitDefinition

```ts
type BehaviorKey =
  | "infoDemand"
  | "budgetSensitivity"
  | "objectionStrength"
  | "decisionDelay"
  | "responseComplexity"
  | "techLiteracy"
  | "engagementResistance";

interface DifficultyRange { min: number; max: number; }

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

### TraitLinkages

```ts
interface TraitLinkages { [traitId: string]: string[]; }
```

### Persona

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

### Difficulty

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

### SizeTierConfig

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

---

## 3. Upsell Rule Engine Schema

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

### CustomerCondition

```ts
interface CustomerCondition {
  personaIds?: string[];
  includeTraits?: string[];
  excludeTraits?: string[];
  minDifficulty?: number;
  maxDifficulty?: number;
}
```

### ProductCondition

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

### ScenarioCondition

```ts
interface ScenarioCondition {
  stage?: string;
  customerQuestionType?: string;
}
```

### UpsellAction

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

### UpsellMessage

```ts
interface UpsellMessage {
  id: string;
  template: string;
  tone?: "friendly" | "professional" | "energetic";
}
```

---

## 4. Scenario Engine Schema

### ScenarioStage

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

### ScenarioTrigger

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

## 5. Core Logic Rules (AG MUST FOLLOW)

1. Final Behavior = Difficulty.behavior + sum(Trait.behaviorModifiers).  
   결과는 반드시 0~1로 clamp.

2. HiddenTrait는 hiddenActivation 규칙에 따라 Difficulty 기반으로 활성화.

3. Stage는 Trigger 조건 충족 시에만 이동하며, Stage가 허용하지 않는 Upsell은 발동 금지.

4. ScenarioStage.behaviorModifiers는 finalBehavior에 추가 적용.

5. UpsellRule은 customer+product+scenario 조건을 모두 만족할 때만 발동.

6. SizeTier 비교는 inch보다 Tier 우선.

---

## 6. 금지 규칙 (AG MUST NOT DO)

1. 스키마 필드명 변경 금지  
2. 새로운 필드 추가 금지  
3. 타입/구조 축약·요약 금지  
4. Stage/Trigger/Rule 구조 결합 금지  
5. behaviorModifiers 범위(−1~1) 위반 금지  
6. HiddenTrait 무작위 노출 금지  
7. 메시지 템플릿 외 발화 생성 금지  
8. 스키마 밖 로직 임의 추가 금지

---

## 7. AG의 역할

- 스키마 기반 DB/스토리지 구성  
- CRUD UI 자동 생성  
- 값 검증(Validation) 적용  
- Upsell/Scenario Builder 구성  
- Simulation 연결  
- API Contract v1에 맞춘 입·출력 유지

---

END OF AG SYSTEM PROMPT (ULTRA COMPACT)
