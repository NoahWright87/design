import { test, expect, type Page } from "@playwright/test";

const STORY = "/iframe.html?id=examples-scene-fireworks--shared-trigger&viewMode=story";
const FOOTER = ".nw-scene-footer";
const SKY = `${FOOTER}__stage canvas:not([data-renderer])`;
const WATER = `${FOOTER}__stage canvas[data-renderer]`;

async function open(page: Page, story = STORY) {
  // Make the default workflow consistent on CI machines with differing processor counts.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { value: 8 });
    // Read the WebGL result at draw time, before its non-preserved buffer is presented/cleared.
    const draw = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      draw.apply(this, args);
      const canvas = this.canvas as HTMLCanvasElement & { fireworkPixels?: number };
      if (canvas.dataset.renderer !== "webgl") return;
      const pixels = new Uint8Array(this.drawingBufferWidth * this.drawingBufferHeight * 4);
      this.readPixels(0, 0, this.drawingBufferWidth, this.drawingBufferHeight, this.RGBA, this.UNSIGNED_BYTE, pixels);
      let green = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 1] > pixels[i] * 1.6 && pixels[i + 1] > pixels[i + 2] * 1.35 && pixels[i + 3] > 20) green++;
      }
      canvas.fireworkPixels = green;
    };
  });
  await page.goto(story);
  await expect(page.locator(FOOTER)).toHaveAttribute("data-scene-state", "live");
  // Keep pixel reflection checks controlled; the demo itself defaults to the multicolor palette.
  await page.getByLabel("Explosion colors").selectOption("confirm");
}

async function greenPixels(page: Page, selector: string) {
  return page.locator(selector).evaluate((canvas: HTMLCanvasElement & { fireworkPixels?: number }) => {
    if (canvas.dataset.renderer === "webgl") return canvas.fireworkPixels ?? 0;
    const pixels = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
    let green = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 1] > pixels[i] * 1.6 && pixels[i + 1] > pixels[i + 2] * 1.35 && pixels[i + 3] > 20) green++;
    }
    return green;
  });
}

