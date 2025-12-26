# FinAnalyzer Pro: Master Walkthrough

This guide details the end-to-end workflow of the platform, from data ingestion to boardroom reporting.

## Phase 1: Intelligent Ingestion
1. **Navigation**: Click **Upload Report** in the sidebar.
2. **File Selection**: Drag or browse for a corporate earnings PDF (e.g., a 10-Q or Press Release).
3. **AI Extraction**: The system sends the file to Gemini 3 Pro. The model uses its "Thinking Budget" to reconcile GAAP and non-GAAP figures, ensuring year-over-year (YoY) numbers are matched to their correct prior periods.
4. **Validation**: Once finished, the system automatically redirects you to the Dashboard.

## Phase 2: Analyzing the Dashboard
- **KPI Cards**: Review the 4 core pillars (Revenue, Net Earnings, EPS, Operating Margin). Note the color-coded growth indicators.
- **Sentiment Gauge**: Observe the AI's assessment of management tone. A score > 70 indicates high confidence in future guidance.
- **Expense Breakdown**: Hover over the interactive **Pie Chart** to see the exact dollar amount allocated to R&D, SG&A, and other operational categories.
- **Margin Analysis**: View the vertical bar chart to quickly compare the efficiency of Gross vs. Operating vs. Net margins.
- **Growth Trajectory**: Use the interactive tooltips on the area chart to track quarterly revenue velocity.

## Phase 3: Market Grounding (The "Real Reality" Check)
1. On the Dashboard, click **Market Grounding**.
2. FinAnalyzer Pro performs a live Google Search via Gemini 3 Pro to find developments *published after* the earnings release.
3. Review the "Grounding Intelligence" summary and click "Contextual Sources" to verify claims against external news outlets or analyst upgrades.

## Phase 4: Comparative Intelligence Hub
1. Navigate to the **Comparison** tab.
2. Select a **Baseline** report (Blue indicator) and a **Benchmark** target (Green indicator). The dropdowns now display Company Names and Tickers for easy identification.
3. **Refresh Data**: If you've just uploaded a new report, click the **Refresh** (circular arrow) icon to update the selections.
4. **Variance Table**: Review the side-by-side KPI comparison. A dedicated **Revenue Growth (YoY)** row helps you benchmark growth acceleration.
5. **Exporting**: 
    - Click **Export Summary PNG** to save a high-res image of the comparison cards for presentations.
    - Click **Export Delta CSV** to download the raw variance data for further Excel analysis.

## Phase 5: Historical Vault
- Visit the **History** tab to search and manage your library of analyzed reports. 
- Use the **Search bar** to filter by ticker or company name.
- Click any row to instantly reload that report into your active Dashboard.
- Delete outdated analysis using the trash icon to keep your LocalStorage vault clean.
