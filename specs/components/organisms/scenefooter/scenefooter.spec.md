# SceneFooter — Footer With a Stage

## Purpose
SceneFooter is a taller alternative to `Footer` that doubles as a stage for a scroll-revealed visual effect, called a scene. It exists so any site can have a distinctive footer — an effect that plays as the reader reaches the bottom of the page — without paying for it up front: the page is complete and good-looking from CSS alone, and the effect arrives only when it is wanted, only when the device can afford it, and only if it loads.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Footer component](../footer/footer.spec.md)
- [Layout component](../layout/layout.spec.md)
- [useprefersreducedmotion atom](../../../atoms/useprefersreducedmotion.spec.md)

## Contract

### Inputs
- The same slots as `Footer`: left, center, right, an optional bottom strip with an optional separator, and plain children for unslotted use.
- A scene: the name of a built-in scene (`"horizon"` today), a loader function that fetches a custom scene on demand, a scene object, or nothing at all for a plain footer panel. Defaults to the horizon scene.
- Scene options, passed through to the scene. The horizon scene accepts the positions of its sun and moon across the footer, a star density, a cloud density, how fast the stars turn, a seed for placement, a renderer choice (automatic, WebGL, or the flat 2D mirror) for its water, and four ripple controls for the WebGL water: how far the ripple shifts the reflection sideways, how far it shifts it up and down, its speed, and its wavelength. It also accepts a variation amount (a fraction, 0.2 by default). Every option has a default chosen by eye and is clamped to a sensible range.
- An animate switch. Turning it off shows only the CSS version of the scene and never loads scene code.
- An optional `effects: SceneEffects` handle, created with `useSceneEffects()` or `createSceneEffects()`. Default: absent. Its typed `trigger` method accepts a firework with optional normalized position, color, and size. Defaults: a fresh random position in the sky, a saturated multicolor palette per shell, and small size. A large size launches a staggered celebration. An explicit color overrides the random palette.
- `fireworksFrequency?: number`: a requested average automatic launch rate in shells per second, default zero (off). Negative and nonfinite rates act as off. High rates follow the scene's frame pacing. Live changes preserve the scene. Automatic shells share the manual effects' pool and lifecycle.
- `fireworksParticleLimit?: number`: the total reusable particle budget, default 2,048, including pending launches. Finite values round down to positive safe integers; nonfinite values restore the default. Live changes preserve the scene and immediately retire oldest particles above a lowered limit. Allocation happens on demand.
- Optional heights for the sky band and the sea panel, and an optional additional CSS class name.
- The reader's footer style, an override stored on the reader's device and mirrored on the page: automatic (the site's own choice, the default), still (the CSS version only), flat (the scene with a calm flat reflection), or animated (the scene with the rippling reflection where the browser can run it). The design system offers helpers to read, set and watch it.
- The page theme (light or dark), read from the same theme setting the rest of the design system uses, and design tokens for color. Optional scene-specific color tokens (sun, moon, sea, text) override the defaults derived from the primary and secondary colors.

### Outputs
- A footer element made of a sky band above a sea panel. The panel holds the footer content along its bottom edge.
- A scene state that describes what the reader is seeing: static (the CSS version), loading, live (the scene is running), frozen (the scene stopped on its last frame), or failed (the scene could not load and the CSS version remains).
- Trigger delivery reports whether at least one attached eligible footer accepted the effect.

### Guarantees / Constraints
- The server-rendered footer is complete without scripts: sky, sea, a risen sun or moon with its reflection, and all content.
- The sky band is real layout space. Nothing the scene draws overlaps page content.
- The footer reserves its height up front, so a scene arriving later never moves the page.
- Scene code is requested only when the footer is within about one screen of the viewport and the browser is idle. A page whose footer is far away never fetches it.
- Scene code is never requested for readers who prefer reduced motion, who have data saving on, whose device reports very few processor cores or very little memory, or who use forced-colors mode. Those readers keep the CSS version.
- A reader's explicit footer style wins over the site's choice: a flat or animated style plays the scene even where the site asked for a still footer, and even on devices the footer would leave still to save data or battery. A reader's system preference for reduced motion, and forced-colors mode, always win over every choice, so those readers keep the still footer.
- If the scene fails to load, takes too long, or throws, the CSS version stays in place and the page keeps working.
- The scene runs only while the footer is on screen and the tab is visible.
- If frames run slow, the footer lowers its own rendering effort in steps, and stops on its last frame when it can go no lower.
- A scene's reflection is a mirror of the whole finished sky, so every element in the sky (sun, moon, stars, clouds, anything added later) is reflected exactly once, and a theme change never shows a body reflected twice.
- A reader's device never receives a rippling reflection that costs more than the flat one: WebGL is used only when the browser reports a hardware-accelerated context, and any loss of that context returns the footer to the flat mirror.
- The scene is decorative: it is hidden from assistive technology, never receives pointer or keyboard input, and never changes what the footer content says or how it can be reached.
- Footer content stays readable over every state of the scene.

## Behavior

**Default:** The reader sees the CSS version immediately. Scrolling toward the bottom, the scene loads in the background and fades in over the CSS version. By day the sun rises as the footer scrolls into view, clouds drift across the sky band, and the sea shimmers with a reflection of the sun. By night the moon rises, stars come out, and the reflection follows the moon.

**Footer style override:** Choosing a footer style takes effect immediately on every mounted footer, whoever set it, and is remembered for the reader's next visit. Choosing still removes a running scene and keeps the CSS version. Choosing flat or animated starts the scene if it is not running, or swaps its water renderer if it is. Choosing automatic returns to the site's own choice. If the browser cannot run WebGL, the animated style shows the flat reflection.

**Water renderers (horizon):** The scene paints the entire sky onto a single surface and mirrors that surface into the sea. On a capable device the mirror is rippled by a WebGL shader: waves vary across the width, bright bodies glitter downward, and clouds and stars shimmer faintly. Everywhere else, and for the lowest quality setting, the sky is mirrored flat: a calm, softly fading copy with no ripple. The WebGL code is a separate download, fetched only after a hardware-accelerated context is confirmed. Choosing the flat mirror explicitly never downloads it.

**Variation (horizon):** Each visit strays a little from the configured settings so the page is not identical every time: the star and cloud densities, the star turning speed and the four ripple controls are each nudged by up to the variation amount either way (20% by default), so some visits have more clouds or a choppier sea. The nudge is rolled once per page load and holds for that visit, even if the footer is remounted. A variation of zero uses the settings exactly, which is how Storybook starts so its sliders are exact.

**Ripple direction (horizon, WebGL):** The ripple shifts the mirrored picture both sideways and up and down. Calm water seen at a low angle reads best when the up-and-down movement leads, so that is the default mix; a site or a designer in Storybook can tune the two amounts independently, along with speed and wavelength. Setting both amounts to zero gives a still mirror. The flat 2D mirror has no ripple and ignores these controls.

**Clouds (horizon):** Clouds drift across the sky band by day and night. Each cloud is drawn once in white and grey with soft translucent edges, then tinted warm (from the sun color) for day and purple for night, so the two looks share one shape. At night they keep the same strength, in the purple tint, and pass in front of the moon. They are reflected like everything else in the sky.

**Star rotation (horizon):** Stars turn very slowly about a point far below the horizon, a stand-in for the Earth's spin. Near the horizon this reads as a gentle sideways glide. Stars leaving one edge of the sky return from the other, off screen, so the field never thins. The turning speed is an option, where zero holds the stars still. Because the water mirrors the sky, the reflected stars turn with them.

**Theme change:** When the page theme changes while the scene is live, the sun sets and the moon rises (or the reverse) with a smooth handoff. The scene follows any change to the page theme, however it was made.

**Short pages:** When the whole footer is already visible on arrival, the sun or moon rises once as the scene appears.

**Animate off, no scene, reduced motion, data saving, or a low-end device:** The reader sees the CSS version (or, with no scene, the plain panel). No scene code is fetched.

**Load failure or timeout:** The CSS version remains and the state reads failed.

**Slow frames:** The footer lowers its rendering resolution and frame rate first, and at the lowest setting the rippling reflection gives way to the flat mirror. If frames are still slow, the scene stops on its last frame and the state reads frozen. Resizing a frozen footer repaints that last frame, so the footer is never left blank.

**Reduced motion switched on while the page is open:** The scene is removed and the CSS version remains.

**Custom scenes:** A scene is a module that can create itself inside the footer's stage, resize, respond to a theme change, draw a frame when asked (given the time and how far the footer has scrolled into view), and clean up after itself. The footer supplies loading, visibility, timing, theme and quality management, so a scene only draws.

**Print:** The footer prints as plain text without the stage.

**Externally triggered fireworks (horizon):** An activity shares a stable effect handle with a footer through props or context. The activity decides when to celebrate; the footer paints a small launch and radial burst or a larger staggered group onto its existing sky, so both water modes reflect it. Triggers preserve the current scene, sun, moon, stars, clouds, theme transition, and assets. Changing handles changes only the event subscription. The firework position runs from left to right and sky top to horizon in normalized fractions; finite values are clamped and nonfinite values use fresh random defaults. An explicit CSS color or a single CSS color variable is resolved at delivery, with invalid colors using the sun-light color and alpha discarded. With color omitted, each explosion uses its own saturated multicolor palette. Angled shots start at different locations, rise with varied speeds, and decelerate under gravity. Independent fuses explode some rockets during ascent and others after they have started falling. Explosion sizes and shapes vary within each chosen celebration size.

**Automatic fireworks:** A positive frequency launches random shells with irregular intervals around the requested average rate, on the existing scene loop. Frequency changes preserve the running scene and future launches use the new rate. Zero stops future launches while current bursts finish. Static, Still, reduced-motion, offscreen, hidden, and frozen states pause automatic launches and clear active effects. Returning to an eligible state begins a fresh launch interval. Missed launches are dropped rather than accumulated, and the shared particle budget bounds even a high requested rate.

**Effect lifecycle and performance:** Delivery requires a loaded, live, visible footer in a visible tab. Loading, unsupported scenes, destroyed scenes, Still, reduced motion, static fallbacks, offscreen footers, hidden tabs, and frozen scenes quietly ignore triggers. Returning to view accepts new events; previously active celebrations are cleared when rendering pauses or freezes. The sky clips decorations at its edges. Every eligible trigger creates new fireworks. At the configured shared particle limit, the oldest particles are recycled first, including pending launches, so continuous clicking retains the newest celebrations. Retired and expired records are reused. Tiny limits adjust incoming group/detail counts to fit while still creating a new shot. Rendering quality controls per-shell detail and existing resolution/frame-rate limits; the total budget stays configured by the consumer. Pausing clears active particles; destruction releases the active and spare pools. Effects complete in under six seconds and remain decorative behind ordinary footer content. The demo presents fireworks and controls without accepted/dropped feedback.

## Interface

### Layout
A transparent sky band, moderate in height, sits above a deep sea panel in the site's secondary color (deeper at night). The footer content sits along the bottom of the sea in light text. The footer spans the full width of the page; it is taller than `Footer` and is meant to end the page.

### Horizon scene
The sea's top edge is the horizon. The sun and moon sit at the horizon, a fraction of the way across the footer chosen by the site, and are kept clear of footer links by choosing those positions. The sun takes its color from the primary color. The sky band fades into the page at its top so the scene never looks like a box.

### Accessibility
The footer is a footer landmark and its content is ordinary, focusable page content with a visible focus ring. The stage and every decoration are hidden from assistive technology. Reduced-motion readers receive a still version with no network cost. Footer text keeps comfortable contrast against the sea in both themes.

### Ergonomics
Use `SceneFooter` where `Footer` would go. Choose `animate={false}` on pages that are already busy, and a loader function for custom scenes so their code stays out of the main bundle. Pass a stable scene reference.

## Acceptance
1. With the footer far from the viewport, no scene code is requested and the scene state is static.
2. Scrolling within about one screen of the footer loads the scene once the browser is idle; the state becomes live and the stage holds the scene's canvases.
3. With animate off, with reduced motion, or with no scene, scene code is never requested.
4. Blocking the scene request leaves the CSS footer in place, the state reads failed, and no uncaught error reaches the page.
5. The CSS version shows a sun with a reflection in light mode and a crescent moon with stars and a reflection in dark mode.
6. Changing the page theme while live hands the sun over to the moon (or the reverse).
7. Footer content from every slot renders and remains reachable by keyboard in every state.
8. Away from the footer, the page's main thread cost with a scene footer matches a page with a plain footer.
9. At the footer, on a CPU slowed fourfold, frames stay smooth or the footer lowers its own effort until they do.
10. Printing the page shows the footer content as plain text.
11. With the sun and moon close together, a theme change shows one reflection per visible body and never a second copy of either.
12. With the flat mirror chosen, no WebGL code is requested and the water renders as a calm mirror of the sky.
13. With WebGL unavailable or refused by the browser, the footer renders with the flat mirror and raises no error.
14. Clouds and stars appear in the reflection.
15. Resizing a frozen footer leaves the sky and water painted.
16. A stored still style keeps the scene from loading on the next visit.
17. The flat style plays the scene on a footer the site asked to keep still, with no WebGL code requested.
18. Changing the footer style while the footer is live swaps or removes the scene without a reload.
19. A system preference for reduced motion keeps the footer still even when the animated style is chosen.
20. Clouds remain visible in dark mode, tinted purple.
21. With star rotation on, the stars move across the sky over time; with it set to zero they hold their places and only twinkle.
22. The ripple controls change the WebGL water's movement, and the flat mirror is unaffected by them.
23. With a variation above zero, the star and cloud amounts differ from visit to visit within that fraction of the settings; with zero they stay put.
24. A shared effect handle delivers a small or large firework from a React event handler without recreating the scene, changing its options, or reloading assets.
25. Fireworks appear in the sky and both water reflections in light and dark themes and narrow layouts.
26. Repeated triggers always create new fireworks within the configured reusable pool limit; full pools replace oldest particles, expired records are reused, and reducing the limit trims oldest particles immediately.
27. Unavailable, offscreen, hidden, static, reduced-motion, frozen, and destroyed scenes drop triggers; returning to view replays only new events.
28. Changing effect handles detaches the old subscription while preserving the scene; unmounting releases subscriptions and particles.
29. Custom scenes without effect support preserve their existing behavior and report an unaccepted trigger.
30. Default explosions use multiple colors with varied launch points, angles, speeds, fuses, and sizes; an explicit color or burst position remains effective.
31. Rockets decelerate during ascent, and some fuse timings produce a burst after the shell starts falling.
32. A positive automatic rate launches shells while eligible; live rate changes preserve canvases and scene assets, zero stops future launches, and pauses resume from a fresh interval without catch-up.
33. A default 2,048-particle pool supports continuous clicking; changing its limit preserves scene identity, retained records stay bounded, and destruction releases them all.
34. The demo offers a frenzy button and particle-limit control with decorative output and no accepted/dropped badge.
