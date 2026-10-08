# Epic 4: Project-File Persistence and Portability

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 1 — Prototype

## Dependencies
Depends on E2.

## Stories
- [1. Save portable project](./01-save-portable-project.md)
- [2. Open existing project](./02-open-existing-project.md)
- [3. Support file picker and fallbacks](./03-support-file-picker-and-fallbacks.md)
- [4. Validate invalid project files](./04-validate-invalid-project-files.md)
- [5. Integrate persistence with dirty state](./05-integrate-persistence-with-dirty-state.md)
- [6. Warn before discarding unsaved work](./06-warn-before-discarding-unsaved-work.md)
- [7. Implement Save As](./07-implement-save-as.md)
- [8. Exclude credentials from projects](./08-exclude-credentials-from-projects.md)
- [9. Test save/open round trip](./09-test-save-open-round-trip.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
