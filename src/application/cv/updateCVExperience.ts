import {
  addEntry,
  addSection,
  removeEntry,
  removeSection,
  updateEntry,
} from "../../domain/cv/operations";
import type { CVDocument } from "../../domain/cv/types";
import type { CVSection } from "../../domain/cv/types";
import type { CVDateRange, CVPartialDate, ExperienceSectionContent } from "../../domain/cv/sections";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVCreationDependencies } from "./createCV";

export type ExperienceInput = ExperienceSectionContent;

export type ExperienceUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; fieldErrors: Readonly<Record<string, string>> };

function optionalText(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

function normalizeExperience(input: ExperienceInput): ExperienceSectionContent {
  const responsibilities = input.responsibilities?.map(item => item.trim()).filter(Boolean);
  const achievements = input.achievements?.map(item => item.trim()).filter(Boolean);
  const dateRange = input.dateRange;
  const normalizedRange: CVDateRange | undefined = dateRange
    ? dateRange.ongoing
      ? { ...(dateRange.startDate ? { startDate: dateRange.startDate } : {}), ongoing: true }
      : {
          ...(dateRange.startDate ? { startDate: dateRange.startDate } : {}),
          ...(dateRange.endDate ? { endDate: dateRange.endDate } : {}),
          ongoing: false,
        }
    : undefined;

  return {
    role: input.role.trim(),
    employer: input.employer.trim(),
    ...(optionalText(input.location) ? { location: optionalText(input.location) } : {}),
    ...(normalizedRange ? { dateRange: normalizedRange } : {}),
    ...(input.employmentType ? { employmentType: input.employmentType } : {}),
    ...(optionalText(input.description) ? { description: optionalText(input.description) } : {}),
    ...(responsibilities?.length ? { responsibilities } : {}),
    ...(achievements?.length ? { achievements } : {}),
  };
}

function sectionFor(document: CVDocument): CVSection | undefined {
  return document.content.sections.find(section => section.kind === "experience");
}

function validationErrors(document: CVDocument, entryId: string): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of validateCVDocument(document).issues) {
    if (issue.entryId !== entryId) continue;
    const marker = ".content.";
    const fieldPath = issue.path.includes(marker) ? issue.path.split(marker).pop() ?? "form" : "form";
    errors[fieldPath] ??= issue.message;
  }
  return errors;
}

/** Add or replace one experience entry while retaining its identity on edits. */
export function saveCVExperience(
  document: CVDocument,
  entryId: string | undefined,
  input: ExperienceInput,
  dependencies: Pick<CVCreationDependencies, "generateId" | "now">,
): ExperienceUpdate {
  const normalized = normalizeExperience(input);
  const fieldErrors: Record<string, string> = {};
  if (!normalized.role) fieldErrors.role = "Enter a job title.";
  if (!normalized.employer) fieldErrors.employer = "Enter an employer.";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const section = sectionFor(document);
  const targetEntryId = entryId ?? dependencies.generateId();
  let result;

  if (entryId) {
    if (!section) return { ok: false, fieldErrors: { form: "The experience entry could not be found." } };
    result = updateEntry(document, section.id, entryId, normalized, dependencies.now());
  } else if (section) {
    result = addEntry(document, section.id, { id: targetEntryId, content: normalized }, dependencies.now());
  } else {
    const newSection: CVSection = {
      id: dependencies.generateId(),
      kind: "experience",
      title: "Work Experience",
      entries: [{ id: targetEntryId, content: normalized }],
    };
    result = addSection(document, newSection, dependencies.now());
  }

  if (!result.ok) return { ok: false, fieldErrors: { form: result.error.message } };
  const errors = validationErrors(result.value, targetEntryId);
  return Object.keys(errors).length
    ? { ok: false, fieldErrors: errors }
    : { ok: true, document: result.value };
}

/** Remove only the requested entry; remove its section when it becomes empty. */
export function removeCVExperience(
  document: CVDocument,
  entryId: string,
  dependencies: Pick<CVCreationDependencies, "now">,
): ExperienceUpdate {
  const section = sectionFor(document);
  if (!section) return { ok: false, fieldErrors: { form: "The experience entry could not be found." } };
  const removed = removeEntry(document, section.id, entryId, dependencies.now());
  if (!removed.ok) return { ok: false, fieldErrors: { form: removed.error.message } };
  if (section.entries.length > 1) return { ok: true, document: removed.value };
  const result = removeSection(removed.value, section.id, dependencies.now());
  return result.ok
    ? { ok: true, document: result.value }
    : { ok: false, fieldErrors: { form: result.error.message } };
}

export function getExperienceEntries(document: CVDocument) {
  const section = sectionFor(document);
  return section?.entries.map(entry => ({
    id: entry.id,
    content: entry.content as ExperienceSectionContent,
  })) ?? [];
}

export function toExperienceDateRange(
  startDate: CVPartialDate | undefined,
  endDate: CVPartialDate | undefined,
  ongoing: boolean,
): CVDateRange | undefined {
  if (ongoing) return { ...(startDate ? { startDate } : {}), ongoing: true };
  if (!startDate && !endDate) return undefined;
  return { ...(startDate ? { startDate } : {}), ...(endDate ? { endDate } : {}), ongoing: false };
}
