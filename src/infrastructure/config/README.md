# Configuration

`appConfig.ts` is the single typed boundary for public Vite build metadata. Consumers must import settings from this module rather than reading `import.meta.env` directly.

Keep this module limited to settings required by approved application features. Never expose secrets or personal data through client-side configuration. See [Environment and Runtime Configuration](../../../docs/CONFIGURATION.md) for the contract and security rules.
