# Form Validation UX — Todo

Cross-cutting concerns for error display across all form components (Input, Checkbox, RadioGroup, Select).

## Sooner
- [x] Error display without layout shift: Error messages currently push surrounding content out of place when they appear. Decide on and implement one of these approaches consistently across all form components:
  - **Inline icon:** Show a ⚠️ or red `!` inline; reveal full message as a floating tooltip on hover.
  - **Floating text:** Error text is absolutely positioned above (or below) the form element so it overlays without affecting flow.
  - **Reserved space:** Always allocate space for the error message below the field so it fills in without shifting content.
  - Component-specific notes: Checkbox label wraps to 2nd line on error; Input "Clear error" button is pushed down on error.

## Later
- [ ] TBD

## Backlog
- [ ] TBD
