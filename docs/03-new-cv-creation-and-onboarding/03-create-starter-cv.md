# Story 3.3: Create starter CV

## Context
Part of Epic 3: New CV Creation and Onboarding. This is an independently reviewable increment toward the MVP.

## Goal
Deliver create starter cv with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Choose starter content and verify every example field is clearly sample content and can be edited or removed.
- [ ] **Failure and boundary behavior:** Choose blank CV and verify no sample facts are inserted.
- [ ] **Scope boundary:** Do not present sample claims as user-authored facts.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 3 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
