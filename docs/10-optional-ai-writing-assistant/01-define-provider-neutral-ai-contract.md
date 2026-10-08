# Story 10.1: Define provider-neutral AI contract

## Context
Part of Epic 10: Optional AI Writing Assistant. This is an independently reviewable increment toward the MVP.

## Goal
Deliver define provider-neutral ai contract with observable behavior that can be verified independently of adjacent stories.

## Acceptance criteria
- [ ] **Primary behavior:** Exercise a provider-neutral AI request/result/error contract with a fake provider implementation that is not OpenAI-specific; verify the application can send the defined request and consume normalized suggestions through the same interface.
- [ ] **Failure and boundary behavior:** Have the fake provider return a defined provider error and verify the contract exposes a normalized error without mutating the source; swap in a second fake provider with the same contract and verify the application behavior remains unchanged.
- [ ] **Scope boundary:** Do not make the domain/application contract depend on OpenAI request/response types, and do not satisfy this story only by calling an OpenAI adapter directly.
- [ ] **Verification evidence:** Add contract tests using at least two fake providers, covering a successful suggestion response and a provider failure, with assertions on request shape, normalized result, and normalized error.

## Out of scope
- Unrelated capabilities from other epics.
- Changing local-first constraints without a separately documented product decision.

## Dependencies
See the [MVP roadmap](../README.md) and [Epic 10 overview](./00-epic-overview.md). Add dependency issue links when this story is converted into a GitHub issue.

## Verification notes
Run the contract tests without network access or OpenAI credentials and record the fake-provider results in the PR.
