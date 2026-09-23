---
agent: "agent"
description: "Create a new Playwright test case for Advantage Online Shopping using the existing POM structure"
---

# Create a Test Case

You are adding a new Playwright test case to this Advantage Online Shopping automation project. Follow `.github/copilot-instructions.md` and the applicable `.github/instructions/*.md` files. Follow these phases in order.

## PHASE 1 — UNDERSTAND THE FLOW

1. Read the user's steps and map them to the existing site flow (home → login/registration → search/popular items → product details → cart).
2. Check `src/pages/`, `src/pages/components/`, and `src/fixtures/test.fixture.ts` for page objects/methods that already cover the needed actions. Reuse them — do not duplicate.
3. If test data is needed (sample product name, credentials), check `test-data/users.json` and `src/utils/data-generator.ts` (`buildNewUser()`) before inventing new values.
4. If a step requires a locator/page object that doesn't exist yet, note exactly what's missing before writing code.

## PHASE 2 — BUILD CODE

### Page Object changes (only if needed)

- Add methods/locators to an existing page object in `src/pages/`, or create a new one extending `BasePage` if the flow targets a genuinely new screen.
- Locators are `readonly` properties set in the constructor; use `getByRole`/`getByLabel`/`getByPlaceholder`/stable `id`/class selectors.
- Verification helpers go in the page object as `expect...` methods.
- Register any new page object as a fixture in `src/fixtures/test.fixture.ts`.

### Test spec

- Create/extend a `.spec.ts` file under `tests/auth/` or `tests/shopping/` (match existing domain split).
- Import `test`/`expect` from `../../src/fixtures/test.fixture` — never `@playwright/test` directly.
- Use `test.describe()` + `test.step()` for readable steps.
- Prefer the `newUser` fixture for any flow requiring an account.

## PHASE 3 — RUN AND FIX

1. Run the new/changed spec: `npx playwright test <path-to-spec> --reporter=list`
2. If it fails, inspect the HTML report/trace (`npm run report`) to identify the exact failing step and locator/assertion.
3. Invoke the Playwright MCP browser on the same route, capture a snapshot, and evaluate the live DOM to verify the failed element's role, name, selector, visibility, and state.
4. Apply the smallest evidence-based Page Object/flow fix — never guess a locator — and re-run the failed spec until it passes.
5. If MCP browser is unavailable, report `Cannot diagnose failure: MCP browser unavailable.` and stop rather than fabricating a locator.

## YOUR TEST — Paste steps below:

**Test file**: tests/&lt;auth|shopping&gt;/&lt;name&gt;.spec.ts

**Steps**:

1. ...
