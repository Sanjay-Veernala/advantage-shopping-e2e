---
applyTo: "tests/**/*.spec.ts"
---

- Import `test`/`expect` from `../../src/fixtures/test.fixture` — never import directly from `@playwright/test` in specs
- Use static imports only; no dynamic `import()` inside the test body
- Organize specs under `tests/auth/` or `tests/shopping/` to match the existing domain split; use `test.describe()` per feature
- Prefer the `newUser` fixture (`buildNewUser()`) for tests needing an account, so each run uses unique credentials and avoids cross-run collisions
- Use `test.step()` to group each logical action for readable HTML reports
- Do not use `test.setTimeout()` — rely on the global timeout in `playwright.config.ts`
- Keep locators and assertions about page state inside page objects; specs should read as a sequence of page-object calls
- Static reference data (e.g. sample product names) lives in `test-data/users.json` — import it rather than hardcoding strings in specs
