import { test, expect } from "@playwright/test";

test.describe("Container Component", () => {
  test("Directions story snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-container--directions&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("container-directions.png");
  });

  test("Spacing presets snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-container--spacing-presets&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("container-spacing-presets.png");
  });

  test("Colors and sizes snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-container--colors-and-sizes&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("container-colors-sizes.png");
  });

  test("Parallax background snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-container--parallax-background&viewMode=story");
    await page.waitForLoadState("networkidle");
    const container = page.locator(".nw-container").first();
    await expect(container).toHaveCSS("background-image", /data:image\/svg\+xml/i);
    await expect(container).toHaveCSS("background-attachment", "fixed");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("container-parallax-background.png");
  });

  test("Background image story applies image", async ({ page }) => {
    await page.goto("/iframe.html?id=components-organisms-container--background-image&viewMode=story");
    await page.waitForLoadState("networkidle");
    const container = page.locator(".nw-container").first();
    await expect(container).toHaveCSS("background-image", /data:image\/svg\+xml/i);
    await expect(page.locator("#storybook-root")).toHaveScreenshot("container-background-image.png");
  });
});
