# GTM Manager - Developer Handover Guide

**Version:** 2.0.0
**Date:** 2025-12-03

## 1. Project Overview
GTM Manager is a comprehensive sales training and content management platform designed for LG TV sales consultants. It features an interactive **Sales Lab** for roleplaying with AI customers, an **AI Tutor** for personalized coaching, and an **Admin CMS** for managing training content.

## 2. Technology Stack
- **Frontend Framework:** React (Vite)
- **Styling:** Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
- **State Management:** Zustand (`store/`)
- **AI Integration:** Google Gemini API (`lib/gemini.js`)
- **Routing:** React Router DOM
- **Speech Services:** Web Speech API (SpeechSynthesis & SpeechRecognition)

## 3. Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── sales-lab/      # Sales Lab specific components (Chat, Setup, Feedback)
│   └── ...
├── pages/              # Main page views
│   ├── SalesLab.jsx    # Main container for Sales Lab
│   ├── AIChatbot.jsx   # AI Tutor implementation
│   ├── admin/          # Admin CMS pages
│   └── ...
├── store/              # Zustand stores
│   ├── appStore.js     # Global app state (language, etc.)
│   ├── chatStore.js    # Chat history and session management
│   └── userStore.js    # User progress and profile
├── lib/                # Utilities and API clients
│   └── gemini.js       # Gemini API integration logic
└── constants/          # Static data (translations, scenarios)
```

## 4. Key Features & Implementation Details

### 4.1. Sales Lab (Roleplay Simulation)
- **Core Logic:** `SalesLab.jsx` manages the flow (Setup -> Chat -> Feedback).
- **AI Persona:** `gemini.js` (`startRoleplay`) generates dynamic customer personas based on user selection.
- **Save & Resume:**
    - Session data is saved to `localStorage` (`salesLabSession`).
    - `SalesLabSetup.jsx` checks for saved sessions on mount.
    - **Auto-Randomization:** If no session exists, customer traits are automatically randomized on entry.
- **Voice/Text:** Uses Web Speech API. Voices are filtered for quality (Google/Microsoft) and gender matching.

### 4.2. AI Tutor (Coaching Chatbot)
- **File:** `pages/AIChatbot.jsx`
- **Features:**
    - **Chat Reset:** Chat history is automatically cleared on entry to ensure a fresh session.
    - **Recommended Topics:** Suggestion chips appear at the bottom when the chat is empty.
    - **Text/Voice Mode:** Users can toggle between silent text mode and voice mode (TTS).
    - **Interactive Coaching:** The AI is prompted (`gemini.js`) to use a Socratic method, asking questions rather than just lecturing.

### 4.3. Admin CMS
- **File:** `pages/admin/ContentManagement.jsx`
- **Function:** Allows admins to upload and manage training materials (PDFs, Videos).
- **State:** Managed via `useAdminStore` (mock backend).

## 5. Setup & Installation

### Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 6. Recent Changes (v2.0)
- **UX Overhaul:** Improved layout, animations, and responsive design.
- **Sales Lab:** Added "Save & Resume", "Exit Confirmation", and "Auto-Randomization".
- **AI Tutor:**
    - Fixed double welcome message bug.
    - Implemented "Text/Voice" mode toggle.
    - Moved recommended topics to the bottom of the UI.
    - Enhanced AI system prompt for better coaching style.

## 7. Known Issues & Future Work
- **Browser Compatibility:** Web Speech API support varies by browser. Chrome is recommended.
- **Mobile Optimization:** While responsive, some complex charts in the Feedback view may need further optimization for small screens.
- **Persistence:** Currently uses `localStorage`. Future updates should integrate a backend database (Firebase/Supabase).
