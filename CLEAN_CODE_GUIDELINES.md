# Clean Code and Testing Guidelines

**Status:** Project engineering standard  
**Applies to:** Every production, test, tooling, and documentation-related code contribution  
**Stack direction:** React + TypeScript + Vite; strict layered architecture

This guide is a practical standard, not a demand to apply every pattern everywhere. Optimize for correctness, clarity, testability, accessibility, and the ability to change the product safely. When a principle conflicts with a concrete need, document the trade-off in the pull request.

## 1. Core principles

### Readability and simple design
- Prefer code that communicates intent directly. Use meaningful names and make important decisions explicit.
- Keep the design as simple as the current requirements allow. Do not add speculative abstractions, frameworks, extension points, or dependencies without a demonstrated use case.
- Follow the project's existing conventions unless there is a clear reason to change them.
- Refactor in small, behavior-preserving steps. Tests should make it safe to improve structure.
- Treat comments as explanations of *why*, constraints, or non-obvious trade-offs—not as narration of what the code already says.
- Handle errors at boundaries, with actionable context. Do not swallow exceptions or return success-shaped values for failures.

### SOLID
Use SOLID as design heuristics, especially where behavior or dependencies are likely to change:

- **Single Responsibility Principle (SRP):** A module should have one cohesive reason to change. For example, PDF layout should not own OpenAI request handling.
- **Open/Closed Principle (OCP):** Prefer stable contracts with focused extension points where real variation exists, such as a provider interface for AI services. Avoid building plugin systems before a second implementation is needed.
- **Liskov Substitution Principle (LSP):** An implementation of an interface must honor the interface's behavioral contract, including error and cancellation behavior—not merely its TypeScript shape.
- **Interface Segregation Principle (ISP):** Keep interfaces focused on the capabilities their consumers need. Avoid broad “god interfaces.”
- **Dependency Inversion Principle (DIP):** High-level use cases should depend on domain-owned contracts, not directly on browser APIs, a particular PDF library, or the OpenAI SDK.

Do not create interfaces, classes, or dependency-injection machinery solely to demonstrate SOLID. Use the simplest construct that makes a meaningful boundary explicit.

