import { test, expect } from "@playwright/test";

test.describe("Menu Component", () => {
  test("With hamburger closed snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-menu--with-hamburger&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("menu-hamburger-closed.png");
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
    await expect(page).toHaveScreenshot("menu-left-aligned.png");
  });
});
