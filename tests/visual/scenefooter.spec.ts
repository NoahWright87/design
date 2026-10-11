import { test, expect, type Page } from "@playwright/test";

// Behavior tests for SceneFooter's loading contract. These assert network and state, not pixels,
// so they hold on any platform. The scene module is `horizon.ts` under the dev server and
// `horizon-<hash>.js` in a built Storybook; `horizonStatic` (the CSS-side helper) is part of the main bundle.
const STORY = (name: string) => `/iframe.html?id=components-organisms-scenefooter--${name}&viewMode=story`;
const isSceneRequest = (url: string) => /\/horizon(-[\w-]+)?\.(ts|js|mjs)(\?|$)/.test(url);
// The WebGL water renderer is its own chunk: `horizonGl.ts` under the dev server, `horizonGl-<hash>.js` when built.
const isGlRequest = (url: string) => /\/horizonGl(-[\w-]+)?\.(ts|js|mjs)(\?|$)/.test(url);

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

  test("reduced motion switched on before the scene loads keeps it from ever loading", async ({ page }) => {
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    expect(requests).toHaveLength(0); // footer is still far away
    await page.emulateMedia({ reducedMotion: "reduce" });
    await scrollToBottom(page);
    await page.waitForTimeout(2500);
    expect(requests).toHaveLength(0);
    expect(await sceneState(page)).toBe("static");
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

test.describe("SceneFooter water renderer", () => {
  const rendererOf = (page: Page) =>
    page.evaluate(() => document.querySelector<HTMLElement>(".nw-scene-footer__stage canvas[data-renderer]")?.dataset.renderer ?? "none");

  test("the flat mirror never loads the WebGL code", async ({ page }) => {
    const glRequests: string[] = [];
    page.on("request", (r) => isGlRequest(r.url()) && glRequests.push(r.url()));
    await page.goto(STORY("horizon-flat-mirror"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await expect.poll(() => sceneState(page), { timeout: 10000 }).toBe("live");
    expect(await rendererOf(page)).toBe("2d");
    expect(glRequests).toHaveLength(0);
  });

  test("forced WebGL renders through the shader when the browser has WebGL", async ({ page }) => {
    await page.goto(STORY("horizon-webgl"));
    await page.waitForSelector(".nw-scene-footer");
    const hasWebgl = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl"));
    test.skip(!hasWebgl, "this browser has no WebGL");
    await scrollToBottom(page);
    await expect.poll(() => rendererOf(page), { timeout: 15000 }).toBe("webgl");
  });

  test("a browser without WebGL keeps the flat mirror and raises no errors", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      // @ts-expect-error: deliberately refuse WebGL contexts
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
        // @ts-expect-error: pass through
        return original.call(this, type, ...rest);
      };
    });
    const page = await context.newPage();
    const errors: string[] = [];
    const glRequests: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => isGlRequest(r.url()) && glRequests.push(r.url()));
    await page.goto(STORY("horizon-webgl")); // even when WebGL is forced
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await expect.poll(() => sceneState(page), { timeout: 10000 }).toBe("live");
    await page.waitForTimeout(1500);
    expect(await rendererOf(page)).toBe("2d");
    expect(errors).toHaveLength(0);
    expect(glRequests).toHaveLength(0); // the WebGL code is never downloaded when there is no WebGL
    await context.close();
  });

  test("a software-rendered WebGL context counts as no WebGL for auto, but can still be forced", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const original = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (this: WebGLRenderingContext, parameter: number) {
        if (parameter === 0x9246) return "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)";
        return original.call(this, parameter);
      };
    });
    const hasWebgl = await (await context.newPage()).evaluate(() => !!document.createElement("canvas").getContext("webgl"));
    test.skip(!hasWebgl, "this browser has no WebGL to disguise");

    const auto = await context.newPage();
    const glRequests: string[] = [];
    auto.on("request", (r) => isGlRequest(r.url()) && glRequests.push(r.url()));
    await auto.goto(STORY("horizon"));
    await auto.waitForSelector(".nw-scene-footer");
    await scrollToBottom(auto);
    await expect.poll(() => sceneState(auto), { timeout: 10000 }).toBe("live");
    await auto.waitForTimeout(1500);
    expect(await rendererOf(auto)).toBe("2d");
    expect(glRequests).toHaveLength(0);

    const forced = await context.newPage();
    await forced.goto(STORY("horizon-webgl"));
    await forced.waitForSelector(".nw-scene-footer");
    await scrollToBottom(forced);
    await expect.poll(() => rendererOf(forced), { timeout: 15000 }).toBe("webgl");
    await context.close();
  });
});

test.describe("SceneFooter reader override (footer style)", () => {
  const rendererOf = (page: Page) =>
    page.evaluate(() => document.querySelector<HTMLElement>(".nw-scene-footer__stage canvas[data-renderer]")?.dataset.renderer ?? "none");
  const setStyle = (page: Page, style: string) => page.evaluate((v) => { document.documentElement.dataset.footerStyle = v; }, style);

  test("a stored 'static' choice keeps the scene from ever loading", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => { try { localStorage.setItem("nw-footer-style", "static"); } catch {} });
    const page = await context.newPage();
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await scrollToBottom(page);
    await page.waitForTimeout(2500);
    expect(requests).toHaveLength(0);
    expect(["unset", "static"]).toContain(await sceneState(page));
    await context.close();
  });

  test("'flat' overrides a site that asked for the css-only footer, without WebGL code", async ({ page }) => {
    const glRequests: string[] = [];
    page.on("request", (r) => isGlRequest(r.url()) && glRequests.push(r.url()));
    await page.goto(STORY("css-only")); // the site said animate={false}
    await page.waitForSelector(".nw-scene-footer");
    await setStyle(page, "flat");
    await scrollToBottom(page);
    await expect.poll(() => sceneState(page), { timeout: 10000 }).toBe("live");
    expect(await rendererOf(page)).toBe("2d");
    expect(glRequests).toHaveLength(0);
  });

  test("switching styles while the footer is live swaps the renderer", async ({ page }) => {
    await page.goto(STORY("horizon-flat-mirror"));
    await page.waitForSelector(".nw-scene-footer");
    const hasWebgl = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl"));
    await scrollToBottom(page);
    await expect.poll(() => rendererOf(page), { timeout: 10000 }).toBe("2d");

    if (hasWebgl) {
      await setStyle(page, "animated");
      await expect.poll(() => rendererOf(page), { timeout: 15000 }).toBe("webgl");
    }
    await setStyle(page, "static");
    await expect.poll(() => page.locator(".nw-scene-footer__stage canvas").count(), { timeout: 5000 }).toBe(0);
    await setStyle(page, "flat");
    await expect.poll(() => rendererOf(page), { timeout: 10000 }).toBe("2d");
  });

  test("reduced motion still wins over an explicit 'animated' choice", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const requests = await trackSceneRequests(page);
    await page.goto(STORY("horizon"));
    await page.waitForSelector(".nw-scene-footer");
    await setStyle(page, "animated");
    await scrollToBottom(page);
    await page.waitForTimeout(2500);
    expect(requests).toHaveLength(0);
    expect(await sceneState(page)).toBe("static");
    await context.close();
  });
});
