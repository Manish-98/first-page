# Story 8.8: Add alignment sizing and columns

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add alignment sizing and columns with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Change one supported layout/style value (for example, two-column proportion, font size, margin, or spacing) and verify the preview reflects the exact selected value.
- [ ] **Failure and boundary behavior:** Save/reopen and export preserve the value; invalid/out-of-bounds values are rejected or warned about without hiding content.
- [ ] **Scope boundary:** Do not support unrestricted overlapping/freeform placement in this story.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
