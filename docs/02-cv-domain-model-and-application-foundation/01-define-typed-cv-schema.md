# Story 2.1: Define typed CV schema

## Context
Part of Epic 2: CV Domain Model and Application Foundation. This is an independently reviewable increment toward the MVP.

## Goal
Deliver define typed cv schema with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Construct a CV document through the typed domain model and verify required document metadata plus the supported profile, summary, experience, education, skills, and additional-section structures are represented by explicit typed fields/types rather than untyped JSON.
- [ ] **Failure and boundary behavior:** Attempt to construct or validate a document with a missing required field or invalid field type and verify schema validation rejects it before the invalid value reaches the application state.
- [ ] **Scope boundary:** Do not use untyped project JSON as the source of truth for the application model, and do not defer the core document shape to schema migration logic from Story 2.5.
- [ ] **Verification evidence:** Add type-level/unit tests covering a valid representative CV and invalid/missing required fields, and verify serialization/deserialization preserves the typed model without losing supported fields.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 2 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test valid and invalid typed documents at the schema boundary and record the assertions and serialization round-trip results in the PR.
