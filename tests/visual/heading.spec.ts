import { test, expect } from "@playwright/test";

test.describe("Heading Component", () => {
  test("Level 1 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-heading--level1&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("heading-level1.png");
  });

  test("Level 2 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-heading--level2&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("heading-level2.png");
  });

  test("Level 3 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-heading--level3&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("heading-level3.png");
  });
});
