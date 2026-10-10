import { test, expect, type Page } from "@playwright/test";

// Behavior tests for SceneFooter's loading contract. These assert network and state, not pixels,
// so they hold on any platform. The scene module is `horizon.ts` under the dev server and
// `horizon-<hash>.js` in a built Storybook; `horizonStatic` (the CSS-side helper) is part of the main bundle.
const STORY = (name: string) => `/iframe.html?id=components-organisms-scenefooter--${name}&viewMode=story`;
const isSceneRequest = (url: string) => /\/horizon(-[\w-]+)?\.(ts|js|mjs)(\?|$)/.test(url);

async function trackSceneRequests(page: Page) {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (isSceneRequest(r.url())) urls.push(r.url());
  });
  return urls;
}

const sceneState = (page: Page) =>
  page.evaluate(() => document.querySelector<HTMLElement>(".nw-scene-footer")?.dataset.sceneState ?? "unset");

const scrollToBottom = (page: Page) => page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

test.describe("SceneFooter loading contract", () => {
  test("does not load the scene while the footer is far away", async ({ page }) => {
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await page.waitForTimeout(1500);
    expect(requests).toHaveLength(0);
    expect(await sceneState(page)).toBe("unset");
  });

  test("loads the scene on approach and fills the stage", async ({ page }) => {
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await expect.poll(() => sceneState(page), { timeout: 10000 }).toBe("live");
    expect(requests.length).toBeGreaterThan(0);
    expect(await page.locator(".nw-scene-footer__stage canvas").count()).toBeGreaterThan(0);
  });

  test("css-only story never loads the scene", async ({ page }) => {
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("css-only"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await page.waitForTimeout(2000);
    expect(requests).toHaveLength(0);
    expect(await sceneState(page)).toBe("unset");
  });

  test("reduced motion keeps the css footer and loads nothing", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await page.waitForTimeout(2000);
    expect(requests).toHaveLength(0);
    expect(await sceneState(page)).toBe("static");
    await context.close();
  });

  test("a blocked scene request leaves the css footer in place", async ({ browser }) => {
    const context = await browser.newContext();
    await context.route((url) => isSceneRequest(url.toString()), (route) => route.abort());
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await expect.poll(() => sceneState(page), { timeout: 10000 }).toBe("failed");
    expect(errors).toHaveLength(0);
    await expect(page.locator(".nw-scene-footer__content")).toContainText("Noah Wright");
    await context.close();
  });
});
