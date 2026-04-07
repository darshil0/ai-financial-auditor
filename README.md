# 📈 FinAnalyzer Pro v1.5.0

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for institutional-grade analysis. It leverages **Gemini 2.0 Flash** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with surgical precision, visual analytics, and real-time market grounding.

[![CI Status](https://github.com/darshil0/ai-financial-auditor/actions/workflows/main.yml/badge.svg)](https://github.com/darshil0/ai-financial-auditor/actions)
![License](https://img.shields.io/badge/license-MIT-blue.svg)


## 🚀 Key Features

- **Gemini 2.0 Flash Intelligence**: Uses specialized multimodal extraction to identify Revenue, Net Income, EPS, and Margins with sub-second latency and forensic accuracy.
- **Feature-Based Architecture**: A modular, domain-driven structure (`src/features/*`) ensuring high scalability and maintainability.
- **Financial Performance Trends**: Interactive area charts visualizing revenue and net income velocity across historical reporting periods.
- **Management Commentary Insight**: AI-extracted executive narratives with instant clipboard integration for research portability.
- **Universal Ticker Intelligence**: A centralized search hub with keyboard-first navigation for instant retrieval of historical analysis.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence into a 0-100 Bullishness score with an interactive gauge.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments.
- **Comparative Hub**: Side-by-side benchmarking with automatic delta variance modeling and chronological verification.
- **Streaming AI Analyst**: Real-time voice-first advisor powered by Gemini 2.0 Flash for low-latency financial dialogue.
- **GitHub Actions CI**: Automated testing and linting across multiple Node.js environments (20.x, 22.x).

## 🛠️ Technical Architecture

- **Reasoning Engine**: Gemini 2.0 Flash (Primary Analysis, TTS & Real-time Reasoning).
- **Thinking Budget**: Configured for deep-dive financial reconciliation and YoY cross-verification (16k tokens).
- **Frontend**: React 19 (Strict Mode) + Vanilla CSS (Premium Aesthetics).
- **Domain Structure**: Feature-based reorganization with specialized layers:
  - `@/features/*`: Business logic and UI for Dashboard, Comparison, Analyst, History, and Upload.
  - `@/shared/*`: Reusable components (Modal, Header, etc.), services (Store, Gemini), and utilities.
- **Charts**: Recharts (Responsive SVG with custom tooltips).

- **Persistence**: LocalStorage with Zustand middleware for persistent session history.
- **Testing**: Vitest (Unit), Playwright (E2E), and React Testing Library.
- **CI/CD**: GitHub Actions for automated quality gates and regression testing.

## 📦 Getting Started

1. **API Configuration**: Create a `.env` file in the root directory and add `VITE_API_KEY="YOUR_API_KEY"`.
2. **Install Dependencies**: Run `npm install`.
3. **Development**: Run `npm run dev` to start the server on `http://localhost:5173`.
4. **Analysis**: Navigate to **Upload Report** and drop a corporate 10-Q or 10-K PDF.
5. **Benchmarking**: Use the **Comparison** tab to select two reports for variance analysis.

## 🧪 Testing & Quality

- **Execute All Tests**: `npm test`
- **Unit & Component Tests**: `npm run test:unit`
- **End-to-End (E2E) Tests**: `npm run test:e2e`
- **Comprehensive Linting**: `npm run lint` (Typecheck + Format Check).

## 📋 v1.5.0 Release Notes (2026-04-07)

### ✨ Major Overhaul

- **Project Restructuring**: Full migration to a domain-driven feature-based architecture.
- **Engine Upgrade**: Switched to `gemini-2.0-flash` for superior speed and numerical precision.
- **GitHub Integration**: Added automated CI workflows and MIT licensing.
- **Defensive Engineering**: Hardened `.gitignore` and updated all unit tests for the new structure.

### 🐛 Bug Fixes & Security

- **Path Resolution**: Fixed all import aliasing issues after the directory migration.
- **State Persistence**: Optimized Zustand storage with improved partialize logic.

---

_Institutional-grade financial analysis powered by Google GenAI._ Developed by Darshil with Precision.
