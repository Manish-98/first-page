# Story 10.15: Support opt-in provider fallback

## Context
Part of Epic 10: Optional AI Writing Assistant. This is an independently reviewable increment toward the MVP.

## Goal
Deliver support opt-in provider fallback with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** With fallback disabled, make the primary provider fail and verify no secondary provider is called and the user sees the primary failure. With fallback enabled, make the primary provider fail and verify the configured secondary provider is called and the user is explicitly told that fallback was used.
- [ ] **Failure and boundary behavior:** If the secondary provider also fails, verify the combined failure is surfaced without mutating the source; disabling fallback after configuration must prevent the secondary call on the next primary failure.
- [ ] **Scope boundary:** Fallback must be explicitly user-enabled and limited to configured providers; do not silently enable it or invent an unconfigured provider.
- [ ] **Verification evidence:** Add tests with call-count/assertion spies for both disabled and enabled states, including primary failure, secondary invocation only when enabled, visible fallback disclosure, and dual-provider failure.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 10 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record both fallback-disabled and fallback-enabled test results in the PR.
