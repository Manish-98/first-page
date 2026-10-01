# Story 3.1: Build four-path start screen

## Context
Part of Epic 3: New CV Creation and Onboarding. This is an independently reviewable increment toward the MVP.

## Goal
Deliver build four-path start screen with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Verify start screen exposes Forms, AI conversation, Template, and Blank canvas as distinct actions.
- [ ] **Failure and boundary behavior:** With AI unconfigured, its path explains setup/unavailability while Forms, Template, and Blank remain usable.
- [ ] **Scope boundary:** Do not require credentials to create or edit a CV.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 3 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
