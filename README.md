# Advantage Shopping E2E (Playwright + TypeScript)

Page Object Model framework for [Advantage Online Shopping](https://www.advantageonlineshopping.com/).

## Structure

```
src/
  config/          # Environment and base URL
  fixtures/        # Playwright fixtures (page objects injected into tests)
  pages/           # Page objects + reusable components
  utils/           # Test data helpers
tests/
  auth/            # Login and registration
  shopping/        # Search and cart flows
test-data/         # Static JSON test data
```

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd ~/Desktop/practice/advantage-shopping-e2e
npm install
npx playwright install chromium
cp .env.example .env   # optional: stored user for login.spec.ts
```

## Run tests

```bash
npm test                 # headless
npm run test:headed      # visible browser
npm run test:ui          # Playwright UI mode
npm run test:auth        # auth specs only
npm run test:shopping    # shopping specs only
npm run report           # open HTML report
```

## Design notes

- **POM**: Tests call page methods; locators live in pages/components only.
- **Components**: `HeaderComponent` and `LoginPanelComponent` are shared across flows.
- **Fixtures**: `test.fixture.ts` wires page objects so specs stay thin.
- **Registration**: Most tests create a unique user via `buildNewUser()` to avoid shared-state failures.
- **Stored user**: Copy `.env.example` to `.env` and set `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_EMAIL` to enable the env-based login test.

## CI

Set `CI=true` to enable retries and limit workers (see `playwright.config.ts`).
