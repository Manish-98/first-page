# Story 12.8: Complete release review

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver complete release review with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Map each must-have to a repeatable check and evidence location; record CI, deployed preview, PDF review, accessibility findings, and open risks.
- [ ] **Failure and boundary behavior:** Any failed required check or untested critical journey is marked as a blocker, not passed.
- [ ] **Scope boundary:** Do not sign off based only on localhost or configuration files.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
