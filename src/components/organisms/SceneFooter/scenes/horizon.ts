import type { FooterScene, SceneContext, SceneInstance, SceneLayout, SceneQuality, SceneTheme } from "../types.js";
import { clamp, mix, rgba, type RGB } from "../color.js";
import { mulberry32 } from "../random.js";
import { onIdle } from "../idle.js";
import { canvasStyle, makeMirror2d, type FrameState, type Water } from "./horizonWater.js";

/**
 * Horizon: the footer is a sea and its top edge is the horizon. By day the sun rises as the
 * footer scrolls into view and clouds drift across the sky band; by night the moon rises and
 * stars come out. The sea itself is painted by CSS (so the CSS-only footer matches exactly).
 *
 * How it draws:
 *  - Everything in the sky (stars, sun, moon, glow, clouds, anything added later) is painted onto
 *    ONE surface, the sky canvas, which is also what the reader sees in the sky band.
 *  - A water renderer mirrors that finished surface into the sea, so everything in the sky is
 *    reflected, exactly once. With WebGL available it ripples the mirror in a shader; otherwise a
 *    flat 2D mirror does the job. A device that cannot do WebGL well never loads the WebGL code.
 *  - The expensive sun/moon/glow layer is repainted only when something moves (scroll, theme,
 *    resize); stars and clouds are drawn on top each frame, at a capped frame rate.
 *  - Nothing here runs unless the footer is on screen (the shell stops calling `render`).
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
  /**
   * `"auto"` (default) uses the WebGL ripple on capable devices and the flat 2D mirror elsewhere.
   * `"2d"` never loads WebGL. `"webgl"` forces WebGL, even if software-rendered (for testing).
   */
  renderer?: "auto" | "webgl" | "2d";
};

const FRAME_INTERVAL: Record<SceneQuality, number> = { high: 1 / 30, medium: 1 / 20, low: 1 / 12 };
/** Render scale (canvas pixels per CSS pixel) of the sky surface. */
const SKY_SCALE: Record<SceneQuality, number> = { high: 1.5, medium: 1, low: 0.75 };
/** Render scale of the water; it is soft by nature, so it can be lower. */
const WATER_SCALE: Record<SceneQuality, number> = { high: 1, medium: 0.75, low: 0.5 };

const SPRITE_COUNT = 6;

/**
 * Whether this browser can give us a hardware-accelerated WebGL context. Checked with a throwaway
 * context before any WebGL code is downloaded, so devices that cannot use it never fetch it.
 */
