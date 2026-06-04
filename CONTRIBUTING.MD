# Contributing to FinAnalyzer Pro

Thank you for your interest in contributing to FinAnalyzer Pro! This document outlines the standards, workflows, and expectations for all contributors.

**Contents:**
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Commit & PR Guidelines](#commit--pr-guidelines)
- [Security & Compliance](#security--compliance)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- **Respectful Communication**: Treat all contributors with courtesy, regardless of experience level.
- **Constructive Feedback**: Provide code reviews with actionable suggestions, not criticism.
- **Inclusive Language**: Use gender-neutral and accessible language in code, comments, and discussions.
- **Good Faith Participation**: Assume good intent; escalate disagreements to maintainers if needed.

### Unacceptable Behavior

- Harassment, discrimination, or intimidation of any kind
- Offensive comments related to identity, ability, experience, or background
- Deliberate disruption of discussions or review processes
- Publishing private information without consent

### Enforcement

Violations will be addressed by maintainers with a focus on education and resolution. Severe or repeated violations may result in temporary or permanent ban from the project.

**Report violations** to `darshil@email.com` with details and context.

---

## Getting Started

### Prerequisites

Verify your development environment before cloning:

- **Node.js**: `v20.18.0` (LTS) or `v22.x` (Latest). Run `node --version` to verify.
- **npm**: `v10.2.0+` (ships with Node). Run `npm --version` to verify.
- **Git**: `v2.34+`. Run `git --version` to verify.
- **Memory**: 4GB RAM minimum; 8GB recommended for PDF parsing + model inference.
- **Browser**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+ (for E2E testing).
- **Google AI Studio Account**: Free account at [aistudio.google.com](https://aistudio.google.com/) (required for local testing).

### Environment Setup

1. **Fork the repository** on GitHub (top-right corner).

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-financial-auditor.git
   cd ai-financial-auditor
   ```

3. **Add upstream remote** (to stay synced with main repo):
   ```bash
   git remote add upstream https://github.com/darshil0/ai-financial-auditor.git
   git fetch upstream
   ```

4. **Create `.env` file** for local development:
   ```bash
   cp .env.example .env
   # Edit .env and add your VITE_API_KEY from Google AI Studio
   nano .env
   ```

5. **Install dependencies**:
   ```bash
   npm ci  # Use 'ci' (clean install) instead of 'install' for reproducible builds
   ```

6. **Verify setup**:
   ```bash
   npm run dev
   npm run lint
   npm run test:unit
   ```

   **Expected Output**:
   - Dev server starts on `http://localhost:5173`
   - Lint completes with 0 errors
   - Unit tests pass (or show baseline if new)

### IDE Configuration

#### VS Code (Recommended)

Install these extensions for best experience:

- **ESLint**: `dbaeumer.vscode-eslint` (real-time linting)
- **Prettier**: `esbenp.prettier-vscode` (code formatting)
- **TypeScript Vue Plugin**: `Vue.vscode-typescript-vue-plugin` (if working with Vue)
- **Vitest**: `vitest.explorer` (test runner UI)

Create `.vscode/settings.json` in project root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### JetBrains IDEs (WebStorm, IntelliJ)

1. Go to **Settings** → **Languages & Frameworks** → **TypeScript** → **Code Style**
2. Enable **Reformat code** and **Prettier** on save
3. Enable **Run Vitest tests** from context menu

---

## Development Workflow

### Branch Naming Convention

Follow this pattern for clarity and automation:

```
<type>/<short-description>

Examples:
  feature/extend-thinking-analysis      # New feature
  fix/audio-memory-leak                 # Bug fix
  docs/contributing-guide               # Documentation
  refactor/consolidate-vite-config      # Refactoring
  perf/optimize-pdf-parsing             # Performance
  test/add-e2e-comparison-tests         # Tests
  chore/update-dependencies             # Maintenance
```

**Types**:
- `feature/`: New functionality
- `fix/`: Bug fixes
- `docs/`: Documentation only
- `refactor/`: Code restructuring (no behavior change)
- `perf/`: Performance optimization
- `test/`: Test additions/improvements
- `chore/`: Dependencies, tooling, non-functional

### Step 1: Create Feature Branch

```bash
# Ensure you're on latest main
git fetch upstream
git checkout upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Step 2: Develop & Test Locally

**During Development**:

```bash
# Start dev server (auto-reload on changes)
npm run dev

# Run unit tests in watch mode
npm run test:unit -- --watch

# Run linting (real-time if using VS Code)
npm run lint

# Check TypeScript types
npm run typecheck
```

**Before Committing**:

```bash
# Run full test suite
npm test

# Run E2E tests (ensure dev server is NOT running)
npm run test:e2e

# Verify no console errors (check browser DevTools)
# Verify your feature works as expected
```

### Step 3: Commit Changes

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples**:

```
feat(analyzer): add extended thinking for forensic analysis

- Integrated Gemini extended thinking with 10k token budget
- Added confidence score threshold (75% minimum)
- Updated prompts for surgical precision in YoY metrics

Closes #42
```

```
fix(utils): handle NaN in formatCurrency

Prevent "$NaN" output when passed invalid inputs (null, undefined, NaN).
Default to "$0.00" for invalid values.

Tested with edge cases: null, undefined, NaN, Infinity.

Fixes #156
```

**Commit Rules**:

- **Type** (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`): Required
- **Scope** (e.g., `analyzer`, `utils`, `store`): Recommended
- **Subject**: Imperative mood ("add" not "added"), <50 characters, lowercase
- **Body**: Explain *why* the change, not just *what*; wrap at 72 characters
- **Footer**: Reference issues (`Closes #123`, `Fixes #456`)

**Bad Commits**:
```
❌ "fixed stuff"
❌ "update dependencies"  # Too vague
❌ "WIP"                  # Don't commit unfinished work
```

**Good Commits**:
```
✅ feat(dashboard): add revenue trend visualization
✅ fix(analyst): resolve audio cleanup memory leak
✅ docs: update CONTRIBUTING with branch strategy
```

### Step 4: Keep Branch Synced

If main has new commits, rebase your branch:

```bash
git fetch upstream
git rebase upstream/main

# If conflicts occur, resolve them, then:
git add .
git rebase --continue
```

**Never** use `git merge` from main into your branch (keeps history clean).

### Step 5: Push & Open Pull Request

```bash
git push origin feature/your-feature-name
```

GitHub will show a prompt to open a PR. Click it, or go to https://github.com/darshil0/ai-financial-auditor/pulls.

**PR Template** (auto-fills):

```markdown
## Description
Brief explanation of changes and their purpose.

## Related Issue
Closes #123

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance

## How to Test
Step-by-step instructions for reviewers to verify the changes.

## Checklist
- [ ] Tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Code is formatted (`npm run lint`)
- [ ] No console errors
- [ ] Changelog updated (if applicable)
- [ ] Documentation updated (if applicable)
```

### Step 6: Code Review & Iteration

**Expectations**:
- Maintainers will review within 48 hours
- Address feedback by adding new commits (don't force-push unless asked)
- Re-request review after addressing comments
- Be patient; maintainers have limited bandwidth

**Review Checklist** (what maintainers evaluate):
- ✅ Code follows style guidelines (`npm run lint` passes)
- ✅ Tests are included and passing
- ✅ Documentation is updated
- ✅ No security vulnerabilities introduced
- ✅ Performance impact is acceptable
- ✅ Commit messages are clear and follow conventions

### Step 7: Merge & Cleanup

Once approved:
1. Maintainers will squash and merge your PR
2. Delete your feature branch:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

---

## Code Standards

### TypeScript

**Strict Mode**: All code must comply with `tsconfig.json` strict mode settings.

```typescript
// ✅ GOOD: Explicit types, no implicit any
function calculateGrowth(current: number, prior: number): number | null {
  if (prior === 0) return null;
  return (current - prior) / prior;
}

// ❌ BAD: Implicit any, unclear return type
function calculateGrowth(current, prior) {
  return (current - prior) / prior;
}
```

**Naming Conventions**:
- Components: `PascalCase` (e.g., `Dashboard`, `LiveAnalyst`)
- Functions/utilities: `camelCase` (e.g., `formatCurrency`, `analyzeReport`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_PDF_SIZE_MB`)
- Files: `kebab-case` (e.g., `format-currency.ts`) for utilities; `PascalCase` for components (e.g., `Dashboard.tsx`)

**Return Types**: Always specify explicit return types on functions (no implicit `any`).

```typescript
// ✅ GOOD
async function fetchEarningsData(ticker: string): Promise<EarningsReport> {
  // ...
}

// ❌ BAD
async function fetchEarningsData(ticker: string) {
  // Return type inferred; harder to refactor
}
```

**Null Safety**: Use TypeScript's strict null checks; prefer optional chaining and nullish coalescing.

```typescript
// ✅ GOOD: Null-safe
const revenue = earnings?.financials?.revenue ?? 0;

// ❌ BAD: Can crash if earnings is undefined
const revenue = earnings.financials.revenue;
```

### React & Components

**Functional Components**: Use hooks; no class components.

```typescript
// ✅ GOOD
export function Dashboard(): JSX.Element {
  const [reports, setReports] = useState<Report[]>([]);
  // ...
  return <div>{/* ... */}</div>;
}

// ❌ BAD: Class component (outdated)
export class Dashboard extends React.Component {
  // ...
}
```

**Props Interface**: Define props as a named interface.

```typescript
// ✅ GOOD
interface DashboardProps {
  reports: Report[];
  onUpload: (report: Report) => void;
}

export function Dashboard({ reports, onUpload }: DashboardProps): JSX.Element {
  // ...
}

// ❌ BAD: Inline props (harder to test)
export function Dashboard(props) {
  // ...
}
```

**Custom Hooks**: Extract stateful logic into custom hooks.

```typescript
// ✅ GOOD: Reusable hook
function useEarningsAnalysis(pdfFile: File) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  // ...
  return { analysis, error, isLoading };
}

// ❌ BAD: All logic in component (untestable)
export function Dashboard({ pdfFile }) {
  // 200+ lines of logic here
}
```

**Memoization**: Use `React.memo` for expensive components; avoid premature optimization.

```typescript
// ✅ GOOD: Memoized when necessary
interface TrendChartProps {
  data: TimeSeriesData[];
}

export const TrendChart = React.memo(function TrendChart({ data }: TrendChartProps) {
  return <Recharts data={data} />;
});

// ❌ BAD: Unnecessary memoization
export const SimpleButton = React.memo(function SimpleButton({ label }) {
  return <button>{label}</button>;
});
```

### Styling

**Tailwind CSS**: Use Tailwind utility classes; avoid inline styles or global CSS.

```tsx
// ✅ GOOD
<div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg shadow-md">
  <h1 className="text-xl font-bold text-white">Dashboard</h1>
</div>

// ❌ BAD: Inline styles
<div style={{ display: 'flex', backgroundColor: '#1e293b', padding: '16px' }}>
  <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Dashboard</h1>
</div>
```

**Dark Mode**: Use `dark:` prefix for dark mode classes; leverage CSS variables from `@/shared/styles`.

```tsx
// ✅ GOOD: Dark mode support
<button className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
  Save Report
</button>

// ❌ BAD: Light mode only
<button className="bg-white text-slate-900">
  Save Report
</button>
```

### Error Handling

**Always handle errors explicitly**; never silently fail.

```typescript
// ✅ GOOD: Explicit error handling
async function analyzeReport(pdfFile: File): Promise<Analysis> {
  try {
    const response = await geminiService.analyze(pdfFile);
    if (!response.success) {
      throw new Error(`API error: ${response.error}`);
    }
    return response.data;
  } catch (error) {
    logger.error('Report analysis failed', { fileName: pdfFile.name, error });
    throw new Error('Failed to analyze report. Please try again.');
  }
}

// ❌ BAD: Silent failure
async function analyzeReport(pdfFile: File) {
  const response = await geminiService.analyze(pdfFile);
  return response.data; // Crashes if response is undefined
}
```

**User-Facing Errors**: Provide actionable error messages.

```typescript
// ✅ GOOD: Actionable
throw new Error('PDF exceeds 25MB limit. Compress your file and try again.');

// ❌ BAD: Vague
throw new Error('Error');
```

---

## Testing Requirements

### Coverage Targets

| Category | Target | Enforcement |
|----------|--------|-------------|
| **Utilities** | 95% | Block PR if <95% |
| **Services** | 85% | Block PR if <85% |
| **Components** | 80% | Block PR if <80% |
| **Overall** | 80% | Block PR if <80% |

### Unit Tests

**Tool**: Vitest + React Testing Library

**Requirements**:
- Test user behavior, not implementation details
- Mock external dependencies (API, file system)
- Avoid testing React internals

**Test File Placement**:
```
src/
├── shared/
│   ├── utils/
│   │   ├── format-currency.ts
│   │   └── __tests__/
│   │       └── format-currency.test.ts
```

**Test Structure** (AAA Pattern):

```typescript
describe('formatCurrency', () => {
  // ✅ GOOD: Clear test name, AAA pattern
  it('should format valid numbers with dollar sign and commas', () => {
    // Arrange
    const input = 1234567.89;

    // Act
    const result = formatCurrency(input);

    // Assert
    expect(result).toBe('$1,234,567.89');
  });

  // ✅ GOOD: Edge case with clear expectation
  it('should return $0.00 when passed NaN', () => {
    const result = formatCurrency(NaN);
    expect(result).toBe('$0.00');
  });

  // ❌ BAD: Test name too vague
  it('tests formatCurrency', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });
});
```

**Component Tests**:

```typescript
describe('Dashboard', () => {
  it('should render dashboard with uploaded reports', () => {
    // Arrange
    const reports: Report[] = [
      { id: '1', ticker: 'AAPL', date: new Date() }
    ];

    // Act
    const { getByText } = render(<Dashboard reports={reports} />);

    // Assert
    expect(getByText('AAPL')).toBeInTheDocument();
  });
});
```

**Run Unit Tests**:

```bash
# Run all unit tests once
npm run test:unit

# Watch mode (auto-rerun on changes)
npm run test:unit -- --watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests

**Tool**: Playwright

**Scope**: Critical user workflows only; not all features.

**Test File Placement**:
```
src/test/e2e/
├── upload-and-analyze.spec.ts
├── comparison-view.spec.ts
└── live-analyst.spec.ts
```

**Critical Workflows to Test**:
1. ✅ Upload PDF → Extract KPIs → Display Dashboard
2. ✅ Upload two reports → Compare → View variance
3. ✅ Activate Live Analyst → Stream audio commentary
4. ✅ Export diagnostics as PNG
5. ✅ Delete report with confirmation

**Test Structure**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Upload & Analyze Workflow', () => {
  test('should upload PDF and display extracted KPIs', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:4173');

    // Upload PDF (assuming file exists at fixtures path)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('src/test/fixtures/sample-10q.pdf');

    // Wait for analysis to complete (up to 10 seconds)
    await page.waitForSelector('[data-testid="kpi-revenue"]', { timeout: 10000 });

    // Assert KPIs displayed
    const revenue = await page.locator('[data-testid="kpi-revenue"]').textContent();
    expect(revenue).toMatch(/\$[\d,]+\.?\d*/); // Matches $X,XXX.XX format
  });
});
```

**Run E2E Tests**:

```bash
# Ensure dev server is NOT running
# (E2E tests start their own preview server on port 4173)

