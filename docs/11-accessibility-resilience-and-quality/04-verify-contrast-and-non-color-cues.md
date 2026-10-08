# Story 11.4: Verify contrast and non-color cues

## Context
Part of Epic 11: Accessibility, Resilience, and Quality. This is an independently reviewable increment toward the MVP.

## Goal
Deliver verify contrast and non-color cues with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Measure representative body text, primary controls, focus indicators, and status/error colors against their backgrounds with an automated contrast check; verify normal text and essential controls meet at least WCAG 2.1 AA contrast targets (4.5:1 for normal text and 3:1 for large text/controls where applicable), while state is also communicated without color alone.
- [ ] **Failure and boundary behavior:** Include a deliberately failing contrast fixture and verify the accessibility check reports the failing pair; exercise keyboard focus and status/error feedback to confirm visible focus and non-color cues remain available.
- [ ] **Scope boundary:** Do not claim formal WCAG conformance from automated scanning alone, and do not exempt focus/status indicators from contrast verification.
- [ ] **Verification evidence:** Add automated contrast assertions for representative text, controls, focus, and status colors, plus a manual keyboard/screen-reader-oriented check recorded in the PR.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 11 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Record the measured ratios, target used for each element, deliberate failure result, and manual non-color/focus observations in the PR.
