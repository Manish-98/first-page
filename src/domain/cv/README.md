# Core CV domain model

This module defines the foundational, platform-independent CV document contracts introduced by issue #27, the concrete section payloads introduced by issue #28, independent design composition introduced by issue #29, immutable document operations introduced by issue #30, and pure document validation introduced by issue #31.

## Model structure

- `CVDocument<TSection>` is the factual root document and carries its concrete section union through `CVContent<TSection>`.
- `CVDocumentMetadata` owns the document title and lifecycle timestamps.
- `CVContent<TSection>` owns factual personal details and the ordered collection of the supplied section union.
- `CVSection` and `CVSectionEntry` provide stable section and entry identities. Concrete variants are defined in `sections.ts`.
- `CVSectionVariant` is the discriminated union for summary, experience, education, skills, projects, languages, certifications, awards, volunteering, publications, interests, references, and custom sections.
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

## Document operations

`operations.ts` contains framework-independent pure transformations. Mutating operations receive an explicit `updatedAt` timestamp, and all generated identities are supplied by the caller. The module does not read the clock, generate IDs, persist data, or manage UI state.

- `createCVDocument` creates a document with a caller-supplied ID, title, creation timestamp, optional personal details, and optional initial sections. It rejects duplicate section and entry IDs.
- `updateDocumentMetadata`, `updatePersonalDetails`, `updatePersonName`, `updateContactDetails`, and `updatePostalAddress` update document and personal/contact fields without mutating the source document.
- `addSection`, `updateSection`, and `removeSection` manage sections while preserving section IDs and kinds. Section and entry identifiers remain unique within a document.
- `moveSectionUp`, `moveSectionDown`, and `moveSectionToPosition` reorder the canonical `content.sections` array; no separate order list is maintained. Explicit positions are zero-based and must identify an existing position. Boundary moves and moves to the current position are successful no-ops that preserve the original document and timestamp. Actual moves preserve section and entry identities/content and update `updatedAt`; unknown IDs and invalid positions return structured errors.
- `addEntry`, `updateEntry`, `removeEntry`, and `duplicateEntry` manage entries. Updating content preserves its entry ID; duplication requires a new caller-supplied ID.
- `updateCustomField` changes one custom field while retaining its ID and the other fields in the same entry.
- Operations return `CVOperationResult<T>`. Expected domain failures use a discriminated `{ ok: false, error }` result with a stable error code and relevant identifiers; successful operations return `{ ok: true, value }`.
- Transformations use copy-on-write: changed document paths receive new objects and arrays, while unrelated content can retain its original reference. Source values are never modified.

## Modelling decisions

- IDs are opaque strings. ID generation is intentionally outside the Domain layer.
- Optional information is represented by omitted properties; null is not used as a second representation for absence.
- `CVPartialDate` permits year-only, year/month, and full year/month/day values. Numeric calendar bounds are checked by runtime validation at an untrusted-input boundary, not encoded as compile-time guarantees.
- A date range with `ongoing: true` cannot include an end date. An omitted end date without `ongoing: true` remains valid for incomplete historical data and is not implicitly treated as ongoing.
- Repeating information is represented by the shared readonly `entries` collection. Each entry has its own stable `CVEntryId`.
- Custom-field values are explicit and bounded; arbitrary objects and `any` are not accepted.
- Arrays exposed by the document contracts are readonly to communicate immutable ownership.
- Expected operation failures are values rather than exceptions. Built-in section operations also check the minimum required payload shape for the target section kind and return `entry-content-kind-mismatch` rather than accepting a payload from another section variant. Unknown extension kinds remain caller-defined; broad runtime validation of arbitrary imported data remains an input-boundary responsibility.

## Scope boundary

This module owns factual CV contracts and deterministic immutable transformations, plus independent design composition. Editor forms, UI behavior, persistence, undo/redo, pagination, rendering, document-import/export, and the versioned serialized project schema remain outside this scope.

`types.type-test.ts`, `sections.type-test.ts`, and `presentation.type-test.ts` contain compile-time contract fixtures. `presentation.test.ts`, `operations.test.ts`, and `validation.test.ts` contain executable unit tests for pure domain operations, validation rules, and immutability guarantees.


## Runtime document validation

`validation.ts` exposes `validateCVDocument(input: unknown)`, a pure validator for untrusted runtime data. It returns `{ valid, issues }`; expected invalid input is represented as structured issues rather than thrown exceptions.

Each issue has a stable `code`, `category` (`structure`, `format`, or `invariant`), a JSONPath-like `path`, and a concise message. When known, document, section, entry, and custom-field identifiers are included. The validator collects multiple issues in one pass and never mutates the supplied value.

Validation covers document and metadata shape, identifier presence and uniqueness, personal/contact data, standard section payloads, custom-field discriminants and values, partial calendar dates, date-range consistency, supported enums, and HTTP(S) URLs. Partial dates may specify year, year/month, or year/month/day. Leap years and calendar bounds are checked. An ongoing range cannot also contain an end date; clearly reversed ranges are rejected. An absent end date without an explicit ongoing flag remains valid incomplete data.

Missing optional CV information is not a validation failure. The validator checks whether supplied data is structurally and semantically well-formed; it does not score completeness or recommend content. Unknown extension section kinds are accepted when their generic section and entry structure is valid. Their extension-specific payload rules are not inferred in the absence of an extension schema.
