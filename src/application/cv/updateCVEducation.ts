import { addEntry, addSection, removeEntry, removeSection, updateEntry } from "../../domain/cv/operations";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { CVDateRange, EducationSectionContent } from "../../domain/cv/sections";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVCreationDependencies } from "./createCV";

export type EducationInput = EducationSectionContent;
export type EducationUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; fieldErrors: Readonly<Record<string, string>> };

function optionalText(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

function normalizeEducation(input: EducationInput): EducationSectionContent {
  const range = input.dateRange;
  const dateRange: CVDateRange | undefined = range
    ? range.ongoing
      ? { ...(range.startDate ? { startDate: range.startDate } : {}), ongoing: true }
      : {
          ...(range.startDate ? { startDate: range.startDate } : {}),
          ...(range.endDate ? { endDate: range.endDate } : {}),
          ongoing: false,
        }
    : undefined;
  return {
    institution: input.institution.trim(),
    qualification: input.qualification.trim(),
    ...(optionalText(input.fieldOfStudy) ? { fieldOfStudy: optionalText(input.fieldOfStudy) } : {}),
    ...(optionalText(input.location) ? { location: optionalText(input.location) } : {}),
    ...(dateRange ? { dateRange } : {}),
    ...(optionalText(input.grade) ? { grade: optionalText(input.grade) } : {}),
    ...(optionalText(input.description) ? { description: optionalText(input.description) } : {}),
  };
}

function sectionFor(document: CVDocument): CVSection | undefined {
  return document.content.sections.find(section => section.kind === "education");
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

export function saveCVEducation(
  document: CVDocument,
  entryId: string | undefined,
  input: EducationInput,
  dependencies: Pick<CVCreationDependencies, "generateId" | "now">,
): EducationUpdate {
  const normalized = normalizeEducation(input);
  const fieldErrors: Record<string, string> = {};
  if (!normalized.institution) fieldErrors.institution = "Enter an institution.";
  if (!normalized.qualification) fieldErrors.qualification = "Enter a qualification or degree.";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const section = sectionFor(document);
  const targetEntryId = entryId ?? dependencies.generateId();
  let result;
  if (entryId) {
    if (!section) return { ok: false, fieldErrors: { form: "The education entry could not be found." } };
    result = updateEntry(document, section.id, entryId, normalized, dependencies.now());
  } else if (section) {
    result = addEntry(document, section.id, { id: targetEntryId, content: normalized }, dependencies.now());
  } else {
    const newSection: CVSection = {
      id: dependencies.generateId(), kind: "education", title: "Education",
      entries: [{ id: targetEntryId, content: normalized }],
    };
    result = addSection(document, newSection, dependencies.now());
  }
  if (!result.ok) return { ok: false, fieldErrors: { form: result.error.message } };
  const errors = validationErrors(result.value, targetEntryId);
  return Object.keys(errors).length ? { ok: false, fieldErrors: errors } : { ok: true, document: result.value };
}

export function removeCVEducation(
  document: CVDocument,
  entryId: string,
  dependencies: Pick<CVCreationDependencies, "now">,
): EducationUpdate {
  const section = sectionFor(document);
  if (!section) return { ok: false, fieldErrors: { form: "The education entry could not be found." } };
  const removed = removeEntry(document, section.id, entryId, dependencies.now());
  if (!removed.ok) return { ok: false, fieldErrors: { form: removed.error.message } };
  if (section.entries.length > 1) return { ok: true, document: removed.value };
  const result = removeSection(removed.value, section.id, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, fieldErrors: { form: result.error.message } };
}

export function getEducationEntries(document: CVDocument) {
  return sectionFor(document)?.entries.map(entry => ({
    id: entry.id, content: entry.content as EducationSectionContent,
  })) ?? [];
}
