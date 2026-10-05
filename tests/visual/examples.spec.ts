import { test, expect } from "@playwright/test";

for (const viewport of [{ name: 'desktop', width: 1280, height: 720 }, { name: 'mobile', width: 390, height: 844 }]) {
  test.describe(`Headers and Fonts ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });

    for (const story of ['roles', 'typefaces', 'comparison']) {
      test(`Fonts ${story} default and edited`, async ({ page }) => {
        await page.goto(`/iframe.html?id=examples-fonts--${story}&viewMode=story`);
        await page.getByLabel('Sample text').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`fonts-${story}-${viewport.name}.png`, { fullPage: true });
        await page.getByLabel('Sample text').fill('Readable type 2026');
        await expect(page.getByText('Readable type 2026', { exact: true }).first()).toBeVisible();
        await expect(page).toHaveScreenshot(`fonts-${story}-edited-${viewport.name}.png`, { fullPage: true });
        await page.getByLabel('Sample text').fill('');
        await expect(page.getByLabel('Sample text')).toHaveValue('');
        if (story === 'comparison') await expect(page.getByText('Noah Wright — Software builder', { exact: true })).toBeVisible();
        else await expect(page.getByText('Readable type 2026', { exact: true })).toHaveCount(0);
      });
    }

    test('Header routes and shortcuts', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story');
      await page.getByRole('heading', { name: 'Home', level: 2 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`header-home-${viewport.name}.png`);
      await page.keyboard.press('Alt+n');
      await expect(page.getByRole('menuitem', { name: 'Home' })).toBeFocused();
      await expect(page).toHaveScreenshot(`header-nav-${viewport.name}.png`);
      await page.getByRole('menuitem', { name: 'About' }).click();
      await expect(page).toHaveURL(/#about$/);
      await expect(page.getByRole('heading', { name: 'About', level: 2 })).toBeVisible();
      await expect(page).toHaveScreenshot(`header-about-${viewport.name}.png`);
      await page.reload();
      await expect(page.getByRole('heading', { name: 'About', level: 2 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.keyboard.press('Alt+a');
      await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
      await expect(page).toHaveScreenshot(`header-account-${viewport.name}.png`);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Account' })).toBeFocused();
      await expect(page.getByRole('menu')).toHaveCount(0);
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story#home');
      await page.keyboard.press('Alt+n');
      await page.getByRole('menuitem', { name: 'Services' }).click();
      await expect(page.getByRole('heading', { name: 'Services', level: 2 })).toBeVisible();
      await page.goBack();
      await expect(page.getByRole('heading', { name: 'Home', level: 2 })).toBeVisible();
      await page.goForward();
      await expect(page.getByRole('heading', { name: 'Services', level: 2 })).toBeVisible();
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story#unknown');
      await expect(page.getByRole('heading', { name: 'Home', level: 2 })).toBeVisible();
    });

    test('Header drawer', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-header-responsive--navigation-drawer&viewMode=story');
      const trigger = page.getByRole('button', { name: 'Open navigation drawer' });
      await trigger.click();
      const drawer = page.getByRole('dialog', { name: 'Navigation drawer' });
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Shift+Tab');
      await expect(drawer.getByRole('button', { name: 'Contact', exact: true })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(drawer.getByRole('button', { name: 'Close navigation drawer' })).toBeFocused();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`header-drawer-${viewport.name}.png`);
      await drawer.getByRole('button', { name: 'Contact', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expect(drawer).toBeVisible();
      await drawer.getByRole('button', { name: 'Close navigation drawer' }).click();
      await expect(drawer).not.toBeVisible();
      await trigger.click();
      await expect(drawer).toBeVisible();
      await page.mouse.click(viewport.width - 10, viewport.height - 10);
      await expect(drawer).not.toBeVisible();
      await expect(page).toHaveScreenshot(`header-drawer-contact-${viewport.name}.png`);
      await trigger.click();
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(drawer).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  });
}

test.describe("Example Pages", () => {
  test("Colors page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-colors--color-grid&viewMode=story");
    await page.waitForLoadState("networkidle");
    
    // Wait for colors to be computed and rendered
    await page.locator('h1:has-text("Theme colors")').waitFor({ state: "visible" });
    
    await expect(page).toHaveScreenshot("example-colors.png", {
      fullPage: true
    });
  });

  test("Header integration - standard app snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--standard-app-header&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-standard.png", {
      fullPage: true
    });
  });

  test("Header integration - minimal portfolio snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--minimal-portfolio&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-portfolio.png");
  });

  test("Showcase page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-showcase--page&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-showcase.png", {
      fullPage: true
    });
  });
});
