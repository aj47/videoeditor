const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  const title = page.locator('h1');
  await expect(title).toHaveText('Video Block Editor');
});

test('upload video', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await expect(page.locator('video')).toBeVisible();
});

test('process video', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await page.waitForSelector('.range'); // Wait for the timeline to appear
  await expect(page.locator('.range')).toBeVisible();
});

test('export video', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await page.waitForSelector('.range'); // Wait for the timeline to appear
  await page.click('button:has-text("Export")');
  // Add assertions to check for download or other export behavior
});
