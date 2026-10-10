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
- Scene options, passed through to the scene. The horizon scene accepts the positions of its sun and moon across the footer, a star density, a cloud density, a seed for placement, and a renderer choice (automatic, WebGL, or the flat 2D mirror) for its water.
- An animate switch. Turning it off shows only the CSS version of the scene and never loads scene code.
- Optional heights for the sky band and the sea panel, and an optional additional CSS class name.
- The page theme (light or dark), read from the same theme setting the rest of the design system uses, and design tokens for color. Optional scene-specific color tokens (sun, moon, sea, text) override the defaults derived from the primary and secondary colors.

### Outputs
- A footer element made of a sky band above a sea panel. The panel holds the footer content along its bottom edge.
- A scene state that describes what the reader is seeing: static (the CSS version), loading, live (the scene is running), frozen (the scene stopped on its last frame), or failed (the scene could not load and the CSS version remains).

### Guarantees / Constraints
- The server-rendered footer is complete without scripts: sky, sea, a risen sun or moon with its reflection, and all content.
- The sky band is real layout space. Nothing the scene draws overlaps page content.
- The footer reserves its height up front, so a scene arriving later never moves the page.
- Scene code is requested only when the footer is within about one screen of the viewport and the browser is idle. A page whose footer is far away never fetches it.
- Scene code is never requested for readers who prefer reduced motion, who have data saving on, whose device reports very few processor cores or very little memory, or who use forced-colors mode. Those readers keep the CSS version.
- If the scene fails to load, takes too long, or throws, the CSS version stays in place and the page keeps working.
- The scene runs only while the footer is on screen and the tab is visible.
- If frames run slow, the footer lowers its own rendering effort in steps, and stops on its last frame when it can go no lower.
- A scene's reflection is a mirror of the whole finished sky, so every element in the sky (sun, moon, stars, clouds, anything added later) is reflected exactly once, and a theme change never shows a body reflected twice.
- A reader's device never receives a rippling reflection that costs more than the flat one: WebGL is used only when the browser reports a hardware-accelerated context, and any loss of that context returns the footer to the flat mirror.
- The scene is decorative: it is hidden from assistive technology, never receives pointer or keyboard input, and never changes what the footer content says or how it can be reached.
- Footer content stays readable over every state of the scene.

## Behavior

**Default:** The reader sees the CSS version immediately. Scrolling toward the bottom, the scene loads in the background and fades in over the CSS version. By day the sun rises as the footer scrolls into view, clouds drift across the sky band, and the sea shimmers with a reflection of the sun. By night the moon rises, stars come out, and the reflection follows the moon.

**Water renderers (horizon):** The scene paints the entire sky onto a single surface and mirrors that surface into the sea. On a capable device the mirror is rippled by a WebGL shader: waves vary across the width, bright bodies glitter downward, and clouds and stars shimmer faintly. Everywhere else, and for the lowest quality setting, the sky is mirrored flat: a calm, softly fading copy with no ripple. The WebGL code is a separate download, fetched only after a hardware-accelerated context is confirmed. Choosing the flat mirror explicitly never downloads it.

**Theme change:** When the page theme changes while the scene is live, the sun sets and the moon rises (or the reverse) with a smooth handoff. The scene follows any change to the page theme, however it was made.

**Short pages:** When the whole footer is already visible on arrival, the sun or moon rises once as the scene appears.

**Animate off, no scene, reduced motion, data saving, or a low-end device:** The reader sees the CSS version (or, with no scene, the plain panel). No scene code is fetched.

**Load failure or timeout:** The CSS version remains and the state reads failed.

**Slow frames:** The footer lowers its rendering resolution and frame rate first, and at the lowest setting the rippling reflection gives way to the flat mirror. If frames are still slow, the scene stops on its last frame and the state reads frozen. Resizing a frozen footer repaints that last frame, so the footer is never left blank.

**Reduced motion switched on while the page is open:** The scene is removed and the CSS version remains.

**Custom scenes:** A scene is a module that can create itself inside the footer's stage, resize, respond to a theme change, draw a frame when asked (given the time and how far the footer has scrolled into view), and clean up after itself. The footer supplies loading, visibility, timing, theme and quality management, so a scene only draws.

**Print:** The footer prints as plain text without the stage.

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
