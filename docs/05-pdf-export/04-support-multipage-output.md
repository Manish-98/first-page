# Story 5.4: Support multipage output

## Context
Part of Epic 5: PDF Export. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support multipage output with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Export a CV longer than one A4 page and compare all section/entry text with source order across pages.
- [ ] **Failure and boundary behavior:** No clipped tail, overlapping content, or unexplained blank page appears.
- [ ] **Scope boundary:** Do not truncate content to force one page.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 5 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
