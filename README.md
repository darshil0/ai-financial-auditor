# 📈 FinAnalyzer Pro v1.4.2

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for institutional-grade analysis. It leverages **Gemini 2.5 Pro** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with visual analytics, and real-time market grounding.

## 🚀 Key Features

- **Gemini 1.5 Pro Reasoning**: Uses advanced multimodal reasoning to extract Revenue, Net Income, EPS, and Margins with forensic precision from PDF documents.
- **Financial Performance Trends**: Interactive area charts visualizing revenue and net income velocity across historical reporting periods.
- **Management Commentary Insight**: AI-extracted executive narratives with instant clipboard integration for research portability.
- **Universal Ticker Intelligence**: A centralized search hub with keyboard-first navigation for instant retrieval of historical analysis.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence and forward-looking statements into a 0-100 Bullishness score with an interactive gauge.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments.
- **Comparative Hub**: Side-by-side benchmarking with visual "Baseline" and "Benchmark" indicators and automatic delta variance modeling.
- **UI Diagnostics Suite**: Built-in automated testing suite to verify responsive layouts, contrast ratios, and persistence integrity.
- **Streaming AI Analyst**: Real-time voice-first advisor powered by Gemini 2.0 Flash for low-latency financial dialogue.

## 🛠️ Technical Architecture

- **Reasoning Engine**: Gemini 1.5 Pro (Forensic Analysis & Grounding).
- **Voice/Speed Engine**: Gemini 2.0 Flash (TTS & Real-time Reasoning).
- **Thinking Budget**: Configured for deep-dive financial reconciliation (16k tokens).

- **Frontend**: React 19 (Strict Mode) + Tailwind CSS (JIT).
- **Charts**: Recharts (Responsive SVG with custom tooltips).
- **Persistence**: LocalStorage for persistent historical report vaulting.
- **Quality**: Built-in Diagnostics Overlay for real-time UI/UX verification.
- **Testing**: Vitest, React Testing Library, and Playwright for a comprehensive testing suite.
- **Build System**: Vite 6.4+ with absolute path aliasing (@/).
- **Code Quality**: TypeScript strict mode, Prettier formatting, ESLint compliance.

## 📦 Getting Started

1. **API Configuration**: Create a `.env` file in the root directory and add your Gemini API key as `VITE_API_KEY="YOUR_API_KEY"`.
2. **Install Dependencies**: Run `npm install` to install all project dependencies.
3. **Development**: Run `npm run dev` to start the development server on `http://localhost:3000`.
4. **Analysis**: Navigate to **Upload Report** and drop a corporate 10-Q or 10-K PDF.
5. **Benchmarking**: Use the **Comparison** tab to select two reports for variance analysis.
6. **Validation**: Run **UI Diagnostics** from the sidebar to verify system health.

## 🧪 Running Tests

- **All Tests**: `npm test`
- **Unit & Component Tests**: `npm run test:unit`
- **End-to-End (E2E) Tests**: `npm run test:e2e`

## 🎨 Code Quality

- **Format Check**: `npm run format:check` – Verify Prettier compliance.
- **Format Files**: `npm run format` – Auto-format all files.
- **Type Check**: `npm run typecheck` – Run TypeScript strict mode check.
- **Lint**: `npm run lint` – Run comprehensive quality checks (typecheck + format check).

## 📋 v1.4.2 Release Notes (2026-04-07)

### ✨ Improvements

- **AI Service Optimization**: Standardized Gemini model names to valid production strings (`1.5 Pro` and `2.0 Flash`).
- **Enhanced Security**: Added API key validation guards and sanitized environment variable access.
- **Memory Efficiency**: Hardened cleanup logic for `AudioContext` and `HTMLAudioElement` resources.
- **Robustness**: Improved null safety and error boundaries across dashboard and comparison views.

### 🐛 Bug Fixes

- **Formatting**: Implemented true `NaN` and `Infinity` safety in the `formatCurrency` utility.
- **State Stale-ness**: Fixed a bug where dismissed warnings persisted across different report comparisons.
- **Deletion Logic**: Resolved potential runtime exceptions during rapid report deletion workflows.

## 📋 v1.4.1 Release Notes (2026-02-24)


### 🐛 Bug Fixes

- Fixed memory leaks in LiveAnalyst audio context cleanup
- Resolved null safety issues in comparison and dashboard views
- Corrected division-by-zero errors in growth calculations
- Fixed NaN handling in currency formatting
- Improved error boundaries with better error logging

### 📦 Dependencies Updated

- `lucide-react`: ^0.562.0 → ^0.565.0
- `vite`: ^6.2.0 → ^6.4.1
- `@vitejs/plugin-react`: ^5.0.0 → ^5.1.2
- `html-to-image`: ^1.11.11 → ^1.11.13

---

_Institutional-grade financial analysis powered by Google GenAI._ Developed by Darshil with Precision.
