# **Operator Console UI v2 — High-Fidelity Wireframe Specification (Format D)**  
Status: FINAL • Developer-Ready UI Specification  
Aligned with Operator Console Spec v2, Gamification Engine v1.2, Content Engine, SalesLab Engine, Analytics v1.1, Insights v1.1, System Settings v1.1

---

# **0. Purpose**

Operator Console UI v2 defines the *production-ready* user interface for Operators to manage:

- SalesLab (Scenario / Prompt / Difficulty)
- Content (Modules / Quiz / Auto-Transform)
- Gamification (XP / Badge / Streak / Mastery)
- User Performance Monitoring
- AI Insights Console
- Missions & Quests
- System Operations (Operator-level settings)

This UI must support both **Desktop** (primary) and **Mobile** (field-use) environments with Tailwind CSS + Custom Components.

---

# **1. Global Navigation Layout**

```
┌───────────────────────────────────────────────┐
│ Top Bar: Search | Notifications | Profile     │
├──────────────────────┬────────────────────────┤
│ Left Sidebar (Nav)   │ Main Workspace         │
│ Expandable w/ Icons  │ Dynamic per module     │
└──────────────────────┴────────────────────────┘
```

### **Sidebar Sections**
```
SalesLab Management
  - Scenario Builder
  - Prompt Engineering
  - Difficulty Tuning

Content Management
  - Module Library
  - Quiz Builder
  - Auto-Transform
  - Version Control

Gamification Management
  - XP Rules
  - Badge Management
  - Streak Rules
  - Mastery Calibration

User Performance Monitor
  - User Insights
  - Alerts
  - Group Comparison

Insights Console

Mission & Quest Builder

System Operations (Operator-Lite Settings)
```

---

# **2. SalesLab Management UI**

## **2.1 Scenario Builder (Advanced Node-Based Builder)**

### Layout:
```
Left: Scenario List
Center: Node Graph (Stage Flow Editor)
Right: Stage Detail Panel
```

### Node Graph Canvas
- Drag & drop stages
- Connectors between nodes
- Version & diff preview
- AI Simulation “Test Run” button

### Stage Detail Panel
- Stage prompt
- Triggers / Conditions
- Persona & Trait preview
- Difficulty preview
- “Save Stage” & “Apply to Scenario” CTA

### Tailwind Structure:
```html
<div class="flex gap-4">
  <aside class="w-60 bg-white rounded-xl shadow p-3">...</aside>
  <section class="flex-1 bg-white rounded-xl shadow p-3 relative">...</section>
  <aside class="w-72 bg-white rounded-xl shadow p-3">...</aside>
</div>
```

---

## **2.2 Prompt Engineering UI v2**

### Layout:
```
Left: Prompt Layer Navigator
Center: Prompt Editor (Monaco/ACE)
Right: Prompt Preview + AI Suggestions
```

### Prompt Layers:
```
Global Templates
Persona-level Prompts
Scenario-level Prompts
Stage-level Overrides
```

### Editor UI:
```html
<textarea class="w-full h-full font-mono bg-gray-900 text-green-200 p-4 rounded-lg"></textarea>
```

---

## **2.3 Difficulty Tuning UI v2**

### Key Controls:
- Upsell Resistance (Slider)
- Objection Frequency (Slider)
- Emotional Variance (Dial)
- Knowledge Depth (Stepper)
- Success Probability Gauge

### UI Block (Tailwind):
```html
<div class="bg-white rounded-xl p-4 shadow">
  <label class="font-medium">Upsell Resistance</label>
  <input type="range" class="w-full"/>
</div>
```

---

# **3. Content Management UI**

## **3.1 Module Library**

### Layout:
```
Top: Upload + Filters
Center: Module Grid
Right: Metadata Editor
```

### Module Card:
```html
<div class="rounded-xl bg-white shadow p-4 hover:shadow-lg transition">
  <h3 class="font-semibold">Module Title</h3>
  <p class="text-sm text-gray-600">Difficulty: 2</p>
  <span class="badge">Published</span>
</div>
```

---

## **3.2 Quiz Builder UI v2**

### Layout:
```
Left: Question List
Right: Question Detail Editor
```

### Question Detail:
- Question text
- Options
- Correct answer
- Difficulty auto-score
- AI Suggest distractors

---

## **3.3 Auto-Transform UI**

### Layout:
```
Left: Original SalesTalk
Right: Generated Module & Quiz
Bottom: Approve / Regenerate / Edit
```

### Diff UI:
```html
<div class="grid grid-cols-2 gap-4">
  <pre class="bg-gray-100 p-3 rounded-lg">Original...</pre>
  <pre class="bg-gray-100 p-3 rounded-lg">Transformed...</pre>
</div>
```

---

# **4. Gamification Management UI**

## XP Rule Table
```
Action                | XP | Edit
Module Completed      | 50 | [Edit]
Quiz Passed           | 20 | [Edit]
SalesLab Attempt      | 30 | [Edit]
```

## Badge Gallery Grid
```html
<div class="grid grid-cols-4 gap-4">
  <div class="badge-card rarity-master"></div>
  <div class="badge-card rarity-advanced"></div>
</div>
```

## Mastery Calibration
- Weight sliders
- Normalization parameters
- Outlier removal toggle

---

# **5. User Performance Monitor UI**

### Layout:
```
Top: User Search
Left: User Overview
Right: Charts & Analytics
```

### Charts:
- Mastery Radar
- XP Growth Line
- Quiz Heatmap
- SalesLab Funnel

---

# **6. Insights Console UI**

### Insight Card:
```html
<div class="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-xl">
  <h4 class="font-bold">Skill Gap Detected</h4>
  <p>Module 4 shows repeated failures in step 3.</p>
  <button class="btn-primary">Recommend Training</button>
</div>
```

---

# **7. Mission & Quest Builder UI**

### Mission Fields:
- Title  
- Goal  
- Reward (XP / Badge / Streak)  
- Target Scope  
- Preview  
- Publish  

### Mission Block:
```html
<div class="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
  Complete 3 modules → Reward: +200 XP
</div>
```

---

# **8. System Operations (Operator-Lite Settings)**

- Module Release Scheduler  
- Batch Auto-Transform  
- Prompt tone override  
- Insight refresh cycle  

---

# **9. Mobile UI Design**

### Principles:
- Bottom navigation
- Swipe interactions
- Sticky CTA buttons
- Simplified Scenario Builder
- Portable Insights Feed
- Mobile-friendly Mission Builder

### Example:
```
[Task Cards]
[Scenario List]
[Module Library]
[Insights Feed]
[Bottom Nav]
```

---

# **10. Shared Tailwind Components**

### CTA Button
```html
<button class="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700">
```

### Card Container
```html
<div class="bg-white rounded-xl shadow p-4">
```

---

# **END OF DOCUMENT — Operator Console UI v2**
