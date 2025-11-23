import { test, expect } from "@playwright/test";

test.describe("Header Component", () => {
  test("Basic header snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-header--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("header-basic.png");
  });
});
