const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  const title = page.locator('h1');
  await expect(title).toHaveText('Video Block Editor');
});
