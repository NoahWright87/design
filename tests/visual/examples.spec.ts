import { test, expect } from "@playwright/test";

test.describe("Example Pages", () => {
  test("Colors page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-colors--color-grid&viewMode=story");
    await page.waitForLoadState("networkidle");
    
    // Wait for colors to be computed and rendered
    await page.locator('h1:has-text("Theme colors")').waitFor({ state: "visible" });
    
    await expect(page).toHaveScreenshot("example-colors.png", {
      fullPage: true
    });
  });

  test("Header integration - standard app snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--standard-app-header&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-standard.png", {
      fullPage: true
    });
  });

  test("Header integration - minimal portfolio snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--minimal-portfolio&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-portfolio.png");
  });

  test("Showcase page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-showcase--page&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-showcase.png", {
      fullPage: true
    });
  });
});
