import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("Basic button", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-button--basic&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("button-basic.png");
  });

  test("Variants", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-button--variants&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("button-variants.png");
  });

  test("Sizes", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-button--sizes&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("button-sizes.png");
  });

  test("Disabled state", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-button--disabled&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("button-disabled.png");
  });
});