npm run test:e2e

# Run specific test file
npm run test:e2e -- upload-and-analyze.spec.ts

# Debug mode (opens browser, slows down)
npm run test:e2e -- --debug
```

**Preconditions for E2E**:
- Valid `VITE_API_KEY` in `.env`
- Sample PDF at `src/test/fixtures/sample-10q.pdf`
- Internet connectivity (Google Search tests require live API)

### Validation Checklist

Before submitting a PR, verify:

```bash
# 1. All tests pass
npm test

# 2. Coverage meets targets (run report)
npm run test:coverage

# 3. No console errors
npm run dev
# Open http://localhost:5173 in browser
# Check DevTools > Console for errors

# 4. Linting passes
npm run lint

# 5. TypeScript compiles without errors
npm run typecheck

# 6. Build succeeds
npm run build
```

---

## Commit & PR Guidelines

### Commit Message Format

**Structure**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without behavior change
- `perf`: Performance optimization
- `test`: Test additions or updates
- `chore`: Build, dependencies, tooling

**Scope**: Affected area (optional but recommended)
- Examples: `analyzer`, `dashboard`, `utils`, `store`

**Subject**:
- Imperative mood: "add" not "added"
- Lowercase
- No period at end
- <50 characters

**Body** (optional):
- Explain *why*, not *what*
- Wrap at 72 characters
- Separate from subject with blank line

**Footer**:
- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

**Examples**:

```
feat(analyzer): add extended thinking for forensic analysis

