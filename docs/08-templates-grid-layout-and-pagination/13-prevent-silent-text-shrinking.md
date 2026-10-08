# Story 8.13: Prevent silent text shrinking

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver prevent silent text shrinking with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Use a CV whose long experience description crosses an A4 page boundary; verify content flows or a visible warning/override state appears.
- [ ] **Failure and boundary behavior:** Save/reopen and export; no text is clipped or omitted and manual break/placement settings persist where supported.
- [ ] **Scope boundary:** Do not silently shrink font size or hide content outside the printable area.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
