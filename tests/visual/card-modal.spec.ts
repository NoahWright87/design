import { test, expect } from '@playwright/test';

test.describe('Card & Modal Components', () => {
  test('Card: default card renders', async ({ page }) => {
    await page.goto('/iframe.html?id=components-organisms-card--default&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-default.png');
  });

  test('Card: elevated card has shadow', async ({ page }) => {
    await page.goto('/iframe.html?id=components-organisms-card--elevated&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-elevated.png');
  });

  test('Card: image header renders', async ({ page }) => {
    await page.goto('/iframe.html?id=components-organisms-card--with-image&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-with-image.png');
  });

  test('Modal: modal opens and closes', async ({ page }) => {
    await page.goto('/iframe.html?id=components-organisms-modal--basic&viewMode=story');
    await page.waitForLoadState('networkidle');

    // Find and click the "Open Modal" button
    const openButton = page.locator('button:has-text("Open Modal")').first();
    await openButton.click();

    // Wait for modal to appear
    await page.waitForSelector('.nw-modal__container');
    const modal = page.locator('.nw-modal__container');
    await expect(modal).toBeVisible();
    await expect(page).toHaveScreenshot('modal-open.png');

    // Close by clicking the X button
    const closeButton = page.locator('.nw-modal__close-button');
    await closeButton.click();

    // Modal should be gone
    await expect(modal).not.toBeVisible();
  });

  test('Modal: custom actions are visible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-organisms-modal--custom-actions&viewMode=story');
    await page.waitForLoadState('networkidle');

    const openButton = page.locator('button:has-text("Open Modal")').first();
    await openButton.click();

    await page.waitForSelector('.nw-modal__actions');
    const actions = page.locator('.nw-modal__action');

    // Should have multiple action buttons
    await expect(actions).toHaveCount(2);
    await expect(page).toHaveScreenshot('modal-custom-actions.png');
  });
});
