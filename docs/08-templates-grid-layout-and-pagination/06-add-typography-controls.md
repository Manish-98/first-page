# Story 8.6: Add typography controls

## Context
This story belongs to Epic 8: Templates, Grid Layout, and Pagination. It contributes to the MVP in a small, reviewable increment.

## Goal
Deliver add typography controls using the shared CV model and existing architectural boundaries.

## Acceptance criteria
- [ ] The capability works as described by the story title and epic purpose.
- [ ] Relevant state is represented consistently in the shared model and persists where applicable.
- [ ] Empty, boundary, and failure states are handled explicitly; user content is not silently lost.
- [ ] Appropriate unit, integration, or browser tests cover the expected path and meaningful edge cases.
- [ ] Clean-code/layered-architecture guidelines are followed and the PR records verification steps and known limitations.

## Constraints
- Keep the app local-first: explicit project save/open, no accounts/server-side CV storage, no hidden autosave/recovery copies.
- Project files exclude API keys, tokens, and credentials.
- Editing, saving, and PDF export must not require AI credentials.
- AI features, when relevant, are opt-in, grounded in user-provided facts, and never silently applied.

## Dependencies
Depends on E2, E6, and E7. See the [MVP roadmap](../README.md); link dependency issues when implementation is authorized.

## Verification
Test the expected path and failure cases. Validate the deployed feature preview before review/merge when preview infrastructure is available.
