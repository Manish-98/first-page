import { addEntry, addSection, removeEntry, removeSection, updateEntry } from "../../domain/cv/operations";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { CVSectionContentMap } from "../../domain/cv/sections";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVCreationDependencies } from "./createCV";

export type AdditionalStandardSectionKind = "projects" | "languages" | "certifications" | "awards" | "volunteering" | "publications" | "interests" | "references";
export type StandardSectionContent = CVSectionContentMap[AdditionalStandardSectionKind];
export type StandardSectionResult =
  | { ok: true; document: CVDocument }
  | { ok: false; fieldErrors: Readonly<Record<string, string>> };

function normalizeValue(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(item => typeof item === "string" ? item.trim() : item).filter(item => item !== "");
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, normalizeValue(item)]));
  }
  return value;
}

function normalizeContent<K extends AdditionalStandardSectionKind>(content: CVSectionContentMap[K]): CVSectionContentMap[K] {
  const normalized = normalizeValue(content) as Record<string, unknown>;
  for (const [key, value] of Object.entries(normalized)) {
    if (value === "") delete normalized[key];
    if (Array.isArray(value) && value.length === 0) delete normalized[key];
  }
  return normalized as CVSectionContentMap[K];
}

function sectionFor(document: CVDocument, kind: AdditionalStandardSectionKind): CVSection | undefined {
  return document.content.sections.find(section => section.kind === kind);
}

function validationErrors(document: CVDocument, entryId: string): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of validateCVDocument(document).issues) {
    if (issue.entryId !== entryId) continue;
    const marker = ".content.";
    const path = issue.path.includes(marker) ? issue.path.split(marker).pop() ?? "form" : "form";
    errors[path] ??= issue.message;
  }
  return errors;
}

/** Adds or updates one entry in any of the eight remaining built-in section types. */
export function saveStandardCVEntry<K extends AdditionalStandardSectionKind>(
  document: CVDocument,
  kind: K,
  entryId: string | undefined,
  content: CVSectionContentMap[K],
  dependencies: Pick<CVCreationDependencies, "generateId" | "now">,
): StandardSectionResult {
  const normalized = normalizeContent(content);
  const section = sectionFor(document, kind);
  const targetEntryId = entryId ?? dependencies.generateId();
  let result;
  if (entryId) {
    if (!section) return { ok: false, fieldErrors: { form: "The entry could not be found." } };
    result = updateEntry(document, section.id, entryId, normalized, dependencies.now());
  } else if (section) {
    result = addEntry(document, section.id, { id: targetEntryId, content: normalized }, dependencies.now());
  } else {
    const titles: Record<AdditionalStandardSectionKind, string> = {
      projects: "Projects", languages: "Languages", certifications: "Certifications", awards: "Awards",
      volunteering: "Volunteering", publications: "Publications", interests: "Interests", references: "References",
    };
    const newSection: CVSection = {
      id: dependencies.generateId(), kind, title: titles[kind],
      entries: [{ id: targetEntryId, content: normalized }],
    };
    result = addSection(document, newSection, dependencies.now());
  }
  if (!result.ok) return { ok: false, fieldErrors: { form: result.error.message } };
  const errors = validationErrors(result.value, targetEntryId);
  return Object.keys(errors).length ? { ok: false, fieldErrors: errors } : { ok: true, document: result.value };
}

/** Removes an entry and removes its section when the final entry is deleted. */
export function removeStandardCVEntry(
  document: CVDocument,
  kind: AdditionalStandardSectionKind,
  entryId: string,
  dependencies: Pick<CVCreationDependencies, "now">,
): StandardSectionResult {
  const section = sectionFor(document, kind);
  if (!section) return { ok: false, fieldErrors: { form: "The entry could not be found." } };
  const removed = removeEntry(document, section.id, entryId, dependencies.now());
  if (!removed.ok) return { ok: false, fieldErrors: { form: removed.error.message } };
  if (section.entries.length > 1) return { ok: true, document: removed.value };
  const result = removeSection(removed.value, section.id, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, fieldErrors: { form: result.error.message } };
}

export function getStandardCVEntries<K extends AdditionalStandardSectionKind>(
  document: CVDocument,
  kind: K,
): Array<{ id: string; content: CVSectionContentMap[K] }> {
  const section = sectionFor(document, kind);
  return section?.entries.map(entry => ({ id: entry.id, content: entry.content as CVSectionContentMap[K] })) ?? [];
}
