# Story 1.5: Add GitHub Actions PR checks

## Context
Part of Epic 1: Engineering Foundation and Delivery Pipeline. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add github actions pr checks with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Open a pull request that changes a tracked application file and verify the PR-triggered GitHub Actions workflow starts automatically and reports separate formatting, lint, type-check, test, and build results for the commit.
- [ ] **Failure and boundary behavior:** Introduce a known type error or failing assertion in a PR branch and verify the corresponding workflow check fails on GitHub and the PR does not report an all-green required-check result; restore the change and verify the checks pass again.
- [ ] **Scope boundary:** Do not satisfy this story with local commands alone, and do not weaken, skip, or mark the workflow checks successful when a required command fails.
- [ ] **Verification evidence:** Exercise the workflow on an actual PR commit, record the run URL and check conclusions in the PR, and retain the workflow configuration plus any required test command coverage.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 1 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test both a passing PR-triggered run and a deliberately failing PR-triggered run. Record the GitHub Actions results and any required-check configuration in the PR.