Integrated Gemini 2.0 Flash with extended thinking (10k token budget)
for deep narrative analysis of earnings calls and 10-K filings.

- Added confidence score threshold (minimum 75%)
- Updated system prompts for surgical precision
- Added tests for edge cases (one-time charges, discontinued ops)

Closes #42
```

```
fix(utils): handle NaN in formatCurrency

Prevent "$NaN" output when formatCurrency receives invalid inputs
(null, undefined, NaN, Infinity). Default to "$0.00" instead.

Tested with edge cases: null, undefined, NaN, Infinity, negative numbers.

Fixes #156
```

### Pull Request Guidelines

**Before Opening a PR**:

- [ ] Branch is based on latest `upstream/main`
- [ ] All tests pass: `npm test`
- [ ] Code is formatted: `npm run lint`
- [ ] No console errors
- [ ] Changelog updated (if not a chore)
- [ ] Documentation updated (if user-facing)

**PR Description** (use template):

```markdown
## Description
Brief explanation of what this PR does and why.

## Related Issues
Closes #123
Fixes #456

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance

## How to Test
Step-by-step instructions for reviewers:

1. Check out this branch
2. Run `npm install && npm run dev`
3. Upload the test PDF at `src/test/fixtures/sample-10q.pdf`
4. Verify the new feature works as expected

