# Story 5.8: Add PDF regression fixtures

## Context
Part of Epic 5: PDF Export. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add pdf regression fixtures with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Store a deterministic CV fixture containing headings, long text, Unicode, and multi-page content together with a checked-in expected PDF/text/layout baseline; run an automated regression test that exports the fixture and compares the new result with that baseline using a documented deterministic comparison or tolerance.
- [ ] **Failure and boundary behavior:** Intentionally alter a renderer output or fixture expectation and verify the regression test fails with a useful difference; restore the baseline and verify the test passes again.
- [ ] **Scope boundary:** Do not treat a one-off manual PDF inspection as the regression fixture, and do not accept arbitrary output drift without an explicit updated baseline.
- [ ] **Verification evidence:** Check the fixture and baseline into the repository, run the regression test in CI, and record the comparison method, tolerance (if any), and pass/fail evidence in the PR.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 5 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Verify both a stable baseline match and a deliberate regression failure. Keep the fixture deterministic so later renderer changes are detectable.
