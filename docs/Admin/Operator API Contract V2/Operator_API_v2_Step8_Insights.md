# Operator Console API Contract v2 — Step 8  
## Insights Engine API v2 (AI Tutor Insight System)  
### User Performance → Diagnosis → Actionable Coaching Intelligence

Status: FINAL — Defines the complete rules, API endpoints, scoring logic,  
and operator-level management interfaces for the Insights Engine.

---

# 0. 목적 (Purpose)

Insights Engine API v2는 UPM(User Performance Monitor)의 원천 데이터를 바탕으로:

1. **사용자 행동·지식·기술의 강점/약점 추출**
2. **정량 지표 기반 문제 영역(diagnosis) 분석**
3. **스킬/지식 결손에 대한 개선 조치 제안(coaching insights)**
4. **개별 사용자 맞춤 미션 추천**
5. **그룹(지점/국가/리전) 단위 트렌드 분석**
6. **학습/시나리오 구성의 문제점 탐지**

을 수행한다.

Insights는 단순 통계가 아니라 “해석된 해설(Interpretation Layer)”을 제공하는 엔진이다.

---

# 1. Insight Object Structure

```json
{
  "insightId": "string",
  "userId": "string",
  "type": "strength | weakness | risk | recommendation | anomaly",
  "category": "upsell | objection | product_knowledge | engagement | streak | learning",

  "score": 0.72,
  "confidence": 0.83,

  "message": "User struggles with objection handling, especially price-related arguments.",
  "actions": [
    {
      "type": "assign_content | assign_mission | show_tip",
      "value": "module_objection_price_01"
    }
  ],

  "source": {
    "scenario": { "upsellSuccessRate": 0.38, "avgObjections": 2.9 },
    "quiz": { "accuracy": 0.55, "weakTopics": ["brightness"] },
    "skill": { "upsell": 0.68, "objection_handling": 0.42 }
  },

  "createdAt": 1712233444
}
```

---

# 2. Insights Generation Pipeline

3단계 파이프라인:

## 2.1 단계 1 — Raw Metrics Collection
- UPM(Scenario/Quiz/Module/Mission/Skill) 데이터 수집
- 최근 세션 가중치(Recency Weight) 적용
- 결측치 보정

## 2.2 단계 2 — Signal Extraction
정규화된 행동 지표 생성:

```text
upsell_score            0~1
objection_skill         0~1
product_knowledge       0~1
engagement_index        0~1
risk_of_churn           0~1
learning_consistency    0~1
```

## 2.3 단계 3 — Insight Rules Engine
신호(signal)를 해석하여 “인사이트”로 변환:

예:
```text
IF objection_skill < 0.45 AND quiz.accuracy(topic='pricing') < 0.6  
THEN create insight(type='weakness', category='objection_handling')
```

---

# 3. Insights API

## 3.1 Generate Insights (Manual Trigger)  
`POST /operator/insights/generate/{userId}`

```json
{
  "generated": 4,
  "insights": [...]
}
```

---

## 3.2 Auto-Generate Insights (Background)

*Operator API에 직접 노출되진 않으나, 서버 레벨에서 자동 수행.*

Trigger 이벤트 예:

- Scenario session completed  
- Quiz completed  
- Learning module completion  
- Mission evaluation

---

## 3.3 Get Insights (User)  
`GET /operator/insights/user/{userId}`

Query:
```text
?type=strength|weakness|risk|recommendation|anomaly
?category=upsell|objection|learning|product_knowledge|engagement
?recentOnly=true|false
```

---

## 3.4 Get Insights (Group: Branch / Country / Region)  
`GET /operator/insights/group`

Query:
```text
?scope=branch|country|region
?metric=upsell|engagement|knowledge|risk
?limit=50
```

예시 활용:
- “브라질 지점별 Upsell 약점 TOP 5”
- “리전 전체 제품지식 위험군 리스트”

---

# 4. Insight Types (분류 규약)

### 4.1 Strength Insight
예:  
“사용자는 Upsell Product Knowledge 영역에서 상위 10%입니다.”

