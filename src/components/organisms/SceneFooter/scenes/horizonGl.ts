import { DEPTH_FADE, REFLECTION, STRETCH, canvasStyle, type FrameState, type Water } from "./horizonWater.js";

/**
 * The WebGL water: one shader flips the finished sky into the sea and ripples it, so everything
 * in the sky (sun, moon, stars, clouds) is reflected through the same waves. Loaded only when the
 * browser can create a hardware-accelerated WebGL context; otherwise the flat 2D mirror stays.
 */

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;

uniform sampler2D u_sky;
uniform vec2  u_size;     // canvas size in pixels
uniform float u_scale;    // canvas pixels per CSS pixel
uniform float u_width;    // CSS px
uniform float u_horizon;  // CSS px: height of the sky band
uniform float u_water;    // CSS px: height of the sea
uniform float u_time;
uniform float u_stretch;
uniform float u_reflect;
uniform float u_fade;
uniform float u_streak;   // CSS px: how far bright things smear downward
uniform vec2  u_bodyX;    // sun, moon centers (CSS px)
uniform vec2  u_bodyR;    // sun, moon radii (CSS px)
uniform vec2  u_bodyE;    // sun, moon strength
uniform vec3  u_sun;
uniform vec3  u_sunLight;
uniform vec3  u_moon;

float luma(vec4 c) { return dot(c.rgb, vec3(0.299, 0.587, 0.114)); }

void main() {
  float x = gl_FragCoord.x / u_scale;
  float d = (u_size.y - gl_FragCoord.y) / u_scale;  // CSS px below the horizon
  float k = d / u_water;

  // waves: incommensurate frequencies so the pattern never visibly repeats, varying across the width
  float ph = x * 0.006;
  float amp = 1.0 + d * 0.05;
  float dx = amp * (
      sin(d * 0.11 - u_time * 1.7 + ph)
    + 0.45 * sin(d * 0.37 + u_time * 2.9 - ph * 1.7)
    + 0.25 * sin(d * 0.83 - u_time * 4.3 + sin(u_time * 0.5) + ph * 0.6));
  float band = 0.5
    + 0.3 * sin(d * 0.55 - u_time * 3.1 + sin(d * 0.07 + u_time * 0.8) * 3.0)
    + 0.2 * sin(d * 1.31 + u_time * 2.3);
  band *= band;

  float u = clamp((x + dx) / u_width, 0.0, 1.0);
  float sy = u_horizon - 1.0 - d / u_stretch;       // the sky row this water pixel mirrors
  float inside = step(0.0, sy);
  vec4 best = texture2D(u_sky, vec2(u, max(sy, 0.0) / u_horizon));

  // bright things (sun, moon) glitter downward; clouds and stars stay put
  float reach = u_streak * (0.35 + k);
  for (int i = 1; i < 13; i++) {
    float f = float(i) / 12.0;
    float syi = min(sy + reach * f, u_horizon - 1.0);
    vec4 tap = texture2D(u_sky, vec2(u, max(syi, 0.0) / u_horizon));
    float w = (1.0 - f * 0.85) * smoothstep(0.6, 0.95, luma(tap));
    best = max(best, tap * w);
  }

  float strength = u_reflect * (1.0 - k * u_fade) * (0.75 + 0.25 * band) * inside;
  vec4 outc = best * strength;

  // sunlit water just below the horizon, under the reflection
  float litA = 0.2 * u_bodyE.x * (1.0 - smoothstep(0.0, 0.45, k));
  outc += vec4(u_sun * litA, litA) * (1.0 - outc.a);

  // bright seam along the horizon
  float row = step(d, 1.0);
  float sSun = clamp(1.0 - abs(x - u_bodyX.x) / (u_bodyR.x * 6.0), 0.0, 1.0) * 0.7 * u_bodyE.x * row;
  float sMoon = clamp(1.0 - abs(x - u_bodyX.y) / (u_bodyR.y * 6.0), 0.0, 1.0) * 0.7 * u_bodyE.y * row;
  vec4 seam = vec4(u_sunLight * sSun, sSun) + vec4(u_moon * sMoon, sMoon);
  outc = seam + outc * (1.0 - seam.a);

  gl_FragColor = clamp(outc, 0.0, 1.0);
}
`;

export type GlWaterOptions = {
  /** Accept software-rendered WebGL (used to force the WebGL path in tests). Off by default. */
  allowSoftware?: boolean;
  /** Called if the browser takes the WebGL context away. */
  onLost?: () => void;
};

const rgb = (c: [number, number, number]): [number, number, number] => [c[0] / 255, c[1] / 255, c[2] / 255];

/** Returns `null` when WebGL is unavailable, slow (software), or the shader will not build. */
export function createGlWater({ allowSoftware = false, onLost }: GlWaterOptions = {}): Water | null {
  const el = document.createElement("canvas");
  el.style.cssText = canvasStyle;
  el.dataset.renderer = "webgl";
  el.setAttribute("aria-hidden", "true");

  const gl = el.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
    // Without this, a machine with only software WebGL would draw the ripple slower than the flat mirror.
    failIfMajorPerformanceCaveat: !allowSoftware,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const release = () => gl.getExtension("WEBGL_lose_context")?.loseContext();

  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (!precision || precision.precision === 0) {
    release();
    return null;
  }

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) {
    release();
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    release();
    return null;
  }
  gl.useProgram(program);

  // one oversized triangle covers the whole canvas
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    sky: u("u_sky"),
    size: u("u_size"),
    scale: u("u_scale"),
    width: u("u_width"),
    horizon: u("u_horizon"),
    water: u("u_water"),
    time: u("u_time"),
    stretch: u("u_stretch"),
    reflect: u("u_reflect"),
    fade: u("u_fade"),
    streak: u("u_streak"),
    bodyX: u("u_bodyX"),
    bodyR: u("u_bodyR"),
    bodyE: u("u_bodyE"),
    sun: u("u_sun"),
    sunLight: u("u_sunLight"),
    moon: u("u_moon"),
  };

  let scale = 1;
  let lost = false;
  el.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    onLost?.();
  });

  return {
    kind: "webgl",
    el,

    resize(width, waterHeight, s) {
      scale = s;
      el.width = Math.max(1, Math.round(width * s));
      el.height = Math.max(1, Math.round(waterHeight * s));
      gl.viewport(0, 0, el.width, el.height);
    },

    draw(time, f: FrameState, sky) {
      if (lost || f.waterHeight <= 0 || sky.width <= 0 || sky.height <= 0) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sky);

      gl.uniform1i(loc.sky, 0);
      gl.uniform2f(loc.size, el.width, el.height);
      gl.uniform1f(loc.scale, scale);
      gl.uniform1f(loc.width, f.width);
      gl.uniform1f(loc.horizon, f.horizon);
      gl.uniform1f(loc.water, f.waterHeight);
      gl.uniform1f(loc.time, time);
      gl.uniform1f(loc.stretch, STRETCH);
      gl.uniform1f(loc.reflect, REFLECTION);
      gl.uniform1f(loc.fade, DEPTH_FADE);
      gl.uniform1f(loc.streak, f.sunR * 1.6);
      gl.uniform2f(loc.bodyX, f.sunX, f.moonX);
      gl.uniform2f(loc.bodyR, f.sunR, f.moonR);
      gl.uniform2f(loc.bodyE, f.sunE, f.moonE);
      gl.uniform3fv(loc.sun, rgb(f.sun));
      gl.uniform3fv(loc.sunLight, rgb(f.sunLight));
      gl.uniform3fv(loc.moon, rgb(f.moon));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    destroy() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      release();
      el.remove();
    },
  };
}
