# Core CV domain model

This module defines the foundational, platform-independent CV document
contracts introduced by issue #27.

## Model structure

- `CVDocument` is the root document.
- `CVDocumentMetadata` owns the document title and lifecycle timestamps.
- `CVContent` owns factual personal details and the ordered section collection.
- `PersonalDetails` groups a decomposed name, headline, and optional contact data.
- `CVSection` and `CVSectionEntry` provide stable identities and generic,
  discriminated contracts for section-specific models to extend.

## Modelling decisions

- IDs are opaque strings. ID generation is intentionally outside the Domain layer.
- Optional information is represented by omitted properties; null is not used
  as a second representation for absence.
- Timestamps are ISO-8601 strings at the type boundary. Parsing and runtime
  validation are separate responsibilities.
- Section `kind` is the discriminant. Section payloads are generic and default
  to `unknown` until concrete standard section models are introduced.
- Arrays exposed by the document contracts are readonly to communicate
  immutable ownership.
- CV content contains no template, typography, colour, page, or layout settings.

## Scope boundary

This is the foundational contract only. Concrete standard section payloads,
document transformations, validation rules, ordering operations, and the
versioned serialized project schema are handled by subsequent Epic 2 stories.

`types.type-test.ts` contains compile-time contract fixtures. The repository
does not yet have a dedicated test runner, so these checks are verified by the
existing TypeScript type-check/build commands.
