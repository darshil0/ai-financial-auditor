# 📈 FinAnalyzer Pro

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for analysts and investors. It leverages **Gemini 3 Pro** to transform complex, multi-page corporate earnings PDFs into structured, actionable intelligence with visual analytics and real-time market grounding.

## 🚀 Key Features

- **AI-Driven KPI Extraction**: Uses Gemini 3 Pro with a dedicated Thinking Budget to extract Revenue, Net Income, EPS, and Margins with forensic precision.
- **Narrative Sentiment Analysis**: Quantifies management's verbal confidence and forward-looking statements into a 0-100 Bullishness score with an interactive gauge.
- **Market Grounding**: Integrated Google Search tools to contrast historical report data with real-time market developments and news.
- **Comparative Intelligence**: Side-by-side benchmarking of quarterly or yearly performance with automatic delta variance calculation. Now includes **YoY Revenue Growth** tracking and visual indicators for selected reports.
- **Visual Analytics Suite**: Interactive Recharts-powered visualizations including:
    - **Revenue YoY Variance**: Bar charts comparing current vs. prior periods.
    - **Expense Allocation**: Interactive pie charts breaking down costs by category.
    - **Margin Analysis**: Visual breakdown of Gross, Operating, and Net margins.
    - **Growth Trajectory**: Area charts showing quarterly revenue and net income trends.
- **Export Engine**: Boardroom-ready PNG summaries for comparisons, CSV data exports for spreadsheets, and print-optimized PDF reports.
- **Data Refresh**: Built-in "Refresh Data" capability in comparison views to ensure your workspace is synchronized with the latest analysis.

## 🛠️ Technical Architecture

- **Engine**: Gemini 3 Pro (Multimodal Reasoning & Google Search Grounding)
- **Frontend**: React 19 (Strict Mode)
- **Styling**: Tailwind CSS (JIT) with seamless Dark/Light Mode support.
- **Charts**: Recharts (Responsive SVG with custom tooltips)
- **Data Persistence**: LocalStorage for persistent historical report vaulting.
- **APIs**: `@google/genai` (SDK 1.34.0)
- **Utilities**: `html-to-image` for high-fidelity visual exports.

## 📦 Deployment & Setup

1. **Environment**: Ensure `process.env.API_KEY` is configured in your secure context.
2. **Launch**: Open the application and navigate to **Upload Report**.
3. **Analyze**: Ingest 10-Q or 10-K PDFs to generate instant intelligence.
