# MVP — Product Scope and Acceptance Expectations

**Status:** Agreed MVP direction; implementation has not been assumed complete.  
**Related documents:** [BUSINESS_PLAN.md](BUSINESS_PLAN.md), [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md), [CONTRIBUTIONS.md](CONTRIBUTIONS.md).

## 1. MVP objective

Deliver a reliable, reviewable functional prototype of a free, local-first CV/resume maker. The first end-to-end milestone must demonstrate that a user can create a CV, edit its content, save a portable project file, reopen that file, and export a usable PDF.

The first milestone is intentionally a **thin vertical slice**. It is not expected to deliver the full design editor, complete AI experience, or all planned import/export capabilities. Each later capability must be introduced through an issue and the project contribution workflow.

## 2. Product principles

- **Local-first:** no account or server-side CV storage in the initial product.
- **Free:** target $0/month fixed infrastructure; do not imply that third-party or user-initiated AI usage is necessarily free.
- **AI optional:** all core CV editing, project saving/reopening, and PDF export work without credentials.
- **Explicit persistence:** user saves project files intentionally; warn before discarding unsaved edits. Do not silently rely on browser autosave or hidden recovery copies in the initial design.
- **Factual integrity:** AI may improve wording but must not invent facts, metrics, responsibilities, dates, qualifications, or achievements.
- **Content/design separation:** changing templates or layout must not rewrite CV facts.
- **Print-aware:** use a paginated A4 canvas first, with architecture that can later support US Letter.
- **Progressive complexity:** support guided creation and meaningful design controls without requiring users to become professional designers.
- **Accessible alternatives:** core workflows must be usable by keyboard, not only through drag/drop.
- **Evidence before claims:** do not mark a feature, test, CI check, or preview deployment complete without verification.

## 3. Initial milestone: thin end-to-end vertical slice

### Included
- Minimal application shell using React + TypeScript + Vite.
- A small, explicit structured CV model with basic personal/contact information and at least one editable content section.
- A simple creation/editing UI sufficient to prove the core journey.
- A minimal template/presentation option, keeping content separate from styling.
- Explicit project save and open/reopen using a portable project file.
- A basic usable PDF export.
- Clear success and error states for save, open, and export.
- Unsaved-change warning before leaving/discarding changes where the application can reliably detect the action.
- Initial unit/integration tests and a browser end-to-end test for the critical workflow.
- A feature branch and PR linked to an issue; CI sanity checks and GitHub Pages feature preview are expected by the contribution workflow, once that infrastructure is implemented.

### Not required for the first slice
- Full drag-and-drop design editor.
- Complete set of CV sections and arbitrary custom field editor.
- Multiple CVs or master CV/targeted variants.
- Real AI integration; AI must remain optional and may be added in a later issue. The repository documentation alone does not establish that AI is implemented.
- OAuth/OpenAI sign-in.
- High-fidelity PDF rendering for every possible layout.
- PDF import, LinkedIn import, or broad import conversion.
- User accounts, backend, cloud sync, or browser-based autosave.
- Mobile-optimized full editor.
- ATS scoring, job-description matching, or analytics.

### First milestone acceptance criteria
- A user can create a new CV and edit the included fields.
- A user can save a project file, close/reload the application, reopen the file, and recover the same CV content and supported layout settings.
- Invalid or unsupported project files produce a clear error without destroying the currently open document.
- A user can export a non-empty, readable PDF with the expected A4 page size and basic styling.
- Core functions work without OpenAI credentials or network connectivity, except where browser/runtime requirements make the operation inherently dependent on the platform.
- Unsaved edits trigger a warning on supported discard/navigation paths.
- Critical behavior has automated tests; build, lint, type-check, and relevant tests have recorded results.
- The deployed feature preview is tested against the issue's acceptance criteria before approval, or an explicitly approved exception is documented.
- The issue's acceptance checklist and PR review/approval are complete before merge.

## 4. Planned product scope after the first slice

### 4.1 Creation and CV content
The full MVP direction supports four entry paths:
1. guided forms;
2. conversational AI;
3. choose a curated template;
4. start from a blank canvas.

