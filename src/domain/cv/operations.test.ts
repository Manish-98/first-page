import { describe, expect, it } from "vitest";
import { addEntry, addSection, createCVDocument, duplicateEntry, moveSectionDown, moveSectionToPosition, moveSectionUp, removeEntry, removeSection, updateContactDetails, updateCustomField, updateDocumentMetadata, updateEntry, updatePersonName, updatePostalAddress, updateSection, type CVOperationResult } from "./operations";
import type { CVDocument, CVSection } from "./types";
import type { CustomCVSection } from "./sections";
type Summary = CVSection<"summary", { text: string }>;
type Experience = CVSection<"experience", { role: string }>;
const summary: Summary = { id: "summary", kind: "summary", title: "Summary", entries: [{ id: "summary-entry", content: { text: "Original" } }] };
const experience: Experience = { id: "experience", kind: "experience", entries: [{ id: "experience-entry", content: { role: "Engineer" } }] };
const doc: CVDocument<Summary | Experience> = { id: "cv-1", metadata: { title: "CV", createdAt: "2026-01-01", updatedAt: "2026-01-01" }, content: { personalDetails: { name: { givenName: "Alex", familyName: "Example" }, contact: { email: "alex@example.com", address: { locality: "Pune", country: "India" } } }, sections: [summary, experience] } };
const at = "2026-02-01";
function value<T>(result: CVOperationResult<T>): T { if (!result.ok) throw new Error(result.error.message); return result.value; }

