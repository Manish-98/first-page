# Business Plan — First-page

**Status:** Product direction and planning record; not a claim of a launched product or validated market demand.  
**Related documents:** [MVP.md](MVP.md), [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md), [CONTRIBUTIONS.md](CONTRIBUTIONS.md).

## 1. Executive summary

First-page is a planned free, web-based CV/resume maker that combines guided CV creation, a highly customizable design editor, and optional AI-assisted writing review. The product aims to help anyone who needs a CV produce a clear, professional document without having to learn a complex desktop publishing tool or pay for a subscription.

The product's defining approach is to combine two capabilities that are often treated separately:
1. structured CV authoring, with guided forms or conversational assistance; and
2. a design-oriented editor with paginated pages, grid-based layout, templates, and detailed typography/spacing controls.

The initial release is a functional prototype, not a complete commercial launch. It should prove an end-to-end workflow—create, edit, save/reopen, and export a usable PDF—before expanding into the full editor and multi-provider AI roadmap.

## 2. Problem and user need

People preparing a CV may face several types of friction:
- uncertainty about what sections and information to include;
- difficulty describing experience clearly and concisely;
- generic templates that provide little layout control;
- complex design software that requires substantial learning;
- difficulty maintaining layout quality across multiple pages;
- loss of work or lock-in when documents are stored in a proprietary online account;
- confusion between AI wording improvements and unsupported claims.

These are product hypotheses to validate, not established market research findings. Discovery should test which problems users experience most often and whether a free, local-first tool provides sufficient value.

## 3. Target audience

**Initial audience:** anyone who needs to create or update a CV/resume.

Potential user groups include:
- students and recent graduates;
- people entering the workforce or changing careers;
- experienced professionals updating an existing CV;
- people returning to work;
- applicants who want stronger wording but need to retain factual control;
- visually particular users who want more control than a fixed template provides.

The product should not assume that every user is an experienced designer or a confident writer. Creation must support a guided route and a more direct editing route.

## 4. Product proposition

### Core value proposition
A free, locally controlled CV maker that combines guided content creation, careful optional AI writing assistance, flexible design control, and print-oriented PDF export.

### Product pillars
1. **Accessible creation:** users can start from guided forms, an AI conversation, a template, or a blank canvas.
2. **Factual integrity:** AI can improve expression, but must not invent roles, responsibilities, dates, metrics, qualifications, or achievements.
3. **Design agency:** templates are starting points, not cages. Users can adjust sections, grid regions, typography, colors, spacing, alignment, and page layout.
4. **Portable work:** users save and reopen explicit project files, without requiring an account or cloud storage in the initial product.
5. **Print quality:** the canvas and PDF must account for real page sizes, margins, typography, page breaks, and multi-page content.
6. **User-controlled AI:** AI is optional, invoked by explicit user actions, and designed behind a provider interface so additional providers can be added later.

## 5. Product experience

### Starting paths
A new user chooses one of four routes:
- guided forms;
- conversational AI;
- start from a template;
- start from a blank canvas.

All routes lead into the same workspace and structured CV model. Users can switch between content editing, AI review, and design tools without maintaining separate copies of the CV.

### Main workspace
The intended editor has three primary areas:
- **Left sidebar:** sections, elements, layout tools, and insertion controls.
- **Central canvas:** vertically stacked, paginated A4 pages with zoom.
- **Right properties panel:** context-sensitive text, typography, color, spacing, sizing, alignment, and layout properties.

The initial layout model is grid-based, with flexible columns/regions, snapping, and alignment guides. It is not unrestricted freeform desktop publishing in the first version. Text reflows within regions; content overflow should create additional pages and warn the user rather than silently shrinking text.

### AI experience
The initial AI scope is writing quality and impact:
- grammar and clarity;
- concision;
- stronger action verbs and achievement framing;
- identification of vague or unsupported claims;
- targeted questions when important details are missing.

