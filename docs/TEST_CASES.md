
# FinAnalyzer Pro - Test Suite

## 1. Scrum User Story Validation
| Story ID | Requirement | Acceptance Criteria | Result |
|----------|-------------|---------------------|--------|
| US-01 | PDF Upload | System accepts valid PDFs and rejects non-PDF files. | Pass |
| US-02 | Metric Extraction | System accurately extracts Revenue, Net Income, and EPS. | Pass |
| US-03 | Sentiment Gauge | System displays 0-100 score based on management tone. | Pass |
| US-04 | Comparison View | User can select two historical reports and see delta variance. | Pass |

## 2. Functional Testing (FT)
- **FT-01: File Size Limits**: Attempt to upload a 50MB PDF. Verify system handles gracefully or warns of size.
- **FT-02: Chart Tooltips**: Hover over Recharts components. Verify exact values appear in tooltips.
- **FT-03: Dark Mode Toggle**: Toggle theme in header. Verify colors shift to slate-900/slate-800 consistently across all views.
- **FT-04: Metric Table Sorting**: (Future) Verify historical reports can be sorted by Date or Company.

## 3. System Integration Testing (SIT)
- **SIT-01: Gemini API Handshake**: Verify `GoogleGenAI` initializes with `process.env.API_KEY`.
- **SIT-02: PDF To Base64 Conversion**: Verify File reader correctly prepares binary data for API ingestion.
- **SIT-03: Grounding Accuracy**: Verify Google Search results in Market Context match real-time web headlines.

## 4. Regression Testing
- **REG-01: LocalStorage Persistence**: Upload a report, refresh browser. Verify the report still appears in History and Dashboard.
- **REG-02: CSV Export Formatting**: Export a comparison. Open in Excel/Sheets. Verify columns align and growth % is readable.

## 5. End-to-End (E2E) Workflow
1. **User Starts** at Dashboard (empty state).
2. **Navigate** to Upload.
3. **Upload** AAPL_Q3.pdf.
4. **View** Dashboard stats (Sentiment 72, Revenue $81B).
5. **Fetch** Market Context.
6. **Navigate** to Comparison.
7. **Select** AAPL_Q3 vs AAPL_Q2.
8. **Verify** Revenue Growth YoY row displays correct % with green indicator.
9. **Print** Report to PDF.
