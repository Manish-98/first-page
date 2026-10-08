# Story 12.1: Publish MVP acceptance checklist

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver publish mvp acceptance checklist with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Publish a repository-visible MVP acceptance checklist that maps each MVP must-have to a repeatable verification step, expected evidence, owner/reviewer role, and pass/fail status field.
- [ ] **Failure and boundary behavior:** Include at least one deliberately failing acceptance item and verify the checklist records it as failed/blocked rather than implying release readiness; after the evidence is supplied, the item can be marked passed without changing the underlying requirement.
- [ ] **Scope boundary:** Do not substitute runtime local-quality warnings for the release checklist, and do not mark an item passed solely because an implementation exists without the required verification evidence.
- [ ] **Verification evidence:** Check the published checklist into the repository and demonstrate that it covers the MVP critical journey, project save/reopen, PDF export, local-first/credential boundaries, accessibility/resilience gates, preview deployment, and known limitations.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Review the checklist for complete MVP coverage and record one failed and one passed evidence state in the PR.