## Checklist
- [ ] Tests added/updated (`npm test` passes)
- [ ] E2E tests updated (if user-facing change)
- [ ] Code formatted (`npm run lint` passes)
- [ ] TypeScript types correct
- [ ] No console errors
- [ ] Changelog updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

**Review Process**:

1. **Automated Checks**: GitHub Actions runs linting, tests, build
   - If any fail, fix and push new commit
   - Do NOT force-push (keeps review context)

2. **Code Review**: Maintainers review within 48 hours
   - Respond to feedback by adding new commits
   - Request re-review after addressing comments
   - Engage respectfully; ask clarifying questions if feedback is unclear

3. **Approval & Merge**: Once approved
   - Maintainers squash and merge your commits
   - Your branch is automatically deleted
   - Your PR is closed

---

## Security & Compliance

### API Key Management

**Never commit API keys or secrets.**

- Store all secrets in `.env` (git-ignored)
- Use `.env.example` as a template with placeholder values
- Never log full API responses; sanitize credentials from stack traces
- Rotate API keys quarterly; revoke immediately if exposed

**Safe Error Logging**:

```typescript
// ✅ GOOD: Sanitized error
catch (error) {
  const sanitized = {
    message: error.message,
    status: error.status,
    // Don't log full response
  };
  logger.error('API call failed', sanitized);
}

// ❌ BAD: Logs full response with API key
catch (error) {
  logger.error('API call failed', { response: error });
}
```

