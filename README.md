# First-page

First-page is a planned, free, local-first CV/resume builder with a design-focused editor, optional AI-assisted writing review, portable project files, and PDF export.

## Project documentation

- [Clean Code Guidelines](CLEAN_CODE_GUIDELINES.md) — engineering, architecture, and testing standards.
- [Contributing](CONTRIBUTIONS.md) — mandatory issue-to-merge workflow.
- [Business Plan](BUSINESS_PLAN.md) — product direction, operating assumptions, risks, and future opportunities.
- [MVP Scope](MVP.md) — initial product scope, constraints, and acceptance expectations.

## Testing

The project uses Vitest for unit tests and React Testing Library for component tests.

```sh
npm test                 # Run the unit suite once
npm run test:watch       # Watch and rerun tests during development
npm run test:coverage    # Run tests and generate coverage reports
```

Tests are colocated with the code they cover:

- `*.test.ts` for domain and application unit tests.
- `*.test.tsx` for React component tests.
- `*.type-test.ts` for compile-time TypeScript contract fixtures.

The default Vitest environment is Node. Component tests can opt into jsdom with a file-level `@vitest-environment jsdom` annotation. Coverage is generated in `coverage/`; CI retains the report as a workflow artifact. Coverage thresholds are intentionally deferred until the project has a useful baseline.

## Contribution rule

All implementation and documentation work must begin with an approved GitHub issue and follow the workflow in [CONTRIBUTIONS.md](CONTRIBUTIONS.md). Read [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md) for every contribution.

## Project status

This repository is being initialized. The documents above describe agreed intent and planned scope; they do not imply that the application, automated checks, or GitHub Pages previews are already implemented or configured.
