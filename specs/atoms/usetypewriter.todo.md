# useTypewriter — Backlog

## Sooner
- [ ] TBD

## Later
- [ ] Optional controlled active index, for callers that want to drive which word is current from outside the hook.

## Backlog
- [x] Configurable per-character jitter for a more human, less metronomic typing cadence. (`typingSpeedJitter` + `dwellJitter`; deleting stays constant by design.)
- [x] More varied deletion, editing only the suffix that differs from the next word — generalized further than originally scoped: transitions now diff the two full phrases word-by-word (via the `typewriterDiff` atom) and edit only what actually changed, anywhere in the phrase, not just a differing tail.
