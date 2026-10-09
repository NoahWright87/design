import { test, expect } from "@playwright/test";

for (const viewport of [{ name: 'desktop', width: 1280, height: 720 }, { name: 'mobile', width: 390, height: 844 }]) {
  test.describe(`Menu exit ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'no-preference' });
    test('Closing panel stays inert and can reopen', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story');
      const trigger = page.getByRole('button', { name: 'Account' });
      await trigger.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await trigger.click();
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 1000));
      await page.keyboard.press('Escape');
      const exiting = page.locator('.nw-menu__panel--closing');
      await expect(exiting).toHaveAttribute('inert', '');
      await expect(page.getByRole('menu')).toHaveCount(0);
      await exiting.evaluate(panel => {
        for (const animation of panel.getAnimations()) {
          animation.pause();
          animation.currentTime = 70;
        }
      });
      await expect(page).toHaveScreenshot(`menu-exit-${viewport.name}.png`, { animations: 'allow' });
      await trigger.click();
      await page.clock.fastForward(200);
      await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
      await page.keyboard.press('Escape');
      await page.clock.fastForward(200);
      await expect(page.locator('.nw-menu__panel')).toHaveCount(0);
    });
  });
}

test.describe("Menu Component", () => {
  test("With hamburger closed snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-menu--with-hamburger&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('#storybook-root')).toHaveScreenshot("menu-hamburger-closed.png");
  });

  test("With hamburger open snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-menu--with-hamburger&viewMode=story");
    await page.waitForLoadState("networkidle");

    // Click hamburger to open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await page.locator('[role="menu"]').waitFor({ state: "visible" });

    await expect(page).toHaveScreenshot("menu-hamburger-open.png");
  });

  test("Left aligned snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-menu--left-aligned&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('#storybook-root')).toHaveScreenshot("menu-left-aligned.png");
  });

  test("Disabled item snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-menu--with-disabled-item&viewMode=story");
    await page.waitForLoadState("networkidle");
    await page.locator('button[aria-label="Open menu"]').click();
    await page.locator('[role="menu"]').waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("menu-disabled-item.png");
  });
});
