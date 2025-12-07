# **Content Management UI + Mobile Learning UX – Full Integrated Spec (v1.0)**  
Style: Tailwind + Custom Component Set (C안)  
Scope: Admin Console + User Mobile Learning  
Status: Consolidated Document (Parts 1~6)

---

# **0. Document Purpose**

본 문서는 Retail AI Trainer의 **Content Management 전체 UI 설계 + Mobile 사용자 학습 UX**를  
하나의 일관된 스펙으로 통합한 버전이다.  
Admin → Content Engine → User Learning → Analytics → Insight까지의 전체 흐름이  
본 문서 하나로 연결되며, AntiGravity AG 엔진이 그대로 이해·구현할 수 있는 형태로 구성된다.

구성은 다음과 같다:

1. Content Library (Part 1)  
2. Upload & AI Transform (Part 2)  
3. Learning Module Editor (Part 3)  
4. Quiz Builder UI (Part 4)  
5. Publish & Versioning Flow (Part 5)  
6. Mobile Learning UX & Dashboard 연결 (Part 6)

---

# **1. Content Library (Admin)**

## 1.1 목적  
- Study Material / Learning Module / Quiz를 모두 관리  
- 필터 / 검색 / 정렬 / 상태 관리  
- 콘텐츠 업로드 및 생성 플로우의 시작점

## 1.2 Desktop Layout  
```
Header:  Content Management
Actions: [Upload Source] [Create Module] [Create Quiz]

Left Filter Panel
- Content Type
- Product Category
- Skill Tags
- Difficulty Level
- Status
- Date Range

Main Grid (Cards)
- Thumbnail
- Title
- Category / Tags
- Status
- [Edit] [Preview] [More]
```

## 1.3 Mobile Layout  
- 상단 CTA: [Upload] [Module] [Quiz]  
- 필터는 Drawer  
- 콘텐츠는 1열 카드

## 1.4 카드 액션  
- Edit → Module Editor / Quiz Builder  
- Preview  
- More → Duplicate / Archive / Delete  

---

# **2. Upload & AI Transformation (Admin)**

## 2.1 목적  
- 기존 문서(PDF/PPT/TXT/URL)를 업로드  
- AI가 자동으로 Module Draft + Quiz Draft 생성  
- Review 후 Editor로 이동

## 2.2 UI 구조  
### Upload Zone  
```
Drag & Drop
or
[Select File]
Supported: PDF / PPT / Doc / TXT / URL
```

### Transform Options  
- [✓] Learning Module  
- [✓] Quiz  
- [ ] Summary Only

### Progress  
- 문서 분석  
- 구조 추출  
- 블록 생성  
- 퀴즈 생성  
- Partial Failure 지원

### Output Summary  
- Module Draft (Block count)  
- Quiz Draft (Question count)  
- Detected SkillTags  
- [Open Module Editor]  
- [Open Quiz Builder]

---

# **3. Learning Module Editor (Admin)**

## 3.1 목적  
AI 생성 ModuleDraft를 검토·수정·완성하여 Publish 가능한 Learning Module로 확정하는 화면.

## 3.2 Layout  
```
Header Bar
- Title / Status / Metadata
- [Save Draft] [Publish]

Left Sidebar (Structure)
- Block List
- Drag & Drop reordering
- + Add Block

Central Canvas
- Block Editor (cards)
```

## 3.3 Block Types  
- Title Block  
- Key Points  
- Explanation  
- Real Use Case  
- Tip  
- Micro Quiz  

각 Block은 Rich Text Editor + AI Rewrite 기능 포함.

## 3.4 Validation (Publish 조건)  
- Title 필수  
- Block ≥ 3  
- Key Points ≥ 2  
- Explanation 필수  
- SkillTag ≥ 1  
- Category 필수

## 3.5 Preview Drawer  
- Mobile/Desktop Preview 지원  
- Slide-in 형태

---

# **4. Quiz Builder UI (Admin)**

## 4.1 목적  
Module에 연결되는 퀴즈를 편집·생성·관리.

## 4.2 Layout  
```
Left: Question List
Right: Question Editor
Footer or Side: Preview Drawer
```

## 4.3 Question Types  
- Single Choice  
- Multiple Choice  
- True / False  

