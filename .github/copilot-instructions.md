# Advantage Online Shopping Playwright Automation — Default Instructions

These instructions apply automatically to every prompt in this workspace. No need to repeat them.

## APPLICATION DETAILS

- **App**: [Advantage Online Shopping](https://www.advantageonlineshopping.com/) demo storefront
- **Base URL**: `BASE_URL` in `.env` (defaults to `https://www.advantageonlineshopping.com` in `src/config/environment.ts`)
- **Optional stored user**: `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_EMAIL` in `.env` (see `hasStoredTestUser()`), used only by the env-based login test
- **Default flow**: most tests register a fresh unique user via `buildNewUser()` (`src/utils/data-generator.ts`) instead of relying on shared/stored accounts

## FRAMEWORK STRUCTURE

```
src/
  config/environment.ts       — env, hasStoredTestUser()
  pages/
    base.page.ts               — goto, waitForReady, expectUrlContains
    home.page.ts                — header/login panel access, popular items, product cards, search results
    login.page.ts               — login form
    registration.page.ts        — registration form
    product.page.ts             — product detail page, add to cart
    cart.page.ts                — cart page assertions
    components/
      header.component.ts       — search box, cart icon, user menu
      login-panel.component.ts  — mini sign-in panel dropdown
  fixtures/
    test.fixture.ts             — injects homePage, loginPage, registrationPage, productPage, cartPage, newUser
  utils/
    data-generator.ts           — buildNewUser() for unique test users
tests/
  auth/
    login.spec.ts
    registration.spec.ts
  shopping/
    add-to-cart.spec.ts
    search.spec.ts
test-data/
  users.json                    — static reference data (e.g. sampleProduct)
```

There is **no `src/flows/` layer** in this project — tests call page object methods directly through the `test.fixture.ts` fixtures. Do not introduce a flows abstraction unless explicitly asked.

## RULES

- Use the POM (Page Object Model) pattern: every screen/section gets its own page object in `src/pages/`; shared widgets (header, login panel) go in `src/pages/components/`.
- Every page object extends `BasePage` and takes `Page` in its constructor; locators are declared as `readonly` properties set in the constructor.
- Register any new page object as a fixture in `src/fixtures/test.fixture.ts` so tests can consume it without manual instantiation.
- Tests must use the `test` export from `../../src/fixtures/test.fixture` (never import `@playwright/test` directly in specs) so fixtures are available.
- Prefer unique, randomly generated test data via `buildNewUser()`/`data-generator.ts` over hardcoded or shared accounts, so tests don't collide across parallel runs.
- Use resilient locators: `getByRole`, `getByLabel`, `getByPlaceholder`, or stable `id`/class selectors already used in this app (e.g. `#menuUserLink`, `.hi-user`, `.productName`). Avoid brittle/deep CSS chains.
- Keep assertions (`expect`) inside page objects for state verification (e.g. `expectProductName`, `expectItemCountAtLeast`) so specs stay thin and readable.
- `retries: 0` locally, `2` on CI (already configured in `playwright.config.ts`) — don't change this without being asked.
- Don't use `test.setTimeout()` in specs; rely on the global `timeout: 60_000` and `expect.timeout: 10_000` in `playwright.config.ts`.
- Use `test.step()` to group logical actions in a spec for readable HTML reports.
- Add short comments only where behavior isn't obvious from the code (e.g. explaining a workaround), not on every line.
- This is a single external live site (chromium only project) — verify new locators by running the test and checking the Playwright HTML report/trace.

## FAILURE RECOVERY WITH MCP BROWSER

- When a test fails, first identify the failed step and error from the Playwright output/report.
- Invoke the Playwright MCP browser for the same screen: navigate to the relevant route, capture an accessibility snapshot, and evaluate the relevant DOM attributes/state.
- Do not guess a replacement locator. Confirm the live role, accessible name, selector, visibility, and relevant parent/container in MCP before editing the Page Object.
- Apply the smallest Page Object or test-flow fix, rerun the failed test, and then run the affected neighboring tests.
- If the MCP browser is unavailable, report `Cannot diagnose failure: MCP browser unavailable.` and do not invent a locator workaround.

## RUNNING TESTS

```bash
npm test                 # headless
npm run test:headed      # visible browser
npm run test:ui          # Playwright UI mode
npm run test:auth        # tests/auth only
npm run test:shopping    # tests/shopping only
npm run report           # open HTML report
```

Run the relevant test(s) after any change and confirm they pass before considering a task done.
