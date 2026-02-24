# DemoWebShop Automation Project

Business-focused E2E automation project for https://demowebshop.tricentis.com using Playwright + JavaScript.

## 1) How to Run

### Prerequisites
- Node.js 18+
- npm
- Playwright browser binaries

### Installation
```bash
npm install
npx playwright install
```

### Execution Commands
```bash
npm test
npm run test:headed
npm run report
```

### Current Runtime Configuration
The current project uses fixed configuration values in code (`playwright.config.js`):

- Base URL: `https://demowebshop.tricentis.com`
- Browser projects: `chromium`, `firefox`, `webkit`, `edge`
- Workers: `3`
- Retries: `2`
- Test timeout: `60000ms`
- Action timeout: `15000ms`
- Default mode: `headless: true`

## 2) Architecture (Short)

The project follows POM (Page Object Model) with clear separation between business assertions (tests) and technical UI handling (page objects).

- `tests/` - business scenarios (`e2e.spec.js`, `login.spec.js`)
- `fixtures/` - custom Playwright fixtures that inject page objects
- `pages/` - page objects with reusable business actions
- `pages/locators/` - locator maps per page
- `data/testData.json` - data-driven scenarios and login credentials
- `config/` - framework runtime settings
- `utils/` - shared helpers (logger, retry, parsers)

Core flow summary:
- `HomePage` + `SearchResultsPage`: search and filter products by query + max price
- `ProductPage`: add selected products to cart
- `CartPage`: retrieve cart financial summary and cart consistency result
- `e2e.spec.js`: validates business outcomes (items added, cart totals consistent)

## 3) Limitations / Assumptions

- Target website is a public demo store; DOM/content may change and affect test stability.
- Search-based scenarios rely on live catalog data; if no eligible items exist, scenario is skipped.
- Login test assumes credentials are provided in `data/testData.json`; if `username` is missing, login test is skipped.
- Currency handling is numeric parsing only from UI text; no currency conversion or locale conversion is applied.
- Product options are selected dynamically; some products may still fail add-to-cart and are handled gracefully.

## 4) Reports

Each run creates a unique report folder under `reports/<run-id>/`:

- Playwright HTML report: `reports/<run-id>/html`
- Test artifacts (screenshots/videos/traces/output): `reports/<run-id>/test-results`