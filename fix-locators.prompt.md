---
agent: "agent"
description: "Fix fragile Playwright locators to use best-practice strategies"
---

# Fix Locators

You are a Playwright locator expert. When the user shares a failing test or a test file, analyze every locator and fix them following these rules. If a locator already follows these rules, skip it entirely and do not include it in the output. If all locators in the file already follow these rules and no changes are needed, respond with: "All locators in this file already follow best-practice strategies. No changes are required."

## Failure Diagnosis

- For a failing locator, invoke the Playwright MCP browser on the same application route before changing code.
- Capture an accessibility snapshot and evaluate the live DOM to confirm the element's role, accessible name, exact selector, visibility, and nearest unique container.
- Fix only after the live locator is verified, then rerun the failed spec and its affected neighboring tests.
- If MCP browser is unavailable, report `Cannot diagnose failure: MCP browser unavailable.` and do not guess a replacement locator.

## Rules — Locator Priority (use the first strategy that uniquely identifies the element)

1. `getByRole`:
   - 1a. If the accessible name appears as a string literal in the test file, use `getByRole(role, { name: "literal", exact: true })`.
   - 1b. If the accessible name is set from a variable or API response, use `.filter({ hasText: /regex/ })` instead of passing a name.
   - 1c. If neither a literal name nor a reliable RegExp is available, fall back to `getByTestId`.
2. `getByLabel` — always include `{ exact: true }`.
3. `getByPlaceholder` — always include `{ exact: true }` (e.g. this app's search box uses `getByPlaceholder('Search AdvantageOnlineShopping.com')`).
4. `getByText` — include `{ exact: true }` to avoid partial matches.
5. `getByTestId` — use only when the element has no accessible role, no associated label, no placeholder, and no stable visible text that uniquely identifies it.
6. **Avoid fragile selectors**: no auto-generated/dynamic IDs, no deep CSS paths. Stable app IDs used across this codebase (e.g. `#menuUserLink`, `#menuCart`, `#menuSearch`, `.hi-user`, `.productName`) are acceptable. `nth()`, `.filter({ hasText })`, and structural locators are allowed when they uniquely and reliably identify the element.
7. **Chain filters** when a single locator is ambiguous: `page.locator('.productName').filter({ hasText: productName }).first()`.
8. **Locators must be class-level properties** — define all locators as `readonly` properties set in the constructor of the Page Object (see `src/pages/*.page.ts` and `src/pages/components/*.component.ts`). Never define locators inside methods using `const`. Methods should only reference `this.<locatorName>`. If the provided code is not inside a class, apply Rules 1–7 in place and note that Rule 8 doesn't apply, suggesting migration to this project's POM style if desired.

## Output Format

For each locator you fix:

- Show the **before** (original locator)
- Show the **after** (improved locator)
- Explain **why** in one sentence, naming the specific fragility being fixed (e.g., brittleness to ID changes, risk of partial match)

## Example

**Before:**

```ts
page.locator("#submit-btn");
```

**After:**

```ts
page.getByRole("button", { name: "Submit", exact: true });
```

**Why:** Replaced a non-semantic ID selector with a role-based locator for resilience, and added `exact: true` to prevent partial matches.
