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
  console.log('Waiting for export button to be enabled...');
  await page.waitForSelector('button:has-text("Export"):enabled', { timeout: 120000 }); // Increased timeout to 120 seconds
  console.log('Export button is enabled.');

  await exportButton.click();
  console.log('Export button clicked.');

  // Add assertions to check for download or other export behavior
  // For example, you can check if a download dialog appears or if a specific element is visible after export
  await page.waitForSelector('.processing', { timeout: 60000 }); // Wait for processing overlay to appear
  console.log('Processing overlay is visible.');

  await page.waitForSelector('.processing', { state: 'hidden', timeout: 60000 }); // Wait for processing overlay to disappear
  console.log('Processing overlay is hidden.');

  // Add more assertions as needed
});
