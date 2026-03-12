# Knock Out TODOs

Identify and implement the easiest open TODO items in this repository. The user may specify how many to tackle — default is 5 if not stated.

Number to tackle: $ARGUMENTS (default 5 if blank)

## How to find TODOs

Use the Grep tool to search for `^\- \[ \]` across all `specs/**/*.todo.md` files. Read the results and assess relative difficulty. Skip items that are TBD placeholders or that clearly require decisions from the user (e.g. "open questions", "TBD", or items requiring new full components with no spec yet).

## How to choose which items to tackle

Prefer items that:
- Have clear, self-contained requirements
- Affect existing components (additions/tweaks over full new components)
- Can be done with file edits alone — CSS changes, adding props, small behavior additions
- Do not require user input or clarification to proceed

Avoid items that:
- Say "TBD" or leave requirements unresolved
- Require a brand-new component with no existing skeleton
- Involve routing, backend, or third-party integrations
- Would require asking the user a question before starting

## Workflow

1. Read all unchecked TODOs using Grep. Scan quickly — you do not need to read every spec file in full.
2. Read the relevant source files (components, CSS, stories) for the items you've chosen using the Read tool.
3. Implement the changes using the Edit and Write tools.
4. Mark each completed item done by editing its `.todo.md` file directly — change `- [ ]` to `- [x]` using the Edit tool. Do not use terminal commands to do this.
5. Update `CHANGELOG.md` under `## WIP` with a concise summary of what was done (max ~5 bullets, brief).
6. Run `npm run typecheck` once at the end to confirm everything compiles.

## Preferred tools and actions

- **Grep** — find TODO items and search source files
- **Read** — read component source, CSS, and stories before editing
- **Edit** and **Write** — make all changes including marking TODOs done and updating the CHANGELOG
- **Bash** — only for `npm run typecheck` at the end; avoid for anything else

Do not use Bash to check off boxes, list files, or search for patterns — use Grep and Read instead.

## Style rules

- Follow existing BEM naming (`nw-` prefix), motion tokens, and component conventions already established in the codebase
- Add or update Storybook stories for anything user-visible
- No new runtime dependencies
- Keep changes minimal and focused — do not refactor surrounding code that was not part of the TODO
