# Environment and Runtime Configuration

## Scope

The application currently needs only Vite's built-in build metadata. There are no application-specific environment variables, runtime secrets, provider credentials, or required deployment-time settings.

All application code that needs build/environment metadata must import the typed `appConfig` object from `src/infrastructure/config/appConfig.ts`. Do not read `import.meta.env` directly from UI, Domain, or Application modules. Add new settings only when an approved feature requires them.

## Available settings

| Setting | Source | Meaning |
|---|---|---|
| `mode` | Vite `MODE` | Active build mode; defaults to `development` for `vite` and `production` for `vite build`. Custom modes may be supplied with Vite's `--mode` option. |
| `baseUrl` | Vite `BASE_URL` | Public base path used by the app; follows the `base` option in `vite.config.ts` (currently `./` for root and nested Pages previews). |
| `isDevelopment` | Vite `DEV` | Whether Vite is running in development mode. |
| `isProduction` | Vite `PROD` | Whether Vite is building/serving the production mode. |

Vite supplies these values. The configuration boundary checks that required strings are non-empty and that the development/production flags are valid and mutually exclusive. Invalid configuration fails early with a developer-facing error that does not print environment values.

## Local development and builds

No `.env` file is required. Safe defaults are supplied by Vite:

- `npm run dev` uses Vite's `development` mode.
- `npm run build` uses Vite's `production` mode.
- `npm run preview` serves the already-built output; it does not introduce a separate runtime configuration source.
- A custom Vite mode can be selected with `vite --mode <name>` or the equivalent npm script argument. The mode name is metadata, not a secret.

The repository ignores local `.env` files. Do not add a local environment file to version control.

## Public values and secrets

Vite replaces client-exposed environment values at build time. Anything exposed to browser code or embedded in the generated bundle is public and can be inspected by users.

- Never place passwords, API keys, access tokens, signing keys, private endpoints, or personal data in `VITE_*` variables or any other client-side build setting.
- Do not add AI provider credentials or AI configuration through this foundation boundary.
- A value being stored in a local `.env` file does not make it safe to expose in a browser bundle.
- If a future feature needs credentials or privileged configuration, it requires a separate security/design decision and must not weaken the local-first privacy constraints.

## Adding configuration

1. Link the change to an approved issue and establish why the setting is needed.
2. Prefer a Vite built-in value where it fully expresses the requirement; otherwise define the smallest documented application-specific variable.
3. Add its type to the Vite environment declaration only when needed, and validate required/optional values at `src/infrastructure/config/appConfig.ts`.
4. Define a safe local default for optional values. Do not silently substitute a success-shaped value for a missing required setting.
5. Update this document with the setting's purpose, default, exposure classification, and behavior when missing or invalid.
6. Keep consumers dependent on `appConfig`, not on raw `import.meta.env`.

Configuration diagnostics must identify the invalid setting category without printing its value. Never include credentials or user/CV data in thrown errors or logs.
