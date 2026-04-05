import { test, expect } from "@playwright/test";

test.describe("Heading Component", () => {
  test("Level 1 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-heading--h-1&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("heading-level1.png");
  });

  test("Level 2 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-heading--h-2&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("heading-level2.png");
  });

  test("Level 3 heading", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-heading--h-3&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("heading-level3.png");
  });
});
