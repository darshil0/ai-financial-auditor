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

---

_Institutional-grade financial analysis powered by Google GenAI._ Developed by Darshil with Precision.
