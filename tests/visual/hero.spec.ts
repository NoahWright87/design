import { test, expect } from "@playwright/test";

test.describe("Hero Component", () => {
  test("Default hero", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hero--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hero-default.png");
  });

  test("Image on right", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hero--with-image-right&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hero-image-right.png");
  });

  test("Image on left", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hero--with-image-left&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hero-image-left.png");
  });

  test("Custom background", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hero--custom-background&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hero-custom-bg.png");
  });

  test("Without bottom border", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hero--without-border&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hero-no-border.png");
  });
});
