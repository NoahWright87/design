import { createSceneEffects, useSceneEffects, SceneFooter } from "@noahwright/design";
import type { FireworkEffect, SceneEffect, SceneEffects, SceneFooterProps } from "@noahwright/design";
import { createElement } from "react";

const effects: SceneEffects = createSceneEffects();
const firework: FireworkEffect = { type: "firework", position: { x: 0.25, y: 0.6 }, color: "var(--confirm)", size: "large" };
const effect: SceneEffect = firework;
const accepted: boolean = effects.trigger(effect);
const props: SceneFooterProps = { effects };
createElement(SceneFooter, props);
const hook: () => SceneEffects = useSceneEffects;
void accepted;
void hook;
// @ts-expect-error: unsupported effects are not accepted by the public API
effects.trigger({ type: "confetti" });
// @ts-expect-error: size has a deliberately small, typed set of options
effects.trigger({ type: "firework", size: "huge" });
// @ts-expect-error: normalized positions require both coordinates
effects.trigger({ type: "firework", position: { x: 0.5 } });
