import { test, expect } from "@playwright/test";

test.describe("HamburgerMenu Component", () => {
  test("Closed state", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hamburgermenu--closed&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hamburger-closed.png");
  });

  test("Open state", async ({ page }) => {
    await page.goto("/iframe.html?id=components-hamburgermenu--open&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("hamburger-open.png");
  });
});