function canUseWebgl(allowSoftware: boolean): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl", {
      depth: false,
      stencil: false,
      antialias: false,
      failIfMajorPerformanceCaveat: !allowSoftware,
    }) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Some browsers accept a software renderer even with the performance-caveat flag; a rippled
    // reflection drawn by the CPU is slower than the flat mirror, so treat those as "no WebGL".
    let software = false;
    if (!allowSoftware) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !software;
  } catch {
    return false;
  }
}
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
  const sunFrac = clamp(opts.sunX ?? 0.7, 0.05, 0.95);
  const moonFrac = clamp(opts.moonX ?? 0.3, 0.05, 0.95);
  const starAmount = clamp(opts.stars ?? 1, 0, 2);
  const cloudAmount = clamp(opts.clouds ?? 1, 0, 2);
  const seed = opts.seed ?? 7;
  const rendererOption = opts.renderer === "2d" || opts.renderer === "webgl" ? opts.renderer : "auto";

  /* ---------- surfaces ---------- */
  const mustContext = (c: HTMLCanvasElement) => {
    const g = c.getContext("2d");
    if (!g) throw new Error("2D canvas is unavailable");
    return g;
  };
  // The sky canvas sits in a wrapper that fades out toward the top, so the sky melts into the page.
  const skyWrap = document.createElement("div");
  skyWrap.setAttribute("aria-hidden", "true");
  skyWrap.style.cssText =
    "position:absolute;left:0;top:0;width:100%;overflow:hidden;pointer-events:none;" +
    "-webkit-mask-image:linear-gradient(to bottom,transparent,#000 45%);mask-image:linear-gradient(to bottom,transparent,#000 45%)";
  const skyC = document.createElement("canvas");
  skyC.style.cssText = canvasStyle + ";top:0;height:100%";
  skyC.setAttribute("aria-hidden", "true");
  skyWrap.append(skyC);
  const staticC = document.createElement("canvas"); // offscreen: tint, glows, sun, moon
  const moonC = document.createElement("canvas"); // offscreen: the crescent sprite
  const sky = mustContext(skyC);
  const still = mustContext(staticC);
  ctx.host.append(skyWrap);

  /* ---------- state ---------- */
  let q: SceneQuality = ctx.quality;
  let theme: SceneTheme = ctx.theme;
  let W = 0;
  let hz = 0; // horizon: height of the sky band, CSS px
  let waterH = 0;
  let skyScale = 1;
  let waterScale = 1;
  let R = 50;
  let Rm = 36;
  let moonSize = 0;
  let m = theme === "dark" ? 1 : 0; // 0 = day, 1 = night (smoothed)
  let mTarget = m;
  let p = 0; // smoothed reveal progress
  let targetP = 0;
  let lastDraw = -1;
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

  // what the water renderer needs; refreshed whenever the still layer is repainted
  const frame: FrameState = {
    width: 0,
    horizon: 0,
    waterHeight: 0,
    sunE: 0,
    moonE: 0,
    sunX: 0,
    moonX: 0,
    sunR: 0,
    moonR: 0,
    sun: palette.sun,
    sunLight: palette.sunLight,
    moon: palette.moon,
  };

  /* ---------- water renderer: WebGL ripple when it is worth it, flat 2D mirror otherwise ---------- */
  let water: Water = makeMirror2d();
  ctx.host.append(water.el);
  let glState: "idle" | "loading" | "ready" | "unavailable" = rendererOption === "2d" ? "unavailable" : "idle";
  let glFactory: ((o: { allowSoftware?: boolean; onLost?: () => void }) => Water | null) | undefined;

  const useWater = (next: Water) => {
    const prev = water;
    next.el.style.top = hz + "px";
    next.el.style.height = waterH + "px";
    prev.el.replaceWith(next.el);
    prev.destroy();
    water = next;
    if (W > 0 && waterH > 0) water.resize(W, waterH, waterScale);
  };

  const tryGl = () => {
    if (destroyed || water.kind === "webgl" || glState === "unavailable" || q === "low") return;
    if (glFactory) {
      const gl = glFactory({
        allowSoftware: rendererOption === "webgl",
        onLost: () => {
          if (destroyed) return;
          glState = "unavailable";
          if (water.kind === "webgl") useWater(makeMirror2d());
        },
      });
      if (gl) useWater(gl);
      else glState = "unavailable";
      return;
    }
    if (glState === "loading") return;
    if (!canUseWebgl(rendererOption === "webgl")) {
      glState = "unavailable";
      return;
    }
    glState = "loading";
    import("./horizonGl.js")
      .then((mod) => {
        if (destroyed) return;
        glFactory = mod.createGlWater;
        glState = "ready";
        tryGl();
      })
      .catch(() => {
        glState = "unavailable";
      });
  };

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
      c.width = Math.round(w * skyScale);
      c.height = Math.round(h * skyScale);
      const x = mustContext(c);
      x.setTransform(skyScale, 0, 0, skyScale, 0, 0);
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

  /** The layer that only changes when something moves: warm tint, horizon glow, sun and moon. */
  const paintStill = () => {
    const e = ease(p);
    const sunE = e * (1 - m);
    const moonE = e * m;
    const sunY = hz + R * 1.25 - sunE * R * 1.9;
    const moonY = hz + Rm * 1.3 - moonE * Rm * 2.8;
    const sunVis = aboveWater(sunY, R);
    const moonVis = aboveWater(moonY, Rm);
    const cx = W * sunFrac;
    const mx = W * moonFrac;

    still.setTransform(skyScale, 0, 0, skyScale, 0, 0);
    still.clearRect(0, 0, W, hz);

    if (sunE > 0.001) {
      const g = still.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, rgba(palette.sunLight, 0));
      g.addColorStop(1, rgba(palette.sunLight, 0.22 * sunE));
      still.fillStyle = g;
      still.fillRect(0, 0, W, hz);
      still.save();
      still.translate(cx, hz);
      still.scale(3.2, 1);
      const f = still.createRadialGradient(0, 0, 0, 0, 0, R * 3);
      f.addColorStop(0, rgba(palette.sunLight, 0.55 * sunE));
      f.addColorStop(0.5, rgba(palette.sun, 0.16 * sunE));
      f.addColorStop(1, rgba(palette.sun, 0));
      still.fillStyle = f;
      still.fillRect(-R * 3, -R * 3, R * 6, R * 3);
      still.restore();
    }
    if (moonE > 0.001) {
      const g = still.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, rgba(palette.moon, 0));
      g.addColorStop(1, rgba(palette.moon, 0.07 * moonE));
      still.fillStyle = g;
      still.fillRect(0, 0, W, hz);
      still.save();
      still.translate(mx, hz);
      still.scale(3, 1);
      const f = still.createRadialGradient(0, 0, 0, 0, 0, Rm * 3);
      f.addColorStop(0, rgba(palette.moon, 0.16 * moonE));
      f.addColorStop(1, rgba(palette.moon, 0));
      still.fillStyle = f;
      still.fillRect(-Rm * 3, -Rm * 3, Rm * 6, Rm * 3);
      still.restore();
    }
    if (sunE > 0.001 || sunVis > 0) {
      let g = still.createRadialGradient(cx, sunY, R * 0.9, cx, sunY, R * 3.2);
      g.addColorStop(0, rgba(palette.sunLight, 0.45 * sunVis));
      g.addColorStop(1, rgba(palette.sun, 0));
      still.fillStyle = g;
      still.fillRect(cx - R * 3.2, sunY - R * 3.2, R * 6.4, R * 6.4);
      g = still.createRadialGradient(cx, sunY - R * 0.25, R * 0.1, cx, sunY, R);
      g.addColorStop(0, rgba(palette.core));
      g.addColorStop(0.55, rgba(palette.sunLight));
      g.addColorStop(1, rgba(palette.sun));
      still.fillStyle = g;
      still.beginPath();
      still.arc(cx, sunY, R, 0, Math.PI * 2);
      still.fill();
    }
    if (moonE > 0.001 || moonVis > 0) {
      const g = still.createRadialGradient(mx, moonY, Rm * 0.6, mx, moonY, Rm * 3);
      g.addColorStop(0, rgba(palette.moon, 0.22 * moonVis));
      g.addColorStop(1, rgba(palette.moon, 0));
      still.fillStyle = g;
      still.fillRect(mx - Rm * 3, moonY - Rm * 3, Rm * 6, Rm * 6);
      still.drawImage(moonC, mx - moonSize / 2, moonY - moonSize / 2, moonSize, moonSize);
    }

    frame.width = W;
    frame.horizon = hz;
    frame.waterHeight = waterH;
    frame.sunE = sunE;
    frame.moonE = moonE;
    frame.sunX = cx;
    frame.moonX = mx;
    frame.sunR = R;
    frame.moonR = Rm;
    frame.sun = palette.sun;
    frame.sunLight = palette.sunLight;
    frame.moon = palette.moon;
  };

  const drawStars = (t: number) => {
    const a = m * ease(p);
    if (a < 0.01 || starAmount <= 0) return;
    const count = Math.round((stars.length * starAmount) / 2);
    for (let i = 0; i < count; i++) {
      const s = stars[i];
      const tw = 0.55 + 0.45 * Math.sin(s.ph + t * s.sp);
      sky.fillStyle = rgba(s.c, tw * a);
      const x = s.x * W;
      const y = s.y * hz;
      if (s.r < 1) {
        sky.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2);
      } else {
        sky.beginPath();
        sky.arc(x, y, s.r, 0, Math.PI * 2);
        sky.fill();
      }
    }
  };

  const drawClouds = (t: number) => {
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
      if (c.flip < 0) sky.setTransform(-skyScale, 0, 0, skyScale, (x * 2 + sw) * skyScale, 0);
      else sky.setTransform(skyScale, 0, 0, skyScale, 0, 0);
      sky.globalAlpha = alpha;
      sky.drawImage(spr.cool, x, y, sw, sh);
      // clouds low on the horizon catch the sunrise
      const warm = sunE * Math.pow(clamp((y + sh) / hz, 0, 1), 3);
      if (warm > 0.02) {
        sky.globalAlpha = alpha * warm;
        sky.drawImage(spr.warm, x, y, sw, sh);
      }
    }
    sky.globalAlpha = 1;
    sky.setTransform(skyScale, 0, 0, skyScale, 0, 0);
  };

  /** The whole sky, in paint order: stars, then the still layer (tint, glow, sun, moon), then clouds. */
  const composeSky = (t: number) => {
    sky.setTransform(skyScale, 0, 0, skyScale, 0, 0);
    sky.clearRect(0, 0, W, hz);
    drawStars(t);
    sky.drawImage(staticC, 0, 0, W, hz);
    drawClouds(t);
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
    const prevSky = skyScale;
    skyScale = Math.min(dpr, SKY_SCALE[q]);
    waterScale = Math.min(dpr, WATER_SCALE[q]);
    skyWrap.style.height = hz + "px";
    size(skyC, W, hz, skyScale);
    size(staticC, W, hz, skyScale);
    water.el.style.top = hz + "px";
    water.el.style.height = waterH + "px";
    if (waterH > 0) water.resize(W, waterH, waterScale);
    R = Math.min(clamp(W * 0.07, 34, 72), hz / 1.8);
    Rm = R * 0.72;
    buildMoon();
    buildStars();
    buildClouds();
    if (prevSky !== skyScale || spriteScale !== skyScale) {
      sprites.length = 0;
      spriteScale = skyScale;
    }
    scheduleSprites();
    skyDirty = true;

    // the ripple is for devices that can afford it; at the lowest quality the flat mirror takes over
    if (q === "low" && water.kind === "webgl") useWater(makeMirror2d());
    else if (water.kind === "2d") tryGl();
  };
  layout(ctx.layout, ctx.quality);
  spriteScale = skyScale;

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
        paintStill();
        paintedP = p;
        paintedM = m;
        skyDirty = false;
      }
      composeSky(time);
      water.draw(time, frame, skyC);
    },

    destroy() {
      destroyed = true;
      cancelSprite?.();
      skyWrap.remove();
      water.destroy();
      sprites.length = 0;
    },
  };
}

export const scene: FooterScene = { create };
export default scene;
