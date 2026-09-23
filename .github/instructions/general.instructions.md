---
applyTo: "**/*.ts"
---

- TypeScript strict mode, ES2022 target, CommonJS/node module resolution (see `tsconfig.json`) — no `.js` extensions on relative imports
- Path aliases available: `@pages/*`, `@components/*`, `@fixtures/*`, `@config/*`, `@utils/*`, `@data/*` (prefer relative imports to match existing files unless an alias is already used nearby)
- Use the POM (Page Object Model) pattern — no raw locators inside test specs
- New page objects must be registered as a fixture in `src/fixtures/test.fixture.ts`
- Reuse `src/pages/components/*` for widgets shared across pages (header, login panel) instead of duplicating locators
- Base URL and env-driven config live in `src/config/environment.ts` — don't hardcode URLs/credentials elsewhere
