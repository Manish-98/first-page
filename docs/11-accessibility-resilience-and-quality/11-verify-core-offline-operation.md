# Story 11.11: Verify core offline operation

## Context
Part of Epic 11: Accessibility, Resilience, and Quality. This is an independently reviewable increment toward the MVP.

## Goal
Deliver verify core offline operation with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Disable network after app assets are available and create/edit/save/open a project, run local checks, and export PDF.
- [ ] **Failure and boundary behavior:** Verify core operations complete without an account, remote CV storage, AI credentials, or network requests for CV data.
- [ ] **Scope boundary:** Do not add hidden autosave or recovery copies.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 11 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
