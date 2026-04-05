import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test("Default footer", async ({ page }) => {
    await page.goto("/iframe.html?id=components-footer--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("footer-default.png");
  });
});
