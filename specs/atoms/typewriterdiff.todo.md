# typewriterDiff — Backlog

## Sooner
- [ ] TBD

## Later
- [ ] Consider also matching a common *suffix* between a differing word pair (not just a prefix), for cases like "rebuilding" -> "building" — currently only a shared prefix is exploited, so a shared suffix with a differing prefix falls back to a full replace.

## Backlog
- [ ] Optional configurable minimum shared-prefix length before two differing words are treated as a partial edit rather than an unrelated delete+insert (currently any shared prefix length, including a single incidental matching letter, is used if the alignment's minimum-edit cost prefers it).
