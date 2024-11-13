const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const title = page.locator('h1');
  await expect(title).toHaveText('Video Block Editor');
});

test('upload video', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await expect(page.locator('video')).toBeVisible();
});

test('process video', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await page.waitForSelector('.range'); // Wait for the timeline to appear
  await expect(page.locator('.range')).toBeVisible();
});

test('export video', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await page.waitForSelector('.range'); // Wait for the timeline to appear
  await expect(page.locator('.range')).toBeVisible();

  // Wait for the export button to be enabled
  const exportButton = page.locator('button:has-text("Export")');
  await exportButton.waitFor({ state: 'enabled' });

  await exportButton.click();
  // Add assertions to check for download or other export behavior
});
