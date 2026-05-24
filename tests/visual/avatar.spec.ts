import { test, expect } from "@playwright/test";

test.describe("Avatar Component", () => {
  test("With initial snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-avatar--with-initial&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("avatar-initial.png");
  });

  test("Small size snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-avatar--small&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("avatar-small.png");
  });

  test("Large size snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-avatar--large&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("avatar-large.png");
  });

  test("Full name initials snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=components-molecules-avatar--with-full-name-initials&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#storybook-root")).toHaveScreenshot("avatar-full-name-initials.png");
  });
});