These paths converge on one shared CV document and workspace. A user can change creation/editing methods without creating parallel versions of the document.

Standard structured sections should eventually include:
- profile/contact details;
- professional summary;
- work experience;
- education;
- skills;
- projects;
- languages;
- awards;
- volunteer work;
- publications;
- interests;
- references;
- custom sections and custom fields.

The model should support reordering and placing sections in layout regions. Empty or incomplete sections may produce local quality warnings but should not unnecessarily block export.

### 4.2 Editor and design model
- Three-area desktop workspace: left tools/sections sidebar, central paginated canvas, right context-sensitive properties panel.
- Vertically stacked A4 pages with zoom.
- Grid-based layout with flexible columns/regions, snapping, alignment guides, and text reflow within a region.
- Sidebar drag/drop plus menus for inserting and moving sections/elements.
- Inline text editing and a properties panel for relevant settings.
- Design-only templates: applying a template changes visual style/layout and preserves CV content.
- Curated templates and curated font library at launch; no custom font upload initially.
- Basic controls for fonts, colors, spacing, margins, line spacing, alignment, sizing, and columns.
- Content overflow adds pages and warns about pagination changes. Do not silently shrink text to force a one-page CV.
- Automatic pagination with manual page breaks and section placement overrides.
- Undo/redo for content and design changes, plus manual version snapshots that restore a saved state.
- Standard structured sections plus custom sections/fields.
- Advanced unrestricted canvas objects (arbitrary shapes, image composition, freeform text blocks, grouping/layers, etc.) are future extensions rather than a requirement for the first slice.

### 4.3 Persistence and project portability
- No account and no server-side CV storage initially.
- Explicit project Open, Save, and Save As.
- Use a file picker where supported, with download/import fallback.
- Portable project package includes CV content, layout/design, supported document assets, and non-secret provider preferences/configuration where appropriate.
- Never include API keys, access tokens, session credentials, or other secrets in project files.
- Credentials are configured separately on each device; credential portability is deferred.
- Warn about unsaved changes. Do not add temporary recovery copies or hidden browser autosave in the initial scope.
- Project schema must be versioned and runtime-validated when opening untrusted files.

### 4.4 PDF export
- PDF is the initial export format.
- A4 is the initial page size; architecture should permit US Letter later.
- One-click export plus a future advanced dialog for page size, margins, and page range.
- First export may be basic, but the renderer boundary must support a future high-fidelity renderer.
- The full target includes consistent typography, exact page dimensions/margins, multipage layout, and correct page breaks.
- Test selectable/readable text, layout, overflow, representative long content, and Unicode text.
- Export failure must be reported clearly and must not discard the CV.

### 4.5 AI writing assistance
AI is optional and explicit-action only; it must not make background calls.

Initial AI capabilities:
- grammar, clarity, concision;
- stronger action verbs and achievement framing;
- flag vague or unsupported claims;
- ask targeted questions for missing context or numbers;
- offer conservative rewrites grounded in the facts supplied.

Review behavior:
- display before/after text;
- accept or reject each suggestion individually;
- do not mutate the CV until the user approves a suggestion;
- preview significant design changes before applying;
- provide undo/redo after accepted changes;
- preserve work and provide clear retry/manual-switch options on failure;
- show estimated cost/usage where the provider supports it and actual usage when available;
- optional automatic provider fallback may be a user-enabled later capability, never a silent default.

Provider direction:
- OpenAI first, behind a provider-agnostic interface to support future providers.
- BYO API key is desired; OpenAI sign-in/OAuth is only in scope if an officially supported authorization flow permits the required API access.
- ChatGPT subscriptions and OpenAI API billing/access are distinct.
- No credential belongs in project files.
- Browser-based API keys create a security trade-off; local storage is not a secure secret vault. The real credential approach must be validated and documented before shipping.
- AI review is limited to writing quality and impact initially. ATS scoring and job-description matching are deferred.

