# Domain

Owns platform-independent CV concepts, invariants, validation, and domain errors.

Rules:
- No React, browser APIs, Vite, UI, Application, or Infrastructure imports.
- No provider SDK or PDF-renderer dependencies.
- Keep this layer independently testable in plain TypeScript.

The foundational CV document contracts are defined in [cv/](./cv/). Add further domain modules only when an approved issue requires them; do not add placeholder models.
