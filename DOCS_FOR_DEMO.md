**Project Overview**
- Name: `Retail-Trainer`
- Purpose: TV sales training web app — roleplay (Sales Lab), AI Tutor, study materials and quizzes.
- Stack: React (Vite), Tailwind CSS, Zustand, Framer Motion, Google Generative AI (Gemini).

**Quick Start**
- Install & run development:
```bash
git clone https://github.com/erleri/Retail-Trainer.git
cd Retail-Trainer
npm ci
export VITE_GEMINI_API_KEY="your_gemini_api_key"   # mac/linux
npm run dev
# Open http://localhost:5173/
```

- Storybook (local component explorer):
```bash
npm run storybook
# Open http://localhost:6006/
```

**Build & Deploy**
- Production build:
```bash
npm run build
# artifacts placed in `dist/` folder
```
- Quick deploy (Netlify Drop): upload the `dist/` folder to https://app.netlify.com/drop
- GitHub Pages: repository has `.github/workflows/gh-pages.yml` to build and publish `dist/` to `gh-pages` branch.

**Repository Structure (important files & folders)**
- `package.json` — scripts & deps (`dev`, `build`, `storybook`)
- `vite.config.js`, `tailwind.config.js`, `postcss.config.js` — build & styling
- `public/` — static assets, `_redirects` for SPA routing
- `dist/` — production artifacts
- `src/` — application source
  - `src/pages/` — page-level React components (SalesLab, AIChatbot, StudyRoom, Quiz, etc.)
  - `src/components/` — UI + domain components
  - `src/lib/gemini.js` — AI service wrapper (Gemini integration)
  - `src/store/` — Zustand stores (`appStore`, `chatStore`, `userStore`)
  - `src/constants/` — translations and static data
  - `src/stories/` — Storybook stories
- `.github/workflows/gh-pages.yml` — CI deploy to GitHub Pages
- `DEPLOY_QUICK.md` — quick deployment instructions

**Pages: Purpose & Key Components**
- `src/pages/SalesLab.jsx` — Sales Lab container (phases: SETUP → ROLEPLAY → FEEDBACK → HISTORY)
  - `SalesLabSetup` — configure scenario (customer persona, difficulty, product)
  - `SalesLabChat` (`src/components/sales-lab/SalesLabChat.jsx`) — roleplay UI: text/voice input, auto-mode, end-session
  - `SalesLabFeedback` (`src/components/sales-lab/SalesLabFeedback.jsx`) — visual feedback (score, skills, pros/cons)
  - `SalesLabHistory` — saved sessions

- `src/pages/AIChatbot.jsx` — AI Tutor (Q&A, topic suggestions)
  - Uses `src/lib/gemini.js` to get answers and TTS-friendly speech text
  - Supports continuous voice mode and manual text input

- `src/pages/StudyRoom.jsx` — study materials and FAQs
- `src/pages/Quiz.jsx` — quiz UI and scoring
- `src/pages/HomeDashboard.jsx` — landing / summary / recommended missions

**Key Components**
- `src/components/ui/` — Buttons, Inputs, Card, Badge, Modal, ExpandableSection
- `src/components/sales-lab/ChatMessage.jsx` — message renderer (parses AI responses into summary + details)
- `src/components/sales-lab/SalesLabChat.jsx` — main conversation logic (speech recognition, silence timer, end detection)
- `src/components/sales-lab/SalesLabFeedback.jsx` — feedback UI with animated bars and mission recommendations

**Page Logic Tree (로직 트리)**
- 목적: 전체 페이지와 주요 컴포넌트, 화면 전환 및 데이터 흐름을 한눈에 파악할 수 있도록 트리 형식으로 정리
- 사용법: 트리의 각 노드를 클릭하면(문서 내에서 스크롤) 해당 컴포넌트/페이지의 위치와 역할을 빠르게 파악할 수 있음.

