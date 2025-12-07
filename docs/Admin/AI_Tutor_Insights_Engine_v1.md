# **AI Tutor Insights Engine – Spec v1.0**
Version: 1.0  
Style: Enterprise + Korean DX 팀 친화 문체  
Status: Approved Draft  
Updated: Now  

---

# 0. 목적 (Purpose)

AI Tutor Insights Engine은 Retail AI Trainer의 모든 학습·세일즈·게이미피케이션 활동을 분석하여  
**현장에서 실제 개선에 활용 가능한 인사이트(Actionable Insights)**를 자동으로 생성하는 시스템이다.

본 문서는 AI Tutor Insights Engine의 전체 구조를 다음 항목 기준으로 정의한다.

1. Input Signals (데이터 입력)  
2. Insight Rule Engine (규칙 기반 판단)  
3. AI Reasoning Layer (LLM 기반 인사이트 생성)  
4. Insight Classification  
5. Output Schema  
6. Sample Insights  
7. Insight Registry (DB 구조)

---

# 1. 엔진 전체 구조

AI Tutor Insights Engine은 다음 4단계로 구성된다.

1) **Input Signals** – Analytics Layer에서 KPI/지표 수집  
2) **Rule-Based Scoring Engine** – 위험도/문제도 계산  
3) **LLM Reasoning Engine** – 자연어 인사이트 생성  
4) **Insight Registry** – 인사이트 저장 및 Admin Dashboard 노출  

이 엔진은 Admin Dashboard v1.1의 “AI Tutor Insights” 위젯에 직접 연결된다.

---

# 2. Input Signals (데이터 입력)

엔진은 Analytics Layer에서 아래 신호를 입력받는다.

## 2.1 Skill-Level Signals
- skill_fail_rate  
- skill_mastery_score  
- scenario_skill_failure_rate  

## 2.2 Scenario-Level Signals
- scenario_success_rate  
- stage_dropoff_rate  
- persona_success_rate  

## 2.3 Content-Level Signals
- module_completion_rate  
- module_avg_time  
- quiz_pass_rate / fail_rate  

## 2.4 Gamification Signals
- streak_break_rate  
- xp_growth_rate  
- badge_acquisition_distribution  

## 2.5 Mission/Program Signals
- mission_completion_rate  
- participation_rate  
- risk_flags  

모든 입력값은 Daily Aggregation 또는 Near-Real-Time Aggregation을 기반으로 한다.

---

# 3. Insight Rule Engine (규칙 기반 판단)

LLM이 인사이트를 생성하기 전,  
엔진은 아래 규칙 기반 스코어링을 수행해 “문제 가능성”을 평가한다.

## 3.1 Weak Skill Detection Rule
```
if skill_fail_rate > 50% and mastery_score < 40:
    weak_skill_score = HIGH
elif skill_fail_rate > 40%:
    weak_skill_score = MEDIUM
else:
    weak_skill_score = LOW
```

## 3.2 Scenario Drop-off Rule
```
if stage_dropoff_rate > 35%:
    scenario_alert = TRUE
```

## 3.3 Persona Vulnerability Rule
```
if persona_success_rate < (overall_success_rate - 20%):
    persona_flag = TRUE
```

## 3.4 Content Quality Rule
```
if module_completion_rate < 50%:
    recommend_revision = TRUE
```

## 3.5 Quiz Difficulty Rule
```
if quiz_fail_rate > 60%:
    quiz_too_hard = TRUE
```

## 3.6 Gamification Motivation Rule
```
if streak_break_rate > 20%:
    morale_risk = HIGH
```

---

# 4. Insight Classification (인사이트 분류)

AI Tutor Insights는 아래 5개 타입으로 분류된다.

1. **Skill Insight**  
2. **Scenario/Persona Insight**  
3. **Learning Content Insight**  
4. **Gamification/Motivation Insight**  
5. **Mission/Program Insight**  

각 Insight는 Evidence(근거) + Action(조치)을 반드시 포함해야 한다.

---

# 5. AI Reasoning Layer (LLM 기반 인사이트 생성)

규칙 엔진의 결과 + Analytics 신호를 LLM에 전달해  
**자연어 인사이트**를 생성한다.

LLM Prompt 예시:

```
You are an AI Tutor analyzing retail training performance.

Given the signals and rule-based flags below:
<SIGNALS JSON>

Identify the most important insights, and produce:
- Title (short and punchy)
- Summary (2~3 sentences)
- Evidence list (metric + value)
- Recommended action (clear, practical)
- Severity (H/M/L)

Rules:
- Actionable insight only.
- Do not blame users.
- Connect scenario ↔ quiz ↔ module data when patterns match.
```

