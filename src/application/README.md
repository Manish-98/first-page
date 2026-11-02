# Application

Owns use cases and orchestration across Domain behavior and external capabilities.

Rules:
- May depend on Domain and contracts/ports owned by Application.
- Must not import React, UI, DOM/browser APIs, or concrete Infrastructure adapters.
- Keep use cases independent of presentation and adapter implementation details.

Declare a port only when a concrete use case needs an external capability.
