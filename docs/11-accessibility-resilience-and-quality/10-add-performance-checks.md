# Story 11.10: Add performance checks

## Context
Part of Epic 11: Accessibility, Resilience, and Quality. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add performance checks with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Measure startup, typing latency, and export time for a documented representative multi-section CV and record environment/thresholds.
- [ ] **Failure and boundary behavior:** A repeatable regression beyond the agreed threshold fails or flags the check with metrics.
- [ ] **Scope boundary:** Do not use only an empty document as the benchmark.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 11 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
