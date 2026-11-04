import type { CVDocument, CVSection, CVSectionId, CVEntryId, ISODateTimeString } from "./types";
import type { CustomCVSection, CustomField } from "./sections";
import type { CVOperationResult } from "./operations";

export function updateCustomField<T extends CVSection>(
  doc: CVDocument<T>, sid: CVSectionId, eid: CVEntryId, fid: string,
  updates: Partial<Omit<CustomField, "id">>, at: ISODateTimeString,
): CVOperationResult<CVDocument<T>> {
  const section = doc.content.sections.find(s => s.id === sid);
  if (!section) return { ok: false, error: { code: "section-not-found", message: `Section '${sid}' was not found.`, documentId: doc.id, sectionId: sid } };
  if (section.kind !== "custom") return { ok: false, error: { code: "section-kind-mismatch", message: `Section '${sid}' is not a custom section.`, documentId: doc.id, sectionId: sid, entryId: eid } };
  const custom = section as CustomCVSection, entry = custom.entries.find(e => e.id === eid);
  if (!entry) return { ok: false, error: { code: "entry-not-found", message: `Entry '${eid}' was not found.`, documentId: doc.id, sectionId: sid, entryId: eid } };
  if (!entry.content.fields.some(f => f.id === fid)) return { ok: false, error: { code: "custom-field-not-found", message: `Custom field '${fid}' was not found.`, documentId: doc.id, sectionId: sid, entryId: eid, fieldId: fid } };
  const content = { ...entry.content, fields: entry.content.fields.map(f => f.id === fid ? { ...f, ...updates, id: f.id } : f) };
  const sections = doc.content.sections.map(s => s.id !== sid ? s : { ...s, entries: s.entries.map(e => e.id === eid ? { ...e, content } : e) } as T);
  return { ok: true, value: { ...doc, metadata: { ...doc.metadata, updatedAt: at }, content: { ...doc.content, sections } } };
}