Root
├─ HomeDashboard (`src/pages/HomeDashboard.jsx`)
│  ├─ FeaturedMissions (추천 미션)
│  ├─ RecentSessions (최근 세션 요약)
│  └─ QuickStart CTA -> SalesLab
├─ SalesLab (`src/pages/SalesLab.jsx`)
│  ├─ SalesLabSetup (`src/components/sales-lab/SalesLabSetup.jsx`)
│  │  ├─ PersonaForm (고객성향 선택)
+ │  │  ├─ ProductSelect
│  │  └─ DifficultyToggle
│  ├─ SalesLabChat (`src/components/sales-lab/SalesLabChat.jsx`)
│  │  ├─ ChatMessageList (renders `ChatMessage.jsx` nodes)
│  │  ├─ InputBar (text input, send button)
│  │  ├─ VoiceControls (Mic on/off, auto-mode)
│  │  └─ EndSessionControl (manual end + auto-detect)
│  ├─ SalesLabFeedback (`src/components/sales-lab/SalesLabFeedback.jsx`)
│  │  ├─ ScoreSummary (totalScore, rank)
│  │  ├─ SkillBars (Product Knowledge, Empathy...)
│  │  ├─ Pros/Improvements Cards
│  │  └─ RecommendedMission CTA -> creates mission entry
│  └─ SalesLabHistory (`src/components/sales-lab/SalesLabHistory.jsx`)
│     └─ SessionList (each item -> open Feedback or Replay)
├─ AIChatbot (`src/pages/AIChatbot.jsx`)
│  ├─ ChatWindow (similar to SalesLabChat but non-roleplay)
│  ├─ TopicSuggester (uses `gemini.generateCourse`) 
+ │  └─ ExplanationPanel (detailed answers + example sentences)
├─ StudyRoom (`src/pages/StudyRoom.jsx`)
│  ├─ StudyResources (`src/components/study/StudyResources.jsx`)
│  └─ StudyRoomFAQ (`src/components/study/StudyRoomFAQ.jsx`)
├─ Quiz (`src/pages/Quiz.jsx`)
│  ├─ QuestionRenderer
+ │  ├─ AnswerInput
│  └─ ResultsSummary (score & review)
├─ MyProgress (`src/pages/MyProgress.jsx`)
│  ├─ XPChart
│  └─ MissionHistory
├─ Admin Console (`src/pages/admin/AdminDashboard.jsx`)
│  ├─ ContentManagement (`src/pages/admin/ContentManagement.jsx`)
│  └─ UserManagement (`src/pages/admin/UserManagement.jsx`)
└─ Shared UI
   ├─ `src/components/ui/Button.jsx`
   ├─ `src/components/ui/Input.jsx`
   ├─ `src/components/ui/Modal.jsx`
   └─ `src/components/ui/ExpandableSection.jsx`

설명:
- 트리의 방향(위→아래)은 화면 진입 흐름을 의미합니다. 예: HomeDashboard → SalesLabSetup → SalesLabChat → SalesLabFeedback
- 주요 이벤트 플로우:
  - Roleplay 시작: `SalesLabSetup`에서 시나리오 선택 → `startRoleplay()` 호출 (`src/lib/gemini.js`) → 초기 고객 발화 수신
  - 대화 진행: 사용자가 `InputBar` 또는 음성으로 메시지 전송 → `sendMessageStream()` 또는 `sendMessage()` 호출 → `ChatMessageList`에 AI/유저 메시지 추가
  - 세션 종료: 자동 감지(키워드, 무응답, 카운트) 또는 `EndSessionControl` 수동 종료 → `generateFeedback()` 호출 → `SalesLabFeedback` 렌더링
  - 피드백 저장: `chatStore.addSession()` 호출 → `SalesLabHistory`에 저장

데이터 흐름(간단 요약):
- UI 입력 -> `chatStore` 업데이트 -> `src/lib/gemini.js` 통신 -> 응답 수신 -> `chatStore`에 메시지/피드백 저장 -> UI 렌더

추천 추가 자료:
- Mermaid 다이어그램(요청 시 추가) 또는 `docs/diagrams/page-logic-tree.svg`로 시각화하여 비기술자에게 제공
- 각 노드(예: `SalesLabChat`)에 대한 상세 시퀀스 다이어그램(요청 시 생성)

**State Management (Zustand stores)**
- `appStore` — app-wide settings (language, theme)
- `chatStore` — messages, sessions, addSession()
- `userStore` — user profile, progress, weaknesses

**AI Integration: `src/lib/gemini.js` (detailed)**
Overview:
- Wrapper around Google Generative AI model (`gemini-2.0-flash`). Handles chat sessions, streaming, roleplay context, analysis and feedback generation.

Main exported functions and their I/O:

1) `initChat(systemInstruction = TRAINER_INSTRUCTION)`
- Purpose: create/reset chat session with a system prompt
- Input: (optional) `systemInstruction` (string)
- Output: internal `chatSession` object (returns chat session handle)

2) `startRoleplay(config, language = 'en')`
- Purpose: start a roleplay session (customer persona) and return initial customer line
- Input (example):
```json
{
  "customer": { "name": "Kim", "age": 35, "gender": "female", "traits": [{"id":"price_savvy","label":"Price Sensitive"}] },
  "product": { "name": "LG OLED X", "type": "TV" },
  "difficulty": { "level": 3, "label": "Intermediate" }
}
```
- Output (example): string (customer opening line)
```text
"안녕하세요. 새 TV를 보러 왔는데, 어떤 모델이 좋은가요? 가격대는 좀 보고 있어요."
```

