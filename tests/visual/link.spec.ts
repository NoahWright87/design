import { test, expect } from "@playwright/test";

test.describe("Link Component", () => {
  test("Basic link snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-link--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("link-basic.png");
  });
});
