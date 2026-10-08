# Story 2.2: Model standard and custom sections

## Context
Part of Epic 2: CV Domain Model and Application Foundation. This is an independently reviewable increment toward the MVP.

## Goal
Deliver model standard and custom sections with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Create a custom section with a user-defined label and two custom fields; edit, reorder, save/reopen, and verify labels, values, and order.
- [ ] **Failure and boundary behavior:** Unknown custom labels survive serialization and render with a safe default style.
- [ ] **Scope boundary:** Do not require a built-in enum change for each user-created label.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 2 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
