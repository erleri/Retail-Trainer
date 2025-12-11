# 🎯 Retail-Trainer

> AI-powered TV sales training platform with roleplay simulations, intelligent feedback, and gamification.

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Retail-Trainer** is an interactive web application that helps retail sales associates master TV product knowledge and sales techniques through AI-powered roleplay scenarios, real-time feedback, and personalized learning paths.

## ✨ Features

- 🎭 **Sales Lab** — Practice sales conversations with AI customers (powered by Google Gemini)
- 🤖 **AI Tutor** — Get instant answers about products, policies, and sales techniques
- 📚 **Study Room** — Access product guides, FAQs, and training materials
- 📊 **Progress Tracking** — Monitor your performance with detailed analytics
- 🎮 **Gamification** — Earn XP, unlock achievements, and compete on leaderboards
- 🗣️ **Voice Mode** — Practice with speech recognition and text-to-speech
- 📱 **Mobile-First** — Optimized for smartphones and tablets

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/erleri/Retail-Trainer.git
cd Retail-Trainer

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_actual_api_key_here

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **Security**: Never commit your `.env` file to git. Use `.env.example` as a template.

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run storybook    # Launch Storybook component explorer
```

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **State Management**: Zustand
- **AI**: Google Generative AI (Gemini 2.0)
- **Animation**: Framer Motion
- **Voice**: Web Speech API
- **Storage**: IndexedDB (via localforage)

## 📖 Documentation

- [Page Logic Tree](docs/diagrams/page-logic-tree.md) — Visual overview of app structure
- [Deployment Guide](DEPLOY_QUICK.md) — Deploy to Netlify, Vercel, or GitHub Pages
- [Architecture Details](docs/) — Detailed specs and diagrams

## 🤝 Contributing

Contributions are welcome! This is an open-source project.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Set up your own `.env` with a Gemini API key
4. Make your changes
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)

---

**Made with ❤️ for retail sales teams**
