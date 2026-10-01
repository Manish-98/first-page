# Epic 10: Optional AI Writing Assistant

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 4 — AI, gated by security validation

## Dependencies
Depends on E2 and E7; official authorization/security is a release gate.

## Stories
- [1. Define provider-neutral AI contract](./01-define-provider-neutral-ai-contract.md)
- [2. Implement OpenAI adapter](./02-implement-openai-adapter.md)
- [3. Configure bring-your-own key](./03-configure-bring-your-own-key.md)
- [4. Validate supported OpenAI sign-in](./04-validate-supported-openai-sign-in.md)
- [5. Review whole-CV writing quality](./05-review-whole-cv-writing-quality.md)
- [6. Generate fact-grounded rewrites](./06-generate-fact-grounded-rewrites.md)
- [7. Show before-and-after suggestions](./07-show-before-and-after-suggestions.md)
- [8. Accept or reject suggestions individually](./08-accept-or-reject-suggestions-individually.md)
- [9. Flag unsupported claims](./09-flag-unsupported-claims.md)
- [10. Map conversation to CV model](./10-map-conversation-to-cv-model.md)
- [11. Provide contextual AI actions](./11-provide-contextual-ai-actions.md)
- [12. Support explicit whole-CV review](./12-support-explicit-whole-cv-review.md)
- [13. Handle provider errors and retries](./13-handle-provider-errors-and-retries.md)
- [14. Show usage and cost where supported](./14-show-usage-and-cost-where-supported.md)
- [15. Support opt-in provider fallback](./15-support-opt-in-provider-fallback.md)
- [16. Test AI factual integrity](./16-test-ai-factual-integrity.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.
