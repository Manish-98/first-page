# Epic 3: New CV Creation and Onboarding

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 1 — Prototype

## Dependencies
Depends on E2.

## Stories
- [1. Build four-path start screen](./01-build-four-path-start-screen.md)
- [2. Create blank CV](./02-create-blank-cv.md)
- [3. Create starter CV](./03-create-starter-cv.md)
- [4. Create CV from template](./04-create-cv-from-template.md)
- [5. Enter shared workspace](./05-enter-shared-workspace.md)
- [6. Design initial and empty states](./06-design-initial-and-empty-states.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
