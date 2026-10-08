# Story 4.8: Exclude credentials from projects

## Context
Part of Epic 4: Project-File Persistence and Portability. This is an independently reviewable increment toward the MVP.

## Goal
Deliver exclude credentials from projects with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Configure a fake API key, save/export a project, and inspect serialized data and logs; the key/token must be absent.
- [ ] **Failure and boundary behavior:** Opening a project with credential-like fields must not change device credentials; no-key mode leaves non-AI workflows usable.
- [ ] **Scope boundary:** Do not describe browser-held keys as fully secure or log secrets.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 4 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
