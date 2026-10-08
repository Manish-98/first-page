# Story 12.4: Test deployed preview

## Context
Part of Epic 12: MVP Acceptance and Release Readiness. This is an independently reviewable increment toward the MVP.

## Goal
Deliver test deployed preview with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Open the deployed preview URL for the PR commit and execute the critical browser smoke journey: load the app, create/open a CV, edit a field, save or otherwise exercise the supported project-file path, and trigger the basic PDF export path; verify each step succeeds on the deployed environment.
- [ ] **Failure and boundary behavior:** Use a deployment with missing/failed assets or an unavailable preview and verify it is reported as failed rather than treated as a passing smoke test; a broken core interaction must fail the preview acceptance even if the URL loads.
- [ ] **Scope boundary:** Do not count workflow configuration, a reachable URL, or working static assets alone as evidence that the deployed application works.
- [ ] **Verification evidence:** Record the exact deployed preview URL/commit, browser smoke steps, observed results, and any failed step in the PR; repeat the smoke journey after a corrected deployment before marking the story passed.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 12 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
The acceptance evidence must exercise the application on the deployed preview, not just the deployment workflow.
