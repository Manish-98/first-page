# Story 10.13: Handle provider errors and retries

## Context
Part of Epic 10: Optional AI Writing Assistant. This is an independently reviewable increment toward the MVP.

## Goal
Deliver handle provider errors and retries with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Simulate an AI provider failure during an explicit user action and verify the UI reports the failure, preserves the current document and any pending edits, and exposes a retry action plus a manual provider-switch action when another configured provider is available.
- [ ] **Failure and boundary behavior:** Select retry after a transient failure and verify the request is attempted again and either succeeds with suggestions or reports the next failure without losing work; selecting manual switch uses the chosen provider rather than silently switching.
- [ ] **Scope boundary:** Do not silently discard user edits, apply partial AI output after a failed request, or silently change providers.
- [ ] **Verification evidence:** Add integration/browser tests with a fake provider that fails once then succeeds and another provider configured for manual switching; assert error UI, retry behavior, switch behavior, and unchanged source content after failure.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 10 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record the first failure, retry outcome, and manual-switch outcome in the PR.
