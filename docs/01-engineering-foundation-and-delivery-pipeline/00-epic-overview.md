# Epic 1: Engineering Foundation and Delivery Pipeline

## Purpose
Deliver the capabilities in this epic as small, testable increments while preserving the product-wide constraints in the roadmap.

## Phase
Phase 0 — Foundation

## Dependencies
Initial foundation before broad feature work.

## Stories
- [1. Initialize React TypeScript Vite](./01-initialize-react-typescript-vite.md)
- [2. Establish layered architecture](./02-establish-layered-architecture.md)
- [3. Configure strict static analysis](./03-configure-strict-static-analysis.md)
- [4. Configure test foundations](./04-configure-test-foundations.md)
- [5. Add GitHub Actions PR checks](./05-add-github-actions-pr-checks.md)
- [6. Configure GitHub Pages previews](./06-configure-github-pages-previews.md)
- [7. Document development commands](./07-document-development-commands.md)

## Guardrails
- Keep business rules in domain/application layers; isolate UI, AI provider, and PDF implementation details.
- Preserve user-authored facts and work; never silently discard or invent CV content.
- Core editing, explicit project save/open, local checks, and PDF export work without AI credentials.
- No browser autosave, hidden recovery copies, accounts, or server-side CV storage without an explicit product decision.
- Follow issue → branch → PR → checks/preview → preview test → review/approval → merge.

## Delivery structure

- Epic tracker: [Issue #9](https://github.com/Manish-98/first-page/issues/9)
- Epic integration branch: `epic/1-engineering-foundation`
- Epic pull request targets `main`.
- Story work uses stacked pull requests when a story depends on an earlier story; independent stories may branch directly from the Epic branch and run as parallel pull requests.
- Story pull requests target their immediate dependency branch when stacked, or `epic/1-engineering-foundation` when parallel.
- Story branches and pull requests are kept focused on one story; the Epic branch is the integration point before merging the Epic into `main`.

