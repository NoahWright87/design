import { test, expect } from "@playwright/test";

test.describe("Section Component", () => {
  test("Default section", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-default.png");
  });

  test("No gutters", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--no-gutters&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-no-gutters.png");
  });

  test("Small gutters", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--small-gutters&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-small-gutters.png");
  });

  test("Large gutters", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--large-gutters&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-large-gutters.png");
  });

  test("Primary background", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--primary-background&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-primary-bg.png");
  });

  test("Secondary background", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--secondary-background&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-secondary-bg.png");
  });

  test("With bottom border", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--with-bottom-border&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-border.png");
  });

  test("Complex section", async ({ page }) => {
    await page.goto("/iframe.html?id=components-section--complex-section&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("section-complex.png");
  });
});
