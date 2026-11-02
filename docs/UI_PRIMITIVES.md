# Shared UI primitives and accessibility baseline

## Scope

Shared presentation components live in `src/ui/components/`. They must remain
independent of CV domain rules and application use cases.

## Current primitives

- `AppLink` wraps a native anchor and provides consistent wordmark,
  navigation, and action-link presentation. It preserves native link semantics,
  keyboard activation, browser history, and support for standard anchor
  attributes.
- `ContentSection` provides a labelled semantic section and shared content
  width. The welcome and not-found pages use the same layout primitive.

Use native HTML elements for controls. Do not introduce a custom button, input,
select, or form abstraction until a real screen needs shared behavior; when
introduced, preserve native semantics and explicit accessible labels.

## Styling conventions

Global design tokens in `src/ui/styles.css` centralize the current color
palette, typography, spacing scale, pill radius, and focus-ring treatment.
Component styles consume these tokens rather than redefining the same values.
Use semantic HTML first, then add component classes for visual variants.

## Accessibility baseline

- Links remain real `<a>` elements with meaningful visible text or an
  accessible name.
- Navigation landmarks have an accessible label.
- Sections are labelled by their visible heading.
- Keyboard focus is visible through the global `:focus-visible` rule.
- Status information uses `role="status"`; status is not conveyed by color
  alone.
- Disabled and invalid control states should use native `disabled` and
  `aria-invalid` plus associated text when form controls are introduced.
- Respect reduced-motion preferences in the shared stylesheet.

## Adding a primitive

1. Confirm at least two real consumers or a clearly shared interaction
   contract.
2. Prefer native HTML semantics and a small typed prop surface.
3. Keep content and business rules outside the primitive.
4. Add keyboard and accessible-name checks for interactive behavior.
5. Document any intentional exception to these conventions.
