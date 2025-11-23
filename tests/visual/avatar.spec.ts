import { test, expect } from "@playwright/test";

test.describe("Avatar Component", () => {
  test("With initial snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-avatar--with-initial&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("avatar-initial.png");
  });

  test("Small size snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-avatar--small&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("avatar-small.png");
  });

  test("Large size snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-avatar--large&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("avatar-large.png");
  });
});