### DRY, DAMP, and duplication
- **DRY (Don't Repeat Yourself):** Avoid duplicating knowledge, business rules, or logic that must stay consistent. Keep canonical rules in one appropriate place.
- **DAMP (Descriptive And Meaningful Phrases):** Tests should make scenarios and intent obvious, even when that means repeating setup or values. Prefer readable test cases over highly abstract fixtures that hide what is being verified.
- Do not confuse repeated syntax with duplicated knowledge. Two similar blocks may represent independent rules and should not be forced into a shared abstraction.
- Extract a helper when it improves meaning, reduces meaningful duplication, or protects a shared invariant. Do not create a generic helper for a one-off expression merely to reduce line count.
- Avoid parallel sources of truth for CV content, layout, export settings, and validation. Derived values should be derived, not independently edited and synchronized.

### Other useful principles
- **KISS:** Choose the simplest solution that meets the actual requirements.
- **YAGNI:** Do not implement future features until an approved issue calls for them.
- **Composition over inheritance:** Prefer small composed React components and focused services over deep class hierarchies.
- **Explicit over implicit:** Make side effects, persistence, network calls, destructive operations, and fallback behavior visible.
- **Fail safely:** Preserve user work on errors and avoid silently corrupting, dropping, or inventing CV content.
- **Boy Scout rule, within scope:** Leave touched code clearer when practical, but do not bundle unrelated refactors into a contribution.

## 2. Architecture and dependency rules

The application uses four strict layers:

1. **Domain** — CV/document types, section rules, invariants, layout-independent logic, validation, and domain errors.
2. **Application** — use cases and orchestration: create/update CV, undo/redo, project save/open, export requests, AI review workflows, and suggestion approval.
3. **Infrastructure** — adapters for file APIs, browser capabilities, PDF rendering, provider SDKs/network calls, and other external systems.
4. **UI** — React components, hooks, interaction state, accessible forms/dialogs, and visual presentation.

### Dependency direction
- UI may call application use cases.
- Application may depend on domain and on interfaces/contracts it owns.
- Infrastructure implements contracts defined at appropriate inner boundaries.
- Domain must not import React, Vite, browser APIs, infrastructure modules, OpenAI SDKs, or PDF libraries.
- Do not let UI components become the source of business rules or file-format serialization.
- Do not let application/domain logic depend on DOM structure or CSS selectors.
- Use dependency injection at meaningful boundaries (for example, an AI provider or project-file adapter), not as ceremony around every function.

### Domain model and document integrity
- Keep structured CV content separate from presentation/layout metadata. Applying a visual template must not rewrite a user's factual CV content.
- Keep persisted project schemas explicit and versionable. Validate untrusted imported files at the boundary; TypeScript types do not validate runtime input.
- Model meaningful states with discriminated unions rather than loosely related booleans when that prevents invalid combinations.
- Prefer immutable updates for state and document changes. Keep undo/redo and snapshots deterministic.
- Never let rendering or export silently invent facts, discard content, or shrink text unexpectedly to force pagination.
- Make migration and compatibility behavior explicit when project formats evolve.

## 3. TypeScript standards

- Enable `strict: true` and keep strict type-checking in CI.
- Avoid `any`. Prefer precise types; use `unknown` for untrusted values and narrow it through runtime validation.
- Do not use type assertions to silence a compiler error unless a validated invariant makes the assertion necessary; keep assertions narrow and explain non-obvious ones.
- Model optional, nullable, and loading/error states accurately. Do not use non-null assertions as a routine escape hatch.
- Prefer discriminated unions and exhaustive `switch` statements for domain variants; use an exhaustiveness check for important unions.
- Use `readonly` where it communicates ownership or immutability. Avoid mutation of React props/state and shared domain values.
- Export only the public surface a module needs to expose. Keep implementation details private.
- Use named domain types for concepts with meaning; do not create aliases that add no clarity.
- Keep runtime validation at file import, browser-storage, provider-response, and other untrusted boundaries.
- Use `import type` for type-only imports where it improves module clarity and complies with compiler settings.

## 4. React standards

- Components and hooks must be pure during render. Side effects belong in event handlers or correctly managed effects.
- Follow the Rules of Hooks. Keep hook calls unconditional and at the top level of components/custom hooks.
- Treat props and state as immutable snapshots. Do not mutate arrays or objects held in state.
- Keep components cohesive. Extract a component when it has a clear reusable role, isolates meaningful behavior, or makes a complex view easier to understand—not merely because a file is long.
- Keep domain and orchestration logic out of JSX. Use application/domain functions for non-trivial business rules.
- Avoid effects for values that can be derived during render. Avoid redundant state and synchronization effects.
- Specify effect dependencies correctly and clean up subscriptions, listeners, observers, and asynchronous work where required.
- Use stable, meaningful keys for lists; do not use array indexes when items can be inserted, removed, or reordered.
- Keep controlled form state and validation behavior explicit. Provide useful labels and errors.
- Use React Strict Mode in development and the official React Hooks lint rules.
- Do not prematurely memoize everything. Profile first or identify a clear expensive computation/render path; then use memoization with tests or measurement where useful.
- Keep drag/drop behavior keyboard-accessible with equivalent commands or controls.

## 5. Naming, formatting, and module organization

- Use names that describe domain intent: `applySuggestion`, `saveProjectFile`, `calculatePageBreaks`, not generic names like `processData`.
- Use `PascalCase` for React components and type names; `camelCase` for variables/functions; constants should use the project's established convention.
- Keep modules cohesive and avoid circular dependencies. Place code according to its architectural responsibility, not convenience alone.
- Prefer early returns when they clarify guard conditions. Avoid deeply nested conditionals.
- Avoid boolean parameters when they obscure meaning; prefer explicit options or separate functions if the behavior is materially different.
- Keep functions focused. Split a function when separate steps have distinct meaning, reuse, or test boundaries—not to hit an arbitrary line count.
- Use the formatter and lint rules configured by the project; do not manually fight automated formatting.
- Avoid broad barrel exports that hide dependency direction or create cycles.
- Keep comments, identifiers, and developer-facing docs in English unless an approved localization/documentation policy says otherwise.

## 6. Error handling, security, and privacy

- Treat imported project files, user input, AI output, provider errors, and browser APIs as untrusted boundaries.
- Validate and version project-file input before using it. Reject unsupported/corrupt files with a clear error and preserve the currently open CV.
- Use explicit loading, success, empty, and error states. Errors must not silently discard edits.
- Never commit secrets, tokens, API keys, private CV data, or realistic personal sample data. Use clearly synthetic fixtures.
- Never include credentials in portable project files, logs, crash messages, screenshots, test snapshots, or telemetry.
- The planned local-first product has a strict security constraint: OpenAI documents API keys as secrets and says not to expose them in client-side code. A “bring your own key” design in a browser is not equivalent to secure server-side secret handling. Before shipping real direct-browser API access, document the threat model and use a supported safe authorization approach; do not claim that local storage makes a key secure. Any server/proxy would need an explicit product decision because the target is no backend and $0/month infrastructure.
- Make AI actions explicit and user-initiated. Do not make background provider calls. Show errors clearly, preserve work, and never fabricate CV facts or metrics.
- Avoid logging full CV content or personal information. Redact sensitive values in diagnostics.
- Keep dependencies minimal, maintained, and purpose-justified. Review licenses, security advisories, bundle cost, and browser compatibility before adding dependencies.

## 7. Accessibility and UX quality

- Treat accessibility as part of implementation, not a final polish step.
- Target WCAG 2.2 AA as a design and testing goal, without claiming conformance before evaluation.
- Use semantic HTML and native controls when appropriate; give inputs accessible names, instructions, and associated error messages.
- Ensure keyboard access, visible focus, sensible focus order, and focus management for dialogs.
- Do not rely on color alone to convey status. Provide adequate contrast and meaningful status text.
- Announce important asynchronous state changes accessibly. Respect reduced-motion preferences.
- Every drag/drop workflow needs a keyboard alternative such as move up/down controls, menus, or numeric position controls.
- Test zoom/reflow and responsive behavior, while recognizing that the initial editor is desktop-first.
- PDF output must be checked for readable text, sensible reading order where possible, and consistent pagination—not only visual similarity.

## 8. Testing standards

Testing is risk-based and layered. No single test type is sufficient.

### Test levels
1. **Domain unit tests:** pure rules, validation, ordering, document transformations, undo/redo, serialization, pagination calculations, and invariants.
2. **Application/integration tests:** use-case orchestration with controlled adapters; save/open round trips; AI suggestion approval/rejection; failure paths.
3. **UI/component tests:** visible behavior, form validation, accessible names, keyboard interactions, and user-observable states. Prefer queries by role and accessible name over implementation details.
4. **End-to-end browser tests:** critical user journeys in a real browser, including create → edit → save → reopen → export, plus unsaved-change warnings and important failures.
5. **Visual/PDF regression tests:** page dimensions, typography, margins, overflow, page breaks, representative long/multilingual content, and output differences. Use deterministic fixtures and controlled fonts.
6. **Accessibility tests:** automated checks plus manual keyboard/focus review; automated tools alone cannot establish accessibility.
7. **Performance tests:** measure realistic document sizes and editor interactions; avoid arbitrary micro-optimizations without a measured problem.

### Test quality
- Write tests around observable behavior and important invariants, not private implementation details.
- Prefer **DAMP** test names and setup that make the scenario self-explanatory. Reuse helpers only when they clarify the test.
- Use deterministic fixtures, fixed dates/IDs where needed, and no real network calls in unit tests.
- Test negative paths: invalid files, unavailable storage, malformed provider responses, rejected AI suggestions, cancellation, failed export, and recovery from errors.
- Tests should fail for a meaningful regression and be understandable without reverse-engineering the test helper framework.
- Avoid brittle snapshots of entire component trees. Use targeted assertions and visual baselines for layout-specific concerns.
- Do not skip or weaken a failing test merely to make CI green. Explain justified skips with an issue and conditions for removal.
- Fix the cause of flaky tests; do not add arbitrary sleeps when deterministic waiting or explicit readiness conditions are available.

### CI expectations
For a contribution, run the relevant checks locally where possible and ensure GitHub Actions runs the agreed sanity checks. As the app is established, the baseline should include:
- formatting check;
- ESLint (including React Hooks and TypeScript-aware rules where configured);
- TypeScript type-check;
- unit and integration tests;
- production build;
- critical Playwright end-to-end tests against the deployed feature preview;
- accessibility and visual/PDF regression checks as appropriate to the changed area.

Do not claim that a check is configured or passed unless there is actual evidence in the PR.

## 9. Definition of done for code changes

A code change is ready for review when:
- It is linked to an issue and stays within its approved scope.
- Layer boundaries and relevant principles above are respected, or a trade-off is explained.
- Types are precise and untrusted input is validated.
- Tests cover the changed behavior and important failure paths.
- Relevant lint, type-check, test, and build commands pass.
- Accessible behavior and responsive/keyboard alternatives are considered.
- User data and credentials are protected; errors preserve work.
- Documentation and examples are updated where behavior or contracts changed.
- The PR describes what changed, why, how it was tested, and any known limitations.

## 10. Reference material

These are primary or respected references to consult as practices evolve:

- [React — Rules of React](https://react.dev/reference/rules)
- [React — Strict Mode](https://react.dev/reference/react/StrictMode)
- [React — Using TypeScript](https://react.dev/learn/typescript)
- [TypeScript — strict compiler option](https://www.typescriptlang.org/tsconfig/strict.html)
- [typescript-eslint — Getting Started](https://typescript-eslint.io/getting-started/)
- [Vitest — Guide](https://vitest.dev/guide/)
- [Playwright — Testing](https://playwright.dev/docs/intro)
- [Martin Fowler — Beck Design Rules](https://martinfowler.com/bliki/BeckDesignRules.html)
- [Martin Fowler — Software Testing Guide](https://martinfowler.com/testing/)
- [W3C — WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [OpenAI API — Authentication and key safety](https://platform.openai.com/docs/api-reference/authentication)

This document should be updated through an issue and reviewed like any other project contribution.
