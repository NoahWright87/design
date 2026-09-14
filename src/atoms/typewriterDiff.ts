export type TypewriterFrameAction =
  | "start"
  | "move"
  | "pause"
  | "editPause"
  | "insert"
  | "delete"
  | "editInsert"
  | "editDelete";

export interface TypewriterFrame {
  /** The full text visible at this point in the transition. */
  text: string;
  /** Index into `text` where the caret sits. */
  cursor: number;
  /**
   * What kind of change produced this frame from the one before it. `"insert"`/`"delete"`
   * are wholly new/removed words (no counterpart in the other phrase); `"editInsert"`/
   * `"editDelete"` are the same actions but on a word being edited in place (it shares a
   * prefix with its replacement) — real typing corrections read as more effortful than
   * fresh typing, so a caller typically drives these at a different pace. `"move"` is the
   * caret relocating with no text change; `"pause"`/`"editPause"` are it holding still
   * immediately before a fresh/edit action begins.
   */
  action: TypewriterFrameAction;
}

export interface TypewriterDiffOptions {
  /**
   * How similar two differing words must be, as a fraction of the longer word's length
   * (Levenshtein distance ÷ longer word's length, so `0` demands an exact match and `1`
   * allows anything), to be aligned as one in-place edit rather than an unrelated delete
   * of one word and insert of another. Default `0.5` (at most half the longer word's
   * letters may differ).
   */
  similarityThreshold?: number;
}

const DEFAULT_SIMILARITY_THRESHOLD = 0.5;

/**
 * Splits into Unicode code points rather than UTF-16 code units, so a surrogate-pair
 * character (most emoji, including ones outside the Basic Multilingual Plane) is
 * always treated as one indivisible unit — never split down its middle.
 */
function toCodePoints(text: string): string[] {
  return Array.from(text);
}

/**
 * Common prefix length in code points. Comparing raw UTF-16 code units would risk
 * finding a "match" on just the shared leading half of two different surrogate pairs
 * (e.g. two emoji from the same Unicode block can share a high surrogate), which would
 * then get treated as a real shared prefix and split mid-character.
 */
function commonPrefixLength(a: string[], b: string[]): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/** Levenshtein edit distance between two code-point arrays. */
function levenshteinDistance(a: string[], b: string[]): number {
  const n = a.length;
  const m = b.length;
  const row = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) row[j] = j;

  for (let i = 1; i <= n; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= m; j++) {
      const temp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? diagonal : 1 + Math.min(diagonal, row[j], row[j - 1]);
      diagonal = temp;
    }
  }
  return row[m];
}

/**
 * Whether two differing words are close enough to treat as one in-place edit. Guards
 * against the aligner pairing up two words that merely tie on cost (e.g. two unrelated
 * words that happen to share a single leading letter) — without this, such a pair would
 * get "edited" into each other despite having nothing meaningful in common.
 */
function areSimilarEnough(aCp: string[], bCp: string[], threshold: number): boolean {
  const maxLen = Math.max(aCp.length, bCp.length);
  if (maxLen === 0) return true;
  return levenshteinDistance(aCp, bCp) / maxLen <= threshold;
}

function splitWords(text: string): string[] {
  const trimmed = text.trim();
  return trimmed.length === 0 ? [] : trimmed.split(/\s+/);
}

type WordOp =
  | { kind: "equal"; word: string }
  | { kind: "substitute"; from: string; to: string }
  | { kind: "delete"; word: string }
  | { kind: "insert"; word: string };

/**
 * Aligns two word sequences with a minimum-edit alignment: words identical in both
 * (in any position, not just a shared prefix or suffix of the whole phrase) are kept
 * as untouched anchors, and a pair of differing-but-similar-enough words (see
 * `areSimilarEnough`) is aligned as a partial edit rather than a full delete-and-retype.
 * Ties prefer aligning similar words over an unpaired delete+insert.
 */
