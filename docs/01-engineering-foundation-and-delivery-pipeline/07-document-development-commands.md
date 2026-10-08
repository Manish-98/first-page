# Story 1.7: Document development commands

## Context
Part of Epic 1: Engineering Foundation and Delivery Pipeline. This is an independently reviewable increment toward the MVP.

## Goal
Deliver document development commands with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Follow the documented install, dev, lint, type-check, test, and build commands on a clean checkout.
- [ ] **Failure and boundary behavior:** Each command exists in package scripts/CI and its documented prerequisites are accurate.
- [ ] **Scope boundary:** Do not require undocumented secrets for core workflows.
- [ ] **Verification evidence:** Add a focused automated test (unit, integration, or browser test as appropriate) asserting the input and expected result; include a manual preview check for browser, hosting, file handling, or download behavior.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 1 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Test the primary path and the named boundary case. Record commands/results in the PR and test the deployed feature preview when relevant.
