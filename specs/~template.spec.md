# Spec

## Purpose
Briefly describe what this thing is and why it exists. Focus on intent, not implementation.

## Related
Links to related specs, docs, designs, or references (no todo links).

## Contract
Required in every spec. Describe the inputs and outputs.

### Inputs
- Requests, parameters, events, config, environment, user actions, etc.

### Outputs
- Responses, rendered UI, side effects, persisted data, emitted events, etc.

### Guarantees / Constraints
- Invariants, ordering, idempotency, auth expectations, performance expectations, etc.

## Behavior
Describe how this behaves in practice.

- Happy path
- Alternate paths
- Empty / error states
- Edge cases worth explicitly calling out

Avoid implementation details; focus on observable behavior.

Prefer affirmative language — state what should happen rather than what should not. Negative qualifiers ("never", "don't", "avoid") are load-bearing: if skimmed over, they reverse the meaning entirely. Affirmative statements ("always", "use X") degrade gracefully under skimming — the core intent survives even if the emphasis is lost.

## Interface
How will the end users / consumers interact with this?

For UI, include layout, content, animation, and accessibility affordances. For APIs and libraries, include ergonomics and usage patterns.

## Acceptance
Define what "done" means in testable terms.

- Acceptance criteria (user- or system-observable)
- Test notes (unit / integration / e2e as appropriate)
- Any required logging, metrics, or signals
