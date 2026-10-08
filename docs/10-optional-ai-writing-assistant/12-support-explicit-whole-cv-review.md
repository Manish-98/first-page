# Story 10.12: Support explicit whole-CV review

## Context
Part of Epic 10: Optional AI Writing Assistant. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support explicit whole-cv review with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Given a representative input for “Support explicit whole-CV review”, perform the named action and assert the resulting state in the shared model/UI or generated artifact; include the expected value/order rather than checking only that the action completed.
- [ ] **Failure and boundary behavior:** Exercise the most relevant edge case for “Support explicit whole-CV review” (empty, invalid, canceled, unsupported, or failure input) and verify an actionable response with existing user data preserved.
- [ ] **Scope boundary:** Add a focused test asserting this story’s input/output and explicitly exclude adjacent features not named in this story.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 10 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
