# 📈 FinAnalyzer Pro v1.0.0

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for institutional-grade analysis. It leverages **Gemini 3 Pro** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with visual analytics, and real-time market grounding.

## 🚀 Key Features

- **Gemini 3 Pro Extraction**: Uses advanced multimodal reasoning to extract Revenue, Net Income, EPS, and Margins with forensic precision from PDF documents.
- **Universal Ticker Intelligence**: A centralized search hub with keyboard-first navigation for instant retrieval of historical analysis.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence and forward-looking statements into a 0-100 Bullishness score with an interactive gauge.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments.
- **Comparative Hub**: Side-by-side benchmarking with visual "Baseline" and "Benchmark" indicators and automatic delta variance modeling.
- **UI Diagnostics Suite**: Built-in automated testing suite to verify responsive layouts, contrast ratios, and persistence integrity.
- **Responsive Workspace**: Optimized for desktop, tablet, and mobile with a specialized sliding navigation system.

## 🛠️ Technical Architecture

- **Reasoning Engine**: Gemini 3 Pro (Multimodal Reasoning & Google Search Grounding).
- **Thinking Budget**: Configured for deep-dive financial reconciliation (8k - 32k tokens).
- **Frontend**: React 19 (Strict Mode) + Tailwind CSS (JIT).
- **Charts**: Recharts (Responsive SVG with custom tooltips).
- **Persistence**: LocalStorage for persistent historical report vaulting.
- **Quality**: Built-in Diagnostics Overlay for real-time UI/UX verification.

## 📦 Getting Started

1. **API Configuration**: Create a `.env` file in the root directory and add your Gemini API key as `VITE_API_KEY="YOUR_API_KEY"`.
2. **Analysis**: Navigate to **Upload Report** and drop a corporate 10-Q or 10-K PDF.
3. **Benchmarking**: Use the **Comparison** tab to select two reports for variance analysis.
4. **Validation**: Run **UI Diagnostics** from the sidebar to verify system health.

## ✨ Recent Changes (v1.0.0)

-   **API Key Management**: Migrated from `process.env` to a client-safe `VITE_API_KEY` in a `.env` file.
-   **Codebase Formatting**: Applied Prettier for consistent code style across the project.
-   **Documentation**: Updated `README.md` with the latest changes and version.

---

_Institutional-grade financial analysis powered by Google GenAI._ Developed by Darshil with Precision.
