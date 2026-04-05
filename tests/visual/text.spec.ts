import { test, expect } from "@playwright/test";

test.describe("Text Component", () => {
  test("Basic text snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-text--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("text-basic.png");
  });
});
