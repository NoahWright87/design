# AGENTS.md — Agent Instructions for this repository

## Purpose
This file provides explicit, agent-focused guidance for working in this repository. It is the authoritative location for how code-producing agents should behave here. Place this file at the repo root so agents automatically find it.

## Key rules (non-negotiable)
- Follow the instructions in this repository exactly.
- Do not add technologies, files, props, styles, or dependencies beyond what the repo's instruction file permits.
- No runtime side effects at import; maintain SSR-safety (no `window` access, no browser-only APIs at module top level).
- Peer dependencies only: `react`, `react-dom`. No runtime dependencies.
- If a requirement is impossible, stop and quote the exact blocking line from the instruction file.

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

## Commands and environment
- Use the repository root as the working directory for shell commands.
- On Windows (PowerShell) use `cd` to change directories. Example:

```powershell
cd C:\repos\design
npm install
npm run build
```

- Provide copyable commands in fenced code blocks and specify the shell when relevant.

## Testing and verification
- When you change code, run the smallest reasonable verification (typecheck, build, or focused tests).
- Share the exact commands run and the salient output (errors or success). Keep large logs trimmed to what matters.

## Progress reporting
- At task completion, report newly created/modified files and the commands you ran.
- If you cannot run checks in this environment, state which commands the human should run locally.
- Before committing or opening a PR, update `CHANGELOG.md` under `## WIP` with concise bullet points summarizing your changes; follow `CHANGELOG.md`'s guidance for moving WIP items into `## Version history` when releasing.

## Stop conditions
- If an instruction cannot be satisfied, quote the exact line from the original instruction that blocks you and stop. Do not guess or silently modify the requirement.
- If asked to publish or run destructive commands (for example `npm publish`), require explicit human confirmation.

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
