import type { FooterScene, SceneContext, SceneInstance, SceneLayout, SceneQuality, SceneTheme } from "../types.js";
import { clamp, mix, rgba, type RGB } from "../color.js";
import { mulberry32 } from "../random.js";
import { onIdle } from "../idle.js";

/**
 * Horizon: the footer is the sea and its top edge is the horizon. By day the sun rises as the
 * footer scrolls into view and clouds drift across the sky band; by night the moon rises and
 * stars come out. The sea itself is painted by CSS (so the CSS-only footer matches exactly);
 * the canvases add the sun, moon, sky, clouds and the shimmering reflection.
 *
 * Performance shape (see the benchmark notes in the CHANGELOG):
 *  - the sun/moon/sky canvas is redrawn only when something moved (scroll, theme, resize),
 *  - only the reflection, clouds and stars animate, at a reduced render scale and a capped frame rate,
 *  - nothing here runs unless the footer is on screen (the shell stops calling `render`).
 */
export type HorizonSceneOptions = {
  /** Horizontal position of the sun, 0..1 across the footer. Default 0.7. */
  sunX?: number;
  /** Horizontal position of the moon, 0..1 across the footer. Default 0.3. */
  moonX?: number;
  /** Star density, 0..2. Default 1. */
  stars?: number;
  /** Cloud density, 0..2. Default 1. */
  clouds?: number;
  /** Seed for star and cloud placement. Default 7. */
  seed?: number;
};

const FRAME_INTERVAL: Record<SceneQuality, number> = { high: 1 / 30, medium: 1 / 20, low: 1 / 12 };
const STAR_INTERVAL: Record<SceneQuality, number> = { high: 1 / 10, medium: 1 / 8, low: 1 / 5 };
/** Render scale (canvas pixels per CSS pixel) for the rarely redrawn sun/moon layer. */
const SKY_SCALE: Record<SceneQuality, number> = { high: 2, medium: 1, low: 1 };
/** Render scale for the layers that animate every frame. */
const ANIM_SCALE: Record<SceneQuality, number> = { high: 1, medium: 0.75, low: 0.5 };
/** Reflection row spacing in canvas pixels. */
const ROW_STEP: Record<SceneQuality, number> = { high: 1, medium: 1.5, low: 2 };

const SPRITE_COUNT = 6;
const STRETCH = 2.4; // reflection elongation
const WOBBLE = 1; // wave distortion of the reflection
const BANDING = 0.25; // 0 = smooth reflection column, 1 = broken into ripples

const ease = (x: number) => x * x * (3 - 2 * x);

type Palette = {
  key: string;
  sun: RGB;
  sunLight: RGB;
  core: RGB;
  moon: RGB;
  rim: RGB;
  body: RGB;
  bodyHi: RGB;
  under: RGB;
  warm: RGB;
};

type Sprite = { w: number; h: number; cool: HTMLCanvasElement; warm: HTMLCanvasElement };

