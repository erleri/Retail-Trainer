# **Admin ↔ User ↔ Gamification Cross-Mapping Table**
Version: 1.0  
Module: Retail AI Trainer – System Integration  
Status: Ready for DX & AG Implementation  
Updated: Now  

---

# **0. Purpose**
This document defines the **cross-domain mapping** between:

- **Admin Dashboard**
- **Gamification Engine**
- **User Dashboard**

It shows *how data flows*, *which engine powers which KPI*, and *how user-facing features map back to admin insights*.  
This is a required reference for DX·AG teams to ensure unified behavior across all modules.

---

# **1. Top-Level Mapping Overview**

| Admin Module | Gamification / Engine Source | User Dashboard Output |
|--------------|------------------------------|------------------------|
| Training Engagement | XP Engine, Streak Engine, Quest logs | Profile Banner, Today’s Quest, Weekly Quest |
| AI Coaching Focus | Feedback Engine, Skill Mastery Engine | Recent Feedback & Tip, Skill Mastery |
| Key Programs Progress | Team Mission Engine | Team Mission Widget, Notifications |
| Objection Weakness Heatmap | Skill Mastery Aggregation | Skill Mastery Radar/Cards |
| Leaderboard Insights | Leaderboard Engine, Season | Leaderboard Snapshot |
| Achievement & Motivation | Badge Engine | Earned Badges Summary |
| Upsell Training Effectiveness | Scenario Logs, Upsell Rules | Recommended Scenario / Quick Actions |
| Content Utilization | Content Logs, Quiz Logs | Recommended Content, Quiz Retry |
| Alerts / To-Do | Notification Engine | User Inbox / Alerts |
| Training Drift | Streak Break Events | Streak Widget, Zero-State Prompts |

---

# **2. Admin → Gamification → User Mapping (Detailed)**

---

## **2.1 Training Engagement**

### Admin Views:
- Active users  
- Avg session frequency  
- XP growth trends  
- Streak retention  

### Engine Inputs:
- `XpGrantLog`  
- `UserStreakStatus`  
- `GamificationEvent`  

### User Output:
- XP Progress Bar  
- Level/Tier  
- Streak Indicator  
- Daily/Weekly Quests  

---

## **2.2 AI Coaching Focus**

### Admin Views:
- Weak objection patterns  
- Scenario performance distribution  
- Regional coaching needs  

### Engine Inputs:
- `SalesLabFeedback`  
- `SkillMetric`  
- `ScenarioOutcomeLog`  

### User Output:
- Recent Feedback Summary  
- Next Coaching Tip  
- Highlighted Weak Skills  
- Recommended Scenarios  

---

## **2.3 Key Programs (Team Missions & Campaigns)**

### Admin Views:
- Mission progress (Team/Region)  
- Participation  
- At-risk missions  

### Engine Inputs:
- `TeamMissionProgress`  
- `UserMissionStatus`  

### User Output:
- Team Mission Widget  
- Notifications for new or urgent missions  

---

## **2.4 Objection Weakness Heatmap**

### Admin Views:
- Region/team objections heatmap  
- Scenario-based difficulties  

### Engine Inputs:
- `SkillMetric`  
- `FeedbackLog`  

### User Output:
- Skill Mastery Radar  
- Feedback-driven recommendations  

---

## **2.5 Leaderboard Insights**

### Admin Views:
- Rankings by XP, mastery, sessions  
- Tier-based comparison  

### Engine Inputs:
- `LeaderboardEntry`  
- `LeaderboardDefinition`  
- `Season`  

### User Output:
- Leaderboard Snapshot  
- Seasonal rank progress  

---

## **2.6 Achievements & Motivation**

### Admin Views:
- Badge acquisition rate  
- Rare/common badge distribution  

### Engine Inputs:
- `UserBadge`  
- `BadgeDefinition`  

### User Output:
- Earned Badges Summary  
- Locked/Unlockable Badges  

---

## **2.7 Upsell Training Effectiveness**

### Admin Views:
- Upsell attempt logs  
- Scenario-based performance  
- Persona/Difficulty matrix  

### Engine Inputs:
- `ScenarioLog`  
- `UpsellTriggerLog`  

### User Output:
- Upsell-related recommended scenarios  
- Skill improvement tips  

---

## **2.8 Content Utilization**

### Admin Views:
- Study material usage  
- Quiz accuracy  
- Completion rates  

### Engine Inputs:
- `ContentSessionLog`  
- `QuizOutcome`  

### User Output:
- Recommended Content  
- Quiz retry entry points  

---

## **2.9 Alerts / To-Do Manager**

### Admin Views:
- Important system alerts  
- Coaching-required users  
- At-risk streaks or missions  

### Engine Inputs:
- `UserNotification`  
- `StreakBreakEvent`  
- `MissionAtRiskEvent`  

### User Output:
- Notification Inbox  
- Streak warnings  
- Mission alerts  

---

## **2.10 Training Drift / Drop-off**

### Admin Views:
- Users who fall inactive  
- Drifting skill areas  

### Engine Inputs:
- `UserStreakStatus`  
- Zero-activity logs  

### User Output:
- Zero-State UX prompts  
- Re-engagement quests  

---

# **3. Cross-Domain Mapping Summary Table**

| Category | Admin → What They Monitor | Engine → Data Models | User → Experience |
|----------|----------------------------|----------------------|-------------------|
| Growth | Activity, XP, streaks | XP, Streak | Level, XP Bar, Streak |
| Skills | Weakness patterns | SkillMetric, Feedback | Mastery View, Coaching Tip |
| Missions | Team/Region progress | Mission engine | Mission Widget |
| Motivation | Achievements | BadgeEngine | Badges Summary |
| Competition | Rankings | LeaderboardEngine | Ranking Snapshot |
| Learning | Content/Quiz usage | ContentLog, QuizLog | Quick Actions |
| Coaching | Performance issues | FeedbackEngine | Feedback Widget |
| Alerts | Urgent tasks | NotificationEngine | Inbox Center |

---

# **4. System Flow Diagram (Text-Based)**

```
[User Action]
   ↓ produces
GamificationEvent
   ↓ flows into
XP Engine / Mastery Engine / Badge Engine / Streak Engine
   ↓ updates
User Status (XP, Level, Skills, Badges, Streak)
   ↓ displayed in
User Dashboard Widgets
   ↓ aggregated for
Admin Dashboard KPIs & Insights
```

---

# **5. Summary**
This table creates a unified contract across:

- Admin Dashboard  
- Gamification Engine  
- User Dashboard  

Every Admin KPI is now clearly mapped to engine logic and user behaviors.  
Every User widget is clearly mapped to its Admin-facing purpose.

DX & AG teams should use this mapping as a *source of truth* for implementation.

