import { test, expect } from "@playwright/test";

test.describe("Layout Component", () => {
  test("Layout with header and footer", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-layout--with-header-footer&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("layout-with-header-footer.png");
  });
});
