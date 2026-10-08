# Story 11.9: Add visual and PDF regression checks

## Context
Part of Epic 11: Accessibility, Resilience, and Quality. This is an independently reviewable increment toward the MVP.

## Goal
Deliver add visual and pdf regression checks with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Render deterministic CV fixtures to both page images and PDF output and compare each against checked-in baselines using documented pixel/text/layout tolerances; a matching fixture passes both comparisons.
- [ ] **Failure and boundary behavior:** Intentionally change representative visual/layout or PDF output and verify the corresponding comparison fails and reports the affected fixture/output; restore the expected output and verify both checks pass.
- [ ] **Scope boundary:** Do not treat a readable one-off PDF export or manual inspection as a regression test, and do not allow arbitrary output drift without updating a reviewed baseline.
- [ ] **Verification evidence:** Check deterministic fixtures and baselines into the repository, run both comparison suites in CI, and record the comparison method and tolerances in the PR.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 11 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Verify stable image and PDF baseline matches plus deliberate failures for each output type.
