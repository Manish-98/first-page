# Epic 5: PDF Export

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 1 — Prototype and export

## Dependencies
Depends on E2; basic PDF is part of the vertical slice.

## Stories
- [1. Implement basic PDF renderer](./01-implement-basic-pdf-renderer.md)
- [2. Use A4 dimensions](./02-use-a4-dimensions.md)
- [3. Render typography and wrapping](./03-render-typography-and-wrapping.md)
- [4. Support multipage output](./04-support-multipage-output.md)
- [5. Preserve document on export errors](./05-preserve-document-on-export-errors.md)
- [6. Add one-click PDF export](./06-add-one-click-pdf-export.md)
- [7. Isolate renderer behind boundary](./07-isolate-renderer-behind-boundary.md)
- [8. Add PDF regression fixtures](./08-add-pdf-regression-fixtures.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
