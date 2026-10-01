# Epic 2: CV Domain Model and Application Foundation

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 0 — Foundation / Phase 1 slice

## Dependencies
Depends on E1.

## Stories
- [1. Define typed CV schema](./01-define-typed-cv-schema.md)
- [2. Model standard and custom sections](./02-model-standard-and-custom-sections.md)
- [3. Separate content from presentation](./03-separate-content-from-presentation.md)
- [4. Validate document content](./04-validate-document-content.md)
- [5. Version project schema](./05-version-project-schema.md)
- [6. Define application use cases](./06-define-application-use-cases.md)
- [7. Track document dirty state](./07-track-document-dirty-state.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