function create(ctx: SceneContext): SceneInstance {
  const opts = ctx.options as HorizonSceneOptions;
  const sunX = clamp(opts.sunX ?? 0.7, 0.05, 0.95);
  const moonX = clamp(opts.moonX ?? 0.3, 0.05, 0.95);
  const starAmount = clamp(opts.stars ?? 1, 0, 2);
  const cloudAmount = clamp(opts.clouds ?? 1, 0, 2);
  const seed = opts.seed ?? 7;

  /* ---------- layers ---------- */
  const mustContext = (c: HTMLCanvasElement) => {
    const g = c.getContext("2d");
    if (!g) throw new Error("2D canvas is unavailable");
    return g;
  };
  const layer = () => {
    const c = document.createElement("canvas");
    c.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none";
    c.setAttribute("aria-hidden", "true");
    return c;
  };
  // Sky layers sit in a wrapper that fades out toward the top, so the sky melts into the page.
  const sky = document.createElement("div");
  sky.setAttribute("aria-hidden", "true");
  sky.style.cssText =
    "position:absolute;left:0;top:0;width:100%;overflow:hidden;pointer-events:none;" +
    "-webkit-mask-image:linear-gradient(to bottom,transparent,#000 45%);mask-image:linear-gradient(to bottom,transparent,#000 45%)";
  const starsC = layer();
  const skyC = layer();
  const cloudsC = layer();
  const waterC = layer();
  waterC.style.height = "0";
  sky.append(starsC, skyC, cloudsC);
  const bodyC = document.createElement("canvas"); // offscreen: sun, moon and their local glow (also the reflection source)
  const moonC = document.createElement("canvas");
  const stx = mustContext(starsC);
  const ktx = mustContext(skyC);
  const ctx2 = mustContext(cloudsC);
  const wtx = mustContext(waterC);
  const btx = mustContext(bodyC);
  ctx.host.append(sky, waterC);

  /* ---------- state ---------- */
  let q: SceneQuality = ctx.quality;
  let theme: SceneTheme = ctx.theme;
  let W = 0;
  let hz = 0; // horizon, CSS px from the top of the sky band
  let waterH = 0;
  let skyScale = 1;
  let animScale = 1;
  let R = 50;
  let Rm = 36;
  let moonSize = 0;
  let m = theme === "dark" ? 1 : 0; // 0 = day, 1 = night (smoothed)
  let mTarget = m;
  let p = 0; // smoothed reveal progress
  let targetP = 0;
  let lastDraw = -1;
  let lastStars = -1;
  let skyDirty = true;
  let paintedP = -1;
  let paintedM = -1;
  let destroyed = false;

  const readPalette = (): Palette => {
    const sun = ctx.readColor(["--nw-scene-sun", "--primary"], [255, 122, 26]);
    const secondary = ctx.readColor(["--secondary"], [110, 53, 106]);
    const moon = ctx.readColor(["--nw-scene-moon"], [236, 228, 255]);
    return {
      key: sun.join(",") + "|" + moon.join(","),
      sun,
      sunLight: mix(sun, [255, 214, 140], 0.55),
      core: [255, 240, 205],
      moon,
      rim: mix(sun, [150, 50, 0], 0.25),
      body: mix(sun, [255, 205, 160], 0.45),
      bodyHi: mix(sun, [255, 240, 225], 0.75),
      under: mix(sun, secondary, 0.3),
      warm: mix(sun, [255, 170, 90], 0.3),
    };
  };
  let palette = readPalette();

  /* ---------- stars, clouds, moon ---------- */
  type Star = { x: number; y: number; r: number; ph: number; sp: number; c: RGB };
  type Cloud = { x: number; yFrac: number; near: number; scale: number; flip: number; sprite: number; speed: number; a: number; keep: number };
  let stars: Star[] = [];
  let clouds: Cloud[] = [];
  const sprites: Sprite[] = [];
  let spriteScale = 0;
  let cancelSprite: (() => void) | undefined;

  const buildStars = () => {
    const r = mulberry32(seed);
    const n = Math.round((W * hz) / 1100); // pool for the max density; the option picks how many to draw
    stars = Array.from({ length: n }, () => {
      const roll = r();
      return {
        x: r(),
        y: Math.pow(r(), 1.2),
        r: r() < 0.08 ? 1.2 + r() * 0.7 : 0.4 + r() * 0.7,
        ph: r() * Math.PI * 2,
        sp: 0.4 + r() * 2,
        c: roll < 0.12 ? palette.sunLight : roll < 0.4 ? [210, 190, 255] : [255, 255, 255],
      };
    });
  };

  const buildClouds = () => {
    const r = mulberry32(seed + 1);
    const n = clamp(Math.round(W / 120), 6, 18);
    const bandScale = clamp(hz / 190, 0.6, 1.2);
    clouds = Array.from({ length: n }, () => {
      const yFrac = 0.08 + 0.72 * Math.pow(r(), 0.85);
      const near = 1 - yFrac / 0.8; // clouds near the horizon are far away: small, slow, warm
      return {
        x: r(),
        yFrac,
        near,
        scale: (0.35 + near * 0.7) * bandScale,
        flip: r() < 0.5 ? -1 : 1,
        sprite: Math.floor(r() * SPRITE_COUNT),
        speed: (3 + near * 14) * (0.7 + r() * 0.6),
        a: 0.55 + near * 0.4,
        keep: r(),
      };
    }).sort((a, b) => b.yFrac - a.yFrac); // far (low in the sky) first
  };

  const makeSprite = (index: number): Sprite => {
    const r = mulberry32(seed + 100 + index);
    const w = 240;
    const h = 100;
    const puffs: Array<[number, number, number]> = [];
    const nb = 4 + Math.floor(r() * 3);
    for (let i = 0; i < nb; i++) {
      const fx = 0.16 + 0.68 * (i / (nb - 1)) + (r() - 0.5) * 0.06;
      puffs.push([w * fx, h * 0.68, h * (0.17 + r() * 0.07)]);
    }
    const nt = 2 + Math.floor(r() * 3);
    for (let i = 0; i < nt; i++) {
      const fx = 0.32 + r() * 0.36;
      const rad = h * (0.3 + r() * 0.12) * (1 - Math.abs(fx - 0.5));
      puffs.push([w * fx, h * (0.46 + r() * 0.08), rad]);
    }
    const render = (body: RGB) => {
      const c = document.createElement("canvas");
      c.width = Math.round(w * animScale);
      c.height = Math.round(h * animScale);
      const x = mustContext(c);
      x.setTransform(animScale, 0, 0, animScale, 0, 0);
      // soft darker halo first...
      for (const [px, py, rad] of puffs) {
        const R2 = rad * 1.4;
        const g = x.createRadialGradient(px, py, rad * 0.6, px, py, R2);
        g.addColorStop(0, rgba(palette.rim, 0.32));
        g.addColorStop(0.7, rgba(palette.rim, 0.2));
        g.addColorStop(1, rgba(palette.rim, 0));
        x.fillStyle = g;
        x.beginPath();
        x.arc(px, py, R2, 0, Math.PI * 2);
        x.fill();
      }
      // ...then the feathered body, so the halo only shows at the edges
      for (const [px, py, rad] of puffs) {
        const R2 = rad * 1.2;
        const g = x.createRadialGradient(px, py, 0, px, py, R2);
        g.addColorStop(0, rgba(body, 0.6));
        g.addColorStop(0.65, rgba(body, 0.45));
        g.addColorStop(1, rgba(body, 0));
        x.fillStyle = g;
        x.beginPath();
        x.arc(px, py, R2, 0, Math.PI * 2);
        x.fill();
      }
      // sunlit tops, dusky undersides
      x.globalCompositeOperation = "source-atop";
      let g = x.createLinearGradient(0, h * 0.15, 0, h * 0.8);
      g.addColorStop(0, rgba(palette.bodyHi, 0.45));
      g.addColorStop(0.45, rgba(palette.bodyHi, 0));
      g.addColorStop(0.6, rgba(palette.under, 0));
      g.addColorStop(1, rgba(palette.under, 0.45));
      x.fillStyle = g;
      x.fillRect(0, 0, w, h);
      // feather the flat-ish bottom
      x.globalCompositeOperation = "destination-out";
      g = x.createLinearGradient(0, h * 0.72, 0, h * 0.95);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,1)");
      x.fillStyle = g;
      x.fillRect(0, h * 0.72, w, h * 0.28);
      return c;
    };
    return { w, h, cool: render(palette.body), warm: render(palette.warm) };
  };

  // One sprite per idle slice, so building them never blocks a frame.
  const scheduleSprites = () => {
    if (destroyed || cancelSprite || sprites.length >= SPRITE_COUNT) return;
    cancelSprite = onIdle(() => {
      cancelSprite = undefined;
      if (destroyed) return;
      sprites.push(makeSprite(sprites.length));
      scheduleSprites();
    });
  };

  const buildMoon = () => {
    moonSize = Math.ceil(Rm * 2 + 4);
    moonC.width = Math.round(moonSize * skyScale);
    moonC.height = Math.round(moonSize * skyScale);
    const c = mustContext(moonC);
    c.setTransform(skyScale, 0, 0, skyScale, 0, 0);
    c.clearRect(0, 0, moonSize, moonSize);
    const mid = moonSize / 2;
    const g = c.createRadialGradient(mid - Rm * 0.35, mid - Rm * 0.2, Rm * 0.1, mid, mid, Rm);
    g.addColorStop(0, "#fffaf2");
    g.addColorStop(1, rgba(palette.moon));
    c.fillStyle = g;
    c.beginPath();
    c.arc(mid, mid, Rm, 0, Math.PI * 2);
    c.fill();
    c.globalCompositeOperation = "destination-out";
    c.beginPath();
    c.arc(mid + Rm * 0.5, mid - Rm * 0.2, Rm * 0.9, 0, Math.PI * 2);
    c.fill();
    c.globalCompositeOperation = "source-over";
  };

  /* ---------- painting ---------- */
  // 0 when the body is fully under the water, easing up to 1 as it clears the horizon
  const aboveWater = (y: number, r: number) => ease(clamp((hz - (y - r)) / (2.4 * r), 0, 1));

  const paintSky = () => {
    const e = ease(p);
    const sunE = e * (1 - m);
    const moonE = e * m;
    const sunY = hz + R * 1.25 - sunE * R * 1.9;
    const moonY = hz + Rm * 1.3 - moonE * Rm * 2.8;
    const sunVis = aboveWater(sunY, R);
    const moonVis = aboveWater(moonY, Rm);
    const cx = W * sunX;
    const mx = W * moonX;

    // celestial bodies, offscreen
    btx.setTransform(skyScale, 0, 0, skyScale, 0, 0);
    btx.clearRect(0, 0, W, hz);
    if (sunE > 0.001 || sunVis > 0) {
      let g = btx.createRadialGradient(cx, sunY, R * 0.9, cx, sunY, R * 3.2);
      g.addColorStop(0, rgba(palette.sunLight, 0.45 * sunVis));
      g.addColorStop(1, rgba(palette.sun, 0));
      btx.fillStyle = g;
      btx.fillRect(cx - R * 3.2, sunY - R * 3.2, R * 6.4, R * 6.4);
      g = btx.createRadialGradient(cx, sunY - R * 0.25, R * 0.1, cx, sunY, R);
      g.addColorStop(0, rgba(palette.core));
      g.addColorStop(0.55, rgba(palette.sunLight));
      g.addColorStop(1, rgba(palette.sun));
      btx.fillStyle = g;
      btx.beginPath();
      btx.arc(cx, sunY, R, 0, Math.PI * 2);
      btx.fill();
    }
    if (moonE > 0.001 || moonVis > 0) {
      const g = btx.createRadialGradient(mx, moonY, Rm * 0.6, mx, moonY, Rm * 3);
      g.addColorStop(0, rgba(palette.moon, 0.22 * moonVis));
      g.addColorStop(1, rgba(palette.moon, 0));
      btx.fillStyle = g;
      btx.fillRect(mx - Rm * 3, moonY - Rm * 3, Rm * 6, Rm * 6);
      btx.drawImage(moonC, mx - moonSize / 2, moonY - moonSize / 2, moonSize, moonSize);
    }

    // visible sky: warm tint, flat glow hugging the horizon, then the bodies
    ktx.setTransform(skyScale, 0, 0, skyScale, 0, 0);
    ktx.clearRect(0, 0, W, hz);
    if (sunE > 0.001) {
      const g = ktx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, rgba(palette.sunLight, 0));
      g.addColorStop(1, rgba(palette.sunLight, 0.22 * sunE));
      ktx.fillStyle = g;
      ktx.fillRect(0, 0, W, hz);
      ktx.save();
      ktx.translate(cx, hz);
      ktx.scale(3.2, 1);
      const f = ktx.createRadialGradient(0, 0, 0, 0, 0, R * 3);
      f.addColorStop(0, rgba(palette.sunLight, 0.55 * sunE));
      f.addColorStop(0.5, rgba(palette.sun, 0.16 * sunE));
      f.addColorStop(1, rgba(palette.sun, 0));
      ktx.fillStyle = f;
      ktx.fillRect(-R * 3, -R * 3, R * 6, R * 3);
      ktx.restore();
    }
    if (moonE > 0.001) {
      const g = ktx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, rgba(palette.moon, 0));
      g.addColorStop(1, rgba(palette.moon, 0.07 * moonE));
      ktx.fillStyle = g;
      ktx.fillRect(0, 0, W, hz);
      ktx.save();
      ktx.translate(mx, hz);
      ktx.scale(3, 1);
      const f = ktx.createRadialGradient(0, 0, 0, 0, 0, Rm * 3);
      f.addColorStop(0, rgba(palette.moon, 0.16 * moonE));
      f.addColorStop(1, rgba(palette.moon, 0));
      ktx.fillStyle = f;
      ktx.fillRect(-Rm * 3, -Rm * 3, Rm * 6, Rm * 3);
      ktx.restore();
    }
    ktx.drawImage(bodyC, 0, 0, W, hz);
  };

  const paintStars = (t: number) => {
    stx.setTransform(animScale, 0, 0, animScale, 0, 0);
    stx.clearRect(0, 0, W, hz);
    const a = m * ease(p);
    if (a < 0.01 || starAmount <= 0) return;
    const count = Math.round((stars.length * starAmount) / 2);
    for (let i = 0; i < count; i++) {
      const s = stars[i];
      const tw = 0.55 + 0.45 * Math.sin(s.ph + t * s.sp);
      stx.fillStyle = rgba(s.c, tw * a);
      const x = s.x * W;
      const y = s.y * hz;
      if (s.r < 1) {
        stx.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2);
      } else {
        stx.beginPath();
        stx.arc(x, y, s.r, 0, Math.PI * 2);
        stx.fill();
      }
    }
  };

  const paintClouds = (t: number) => {
    ctx2.setTransform(animScale, 0, 0, animScale, 0, 0);
    ctx2.clearRect(0, 0, W, hz);
    const vis = (1 - m) * ease(clamp(p * 1.5, 0, 1));
    if (vis < 0.01 || !sprites.length || cloudAmount <= 0) return;
    const keep = cloudAmount / 2;
    const sunE = ease(p) * (1 - m);
    for (const c of clouds) {
      if (c.keep >= keep) continue;
      const spr = sprites[c.sprite % sprites.length];
      const sw = spr.w * c.scale;
      const sh = spr.h * c.scale * (0.85 + 0.15 * c.near);
      const y = c.yFrac * hz - sh * 0.5 - (1 - p) * 18 * c.near;
      const span = W + sw;
      const x = ((((c.x * span + t * c.speed) % span) + span) % span) - sw;
      const alpha = c.a * vis;
      if (c.flip < 0) ctx2.setTransform(-animScale, 0, 0, animScale, (x * 2 + sw) * animScale, 0);
      else ctx2.setTransform(animScale, 0, 0, animScale, 0, 0);
      ctx2.globalAlpha = alpha;
      ctx2.drawImage(spr.cool, x, y, sw, sh);
      // clouds low on the horizon catch the sunrise
      const warm = sunE * Math.pow(clamp((y + sh) / hz, 0, 1), 3);
      if (warm > 0.02) {
        ctx2.globalAlpha = alpha * warm;
        ctx2.drawImage(spr.warm, x, y, sw, sh);
      }
    }
    ctx2.globalAlpha = 1;
    ctx2.setTransform(animScale, 0, 0, animScale, 0, 0);
  };

  const paintWater = (t: number) => {
    wtx.setTransform(animScale, 0, 0, animScale, 0, 0);
    wtx.clearRect(0, 0, W, waterH);
    const e = ease(p);
    const sunE = e * (1 - m);
    const moonE = e * m;
    if ((sunE < 0.002 && moonE < 0.002) || waterH <= 0) return;

    // sunlit (or moonlit) water just below the horizon
    const lit = wtx.createLinearGradient(0, 0, 0, waterH * 0.45);
    lit.addColorStop(0, rgba(palette.sun, 0.2 * sunE));
    lit.addColorStop(1, rgba(palette.sun, 0));
    wtx.fillStyle = lit;
    wtx.fillRect(0, 0, W, waterH * 0.45);

    // reflections: flipped sky rows, stretched, wobbled, optionally banded
    const cols: Array<[number, number, RGB, number]> = [];
    if (sunE > 0.002) cols.push([W * sunX, R, palette.sunLight, sunE]);
    if (moonE > 0.002) cols.push([W * moonX, Rm, palette.moon, moonE]);
    const step = ROW_STEP[q] / animScale; // CSS px per drawn row
    for (const [cx, r] of cols) {
      const span = r * 6;
      const sx0 = Math.max(0, cx - span);
      const sw = Math.min(W, cx + span) - sx0;
      if (sw <= 0) continue;
      for (let d = 0; d < waterH; d += step) {
        const syTop = hz - 1 - (d + step) / STRETCH;
        if (syTop < 0) break;
        const k = d / waterH;
        const amp = (1 + d * 0.05) * WOBBLE;
        // incommensurate frequencies so the pattern never visibly repeats
        const dx =
          amp *
          (Math.sin(d * 0.11 - t * 1.7) +
            0.45 * Math.sin(d * 0.37 + t * 2.9) +
            0.25 * Math.sin(d * 0.83 - t * 4.3 + Math.sin(t * 0.5)));
        let band = 0.5 + 0.3 * Math.sin(d * 0.55 - t * 3.1 + Math.sin(d * 0.07 + t * 0.8) * 3) + 0.2 * Math.sin(d * 1.31 + t * 2.3);
        band *= band;
        const widen = 1 + k * 0.4;
        wtx.globalAlpha = (1 - BANDING + BANDING * band) * (1 - k * 0.7);
        wtx.drawImage(
          bodyC,
          sx0 * skyScale,
          syTop * skyScale,
          sw * skyScale,
          Math.max(1, (step / STRETCH) * skyScale),
          cx + (sx0 - cx) * widen + dx,
          d,
          sw * widen,
          step * 1.25,
        );
      }
    }
    wtx.globalAlpha = 1;

    // bright seam along the horizon
    for (const [cx, r, color, strength] of cols) {
      const span = r * 6;
      const g = wtx.createLinearGradient(cx - span, 0, cx + span, 0);
      g.addColorStop(0, rgba(color, 0));
      g.addColorStop(0.5, rgba(color, 0.7 * strength));
      g.addColorStop(1, rgba(color, 0));
      wtx.fillStyle = g;
      wtx.fillRect(cx - span, 0, span * 2, 1);
    }
  };

  /* ---------- instance ---------- */
  const size = (c: HTMLCanvasElement, w: number, h: number, scale: number) => {
    c.width = Math.max(1, Math.round(w * scale));
    c.height = Math.max(1, Math.round(h * scale));
  };

  const layout = (next: SceneLayout, quality: SceneQuality) => {
    q = quality;
    W = next.width;
    hz = next.horizon;
    waterH = Math.max(0, next.height - next.horizon);
    if (W <= 0 || hz <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    skyScale = Math.min(dpr, SKY_SCALE[q]);
    const prevAnim = animScale;
    animScale = Math.min(dpr, ANIM_SCALE[q]);
    sky.style.height = hz + "px";
    waterC.style.top = hz + "px";
    waterC.style.height = waterH + "px";
    size(skyC, W, hz, skyScale);
    size(bodyC, W, hz, skyScale);
    size(starsC, W, hz, animScale);
    size(cloudsC, W, hz, animScale);
    size(waterC, W, Math.max(1, waterH), animScale);
    R = Math.min(clamp(W * 0.07, 34, 72), hz / 1.8);
    Rm = R * 0.72;
    buildMoon();
    buildStars();
    buildClouds();
    if (prevAnim !== animScale || spriteScale !== animScale) {
      sprites.length = 0;
      spriteScale = animScale;
    }
    scheduleSprites();
    skyDirty = true;
    lastStars = -1;
  };
  layout(ctx.layout, ctx.quality);
  spriteScale = animScale;

  return {
    resize: layout,

    setTheme(next) {
      theme = next;
      mTarget = theme === "dark" ? 1 : 0;
      const fresh = readPalette();
      if (fresh.key !== palette.key) {
        palette = fresh;
        sprites.length = 0;
        if (W > 0 && hz > 0) {
          buildMoon();
          buildStars();
          scheduleSprites();
        }
      }
      skyDirty = true;
    },

    render(time, progress) {
      targetP = progress;
      if (destroyed || W <= 0 || hz <= 0) return;
      if (lastDraw >= 0 && time - lastDraw < FRAME_INTERVAL[q] - 0.003) return;
      const dt = lastDraw < 0 ? 0.016 : Math.min(0.25, time - lastDraw);
      lastDraw = time;

      p += (targetP - p) * (1 - Math.exp(-dt / 0.22));
      if (Math.abs(targetP - p) < 0.0005) p = targetP;
      m += (mTarget - m) * (1 - Math.exp(-dt / 0.3));
      if (Math.abs(mTarget - m) < 0.001) m = mTarget;

      if (skyDirty || p !== paintedP || m !== paintedM) {
        paintSky();
        paintedP = p;
        paintedM = m;
        skyDirty = false;
      }
      if (lastStars < 0 || time - lastStars >= STAR_INTERVAL[q]) {
        lastStars = time;
        paintStars(time);
      }
      paintClouds(time);
      paintWater(time);
    },

    destroy() {
      destroyed = true;
      cancelSprite?.();
      sky.remove();
      waterC.remove();
      sprites.length = 0;
    },
  };
}

export const scene: FooterScene = { create };
export default scene;
