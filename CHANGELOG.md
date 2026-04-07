# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-04-07

### Added
- **Feature-Based Architecture**: Migrated to a domain-driven structure (`src/features/`, `src/shared/`) for improved modularity and developer experience.
- **GitHub Actions CI**: Implemented automated testing and linting pipeline for Node.js 20.x and 22.x.
- **Legal Compliance**: Integrated official MIT `LICENSE` file for open-source clarity.
- **Enhanced Test Coverage**: Added `store.test.ts` for state management and updated utility tests for the new structure.

### Changed
- **Extraction Engine Upgrade**: Transitioned `analyzeEarningsReport` to `gemini-2.0-flash` for near-instant analysis and superior KPI extraction.
- **Prompt Engineering 2.0**: Refined AI instructions for surgical precision in YoY metrics and sentiment analysis.
- **Build Optimization**: Consolidated `vitest.config.ts` into a unified `vite.config.ts` to reduce project clutter and ensure unified path resolution.
- **Modernized Typings**: Enhanced `src/vite-env.d.ts` with explicit JSX and environment variable definitions to clear CI linting errors.
- **Unified Path Aliases**: Replaced brittle paths with clean `@/features`, `@/shared`, and `@/test` aliases.
- **E2E Test Strategy**: Shifted Playwright to test against the production `npm run preview` server in CI (port 4173) for increased fidelity.

### Fixed
- **Stale Import Paths**: Resolved all broken references resulting from the major directory migration.
- **Git Ignore Security**: Comprehensive `.gitignore` update to protect sensitive environment and OS files.
- **CI/CD Stabilization**: Resolved ESM-incompatible `node -p` scripts and modernized `tsconfig.json` to `NodeNext` for better dependency resolution.
- **Dependency Alignment**: Fixed invalid `vitest` version in `package.json` and synchronized `package-lock.json`.
- **Legacy Cleanup**: Purged redundant root-level markdown files, stagnant metadata, and the `docs` directory.




## [1.4.2] - 2026-04-07

### Added
- **API Key Guard**: Implemented proactive checks for `VITE_API_KEY` in `geminiService.ts` to prevent obscure runtime errors.
- **Resource Disposal**: Comprehensive cleanup of `AudioContext` and `HTMLAudioElement` instances to ensure peak performance during extended sessions.

### Changed
- **AI Model Alignment**: Updated deprecated/incorrect Gemini version strings to official `1.5 Pro` and `2.0 Flash` models.
- **State Robustness**: Refactored `ComparisonView` to reset internal "dismissed" states when users pivot between different reporting periods or filters.

### Fixed
- **Forensic Formatting**: Resolved a critical issue where `formatCurrency` would return `"$NaN"` or `"$Infinity"`; it now correctly defaults to `"$0.00"`.
- **Growth Calculations**: Added defensive type checks and `NaN` guards to `calculateGrowth` to handle anomalous AI-extracted data points.
- **Safe Deletion**: Patched a potential crash in `App.tsx` when purging a report from the historical vault.

## [1.4.1] - 2026-02-24


### Changed

- **Dependency Updates**: Updated core dependencies to latest stable versions for improved compatibility and security
  - `lucide-react`: ^0.562.0 → ^0.565.0 (improved icon library)
  - `vite`: ^6.2.0 → ^6.4.1 (enhanced build performance)
  - `@vitejs/plugin-react`: ^5.0.0 → ^5.1.2 (improved React integration)
  - `html-to-image`: ^1.11.11 → ^1.11.13 (better image rendering)
- **Code Quality**: Enhanced TypeScript strict mode compliance across all modules
- **Build System**: Added comprehensive lint script combining typecheck and format validation

### Fixed

- **Memory Management**: Fixed audio context and media stream cleanup in LiveAnalyst component to prevent memory leaks
- **Null Safety**: Added protective null checks in Dashboard and ComparisonView components
- **Error Handling**: Enhanced error boundaries with improved error logging and user feedback
- **Calculations**: Protected division-by-zero errors in calculateGrowth utility function
- **Data Formatting**: Implemented safe NaN handling in formatCurrency utility
- **Accessibility**: Added aria-labels to all icon-only buttons (Header, Sidebar, DiagnosticsOverlay)

