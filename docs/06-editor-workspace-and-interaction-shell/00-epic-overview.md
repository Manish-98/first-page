# Epic 6: Editor Workspace and Interaction Shell

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 2 — Core authoring

## Dependencies
Depends on E2–E5.

## Stories
- [1. Build three-area workspace](./01-build-three-area-workspace.md)
- [2. Show stacked A4 pages](./02-show-stacked-a4-pages.md)
- [3. Add canvas zoom](./03-add-canvas-zoom.md)
- [4. Build context-sensitive properties](./04-build-context-sensitive-properties.md)
- [5. Support inline editing](./05-support-inline-editing.md)
- [6. Add sidebar section actions](./06-add-sidebar-section-actions.md)
- [7. Provide keyboard alternatives](./07-provide-keyboard-alternatives.md)
- [8. Stabilize selection and focus](./08-stabilize-selection-and-focus.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
