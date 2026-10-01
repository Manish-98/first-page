# First-page MVP Roadmap

## Purpose and status
This planning baseline splits the MVP into epic directories and one Markdown file per story. It is not authorization to implement every story at once. For each implementation, follow the repository workflow: issue with background/purpose/acceptance criteria → branch → implementation → PR → automated checks and preview → preview testing → review/approval → merge and issue closure.

## Product goal
Build a free, desktop-first, local-first CV maker with a structured grid editor, curated templates, explicit project-file save/open, and usable PDF export. Optional AI can improve writing, but core editing/export remain usable without AI credentials.

## Epics
| Epic | Name | Phase | Stories |
|---|---|---|---:|
| E1 | [Engineering Foundation and Delivery Pipeline](./01-engineering-foundation-and-delivery-pipeline/00-epic-overview.md) | Phase 0 — Foundation | 7 |
| E2 | [CV Domain Model and Application Foundation](./02-cv-domain-model-and-application-foundation/00-epic-overview.md) | Phase 0 — Foundation / Phase 1 slice | 7 |
| E3 | [New CV Creation and Onboarding](./03-new-cv-creation-and-onboarding/00-epic-overview.md) | Phase 1 — Prototype | 6 |
| E4 | [Project-File Persistence and Portability](./04-project-file-persistence-and-portability/00-epic-overview.md) | Phase 1 — Prototype | 9 |
| E5 | [PDF Export](./05-pdf-export/00-epic-overview.md) | Phase 1 — Prototype and export | 8 |
| E6 | [Editor Workspace and Interaction Shell](./06-editor-workspace-and-interaction-shell/00-epic-overview.md) | Phase 2 — Core authoring | 8 |
| E7 | [CV Sections and Content Editing](./07-cv-sections-and-content-editing/00-epic-overview.md) | Phase 2 — Core authoring | 10 |
| E8 | [Templates, Grid Layout, and Pagination](./08-templates-grid-layout-and-pagination/00-epic-overview.md) | Phase 3 — Design and layout | 15 |
| E9 | [Guided Creation and Local Quality Checks](./09-guided-creation-and-local-quality-checks/00-epic-overview.md) | Phase 4 — Guided assistance | 7 |
| E10 | [Optional AI Writing Assistant](./10-optional-ai-writing-assistant/00-epic-overview.md) | Phase 4 — AI, gated by security validation | 16 |
| E11 | [Accessibility, Resilience, and Quality](./11-accessibility-resilience-and-quality/00-epic-overview.md) | Phase 5 — Hardening | 11 |
| E12 | [MVP Acceptance and Release Readiness](./12-mvp-acceptance-and-release-readiness/00-epic-overview.md) | Phase 5 — Release readiness | 8 |

## Milestones
1. **Phase 0 — Engineering foundation:** E1 and minimum E2; establish app, architecture, checks, tests, and document model.
2. **Phase 1 — End-to-end prototype:** minimum E2–E5; create/edit a CV, save a project, reopen it, and export a basic A4 PDF.
3. **Phase 2 — Core authoring:** E6–E7; build the three-area workspace and common CV content editing.
4. **Phase 3 — Design and layout:** E8; templates, grid layout, styling, pagination, undo/redo.
5. **Phase 4 — Assisted creation:** E9–E10; local guidance and optional AI after security/authorization decisions.
6. **Phase 5 — MVP hardening:** E11–E12; accessibility, resilience, offline operation, preview validation, PDF quality, release acceptance.

## Dependencies
- E1 → E2; E2 → E3, E4, E5; E3 + E4 + E5 → E6 → E7; E2 + E7 → E8 and E9; E2 + E7 → E10 (authorization/security gate); E8 + E9 + E10 → E11 → E12.
- Dependencies guide sequencing but do not require finishing every story before prototyping. Build the smallest coherent vertical slice first.

## First vertical slice
- Create one CV using a minimal entry path; edit a small set of fields in a basic workspace.
- Save CV content and supported presentation/layout to a portable project file; reopen and verify round-trip.
- Export a usable basic A4 PDF; run checks and test the deployed PR preview.

The broader MVP supports forms, AI conversation, template, and blank-canvas entry paths. The first slice may use the minimum path needed to validate end-to-end architecture.

## Product-wide constraints
- **Local-first:** no account or backend CV storage; users explicitly save/open project files.
- **No hidden persistence:** no browser autosave, hidden recovery copies, or cloud sync without an explicit decision.
- **Portable projects:** include CV content, design, layout, and supported assets; exclude API keys, tokens, and credentials.
- **AI optional:** editing, saving, local checks, and PDF export work without credentials and without network access once the app is available.
- **Factual integrity:** AI must not invent facts, metrics, employers, dates, qualifications, or achievements; flag unsupported claims and ask targeted questions.
- **Explicit AI actions:** no background AI processing; show before/after suggestions and require individual acceptance/rejection.
- **Provider/security gate:** validate officially supported OpenAI authorization. A ChatGPT subscription does not itself establish API access. Browser-side keys have security tradeoffs and must not be described as fully secure; record a product decision if security, local-only operation, and $0 infrastructure conflict.
- **Editor/pagination:** structured grid, snapping/alignment, text reflow; A4 first, auto-flow plus manual breaks/section overrides; never silently shrink text to hide overflow.
- **PDF:** client-side renderer behind a replaceable boundary; usable output first, then improve fidelity through regression fixtures.
- **Quality:** unit/integration/browser tests, accessibility review, visual/PDF regression, and deployed-preview verification. Automated checks alone do not prove formal WCAG conformance.

## MVP scope boundaries
| Area | In MVP | Deferred |
|---|---|---|
| Creation | Forms, AI conversation, template, blank canvas | Complex questionnaires |
| Content | Common sections and custom fields | Industry-specific systems |
| Editor | Three-area workspace, grid, supported styling, inline editing | Freeform canvas, advanced layers/grouping |
| Templates | Small curated set | Marketplace |
| Pagination | A4, auto-flow, manual breaks/overrides, warnings | Full desktop publishing; Letter can follow |
| Persistence | Explicit save/open/Save As project files | Accounts, cloud sync, autosave/recovery |
| Export | Usable PDF and fidelity improvements | Pixel-identical rendering guarantee everywhere |
| AI | Optional writing review, grounded rewrites, individual approval | ATS and job matching |
| Import | First-page project files | PDF, LinkedIn, arbitrary text import |
| Platform | Desktop-first web | Full mobile editor |
| Quality | Critical tests, accessibility checks, preview/PDF review | Formal certification and exhaustive device matrix |

## Definition of done
Acceptance criteria are evidenced in the PR; relevant tests pass; user-visible states/errors/edge cases are reviewed; local-first and credential boundaries are respected; preview is tested when supported; code is approved before merge and the issue is closed through the agreed workflow.

## Naming convention
Epic directory: docs/<two-digit epic number>-<epic-name>/; overview: 00-epic-overview.md; story: <two-digit story number>-<story-name>.md. Story numbers are scoped to an epic. Create one GitHub issue per story when implementation is authorized.
