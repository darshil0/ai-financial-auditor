# Changelog
All notable changes to this project will be documented in this file.

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
