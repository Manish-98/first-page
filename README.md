# First-page

First-page is a planned, free, local-first CV/resume builder with a design-focused editor, optional AI-assisted writing review, portable project files, and PDF export.

## Project documentation

- [Clean Code Guidelines](CLEAN_CODE_GUIDELINES.md) — engineering, architecture, and testing standards.
- [Contributing](CONTRIBUTIONS.md) — mandatory issue-to-merge workflow.
- [Business Plan](BUSINESS_PLAN.md) — product direction, operating assumptions, risks, and future opportunities.
- [MVP Scope](MVP.md) — initial product scope, constraints, and acceptance expectations.
- [Epic 1: Engineering Foundation](docs/01-engineering-foundation-and-delivery-pipeline/00-epic-overview.md) — foundation and delivery-pipeline implementation plan.

## Local development

Prerequisite: Node.js 22, as pinned by .nvmrc. The core workflow does not require AI credentials or other application secrets.

### Clean checkout

```sh
npm install
npm run dev
```

The Vite development server prints the local URL to the terminal.

### Quality checks

Run the checks independently so failures identify the affected quality gate:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

To format the repository after making changes:

```sh
npm run format
```

### Production preview

After a successful build, preview the generated application locally:

```sh
npm run build
npm run preview
```

### Pull request previews

Application pull requests receive a GitHub Pages preview through the PR preview workflow. See [Pages preview setup](docs/01-engineering-foundation-and-delivery-pipeline/06-pages-preview-setup.md) for the repository Pages prerequisite.

## Contribution rule

All implementation and documentation work must begin with an approved GitHub issue and follow the workflow in [CONTRIBUTIONS.md](CONTRIBUTIONS.md). Read [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md) for every contribution.

## Project status

Epic 1 establishes the React + TypeScript + Vite foundation, layered domain/application boundaries, strict static analysis, automated tests, PR checks, GitHub Pages previews, and reproducible development commands. Further product capabilities are implemented through the roadmap's subsequent epics.