### Dependency Security

- **Audit regularly**: `npm audit`
- **Update dependencies**: `npm update` (respects semver constraints)
- **Lock file**: Always commit `package-lock.json` (ensures reproducible builds)
- **Vulnerable versions**: Fix immediately; file a PR

**Check for vulnerabilities**:

```bash
npm audit           # List vulnerabilities
npm audit fix       # Auto-fix if possible
npm audit --audit-level=moderate  # Fail CI if moderate+ vulns
```

### Type Safety & Null Safety

- **No `any` types**: Use explicit types or `unknown`
- **Strict null checks**: Enabled in `tsconfig.json`
- **Validate inputs**: Check types, lengths, ranges before using

```typescript
// ✅ GOOD: Validated input
function calculateGrowth(current: number, prior: number): number | null {
  if (typeof current !== 'number' || typeof prior !== 'number') {
    return null;
  }
  if (prior === 0) return null;
  return (current - prior) / prior;
}

// ❌ BAD: No validation
function calculateGrowth(current, prior) {
  return (current - prior) / prior; // Crashes if prior is 0 or undefined
}
```

### Accessibility (a11y)

- **Semantic HTML**: Use `<button>`, `<nav>`, `<main>` correctly
- **ARIA Labels**: Icon-only buttons need `aria-label`
- **Keyboard Navigation**: All interactive elements must be keyboard-accessible
- **Color Contrast**: Text must meet WCAG AA (4.5:1 contrast ratio)

