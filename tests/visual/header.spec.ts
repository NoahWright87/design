import { test, expect } from "@playwright/test";

test.describe("Header Component", () => {
  test("Default header", async ({ page }) => {
    await page.goto("/iframe.html?id=components-header--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("header-default.png");
  });

  test("Custom nav items", async ({ page }) => {
    await page.goto("/iframe.html?id=components-header--custom-nav-items&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("header-custom-nav.png");
  });
});