### 4.6 Quality checks
The planned editor should offer local, non-AI live warnings and a pre-export checklist for issues such as:
- missing basic contact details;
- empty or unfinished sections;
- layout overflow;
- suspicious page breaks or orphaned headings;
- content beyond page bounds;
- readability/layout concerns.

Warnings should help users make informed choices without unnecessarily blocking export.

## 5. Technical constraints

- **Stack:** React + TypeScript + Vite.
- **Architecture:** strict domain, application, infrastructure, and UI layers.
- **Domain:** CV structures, rules, validation, and layout-independent behavior.
- **Application:** use cases and orchestration for edits, history, save/open, export, and AI review.
- **Infrastructure:** file adapters, PDF renderer, browser APIs, and provider integrations.
- **UI:** React components, interaction state, forms, canvas, and accessible dialogs.
- Keep CV content model separate from visual layout/design representation.
- Keep provider SDKs and PDF implementation details behind appropriate boundaries.
- Use strict TypeScript, runtime validation at untrusted boundaries, and explicit versioned project schemas.
- Prefer static/client-heavy hosting to meet the no-backend and cost goals.
- English-first with architecture ready for localization and broad Unicode support.
- Desktop-first implementation; design architecture to allow mobile support later.

## 6. Quality and testing strategy

Use layered, risk-based testing, expanding with the product:
1. **Domain unit tests:** validation, transformations, ordering, project schema, pagination calculations, and invariants.
2. **Application/integration tests:** create/edit/save/open/export orchestration and error paths.
3. **UI tests:** user-observable behavior, form validation, accessible names, keyboard alternatives, loading and error states.
4. **Browser end-to-end:** create → edit → save → reload/reopen → export; unsaved-change warning and invalid-file handling.
5. **Visual/PDF regression:** A4 page dimensions, margins, fonts, page breaks, overflow, long content, and Unicode.
6. **Accessibility:** automated checks plus manual keyboard, focus, and screen-reader-relevant review.
7. **Performance:** representative document sizes and key editor interactions.

Tests must be deterministic where possible, avoid real provider/network calls in unit tests, and exercise failure paths. Do not claim accessibility conformance or PDF fidelity without appropriate evidence.

## 7. Accessibility expectations

- Semantic HTML and properly labelled controls.
- Visible keyboard focus and logical focus order.
- Keyboard alternatives to every core drag/drop operation.
- Dialogs with correct focus behavior and accessible error/status messages.
- Adequate contrast; do not convey information through color alone.
- Respect reduced-motion preferences.
- Core flows usable without a pointer.
- Use WCAG 2.2 AA as an engineering target; verify rather than assume conformance.

## 8. Explicitly deferred

The following are not part of the first slice and require separate prioritization/issues:
- ATS analysis/scoring and job-description matching.
- PDF import; plain-text and LinkedIn import are later candidates.
- Multiple CVs, master CV, and targeted variants.
- Accounts, cloud saving/sync, and backend services.
- Custom font upload and broad font marketplace.
- Full mobile editing experience.
- Full freeform design canvas with arbitrary objects, layers, grouping, and advanced illustration controls.
- Large-scale localization beyond the English-first foundation.
- Real-time collaboration, sharing links, analytics, and team features.
- Guaranteed zero cost for third-party AI use.
- Any claim that OpenAI sign-in/OAuth is available before the official authorization path is verified.

## 9. Acceptance expectations for later milestones

Every future feature/bug/refactor must have an issue with observable acceptance criteria. The PR must document the checks run and test the deployed GitHub Pages feature preview. Review and explicit approval are required before merge. Follow [CONTRIBUTIONS.md](CONTRIBUTIONS.md) and [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md) for every contribution.

For a visual or rendering change, include evidence for representative page sizes and content. For persistence changes, test round trips and corrupt/unsupported files. For AI changes, test factual grounding, individual approval/rejection, provider failures, cancellation, and credential exclusion. For editor interactions, test keyboard alternatives and unsaved-change behavior.

## 10. Related documents

- [Business Plan](BUSINESS_PLAN.md)
- [Clean Code and Testing Guidelines](CLEAN_CODE_GUIDELINES.md)
- [Contribution Workflow](CONTRIBUTIONS.md)