3) `sendMessage(message, language='ko', isRoleplay=false, conversationHistory=null)`
- Purpose: synchronous send message (non-streaming), returning display text and speech text
- Input example:
```json
{
  "message": "이 제품의 차이점 알려줘",
  "language": "ko",
  "isRoleplay": false
}
```
- Output example:
```json
{
  "text": "### 📌 핵심 요약\nOLED와 QNED의 주요 차이는...\n---SPEECH---\nOLED는 더 깊은 검은색을 제공합니다...",
  "speech": "OLED는 더 깊은 검은색을 제공합니다. QNED는 밝기가 강점입니다."
}
```

4) `sendMessageStream(message, language, isRoleplay, onChunk, conversationHistory)`
- Purpose: streaming send; calls `onChunk(chunk)` repeatedly as chunks arrive
- Usage: UI uses chunks to render typing/streaming effect. Final return includes `{ text, speech }` when complete.

5) `analyzeInteraction(lastUserMessage, conversationHistory, config, language='en')`
- Purpose: analyze recent messages and return structured analysis (nextStep, discoveredTrait, objectionDetected, objectionHint)
- Input example:
```json
{
  "lastUserMessage": "구매하려면 어떤 보증이 있나요?",
  "conversationHistory": [{"role":"user","text":"..."},{"role":"ai","text":"..."}],
  "config": {"product": {"name":"LG OLED X"}, "customer": {"traits": []}}
}
```
- Output example:
```json
{
  "nextStep": "closing",
  "discoveredTrait": null,
  "objectionDetected": false,
  "objectionHint": null
}
```

6) `generateFeedback(history, language='ko')`
- Purpose: analyze full conversation history and return JSON feedback report for UI
- Input: `history` array of `{ role, text }` messages (salesperson = user, customer = ai)
- Output format (example):
```json
{
  "totalScore": 78,
  "rank": "Top 25%",
  "summary": "제품 지식은 우수했으나 클로징에서 더 적극적일 필요가 있습니다.",
  "pros": ["상품 특징 설명이 명확함","적절한 질문으로 니즈 파악"],
  "improvements": ["간결한 클로징 멘트 연습 필요","가격 이의 대응 스크립트 보완"],
  "practiceSentence": "요약: 고객의 니즈에 맞춰 이 혜택을 강조드리며, 구매를 제안하세요.",
  "recommendedMission": { "title": "Closing Practice", "xp": 50, "type": "Roleplay" },
  "scores": [
    {"subject":"Product Knowledge","A":85},
    {"subject":"Objection Handling","A":72},
    {"subject":"Empathy","A":78},
    {"subject":"Policy","A":80},
    {"subject":"Conversation","A":75}
  ]
}
```
- Notes: `generateFeedback` includes fallback logic — if the AI returns unparsable JSON, the function returns a default structured object and logs the error.

**Examples: Full `generateFeedback()` Request/Response Flow**
- Frontend collects conversation history as: `[{role:'user', text:'...'}, {role:'ai', text:'...'}, ...]`
- Call:
```js
const feedback = await aiService.generateFeedback(conversationHistory, 'ko');
// feedback as JSON object (see format above)
```

**Environment & Secrets**
- Set `VITE_GEMINI_API_KEY` in developer machine or CI secrets. In GitHub Actions, add `GEMINI_API_KEY` or expose as `VITE_GEMINI_API_KEY` if used during build.

**Debugging Checklist (common issues)**
- Feedback JSON parsing fails → check Gemini output includes proper JSON and not wrapped in code fences. `gemini.js` strips triple-backticks but log raw response in console for troubleshooting.
- Voice permissions fail locally → ensure running over HTTPS for deployed site; local dev requires browser prompt and sometimes `localhost` is allowed.
- Storybook public sharing fails behind corporate firewall → use `build-storybook` + Netlify Drop as workaround.

**Delivery file**
- This file: `DOCS_FOR_DEMO.md` — hand this to reviewers or paste into a ticket. It includes runnable commands and sample I/O for key AI functions.

If you want, I will:
- add concrete sample conversation JSON files under `docs/samples/` and wire a small `scripts/print_feedback_example.js` test that calls `generateFeedback` with a local mock response.
- or produce a shortened one-page slide for non-technical stakeholders.

---
Generated on: 2025-12-05
