import { test, expect } from "@playwright/test";

test.describe("Ocean Component", () => {
  test("Default ocean", async ({ page }) => {
    await page.goto("/iframe.html?id=components-ocean--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("ocean-default.png");
  });

  test("Sunset variant", async ({ page }) => {
    await page.goto("/iframe.html?id=components-ocean--sunset&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("ocean-sunset.png");
  });

  test("Narrow size", async ({ page }) => {
    await page.goto("/iframe.html?id=components-ocean--narrow&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("ocean-narrow.png");
  });
});
