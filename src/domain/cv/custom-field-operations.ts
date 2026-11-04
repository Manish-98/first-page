import type { CVDocument, CVSection, CVSectionId, CVEntryId, ISODateTimeString } from "./types";
import type { CustomCVSection, CustomField } from "./sections";
import type { CVOperationResult } from "./operations";

function locate(doc: CVDocument, sid: CVSectionId, eid: CVEntryId) {
  const section = doc.content.sections.find(item => item.id === sid);
  if (!section) return { error: { code: "section-not-found" as const, message: `Section '${sid}' was not found.`, documentId: doc.id, sectionId: sid } };
  if (section.kind !== "custom") return { error: { code: "section-kind-mismatch" as const, message: `Section '${sid}' is not a custom section.`, documentId: doc.id, sectionId: sid, entryId: eid } };
  const entry = section.entries.find(item => item.id === eid);
  if (!entry) return { error: { code: "entry-not-found" as const, message: `Entry '${eid}' was not found.`, documentId: doc.id, sectionId: sid, entryId: eid } };
  return { section: section as CustomCVSection, entry: entry as CustomCVSection["entries"][number] };
}
function replaceFields<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, fields: readonly CustomField[], at: ISODateTimeString): CVDocument<T> {
  const sections = doc.content.sections.map(section => section.id !== sid ? section : {
    ...section, entries: section.entries.map(entry => entry.id === eid ? {
      ...entry, content: { ...(entry.content as object), fields },
    } : entry),
  } as T);
  return { ...doc, metadata: { ...doc.metadata, updatedAt: at }, content: { ...doc.content, sections } };
}
export function addCustomField<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, field: CustomField, at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  const found = locate(doc, sid, eid);
  if (!("entry" in found)) return { ok: false, error: found.error };
  if (doc.content.sections.some(section => section.kind === "custom" && section.entries.some(entry => (entry.content as { fields: readonly CustomField[] }).fields.some(item => item.id === field.id)))) {
    return { ok: false, error: { code: "duplicate-entry-id", message: `Custom field identifier '${field.id}' already exists.`, documentId: doc.id, sectionId: sid, entryId: eid, fieldId: field.id } };
  }
  return { ok: true, value: replaceFields(doc, sid, eid, [...found.entry.content.fields, field], at) };
}
export function updateCustomField<T extends CVSection>(
  doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, fid: string,
  updates: Partial<Omit<CustomField, "id">>, at: ISODateTimeString,
): CVOperationResult<CVDocument<T>> {
  const found = locate(doc, sid, eid);
  if (!("entry" in found)) return { ok: false, error: found.error };
  if (!found.entry.content.fields.some(field => field.id === fid)) return { ok: false, error: { code: "custom-field-not-found", message: `Custom field '${fid}' was not found.`, documentId: doc.id, sectionId: sid, entryId: eid, fieldId: fid } };
  const fields = found.entry.content.fields.map(field => field.id === fid ? { ...field, ...updates, id: field.id } : field);
  return { ok: true, value: replaceFields(doc, sid, eid, fields, at) };
}
export function removeCustomField<T extends CVSection>(doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, fid: string, at: ISODateTimeString): CVOperationResult<CVDocument<T>> {
  const found = locate(doc, sid, eid);
  if (!("entry" in found)) return { ok: false, error: found.error };
  if (!found.entry.content.fields.some(field => field.id === fid)) return { ok: false, error: { code: "custom-field-not-found", message: `Custom field '${fid}' was not found.`, documentId: doc.id, sectionId: sid, entryId: eid, fieldId: fid } };
  return { ok: true, value: replaceFields(doc, sid, eid, found.entry.content.fields.filter(field => field.id !== fid), at) };
}
