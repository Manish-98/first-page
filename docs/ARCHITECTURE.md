# Application Architecture

## Purpose

First Page uses four layers to keep CV rules independent of React and browser-specific implementations. This is a lightweight dependency convention, not a framework or a dependency-injection container.

## Layers and ownership

| Layer | Location | Owns | May depend on |
|---|---|---|---|
| Domain | `src/domain/` | CV concepts, invariants, validation, domain errors, layout-independent calculations | Domain modules and platform-independent TypeScript |
| Application | `src/application/` | User-facing use cases and orchestration; coordinates domain behavior through ports | Domain and application-owned contracts |
| Infrastructure | `src/infrastructure/` | Browser/file/PDF/provider adapters and implementations of inner-layer ports | Application contracts and Domain types |
| UI | `src/ui/` | React components, hooks, accessible interaction and presentation | Application public use cases; presentation-only shared UI |

The current application is still a bootstrap shell. Empty layer directories contain short README files so their intended ownership is visible without introducing placeholder runtime code. Add production modules only when an issue requires them.

## Dependency direction

```text
UI ───────────────> Application ───────────────> Domain
                         ^                         ^
                         |                         |
Infrastructure ─────────┴─────────────────────────┘
```

- UI invokes application use cases. UI must not implement domain invariants or serialize project files itself.
- Application owns ports/contracts needed by its use cases. It may import Domain, but not React, DOM APIs, or concrete Infrastructure adapters.
- Infrastructure implements ports declared by Application (or Domain when the contract is genuinely a domain concept). It may import those inner-layer contracts and Domain types.
- Domain is the innermost layer. It must not import React, Vite, browser APIs, Application, UI, Infrastructure, provider SDKs, or PDF libraries.
- Composition/wiring belongs at the outer edge (currently the application entry point) when concrete adapters are introduced. Do not add a DI framework for a handful of dependencies.

## Module and import conventions

- Place a module according to the responsibility it owns, not according to the module that happens to call it.
- Use `PascalCase` for React components and type names; use `camelCase` for functions, variables, and non-component files.
- Prefer focused named exports. Avoid broad barrel files that hide dependency direction or create cycles.
- Use `import type` for type-only dependencies.
- Keep imports relative to the source tree until a real readability problem justifies aliases.
- Do not import across layers in a direction that points outward from an inner layer.
- Shared presentation-only components may live under `src/ui/components/`; they must not become a home for domain rules.
- Keep browser APIs behind Infrastructure adapters. Do not access `window`, `document`, `localStorage`, or file picker APIs from Domain or Application.
- Keep external SDKs and rendering libraries inside their Infrastructure adapter modules.

## Enforcement

ESLint restrictions in `eslint.config.js` guard the most important forbidden imports and browser globals in Domain and Application. These are targeted guardrails, not a complete static architecture-analysis system. Review new imports against this document, especially type-only imports and indirect dependencies.

## Adding a new module

1. Identify the responsibility and place it in the owning layer.
2. Define a small inner-layer port only when an inner layer needs an external capability.
3. Implement that port in Infrastructure.
4. Call the use case from UI; keep JSX focused on presentation and interaction.
5. Add tests at the layer that owns the behavior. Domain rules should be testable without a browser or React runtime.

Do not introduce speculative plugin systems, generic service registries, or abstractions without a concrete second use case.
