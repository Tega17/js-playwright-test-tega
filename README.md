# JS Playwright Test Project

This repository contains automated tests written in **Playwright** (JavaScript) to validate analytics events and UI behavior on two news sites:

- [inews.co.uk/politics](https://inews.co.uk/category/news/politics)  
- [newscientist.com](https://www.newscientist.com/)

---

## 📦 Project Setup

1. Clone or create the project folder:
   ```bash
   cd /path/to/js-playwright-test

npm init -y
npm install
npx playwright install

## Running Setup
Run Test headless
npm test

## Run tests in headed mode (see browser UI):
npx playwright test --headed

## Run with Playwright Test UI:
npx playwright test --ui

## Run only one suite:
npx playwright test tests/politics.spec.js
npx playwright test tests/appearance.spec.js

## Test Suites
1. tests/politics.spec.js

-- Navigates to inews.co.uk/politics.
-- Confirms a Google Analytics page_view request with expected parameters:
-- ep.sub_channel_1 = news/politics
-- gcs = G101
-- npa = 1
-- Clicks Accept in the consent modal and verifies the modal is removed.
-- (Optional user_engagement check is skipped to avoid flaky results).

2. tests/appearance.spec.js

-- Navigates to newscientist.com in dark mode.
 Verifies:
-- <html> has the Dark class.
-- localStorage["colourSchemeAppearance"] = "Dark".
-- Clicks Got It on the consent modal and confirms it is removed.
-- Toggles to Light appearance:
-- <html> updates to Light.
-- Local storage updates to Light.
-- Refreshes the page and verifies the Light theme persists.

## Project Structure
js-playwright-test/
├── tests/
│   ├── politics.spec.js     # Analytics + consent modal test
│   └── appearance.spec.js   # Dark/Light mode + consent modal test
├── playwright.config.js     # Playwright configuration (devices, timeouts, reporters)
├── package.json             # NPM config + scripts
└── README.md                # Project documentation

## Notes
Tests rely on GA4 events. The user_engagement event may not fire in all regions; it’s excluded from hard assertions.

If running outside the UK, you may need a UK proxy to see exact analytics behavior. Configure in playwright.config.js using:

proxy: process.env.UK_PROXY ? { server: process.env.UK_PROXY } : undefined
UK_PROXY="http://your-uk-proxy:port" npm test
