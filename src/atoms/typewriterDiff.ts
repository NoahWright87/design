export type TypewriterFrameAction = "start" | "pause" | "insert" | "delete";

export interface TypewriterFrame {
  /** The full text visible at this point in the transition. */
  text: string;
  /** Index into `text` where the caret sits. */
  cursor: number;
  /** What kind of change produced this frame from the one before it. */
  action: TypewriterFrameAction;
}

function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
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
 * as untouched anchors, and a pair of differing words that merely share a common
 * prefix (e.g. "build" / "builder") is aligned as a partial edit rather than a full
 * delete-and-retype. Ties prefer aligning words over an unpaired delete+insert.
 */
function alignWords(a: string[], b: string[]): WordOp[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  const choice: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    dp[i][0] = dp[i - 1][0] + a[i - 1].length;
    choice[i][0] = 1;
  }
  for (let j = 1; j <= m; j++) {
    dp[0][j] = dp[0][j - 1] + b[j - 1].length;
    choice[0][j] = 2;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const A = a[i - 1];
      const B = b[j - 1];
      const prefix = commonPrefixLength(A, B);
      const subCost = A === B ? 0 : A.length - prefix + (B.length - prefix);
      const diag = dp[i - 1][j - 1] + subCost;
      const up = dp[i - 1][j] + A.length;
      const left = dp[i][j - 1] + B.length;

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

/**
 * Builds the frame-by-frame transition from `from` to `to`, editing only the words
 * that actually differ, wherever in the phrase they fall — rather than clearing the
 * whole thing and retyping it. A word present in both stays put untouched; a changed
 * word that shares a prefix with its replacement (e.g. "build" -> "builder") is
 * backspaced and retyped only past that shared prefix. Falls back to a plain
 * clear-and-retype when nothing in `from` and `to` has anything in common.
 *
 * Pure and deterministic — no timing is baked in. A caller (see `useTypewriter`)
 * steps through the returned frames on its own clock, picking a delay per frame from
 * its `action` (`"insert"` vs `"delete"` vs a `"pause"` while the caret relocates).
 */
export function buildTypewriterFrames(from: string, to: string): TypewriterFrame[] {
  if (from === to) {
    return [{ text: to, cursor: to.length, action: "start" }];
  }

  const ops = alignWords(splitWords(from), splitWords(to));
  const slots: string[] = ops.map((op) => {
    switch (op.kind) {
      case "insert":
        return "";
      case "equal":
        return op.word;
      case "delete":
        return op.word;
      case "substitute":
        return op.from;
    }
  });
  const frames: TypewriterFrame[] = [];

  function render(activeSlot: number, cursorWithinSlot: number): { text: string; cursor: number } {
    const parts: string[] = [];
    let cursor = 0;
    for (let k = 0; k < slots.length; k++) {
      if (k === activeSlot) {
        cursor = (parts.length > 0 ? parts.join(" ").length + 1 : 0) + cursorWithinSlot;
      }
      if (slots[k].length > 0) parts.push(slots[k]);
    }
    return { text: parts.join(" "), cursor };
  }

  frames.push({ text: from, cursor: from.length, action: "start" });

  ops.forEach((op, index) => {
    if (op.kind === "equal") return;

    if (op.kind === "substitute") {
      const prefix = commonPrefixLength(op.from, op.to);
      frames.push({ ...render(index, op.from.length), action: "pause" });
      for (let len = op.from.length - 1; len >= prefix; len--) {
        slots[index] = op.from.slice(0, len);
        frames.push({ ...render(index, len), action: "delete" });
      }
      for (let len = prefix + 1; len <= op.to.length; len++) {
        slots[index] = op.to.slice(0, len);
        frames.push({ ...render(index, len), action: "insert" });
      }
      return;
    }

    if (op.kind === "delete") {
      frames.push({ ...render(index, op.word.length), action: "pause" });
      for (let len = op.word.length - 1; len >= 0; len--) {
        slots[index] = op.word.slice(0, len);
        frames.push({ ...render(index, len), action: "delete" });
      }
      return;
    }

    // insert
    frames.push({ ...render(index, 0), action: "pause" });
    for (let len = 1; len <= op.word.length; len++) {
      slots[index] = op.word.slice(0, len);
      frames.push({ ...render(index, len), action: "insert" });
    }
  });

  // Settle the caret at the true end once every edit is resolved, rather than
  // leaving it wherever the last edit happened to be (e.g. mid-string, if the
  // phrase ends with words that never needed to change).
  frames.push({ text: to, cursor: to.length, action: "pause" });
  return frames;
}

export default buildTypewriterFrames;
