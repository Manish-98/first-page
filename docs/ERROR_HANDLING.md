# Application error handling and feedback

## Rendering error boundary

`AppErrorBoundary` wraps the application shell and catches errors thrown
while rendering descendant React components, in constructors, and in
lifecycle methods. It presents a generic recovery screen with a retry action.

The fallback intentionally does not display exception messages, stack traces,
component stacks, or imported/user content. Rendering errors are not sent to a
remote service or persisted. The boundary can be reset with **Try again**;
if the underlying problem remains, React will show the fallback again.

Error boundaries do not catch errors from event handlers, asynchronous
callbacks, server-side rendering, or errors thrown by the boundary itself.
Those flows must handle and present their own failures at the relevant feature
boundary.

## Shared feedback component

`AppFeedback` provides a small, content-composed presentation pattern:

| Variant | Semantics | Intended use |
|---|---|---|
| `loading` | `role="status"`, polite live region | Work currently in progress |
| `empty` | `role="status"`, polite live region | A valid screen with no content yet |
| `success` | `role="status"`, polite live region | A completed, user-visible action |
| `error` | `role="alert"`, assertive live region | A recoverable problem requiring attention |

The caller supplies concise, actionable text. The component does not infer
success, hide errors, or own feature-specific retry logic. Feature flows should
place their own retry or recovery controls alongside the relevant message.

## Privacy and boundaries

- Never render raw exceptions, stack traces, provider responses, or imported
  CV content in a generic error state.
- No remote telemetry or network reporting is performed.
- Domain error definitions remain in Domain; this UI layer owns only
  presentation and rendering recovery.
- Save/open/export and other feature-specific failures belong to their
  respective application use cases and feature interfaces.

## Verification

Manually exercise the boundary with a temporary render-time throw in a
descendant component, then remove the throw. Confirm the fallback is announced
as an alert, exposes no exception details, and its retry button attempts to
render the child tree again. Also inspect the four feedback variants with a
screen reader or accessibility tree to confirm their status/alert roles.
