# 📈 FinAnalyzer Pro v1.5.5

**FinAnalyzer Pro** is a high-performance financial intelligence platform designed for institutional-grade earnings analysis. Leveraging the **Google Gemini API** (with extended thinking for deep financial reasoning), it transforms complex, multi-page corporate 10-Q/10-K PDFs into structured, actionable intelligence with visual analytics and real-time market grounding.

[![CI Status](https://github.com/darshil0/ai-financial-auditor/actions/workflows/main.yml/badge.svg)](https://github.com/darshil0/ai-financial-auditor/actions)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue)
![Vite](https://img.shields.io/badge/vite-8.1+-646CFF)
![Node](https://img.shields.io/badge/node-24.x-339933?logo=node.js)

---

## 🏛️ Technical Architecture

FinAnalyzer Pro uses a **Domain-Driven Feature Architecture** that isolates business logic into autonomous feature modules and shared, cross-cutting services, ensuring high scalability and testability.

```mermaid
graph TD
    A["10-Q/10-K PDF"] -->|Upload & Validate| B["ReportUploader (src/features/upload/)"]
    B -->|Extract Text & Tables| C["Gemini Analysis Engine"]
    C -->|Thinking Budget: 10k tokens| D["KPI Extraction"]
    D -->|Structured JSON| E["Zustand Store (src/shared/services/)"]
    E -->|Reactive State| F["Dashboard View (src/features/dashboard/)"]
    E -->|Historical Data| G["Comparison View (src/features/comparison/)"]
    C -->|Streaming Audio| H["Live Analyst Voice (src/features/analyst/)"]
    F -->|Recharts| I["Trend Visualization"]
    G -->|Delta Analysis| J["Variance & Growth Model"]
    H -->|Market Grounding| K["Google Search Integration"]
```

### 🧠 Core Intelligence Components & Model Tiers

The application employs a tiered AI model approach inside `src/shared/services/geminiService.ts`:

| Component            | Model              | Purpose                                      | Constraints / Configuration                                                                                                      |
| -------------------- | ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **KPI Extraction**   | `gemini-2.0-flash` | Revenue, Net Income, EPS, Margins            | Max tokens: 4,000 output. Uses low temperature (0.1) for surgical precision.                                                     |
| **Deep Analysis**    | `gemini-2.0-flash` | Forensic financial narrative analysis        | Budget: 10,000 thinking tokens.                                                                                                  |
| **Live Analyst**     | `gemini-2.0-flash` | Real-time streaming voice advisory           | Utilizes `ScriptProcessorNode` to stream low-latency PCM audio blocks to/from the Gemini live session.                           |
| **Market Grounding** | `gemini-1.5-pro`   | Compare SEC filings to real-time market data | Google Search tool. Rate limited: 60 queries/min. **Note**: `thinkingConfig` must be omitted as it is incompatible with 1.5 Pro. |

---

## 🛡️ Security & Compliance

### Credentials Management

- **API Key Storage**: Store in root-level `.env` file (git-ignored). Never commit credentials.
- **CI/CD**: Use GitHub Secrets for `VITE_API_KEY`.
- **Key Rotation**: If a key is exposed in logs, revoke immediately via Google AI Studio.
- **Error Handling**: Never log full API responses; sanitize stack traces before rendering or logging.

### Code Quality & Audit Trail

- **License**: MIT (full source transparency for institutional auditing).
- **Type Safety**: Strict TypeScript compilation with path aliases (`@/` mapping to `src/`).
- **Module Resolution**: Configured with `moduleResolution: "Bundler"` (with `baseUrl` removed from `tsconfig.json` to guarantee proper path resolution).
- **CI/CD Auditing**: Continuous auditing configured via `.github/workflows/main.yml`, featuring a blocking critical `npm audit`, pinned third-party GitHub Actions via SHAs (with weekly Dependabot updates in `.github/dependabot.yml`), isolated Node 24 and Node 22 build verification jobs, and robust status gates.

---

## 📋 System Requirements & Prerequisites

### Development Environment

- **Node.js**: `v24.x` (LTS, recommended) or `v22.x`.
- **npm**: `v10.x` or `v11.x+` (ships with Node v24.x).
- **Git**: `v2.34+` for shallow clones.
- **Memory**: Minimum 4GB RAM; 8GB recommended.
- **Future-Dated Context (2026)**: Configured with modern package registries providing modern packages like Vite 8.1.3, TypeScript 6.0.3, Recharts 3.9.1, and Vitest 4.1.9.

### API & Integrations

- **Google AI Studio Account**: Sign up at [aistudio.google.com](https://aistudio.google.com/).
- **Gemini API Key**: Required for earnings analysis and the real-time AI analyst.
- **Browser Support**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+ (WebGL required for Recharts; Web Audio API required for the Live Analyst).

---

## 🚀 Getting Started

### Step 1: Clone Repository

```bash
git clone https://github.com/darshil0/ai-financial-auditor.git
cd ai-financial-auditor
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Google Gemini API Key (required)
VITE_API_KEY="YOUR_GEMINI_API_KEY"
```

**Security Warning**: Do NOT share your `.env` file or commit it to version control.

### Step 3: Install Dependencies & Setup Browsers

```bash
npm install
npx playwright install
```

This installs all required packages and downloads the required Playwright browser binaries for end-to-end testing.

### Step 4: Launch Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000` (Vite dev server default). Open in your browser and verify:

- Dashboard loads without console errors.
- Dark mode toggle applies synchronously via an inline script in `index.html` to prevent initial load flashing.

### Step 5: Build for Production

```bash
npm run build
```

This generates an optimized `dist/` directory. Deploy to any static hosting provider.

---

## 🧪 Testing & Quality Assurance

FinAnalyzer Pro enforces a **"Green-Build" policy**: all CI checks must pass before merging to main.

### Full Test Suite

```bash
npm run test:all          # Run all tests (unit + E2E) - Note: requires `npm run build` first
npm run test:unit        # Run unit & component tests (Vitest + React Testing Library)
npm run test:e2e         # Run Playwright E2E tests
npm run test:unit -- --coverage  # Generate code coverage reports
npm run format           # Format codebase using Prettier
npm run lint             # Typecheck (tsc --noEmit) & Prettier code style validation
```

### Test Coverage Requirements

- **Strict Thresholds**: Line coverage is strictly configured at **80%** directly inside `vite.config.ts`.
- **CI Summary**: Vitest generates a `json-summary` coverage report to support automated CI coverage validation.
- **Reporting**: Playwright E2E tests are configured in `playwright.config.ts` to produce JUnit test results at `test-results/junit.xml` during CI runs for automated reporting in GitHub Actions.

---

## 📁 Directory Structure

```
FinAnalyzer Pro/
├── src/
│   ├── features/                 # Modular feature domains (self-contained logic)
│   │   ├── dashboard/            # KPI summaries, trend charts, executive briefing
│   │   ├── analyst/              # Live AI Analyst voice dialogue (ScriptProcessorNode)
│   │   ├── comparison/           # Benchmarking & variance analysis (MetricRow optimized)
│   │   ├── history/              # Report history vault
│   │   └── upload/               # PDF upload & client validation (25MB limit)
│   ├── shared/                   # Shared services, models, and assets
│   │   ├── components/           # Reusable UI (Sidebar, Header, ErrorBoundary, Modal)
│   │   ├── services/             # Gemini API client, Zustand global store
│   │   ├── utils/                # Financial formatters, math, cn tailwind helper
│   │   └── types/                # Domain-wide TypeScript interfaces
│   ├── test/                     # Testing suite
│   │   ├── unit/                 # Component & utility unit tests
│   │   ├── e2e/                  # Playwright end-to-end user journeys
│   │   └── setup.ts              # Vitest setup environment
│   ├── App.tsx                   # Main React tree (global error boundary, layout)
│   └── index.tsx                 # Application entry point
├── .env.example                  # Template for API credentials
├── .env                          # Local credentials (git-ignored)
├── tsconfig.json                 # TypeScript compiler configuration (Bundler resolution)
├── vite.config.ts                # Integrated Vite build and Vitest configuration
├── playwright.config.ts          # E2E Playwright test configurations
├── .github/workflows/
│   └── main.yml                  # Secure CI/CD Workflow (Node 22/24 Matrix)
└── package.json                  # Script & dependency configurations
```

---

## ⚡ Key Features & Implementation Highlights

### Revenue/KPI Extraction

- **Requirement**: Extract Revenue, Net Income, EPS, and Operating Margins from corporate PDFs with forensic accuracy.
- **Implementation**: Handled via `gemini-2.0-flash` with a strict JSON schema in `src/shared/services/geminiService.ts` requiring `netIncomePrior`, `epsPrior`, `revenuePrior`, `operatingMargin`, `netMargin`, and `managementCommentary` fields to guarantee extraction completeness.
- **Validation**: Rejects incomplete or malformed AI payloads, preventing calculations on partial data.

### Interactive Trends & Visualization

- **Requirement**: Display quarterly historical trends for Revenue and Net Income.
- **Implementation**: Powered by `recharts` for highly responsive line charts.
- **Feature**: Supports Zoom, Tooltips, and responsive layout styling.

### Streaming AI Analyst (Voice)

- **Requirement**: Interactive real-time audio dialogue on earnings trends.
- **Implementation**: Powered by `gemini-2.0-flash` real-time API. Captures microphone inputs using a low-latency Web Audio `ScriptProcessorNode` to stream PCM audio, and plays back received audio chunks.
- **Robust Session Stability**: Utilizes a stable reference for the report ID in its dependency arrays (`src/features/analyst/LiveAnalyst.tsx`) to prevent connection restarts when the parent report object reference changes without content updates.

### Comparative Hub with Delta Variance

- **Requirement**: Benchmark reports side-by-side with automatic growth computation.
- **Guardrails**: Restricted in `src/shared/components/Sidebar.tsx` unless at least two reports are uploaded to prevent invalid comparative states.
- **Performance**: In `src/features/comparison/ComparisonView.tsx`, the `MetricRow` component is defined outside the main functional component to eliminate redundant re-mounts and optimize rendering performance.

### Market Grounding via Google Search

- **Requirement**: Cross-examine SEC filing reports with real-time web context.
- **Implementation**: Powered by `gemini-1.5-pro` with Google Search tool enabled.
- **Constraint**: Omit `thinkingConfig` as it is only compatible with Gemini 2.0+ models.

### User Accessibility & Control

- **Shortcuts**: Implements a `Cmd/Ctrl+K` keyboard shortcut to immediately focus the header search input on desktop devices.
- **Client-Side Size Limits**: Enforces a strict 25MB file size limit for PDF uploads in `src/features/upload/ReportUploader.tsx`.
- **Memory Safety**: To prevent memory leaks, `Dashboard.tsx` explicitly revokes Blob URLs created for audio briefings using `URL.revokeObjectURL` during component unmount or briefing updates.
- **Utilities Protection**: The financial formatters and calculators in `src/shared/utils/index.ts` include safety guards for `NaN` and `Infinity` to prevent UI crashes. Conditionally joins Tailwind classes using the custom `cn` utility function.
- **Diagnostics**: Supports exporting analyzed reports to standard JSON formats directly from the Dashboard.

### Resilience & Crash Prevention

- **Global Error Boundary**: Implemented in `src/shared/components/ErrorBoundary.tsx` wrapping the entire main content area inside `src/App.tsx`.
- **Custom Modals**: Uses a custom `Modal` component and `showErrorModal` in `src/App.tsx` for clean application-wide error handling without native alerts.
- **TypeScript Generic Support**: Class-based React components (such as the ErrorBoundary) explicitly declare generic Props and State type parameters in their definition to ensure flawless compilation.

---

## 📝 Version History

Refer to [CHANGELOG.md](CHANGELOG.md) for full release logs.

---

## 🤝 Contributing

We welcome professional contributions. Please ensure that:

1. Unit tests pass and coverage remains at or above the required **80%**.
2. Code conforms to project Prettier style parameters via `npm run format`.
3. Standard Git commit structure is followed.

---

_Institutional-grade financial analysis powered by Google Gemini API._ Developed with precision and forensic attention to detail.