## 4.4 Question Editor 구성  
- Question Text (Rich Text)  
- AI Tools: Rewrite / Simplify / Harder / Easier  
- Choices Editor  
- Distractor 자동 생성  
- Explanation Editor  
- Metadata: SkillTag / Difficulty

## 4.5 Validation  
- 최소 3문항  
- 모든 문항 정답 필수  
- Multiple-choice 정답 ≥ 2  
- SkillTag ≥ 1  
- Distractor ≥ 1 (T/F 제외)

## 4.6 Publish Flow  
- Publish confirm  
- Version 생성  
- Analytics 연결

---

# **5. Publish & Versioning Flow**

## 5.1 콘텐츠 생애주기  
```
Uploaded → Draft → Published(v1) → Draft(v1.1) → Published(v1.1) → …
```

## 5.2 Header Metadata  
- Status: Draft / Published  
- Version: 자동 증가 (v1.0 / v1.1 …)  
- Publish Date  
- SkillTags + Difficulty

## 5.3 Version History Modal  
```
v1.2 Published   [Restore] [View]
v1.1 Published   [Restore] [View]
v1.0 Published   [Restore] [View]
Drafts:
v1.3 Draft
```

## 5.4 Version Actions  
- View  
- Restore → 새 Draft 생성  
- Archive  

---

# **6. Mobile Learning UX (User)**

## 6.1 목적  
Admin이 Publish한 Module/Quiz를 유저가 모바일 환경에서 학습.

## 6.2 Dashboard → Module Detail  
```
OLED Basics – Level 2
2–3 min • 7 blocks • v1.2
[ Start Learning ]
```

## 6.3 Mobile Module Viewer  
블록 기반 카드 UI:
- Title Block  
- Key Points  
- Explanation  
- Use Case  
- Tip  
- Micro Quiz → Quiz Viewer 자동 이동  

하단 고정 CTA:
```
[ Next Block → ]
```

## 6.4 Mobile Quiz Viewer  
Full-screen 문항 단위 UI:

```
Question 1 of 6
────────────────────────
문항 본문…

◯ Option A  
◯ Option B  
◯ Option C  

[ Submit ]
```

제출 후:
- Correct / Incorrect  
- Explanation 표시  
- Next question 이동

## 6.5 Completion Screen  
```
🎉 Module Completed!
+100 XP
+1 Badge (OLED Starter)
Streak +1
[Continue Learning] [Back to Dashboard]
```

## 6.6 Resume Learning  
앱 중단 시 자동 저장 후:

```
Resume from Block 4?
[Resume] [Start Over]
```

## 6.7 Version 변화 감지  
```
This module has been updated (v1.3).
[Switch to latest] [Continue old version]
```

---

# **7. Admin ↔ User ↔ Analytics 통합 흐름**

1. Admin이 Module/Quiz 생성 → Publish  
2. User가 학습/응시  
3. event_log 기록  
4. agg_* 집계  
5. snapshot_* 업데이트  
6. AI Tutor Insights 생성  
7. Admin Dashboard에 코칭 포커스 표시  

---

# **8. 컴포넌트 요약 (Tailwind 스타일)**

- Card: `rounded-xl shadow-md border bg-white p-4`  
- Block Editor Card: `rounded-2xl border p-6 bg-gray-50`  
- Sidebar: `w-64 border-r bg-white sticky top-0`  
- CTA Button: `bg-indigo-600 text-white rounded-xl px-6 py-3`  
- Mobile Card: `rounded-xl p-4 shadow-sm border`  

---

# **9. AntiGravity 구현용 핵심 요약 (AG SYSTEM PROMPT 연동)**  

- 모든 Module/Quiz는 Draft → Publish → Versioning 구조  
- Content Type: source / module / quiz  
- ModuleBlock은 Title/KeyPoints/Explanation/UseCase/Tip/MicroQuiz 6종  
- QuizItem은 single/multi/tf  
- SkillTags, Difficulty는 필수 메타데이터  
- 모든 변화는 `content_item` 엔티티 업데이트  
- UI Action은 Save/Publish/Restore/Duplicate/Delete로 통일  
- Mobile Viewer는 Block 단위 트리 구조 기반  
- Quiz Viewer는 question-per-screen 구조  
- Analytics는 version-aware 구조(event_log.version 필수)

---

# **End of Document — Content Management UI + Mobile Learning UX v1.0 Consolidated**
