# Infrastructure

Owns adapters for browser capabilities, project-file access, PDF rendering, and external providers.

Rules:
- Implements ports declared by Application (or Domain when appropriate).
- May depend inward on Application contracts and Domain types.
- Must not become the owner of business rules or UI state.

Add adapters alongside the issue that introduces the corresponding capability.
