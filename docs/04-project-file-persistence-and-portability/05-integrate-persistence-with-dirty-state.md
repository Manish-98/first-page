# Story 4.5: Integrate persistence with dirty state

## Context
Part of Epic 4: Project-File Persistence and Portability. This is an independently reviewable increment toward the MVP.

## Goal
Deliver integrate persistence with dirty state with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Save a fixture with all standard section types, two repeated entries, a custom field, Unicode, reordered sections, and non-default layout; reopen it.
- [ ] **Failure and boundary behavior:** Assert deep equality of all modeled content/order/layout after reopen; missing, duplicated, or reordered fields fail the test.
- [ ] **Scope boundary:** Do not count a file existing or parsing as a successful round-trip.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 4 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
