# SceneFooter — Backlog

## Sooner
- [x] Tune the horizon's ripple, star and cloud defaults by eye in Storybook, then set them as the defaults.

## Later
- [ ] Birds: Occasional flocks crossing the sky band, a few small silhouettes with a wing-flap cycle, drawn onto the sky surface so the water reflects them automatically. Rare and brief so it stays an easter egg.
- [ ] Distant ships and islands: A far-off ship, island, or lighthouse sitting on the horizon line. These touch the horizon, so the existing mirror reflects them with no new water code.

## Backlog
- Nearby boats: A boat crossing the sea needs its own reflection mirrored about its waterline (the sky mirror pivots on the horizon, so a nearer object would reflect in the wrong place), plus a wake that disturbs the ripple behind it.
- Dolphins and jumping fish: An arc that leaves and re-enters the water, with a splash ring that spreads across the ripple. Needs per-object waterline reflection and ripple rings in the water shader.
- Shared approach for wildlife: Draw them as procedural silhouettes (no image downloads) in a separate lazily loaded chunk, fetched only on the animated styles; honor the quality tiers (fewer or none at the lowest), reduced motion, and the reader's footer-style choice; space appearances out with random pauses.
- Shooting stars: A rare streak across the night sky.
- Moon phase or position that follows the real date.
