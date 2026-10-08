# Story 8.5: Add snapping and alignment guides

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add snapping and alignment guides with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Drag or move a layout item within the supported grid near a grid boundary or aligned peer edge; verify it snaps to the documented target when within the snap threshold and a visible alignment guide identifies the corresponding row, column, or edge while alignment is active.
- [ ] **Failure and boundary behavior:** Move the same item outside the snap threshold and verify it can remain at the non-snapped position; moving or resizing it must not create unrestricted overlap that hides content.
- [ ] **Scope boundary:** Do not satisfy this story with generic font, margin, spacing, or column controls alone, and do not introduce unrestricted freeform placement.
- [ ] **Verification evidence:** Add an interaction test covering a near-threshold snap, a visible guide, and an outside-threshold position; verify the resulting layout persists through save/reopen.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the snapping threshold, guide visibility, and boundary behavior. Record the observed target and persistence result in the PR.
