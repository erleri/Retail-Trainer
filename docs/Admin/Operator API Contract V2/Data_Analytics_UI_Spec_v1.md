# Data & Analytics UI Spec v1  
*(Admin Console — Phase A Final Deliverable)*

---

# 0. 목적 (Purpose)

Analytics Console은 운영자가 Retail AI Trainer에서 발생하는 모든 학습·세션·시나리오·미션·게이미피케이션·인사이트 데이터를 한 곳에서 분석하는 허브이다.  
목표는 다음과 같다:

1. Sales Lab 전반 KPI 모니터링  
2. Region/Country/Branch별 성과 비교  
3. 사용자별 학습/스킬 향상 경로 분석  
4. Gamification·Mission·Insights의 흐름 파악  
5. Drill-down 기반 개선 조치 연결  

---

# 1. 전체 아키텍처(UI 정보 구조)

```
Analytics (Top-level Menu)
│
├─ Overview (Global Dashboard)
│
├─ Scenario Analytics
│   └─ Performance / Difficulty / Persona Breakdown
│
├─ Quiz & Learning Analytics
│   └─ Topic Heatmap / Module Completion / Accuracy Trends
│
├─ Gamification Analytics
│   └─ XP / Level / Streak / Badge / Mastery 분석
│
├─ Insights Analytics
│   └─ Strength / Weakness / Risk / Recommendation / Anomaly
│
├─ Mission Analytics
│   └─ Completion / Active / Branch Missions / Recommendation Source
│
└─ User Performance Explorer
    └─ User-level drill-down
```

---

# 2. 공통 요소 — 필터바(Global FilterBar)

모든 화면 상단에서 동일한 필터 구조 적용.

### 필터 항목
- 기간: Today / 7D / 30D / Quarter / Custom  
- Region  
- Country  
- Branch  
- User Role (Sales / Trainer / Manager)  
- Scenario Type  
- Content Category  
- Difficulty Level  

### UI 스타일 (Tailwind)
```
flex gap-2 items-center
DateRangePicker / Select / ComboBox
```

### 기능
- 필터 변경 시 즉시 API 재조회  
- URL query sync  
- Drill-down 화면에서도 유지  

---

# 3. Overview Dashboard (Global Summary)

### 3.1 KPI Cards (Top Row)
- Active Learners  
- Total Training Sessions  
- Avg Session Length  
- Scenario Success Rate  
- Quiz Accuracy  
- Mission Completion Rate  
- Engagement Score(E)  
- Risk Index(R)  

**Desktop**: 4×2 그리드  
**Mobile**: 세로 스택, swipeable  

---

### 3.2 Trend Charts
- Learning Session Trend  
- Quiz Accuracy Trend  
- Scenario Success Trend  
- XP Gain Trend  
- Mission Activity Trend  

**Recharts 기본 구성**  
- LineChart / AreaChart / BarChart  
- Tooltip / Legend / ResponsiveContainer  

---

### 3.3 Insight Distribution (Heatmap)
- Weakness distribution  
- Risk distribution  
- Strength categories  
- Recommendation volume  

---

# 4. Scenario Analytics

### 4.1 KPI
- Avg Turns  
- Upsell Success Rate  
- Avg Objections  
- Behavior Score  
- Difficulty Breakdown  

### 4.2 Persona × Difficulty Heatmap
- Persona success rate  
- Difficulty drop-off  

### 4.3 Session Detail Table
- User  
- Persona  
- Difficulty  
- Upsell Success  
- Objection Count  
- Behavior Score  
- Duration  
- Drill-Down → User Explorer  

---

# 5. Quiz & Learning Analytics

### 5.1 Topic Heatmap
- OLED Basics / HDR / Gaming / Brightness / Sound 등  
- Accuracy Band별 분포  

### 5.2 Module Completion Funnel
1. Module Viewed  
2. Module Started  
3. 50%  
4. Completed  
5. Quiz Completed  

### 5.3 Wrong Answer Pattern Analysis
- Topic별 오답 빈도  
- 난이도별 error concentration  
- Region/Branch 비교  

---

# 6. Gamification Analytics

### 6.1 XP & Level Trends
- XP Gain Volume  
- Level Distribution  
- Streak 유지율  

### 6.2 Badge & Mastery
- Badge 획득량 Top 10  
- Mastery Tier Distribution  
- Mastery Growth Trend  

---

# 7. Insights Analytics

### 7.1 Insight Volume
- Strength / Weakness / Risk / Recommendation / Anomaly  
- 최근 7D/30D 변화량  

### 7.2 Insight Breakdown
- Region/Country/Branch별 Heatmap  
- Category Breakdown  

### 7.3 Risk Identification Panel
- High-risk users  
- Streak drop  
- Knowledge decline  

---

# 8. Mission Analytics

### 8.1 Mission KPIs
- Assigned / Active / Completed / Failed  
- Avg Completion Time  
- Success Rate by Category  

### 8.2 Branch Missions
- Branch-level Objectives  
- Mission Progress  
- User Contribution Ranking  

### 8.3 Recommended Missions
- Insight → Mission 자동 발행 목록  
- Source Insight ID  
- 처리 여부  

---

# 9. User Performance Explorer (Drill-down)

사용자 단위 정밀 분석 화면.

### 좌측: User Profile Card  
- Name / Branch / Role  
- Level / XP / Badges Summary  
- Engagement Score  

### 우측: 탭 구성
```
Scenario | Quiz | Learning | Gamification | Missions | Insights
```

---

## 9.1 Scenario Tab
- Session timeline  
- Persona success rate  
- Difficulty performance  

## 9.2 Quiz Tab
- Radar chart (topic accuracy)  
- Weak/Strong topics  
- Time-to-complete  

## 9.3 Learning Tab
- Module completion  
- Repeat counts  

## 9.4 Gamification Tab
- XP Trend  
- Level-up history  
- Badge & Mastery summary  

## 9.5 Missions Tab
- Active missions  
- Completed missions  
- Quest progress  

## 9.6 Insights Tab
- 개인 강점/약점/위험/추천 요약  

---

# 10. Mobile UX 설계

### 공통 구조
- Compact FilterBar  
- KPI Cards → Swipe  
- Charts → Scroll Snap  
- 상세 화면 → Bottom Sheet

### User Explorer 모바일
- Profile 상단 고정  
- Horizontal scroll tabs  
- 모바일 최적화 chart aspect ratio  

---

# 11. API 매핑 테이블

| 화면 | API | 데이터 소스 |
|------|------|--------------|
| Overview | `/operator/upm/summary`, `/operator/insights/group`, `/operator/gamification/...` | UPM / Insights / Gamification |
| Scenario Analytics | `/operator/upm/scenario/...` | Scenario Log |
| Quiz Analytics | `/operator/upm/quiz/...` | Quiz Log |
| Learning Analytics | `/operator/upm/learning/...` | Learning Log |
| Gamification Analytics | `/operator/gamification/...` | Gamification |
| Insights Analytics | `/operator/insights/...` | Insights Engine |
| Mission Analytics | `/operator/missions/...` | Missions Engine |
| User Explorer | All of above | 전체 엔진 |

---

# 12. DX Implementation Notes

- Recharts Theme 통일  
- 모든 API 응답은 `{ data, meta }` 구조  
- FilterBar는 재사용 가능한 전역 컴포넌트  
- 모바일/데스크톱 자동 전환  
- Drill-down 시 필터·상태 유지  

---

# END — Data & Analytics UI Spec v1
