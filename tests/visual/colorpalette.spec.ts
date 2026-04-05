import { test, expect } from "@playwright/test";

test.describe("ColorPalette Component", () => {
  test("Default color palette", async ({ page }) => {
    await page.goto("/iframe.html?id=design-system-colors--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("colorpalette-default.png", {
      fullPage: true,
    });
  });
});
