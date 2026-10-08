# Story 9.2: Support adaptive progression

## Context
Part of Epic 9: Guided Creation and Local Quality Checks. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support adaptive progression with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Enter profile/experience values, skip an optional step, go back, edit a previous answer, and continue; all entered values remain in the shared model.
- [ ] **Failure and boundary behavior:** Invalid required input identifies the field without clearing completed steps.
- [ ] **Scope boundary:** Do not create a separate form-only data store.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 9 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
