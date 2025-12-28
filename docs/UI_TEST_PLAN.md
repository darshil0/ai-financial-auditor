# FinAnalyzer Pro - UI/UX Quality Assurance Plan

This document outlines the testing strategies used to ensure boardroom-grade quality for the financial intelligence platform.

## 1. Automated Visual Checks

- **Viewport Stacking**: Verify that `SummaryCards.tsx` transition from a 4-column grid to a single column on devices narrower than 768px.
- **Theme Continuity**: Using CSS variables or utility classes, ensure that switching to Dark Mode instantly updates all borders and background blurs without style leakage.
- **Ticker Navigation**: Verify that the `Header.tsx` search results can be navigated entirely using the keyboard (Up/Down/Enter/Esc).

## 2. Interactive States & Accessibility

- **Focus Management**: All interactive elements (buttons, inputs) must display a high-contrast focus ring for keyboard users.
- **Screen Reader Labelling**: Ensure `aria-label` attributes are present on icon-only buttons like the Theme Toggle and Mobile Menu.
- **Loading UX**: The `ReportUploader.tsx` must provide continuous visual feedback (animated progress bars) to prevent user drop-off during Gemini's 10-30s analysis period.

## 3. Data Integrity Tests

- **Local Persistence**: Mocked test case ensures that `localStorage` writes do not block the main thread and that large datasets (>5MB) are handled via lazy loading or efficient parsing.
- **Validation Logic**: The `ComparisonView.tsx` validator must flag warnings if a user attempts to compare two reports with mismatched tickers or reverse-chronological order.

## 4. Performance Metrics

- **LCP (Largest Contentful Paint)**: Keep dashboard paint times below 1.2s by optimizing Recharts rendering.
- **FID (First Input Delay)**: Ensure the sidebar menu is interactive immediately, even while heavy PDF parsing is happening in a separate service.

---

_Verified on v3.1 Engine - Gemini 3 Pro reasoning integration._
