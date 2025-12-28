# FinAnalyzer Pro: Professional Workflow Guide

This guide details the end-to-end institutional workflow of the platform, from data ingestion to automated quality verification.

## Phase 1: Intelligent Ingestion

1. **Launch Analysis**: Click **Upload Report** in the sidebar.
2. **File Ingestion**: Drag an earnings PDF (10-Q, 10-K, or Press Release) into the drop zone.
3. **AI Extraction**: Gemini 3 Pro will parse the document. You will see real-time status updates as the engine identifies GAAP vs. non-GAAP metrics.
4. **Auto-Redirect**: Upon completion, the system automatically transitions to the **Dashboard** for the newly created profile.

## Phase 2: Universal Search & Navigation

1. **Centralized Hub**: Use the search bar in the **Header** to find any report in your vault.
2. **Keyboard Control**:
   - Press `Enter` in the search field to focus the dropdown.
   - Use `Arrow Keys` to navigate recent reports or search results.
   - Press `Enter` to switch your active workspace instantly.
3. **Mobile Access**: On smaller screens, use the **Hamburger Menu** to reveal navigation and the **Quick-Toggle** theme icons to switch between Light and Dark modes.

## Phase 3: Comparative Variance Modeling

1. Navigate to the **Comparison** tab.
2. **Select Entities**:
   - Select a **Baseline** (Blue indicator).
   - Select a **Benchmark** (Emerald indicator).
   - The selectors now display full Company Names and Tickers for rapid identification.
3. **Analyze Deltas**: Review the variance table. Look for the **Revenue Growth (YoY)** row to see if growth is accelerating compared to the benchmark period.
4. **Validation Warnings**: If you attempt to compare mismatched tickers or non-chronological periods, the system will provide an actionable alert.

## Phase 4: Market Grounding

1. On the **Dashboard**, click the **Market Grounding** button.
2. The system uses Google Search to find developments published _after_ the report's timestamp.
3. Review the "Grounding Intelligence" section to see current stock trends or recent analyst sentiment changes.

## Phase 5: System Health & Diagnostics

1. **QA Check**: Click **Run UI Diagnostics** at the bottom of the sidebar.
2. **Verification Sweep**: Click **Run Automated Sweep** to simulate tests for:
   - Responsive layout integrity.
   - WCAG color contrast.
   - LocalStorage persistence.
3. **Report Generation**: Use the **Generate Report** button if you need to document UI health for audit purposes.

---

_Optimized for v3.2 Engine - institutional-grade reliability._