LLM 출력 결과는 Insight Schema에 적합하게 가공하여 Registry에 저장한다.

---

# 6. Insight Output Schema

```ts
interface AITutorInsight {
  id: string;
  insightType: "skill" | "scenario" | "content" | "gamification" | "mission";
  title: string;
  summary: string;
  evidence: EvidenceBlock[];
  recommendedAction: string;
  severity: "low" | "medium" | "high";
  relatedSkillTags?: string[];
  relatedModules?: string[];
  relatedScenarios?: string[];
  affectedRegion?: string;
  affectedTeams?: string[];
  timestamp: string;
}

interface EvidenceBlock {
  metric: string;
  value: number | string;
  comparison?: string;
}
```

---

# 7. Sample Insights (샘플 출력)

## Sample #1 — Skill Insight
```
{
 "insightType": "skill",
 "title": "Price Objection 대응이 전체 약점입니다.",
 "summary": "최근 7일간 Price 관련 퀴즈 실패율이 62%이며, Sales Lab의 동일 스킬 포함 시나리오 성공률이 28%에 그치고 있습니다.",
 "evidence": [
   { "metric": "Quiz Fail Rate", "value": "62%" },
   { "metric": "Scenario Success Rate", "value": "28%" },
   { "metric": "Skill Mastery", "value": 34 }
 ],
 "recommendedAction": "‘Price Objection Handling’ 모듈 학습을 권장하고, Sales Lab 연습을 Today Quest로 배포하십시오.",
 "severity": "high",
 "relatedSkillTags": ["price_objection"],
 "timestamp": "2025-12-06T12:00:00Z"
}
```

## Sample #2 — Content Insight
```
{
 "insightType": "content",
 "title": "‘OLED 기본 개념’ 모듈 완주율이 낮습니다.",
 "summary": "완주율이 38%로 기준 대비 낮아 콘텐츠 구조 또는 난이도 개선이 필요합니다.",
 "evidence": [
   { "metric": "Module Completion", "value": "38%" },
   { "metric": "Avg Time", "value": "41s" }
 ],
 "recommendedAction": "블록 길이를 줄이고 핵심 메시지 중심으로 재구성한 버전을 생성하십시오.",
 "severity": "medium"
}
```

## Sample #3 — Gamification Insight
```
{
 "insightType": "gamification",
 "title": "Streak 끊김 위험 사용자 증가",
 "summary": "지난 3일간 활동 저하 사용자가 18% 증가했습니다.",
 "evidence": [
   { "metric": "Streak Break Risk", "value": "18% 증가" },
   { "metric": "Active Users Trend", "value": "-12% WoW" }
 ],
 "recommendedAction": "복귀 유도를 위해 간단한 Daily Quest를 자동 배포하십시오.",
 "severity": "medium"
}
```

---

# 8. Insight Registry (DB 테이블)

### 테이블명: `ai_tutor_insights`

| 필드명 | 타입 | 설명 |
|--------|-------|---------|
| insight_id | UUID | PK |
| insight_type | STRING | skill/scenario/content/gamification/mission |
| title | STRING | 인사이트 제목 |
| summary | TEXT | 상세 설명 |
| evidence_json | JSON | 근거 지표 |
| recommended_action | TEXT | 조치 제안 |
| severity | STRING | low/medium/high |
| related_skill_tags | ARRAY | optional |
| related_modules | ARRAY | optional |
| related_scenarios | ARRAY | optional |
| affected_region | STRING | optional |
| affected_teams | ARRAY | optional |
| timestamp | DATETIME | 생성 시각 |

---

# 9. 요약

AI Tutor Insights Engine은 다음 요구사항을 충족해야 한다.

1. 모든 Analytics 지표를 입력 신호로 읽는다.  
2. Rule Engine + LLM Reasoning의 하이브리드 방식 사용.  
3. Actionable Insight만 출력한다.  
4. Evidence 기반 설명, Severity, Recommended Action 필수.  
5. Admin Dashboard "AI Tutor Insights" 위젯과 1:1로 연결된다.  
6. Insight Registry(DB)에 저장하여 재사용/필터링/우선순위 정렬 가능.

본 스펙은 Retail AI Trainer의 “AI 기반 운영 지능”의 핵심을 이룬다.
