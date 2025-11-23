import { test, expect } from "@playwright/test";

test.describe("Container Component", () => {
  test("Directions story snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-container--directions&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("container-directions.png");
  });

  test("Spacing presets snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-container--spacing-presets&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("container-spacing-presets.png");
  });

  test("Colors and sizes snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-container--colors-and-sizes&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("container-colors-sizes.png");
  });
});
