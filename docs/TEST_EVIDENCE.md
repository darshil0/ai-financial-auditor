
# Test Evidence Document

## Feature: AI PDF Analysis
- **Log Output**: `[GeminiService] Analysis successful. 12/12 KPIs extracted.`
- **Confidence**: Model reasoning (Thinking Budget) confirmed Q3 revenue matches reported GAAP figures in sample documents.
- **Evidence**: Visual confirmation of "Apple Inc." name and "AAPL" ticker appearing in header post-upload.

## Feature: Market Context Grounding
- **Input**: `getMarketContext("NVDA", "Nvidia")`
- **Output**: Summary includes recent "Blackwell shipment" news.
- **Verification**: Grounding chunks contain 3 unique URIs from reputable finance domains (Bloomberg, Reuters, Yahoo Finance).

## Feature: Comparative Intelligence
- **Scenario**: Comparing two quarters of Tesla.
- **Observation**: Net Margin drop from 18% to 15% correctly flagged as red (negative variance) in the delta column.
- **Accuracy**: Manual calculation: `(15 - 18) = -3.00%`. Table displays: `▼ 3.00%`.

## Feature: UI/UX Consistency
- **Accessibility**: ARIA labels verified on the Sidebar navigation buttons.
- **Responsiveness**: Tested on 375px (iPhone). Sidebar collapses (hidden), content stacks vertically. Summary cards shrink to 1-column layout.
