# **User Dashboard Spec v2.2 — Full Enterprise & Gamified UX (Format D)**  
Status: FINAL • Authoritative UI Spec  
Aligned with:  
- Gamification Engine v1.2  
- Analytics Engine v1.1  
- SalesLab Engine  
- Insights Engine v1.1  
- System Settings v1.1  
- User Management v2.1  
- Cross-Mapping Table v1.1  

---

# **0. Executive Summary**

User Dashboard v2.2 is the flagship UI of Retail AI Trainer.  
Its purpose is not simply to show data, but to *motivate users to take one more learning action today*.  
This dashboard integrates:

- Personalized tasks (AI-driven)  
- Learning progress & recommendations  
- SalesLab insights  
- XP / Badge / Streak / Mastery visualizations  
- Leaderboard preview (scope-aware)  
- Personalized insights (AI Tutor)  

It supports both **mobile-first** and **desktop-enhanced** layouts.

---

# **1. Mobile-First Layout (Primary Experience)**

```
Hero Zone (Progress Ring, Level, XP Bar)
▼
Today’s Tasks (AI Recommended)
▼
Learning Pathway (Continue / Next Modules)
▼
SalesLab Zone (Scenario Recommendations)
▼
Gamification Zone (XP, Badges, Mastery, Streak)
▼
Leaderboard Preview (Scope-aware)
▼
AI Insights for You
▼
Bottom Navigation
```

---

# **2. Hero Zone (Mastery + XP + Streak)**

## **2.1 Progress Ring (Mastery Level)**  
- Reflects mastery level 0–5  
- Animated ring with color progression  
- Level 5 includes “aurora-glow” effect  

## **2.2 XP Progress Bar**  
Shows XP to next level.  
- Particle animation on XP gain  
- Daily XP goal completion burst effect  

## **2.3 Daily Streak Indicator**  
- Fire streak animation  
- Milestone boosts: 7/14/30 days  

---

# **3. Today’s Tasks (AI Recommendation Zone)**

AI-generated tasks based on mastery gaps, recent performance, and learning patterns.

### **Task Types**
- Recommended Module: “복습 필요 영역”  
- Quiz Fix: “틀린 문제 해결”  
- SalesLab of the Day: “Difficulty 2 → 3 레벨업 도전”  
- XP Goal: “오늘 XP 150 더 모으면 Level Up!”  
- Streak Protection: “오늘 학습 안하면 14일 streak 깨짐!”  
- Badge Near Completion: “Upsell 성공 2번만 더!”  

UI: horizontally scrollable task cards (mobile).

Endpoints:
```
GET /dashboard/tasks
```

---

# **4. Learning Pathway Zone**

### **4.1 Continue Learning**
- Shows modules in progress  
- Resume CTA prominently  

### **4.2 Next Modules (AI Personalized)**
AI uses:
- Mastery low areas  
- Quiz incorrect patterns  
- Module drop-off patterns  
- Difficulty trends  

### **4.3 Completed Modules**
3 most recent completions.  
Revisit suggestions included.

Endpoints:
```
GET /learning/progress/:userId
```

---

# **5. SalesLab Zone (Practice Training)**

### **5.1 Recommended Scenario**
Based on:
- Persona difficulty  
- Trait activation  
- Upsell performance  
- Difficulty progression  

### **5.2 Objection of the Day**
Daily rotating objection practice.

### **5.3 Last Session Summary**
Shows:
- Turn count  
- Objections handled  
- Upsell success probability  
- Behavioral insights  

Endpoints:
```
GET /saleslab/summary/:userId
```

---

# **6. Gamification Zone (XP, Badges, Mastery, Streak)**

### **6.1 XP Summary**
- XP total  
- XP to next level  
- Daily XP target graphic  

### **6.2 Badge Collection**
Grid layout with rarity tiers:  
- Basic / Advanced / Expert / Mastery  
Unlocked badges have animation.

### **6.3 Mastery Breakdown**
Skill-tree style breakdown for:
- Module  
- Quiz  
- SalesLab  

### **6.4 Streak Heatmap**
Small calendar block with color-coded streak continuity.

