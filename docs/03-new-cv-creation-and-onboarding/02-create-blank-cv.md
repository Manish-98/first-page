# Story 3.2: Create blank CV

## Context
Part of Epic 3: New CV Creation and Onboarding. This is an independently reviewable increment toward the MVP.

## Goal
Deliver create blank cv with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Choose Blank CV and verify an empty editable document opens in the shared workspace with no personal/employment facts prefilled.
- [ ] **Failure and boundary behavior:** Edit a field, save/reopen, and verify the same empty/entered state is retained.
- [ ] **Scope boundary:** Do not insert realistic sample details into the blank path.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 3 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
