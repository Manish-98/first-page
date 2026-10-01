# Story 12.1: Publish MVP acceptance checklist

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver publish mvp acceptance checklist with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Use a CV missing contact details and containing an empty visible section; show specific local warnings linked to affected fields/sections.
- [ ] **Failure and boundary behavior:** Fixing the issue updates the warning; advisory warnings do not block export, while technical export failures still do.
- [ ] **Scope boundary:** Do not invoke AI/network or silently rewrite text for local checks.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
