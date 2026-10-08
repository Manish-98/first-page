# Epic 9: Guided Creation and Local Quality Checks

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 4 — Guided assistance

## Dependencies
Depends on E2 and E7.

## Stories
- [1. Build guided form flow](./01-build-guided-form-flow.md)
- [2. Support adaptive progression](./02-support-adaptive-progression.md)
- [3. Add contextual section guidance](./03-add-contextual-section-guidance.md)
- [4. Add live local quality warnings](./04-add-live-local-quality-warnings.md)
- [5. Add pre-export checklist](./05-add-pre-export-checklist.md)
- [6. Allow export with noncritical warnings](./06-allow-export-with-noncritical-warnings.md)
- [7. Ensure local checks work offline](./07-ensure-local-checks-work-offline.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
