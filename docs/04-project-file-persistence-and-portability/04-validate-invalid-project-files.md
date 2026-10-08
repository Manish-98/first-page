# Story 4.4: Validate invalid project files

## Context
Part of Epic 4: Project-File Persistence and Portability. This is an independently reviewable increment toward the MVP.

## Goal
Deliver validate invalid project files with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Attempt to open unreadable JSON, valid JSON missing required fields, and valid project JSON with an unsupported schema version; each shows a distinct actionable error.
- [ ] **Failure and boundary behavior:** For each invalid file, the currently open CV and dirty state remain unchanged; user can select another file without reloading.
- [ ] **Scope boundary:** Do not accept unknown schema versions or replace invalid data with an empty CV.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 4 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
