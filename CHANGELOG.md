# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-05-15

### Added
- **Trends Chart**: Added a new visualization section in the dashboard showing revenue and net income trends.
- **Management Commentary**: Direct AI synthesis of management tone with a one-click "Copy to Clipboard" feature.
- **Keyboard Shortcuts**: Implemented `Cmd/Ctrl+K` to focus the universal search bar.
- **React Error Boundary**: Implemented a robust error boundary to catch and handle runtime crashes with a graceful fallback UI.
- **Downloadable Diagnostics**: Users can now download the UI Diagnostics report as a high-resolution PNG image.
- **Custom Modal UI**: Replaced native browser alerts with a polished custom modal component for a more consistent and user-friendly experience.
- **Conditional Class Utility**: Implemented a `cn` utility for streamlined conditional class name management.

### Changed
- **AI Model Upgrade**: Migrated to Gemini 2.5 Pro and Flash models for improved analysis accuracy and performance.
- **Enhanced Currency Formatting**: Refactored the `formatCurrency` utility for improved readability, expanded test coverage, and added compact formatting (T, B, M, K).
- **Improved Comparison View**: The "Comparison" view button is now disabled with a tooltip when fewer than two reports are available.
- **Persistent Dark Mode**: Implemented synchronous dark mode application to prevent light-mode flicker on page load.
- **Aria Labels**: Added descriptive ARIA labels to all icon-only buttons for improved accessibility.

### Fixed
- **Stale Closure in Live Analyst**: Fixed a bug where the mute button had no effect due to a stale closure on the audio stream handler.
- **Microphone Cleanup**: Ensured the microphone stream is properly stopped when the analyst session is closed.
- **Comparison Filter Logic**: Fixed a bug where selected reports were not updated when applying filters in the Comparison view.
- **Sidebar Navigation**: Prevented navigation to the Comparison view when fewer than two reports are present.
- **File Size Validation**: Added client-side validation to prevent uploading PDFs larger than 25MB.