### 4.2 Weakness Insight
예:  
“가격 이슈가 나오면 objection 해결 성공률이 급격히 떨어집니다.”

### 4.3 Risk Insight
예:  
“학습 참여가 일주일간 중단되어 Streak 감소 위험이 있습니다.”

### 4.4 Recommendation Insight
예:  
“다음 콘텐츠(Objection Handling Module)를 학습하도록 추천합니다.”

### 4.5 Anomaly Insight
예:  
“퀴즈 결과가 최근 패턴 대비 급격히 낮아졌습니다.”

---

# 5. Insight Score Formulas

## 5.1 Knowledge Insight Score (K)
```text
K = 0.6 * quiz_accuracy + 0.4 * module_completion_rate
```

## 5.2 Behavior Insight Score (B)
```text
B = 0.5 * upsell_success_rate
  + 0.3 * objection_resolution_rate
  + 0.2 * average_behavior_score
```

## 5.3 Engagement Score (E)
```text
E = 0.5 * streak_normalized
  + 0.5 * learning_engagement_index
```

## 5.4 Risk Score (R)
```text
R = 1 - E
```

---

# 6. Recommended Actions (Actionable Insights)

Insight가 생성되면 자동으로 “조치(action)”를 가진다.

가능한 액션 type:

```text
assign_content
assign_mission
show_tip
show_scenario_practice
recommend_quiz
```

예시 매핑:

```text
weakness(objection_handling) → assign_content(module_objection_01)
risk(engagement)            → assign_mission(streak_recovery_mission)
knowledge_gap(brightness)   → recommend_quiz(quiz_brightness_lv1)
```

---

# 7. Insights → Mission Engine Sync

Insights 엔진은 자동으로 Mission 엔진에 추천 미션을 보낼 수 있다.

`POST /operator/missions/recommend`

```json
{
  "userId": "u_01",
  "missionType": "objection_practice",
  "reason": "Weakness detected: price objections",
  "sourceInsightId": "ins_933"
}
```

Mission Engine(9단계) 쪽에서:
- 이 Insight를 근거로 실제 Mission Template 선택  
- 중복/과도한 미션 발행 방지 로직 적용

---

# 8. Scope Enforcement

- Branch Operator → 자신의 지점 사용자 인사이트만 조회 가능  
- Country Operator → 해당 국가 단위 인사이트만 조회 가능  
- Admin → 전체 Scope 조회 가능  

개인 데이터 보호를 위해:
- 인사이트는 기본적으로 **Operator/Admin 전용**  
- 학습자(User Dashboard)에는 직접적인 “약점” 표현 대신  
  완곡한 코칭 메시지 형태로 가공하여 제공

---

# 9. Hot Reload

Insight Ruleset을 수정하면 즉시 반영되어야 한다.

`POST /operator/ops/hot-reload`

```json
{
  "type": "insights",
  "targetId": "ruleset_v5"
}
```

예:
- Upsell 약점 판정 기준 조정  
- Engagement Score 산식 변경  
- Risk Threshold 변경  

---

# 10. DX & AG Implementation Notes

### 10.1 AG가 해야 하는 것 (MUST)
- UPM(Scenario/Quiz/Module/Mission) 생성 이벤트 후,  
  필요 시 `/insights/generate/{userId}` 호출로 인사이트 생성 트리거  
- Generated Insights를 읽어 Mission/Content 추천에 활용

### 10.2 AG가 하면 안 되는 것 (MUST NOT)
- Insight Rule을 직접 변경하거나 우회  
- Insight Score를 재정의  
- Mission 발행을 Insight 없이 임의 진행(운영 정책상 금지)

### 10.3 DX 구현 관점
- Insight Ruleset은 JSON/Config 기반으로 설계하여  
  운영자가 규칙을 점진적으로 조정할 수 있게 할 것  
- Recency Weight, Aggregation Window, Risk Thresholds는  
  서버 사이드에서 환경 설정으로 관리  
- Group Insights(Branch/Country/Region)는  
  Aggregated View로 설계하여 대시보드에서 빠른 조회 가능하도록 인덱싱

---

# END — Step 8 (Insights Engine API v2)
