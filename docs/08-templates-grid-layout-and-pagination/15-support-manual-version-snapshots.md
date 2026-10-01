# Story 8.15: Support manual version snapshots

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support manual version snapshots with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Save a current project and open a supported older-version fixture; migration preserves known content and writes/recognizes the declared version.
- [ ] **Failure and boundary behavior:** A project declaring an unsupported future version is rejected before replacing the active document.
- [ ] **Scope boundary:** Do not silently downgrade or reinterpret unknown versions.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
