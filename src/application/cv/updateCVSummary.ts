import { addSection, removeEntry, removeSection, updateEntry } from "../../domain/cv/operations";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { CVCreationDependencies } from "./createCV";

export type SummaryUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; message: string };

export function updateCVSummary(
  document: CVDocument,
  text: string,
  dependencies: CVCreationDependencies,
): SummaryUpdate {
  const value = text.trim();
  const section = document.content.sections.find(item => item.kind === "summary");

  if (!value) {
    if (!section) return { ok: true, document };
    let next = document;
    for (const entry of section.entries) {
      const result = removeEntry(next, section.id, entry.id, dependencies.now());
      if (!result.ok) return { ok: false, message: result.error.message };
      next = result.value;
    }
    const result = removeSection(next, section.id, dependencies.now());
    return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
  }

  if (section?.entries[0]) {
    const result = updateEntry(document, section.id, section.entries[0].id, { text: value }, dependencies.now());
    return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
  }

  const newSection: CVSection = {
    id: dependencies.generateId(),
    kind: "summary",
    title: "Professional Summary",
    entries: [{ id: dependencies.generateId(), content: { text: value } }],
  };
  const result = addSection(document, newSection, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
}
