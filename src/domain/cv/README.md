# Core CV domain model

This module defines the foundational, platform-independent CV document
contracts introduced by issue #27, the concrete section payloads introduced
by issue #28, and independent design composition introduced by issue #29.

## Model structure

- `CVDocument<TSection>` is the factual root document and carries its concrete section union through `CVContent<TSection>`.
- `CVDocumentMetadata` owns the document title and lifecycle timestamps.
- `CVContent<TSection>` owns factual personal details and the ordered collection of the supplied section union.
- `CVSection` and `CVSectionEntry` provide stable section and entry identities. Concrete variants are defined in `sections.ts`.
- `CVSectionVariant` is the discriminated union for summary, experience, education, skills, projects, languages, certifications, awards, volunteering, publications, interests, references, and custom sections. Each kind maps to its own entry-content interface.
- `CVDateRange` supports partial calendar dates and distinguishes explicitly ongoing roles from completed or incomplete date ranges.
- Custom sections contain custom fields with a bounded `CustomFieldValue` union (text, number, boolean, date, URL, email, phone, and text-list).
- `CVPresentationSettings` contains visual choices such as typography, colors, spacing, margins, and alignment.
- `CVLayoutConfiguration` contains page configuration, column count, and section placement metadata.
- `CVDesignConfiguration` groups presentation and layout settings. `CVDesignedDocument<TSection>` composes that replaceable design with a factual `CVDocument<TSection>`.

## Content/design separation

- `CVDocument` and `CVContent` do not import or reference presentation or layout types. Factual section order and payloads remain owned by content.
- Design metadata is kept in `presentation.ts`; section placements refer to stable section IDs and do not move or rewrite factual sections.
- `withCVDesign(document, design)` returns a new composition containing the supplied design while retaining the exact original factual document and content references. A single factual document can therefore be paired with multiple design configurations.
- Measurements use explicit physical units (`pt`, `mm`, or `in`) rather than renderer-specific values. The contracts do not depend on CSS, React, or a PDF library.
- No templates, visual controls, pagination algorithm, rendering behavior, or runtime validation are introduced by this story.

## Modelling decisions

- IDs are opaque strings. ID generation is intentionally outside the Domain layer.
- Optional information is represented by omitted properties; null is not used as a second representation for absence.
- `CVPartialDate` permits year-only, year/month, and full year/month/day values. Numeric calendar bounds are checked by runtime validation at an untrusted-input boundary, not encoded as compile-time guarantees.
- A date range with `ongoing: true` cannot include an end date. An omitted end date without `ongoing: true` remains valid for incomplete historical data and is not implicitly treated as ongoing.
- Repeating information is represented by the shared readonly `entries` collection. Each entry has its own stable `CVEntryId`.
- Custom-field values are explicit and bounded; arbitrary objects and `any` are not accepted.
- Arrays exposed by the document contracts are readonly to communicate immutable ownership.

## Scope boundary

This module defines contracts and a small immutable design-composition helper.
Editor forms, UI behavior, runtime validation, pagination, rendering,
document-import/export transformations, and the versioned serialized project
schema remain outside this story and belong to subsequent work.

`types.type-test.ts`, `sections.type-test.ts`, and
`presentation.type-test.ts` contain compile-time contract fixtures. The
presentation fixture also exports an executable assertion that verifies
replacing a design preserves the exact factual document and content references.
The repository currently verifies type fixtures through the existing
TypeScript type-check/build commands rather than a dedicated unit-test runner.
