# Core CV domain model

This module defines the foundational, platform-independent CV document
contracts introduced by issue #27 and the concrete section payloads introduced
by issue #28.

## Model structure

- `CVDocument<TSection>` is the root document and carries its concrete section union through `CVContent<TSection>`.
- `CVDocumentMetadata` owns the document title and lifecycle timestamps.
- `CVContent<TSection>` owns factual personal details and the ordered collection of the supplied section union.
- `CVSection` and `CVSectionEntry` provide stable section and entry identities. Concrete variants are defined in `sections.ts`.
- `CVSectionVariant` is the discriminated union for summary, experience, education, skills, projects, languages, certifications, awards, volunteering, publications, interests, references, and custom sections. Each kind maps to its own entry-content interface.
- `CVDateRange` supports partial calendar dates and distinguishes explicitly ongoing roles from completed or incomplete date ranges.
- Custom sections contain custom fields with a bounded `CustomFieldValue` union (text, number, boolean, date, URL, email, phone, and text-list).

## Modelling decisions

- IDs are opaque strings. ID generation is intentionally outside the Domain layer.
- Optional information is represented by omitted properties; null is not used as a second representation for absence.
- `CVPartialDate` permits year-only, year/month, and full year/month/day values. Numeric calendar bounds are checked by runtime validation at an untrusted-input boundary, not encoded as compile-time guarantees.
- A date range with `ongoing: true` cannot include an end date. An omitted end date without `ongoing: true` remains valid for incomplete historical data and is not implicitly treated as ongoing.
- Repeating information is represented by the shared readonly `entries` collection. Each entry has its own stable `CVEntryId`.
- Custom-field values are explicit and bounded; arbitrary objects and `any` are not accepted.
- Section payloads contain factual data only. They do not define typography, layout, ordering controls, editor state, or rendering configuration.
- Arrays exposed by the document contracts are readonly to communicate immutable ownership.

## Scope boundary

This module defines contracts only. Editor forms, UI behavior, runtime validation,
document transformations, ordering operations, and the versioned serialized
project schema remain outside issue #28 and belong to subsequent stories.

`types.type-test.ts` and `sections.type-test.ts` contain compile-time contract
fixtures. The repository currently verifies these through the existing
TypeScript type-check/build commands rather than a dedicated unit-test runner.
