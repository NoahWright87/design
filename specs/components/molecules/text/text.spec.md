# Text — Semantic Body Copy with Formatting Options

## Purpose
Text renders a semantic paragraph (or inline span) for body content. It provides a set of formatting props — truncation, alignment, tone, copy-to-clipboard — so consumers can control presentation without writing custom CSS.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Paragraph content (`children`, required).
- Optional `as` — override the rendered HTML element (default: `"p"`). Accepts any valid HTML tag string.
- Optional `inline` — renders as a `<span>` instead of a block element.
- Optional `truncate` — clips text to a single line with a trailing ellipsis.
- Optional `maxLines` — clamps text to N lines with a trailing ellipsis.
- Optional `align` — text alignment: `"left"`, `"center"`, `"right"`, `"justify"`.
- Optional `balance` — applies `text-wrap: balance` for natural multi-line breaks.
- Optional `tone` — contextual color: `"muted"`, `"subtle"`, `"error"`, `"success"`.
- Optional `isCopyable` — shows a clipboard copy button (⎘) on hover; confirms with ✓ for 1.5 s.
- Optional `className` — additional CSS class name.
- Optional `style` — inline CSS style overrides.

### Outputs
A styled text element reflecting the selected semantic element, formatting options, and tone.

### Guarantees / Constraints
- The `as` prop does not alter any styling; it only changes the rendered HTML element.
- `inline` and `as` are independent — `inline` forces a `<span>`; `as` accepts any tag.
- `truncate` and `maxLines` are mutually exclusive in effect; `maxLines` takes precedence when both are provided.
- `isCopyable` uses the Clipboard API, which is only available in secure contexts (HTTPS/localhost). In unsupported environments the button is hidden.
- Copy behavior is client-side only; SSR-safe (the button is not rendered until interaction is possible).

## Behavior

**Default:** Renders a `<p>` with body text and no additional styling.

**Truncation (`truncate`):** Single line, overflow hidden, `text-overflow: ellipsis`. Content is still accessible (full text in DOM).

**Line clamp (`maxLines`):** Clamps to N lines using `-webkit-line-clamp`. Content beyond the limit is hidden.

**Tone:** Changes the text color to a semantic role — muted (low opacity), subtle (slightly reduced), error (danger color), success (confirm color).

**Copyable (`isCopyable`):** A ⎘ button appears positioned at the end of the text on hover. Clicking copies the element's text content to the clipboard. The button shows ✓ for 1.5 s after a successful copy, then resets. The copy button is `aria-hidden` from the text's readable content.

## Interface

Text inherits the surrounding font family, size, and line height. The tone variants use design system color tokens (`--foreground` at reduced opacity for muted/subtle, `--danger` for error, `--confirm` for success). The copy button is absolutely positioned and does not shift surrounding layout.

## Acceptance
1. Renders the provided content inside the appropriate element.
2. The `as` prop changes the rendered HTML element without altering styling.
3. `inline` renders a `<span>` instead of a block element.
4. `truncate` clips to one line with an ellipsis.
5. `maxLines` clamps to N lines with an ellipsis.
6. `align` correctly positions text for each option.
7. `balance` applies natural line-break wrapping.
8. Each `tone` value renders the correct color from the design system token.
9. When `isCopyable` is set, the ⎘ button appears on hover and copies text content to the clipboard.
10. After a successful copy, the button shows ✓ for 1.5 s then resets.
11. `className` and `style` are applied to the root element.
