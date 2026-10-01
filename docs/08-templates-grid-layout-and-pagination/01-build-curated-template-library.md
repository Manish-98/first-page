# Story 8.1: Build curated template library

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver build curated template library with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Open the template gallery and apply each curated template to a CV containing known profile and experience values; preview and editor show the selected design.
- [ ] **Failure and boundary behavior:** Missing preview assets produce a usable fallback; content remains editable and preserved.
- [ ] **Scope boundary:** Marketplace and arbitrary third-party templates are out of scope.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
