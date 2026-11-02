const { MODE, BASE_URL, DEV, PROD } = import.meta.env;

function validateBuildEnvironment(): void {
  if (typeof MODE !== "string" || MODE.trim().length === 0) {
    throw new Error(
      "Invalid application configuration: Vite mode must be a non-empty string.",
    );
  }

  if (typeof BASE_URL !== "string" || BASE_URL.trim().length === 0) {
    throw new Error(
      "Invalid application configuration: Vite base URL must be a non-empty string.",
    );
  }

  if (typeof DEV !== "boolean" || typeof PROD !== "boolean" || DEV === PROD) {
    throw new Error(
      "Invalid application configuration: Vite development and production flags are inconsistent.",
    );
  }
}

validateBuildEnvironment();

/**
 * The single public boundary for build-time application settings.
 * Values exposed by Vite are public and must never contain credentials.
 */
export const appConfig = Object.freeze({
  mode: MODE,
  baseUrl: BASE_URL,
  isDevelopment: DEV,
  isProduction: PROD,
});
