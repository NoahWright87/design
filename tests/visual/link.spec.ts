import { test, expect } from "@playwright/test";

test.describe("Link Component", () => {
  test("Basic link snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-link--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("link-basic.png");
  });

  test("Affiliate disclosure prompt appears", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-link--affiliate-disclosure&viewMode=story");
    await page.waitForLoadState("networkidle");

    page.once("dialog", async dialog => {
      expect(dialog.message()).toContain("affiliate link");
      await dialog.dismiss();
    });

    await page.getByRole("link", { name: "Affiliate link with disclosure prompt" }).click();
  });
});
