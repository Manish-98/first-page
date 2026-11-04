import { addEntry, addSection, removeEntry, removeSection, updateEntry } from "../../domain/cv/operations";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { SkillSectionContent } from "../../domain/cv/sections";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVCreationDependencies } from "./createCV";

export type SkillInput = SkillSectionContent;
export type SkillUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; fieldErrors: Readonly<Record<string, string>> };

function normalizeSkill(input: SkillInput): SkillSectionContent {
  const keywords = input.keywords?.map(item => item.trim()).filter(Boolean);
  return {
    name: input.name.trim(),
    ...(input.level ? { level: input.level } : {}),
    ...(input.category?.trim() ? { category: input.category.trim() } : {}),
    ...(keywords?.length ? { keywords } : {}),
  };
}

function sectionFor(document: CVDocument): CVSection | undefined {
  return document.content.sections.find(section => section.kind === "skills");
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

export function saveCVSkill(
  document: CVDocument,
  entryId: string | undefined,
  input: SkillInput,
  dependencies: Pick<CVCreationDependencies, "generateId" | "now">,
): SkillUpdate {
  const normalized = normalizeSkill(input);
  if (!normalized.name) return { ok: false, fieldErrors: { name: "Enter a skill name." } };
  const section = sectionFor(document);
  const targetEntryId = entryId ?? dependencies.generateId();
  let result;
  if (entryId) {
    if (!section) return { ok: false, fieldErrors: { form: "The skill could not be found." } };
    result = updateEntry(document, section.id, entryId, normalized, dependencies.now());
  } else if (section) {
    result = addEntry(document, section.id, { id: targetEntryId, content: normalized }, dependencies.now());
  } else {
    const newSection: CVSection = {
      id: dependencies.generateId(), kind: "skills", title: "Skills",
      entries: [{ id: targetEntryId, content: normalized }],
    };
    result = addSection(document, newSection, dependencies.now());
  }
  if (!result.ok) return { ok: false, fieldErrors: { form: result.error.message } };
  const errors = validationErrors(result.value, targetEntryId);
  return Object.keys(errors).length ? { ok: false, fieldErrors: errors } : { ok: true, document: result.value };
}

export function removeCVSkill(
  document: CVDocument,
  entryId: string,
  dependencies: Pick<CVCreationDependencies, "now">,
): SkillUpdate {
  const section = sectionFor(document);
  if (!section) return { ok: false, fieldErrors: { form: "The skill could not be found." } };
  const removed = removeEntry(document, section.id, entryId, dependencies.now());
  if (!removed.ok) return { ok: false, fieldErrors: { form: removed.error.message } };
  if (section.entries.length > 1) return { ok: true, document: removed.value };
  const result = removeSection(removed.value, section.id, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, fieldErrors: { form: result.error.message } };
}

export function getSkillEntries(document: CVDocument) {
  return sectionFor(document)?.entries.map(entry => ({
    id: entry.id, content: entry.content as SkillSectionContent,
  })) ?? [];
}
