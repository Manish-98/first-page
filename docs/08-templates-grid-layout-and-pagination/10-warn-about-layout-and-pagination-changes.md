# Story 8.10: Warn about layout and pagination changes

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver warn about layout and pagination changes with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Start with a CV that fits on one A4 page, make a supported layout change that causes content to cross the page boundary, and verify a visible pagination/layout-change warning identifies that the change affected pagination and offers the documented user action to continue, review, or revert.
- [ ] **Failure and boundary behavior:** Dismiss or act on the warning and verify the resulting choice is honored; save/reopen and export the document without clipped or omitted text, and preserve manual break/placement settings where supported.
- [ ] **Scope boundary:** Do not satisfy this story merely because content automatically flows to another page, and do not silently shrink text, hide content, or move content outside the printable area.
- [ ] **Verification evidence:** Add an interaction test that deliberately changes pagination and asserts the warning and its action; record the resulting page count and user action in the PR.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test an actual pagination-changing layout edit, the warning state, the user's response, and the resulting persisted/exported layout.
