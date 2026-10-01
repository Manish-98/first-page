# Story 4.7: Implement Save As

## Context
Part of Epic 4: Project-File Persistence and Portability. This is an independently reviewable increment toward the MVP.

## Goal
Deliver implement save as with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Save an existing project to a new destination and verify a separate file is created and becomes the active target only after success.
- [ ] **Failure and boundary behavior:** Cancel or simulated write failure leaves the original target active and current content intact.
- [ ] **Scope boundary:** Do not silently overwrite the original destination.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 4 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
