# Story 7.4: Manage education

## Context
Part of Epic 7: CV Sections and Content Editing. This is an independently reviewable increment toward the MVP.

## Goal
Deliver manage education with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Create two education entries with different institutions and qualifications; edit, reorder, save/reopen, and verify both entries.
- [ ] **Failure and boundary behavior:** Omitting optional dates/details does not block valid entries or introduce fabricated values.
- [ ] **Scope boundary:** Do not restrict the model to a single education record.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 7 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