function alignWords(a: string[], b: string[], similarityThreshold: number): WordOp[] {
  const n = a.length;
  const m = b.length;
  const aCp = a.map(toCodePoints);
  const bCp = b.map(toCodePoints);
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  const choice: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    dp[i][0] = dp[i - 1][0] + aCp[i - 1].length;
    choice[i][0] = 1;
  }
  for (let j = 1; j <= m; j++) {
    dp[0][j] = dp[0][j - 1] + bCp[j - 1].length;
    choice[0][j] = 2;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const A = a[i - 1];
      const B = b[j - 1];
      const prefix = commonPrefixLength(aCp[i - 1], bCp[j - 1]);
      const canPair = A === B || areSimilarEnough(aCp[i - 1], bCp[j - 1], similarityThreshold);
      const subCost = A === B ? 0 : aCp[i - 1].length - prefix + (bCp[j - 1].length - prefix);
      const diag = canPair ? dp[i - 1][j - 1] + subCost : Infinity;
      const up = dp[i - 1][j] + aCp[i - 1].length;
      const left = dp[i][j - 1] + bCp[j - 1].length;

      let best = diag;
      let ch = 0;
      if (up < best) {
        best = up;
        ch = 1;
      }
      if (left < best) {
        best = left;
        ch = 2;
      }
      dp[i][j] = best;
      choice[i][j] = ch;
    }
  }

  const ops: WordOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && choice[i][j] === 0) {
      const A = a[i - 1];
      const B = b[j - 1];
      ops.push(A === B ? { kind: "equal", word: A } : { kind: "substitute", from: A, to: B });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || choice[i][j] === 1)) {
      ops.push({ kind: "delete", word: a[i - 1] });
      i--;
    } else {
      ops.push({ kind: "insert", word: b[j - 1] });
      j--;
    }
  }
  return ops.reverse();
}

type Segment =
  | { kind: "anchor"; op: { kind: "equal"; word: string } | { kind: "substitute"; from: string; to: string } }
  | { kind: "gap"; oldText: string; newText: string };

/**
 * Collapses consecutive delete/insert ops (a run of words with no shared anchor between
 * them) into one gap, so the whole run animates as a single continuous backspace-then-type
 * rather than as separate per-word actions — exactly how a person would clear out a stretch
 * of wrong text and then write its replacement, without pausing at every word boundary.
 */
function buildSegments(ops: WordOp[]): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  while (i < ops.length) {
    const op = ops[i];
    if (op.kind === "equal" || op.kind === "substitute") {
      segments.push({ kind: "anchor", op });
      i++;
      continue;
    }
    const deletes: string[] = [];
    const inserts: string[] = [];
    while (i < ops.length && (ops[i].kind === "delete" || ops[i].kind === "insert")) {
      const gapOp = ops[i];
      if (gapOp.kind === "delete") deletes.push(gapOp.word);
      else if (gapOp.kind === "insert") inserts.push(gapOp.word);
      i++;
    }
    segments.push({ kind: "gap", oldText: deletes.join(" "), newText: inserts.join(" ") });
  }
  return segments;
}

/**
 * Builds the frame-by-frame transition from `from` to `to`, editing only the words that
 * actually differ, wherever in the phrase they fall — rather than clearing the whole
 * thing and retyping it. A word present in both stays put untouched; a changed word
 * similar enough to its replacement (e.g. "build" -> "builder") is backspaced and
 * retyped only past their shared prefix. Falls back to a plain clear-and-retype when
 * nothing in `from` and `to` has anything in common.
 *
 * Mimics how a person actually edits text rather than clearing and retyping everything:
 * starting from the caret's current position (the end of `from`), it resolves each
 * change — a run of wrong words to clear and correct words to write, or a single word to
 * edit in place — completely as it's reached, then glides on to the next one. Because the
 * caret starts at the end, that means working right to left through the phrase, with the
 * caret gliding (not jumping) through any untouched stretch between one change and the
 * next. It finishes with one more glide to the true end of `to`, so the caret always ends
 * up in the same place a normal "typed the whole thing" pass would leave it.
 *
 * Pure and deterministic — no timing is baked in. A caller (see `useTypewriter`) steps
 * through the returned frames on its own clock, picking a delay per frame from its
 * `action`.
 */
