# typewriterDiff — Backlog

## Sooner
- [ ] TBD

## Later
- [ ] Consider also matching a common *suffix* between a differing word pair (not just a prefix), for cases like "rebuilding" -> "building" — currently only a shared prefix is exploited, so a shared suffix with a differing prefix falls back to a full replace.

## Backlog
- [x] Configurable minimum similarity before two differing words are treated as a partial edit rather than an unrelated delete+insert. (`similarityThreshold`, gated on Levenshtein distance rather than raw alignment-cost ties — a pair sharing one incidental letter no longer gets paired just because it ties on cost.)
