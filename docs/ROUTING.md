# Application Routing

## Approach

The foundation uses hash-based routing with the browser's native URL and
history behavior. The route table lives in `src/ui/routing/AppRoutes.tsx`;
route components remain ordinary UI components.

Hash routing is intentional for the current GitHub Pages deployment. Static
hosting serves the application entry document at its deployed path, while the
hash fragment is handled entirely in the browser. This avoids requiring server
rewrite rules for nested paths and pull-request preview URLs.

## Current routes

| Hash route | Behavior |
|---|---|
| `#/` (also the initial empty hash) | Application welcome experience |
| Any unrecognized hash route | Helpful in-app not-found state with a home link |
| Any unknown server path | Branded static `404.html` page copied into the deployment output by Vite |

The static page lives at `public/404.html`, so Vite copies it unchanged to
`dist/404.html` for GitHub Pages. Its home link returns to the production
GitHub Pages project root. The in-app not-found state remains responsible for
unknown hash routes, which do not trigger a server request.

## Navigation and history

Use semantic anchor elements with hash destinations for in-app navigation.
The browser updates the URL and history stack; `AppRoutes` subscribes to
`hashchange` and updates the rendered route without a full-page reload.
Browser back and forward therefore navigate between visited hash routes.

Do not use direct `location.href` assignment for in-app navigation. Normal
external links should remain ordinary URLs.

## Adding a route

1. Create the page component under `src/ui/components/`.
2. Add its path and component to the route table in `AppRoutes.tsx`.
3. Add a semantic navigation link only when the route is an approved user-facing
   destination.
4. Verify direct hash navigation, unknown-route fallback, keyboard access, and
   browser history behavior.

Route definitions are a UI concern. They must not import or depend on CV domain
models, use cases, or infrastructure implementations.
