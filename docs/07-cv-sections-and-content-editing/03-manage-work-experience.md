# Story 7.3: Manage work experience

## Context
Part of Epic 7: CV Sections and Content Editing. This is an independently reviewable increment toward the MVP.

## Goal
Deliver manage work experience with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Create two roles with distinct employers, titles, dates, and descriptions; reorder them and verify the order and fields in model, save/reopen, and export.
- [ ] **Failure and boundary behavior:** Incomplete optional dates remain represented and produce a warning rather than disappearing.
- [ ] **Scope boundary:** Do not infer or fabricate career facts or metrics.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 7 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
