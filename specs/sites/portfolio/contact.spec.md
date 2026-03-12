# Personal Portfolio Site — Contact Page

## Purpose
The Contact page provides a way for visitors to reach the portfolio owner. It presents a contact form followed by links to fictional social profiles, and shows a success modal after form submission to demonstrate the Modal component in context.

## Related
- [Portfolio Site Overview](../portfolio.spec.md)
- [Modal component](../../components/organisms/modal/modal.spec.md)

## Contract

### Inputs
User interaction: filling in form fields and submitting the form.

### Outputs
A contact form page. After submission, a success modal appears. Social links provide navigable placeholders.

### Guarantees / Constraints
- All text content is generated from Nonsense Atom categories, except the social link section title.
- The modal appears only after form submission.
- Social platform names are fictional (from the Nonsense Atom).

## Behavior

The page is primarily static. When the user submits the form, a success modal appears. Closing the modal returns to the form state. Social links are navigable but point to placeholder destinations.

## Interface

### Page Structure
- Standard site header at top.
- Introductory paragraph providing context.
- Centered, constrained-width form section.
- Social links section below the form.
- Standard site footer.

### Contact Form
The form includes:
- Name (text, required)
- Email (email, required)
- Subject (text)
- Message (multi-line text, required)
- Submit button with a Nonsense Atom call-to-action label

### Success Modal
After submission, a modal displays a short title and message using Nonsense Atom copy, with a close button to dismiss.

### Social Links
A section titled "Connect With Me" (or similar) lists four to five fictional social platform names from the Nonsense Atom, each as a clickable link to a placeholder destination.

### Responsive Behavior
Single-column layout on small screens; form and links centered on larger screens. Hamburger menu on small screens.

## Acceptance
1. An introductory paragraph is visible above the form.
2. The form contains all four field types with appropriate labels.
3. The submit button is visible and clickable.
4. Submitting the form opens the success modal.
5. The success modal shows a title and message from the Nonsense Atom.
6. The modal has a close button and is keyboard-dismissible.
7. The social links section shows four to five platform names as clickable links.
8. The layout is fully responsive.
9. The hamburger menu functions on small screens.
10. Header and footer are present and consistent.