export function buildTypewriterFrames(
  from: string,
  to: string,
  options: TypewriterDiffOptions = {}
): TypewriterFrame[] {
  if (from === to) {
    return [{ text: to, cursor: to.length, action: "start" }];
  }

  const { similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD } = options;
  const ops = alignWords(splitWords(from), splitWords(to), similarityThreshold);
  const segments = buildSegments(ops);
  const slots: string[] = segments.map((seg) =>
    seg.kind === "gap" ? seg.oldText : seg.op.kind === "equal" ? seg.op.word : seg.op.from
  );
  const frames: TypewriterFrame[] = [];
  let cursor = from.length;

  // Joins non-empty slot values, adding a separating space between two of them only
  // when neither side already supplies one. A gap slot holding several words (e.g.
  // "for a living") can be mid-typed/mid-deleted to a value that itself ends right at
  // an internal word boundary (e.g. "for a ") — a plain `parts.join(" ")` would then
  // add a second separator on top of that trailing space.
  function joinSmart(parts: string[]): string {
    let result = "";
    for (const part of parts) {
      if (part.length === 0) continue;
      if (result.length === 0) result = part;
      else if (result.endsWith(" ") || part.startsWith(" ")) result += part;
      else result += ` ${part}`;
    }
    return result;
  }

  // `activeSlot`'s own current value doubles as the "how far in" position — every call
  // site sets it before calling render, so there's no separate offset to track. When
  // that slot is currently empty, the caret's position depends on what comes after it:
  // the start of the next slot that already has content (about to type there, or just
  // finished clearing this one with more to resolve further on), or the true end of the
  // text if nothing does (this slot was cleared for good, nothing left to insert here).
  function render(activeSlot: number): { text: string; cursor: number } {
    const text = joinSmart(slots);
    const activeValue = slots[activeSlot];

    if (activeValue.length > 0) {
      const upToActive = joinSmart(slots.slice(0, activeSlot + 1));
      return { text, cursor: upToActive.length };
    }

    for (let k = activeSlot + 1; k < slots.length; k++) {
      if (slots[k].length > 0) {
        const upToNext = joinSmart(slots.slice(0, k + 1));
        return { text, cursor: upToNext.length - slots[k].length };
      }
    }
    return { text, cursor: text.length };
  }

  // Steps the caret one code point at a time toward `target.cursor`, never landing
  // between the two halves of a surrogate-pair character (most emoji) — the text isn't
  // changing during a glide, only where the caret sits within it.
  function glideTo(target: { text: string; cursor: number }) {
    while (cursor !== target.cursor) {
      if (target.cursor > cursor) {
        const code = target.text.charCodeAt(cursor);
        cursor += code >= 0xd800 && code <= 0xdbff ? 2 : 1;
      } else {
        const code = target.text.charCodeAt(cursor - 1);
        cursor -= code >= 0xdc00 && code <= 0xdfff ? 2 : 1;
      }
      frames.push({ text: target.text, cursor, action: "move" });
    }
  }

  frames.push({ text: from, cursor: from.length, action: "start" });

  for (let idx = segments.length - 1; idx >= 0; idx--) {
    const seg = segments[idx];

    if (seg.kind === "anchor" && seg.op.kind === "equal") continue;

    if (seg.kind === "anchor" && seg.op.kind === "substitute") {
      const { from: wFrom, to: wTo } = seg.op;
      const fromCp = toCodePoints(wFrom);
      const toCp = toCodePoints(wTo);
      const prefix = commonPrefixLength(fromCp, toCp);

      const start = render(idx);
      glideTo(start);
      frames.push({ ...start, action: "editPause" });

      for (let n = fromCp.length - 1; n >= prefix; n--) {
        slots[idx] = fromCp.slice(0, n).join("");
        const frame = render(idx);
        frames.push({ ...frame, action: "editDelete" });
        cursor = frame.cursor;
      }
      for (let n = prefix + 1; n <= toCp.length; n++) {
        slots[idx] = toCp.slice(0, n).join("");
        const frame = render(idx);
        frames.push({ ...frame, action: "editInsert" });
        cursor = frame.cursor;
      }
      continue;
    }

    const gap = seg as Extract<Segment, { kind: "gap" }>;
    const hasOld = gap.oldText.length > 0;
    const hasNew = gap.newText.length > 0;

    if (hasOld) {
      const start = render(idx);
      glideTo(start);
      frames.push({ ...start, action: "pause" });

      const oldCp = toCodePoints(gap.oldText);
      for (let n = oldCp.length - 1; n >= 0; n--) {
        slots[idx] = oldCp.slice(0, n).join("");
        const frame = render(idx);
        frames.push({ ...frame, action: "delete" });
        cursor = frame.cursor;
      }
    }

    if (hasNew) {
      if (!hasOld) {
        const start = render(idx);
        glideTo(start);
        frames.push({ ...start, action: "pause" });
      }
      const newCp = toCodePoints(gap.newText);
      for (let n = 1; n <= newCp.length; n++) {
        slots[idx] = newCp.slice(0, n).join("");
        const frame = render(idx);
        frames.push({ ...frame, action: "insert" });
        cursor = frame.cursor;
      }
    }
  }

  glideTo({ text: to, cursor: to.length });
  frames.push({ text: to, cursor: to.length, action: "pause" });
  return frames;
}

export default buildTypewriterFrames;
