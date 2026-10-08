# Story 8.15: Support manual version snapshots

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support manual version snapshots with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Create a named/manual snapshot of the current CV content and design state, make subsequent content and layout edits, then restore the snapshot and verify the exact captured content and design state is restored.
- [ ] **Failure and boundary behavior:** Attempt to restore an absent or invalid snapshot and verify a clear error with the current document unchanged; restoring an existing snapshot must not silently merge unrelated later edits into the snapshot.
- [ ] **Scope boundary:** Do not satisfy this story with project schema migration, save/open, or automatic browser recovery; snapshot creation must be an explicit user action.
- [ ] **Verification evidence:** Add an automated test covering create → edit → restore and invalid/absent snapshot cases, including assertions for both content and presentation state.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record the snapshot identifier/name, the changes made after creation, and the exact restoration assertions in the PR.
