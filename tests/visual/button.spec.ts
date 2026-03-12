import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("Basic button snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-basic.png");
  });
});
