import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("Primary variant", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--primary&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-primary.png");
  });

  test("Secondary variant", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--secondary&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-secondary.png");
  });

  test("Outline variant", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--outline&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-outline.png");
  });

  test("Small size", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--small&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-small.png");
  });

  test("Large size", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--large&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-large.png");
  });

  test("Disabled state", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--disabled&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-disabled.png");
  });
});
