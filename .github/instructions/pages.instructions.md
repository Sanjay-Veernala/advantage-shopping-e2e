---
applyTo: "src/pages/**/*.ts"
---

## Page Object Rules

- Extend `BasePage` (`src/pages/base.page.ts`) and call `super(page, path)` in the constructor
- Declare locators as `readonly` properties assigned in the constructor — no locators built inline inside methods unless parameterized (e.g. `productCardByName(name)`)
- Override `waitForReady()` only when the page needs a specific ready signal (e.g. `RegistrationPage` asserts the URL and register button)
- Shared widgets (search box, cart icon, user menu, login mini-panel) belong in `src/pages/components/*.component.ts`, composed into pages as readonly properties (see `HomePage.header`, `HomePage.loginPanel`)
- Put verification logic in page methods prefixed `expect...` (e.g. `expectProductName`, `expectItemCountAtLeast`, `expectSignedInAs`) so specs read as a sequence of actions/assertions
- Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, or existing stable selectors (`id`, well-known classes like `.productName`, `.hi-user`) over brittle CSS chains
- Add a one-line comment only when a method's purpose or a workaround isn't obvious from its name/code
