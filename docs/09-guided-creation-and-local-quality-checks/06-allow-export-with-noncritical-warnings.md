# Story 9.6: Allow export with noncritical warnings

## Context
Part of Epic 9: Guided Creation and Local Quality Checks. This is an independently reviewable increment toward the MVP.

## Goal
Deliver allow export with noncritical warnings with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Create a deterministic CV that produces a known noncritical local warning, open the pre-export checklist, and verify the user can explicitly continue to export; the resulting PDF is downloaded successfully.
- [ ] **Failure and boundary behavior:** With the same advisory warning present, verify export remains available; then simulate a technical export failure and verify export is blocked/reported as failed while the document remains unchanged and retry is available.
- [ ] **Scope boundary:** Do not treat a clean export or a generic export error as proof of advisory-warning behavior, and do not downgrade technical export failures into warnings.
- [ ] **Verification evidence:** Add a browser/integration test that creates the advisory-warning state, asserts the export control remains enabled, and verifies a download; separately cover the technical-failure path.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 9 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record the advisory warning, explicit user continuation, successful download, and technical-failure behavior in the PR.
