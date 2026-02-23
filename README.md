# E2E Automation Framework - Playwright + JS

## Overview
E2E automation for demowebshop.tricentis.com using Playwright with POM, OOP, Data-Driven tests, smart locators, retry/backoff, and parallel runs.

## Features
- Smart locators with fallback attempts from `BasePage.find`
- Clear locator logs (`Locator OK/FAIL [attempt/total]`)
- Retry with exponential backoff for actions (`safeClick`, `safeFill`)
- Search with price filter + pagination + XPath-based item extraction
- Add-to-cart with random variant selection
- Cart validation with threshold assertion
- Parallel execution and multi-browser matrix by environment
- Unique reports folder per run (HTML + JUnit)

## Prerequisites
- Node.js 18+

## Installation
```bash
npm install
npx playwright install
```

## Configuration
Environment variables (see .env.example):
- `BASE_URL`: Target website URL
- `TIMEOUT`: Test timeout in ms
- `RETRIES`: Number of retries
- `WORKERS`: Number of parallel workers
- `HEADLESS`: `true` / `false`
- `BROWSERS`: comma-separated browser list (`chromium,firefox,edge`)
- `REPORTS_DIR`: Reports root folder
- `RUN_ID`: Optional run identifier
- `GRID_URL` / `PW_WS_ENDPOINT`: Optional remote Playwright websocket endpoint

## Usage
```bash
npm test
npm run test:headed
npm run report
```

Examples:
```bash
# Run chromium + firefox
BROWSERS=chromium,firefox npm test

# Run with custom report root
REPORTS_DIR=reports RUN_ID=interview-1 npm test
```

## Project Structure
- `tests/` - Test specs (e2e.spec.js, login.spec.js)
- `fixtures/` - Playwright fixtures (pageFixtures.js)
- `pages/` - Page Object classes
- `pages/locators/` - Element locator definitions
- `data/testData.json` - Test data
- `utils/` - Logger, parsers, retry logic

## Main Functions
- `login(username, password)` - User authentication
- `searchItemsByNameUnderPrice(query, maxPrice, limit)` - Search and filter items
- `addItemsToCart(urls)` - Add multiple items to cart
- `assertCartTotalNotExceeds(budgetPerItem, itemsCount)` - Verify cart total

## Reporting
- HTML report: `reports/<run-id>/html`
- JUnit XML: `reports/<run-id>/junit.xml`
- Test artifacts: `reports/<run-id>/test-results`

## Assumptions / Limitations
- Target site is demo store content and may change.
- Some products can miss `Add to cart` button and are skipped gracefully.
- `GRID_URL`/`PW_WS_ENDPOINT` is for Playwright websocket-based remote execution.

## Architecture
- **BasePage** - Common functionality, smart locators, retry logic
- **Page Classes** - Specific page implementations
- **Fixtures** - Playwright built-in fixture pattern
- **POM** - Page Object Model pattern
- **Data-Driven** - JSON-based test data

## CI
Run in CI the same way:
```bash
npm ci
npx playwright install --with-deps
npm test
```