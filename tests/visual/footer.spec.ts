import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test("Basic footer", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-footer--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("footer-basic.png");
  });
});
