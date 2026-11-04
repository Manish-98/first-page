import type { ContactDetails, CVDocument, CVDocumentId, CVDocumentMetadata, CVEntryId, CVSection, CVSectionEntry, CVSectionId, ISODateTimeString, PersonalDetails, PersonName, PostalAddress } from "./types";
import type { CVSectionContentMap } from "./sections";

export type CVOperationErrorCode = "duplicate-section-id" | "duplicate-entry-id" | "section-not-found" | "entry-not-found" | "custom-field-not-found" | "invalid-index" | "section-kind-mismatch" | "entry-content-kind-mismatch";
export interface CVOperationError { code: CVOperationErrorCode; message: string; documentId?: CVDocumentId; sectionId?: CVSectionId; entryId?: CVEntryId; fieldId?: string }
export type CVOperationResult<T> = { ok: true; value: T } | { ok: false; error: CVOperationError };
const success = <T>(value: T): CVOperationResult<T> => ({ ok: true, value });
const failure = (code: CVOperationErrorCode, message: string, context: Omit<CVOperationError, "code" | "message"> = {}): CVOperationResult<never> => ({ ok: false, error: { code, message, ...context } });
export interface CreateCVDocumentInput { id: CVDocumentId; title: string; createdAt: ISODateTimeString; personalDetails?: PersonalDetails; sections?: readonly CVSection[] }

/*
 * Runtime counterpart to CVSectionContentMap. Required keys are deliberately
 * the minimum shape discriminating each built-in section payload; optional
 * fields remain optional. Unknown extension kinds remain caller-defined.
 */
const requiredContentKeys: { [K in keyof CVSectionContentMap]: readonly string[] } = {
  summary: ["text"],
  experience: ["role", "employer"],
  education: ["institution", "qualification"],
  skills: ["name"],
  projects: ["name"],
  languages: ["language"],
  certifications: ["name"],
  awards: ["title"],
  volunteering: ["role", "organization"],
  publications: ["title"],
  interests: ["name"],
  references: ["name"],
  custom: ["fields"],
};
function matchesSectionKind(kind: string, content: unknown): boolean {
  if (typeof content !== "object" || content === null || Array.isArray(content)) return false;
  if (!Object.prototype.hasOwnProperty.call(requiredContentKeys, kind)) return true;
  const required = requiredContentKeys[kind as keyof CVSectionContentMap];
  return required.every(key => key in content) &&
    (kind !== "custom" || Array.isArray((content as { fields?: unknown }).fields));
}
function validateEntryContent<T extends CVSection>(doc: CVDocument<T>, section: T, entry: CVSectionEntry<unknown>): CVOperationResult<never> | undefined {
  if (matchesSectionKind(section.kind, entry.content)) return undefined;
  return failure("entry-content-kind-mismatch", `Entry '${entry.id}' does not contain the required content for section kind '${section.kind}'.`, { documentId: doc.id, sectionId: section.id, entryId: entry.id });
}

