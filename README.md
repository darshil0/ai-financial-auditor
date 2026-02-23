# 📈 FinAnalyzer Pro v1.3.0

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for institutional-grade analysis. It leverages **Gemini 2.5 Pro** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with visual analytics, and real-time market grounding.

## 🚀 Key Features

- **Gemini 2.5 Pro Reasoning**: Uses advanced multimodal reasoning to extract Revenue, Net Income, EPS, and Margins with forensic precision from PDF documents.
- **Financial Performance Trends**: Interactive area charts visualizing revenue and net income velocity across historical reporting periods.
- **Management Commentary Insight**: AI-extracted executive narratives with instant clipboard integration for research portability.
- **Universal Ticker Intelligence**: A centralized search hub with keyboard-first navigation for instant retrieval of historical analysis.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence and forward-looking statements into a 0-100 Bullishness score with an interactive gauge.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments.
- **Comparative Hub**: Side-by-side benchmarking with visual "Baseline" and "Benchmark" indicators and automatic delta variance modeling.
- **UI Diagnostics Suite**: Built-in automated testing suite to verify responsive layouts, contrast ratios, and persistence integrity.
- **Responsive Workspace**: Optimized for desktop, tablet, and mobile with a specialized sliding navigation system.
- **Advanced Error Handling**: Integrated custom modal system for communicating system alerts and diagnostic failures without breaking the immersive experience.

## 🛠️ Technical Architecture

- **Reasoning Engine**: Gemini 2.5 Pro (Multimodal Reasoning & Google Search Grounding).
- **Thinking Budget**: Configured for deep-dive financial reconciliation (16k tokens).
- **Frontend**: React 19 (Strict Mode) + Tailwind CSS (JIT).
- **Charts**: Recharts (Responsive SVG with custom tooltips).
- **Persistence**: LocalStorage for persistent historical report vaulting.
- **Quality**: Built-in Diagnostics Overlay for real-time UI/UX verification.
- **Testing**: Vitest, React Testing Library, and Playwright for a comprehensive testing suite.

## 📦 Getting Started

1. **API Configuration**: Create a `.env` file in the root directory and add your Gemini API key as `VITE_API_KEY="YOUR_API_KEY"`.
2. **Analysis**: Navigate to **Upload Report** and drop a corporate 10-Q or 10-K PDF.
3. **Benchmarking**: Use the **Comparison** tab to select two reports for variance analysis.
4. **Validation**: Run **UI Diagnostics** from the sidebar to verify system health.

## 🧪 Running Tests

- **All Tests**: `npm test`
- **Unit & Component Tests**: `npm run test:unit`
- **End-to-End (E2E) Tests**: `npm run test:e2e`

## ✨ Recent Changes

### v1.3.0

- **Global Error Resilience**: Integrated a React Error Boundary with a professional fallback UI to prevent application crashes during rendering errors.
- **Interactive Performance Trends**: Added a Trends chart section using Recharts to visualize historical GAAP metrics over multiple quarters.
- **Executive Narrative Extraction**: New Management Commentary card on the dashboard with a one-click "Copy to Clipboard" feature for easier data migration.
- **Enhanced Live Session UX**: Added loading states and connection callbacks to the Live AI Analyst interface for a smoother advisory experience.
- **Keyboard-First Search**: Implemented `Cmd/Ctrl+K` global shortcut and a visual `⌘K` hint to focus the ticker search hub instantly.
- **Robust Data Schema**: Updated the AI extraction engine to require prior-period data, ensuring accurate YoY growth modeling and preventing division-by-zero errors.
- **Institutional Guardrails**: Added 25MB file size validation, synchronous dark mode application, and safe deletion confirmation flows in the Analysis Vault.

### v1.2.0

- **Enhanced Currency Formatting**: Refactored the `formatCurrency` utility for improved readability, expanded test coverage, and added compact formatting for trillions (T), billions (B), millions (M), and thousands (K).
- **Conditional Class Utility**: Implemented a `cn` utility for streamlined conditional class name management in React components.
- **Improved Comparison View**: The "Comparison" view button is now disabled with a tooltip when fewer than two reports are available, preventing navigation to an empty state.
- **Downloadable Diagnostics**: Users can now download the UI Diagnostics report as a high-resolution PNG image for easier sharing and record-keeping.
- **Custom Modal UI**: Replaced native browser alerts with a polished custom modal component for a more consistent and user-friendly experience.

### v1.1.0

- **Comprehensive Testing Suite**: Introduced a full testing suite with Vitest, React Testing Library, and Playwright.
- **Component Refactoring**: Refactored the `ComparisonView` component for better testability.
- **Documentation**: Updated `README.md` with the latest changes and testing instructions.

### v1.0.0

- **API Key Management**: Migrated from `process.env` to a client-safe `VITE_API_KEY` in a `.env` file.
- **Codebase Formatting**: Applied Prettier for consistent code style across the project.
- **Documentation**: Updated `README.md` with the latest changes and version.

---

_Institutional-grade financial analysis powered by Google GenAI._ Developed by Darshil with Precision.
