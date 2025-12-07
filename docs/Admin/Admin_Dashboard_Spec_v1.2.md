# **Admin Dashboard Spec v1.2 — Full Enterprise-Grade Specification (Format D)**  
Status: FINAL • Authoritative Dashboard Blueprint  
Aligned with:  
- Analytics Engine Spec v1.1  
- Gamification Engine Spec v1.2  
- System Settings v1.1 (Immediate Hot Reload)  
- User Management v2.1  
- Cross-Mapping Table v1.1  

---

# **0. Executive Summary**

Admin Dashboard v1.2 is the operational command center of **Retail AI Trainer**.  
It integrates:

- SalesLab Analytics  
- Learning Analytics  
- Gamification Metrics  
- Engagement Metrics  
- AI Insights  
- Scope-aware Drilldown  
- Version-aware Data  

The dashboard is designed to match **top-tier enterprise tools** (Amplitude, Salesforce, Duolingo, LinkedIn Learning).

---

# **1. Dashboard Layout (Desktop)**

```
┌──────────────────────────────────────────────┐
│ Top Bar (Filters + Scope Selector)           │
├──────────────────────────────┬───────────────┤
│ Left Navigation              │ AI Insights    │
│ (Admin Menu)                 │ & Alerts Feed  │
├──────────────────────────────┴───────────────┤
│ Main Panel (KPIs • Charts • Tables)          │
└──────────────────────────────────────────────┘
```

### **Top Bar Controls**
- Date Range (Last 7d / 30d / Custom)
- Scope Selector (Global → Region → Country → Branch → Team)
- Engine Filter (SalesLab / Learning / Gamification)

---

# **2. Executive Summary KPIs**

| KPI | Definition | Source |
|-----|------------|--------|
| Active Users Today | Unique daily logins | event_log |
| Module Completion Rate | completed / started | snapshot_daily_user |
| Quiz Pass Rate | passed / completed | interaction_log |
| SalesLab Sessions Today | # of sessions | session_log |
| Upsell Success Rate | success / attempts | session_log.summary |
| Avg Mastery Level | average daily mastery | snapshot_daily_user |
| XP Growth (7d) | delta XP | snapshot_daily_user |
| Streak Retention | 3/7/14-day retention | streak engine |

KPIs display **trend arrows** vs previous period.

---

# **3. Engagement & Activity Analytics**

### **3.1 Daily Active Users (DAU) Trend**
- Line chart  
- Drilldown enabled (region → country → branch → team)

### **3.2 Activity Heatmap**
(Weekday × Time Slot) density map  
- Identifies peak usage hours  
- Detects low-activity segments

### **3.3 Learning Funnel**
Stages:
```
Module Start → Module Complete → Quiz Attempt → Quiz Pass → SalesLab Session
```

---

# **4. Learning Analytics (Modules & Quizzes)**

### **4.1 Module Completion Breakdown**
- Top/Bottom modules  
- Drop-off ratios

### **4.2 Quiz Analytics**
- Average score  
- Pass rate  
- Item difficulty mapping  
- High-failure questions flagged automatically

### **4.3 Learning Time Distribution**
- Per user  
- Per team  
- Outlier detection (too short / too long learning)

---

# **5. SalesLab Performance Analytics**

### **5.1 Scenario Usage Stats**
- Total runs per scenario  
- Scenario-level difficulty usage

### **5.2 Persona/Trait Breakdown**
Which personas/traits create more difficulty for learners.

### **5.3 Upsell Funnel Visualization**
```
Pitch → Objection → Response → Success
```

### **5.4 Turn Count Metrics**
- Average turn count  
- Early termination patterns detection

---

# **6. Gamification Analytics (v1.2)**

### **6.1 XP Growth**
30-day XP growth line chart.

### **6.2 Badge Distribution**
Donut chart grouped by badge categories.

### **6.3 Mastery Level Funnel**
Distribution across Level 0–5.

### **6.4 Streak Retention**
- 3-day / 7-day / 14-day streak survival curve

### **6.5 Leaderboard Snapshot**
- Scope-aware ranking  
- Metrics: XP, module rate, quiz rate, saleslab performance  

---

# **7. AI Insights & Alerts Feed**

### **Insight Categories**
- Performance Outliers  
- Training Bottlenecks  
- Skill Gap Detection  
- Streak Drop Risks  
- Scenario Difficulty Alerts  
- Content Inefficiency Detection  

### **Alert Levels**
```
Critical (red) / Warning (yellow) / Info (blue) / Insight (purple)
```

### **UX**
- Click → Detailed modal  
- Suggested Action (AI-generated)  
- Insight History

---

# **8. Mobile Dashboard (v1.2)**

Mobile-first card system:

### Card Order:
1. Executive KPIs  
2. XP/Mastery/Badges summary  
3. Mini Activity Heatmap  
4. SalesLab summary card  
5. Insights Feed  

Bottom Navigation:
```
Home | Analytics | Gamification | Insights | Settings
```

---

# **9. UI Components (Tailwind + Custom)**

### KPI Card
```
<div class="bg-white p-4 rounded-xl shadow flex flex-col">
  <span class="text-gray-500 text-sm">KPI Name</span>
  <span class="text-2xl font-bold">82%</span>
  <span class="text-green-500 text-sm">+5.3%</span>
</div>
```

### Chart Container
```
<div class="w-full h-[320px] bg-white rounded-xl shadow p-4">
  <!-- chart mount -->
</div>
```

### Insights Feed Item
```
<li class="p-3 bg-indigo-50 rounded border-l-4 border-indigo-500">
  <strong>Insight Title</strong>
  <p class="text-gray-700 text-sm">Description...</p>
</li>
```

---

# **10. Admin Dashboard API Endpoints**

| Feature | API |
|---------|------|
| KPI Summary | `/analytics/kpi/summary` |
| Engagement | `/analytics/engagement` |
| Module Analytics | `/analytics/modules` |
| Quiz Analytics | `/analytics/quizzes` |
| SalesLab | `/analytics/saleslab` |
| Gamification | `/analytics/gamification` |
| Leaderboard | `/gamification/leaderboard` |
| Insights | `/insights/feed` |

All endpoints MUST be:
- **scope-aware**  
- **version-aware**  

---

# **11. AG Directives (Mandatory)**

AG MUST:

### D-01  
Apply scope filter to every analytics request.

### D-02  
Use snapshot_daily_user for XP/Mastery/Badges (never raw logs).

### D-03  
Calculate SalesLab KPIs from session_log.summary only.

### D-04  
Render Insights with versionContext included.

### D-05  
Apply System Settings changes via Immediate Hot Reload.

---

# **12. END OF DOCUMENT — Admin Dashboard Spec v1.2**
