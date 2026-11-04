import { describe, expect, it } from "vitest";
import { createCVDocument } from "../../domain/cv/operations";
import { getExperienceEntries, removeCVExperience, saveCVExperience } from "./updateCVExperience";

const fixture = () => {
  const result = createCVDocument({ id: "cv-1", title: "CV", createdAt: "2026-11-04T10:00:00.000Z" });
  if (!result.ok) throw new Error("Fixture failed");
  return result.value;
};
const makeDependencies = () => {
  let index = 0;
  const ids = ["entry-1", "section-1", "entry-2"];
  return {
    generateId: () => ids[index++] ?? "generated-" + index,
    now: () => "2026-11-04T11:00:00.000Z",
  };
};

describe("CV work experience use cases", () => {
  it("creates the section and first entry, then appends additional entries", () => {
    const dependencies = makeDependencies();
    const first = saveCVExperience(fixture(), undefined, {
      role: "Engineer", employer: "Example Ltd", location: "Pune",
      dateRange: { startDate: { year: 2022, month: 3 }, ongoing: true },
      responsibilities: [" Built APIs ", ""],
    }, dependencies);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.document.content.sections[0]).toMatchObject({
      id: "section-1", kind: "experience",
      entries: [{ id: "entry-1", content: {
        role: "Engineer", employer: "Example Ltd", location: "Pune",
        dateRange: { startDate: { year: 2022, month: 3 }, ongoing: true },
        responsibilities: ["Built APIs"],
      } }],
    });
    const second = saveCVExperience(first.document, undefined, {
      role: "Designer", employer: "Studio",
    }, dependencies);
    expect(second.ok).toBe(true);
    if (second.ok) expect(getExperienceEntries(second.document).map(entry => entry.id)).toEqual(["entry-1", "entry-2"]);
  });

  it("edits an entry without changing its ID or unrelated content", () => {
    const dependencies = makeDependencies();
    const created = saveCVExperience(fixture(), undefined, { role: "Engineer", employer: "Example" }, dependencies);
    if (!created.ok) throw new Error("Creation failed");
    const edited = saveCVExperience(created.document, "entry-1", { role: "Staff Engineer", employer: "Example" }, dependencies);
    expect(edited.ok).toBe(true);
    if (edited.ok) {
      expect(getExperienceEntries(edited.document)[0]).toEqual({
        id: "entry-1", content: { role: "Staff Engineer", employer: "Example" },
      });
    }
  });

  it("rejects blank required fields and leaves the source document untouched", () => {
    const dependencies = makeDependencies();
    const document = fixture();
    const result = saveCVExperience(document, undefined, { role: " ", employer: "" }, dependencies);
    expect(result).toMatchObject({ ok: false, fieldErrors: { role: "Enter a job title.", employer: "Enter an employer." } });
    expect(document.content.sections).toEqual([]);
  });

  it("accepts year-only and month/year dates and validates calendar ranges", () => {
    const dependencies = makeDependencies();
    const yearOnly = saveCVExperience(fixture(), undefined, {
      role: "Engineer", employer: "Example", dateRange: { startDate: { year: 2020 }, ongoing: false },
    }, dependencies);
    expect(yearOnly.ok).toBe(true);
    const invalid = saveCVExperience(fixture(), undefined, {
      role: "Engineer", employer: "Example",
      dateRange: { startDate: { year: 2024, month: 2, day: 30 }, ongoing: false },
    }, dependencies);
    expect(invalid).toMatchObject({ ok: false, fieldErrors: { "dateRange.startDate": expect.any(String) } });
  });

  it("rejects reversed date ranges", () => {
    const dependencies = makeDependencies();
    const reversed = saveCVExperience(fixture(), undefined, {
      role: "Engineer", employer: "Example",
      dateRange: { startDate: { year: 2025 }, endDate: { year: 2024 }, ongoing: false },
    }, dependencies);
    expect(reversed).toMatchObject({ ok: false, fieldErrors: { "dateRange.endDate": expect.any(String) } });
  });

  it("removes only the selected entry and removes the section when empty", () => {
    const dependencies = makeDependencies();
    const first = saveCVExperience(fixture(), undefined, { role: "Engineer", employer: "Example" }, dependencies);
    if (!first.ok) throw new Error("Creation failed");
    const second = saveCVExperience(first.document, undefined, { role: "Designer", employer: "Studio" }, dependencies);
    if (!second.ok) throw new Error("Second creation failed");
    const removedOne = removeCVExperience(second.document, "entry-1", dependencies);
    expect(removedOne.ok).toBe(true);
    if (!removedOne.ok) return;
    expect(getExperienceEntries(removedOne.document).map(entry => entry.id)).toEqual(["entry-2"]);
    const removedLast = removeCVExperience(removedOne.document, "entry-2", dependencies);
    expect(removedLast.ok).toBe(true);
    if (removedLast.ok) expect(removedLast.document.content.sections).toEqual([]);
  });
});
