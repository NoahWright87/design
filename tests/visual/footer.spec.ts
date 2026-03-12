import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test("Basic footer snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-footer--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("footer-basic.png");
  });
});