for (const renderer of ["2d", "webgl"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const width of [1280, 390]) {
      test(`fireworks reflect in ${renderer}, ${theme}, width ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 });
        await open(page);
        await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
        await page.getByLabel("Water renderer").selectOption(renderer);
        // Require the selected renderer: a missing WebGL context is a failure, not a silent skip.
        await expect(page.locator(WATER)).toHaveAttribute("data-renderer", renderer, { timeout: 15000 });
        await page.waitForTimeout(900);
        expect(await greenPixels(page, SKY)).toBe(0);
        expect(await greenPixels(page, WATER)).toBe(0);
        await page.getByRole("button", { name: "Larger celebration" }).click();
        await expect(page.locator("output")).toHaveText("Accepted");
        await page.waitForTimeout(2000);
        expect(await greenPixels(page, SKY)).toBeGreaterThan(20);
        expect(await greenPixels(page, WATER)).toBeGreaterThan(5);
        await page.locator(FOOTER).screenshot({ path: testInfo.outputPath("reflected-fireworks.png") });
        await expect(page.locator(`${FOOTER}__stage`)).toHaveAttribute("aria-hidden", "true");
        await expect(page.getByRole("link", { name: "Footer link" })).toBeVisible();
        await expect.poll(() => greenPixels(page, SKY), { timeout: 6500 }).toBe(0);
        await expect.poll(() => greenPixels(page, WATER)).toBe(0);
      });
    }
  }
}

test("repeated triggers overlap without replacing canvases or loading the scene again", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (/\/horizon[-.]/.test(request.url())) requests.push(request.url()); });
  await open(page);
  const sky = await page.locator(SKY).elementHandle();
  const water = await page.locator(WATER).elementHandle();
  const loaded = requests.length;
  await page.getByRole("button", { name: "Single burst" }).click();
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Accepted");
  await page.waitForTimeout(1800);
  expect(await greenPixels(page, SKY)).toBeGreaterThan(10);
  expect(await greenPixels(page, WATER)).toBeGreaterThan(3);
  expect(await sky!.evaluate((el) => el.isConnected)).toBe(true);
  expect(await water!.evaluate((el) => el.isConnected)).toBe(true);
  expect(requests.length).toBe(loaded);
});

test("offscreen delivery drops and active bursts clear without replay on return", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect.poll(() => greenPixels(page, SKY)).toBeGreaterThan(5);
  await page.locator(FOOTER).evaluate((footer: HTMLElement) => { footer.style.marginTop = "2000px"; });
  await expect.poll(() => greenPixels(page, SKY)).toBe(0);
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Dropped");
  await page.locator(FOOTER).evaluate((footer: HTMLElement) => { footer.style.marginTop = ""; });
  await page.waitForTimeout(500);
  expect(await greenPixels(page, SKY)).toBe(0);
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Accepted");
});

test("Still and unmount remove resources; a retained handle cannot deliver until remounted", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Single burst" }).click();
  await page.getByRole("button", { name: "Toggle Still" }).click();
  await expect(page.locator(`${FOOTER}__stage canvas`)).toHaveCount(0);
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Dropped");
  await page.getByRole("button", { name: "Toggle Still" }).click();
  await expect(page.locator(FOOTER)).toHaveAttribute("data-scene-state", "live");
  await page.getByRole("button", { name: "Unmount footer" }).click();
  await expect(page.locator(FOOTER)).toHaveCount(0);
  await page.getByRole("button", { name: "Larger celebration" }).click();
  await expect(page.locator("output")).toHaveText("Dropped");
  await page.getByRole("button", { name: "Mount footer" }).click();
  await expect(page.locator(FOOTER)).toHaveAttribute("data-scene-state", "live");
  await page.waitForTimeout(400);
  expect(await greenPixels(page, SKY)).toBe(0);
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Accepted");
});

test("animate=false and reduced motion reject fireworks without creating canvases", async ({ page }) => {
  await page.goto(STORY.replace("shared-trigger", "disabled"));
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Dropped");
  await expect(page.locator(`${FOOTER}__stage canvas`)).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(STORY);
  await expect(page.locator(FOOTER)).toHaveAttribute("data-scene-state", "static");
  await page.getByRole("button", { name: "Single burst" }).click();
  await expect(page.locator("output")).toHaveText("Dropped");
  await expect(page.locator(`${FOOTER}__stage canvas`)).toHaveCount(0);
  await page.getByLabel("Automatic fireworks").check();
  await page.waitForTimeout(600);
  await expect(page.locator(`${FOOTER}__stage canvas`)).toHaveCount(0);
});

async function vividHues(page: Page): Promise<number> {
  return page.locator(SKY).evaluate((canvas: HTMLCanvasElement) => {
    const pixels = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
    const bins = new Set<number>();
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b), chroma = max - min;
      if (pixels[i + 3] < 120 || chroma < 70) continue;
      const hue = (max === r ? (g - b) / chroma : max === g ? 2 + (b - r) / chroma : 4 + (r - g) / chroma) * 60;
      bins.add(Math.floor(((hue + 360) % 360) / 45));
    }
    return bins.size;
  });
}

for (const renderer of ["2d", "webgl"] as const) {
  test(`multicolor explosions and automatic mode in ${renderer}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 1100 });
    await open(page);
    await page.getByLabel("Water renderer").selectOption(renderer);
    await expect(page.locator(WATER)).toHaveAttribute("data-renderer", renderer, { timeout: 15000 });
    const originalSky = await page.locator(SKY).elementHandle();
    const originalWater = await page.locator(WATER).elementHandle();
    await page.getByLabel("Explosion colors").selectOption("multicolor");
    await page.getByRole("button", { name: "Larger celebration" }).click();
    await expect.poll(() => vividHues(page), { timeout: 6000 }).toBeGreaterThanOrEqual(5);
    await page.waitForTimeout(600);
    await page.locator(FOOTER).screenshot({ path: testInfo.outputPath("multicolor-fireworks.png") });
    await page.getByLabel("Launches per second").fill("4");
    await page.getByLabel("Automatic fireworks").check();
    await expect.poll(() => vividHues(page), { timeout: 6500 }).toBeGreaterThanOrEqual(5);
    await page.getByLabel("Launches per second").fill("2");
    expect(await originalSky!.evaluate((el) => el.isConnected)).toBe(true);
    expect(await originalWater!.evaluate((el) => el.isConnected)).toBe(true);
    await page.getByLabel("Automatic fireworks").uncheck();
    await page.waitForTimeout(6000);
    expect(await vividHues(page)).toBeLessThan(4);
    await page.getByLabel("Automatic fireworks").check();
    await expect.poll(() => vividHues(page), { timeout: 6500 }).toBeGreaterThanOrEqual(5);
    await page.locator(FOOTER).evaluate((footer: HTMLElement) => { footer.style.marginTop = "2000px"; });
    await expect.poll(() => vividHues(page)).toBeLessThan(4);
    await page.getByLabel("Automatic fireworks").uncheck();
    await page.locator(FOOTER).evaluate((footer: HTMLElement) => { footer.style.marginTop = ""; });
    await page.waitForTimeout(700);
    expect(await vividHues(page)).toBeLessThan(4);
  });
}
