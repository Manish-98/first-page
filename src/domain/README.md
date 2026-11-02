# Domain

Owns platform-independent CV concepts, invariants, validation, and domain errors.

Rules:
- No React, browser APIs, Vite, UI, Application, or Infrastructure imports.
- No provider SDK or PDF-renderer dependencies.
- Keep this layer independently testable in plain TypeScript.

Add domain modules when an approved CV-domain issue requires them; do not add placeholder models here.
