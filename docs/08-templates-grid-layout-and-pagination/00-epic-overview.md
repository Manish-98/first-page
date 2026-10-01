# Epic 8: Templates, Grid Layout, and Pagination

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 3 — Design and layout

## Dependencies
Depends on E2, E6, and E7.

## Stories
- [1. Build curated template library](./01-build-curated-template-library.md)
- [2. Apply template without changing facts](./02-apply-template-without-changing-facts.md)
- [3. Support blank-canvas layout](./03-support-blank-canvas-layout.md)
- [4. Define grid layout regions](./04-define-grid-layout-regions.md)
- [5. Add snapping and alignment guides](./05-add-snapping-and-alignment-guides.md)
- [6. Add typography controls](./06-add-typography-controls.md)
- [7. Add color spacing and margin controls](./07-add-color-spacing-and-margin-controls.md)
- [8. Add alignment sizing and columns](./08-add-alignment-sizing-and-columns.md)
- [9. Implement automatic pagination](./09-implement-automatic-pagination.md)
- [10. Warn about layout and pagination changes](./10-warn-about-layout-and-pagination-changes.md)
- [11. Support manual page breaks](./11-support-manual-page-breaks.md)
- [12. Support section placement overrides](./12-support-section-placement-overrides.md)
- [13. Prevent silent text shrinking](./13-prevent-silent-text-shrinking.md)
- [14. Implement undo and redo](./14-implement-undo-and-redo.md)
- [15. Support manual version snapshots](./15-support-manual-version-snapshots.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
