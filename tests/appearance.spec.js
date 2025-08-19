import { test, expect } from '@playwright/test';

test.describe('New Scientist dark/light mode tests', () => {
  test('should handle dark/light appearance correctly', async ({ page }) => {
    // Force dark scheme for first load
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('https://www.newscientist.com/', { waitUntil: 'load' });

    // <html> has class "Dark" after load
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('Dark'));
    expect(hasDark).toBeTruthy();

    // localStorage = "Dark"
    const darkValue = await page.evaluate(() => localStorage.getItem('colourSchemeAppearance'));
    expect(darkValue).toBe('Dark');

    // Dismiss consent modal (be tolerant to text variants / missing modal)
    const consentButton = page.getByRole('button', { name: /got it|accept|agree/i }).first();
    await consentButton.click({ trial: false }).catch(() => {});
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Toggle to Light
    await page.locator('#appearance-toggle').click();

    // Class switches to Light and removes Dark
    const classListAfter = await page.evaluate(() => Array.from(document.documentElement.classList));
    expect(classListAfter.includes('Light')).toBeTruthy();
    expect(classListAfter.includes('Dark')).toBeFalsy();

    // localStorage updated to "Light"
    const lightValue = await page.evaluate(() => localStorage.getItem('colourSchemeAppearance'));
    expect(lightValue).toBe('Light');

    // Refresh: Light persists after load
    await page.reload({ waitUntil: 'load' });
    const persistsLight = await page.evaluate(() => document.documentElement.classList.contains('Light'));
    expect(persistsLight).toBeTruthy();
  });
});
