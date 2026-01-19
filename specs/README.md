# Specs — Source of Truth

This directory contains human-readable, plain Markdown specifications that define the intended behavior and appearance of components and composed examples. These specs are the source of truth for tests and for implementation work.

## Purpose
- Describe current behavior (as-is) of existing components and examples.
- Serve as instructions for implementation and refinement by an LLM and by engineers.
- Drive tests: acceptance criteria in specs should be directly validated by automated tests (e.g., Playwright visual and interaction tests).

## Directory Structure
- `design-system.spec.md` — Root spec describing the entire system and atomic design philosophy.
- `components/` — Per-component specs (e.g., `button/button.spec.md`).
- `examples/` — Higher-level, composed example specs (e.g., `address-form.md`, `portfolio-site.md`). Use these to describe multi-component pages or flows.

## Folder & Naming Conventions
- Components follow their atomic level implicitly via composition; we do not enforce directory prefixes for atoms/molecules/organisms at this time.
- Specs live under `specs/components/<name>/*.md` and examples under `specs/examples/*.md`.
- Each component has a `.spec.md` for current behavior and a `.todo.md` for future backlog items.
- Root philosophy and design decisions live in `design-system.spec.md` and `design-system.todo.md`.

## Authoring Conventions
- Format: Plain Markdown.
- Scope: Describe the current behavior/appearance (not future aspirations). Capture future ideas in a per-component backlog file (`*.todo.md`).
- Source-of-truth: Acceptance Criteria sections define what tests must verify. Tests should map to these criteria explicitly.
- Be specific but pragmatic: Prefer intent-based assertions over pixel-perfect expectations to allow platform differences.

### Backlog Files (`*.todo.md`)
- Purpose: Store future enhancements, half-baked ideas, and under-described features for each component.
- Location: Place next to the component spec (e.g., `components/button/button.todo.md`).
- Content: Bulleted lists with brief rationale and rough acceptance ideas; not binding until promoted into the main spec.
- Reference: Link to the backlog from the component spec.

## Component Spec Template
Each component spec should generally include:

1. Overview
	- Purpose and brief implementation summary.
	- Design system integration, if any.
2. API
	- Props and their types/semantics.
	- DOM shape and key attributes.
3. Visuals
	- Default appearance and any variants/sizes, if implemented.
4. Interactions
	- Pointer, keyboard, focus, and any stateful behaviors.
5. Accessibility
	- Names, roles, ARIA, focus order, and assistive behavior.
6. Constraints & Non-Goals
	- What is explicitly not supported today.
7. Acceptance Criteria (Tests)
	- Numbered, testable statements the suite should validate.
8. Current Example & Test Mapping
	- Reference relevant stories and test baselines (e.g., visual snapshots).
9. Future Extensions (Aspirational)
	- Brief list of planned/possible enhancements (not yet implemented).

See [components/button/button.spec.md](components/button/button.spec.md) for a complete example.

## Tests Integration
- Visual tests should validate presence and intent, not pixel perfection. Tolerate minor platform differences.
- Interaction tests should cover activation, focus management, keyboard support, and state changes spelled out in Acceptance Criteria.
- Keep test names and snapshots aligned with spec sections for traceability.

## Sketches & Diagrams (Optional)
- You may embed rough sketches or diagrams in example specs to convey layout/intent. Tests should compare overall intent (structure and key affordances), not exact pixels.

## Review & Evolution
- Start with current behavior. When requirements change, update the spec first, then adjust implementation and tests to match.
- Keep specs concise; prefer clear bullet points and numbered criteria over prose.

## Notes
- Storybook example pages live under `stories/examples/` in the codebase; specs for multi-component compositions live here under `specs/examples/` to define intent and acceptance.