# Story 10.13: Handle provider errors and retries

## Context
Part of Epic 10: Optional AI Writing Assistant. This is an independently reviewable increment toward the MVP.

## Goal
Deliver handle provider errors and retries with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Run the action explicitly on a fixture containing vague wording and no metrics; suggestions target the selected/current text and display original versus proposed wording.
- [ ] **Failure and boundary behavior:** Rejecting or canceling leaves the source unchanged; accepting one suggestion applies only that suggestion; simulated provider failure preserves work.
- [ ] **Scope boundary:** Do not invent dates, employers, metrics, qualifications, or achievements; no background calls or silent provider fallback.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 10 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
