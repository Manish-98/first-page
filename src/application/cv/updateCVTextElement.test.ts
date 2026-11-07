import { describe, expect, it } from "vitest";
import type { CVDocument } from "../../domain/cv/types";
import { updateCVTextElement } from "./updateCVTextElement";

const dependencies = { now: () => "2026-11-07T10:00:00.000Z" };
const fixture = (): CVDocument => ({
  id: "cv-1",
  metadata: { title: "CV", createdAt: "2026-11-07T09:00:00.000Z", updatedAt: "2026-11-07T09:00:00.000Z" },
  content: {
    personalDetails: { name: { givenName: "Ada" }, headline: "Engineer" },
    sections: [
      { id: "summary-section", kind: "summary", entries: [{ id: "summary-entry", content: { text: "Original summary" } }] },
      { id: "skills-section", kind: "skills", entries: [{ id: "skill-entry", content: { name: "TypeScript" } }] },
    ],
  },
});

describe("updateCVTextElement", () => {
  it("updates a headline without changing unrelated personal details or sections", () => {
    const document = fixture();
    const result = updateCVTextElement(document, { type: "headline" }, " Principal Engineer ", dependencies);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.document.content.personalDetails).toEqual({ name: { givenName: "Ada" }, headline: "Principal Engineer" });
    expect(result.document.content.sections).toEqual(document.content.sections);
    expect(document.content.personalDetails.headline).toBe("Engineer");
  });

  it("updates summary text by stable section and entry identifiers", () => {
    const document = fixture();
    const result = updateCVTextElement(document, { type: "summary", sectionId: "summary-section", entryId: "summary-entry" }, "Updated profile", dependencies);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.document.content.sections[0].id).toBe("summary-section");
    expect(result.document.content.sections[0].entries[0].id).toBe("summary-entry");
    expect(result.document.content.sections[0].entries[0].content).toEqual({ text: "Updated profile" });
    expect(result.document.content.sections[1]).toEqual(document.content.sections[1]);
  });

  it("rejects a stale section or entry target without changing the document", () => {
    const document = fixture();
    const result = updateCVTextElement(document, { type: "summary", sectionId: "missing", entryId: "missing" }, "New text", dependencies);
    expect(result).toEqual({ ok: false, message: "This summary no longer exists." });
    expect(document.content.sections[0].entries[0].content).toEqual({ text: "Original summary" });
  });

  it("clears optional headline text when the draft is blank", () => {
    const result = updateCVTextElement(fixture(), { type: "headline" }, "   ", dependencies);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.document.content.personalDetails.headline).toBeUndefined();
  });
});