Users inspect before/after suggestions and accept or reject each individually. Significant design changes are previewed before application. AI must not fabricate facts or numbers. ATS analysis and job-description matching are deferred.

## 6. Business and operating model

### Pricing
The intended product is free to users, with a target of **$0/month in fixed infrastructure costs** during the initial local-first stage. This is a target, not a guarantee: domain registration, optional services, CI minutes, API calls, and hosting limits may create costs depending on use and configuration.

### Infrastructure strategy
- Static/client-heavy web application.
- No backend or account system in the initial product.
- User CV data stays local unless the user explicitly uses an external provider or exports/shares a file.
- Explicit project-file open/save rather than browser autosave or hidden temporary recovery copies.
- GitHub Pages is the intended feature-preview host for development workflow, subject to repository configuration and platform limits. It is not yet assumed to be configured.
- The initial PDF pipeline should be usable but designed to evolve toward high-fidelity rendering.

### AI cost model
AI should not create automatic or background costs. Provider requests occur only when a user initiates an AI action. Show estimated usage/cost when the provider supports a reliable estimate, and actual usage when returned by the provider.

The preferred initial integration is OpenAI, behind a provider-agnostic interface. Users should be able to bring their own API key; OpenAI sign-in/OAuth should be offered only if an officially supported authorization flow actually supports the intended API access. A ChatGPT subscription does not automatically include API usage. Credentials are device-specific and excluded from portable project files.

A major unresolved constraint exists: API keys are secrets, and browser-based applications cannot keep a user-entered key truly secret from that user’s own browser environment or prevent extraction by malicious code/extensions. Local storage is not a complete security solution. Before shipping a direct-browser API-key flow, the security trade-off must be explicitly documented and accepted, or a supported alternative must be chosen. Adding a server proxy could conflict with the $0/month/no-backend goal and requires a separate decision.

## 7. Competitive positioning and differentiation hypotheses

The product may be differentiated by the combination of:
- no mandatory account and explicit local project files;
- guided creation plus conversational assistance;
- individual, reviewable AI suggestions rather than silent rewrites;
- a grid-based editor with meaningful design controls;
- templates that change presentation without rewriting CV facts;
- A4-first paginated editing and print-aware export;
- a portable project package that excludes credentials.

These are hypotheses for positioning, not a verified competitive analysis. Before making market claims, research current competitors, licensing and export limitations, pricing, privacy practices, accessibility, and user feedback. Avoid unsupported claims such as “best,” “first,” or “unique.”

## 8. Product delivery strategy

The delivery approach balances MVP speed with a maintainable foundation:
- React + TypeScript + Vite for a client-side web application.
- Strict layers: domain, application, infrastructure, UI.
- Structured CV content separate from layout/design representation.
- One CV in the initial release; multiple CVs, master CVs, and targeted variants later.
- One curated set of templates at launch, with an extensible template model.
- Curated fonts only initially; no custom font uploads in the MVP.
- English-first, with architecture ready for additional languages and broad Unicode handling.
- Desktop-first initial editor, designed so mobile support can be added later.
- Layered, risk-based tests and incremental vertical slices.
- Every implementation triggered by a GitHub issue, developed on a feature branch, reviewed via PR, sanity-checked in Actions, previewed on GitHub Pages, tested on the preview, explicitly approved, and then merged.

The first technical milestone is a thin end-to-end vertical slice, not a broad editor implementation: create a CV, edit it, save and reopen a project, and export a basic usable PDF.

## 9. Roadmap

### Stage 1 — Project foundation and workflow
- Repository documentation, engineering standards, and contribution workflow.
- Application skeleton, strict TypeScript, formatting/linting, test harness, and CI/preview pipeline through separate approved issues.
- No claim that these systems exist until implemented and verified.

### Stage 2 — End-to-end prototype
- Create a basic CV with a small structured model.
- Edit key sections.
- Apply a basic template.
- Save and reopen a portable project file.
- Export a usable PDF.
- Handle common errors and unsaved changes.
- Test the critical journey and document acceptance evidence.

