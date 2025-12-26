# 📈 FinAnalyzer Pro

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for analysts and investors. It leverages **Gemini 3 Pro** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with visual analytics and real-time market grounding.

## 🚀 Key Features

- **AI-Driven KPI Extraction**: Uses Gemini 3 Pro with a dedicated Thinking Budget to extract Revenue, Net Income, EPS, and Margins with forensic precision.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence and forward-looking statements into a 0-100 Bullishness score.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments.
- **Comparative Intelligence**: Side-by-side benchmarking of quarterly or yearly performance with automatic delta variance calculation.
- **Visual Analytics Suite**: Interactive Recharts-powered visualizations including Revenue YoY, Expense Allocation, and Growth Trajectories.
- **Export Engine**: boardroom-ready PNG summaries, CSV data exports, and print-optimized PDF reports.

## 🛠️ Technical Architecture

- **Engine**: Gemini 3 Pro (Multimodal Reasoning)
- **Frontend**: React 19 (Strict Mode)
- **Styling**: Tailwind CSS (JIT) with Dark Mode Support
- **Charts**: Recharts (Responsive SVG)
- **Data Persistence**: LocalStorage for historical report vaulting
- **APIs**: `@google/genai` (SDK 1.34.0)

## 📦 Deployment & Setup

1. **Environment**: Ensure `process.env.API_KEY` is configured in your secure context.
2. **Launch**: Open the application and navigate to **Upload Report**.
3. **Analyze**: Ingest 10-Q or 10-K PDFs to generate instant intelligence.
