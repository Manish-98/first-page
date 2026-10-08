# Story 12.7: Document known limitations

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver document known limitations with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Document current limitations for browser support, PDF fidelity, accessibility validation, and AI authorization with user impact and workarounds.
- [ ] **Failure and boundary behavior:** A limitation without evidence is labeled unverified; fixed limitations are removed after validation.
- [ ] **Scope boundary:** Do not claim universal rendering or formal accessibility guarantees.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
