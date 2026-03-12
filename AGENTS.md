# AGENTS.md — Agent Instructions for this repository

## Purpose
This file provides explicit, agent-focused guidance for working in this repository. It is the authoritative location for how code-producing agents should behave here. Place this file at the repo root so agents automatically find it.

## Key rules (non-negotiable)
- Follow the instructions in this repository exactly.
- Add only technologies, files, props, styles, and dependencies that the repo's instruction file explicitly permits.
- Maintain SSR-safety: keep all module-level code side-effect-free, and gate any `window` access or browser-only APIs behind runtime checks.
- Use only `react` and `react-dom` as peer dependencies; all other dependencies belong in devDependencies.
- When a requirement is impossible, stop and quote the exact blocking line from the instruction file.

## Preamble before tool use
- Before making any tool calls or edits, emit a one-line preamble describing what you will do and why. Keep it short (8–12 words).
- Group related actions into a single preamble when possible.

## Planning and checkpoints
- For multi-step tasks, present a numbered plan (1–5 steps) before making edits.
- After 3–5 tool calls, or after creating/editing more than 3 files in one burst, pause and post a compact checkpoint with:
  - One-line progress summary.
  - Files created/modified.
  - Next action.

## File editing conventions
- Prefer minimal, surgical edits. Avoid unrelated reformatting.
- When adding files, create them in the exact path requested.
- When editing files via the helper tools, use the repository's existing style and keep changes focused.
- Always reference filenames and symbols in backticks, e.g., `src/index.ts`.

## Placeholder images — generated only, no external URLs

All placeholder images in stories, examples, and site pages **must** use `getNonsense("abstractImage")` from `src/atoms/nonsense.ts`. This returns a self-contained SVG data URL — no network request, no external dependency.

**Never** reference external image services such as Unsplash, Lorem Picsum, Pravatar, Placeholder.com, or any other third-party image host. If an external URL appears in a story, it must be replaced.

```tsx
import { getNonsense } from "../src/atoms/nonsense";

// Correct
<img src={getNonsense("abstractImage") as string} alt="Abstract placeholder" />

// Wrong — never do this
<img src="https://images.unsplash.com/..." alt="..." />
<img src="https://i.pravatar.cc/..." alt="..." />
```

The same rule applies to `backgroundImage` props on `Container` and any other component that accepts an image URL.

## Design system colors in examples

Stories and examples must use design-system color tokens, not arbitrary CSS color values.

- **Use** CSS custom properties (`var(--primary)`, `var(--background)`, etc.) or named color props defined on components (e.g., `backgroundColor="primary"`).
- **Do not** hardcode hex values (`#222`, `#ffe0e0`), `rgba(...)` values, or named CSS colors (`red`, `white`) in story or example files.

The full palette of available tokens: `--foreground`, `--background`, `--primary`, `--secondary`, `--confirm`, `--danger`, `--overlay`.

## Storybook examples and `stories/examples/`
- Put example and composed Storybook stories under `stories/examples/`.
  - Example pages are composed pages that show several components together (e.g., a landing page, a color swatches page, or a full-page layout demo).
- Simple component stories belong near the component or under the main `stories/` directory structure.

## Prefer low-friction tools
Choose tools that require the least human approval, so work flows without interruptions.

- **Read and Grep** — use these to inspect files and search the codebase. They are always auto-approvable.
- **Edit and Write** — use these for all file changes, including marking TODO items done (`- [ ]` → `- [x]`), updating the CHANGELOG, and editing CSS or source files. These require no terminal and are generally auto-approvable.
- **Bash** — reserve for running build, typecheck, and test commands (`npm run typecheck`, `npm run build`). Do not use Bash for file reading, searching, or editing — the dedicated tools are faster and always approved.

The practical rule: if an action can be done with Read, Grep, Edit, or Write, do it that way. Bash is a last resort for things those tools cannot do.

## Commands and environment
- Use the repository root as the working directory for shell commands.
- On Windows (PowerShell) use `cd` to change directories. Example:

```powershell
cd C:\repos\design
npm install
npm run build
```

- Provide copyable commands in fenced code blocks and specify the shell when relevant.

