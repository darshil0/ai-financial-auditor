# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-05-15

### Added
- **Downloadable Diagnostics**: Users can now download the UI Diagnostics report as a high-resolution PNG image.
- **Custom Modal UI**: Replaced native browser alerts with a polished custom modal component for a more consistent and user-friendly experience.
- **Conditional Class Utility**: Implemented a `cn` utility for streamlined conditional class name management.

### Changed
- **Enhanced Currency Formatting**: Refactored the `formatCurrency` utility for improved readability, expanded test coverage, and added compact formatting for T, B, M, and K.
- **Improved Comparison View**: The "Comparison" view button is now disabled with a tooltip when fewer than two reports are available.

### Fixed
- **Sidebar Navigation**: Prevented navigation to the Comparison view when fewer than two reports are present.

## [1.1.0] - 2025-04-20

### Added
- **Comprehensive Testing Suite**: Introduced a full testing suite with Vitest, React Testing Library, and Playwright.
- **Component Refactoring**: Refactored the `ComparisonView` component for better testability.

## [1.0.0] - 2025-03-10

### Added
- **API Key Management**: Migrated from `process.env` to a client-safe `VITE_API_KEY` in a `.env` file.
- **Codebase Formatting**: Applied Prettier for consistent code style across the project.
- **Initial Release**: Basic earnings analysis and dashboard visualization.
