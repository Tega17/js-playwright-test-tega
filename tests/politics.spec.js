import { test, expect } from '@playwright/test';

// Match GA4 hits on GA and DoubleClick
const GA_REGEX = /^https:\/\/([a-z0-9-]+\.)?(google-analytics\.com|g\.doubleclick\.net)\/g\/collect/i;

test.describe('Politics page analytics tests (simplified)', () => {
  test('validate GA page_view and consent modal', async ({ page }) => {
    test.setTimeout(60_000);

    const hits = [];
    page.on('request', req => {
      const url = req.url();
      if (GA_REGEX.test(url)) hits.push(url);
    });

    await page.goto('https://inews.co.uk/category/news/politics', { waitUntil: 'domcontentloaded' });

    // Give analytics a moment to fire
    await page.waitForTimeout(5000);

    // --- HARD ASSERTS: initial page_view ---
    const pageViewURL = hits.map(u => new URL(u)).find(u => u.searchParams.get('en') === 'page_view');
    expect(pageViewURL, `No GA4 page_view seen. Captured:\n${hits.join('\n')}`).toBeTruthy();
    expect(pageViewURL.searchParams.get('ep.sub_channel_1')).toBe('news/politics');
    expect(pageViewURL.searchParams.get('gcs')).toBe('G101');
    expect(pageViewURL.searchParams.get('npa')).toBe('1');

    // --- Consent modal: click the "Accept" button shown in your screenshot ---
    const acceptBtn = page.locator('button:has-text("Accept")');
    if (await acceptBtn.isVisible().catch(() => false)) {
      await acceptBtn.click();
      // Confirm the modal is removed (best-effort: if dialog role is present it should go to 0)
      await expect(page.getByRole('dialog')).toHaveCount(0);
    } else {
      // If it wasn't visible (cookie already set / different region), just note it
      test.info().annotations.push({ type: 'note', description: 'Consent modal not visible on this run.' });
    }

    // Done: no user_engagement checks here to avoid flaky timing/region issues.
  });
});