export function createCVDocument<T extends CVSection = CVSection>(input: CreateCVDocumentInput & { sections?: readonly T[] }): CVOperationResult<CVDocument<T>> {
  const sectionIds = new Set<string>(), entryIds = new Set<string>();
  for (const section of input.sections ?? []) {
    if (sectionIds.has(section.id)) return failure("duplicate-section-id", `Section '${section.id}' appears more than once.`, { sectionId: section.id });
    sectionIds.add(section.id);
    for (const entry of section.entries) {
      if (entryIds.has(entry.id)) return failure("duplicate-entry-id", `Entry '${entry.id}' appears more than once.`, { sectionId: section.id, entryId: entry.id });
      entryIds.add(entry.id);
    }
  }
  for (const section of input.sections ?? []) for (const entry of section.entries) {
    const mismatch = validateEntryContent({ id: input.id, metadata: { title: input.title, createdAt: input.createdAt, updatedAt: input.createdAt }, content: { personalDetails: input.personalDetails ?? {}, sections: input.sections ?? [] } }, section, entry);
    if (mismatch) return mismatch;
  }
  return success({ id: input.id, metadata: { title: input.title, createdAt: input.createdAt, updatedAt: input.createdAt }, content: { personalDetails: input.personalDetails ?? {}, sections: input.sections ?? [] } });
}
function withUpdatedAt<T extends CVSection>(doc: CVDocument<T>, updatedAt: ISODateTimeString, content = doc.content, metadata: Partial<CVDocumentMetadata> = {}): CVDocument<T> { return { ...doc, metadata: { ...doc.metadata, ...metadata, updatedAt }, content }; }
export function updateDocumentMetadata<T extends CVSection>(doc: CVDocument<T>, updates: { title?: string }, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { return success(withUpdatedAt(doc, at, doc.content, updates)); }
export function updatePersonalDetails<T extends CVSection>(doc: CVDocument<T>, updates: Partial<PersonalDetails>, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { return success(withUpdatedAt(doc, at, { ...doc.content, personalDetails: { ...doc.content.personalDetails, ...updates } })); }

/** Replaces personal details atomically; omitted optional properties are truly cleared. */
export function replacePersonalDetails<T extends CVSection>(doc: CVDocument<T>, personalDetails: PersonalDetails, at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  return success(withUpdatedAt(doc, at, { ...doc.content, personalDetails }));
}
export function updatePersonName<T extends CVSection>(doc: CVDocument<T>, updates: Partial<PersonName>, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { return updatePersonalDetails(doc, { name: { ...doc.content.personalDetails.name, ...updates } }, at); }
export function updateContactDetails<T extends CVSection>(doc: CVDocument<T>, updates: Partial<ContactDetails>, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { return updatePersonalDetails(doc, { contact: { ...doc.content.personalDetails.contact, ...updates } }, at); }
export function updatePostalAddress<T extends CVSection>(doc: CVDocument<T>, updates: Partial<PostalAddress>, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { return updateContactDetails(doc, { address: { ...doc.content.personalDetails.contact?.address, ...updates } }, at); }
const hasEntryId = <T extends CVSection>(doc: CVDocument<T>, id: CVEntryId): boolean => doc.content.sections.some(s => s.entries.some(e => e.id === id));
const sectionIndex = <T extends CVSection>(doc: CVDocument<T>, id: CVSectionId): number => doc.content.sections.findIndex(s => s.id === id);

/**
 * Reorders the canonical sections array. A no-op move returns the original
 * document (including its timestamp); an actual move updates updatedAt.
 */
export function moveSectionToPosition<T extends CVSection>(
  doc: CVDocument<T>,
  id: CVSectionId,
  position: number,
  at: ISODateTimeString,
): CVOperationResult<CVDocument<T>> {
  const currentIndex = sectionIndex(doc, id);
  if (currentIndex < 0) return failure("section-not-found", `Section '${id}' was not found.`, { documentId: doc.id, sectionId: id });
  const sections = doc.content.sections;
  if (!Number.isInteger(position) || position < 0 || position >= sections.length) {
    return failure("invalid-index", `Section position ${position} is out of bounds.`, { documentId: doc.id, sectionId: id });
  }
  if (currentIndex === position) return success(doc);

  const reordered = [...sections];
  const [section] = reordered.splice(currentIndex, 1);
  reordered.splice(position, 0, section);
  return success(withUpdatedAt(doc, at, { ...doc.content, sections: reordered }));
}

export function moveSectionUp<T extends CVSection>(
  doc: CVDocument<T>,
  id: CVSectionId,
  at: ISODateTimeString,
): CVOperationResult<CVDocument<T>> {
  const currentIndex = sectionIndex(doc, id);
  if (currentIndex < 0) return failure("section-not-found", `Section '${id}' was not found.`, { documentId: doc.id, sectionId: id });
  if (currentIndex === 0) return success(doc);
  return moveSectionToPosition(doc, id, currentIndex - 1, at);
}

export function moveSectionDown<T extends CVSection>(
  doc: CVDocument<T>,
  id: CVSectionId,
  at: ISODateTimeString,
): CVOperationResult<CVDocument<T>> {
  const currentIndex = sectionIndex(doc, id);
  if (currentIndex < 0) return failure("section-not-found", `Section '${id}' was not found.`, { documentId: doc.id, sectionId: id });
  if (currentIndex === doc.content.sections.length - 1) return success(doc);
  return moveSectionToPosition(doc, id, currentIndex + 1, at);
}
export function addSection<T extends CVSection>(doc: CVDocument<T>, section: T, at: ISODateTimeString, index = doc.content.sections.length): CVOperationResult<CVDocument<T>> {
  if (doc.content.sections.some(s => s.id === section.id)) return failure("duplicate-section-id", `Section '${section.id}' already exists.`, { documentId: doc.id, sectionId: section.id });
  const ids = new Set<string>();
  for (const entry of section.entries) {
    if (ids.has(entry.id) || hasEntryId(doc, entry.id)) return failure("duplicate-entry-id", `Entry '${entry.id}' already exists.`, { documentId: doc.id, sectionId: section.id, entryId: entry.id });
    ids.add(entry.id);
  }
  for (const entry of section.entries) { const mismatch = validateEntryContent(doc, section, entry); if (mismatch) return mismatch; }
  if (!Number.isInteger(index) || index < 0 || index > doc.content.sections.length) return failure("invalid-index", `Section insertion index ${index} is out of bounds.`, { documentId: doc.id, sectionId: section.id });
  const sections = [...doc.content.sections]; sections.splice(index, 0, section); return success(withUpdatedAt(doc, at, { ...doc.content, sections }));
}
export function updateSection<T extends CVSection>(doc: CVDocument<T>, id: CVSectionId, updates: { title?: string; entries?: readonly CVSectionEntry<T["entries"][number]["content"]>[] }, at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  const index = sectionIndex(doc, id); if (index < 0) return failure("section-not-found", `Section '${id}' was not found.`, { documentId: doc.id, sectionId: id });
  const current = doc.content.sections[index];
  if (updates.entries) {
    const ids = new Set<string>();
    for (const entry of updates.entries) {
      const elsewhere = doc.content.sections.some((s, i) => i !== index && s.entries.some(e => e.id === entry.id));
      if (ids.has(entry.id) || elsewhere) return failure("duplicate-entry-id", `Entry '${entry.id}' already exists.`, { documentId: doc.id, sectionId: id, entryId: entry.id });
      ids.add(entry.id);
    }
    for (const entry of updates.entries) { const mismatch = validateEntryContent(doc, current, entry); if (mismatch) return mismatch; }
  }
  const sections = [...doc.content.sections]; sections[index] = { ...current, ...updates, id: current.id, kind: current.kind } as T; return success(withUpdatedAt(doc, at, { ...doc.content, sections }));
}
export function removeSection<T extends CVSection>(doc: CVDocument<T>, id: CVSectionId, at: ISODateTimeString): CVOperationResult<CVDocument<T>> { if (sectionIndex(doc, id) < 0) return failure("section-not-found", `Section '${id}' was not found.`, { documentId: doc.id, sectionId: id }); return success(withUpdatedAt(doc, at, { ...doc.content, sections: doc.content.sections.filter(s => s.id !== id) })); }
export function addEntry<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, entry: CVSectionEntry<T["entries"][number]["content"]>, at: ISODateTimeString, index?: number): CVOperationResult<CVDocument<T>> {
  const si = sectionIndex(doc, sid); if (si < 0) return failure("section-not-found", `Section '${sid}' was not found.`, { documentId: doc.id, sectionId: sid });
  const current = doc.content.sections[si];
  if (hasEntryId(doc, entry.id)) return failure("duplicate-entry-id", `Entry '${entry.id}' already exists.`, { documentId: doc.id, sectionId: sid, entryId: entry.id });
  const mismatch = validateEntryContent(doc, current, entry); if (mismatch) return mismatch;
  const position = index ?? current.entries.length; if (!Number.isInteger(position) || position < 0 || position > current.entries.length) return failure("invalid-index", `Entry insertion index ${position} is out of bounds.`, { documentId: doc.id, sectionId: sid, entryId: entry.id });
  const entries = [...current.entries]; entries.splice(position, 0, entry); const sections = [...doc.content.sections]; sections[si] = { ...current, entries } as T; return success(withUpdatedAt(doc, at, { ...doc.content, sections }));
}
export function updateEntry<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, content: T["entries"][number]["content"], at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  const si = sectionIndex(doc, sid); if (si < 0) return failure("section-not-found", `Section '${sid}' was not found.`, { documentId: doc.id, sectionId: sid });
  const current = doc.content.sections[si];
  if (!current.entries.some(e => e.id === eid)) return failure("entry-not-found", `Entry '${eid}' was not found.`, { documentId: doc.id, sectionId: sid, entryId: eid });
  const mismatch = validateEntryContent(doc, current, { id: eid, content }); if (mismatch) return mismatch;
  const sections = [...doc.content.sections]; sections[si] = { ...current, entries: current.entries.map(e => e.id === eid ? { ...e, content } : e) } as T; return success(withUpdatedAt(doc, at, { ...doc.content, sections }));
}
export function removeEntry<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  const si = sectionIndex(doc, sid); if (si < 0) return failure("section-not-found", `Section '${sid}' was not found.`, { documentId: doc.id, sectionId: sid }); const current = doc.content.sections[si];
  if (!current.entries.some(e => e.id === eid)) return failure("entry-not-found", `Entry '${eid}' was not found.`, { documentId: doc.id, sectionId: sid, entryId: eid });
  const sections = [...doc.content.sections]; sections[si] = { ...current, entries: current.entries.filter(e => e.id !== eid) } as T; return success(withUpdatedAt(doc, at, { ...doc.content, sections }));
}
export function duplicateEntry<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, sourceId: CVEntryId, newId: CVEntryId, at: ISODateTimeString, index?: number): CVOperationResult<CVDocument<T>> {
  const si = sectionIndex(doc, sid); if (si < 0) return failure("section-not-found", `Section '${sid}' was not found.`, { documentId: doc.id, sectionId: sid });
  if (hasEntryId(doc, newId)) return failure("duplicate-entry-id", `Entry '${newId}' already exists.`, { documentId: doc.id, sectionId: sid, entryId: newId });
  const source = doc.content.sections[si].entries.find(e => e.id === sourceId);
  if (!source) return failure("entry-not-found", `Entry '${sourceId}' was not found.`, { documentId: doc.id, sectionId: sid, entryId: sourceId });
  return addEntry(doc, sid, { ...source, id: newId }, at, index);
}
export { addCustomField, removeCustomField, updateCustomField } from "./custom-field-operations";
