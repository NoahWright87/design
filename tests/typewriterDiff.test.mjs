import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/atoms/typewriterDiff.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { addTypingMistakes, buildTypewriterFrames } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("moves a reordered word with selection, cut, and paste", () => {
  const frames = buildTypewriterFrames("creative software builder", "software builder creative");
  assert.equal(frames[0].text, "creative software builder");
  assert.equal(frames.at(-1).text, "software builder creative");
  assert.equal(frames.filter((frame) => frame.action === "cut").length, 1);
  assert.equal(frames.filter((frame) => frame.action === "paste").length, 1);
  const selection = frames.filter((frame) => frame.action === "select");
  assert.equal(selection.length, "creative".length);
  assert.deepEqual(selection.at(-1).selection, [0, "creative".length]);
  assert.equal(frames.filter((frame) => ["insert", "delete", "editInsert", "editDelete"].includes(frame.action)).length, 0);
});

test("moves the shared word in issue 24's example despite its casing change", () => {
  const frames = buildTypewriterFrames("Building software with AI", "AI is my favorite building block");
  assert.equal(frames.some((frame) => frame.action === "cut"), true);
  assert.equal(frames.some((frame) => frame.action === "paste"), true);
  assert.equal(frames.at(-1).text, "AI is my favorite building block");
});

test("uses two moves for a full three-word reversal", () => {
  const frames = buildTypewriterFrames("alpha bravo charlie", "charlie bravo alpha");
  assert.equal(frames.filter((frame) => frame.action === "cut").length, 2);
  assert.equal(frames.filter((frame) => frame.action === "paste").length, 2);
  assert.equal(frames.at(-1).text, "charlie bravo alpha");
});

test("keeps casing and punctuation changes local", () => {
  const frames = buildTypewriterFrames("building leader,", "Building leader");
  assert.equal(frames.at(-1).text, "Building leader");
  assert.equal(frames.filter((frame) => frame.action === "editDelete").length, 2);
  assert.equal(frames.filter((frame) => frame.action === "editInsert").length, 1);
});

test("retains ordinary edits and skips short word moves", () => {
  const unchanged = buildTypewriterFrames("hello world", "hello world");
  assert.deepEqual(unchanged, [{ text: "hello world", cursor: 11, action: "start" }]);
  const shortMove = buildTypewriterFrames("the dog runs", "dog runs the");
  assert.equal(shortMove.some((frame) => frame.action === "cut"), false);
  assert.equal(shortMove.at(-1).text, "dog runs the");
});

test("keeps surrogate pairs whole through edits and moves", () => {
  const frames = buildTypewriterFrames("creative 😀 idea", "😀 idea creative");
  assert.equal(frames.at(-1).text, "😀 idea creative");
  for (const frame of frames) {
    assert.equal([...frame.text].some((character) => character.length === 1 && character.charCodeAt(0) >= 0xd800 && character.charCodeAt(0) <= 0xdfff), false);
    assert.equal(frame.cursor >= 0 && frame.cursor <= frame.text.length, true);
    if (frame.selection) {
      assert.equal(frame.selection[0] >= 0 && frame.selection[1] <= frame.text.length, true);
    }
  }
});

test("repairs a wrong key before continuing fresh typing or a correction", () => {
  for (const frames of [
    buildTypewriterFrames("", "hello"),
    buildTypewriterFrames("build", "builder"),
  ]) {
    const withMistake = addTypingMistakes(frames, 1, () => 0);
    const wrongIndex = withMistake.findIndex((frame) => frame.action === "typoInsert");
    assert.ok(wrongIndex > 0);
    assert.equal(withMistake[wrongIndex + 1].action, "typoDelete");
    assert.equal(withMistake[wrongIndex + 1].text, withMistake[wrongIndex - 1].text);
    assert.equal(withMistake.at(-1).text, frames.at(-1).text);
    assert.equal(withMistake.filter((frame) => frame.action === "typoInsert").length, 1);
  }
  const cleanFrames = buildTypewriterFrames("", "hello");
  assert.deepEqual(addTypingMistakes(cleanFrames, 0, () => 0), cleanFrames);
});

test("completes the playground's contrasting phrase transitions", () => {
  const phrases = [
    "creative software builder",
    "software builder creative",
    "Building software with AI",
    "AI is my favorite building block",
    "Building better software with AI",
    "Building better sofware with AI",
    "I build thoughtful experiences",
  ];
  for (let index = 0; index < phrases.length; index++) {
    const frames = buildTypewriterFrames(phrases[index], phrases[(index + 1) % phrases.length]);
    assert.equal(frames[0].text, phrases[index]);
    assert.equal(frames.at(-1).text, phrases[(index + 1) % phrases.length]);
    for (const frame of frames) {
      assert.equal(frame.cursor >= 0 && frame.cursor <= frame.text.length, true);
    }
  }
});