### Stage 3 — Core authoring and layout
- Guided form workflow and extensible standard/custom sections.
- A4 paginated canvas, grid-based regions, basic properties panel, reflow, overflow warnings, and manual page breaks.
- Undo/redo and manual snapshots.
- Curated templates and font library.
- More robust print-quality export.

### Stage 4 — Optional AI writing review
- OpenAI integration through a shared provider interface.
- Explicit review actions, before/after suggestions, individual approval/rejection, factual integrity checks, and clear error handling.
- Credential handling and supported sign-in path validated before being represented as secure or available.

### Stage 5 — Broader product capabilities
- Additional AI providers and supported authorization methods.
- LinkedIn/plain-text import; PDF import only after feasibility and quality validation.
- Additional templates, sections, layout capabilities, and multi-CV workflows.
- Mobile editing, localization, ATS analysis, job-description matching, and cloud sync only after separate prioritization.

## 10. Key risks and mitigations

| Risk | Why it matters | Planned mitigation |
|---|---|---|
| Scope expansion | A full design tool is substantially larger than a CV form | Deliver a thin vertical slice first; defer unrestricted freeform editing |
| PDF fidelity | Browser canvas and PDF output can diverge | Separate document/layout models and rendering boundaries; test representative PDFs |
| Pagination and overflow | Content can be lost or unexpectedly resized | Add pages and warn; support manual breaks; never silently shrink text |
| AI hallucinations | Unsupported claims can damage user trust and applications | Ground rewrites in supplied facts, ask questions, show changes, require approval |
| API key exposure | Client-side code cannot securely hide secrets from the client | Document threat model, do not include keys in project files, validate authorization approach before release |
| Hidden operating costs | “Free” does not imply every service has zero cost | Keep app static/local-first, make AI explicit, monitor hosting/CI/service limits |
| Local data loss | No account/cloud sync means the user controls persistence | Explicit save/open, unsaved-change warnings, clear error handling, portable project package |
| Accessibility gaps | Drag/drop and complex canvas interactions can exclude users | Keyboard alternatives, visible focus, accessible labels, WCAG-informed testing |
| Browser/platform variation | File pickers, downloads, fonts, and PDF rendering vary | Feature-detect APIs, provide fallback flows, test supported browsers |
| Unvalidated market need | Product assumptions may not match actual users | Conduct user interviews/usability tests before claims or major scope expansion |

## 11. Success signals to validate

No numerical business targets have been agreed yet. Early prototype evaluation should measure:
- whether a first-time user can create, save, reopen, and export a CV without assistance;
- whether users understand the four starting paths;
- whether edits survive file round trips without content loss;
- whether exported PDFs remain readable and correctly paginated for representative CVs;
- whether users trust the AI suggestion review and can detect/reject unwanted changes;
- how often users need layout help or encounter overflow;
- whether local-first saving and BYO AI access meet users' expectations.

Define quantitative targets after observing baseline usability and reliability rather than inventing numbers now.

## 12. Open questions and assumptions

The following remain to be validated through future issues rather than treated as settled facts:
- market size, demand, target user segments, and competitive position;
- actual hosting, domain, CI, and service costs;
- supported browser matrix and precise minimum device capabilities;
- secure, officially supported OpenAI sign-in/API authorization path;
- whether a backend is ever justified for security or account/sync features;
- template licensing and design asset sourcing;
- target accessibility conformance and formal evaluation;
- legal/privacy requirements for user data and external AI processing.

## 13. Related project documents

- [MVP scope and acceptance expectations](MVP.md)
- [Clean Code and Testing Guidelines](CLEAN_CODE_GUIDELINES.md)
- [Contribution workflow](CONTRIBUTIONS.md)

This plan is a living record. Change it through an issue and reviewed PR; preserve the distinction between agreed decisions, hypotheses, deferred options, and implemented capabilities.
