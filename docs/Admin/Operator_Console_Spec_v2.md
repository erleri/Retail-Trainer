# **Operator Console Spec v2 — Full Re-Architecture (Format D)**  
Status: FINAL • Authoritative Operational Console Architecture  
Aligned with:  
- Scenario Engine  
- Prompt Engine  
- Difficulty Engine  
- Content Engine  
- Gamification Engine v1.2  
- Analytics Engine v1.1  
- Insights Engine v1.1  
- System Settings v1.1  
- User Management v2.1  

---

# **0. Operator Console Purpose**

Operator Console v2 is the operational command center.  
Its mission is to enable Operators to:

- Build, deploy, and manage learning content  
- Configure SalesLab behavior  
- Tune difficulty, XP, badges, mastery  
- Monitor learner performance  
- React to insights  
- Automate missions and quests  
- Coordinate system-level operations safely  

The Console must reduce operational workload by >70% through automation, previews, and AI support.

---

# **1. Console Navigation Structure**

Tabs:

```
1) SalesLab Management
   - Scenario Builder
   - Prompt Engineering
   - Difficulty Tuning

2) Content Management
   - Module Library
   - Quiz Builder
   - Auto-Transform
   - Version Control

3) Gamification Management
   - XP Rules
   - Badge Management
   - Streak Rules
   - Mastery Calibration

4) User Performance Monitor
   - User Insights
   - Alerts & Performance Flags
   - Group Comparison

5) Insights Console

6) Mission & Quest Builder

7) System Operations (Operator-Lite Settings)
```

Mobile Footer Navigation:

```
SalesLab | Content | Gamification | Insights | Ops
```

---

# **2. SalesLab Management v2**

## **2.1 Scenario Builder (Advanced)**  
New features:

- Persona/Trait Matrix Preview  
- Difficulty Flow Simulation  
- Trigger/Rule Conflict Detection  
- Branching Dialogue Visualizer  
- Scenario Versioning + Diff View  
- “AI Simulation Test Run” button  

### Scenario Actions:
- Add/Edit/Delete stages  
- Modify stage transitions  
- Validate triggers  
- Publish scenario version  

---

## **2.2 Prompt Engineering v2**

Supports **hierarchical overrides**:

```
Global Prompt  
  ↓ Persona-level Override  
    ↓ Scenario-level Override  
      ↓ Stage-level Override
```

### Features:
- Prompt testing  
- Version change audit  
- Hot Reload on save  
- Prompt linting & safety validation  

---

## **2.3 Difficulty Tuning v2**

Difficulty parameters:

- Upsell Resistance  
- Objection Frequency  
- Emotional Variability  
- Domain Knowledge Depth  
- Surface vs Deep Challenges  

UI shows a real-time preview:

- Expected dialogue length  
- Predicted objection count  
- Estimated success probability  

---

# **3. Content Management v2**

## **3.1 Module Library**

Supports:

- File upload (PDF, Google Docs, PPTX)  
- Metadata editing (tags, regions, difficulty)  
- Status control: draft / published / archived  

---

## **3.2 Quiz Builder v2**

Powerful features:

- AI-assisted question generation  
- Distractor quality validation  
- Difficulty auto-scoring  
- Question analytics (historical pass rate)  
- Version snapshots  

---

## **3.3 Auto-Transform Engine Control**

Transforms SalesTalk → Module + Quiz.

UI:

- Side-by-side Diff Editor  
- Step builder  
- Quiz generation preview  
- Version history  

Operator must approve output before publishing.

---

# **4. Gamification Management v2**

## **4.1 XP Rules**
- XP actions (module complete, quiz pass, saleslab run)  
- XP adjustment tool  
- “If user performs X” preview  

## **4.2 Badge Management**
- Create/edit badges  
- Rarity (Basic/Advanced/Expert/Mastery)  
- Unlock rules  
- Auto-grant preview  

## **4.3 Streak Rules**
- Thresholds  
- Reset logic  
- Reward boosts  

## **4.4 Mastery Calibration**
- Mastery Weight Tuning  
- Normalization parameters  
- Outlier handling  
- Difficulty alignment  

---

# **5. User Performance Monitor v2**

## **5.1 User Dashboard (Operator View)**
- Learning progress  
- Weak modules  
- Quiz difficulty map  
- Mastery chart  
- XP trend  
- Streak risk  

## **5.2 Alerts & Flags**
Color coding:
- Red: Critical  
- Yellow: Warning  
- Purple: Insight  
- Blue: Info  

## **5.3 Group Comparison**
Compare:
- Region vs Region  
- Branch vs Branch  
- Team vs Team  

Metrics:
- Module completion rate  
- Quiz pass rate  
- SalesLab success  
- XP growth  

---

# **6. Insights Console**

Insights Engine v1.1 output:

- Skill gaps  
- Training bottlenecks  
- Scenario mismatch alerts  
- Persona/Trait difficulty anomalies  
- High-failure quiz questions  
- XP stagnation  
- Learning inefficiency signals  

Actions:
- Recommend content  
- Trigger missions  
- Scenario difficulty adjustment  
- Notify trainer  

---

# **7. Mission & Quest Builder**

Mission types:

- Daily missions  
- Weekly quests  
- Seasonal challenges  

Reward types:
- XP  
- Badges  
- Streak boost  

Target settings:
- Global / Region / Country / Branch / Team / Persona Group  

Tracking:
- Completion rate  
- Leaderboard contribution  

---

# **8. System Operations (Operator-Lite Settings)**

Operator-safe settings:

- Module Release Scheduling  
- Batch Auto-Transform  
- Prompt language tone override  
- Mission publishing  
- Insight refresh cycle  

Restrictions:
Operator cannot override Admin-level AI Config/Integrations.

---

# **9. Mobile UX Adaptation**

Mobile capabilities:

- Scenario Builder (mini mode)  
- Prompt editing  
- Quick mission assignment  
- Alerts feed  
- User lookup  
- Quiz builder preview  

UX:
- Swipe-based navigation  
- Sticky CTA buttons  
- Optimized for one-hand operation  

---

# **10. UI Components (Tailwind)**

### Scenario Stage Card
```
<div class="rounded-xl shadow bg-white p-4 flex flex-col gap-1">
  <span class="font-semibold">Stage 2: Objection Handling</span>
  <p class="text-sm text-gray-600">Trigger: customer_doubt</p>
</div>
```

### XP Rule Row
```
<tr class="border-b">
  <td>Module Complete</td>
  <td><input type="number" value="50" class="input" /></td>
  <td><button class="btn-primary">Apply</button></td>
</tr>
```

---

# **11. Operator Console API Contract (v2)**

```
/operator/scenario/*
/operator/prompt/*
/operator/difficulty/*
/operator/content/*
/operator/quiz/*
/operator/xp-rules/*
/operator/badges/*
/operator/mastery/*
/operator/streak/*
/operator/missions/*
/operator/insights/*
/operator/user-monitor/*
```

Rules:
- Scope-aware  
- Version-aware  
- Hot Reload on save  
- Structured error handling  

---

# **12. AG Directives**

### OP-01  
Scenario rules must never be altered by AI unless explicitly instructed.

### OP-02  
Builder preview must reflect real engine logic.

### OP-03  
Auto-transform output requires operator approval.

### OP-04  
Difficulty tuning triggers immediate SalesLab Hot Reload.

### OP-05  
Mission rules must follow gamification engine requirements.

### OP-06  
Operator Console must not override Admin-only System Settings.

---

# **END OF DOCUMENT — Operator Console Spec v2**
