# Story 9.5: Add pre-export checklist

## Context
Part of Epic 9: Guided Creation and Local Quality Checks. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add pre-export checklist with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Export a representative CV with a heading, long paragraph, Unicode, and enough content for two pages; verify a readable PDF, page size, reading order, and all source text.
- [ ] **Failure and boundary behavior:** Simulate export failure; show an error, keep the document editable and unchanged, and allow retry.
- [ ] **Scope boundary:** Do not claim success before a download is produced or silently truncate/shrink content.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 9 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
