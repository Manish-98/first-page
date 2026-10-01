# Epic 12: MVP Acceptance and Release Readiness

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 5 — Release readiness

## Dependencies
Depends on the release candidate and evidence from E1–E11.

## Stories
- [1. Publish MVP acceptance checklist](./01-publish-mvp-acceptance-checklist.md)
- [2. Validate critical journey on deployed build](./02-validate-critical-journey-on-deployed-build.md)
- [3. Verify feature-preview workflow](./03-verify-feature-preview-workflow.md)
- [4. Test deployed preview](./04-test-deployed-preview.md)
- [5. Validate exported PDF quality](./05-validate-exported-pdf-quality.md)
- [6. Verify local-first and credential boundaries](./06-verify-local-first-and-credential-boundaries.md)
- [7. Document known limitations](./07-document-known-limitations.md)
- [8. Complete release review](./08-complete-release-review.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
