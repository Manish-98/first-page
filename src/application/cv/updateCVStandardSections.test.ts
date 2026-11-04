import { describe, expect, it } from "vitest";
import { createCVDocument } from "../../domain/cv/operations";
import { getStandardCVEntries, removeStandardCVEntry, saveStandardCVEntry } from "./updateCVStandardSections";

const fixture = () => {
  const result = createCVDocument({ id: "cv-1", title: "CV", createdAt: "2026-11-04T10:00:00.000Z" });
  if (!result.ok) throw new Error("Fixture failed");
  return result.value;
};
const dependencies = () => {
  let id = 0;
  return { generateId: () => `generated-${++id}`, now: () => "2026-11-04T11:00:00.000Z" };
};

describe("additional standard CV section use cases", () => {
  it("creates and maps entries for all eight section contracts", () => {
    const deps = dependencies();
    let document = fixture();
    const cases = [
      ["projects", { name: " Atlas ", role: " Lead ", highlights: [" shipped ", "", " measured "] }, { name: "Atlas", role: "Lead", highlights: ["shipped", "measured"] }],
      ["languages", { language: " English ", proficiency: "C2" }, { language: "English", proficiency: "C2" }],
      ["certifications", { name: " Cloud ", issuer: " Provider ", issuedOn: { year: 2024 }, credentialId: " " }, { name: "Cloud", issuer: "Provider", issuedOn: { year: 2024 } }],
      ["awards", { title: " Prize ", issuer: " Guild ", awardedOn: { year: 2023 } }, { title: "Prize", issuer: "Guild", awardedOn: { year: 2023 } }],
      ["volunteering", { role: " Mentor ", organization: " Code Club ", highlights: [" coached "] }, { role: "Mentor", organization: "Code Club", highlights: ["coached"] }],
      ["publications", { title: " Paper ", authors: [" A ", "B"], publishedOn: { year: 2022 } }, { title: "Paper", authors: ["A", "B"], publishedOn: { year: 2022 } }],
      ["interests", { name: " Hiking ", description: " " }, { name: "Hiking" }],
      ["references", { name: " Ada ", relationship: " Manager ", email: "ada@example.com" }, { name: "Ada", relationship: "Manager", email: "ada@example.com" }],
    ] as const;
    for (const [kind, input, expected] of cases) {
      const result = saveStandardCVEntry(document, kind, undefined, input as never, deps);
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(`Could not save ${kind}: ${JSON.stringify(result.fieldErrors)}`);
      document = result.document;
      expect(getStandardCVEntries(document, kind)[0].content).toEqual(expected);
    }
    expect(document.content.sections).toHaveLength(8);
  });

  it("edits entries without changing IDs and preserves unrelated sections", () => {
    const deps = dependencies();
    const project = saveStandardCVEntry(fixture(), "projects", undefined, { name: "Atlas" }, deps);
    if (!project.ok) throw new Error("Project creation failed");
    const language = saveStandardCVEntry(project.document, "languages", undefined, { language: "English" }, deps);
    if (!language.ok) throw new Error("Language creation failed");
    const edited = saveStandardCVEntry(language.document, "projects", "generated-1", { name: "Atlas 2", url: "https://example.com" }, deps);
    expect(edited.ok).toBe(true);
    if (!edited.ok) return;
    expect(getStandardCVEntries(edited.document, "projects")).toEqual([{ id: "generated-1", content: { name: "Atlas 2", url: "https://example.com" } }]);
    expect(getStandardCVEntries(edited.document, "languages")).toHaveLength(1);
  });

  it("applies section-specific domain validation", () => {
    const deps = dependencies();
    expect(saveStandardCVEntry(fixture(), "projects", undefined, { name: "Atlas", url: "ftp://example.com" }, deps)).toMatchObject({ ok: false, fieldErrors: { url: expect.any(String) } });
    expect(saveStandardCVEntry(fixture(), "languages", undefined, { language: "English", proficiency: "C7" as never }, deps)).toMatchObject({ ok: false, fieldErrors: { proficiency: expect.any(String) } });
    expect(saveStandardCVEntry(fixture(), "certifications", undefined, { name: "Cloud", issuedOn: { year: 2025 }, expiresOn: { year: 2024 } }, deps)).toMatchObject({ ok: false, fieldErrors: { expiresOn: expect.any(String) } });
    expect(saveStandardCVEntry(fixture(), "references", undefined, { name: "Ada", email: "not-an-email" }, deps)).toMatchObject({ ok: false, fieldErrors: { email: expect.any(String) } });
  });

  it("removes one entry and deletes the section after its final entry", () => {
    const deps = dependencies();
    const first = saveStandardCVEntry(fixture(), "interests", undefined, { name: "Hiking" }, deps);
    if (!first.ok) throw new Error("First entry failed");
    const second = saveStandardCVEntry(first.document, "interests", undefined, { name: "Reading" }, deps);
    if (!second.ok) throw new Error("Second entry failed");
    const one = removeStandardCVEntry(second.document, "interests", "generated-1", deps);
    expect(one.ok).toBe(true);
    if (!one.ok) return;
    expect(getStandardCVEntries(one.document, "interests").map(entry => entry.id)).toEqual(["generated-3"]);
    const last = removeStandardCVEntry(one.document, "interests", "generated-3", deps);
    expect(last.ok).toBe(true);
    if (last.ok) expect(last.document.content.sections).toEqual([]);
  });
});