```tsx
// ✅ GOOD: Accessible button
<button
  aria-label="Upload PDF report"
  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
>
  <UploadIcon />
</button>

// ❌ BAD: No accessible label
<div onClick={() => handleUpload()}>
  <UploadIcon />
</div>
```

---

## Release Process

### Version Numbering (Semantic Versioning)

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., v1.0.0 → v2.0.0)
- **MINOR**: New features, backward compatible (e.g., v1.5.0 → v1.6.0)
- **PATCH**: Bug fixes (e.g., v1.5.2 → v1.5.3)

### Release Checklist (Maintainers Only)

1. **Prepare Release Branch**:
   ```bash
   git checkout -b release/v1.6.0
   git pull upstream main
   ```

2. **Update Version**:
   ```bash
   npm version minor  # or patch, major
   # Updates package.json, package-lock.json, tags commit
   ```

3. **Update Changelog**:
   - Move items from `[Unreleased]` to new version
   - Add release date
   - Include all features, fixes, breaking changes

4. **Run Full Test Suite**:
   ```bash
   npm test
   npm run test:e2e
   npm run build
   ```

5. **Create Release PR**:
   - Title: `chore: Release v1.6.0`
   - Description: Link to changelog
   - Require approval before merge

6. **Merge & Tag**:
   ```bash
   git checkout main
   git pull origin main
   git tag v1.6.0
   git push origin v1.6.0
   ```

7. **Create GitHub Release**:
   - Go to https://github.com/darshil0/ai-financial-auditor/releases
   - Click "Draft a new release"
   - Select tag `v1.6.0`
   - Copy changelog content
   - Publish

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **"Cannot find module @/shared"** | Run `npm install`. Ensure `tsconfig.json` has paths configured. |
| **Tests fail with "API quota exceeded"** | Wait 1 minute for quota reset. Use mock API for tests. |
| **Playwright E2E times out** | Ensure dev server is NOT running. E2E tests start their own server on port 4173. |
| **"VITE_API_KEY is not defined"** | Create `.env` file with `VITE_API_KEY="your_key_here"`. |
| **Dark mode flashing** | This is a known issue on mobile Safari. Upstream fix pending. |
| **Memory leak warning in LiveAnalyst** | Known issue; cleanup fix scheduled for v1.6.0. Safe to ignore for now. |
| **"Cannot find PDF file"** | Ensure `src/test/fixtures/sample-10q.pdf` exists. Create if missing. |
| **TypeScript errors in IDE** | Reload TypeScript server: `Cmd/Ctrl+Shift+P` → "TypeScript: Restart TS Server" |

### Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: File a GitHub Issue with reproducible steps
- **Security**: Email `darshil@email.com` privately (don't open public issue)
- **Code Review**: Ask questions in PR comments; maintainers happy to help

### Reporting Issues

Include:
1. **Steps to reproduce** (exact, step-by-step)
2. **Expected behavior** (what should happen)
3. **Actual behavior** (what actually happened)
4. **Environment** (Node version, OS, browser)
5. **Logs** (console errors, relevant output)
6. **Screenshots** (if visual issue)

**Example**:
```
## Issue: Dashboard crashes when uploading large PDF

### Steps to Reproduce
1. Go to http://localhost:5173
2. Click "Upload PDF"
3. Select a 24MB 10-K filing
4. Click Upload

### Expected
Dashboard loads with KPIs extracted

### Actual
White screen; console shows "Uncaught TypeError: Cannot read property 'data' of undefined"

### Environment
- Node v20.18.0
- macOS 14.5
- Chrome 125

### Console Error
```
TypeError: Cannot read property 'data' of undefined
  at analyzeReport (geminiService.ts:45)
```
```

---

## Summary

Contributing to FinAnalyzer Pro means:

1. **Code Quality**: TypeScript strict mode, comprehensive tests, clean commits
2. **Community**: Respectful collaboration, constructive feedback, inclusive language
3. **Process**: Feature branches, PRs, code review, changelog updates
4. **Security**: No hardcoded secrets, input validation, dependency auditing
5. **Testing**: Unit + E2E tests, 80%+ coverage, no console errors

Thank you for helping make FinAnalyzer Pro better! 🚀

---

**Last Updated**: June 2026 | **Maintainer**: Darshil
