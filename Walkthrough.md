# FinAnalyzer Pro: Master Walkthrough

This guide details the end-to-end workflow of the platform, from data ingestion to boardroom reporting.

## Phase 1: Intelligent Ingestion
1. **Navigation**: Click **Upload Report** in the sidebar.
2. **File Selection**: Drag or browse for a corporate earnings PDF.
3. **AI Extraction**: The system sends the file to Gemini 3 Pro. The model uses its "Thinking Budget" to reconcile GAAP and non-GAAP figures, ensuring year-over-year (YoY) numbers are matched to their correct prior periods.
4. **Validation**: Once finished, the system redirects you to the Dashboard.

## Phase 2: Analyzing the Dashboard
- **KPI Cards**: Review the 4 core pillars (Revenue, Net Earnings, EPS, Operating Margin).
- **Sentiment Gauge**: Observe the AI's assessment of management tone. A score > 70 indicates high confidence in future guidance.
- **Charts**: Use the interactive tooltips on the "YoY Revenue" and "Growth Trajectory" charts to see exact variances.

## Phase 3: Market Grounding (The "Real Reality" Check)
1. On the Dashboard, click **Market Grounding**.
2. FinAnalyzer Pro performs a live Google Search via Gemini 3 Pro to find news *published after* the earnings report.
3. Compare the "Grounding Intelligence" summary with the management's commentary to identify potential "Bull Traps" or overlooked risks.

## Phase 4: Comparative Benchmarking
1. Navigate to the **Comparison** tab.
2. Select a **Baseline** (e.g., Q2 2023) and a **Benchmark** (e.g., Q2 2024).
3. Review the **Delta Analysis**. Green indicators show growth velocity; red indicators highlight margin compression or contraction.
4. Click **Export Summary PNG** to save a snapshot of the primary variance cards.

## Phase 5: Historical Vault
- Visit the **History** tab to search and manage your library of analyzed reports. Data persists across sessions in your browser's LocalStorage.
