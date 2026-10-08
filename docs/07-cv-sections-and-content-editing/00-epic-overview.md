# Epic 7: CV Sections and Content Editing

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 2 — Core authoring

## Dependencies
Depends on E2 and E6.

## Stories
- [1. Edit profile and contact](./01-edit-profile-and-contact.md)
- [2. Edit professional summary](./02-edit-professional-summary.md)
- [3. Manage work experience](./03-manage-work-experience.md)
- [4. Manage education](./04-manage-education.md)
- [5. Manage skills](./05-manage-skills.md)
- [6. Support additional standard sections](./06-support-additional-standard-sections.md)
- [7. Support custom sections and fields](./07-support-custom-sections-and-fields.md)
- [8. Reorder sections](./08-reorder-sections.md)
- [9. Handle incomplete and empty sections](./09-handle-incomplete-and-empty-sections.md)
- [10. Test section order and persistence](./10-test-section-order-and-persistence.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
