import type { CVCreationDependencies } from "../../application/cv/createCV";

/** Browser-backed providers are kept outside the Application and Domain layers. */
export const browserCVCreationDependencies: CVCreationDependencies = {
  generateId: () => {
    if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
      throw new Error("Secure UUID generation is unavailable in this browser.");
    }
    return crypto.randomUUID();
  },
  now: () => new Date().toISOString(),
};
