import { createCVDocument, type CVOperationError } from "../../domain/cv/operations";
import type { CVDocument } from "../../domain/cv/types";

export interface CVCreationDependencies {
  generateId: () => string;
  now: () => string;
}

export type CreateCVResult =
  | { ok: true; document: CVDocument }
  | { ok: false; error: { code: "invalid-title" | "creation-failed"; message: string } | CVOperationError };

/** Creates a canonical, empty CV while keeping nondeterministic services injectable. */
export function createCV(
  title: string,
  dependencies: CVCreationDependencies,
): CreateCVResult {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return {
      ok: false,
      error: { code: "invalid-title", message: "Enter a title for your CV." },
    };
  }

  try {
    const result = createCVDocument({
      id: dependencies.generateId(),
      title: normalizedTitle,
      createdAt: dependencies.now(),
    });

    return result.ok
      ? { ok: true, document: result.value }
      : { ok: false, error: result.error };
  } catch {
    return {
      ok: false,
      error: {
        code: "creation-failed",
        message: "The CV could not be created. Please try again.",
      },
    };
  }
}
