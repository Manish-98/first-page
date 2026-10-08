# Story 12.2: Validate critical journey on deployed build

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver validate critical journey on deployed build with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Browser test creates a CV, edits profile/experience, saves project, reopens it, and exports PDF; assert key values and download presence.
- [ ] **Failure and boundary behavior:** Test fails on lost data, missing controls, failed download, or unexpected console errors.
- [ ] **Scope boundary:** Do not replace the end-to-end journey with isolated component tests only.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
