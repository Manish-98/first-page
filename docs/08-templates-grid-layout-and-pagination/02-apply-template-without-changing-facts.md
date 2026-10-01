# Story 8.2: Apply template without changing facts

## Context
Part of Epic 8: Templates, Grid Layout, and Pagination. This is an independently reviewable increment toward the MVP.

## Goal
Deliver apply template without changing facts with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Record profile, summary, experience dates/employers, skills, custom fields, and section order; apply two different templates and compare the content model.
- [ ] **Failure and boundary behavior:** All CV facts and ordering remain unchanged; only presentation/layout values may differ.
- [ ] **Scope boundary:** Do not transform template placeholders into user-authored facts.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 8 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