Endpoints:
```
GET /gamification/summary/:userId
GET /gamification/xp/:userId
GET /gamification/badges/:userId
GET /gamification/mastery/:userId
```

---

# **7. Leaderboard Preview (Scope-Aware)**

Scope rules mirror User Management v2.1:

- Learner → personal only  
- Trainer → team/branch  
- Operator → region/country  
- Admin → full  

UI elements:
- Rank card  
- Top 3 preview  
- “View Full Leaderboard” CTA  

Endpoints:
```
GET /gamification/leaderboard
```

---

# **8. AI Insights for You (Personal Coach Feed)**

Insights Engine v1.1 generates personalized coaching.

### **Insight Types**
- Skill Gap  
- Quiz Trouble Areas  
- SalesLab Objection Weakness  
- Streak Drop Risk  
- Low-learning prediction  
- Recommended actions  

UI: vertically scrollable feed (TikTok/Reels style optional).

Endpoint:
```
GET /insights/user/:userId
```

---

# **9. Mobile UX Design Principles**

### **9.1 1-Hand Navigation Zone**
All action buttons placed within lower 40% of screen.

### **9.2 Gesture Enhancements**
- Swipe between tasks  
- Long press to open detail  
- Drag XP bar to preview next rewards  

### **9.3 Responsive Block UI**
One key metric per block for cognitive simplicity.

### **9.4 Dynamic Color System**
XP / Streak / Mastery level dynamically update theme color:
- Mastery Level 0–1: Blue  
- Level 2–3: Purple  
- Level 4–5: Gold  

### **9.5 Iconography**
Badges & XP animations rely on lightweight Lottie animations.

---

# **10. Desktop Enhancement Layout**

Desktop arranges components in 2-column grid:

### Left Column
- Hero Zone  
- Today’s Tasks  
- Learning Pathway  

### Right Column
- SalesLab Zone  
- Gamification  
- Leaderboard Preview  
- Insights Feed  

---

# **11. UI Components (Tailwind + Custom)**

### Task Card
```
<div class="bg-white shadow rounded-xl p-4 flex flex-col gap-2">
  <div class="text-lg font-semibold">Recommended Module</div>
  <p class="text-gray-600 text-sm">어제 어려웠던 Module 3을 복습해보세요</p>
  <button class="mt-auto bg-indigo-600 text-white px-3 py-1 rounded-lg">
    시작하기
  </button>
</div>
```

### Badge Tile
```
<div class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 shadow-md flex items-center justify-center">
  <img src="badge.svg" class="w-10 h-10" />
</div>
```

### Insights Card
```
<li class="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-lg">
  <strong>Quiz Weakness Detected</strong>
  <p class="text-sm text-gray-700">논리 문제 유형에서 정답률이 40%입니다.</p>
</li>
```

---

# **12. User Dashboard API Specifications**

| Feature | Endpoint |
|---------|----------|
| Tasks | `/dashboard/tasks` |
| XP/Level | `/gamification/xp/:userId` |
| Gamification Summary | `/gamification/summary/:userId` |
| Badges | `/gamification/badges/:userId` |
| Mastery | `/gamification/mastery/:userId` |
| Leaderboard | `/gamification/leaderboard` |
| Learning Progress | `/learning/progress/:userId` |
| Quiz Performance | `/learning/quiz/:userId` |
| SalesLab Summary | `/saleslab/summary/:userId` |
| Insights | `/insights/user/:userId` |

All APIs MUST be:
- **Scope-aware**  
- **Version-aware**  
- **Snapshot-consistent**

---

# **13. AG Directives**

AG MUST:

### UD-01  
Return only scope-appropriate leaderboard rows.

### UD-02  
Use snapshot values for XP / Mastery / Badges (no dynamic recalculation).

### UD-03  
Generate Today’s Tasks using Insights + Analytics + Gamification metrics.

### UD-04  
Respect System Settings (tone, model, toggles) via Hot Reload.

### UD-05  
Ensure UI text recommendations follow languageTone presets.

---

# **14. END OF DOCUMENT — User Dashboard Spec v2.2**