### Added

- **Quality Assurance**: New lint script (`npm run lint`) for comprehensive code quality checking
- **Documentation**: Enhanced README with complete v1.4.1 feature list and setup instructions

## [1.4.0] - 2026-02-24

### Changed

- **Project Restructuring**: Reorganized the codebase into a modular `src/` directory structure, grouping files by their functional roles (components, services, store, types, utils).
- **Absolute Path Aliasing**: Implemented a global `@/` absolute path alias to replace brittle relative imports, improving code maintainability and readability.
- **Enhanced Test Organization**: Relocated unit and end-to-end tests into a unified `src/test/` directory with specialized subfolders.
- **Environment Consistency**: Updated Vite, TypeScript, Vitest, and Playwright configurations to align with the new directory architecture.

## [1.3.0] - 2026-02-22

### Added

- **Financial Performance Trends**: New dashboard section with interactive charts showing revenue and net income velocity.
- **Management Commentary Card**: AI-extracted executive narrative visualization with copy-to-clipboard integration.
- **Global Error Boundary**: Application-wide resilience with professional fallback UI for unhandled React errors.
- **Keyboard Shortcuts**: `Cmd/Ctrl+K` global focus for the ticker search hub with visual hint badge.
- **File Size Validation**: Client-side enforcement of 25MB PDF upload limit in `ReportUploader`.
- **Delete Confirmation Flow**: Safe deletion workflow for the historical report vault using modal verification.

### Changed

- **Upgraded Reasoning Engine**: Transitioned core analysis and grounding to `gemini-2.5-pro` for improved numerical precision.
- **Live Analyst UX**: Added connection states and readiness callbacks for the real-time AI advisor.
- **Synchronous Dark Mode**: Eliminated theme flashing by applying dark class synchronously in `index.html`.
- **Prior-Period Requirements**: Updated AI schema to mandate historical fields, preventing NaN and division-by-zero errors in growth calculations.

### Fixed

- **Live Analyst Audio**: Resolved stale closures on mute state and memory leaks from uncleaned microphone streams.
- **Comparison Filter Reset**: Fixed stale ID selection when switching document types in the Comparison view.
- **Image Generation Config**: Corrected invalid API parameters in `visualizeGuidance`.

## [1.2.0] - 2025-11-15

### Added

- **Downloadable Diagnostics**: Users can now download the UI Diagnostics report as a high-resolution PNG image.
- **Custom Modal UI**: Replaced native browser alerts with a polished custom modal component for a more consistent and user-friendly experience.
- **Conditional Class Utility**: Implemented a `cn` utility for streamlined conditional class name management.

### Changed

- **Enhanced Currency Formatting**: Refactored the `formatCurrency` utility for improved readability, expanded test coverage, and added compact formatting for T, B, M, and K.
- **Improved Comparison View**: The "Comparison" view button is now disabled with a tooltip when fewer than two reports are available.

### Fixed

- **Sidebar Navigation**: Prevented navigation to the Comparison view when fewer than two reports are present.

## [1.1.0] - 2025-11-01

### Added

- **Comprehensive Testing Suite**: Introduced a full testing suite with Vitest, React Testing Library, and Playwright.

### Changed

- **Component Refactoring**: Refactored the `ComparisonView` component for better testability.
- **Documentation**: Updated `README.md` with the latest changes and testing instructions.

## [1.0.0] - 2025-10-20

### Added

- **API Key Management**: Migrated from `process.env` to a client-safe `VITE_API_KEY` in a `.env` file.
- **Codebase Formatting**: Applied Prettier for consistent code style across the project.
- **Initial Release**: Basic earnings analysis and dashboard visualization.

### Changed

- **Documentation**: Updated `README.md` with the latest changes and version.
