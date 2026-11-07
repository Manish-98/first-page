import { updateEntry, replacePersonalDetails } from "../../domain/cv/operations";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVDocument } from "../../domain/cv/types";
import type { CVCreationDependencies } from "./createCV";

export type CVTextTarget =
  | { type: "headline" }
  | { type: "summary"; sectionId: string; entryId: string };

export type CVTextUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; message: string };

export function updateCVTextElement(
  document: CVDocument,
  target: CVTextTarget,
  draft: string,
  dependencies: Pick<CVCreationDependencies, "now">,
): CVTextUpdate {
  const value = draft.trim();
  let updated;

  if (target.type === "headline") {
    const personalDetails = { ...document.content.personalDetails };
    if (value) personalDetails.headline = value;
    else delete personalDetails.headline;
    updated = replacePersonalDetails(document, personalDetails, dependencies.now());
  } else {
    const section = document.content.sections.find(item => item.id === target.sectionId);
    if (!section || section.kind !== "summary") return { ok: false, message: "This summary no longer exists." };
    const entry = section.entries.find(item => item.id === target.entryId);
    if (!entry) return { ok: false, message: "This summary text no longer exists." };
    updated = updateEntry(document, target.sectionId, target.entryId, { text: value }, dependencies.now());
  }

  if (!updated.ok) return { ok: false, message: updated.error.message };
  const issues = validateCVDocument(updated.value).issues;
  if (issues.length) return { ok: false, message: issues[0].message };
  return { ok: true, document: updated.value };
}
