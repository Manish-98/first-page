import { describe, expect, it } from "vitest";
import { validateCVDocument } from "./validation";

type TestField = { id: string; key: string; label: string; value: unknown };
type TestEntry = { id: string; content: Record<string, unknown> & { fields?: TestField[] } };
type TestSection = { id: string; kind: string; entries: TestEntry[] };
type TestDocument = {
  id: string;
  metadata: Record<string, unknown>;
  content: {
    personalDetails: Record<string, unknown> & { contact?: Record<string, unknown> };
    sections: TestSection[];
  };
};

const validDocument = (): TestDocument => ({
  id: "cv-1",
  metadata: { title: "CV", createdAt: "2026-01-01", updatedAt: "2026-02-01" },
  content: {
    personalDetails: {
      name: { givenName: "Alex" },
      contact: { email: "alex@example.test", website: "https://example.test" },
    },
    sections: [
      { id: "experience", kind: "experience", entries: [
        { id: "role-1", content: { role: "Engineer", employer: "Example", dateRange: { startDate: { year: 2020, month: 2 }, ongoing: true } } },
      ] },
      { id: "custom", kind: "custom", entries: [
        { id: "custom-entry", content: { fields: [
          { id: "field-1", key: "tools", label: "Tools", value: { type: "text-list", value: ["TypeScript"] } },
        ] } },
      ] },
    ],
  },
});

describe("validateCVDocument", () => {
  it("accepts a structurally valid document with optional and incomplete CV content", () => {
    expect(validateCVDocument(validDocument())).toEqual({ valid: true, issues: [] });
    const sparse = validDocument();
    sparse.content.personalDetails = {};
    sparse.content.sections[0].entries[0].content.dateRange = { startDate: { year: 2024 } };
    expect(validateCVDocument(sparse).valid).toBe(true);
  });

  it("returns all structural and format issues with stable paths", () => {
    const invalid = validDocument();
    invalid.content.personalDetails.contact!.email = "not-an-email";
    invalid.content.sections[0].entries[0].content.role = 42;
    invalid.content.sections[0].entries[0].content.dateRange = {
      startDate: { year: 2025, month: 13 },
      endDate: { year: 2024 },
    };
    const result = validateCVDocument(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid-email", path: "$.content.personalDetails.contact.email" }),
      expect.objectContaining({ code: "invalid-type", path: "$.content.sections[0].entries[0].content.role" }),
      expect.objectContaining({ code: "invalid-date", path: "$.content.sections[0].entries[0].content.dateRange.startDate" }),
      expect.objectContaining({ code: "invalid-date-range", path: "$.content.sections[0].entries[0].content.dateRange.endDate" }),
    ]));
  });

  it("detects missing and duplicate section, entry and custom field identifiers", () => {
    const invalid = validDocument();
    invalid.content.sections.push({
      id: "experience",
      kind: "custom",
      entries: [
        { id: "role-1", content: { fields: [{ id: "field-1", key: "x", label: "X", value: { type: "text", value: "x" } }] } },
      ],
    });
    invalid.content.sections[1].entries[0].content.fields!.push({
      id: "field-1", key: "duplicate", label: "Duplicate", value: { type: "number", value: 1 },
    });
    invalid.content.sections[1].entries[0].content.fields!.push({
      id: "", key: "missing", label: "Missing", value: { type: "text", value: "x" },
    });
    const result = validateCVDocument(invalid);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "duplicate-identifier", path: "$.content.sections[1].id" }),
      expect.objectContaining({ code: "duplicate-identifier", path: "$.content.sections[2].entries[0].id" }),
      expect.objectContaining({ code: "duplicate-identifier", path: "$.content.sections[1].entries[0].content.fields[1].id" }),
      expect.objectContaining({ code: "invalid-identifier", path: "$.content.sections[1].entries[0].content.fields[2].id" }),
    ]));
  });

  it("checks partial-date calendar validity, leap years and reversed ranges", () => {
    const invalid = validDocument();
    invalid.content.sections[0].entries[0].content.dateRange = {
      startDate: { year: 2024, month: 2, day: 29 },
      endDate: { year: 2023, month: 12 },
    };
    expect(validateCVDocument(invalid).issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid-date-range" }),
    ]));
    const nonLeap = validDocument();
    nonLeap.content.sections[0].entries[0].content.dateRange = { startDate: { year: 2023, month: 2, day: 29 } };
    expect(validateCVDocument(nonLeap).issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid-date" }),
    ]));
  });

  it("rejects ongoing ranges with end dates and invalid custom-field values", () => {
    const invalid = validDocument();
    invalid.content.sections[0].entries[0].content.dateRange = {
      startDate: { year: 2020 }, endDate: { year: 2021 }, ongoing: true,
    };
    invalid.content.sections[1].entries[0].content.fields![0].value = { type: "number", value: Number.NaN };
    const result = validateCVDocument(invalid);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid-date-range" }),
      expect.objectContaining({ code: "invalid-custom-field" }),
    ]));
  });

  it("accepts structurally valid unknown extension section kinds", () => {
    const extension = validDocument();
    extension.content.sections.push({ id: "extension", kind: "timeline-extension", entries: [{ id: "extension-entry", content: { arbitrary: true } }] });
    expect(validateCVDocument(extension)).toEqual({ valid: true, issues: [] });
  });

  it("is deterministic and does not mutate nested input", () => {
    const document = validDocument();
    const before = structuredClone(document);
    const first = validateCVDocument(document);
    expect(first).toEqual(validateCVDocument(document));
    expect(document).toEqual(before);
  });

  it("returns a structured root issue for non-object input", () => {
    expect(validateCVDocument(null)).toMatchObject({
      valid: false,
      issues: [{ code: "invalid-document", category: "structure", path: "$" }],
    });
  });
});
