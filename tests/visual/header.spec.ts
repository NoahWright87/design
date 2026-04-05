import { test, expect } from "@playwright/test";

test.describe("Header Component", () => {
  test("Basic header", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-header--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("header-basic.png");
  });

  test("With labels", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-header--with-labels&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("header-with-labels.png");
  });
});
