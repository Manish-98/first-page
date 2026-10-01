# Story 7.5: Manage skills

## Context
Part of Epic 7: CV Sections and Content Editing. This is an independently reviewable increment toward the MVP.

## Goal
Deliver manage skills with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Add, rename, reorder, and remove multiple skills; model, reopened project, and PDF reflect the final list in the same order.
- [ ] **Failure and boundary behavior:** An empty skill value is clearly rejected or excluded without creating a phantom bullet.
- [ ] **Scope boundary:** Do not silently rewrite or deduplicate user-provided skill names.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 7 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
