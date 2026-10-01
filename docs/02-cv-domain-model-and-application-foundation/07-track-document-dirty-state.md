# Story 2.7: Track document dirty state

## Context
Part of Epic 2: CV Domain Model and Application Foundation. This is an independently reviewable increment toward the MVP.

## Goal
Deliver track document dirty state with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Edit a field, then attempt to open another project; save/discard/cancel choices appear when dirty.
- [ ] **Failure and boundary behavior:** Cancel preserves the current values; only successful save of the current revision clears dirty state; failed save keeps it dirty.
- [ ] **Scope boundary:** Canceling a file picker must not discard edits.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 2 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
