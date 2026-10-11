# Contact Form — Full-Page Form Composition

## Purpose
The Contact Form example composes all four form primitive components — Input, Select, Checkbox, and RadioGroup — with Card, Button, and layout components into a realistic, complete contact form page. It demonstrates how form molecules integrate with the rest of the design system in context.

## Related
- [Input component](../components/molecules/input/input.spec.md)
- [Select component](../components/molecules/select/select.spec.md)
- [Checkbox component](../components/molecules/checkbox/checkbox.spec.md)
- [RadioGroup component](../components/molecules/radiogroup/radiogroup.spec.md)

## Contract

### Inputs
User interaction with form fields — typing, selecting, checking, and submitting.

### Outputs
A complete, interactive contact form page. Form submission validates required fields and shows a browser alert for illustration purposes when valid. Canceling does not submit.

### Guarantees / Constraints
- All form controls are functional — input, selection, and checkbox state all work.
- The Cancel button does not trigger form submission.
- Required fields present validation feedback both during field interaction and form submission.

## Behavior

The page renders a centered form card with all four form control types. Users can interact with each control independently. Submitting the form validates all required fields together. When any required field is invalid, every invalid field enters its error state in the same submit attempt. When required fields are valid, submitting triggers an illustrative response. Canceling leaves the form unchanged.

**Inline required validation:** A required field that receives input and is then cleared shows its error state before the next submit attempt.

## Interface

The page follows the standard layout: header at top, centered main content, footer at bottom. The main content contains a heading, introductory text, and a card holding the form. Fields are stacked vertically with consistent spacing.

Fields included:
- Full name (text input, required)
- Email address (email input, required)
- Reason for contact (dropdown select with placeholder, required)
- Preferred response time (radio group with a default selection)
- Agreement to privacy policy (checkbox)

Action buttons appear at the bottom of the form, right-aligned. The submit button sends the form; the cancel button is neutral and does not submit.

## Acceptance
1. Header, footer, and centered main content render correctly.
2. All five form controls render inside the card.
3. Required fields show a required indicator.
4. The select shows a placeholder as the initial option.
5. The radio group has a pre-selected default option.
6. Submitting the form triggers the submit handler.
7. The cancel button does not trigger submission.
8. The layout is readable on narrow viewports.
9. Submitting with multiple invalid required fields shows all required-field errors at once.
10. Clearing a required field after entering text shows inline validation feedback.
