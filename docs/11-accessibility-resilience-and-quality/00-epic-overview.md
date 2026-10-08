# Epic 11: Accessibility, Resilience, and Quality

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 5 — Hardening

## Dependencies
Cross-cutting quality work for all epics.

## Stories
- [1. Use semantic accessible controls](./01-use-semantic-accessible-controls.md)
- [2. Verify keyboard workflows](./02-verify-keyboard-workflows.md)
- [3. Manage focus and announcements](./03-manage-focus-and-announcements.md)
- [4. Verify contrast and non-color cues](./04-verify-contrast-and-non-color-cues.md)
- [5. Test Unicode and long content](./05-test-unicode-and-long-content.md)
- [6. Test corrupted-file recovery](./06-test-corrupted-file-recovery.md)
- [7. Test unsaved-change scenarios](./07-test-unsaved-change-scenarios.md)
- [8. Add end-to-end critical journey](./08-add-end-to-end-critical-journey.md)
- [9. Add visual and PDF regression checks](./09-add-visual-and-pdf-regression-checks.md)
- [10. Add performance checks](./10-add-performance-checks.md)
- [11. Verify core offline operation](./11-verify-core-offline-operation.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
