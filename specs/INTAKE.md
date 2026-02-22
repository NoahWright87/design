# Ideas intake

Too lazy to search for the right spec to update?  Throw your idea here and let the LLMs put it in the right place(s) later!

## AGENTS Instructions

When asked to, take any items listed below and organize put them into the appropriate TODO spec file.  Ideas may be vague, rambling, or half-baked.  If necessary, ask clarifying questions to determine what the user's intent was.  If a single item refers to multiple components or is a particularly large/complex idea, it can be broken into multiple separate TODOs in the relevant `*.todo.spec`.

If a requested item already exists in the TODO spec, that implies a higher priority.  Tell the user and ask if they want to add any details or move it higher in the TODO spec.

When you have emptied the submissions section below, leave behind a single bullet:

```
- *Add your ideas here*.
```

## Submissions

- Make sure Select can scroll if there are a bunch of items.  Maybe a prop to control that limit?
- Pill:
    - Default is purple?  That seems strange.  Default should be plain-ish, right?
    - Option to make text appear on hover, like a speech bubble almost.
    - href property that makes it become outlined on hover?
- Header: labels should appear on hover for top icons.  Should be a fade animation.
- Container borders are too subtle, I can barely see them.  By default, there should be side borders that are a little more solid, maybe with a gradient/shadow or something.  A `noBorders` prop should exist to disable them.
- Form components' error waggle: when the error message appears it shifts the element.
    - Provide an option to just show a ⚠️ or some sort of red `!` and show the message on hover.
    - Maybe have the text appear slightly above the element?  The important thing is to not shift things around, so it should appear like it's floating above the form element.
    - Maybe there should just always be extra space to form elements so there's room for the error?
    - Example: on Checkbox, the label breaks to a 2nd line when the error appears
    - Example: on Input, "Clear error" button is pushed down when the error appears
- RadioGroup needs more whimsical animations.  We can discuss the specifics. 
- Cards should have an easy way to make them usable for grids.  Perhaps a size prop?  For smaller cards, they could line up horizontally and overflow to the next line.  Of course that'd mean on small screens they might stack vertically.
    - Do we need a `CardGroup` component?  I'd prefer to keep things simple, but if this makes it easier to control maybe it's at least an option for more complex card arrangements?
- BUG: Container background image isn't visible!
- Might as well give a `children` example for Header just like Footer has.
- What's even the point of `Layout`?  Seems like it's a useless wrapper.  Can we get rid of it?
- In the menu examples that are right-aligned, when the menu pops out a scrollbar appears and the menu shifts.
- Is the Personal Portfolio example using all my latest components to their fullest?  It's supposed to be the complete example of what the design system can do.
- Need to make an action for this intake form so I can just say `/intake`.
- The runtime-generated images create weird stuff in the Storybook playground.  We should pre-generate some images (user will do that) and put them in an images folder.  Then we can have nonsense use those placeholders in Storybook.
- Anything else to do for headings? 🤔🤔
- Input should have a default email validation and show that off in the error example in Storybook.
- RadioGroup inline validation example has no button to press and you can't deselect radios, so there's no way to trigger an error.
- Dismissable Pill should be animated.  As with everything else, there should be an extra whimsical version of the animation that's the default. 
- Scrollbars for cards?  Good idea or not? 🤔🤔
- Portfolio projects page, all the projects have the same description, skills, etc?  Are they not using the Nonsense util?
