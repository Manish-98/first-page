# Story 9.5: Add pre-export checklist

## Context
Part of Epic 9: Guided Creation and Local Quality Checks. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add pre-export checklist with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Open the pre-export checklist for a CV with at least one local quality issue and one passing check; verify the checklist is visible, lists each applicable check with pass/warning status and a useful explanation, and reflects the current document state.
- [ ] **Failure and boundary behavior:** Fix the flagged issue and rerun/refresh the checklist; verify its status updates without invoking AI or network services. Export remains available when only advisory warnings remain.
- [ ] **Scope boundary:** Do not substitute the checklist with a PDF export smoke test, and do not invent remote/AI checks for local quality rules.
- [ ] **Verification evidence:** Add an automated test for checklist population and status updates from deterministic local checks, plus a browser/manual verification of the checklist immediately before export.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 9 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record the initial warning, the correction, and the updated checklist state in the PR.
