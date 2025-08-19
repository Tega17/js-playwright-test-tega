// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium-uk',
      testMatch: /politics\.spec\.js/, // only run the mobile analytics suite here
      use: {
        ...devices['Pixel 5'],                   // mobile UA/viewport/touch
        browserName: 'chromium',
        locale: 'en-GB',
        timezoneId: 'Europe/London',
        geolocation: { longitude: -0.1276, latitude: 51.5072 },
        permissions: ['geolocation'],
      },
    },
    {
      name: 'desktop-chromium-uk',
      testMatch: /appearance\.spec\.js/, // only run the appearance suite here
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        locale: 'en-GB',
        timezoneId: 'Europe/London',
      },
    },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