describe("CV document operations", () => {
  it("creates deterministic documents and rejects duplicate initial identities", () => {
    expect(value(createCVDocument({ id: "new", title: "New", createdAt: at }))).toEqual({ id: "new", metadata: { title: "New", createdAt: at, updatedAt: at }, content: { personalDetails: {}, sections: [] } });
    expect(createCVDocument({ id: "bad", title: "Bad", createdAt: at, sections: [summary, summary] })).toMatchObject({ ok: false, error: { code: "duplicate-section-id" } });
    expect(createCVDocument({ id: "bad", title: "Bad", createdAt: at, sections: [summary, { ...experience, entries: [{ id: "summary-entry", content: { role: "Duplicate" } }] }] })).toMatchObject({ ok: false, error: { code: "duplicate-entry-id" } });
  });
  it("updates metadata and personal/contact fields without replacing siblings", () => {
    const renamed = value(updatePersonName(doc, { givenName: "Avery" }, at));
    expect(renamed.content.personalDetails.name).toEqual({ givenName: "Avery", familyName: "Example" });
    const contacted = value(updateContactDetails(renamed, { phone: "+91 123" }, at));
    expect(contacted.content.personalDetails.contact).toEqual({ email: "alex@example.com", phone: "+91 123", address: { locality: "Pune", country: "India" } });
    const addressed = value(updatePostalAddress(contacted, { region: "Maharashtra" }, at));
    expect(addressed.content.personalDetails.contact?.address).toEqual({ locality: "Pune", country: "India", region: "Maharashtra" });
    const titled = value(updateDocumentMetadata(doc, { title: "Updated" }, at));
    expect(titled.metadata.title).toBe("Updated"); expect(titled.content).toBe(doc.content);
  });
  it("adds, updates and removes sections with stable identities", () => {
    const extra: Summary = { id: "extra", kind: "summary", entries: [] };
    expect(value(addSection(doc, extra, at, 1)).content.sections.map(s => s.id)).toEqual(["summary", "extra", "experience"]);
    expect(addSection(doc, summary, at)).toMatchObject({ ok: false, error: { code: "duplicate-section-id" } });
    expect(addSection(doc, extra, at, 9)).toMatchObject({ ok: false, error: { code: "invalid-index" } });
    const changed = value(updateSection(doc, "summary", { title: "Profile" }, at));
    expect(changed.content.sections[0]).toMatchObject({ id: "summary", kind: "summary", title: "Profile" }); expect(changed.content.sections[1]).toBe(experience);
    expect(updateSection(doc, "summary", { entries: [{ id: "experience-entry", content: { text: "collision" } }] }, at)).toMatchObject({ ok: false, error: { code: "duplicate-entry-id" } });
    expect(value(removeSection(doc, "summary", at)).content.sections).toEqual([experience]);
    expect(removeSection(doc, "missing", at)).toMatchObject({ ok: false, error: { code: "section-not-found" } });
  });
  it("moves sections deterministically while preserving identity, content and source state", () => {
    const education: CVSection<"education", { institution: string }> = {
      id: "education",
      kind: "education",
      title: "Education",
      entries: [{ id: "education-entry", content: { institution: "Example University" } }],
    };
    const withEducation: CVDocument<Summary | Experience | typeof education> = {
      ...doc,
      content: { ...doc.content, sections: [summary, experience, education] },
    };
    const originalSnapshot = structuredClone(withEducation);

    const up = value(moveSectionUp(withEducation, "experience", at));
    expect(up.content.sections.map(section => section.id)).toEqual(["experience", "summary", "education"]);
    expect(up.content.sections[0]).toBe(experience);
    expect(up.content.sections[1]).toBe(summary);
    expect(up.content.sections[2]).toBe(education);
    expect(up.metadata.updatedAt).toBe(at);

    const down = value(moveSectionDown(up, "experience", "2026-02-02"));
    expect(down.content.sections.map(section => section.id)).toEqual(["summary", "experience", "education"]);
    expect(down.content.sections[1].entries[0]).toBe(experience.entries[0]);

    const toFirst = value(moveSectionToPosition(withEducation, "education", 0, at));
    expect(toFirst.content.sections.map(section => section.id)).toEqual(["education", "summary", "experience"]);
    const toLast = value(moveSectionToPosition(toFirst, "education", 2, at));
    expect(toLast.content.sections.map(section => section.id)).toEqual(["summary", "experience", "education"]);

    expect(value(moveSectionUp(withEducation, "summary", at))).toBe(withEducation);
    expect(value(moveSectionDown(withEducation, "education", at))).toBe(withEducation);
    expect(value(moveSectionToPosition(withEducation, "summary", 0, at))).toBe(withEducation);
    expect(withEducation).toEqual(originalSnapshot);
  });

  it("supports custom sections and repeated moves without changing their payloads", () => {
    const custom: CustomCVSection = {
      id: "custom",
      kind: "custom",
      title: "Additional",
      entries: [{ id: "custom-entry", content: { description: "Custom content", fields: [] } }],
    };
    const customDoc: CVDocument<Summary | Experience | CustomCVSection> = {
      ...doc,
      content: { ...doc.content, sections: [summary, experience, custom] },
    };
    const movedOnce = value(moveSectionDown(customDoc, "summary", at));
    const movedTwice = value(moveSectionDown(movedOnce, "summary", at));
    const movedBack = value(moveSectionUp(movedTwice, "summary", at));
    expect(movedTwice.content.sections.map(section => section.id)).toEqual(["experience", "custom", "summary"]);
    expect(movedBack.content.sections.map(section => section.id)).toEqual(["experience", "summary", "custom"]);
    expect(movedBack.content.sections[2]).toBe(custom);
    expect(movedBack.content.sections[2].entries[0].content).toBe(custom.entries[0].content);
  });

  it("returns safe structured errors for unknown sections and invalid target positions", () => {
    expect(moveSectionUp(doc, "missing", at)).toMatchObject({ ok: false, error: { code: "section-not-found", documentId: "cv-1", sectionId: "missing" } });
    expect(moveSectionDown(doc, "missing", at)).toMatchObject({ ok: false, error: { code: "section-not-found" } });
    expect(moveSectionToPosition(doc, "missing", 0, at)).toMatchObject({ ok: false, error: { code: "section-not-found" } });
    for (const position of [-1, 2, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(moveSectionToPosition(doc, "summary", position, at)).toMatchObject({ ok: false, error: { code: "invalid-index", sectionId: "summary" } });
    }
  });

  it("rejects payloads that do not match the target section kind", () => {
    const experiencePayload = { role: "Engineer", employer: "Example Ltd" };
    expect(addEntry(doc, "summary", { id: "wrong-add", content: experiencePayload }, at)).toMatchObject({ ok: false, error: { code: "entry-content-kind-mismatch", sectionId: "summary", entryId: "wrong-add" } });
    expect(updateEntry(doc, "summary", "summary-entry", experiencePayload, at)).toMatchObject({ ok: false, error: { code: "entry-content-kind-mismatch", sectionId: "summary", entryId: "summary-entry" } });
    expect(updateSection(doc, "summary", { entries: [{ id: "replacement", content: experiencePayload }] }, at)).toMatchObject({ ok: false, error: { code: "entry-content-kind-mismatch", sectionId: "summary", entryId: "replacement" } });
  });
  it("adds, updates, duplicates and removes entries with caller-controlled IDs", () => {
    const added = value(addEntry(doc, "summary", { id: "second", content: { text: "Second" } }, at));
    expect(added.content.sections[0].entries.map(e => e.id)).toEqual(["summary-entry", "second"]);
    const changed = value(updateEntry(added, "summary", "second", { text: "Changed" }, at));
    expect(changed.content.sections[0].entries[1]).toEqual({ id: "second", content: { text: "Changed" } });
    const copied = value(duplicateEntry(changed, "summary", "second", "copy", at, 0));
    expect(copied.content.sections[0].entries.map(e => e.id)).toEqual(["copy", "summary-entry", "second"]);
    expect(copied.content.sections[0].entries[0].content).toBe(copied.content.sections[0].entries[2].content);
    expect(value(removeEntry(copied, "summary", "second", at)).content.sections[0].entries.map(e => e.id)).toEqual(["copy", "summary-entry"]);
  });
  it("returns structured errors for missing IDs, duplicate IDs and invalid positions", () => {
    expect(addEntry(doc, "missing", { id: "x", content: { text: "x" } }, at)).toMatchObject({ ok: false, error: { code: "section-not-found" } });
    expect(addEntry(doc, "summary", { id: "experience-entry", content: { text: "x" } }, at)).toMatchObject({ ok: false, error: { code: "duplicate-entry-id" } });
    expect(addEntry(doc, "summary", { id: "x", content: { text: "x" } }, at, -1)).toMatchObject({ ok: false, error: { code: "invalid-index" } });
    expect(updateEntry(doc, "summary", "missing", { text: "x" }, at)).toMatchObject({ ok: false, error: { code: "entry-not-found" } });
    expect(duplicateEntry(doc, "summary", "missing", "copy", at)).toMatchObject({ ok: false, error: { code: "entry-not-found" } });
    expect(duplicateEntry(doc, "summary", "summary-entry", "experience-entry", at)).toMatchObject({ ok: false, error: { code: "duplicate-entry-id" } });
    expect(removeEntry(doc, "summary", "missing", at)).toMatchObject({ ok: false, error: { code: "entry-not-found" } });
  });
  it("updates one custom field and preserves its sibling fields and identifiers", () => {
    const section: CustomCVSection = { id: "custom", kind: "custom", entries: [{ id: "custom-entry", content: { description: "Details", fields: [{ id: "field-1", key: "location", label: "Location", value: { type: "text", value: "Pune" } }, { id: "field-2", key: "level", label: "Level", value: { type: "text", value: "Senior" } }] } }] };
    const customDoc: CVDocument<CustomCVSection> = { ...doc, content: { ...doc.content, sections: [section] } };
    const changed = value(updateCustomField(customDoc, "custom", "custom-entry", "field-1", { label: "City", value: { type: "text", value: "Mumbai" } }, at));
    expect(changed.content.sections[0].entries[0].content.fields).toEqual([{ id: "field-1", key: "location", label: "City", value: { type: "text", value: "Mumbai" } }, { id: "field-2", key: "level", label: "Level", value: { type: "text", value: "Senior" } }]);
    expect(updateCustomField(customDoc, "custom", "custom-entry", "missing", {}, at)).toMatchObject({ ok: false, error: { code: "custom-field-not-found" } });
    expect(updateCustomField(doc, "summary", "summary-entry", "field", {}, at)).toMatchObject({ ok: false, error: { code: "section-kind-mismatch" } });
  });
  it("does not mutate original or nested values and preserves unrelated references", () => {
    const snapshot = structuredClone(doc);
    const changed = value(updatePostalAddress(value(updateEntry(doc, "summary", "summary-entry", { text: "Revised" }, at)), { locality: "Mumbai" }, at));
    expect(doc).toEqual(snapshot); expect(changed).not.toBe(doc); expect(changed.content).not.toBe(doc.content);
    expect(changed.content.sections[0]).not.toBe(doc.content.sections[0]); expect(changed.content.sections[1]).toBe(experience);
    expect(doc.content.personalDetails.contact?.address?.locality).toBe("Pune"); expect(doc.content.sections[0].entries[0].content).toEqual({ text: "Original" });
  });
});