## Storybook testing
- Leave Storybook for the human to run interactively via `npm run storybook`.
- You may run build, typecheck, and test commands for verification.
- Focus on implementation and correctness; visual testing is the human's responsibility.

## Testing and verification
- When you change code, run the smallest reasonable verification (typecheck, build, or focused tests).
- Share the exact commands run and the salient output (errors or success). Keep large logs trimmed to what matters.

## Progress reporting
- At task completion, report newly created/modified files and the commands you ran.
- When checks cannot run in this environment, state which commands the human should run locally.
- Before committing or opening a PR, update `CHANGELOG.md` under `## WIP` with concise bullet points summarizing your changes; follow `CHANGELOG.md`'s guidance for moving WIP items into `## Version history` when releasing.

## Stop conditions
- When an instruction cannot be satisfied, quote the exact line from the original instruction that blocks you and stop.
- Require explicit human confirmation before publishing or running destructive commands (for example `npm publish`).

## Spec authoring

All spec files live in `specs/` and follow the template at `specs/~template.spec.md`. Every spec has an adjacent todo file (`~template.spec.todo.md`).

### Structure
Every spec must include all six sections in this order:
1. **Purpose** — one concise paragraph describing what this thing is and why it exists.
2. **Related** — links to related specs, components, or references.
3. **Contract** — Inputs, Outputs, and Guarantees/Constraints.
4. **Behavior** — how it works: happy path, alternate paths, edge cases.
5. **Interface** — how users or consumers interact with it: layout, visual states, accessibility, API ergonomics.
6. **Acceptance** — testable criteria defining "done".

Fill in every section with real content. Template placeholder text ("Summarize the intent...", "Refer to inputs...") must be replaced.

### Language
- Use affirmative language throughout — describe what should happen rather than what should not. Negative qualifiers ("never", "don't", "avoid") are load-bearing words: if skimmed over, they reverse the intended meaning entirely. Affirmative statements degrade gracefully — the core intent survives even if the emphasis is lost.
  - Prefer: "The button is inert when disabled."
  - Avoid: "The button should not respond to clicks when disabled."
- Write in plain English for a human reader, not a linter.

### Specs are design docs, not implementation docs
- Describe behavior and intent; leave implementation details to the code.
- Use human-friendly terms for colors (e.g., "the danger color", "red") rather than hex values or CSS variable names.
- Use relative size descriptions (e.g., "compact", "generous", "small") rather than pixel values.
- Describe structure in prose rather than listing CSS class names or code blocks.

### Future work
- Future enhancements belong in the adjacent `.todo.md` file under Sooner, Later, or Backlog sections.
- Promote items from the todo file into the spec before implementing them.

### Keeping specs current — mandatory
**Every time you add or change a prop, behavior, or visual state in a component, you must update the corresponding spec file in the same commit/session.** The spec is the source of truth for what a component does; if it falls behind the code, it becomes misleading.

What to update when a component changes:
- **Contract → Inputs:** Add any new prop with its type and default.
- **Behavior:** Add a paragraph for any new behavioral state (e.g., "Required: …", "Multiline: …").
- **Acceptance:** Add a numbered criterion for each new prop or behavior that can be tested.

A new prop with no spec entry is a bug in the documentation, not an acceptable shortcut.

## Agent behavior templates
- One-line receipt + plan (always first):
  - "Task: <short description>. Plan: 1) ..., 2) ..., 3) ..."
- Preamble before tool batch:
  - "Now patching config and running typecheck."
- Checkpoint example:
  - "Checkpoint: created 4 files; next: run `npm run typecheck`."
- File summary example:
  - **Added:** `src/components/Button.tsx`
  - **Modified:** `tsconfig.json`
  - **Next:** `npm run build`

## Contact the human
- After finishing requested edits, end with a single clear question for next steps, for example: "Run Storybook now, or publish the package?"

## Update these docs as needed
When following these instructions, mistakes will happen. When a user has to make a correction, ask if edits to this document would prevent similar mistakes in the future.

- When you identify a gap or ambiguity in these instructions, propose an update to the human.
- Await confirmation before making changes in this doc, unless the human has already requested the update.
