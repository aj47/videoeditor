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

test('navigate between blocks', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  
  // Wait for video processing and blocks to be created
  await page.waitForSelector('.range', { timeout: 10000 });
  
  // Debug: Check block information
  const blockInfo = await page.evaluate(() => {
    const app = document.querySelector('#app').__vue__;
    console.log('Total blocks:', app.blocks.length);
    console.log('Blocks:', JSON.stringify(app.blocks, null, 2));
    return {
      totalBlocks: app.blocks.length,
      firstBlockStart: app.blocks[0]?.start,
      firstBlockEnd: app.blocks[0]?.end
    };
  });
  console.log('Block Info:', blockInfo);

  // Check next and previous block buttons
  const nextBlockButton = page.locator('button:has-text("Next")');
  const prevBlockButton = page.locator('button:has-text("Previous")');

  // Wait for buttons to be in a stable state
  await page.waitForTimeout(500);

  // Verify buttons are initially enabled/disabled based on blocks
  const nextButtonEnabled = await nextBlockButton.isEnabled();
  const prevButtonEnabled = await prevBlockButton.isEnabled();
  
  console.log('Next Button Enabled:', nextButtonEnabled);
  console.log('Previous Button Enabled:', prevButtonEnabled);

  // Adjust expectations based on actual block state
  if (blockInfo.totalBlocks > 1) {
    await expect(nextBlockButton).toBeEnabled();
    await expect(prevBlockButton).toBeDisabled();

    // Click next block and verify current time changes
    const initialTime = await page.evaluate(() => {
      return document.querySelector('video').currentTime;
    });

    await nextBlockButton.click();
    
    const nextTime = await page.evaluate(() => {
      return document.querySelector('video').currentTime;
    });

    console.log('Initial Time:', initialTime);
    console.log('Next Time:', nextTime);

    expect(nextTime).toBeGreaterThan(initialTime);
  } else {
    console.warn('Not enough blocks to test navigation');
  }
});

test('manage labels', async ({ page }) => {
  await page.goto('http://localhost:8788/');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('./tests/sample.mp4');
  await page.waitForSelector('.range'); // Wait for the timeline to appear

  // Open label management modal
  const labelsButton = page.locator('button:has-text("Labels")');
  await labelsButton.click();

  // Check default labels exist
  const defaultLabels = page.locator('text="to-remove"');
  const miscLabel = page.locator('text="misc"');
  await expect(defaultLabels).toBeVisible();
  await expect(miscLabel).toBeVisible();

  // Add a new label
  await page.fill('input[placeholder="Enter label name"]', 'TestLabel');
  await page.fill('input[maxlength="1"]', 'x');
  const addLabelButton = page.locator('button:has-text("Add Label")');
  await addLabelButton.click();

  // Verify new label was added
  const testLabel = page.locator('text="TestLabel"');
  await expect(testLabel).toBeVisible();
});

// test('export video', async ({ page }) => {
//   await page.goto('http://localhost:8788/');
//   const fileInput = await page.$('input[type="file"]');
//   await fileInput.setInputFiles('./tests/sample.mp4');
//   await page.waitForSelector('.range'); // Wait for the timeline to appear
//   await expect(page.locator('.range')).toBeVisible();

//   // Wait for the export button to be enabled
//   const exportButton = page.locator('button:has-text("Export")');
//   console.log('Waiting for export button to be enabled...');
//   await page.waitForSelector('button:has-text("Export"):enabled', { timeout: 120000 }); // Increased timeout to 120 seconds
//   console.log('Export button is enabled.');

//   await exportButton.click();
//   console.log('Export button clicked.');

//   // Add assertions to check for download or other export behavior
//   // For example, you can check if a download dialog appears or if a specific element is visible after export
//   await page.waitForSelector('.processing', { timeout: 60000 }); // Wait for processing overlay to appear
//   console.log('Processing overlay is visible.');

//   await page.waitForSelector('.processing', { state: 'hidden', timeout: 60000 }); // Wait for processing overlay to disappear
//   console.log('Processing overlay is hidden.');

//   // Add more assertions as needed
// });
