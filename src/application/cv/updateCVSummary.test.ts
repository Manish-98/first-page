import { describe, expect, it, vi } from "vitest";
import { createCVDocument } from "../../domain/cv/operations";
import { updateCVSummary } from "./updateCVSummary";

const fixture = () => {
  const result = createCVDocument({ id: "cv-1", title: "CV", createdAt: "2026-11-04T10:00:00.000Z" });
  if (!result.ok) throw new Error("Fixture failed");
  return result.value;
};
const dependencies = { generateId: vi.fn().mockReturnValueOnce("summary-section").mockReturnValueOnce("summary-entry"), now: () => "2026-11-04T11:00:00.000Z" };

describe("updateCVSummary", () => {
  it("creates, updates, and clears the summary while retaining entry identity", () => {
    const created = updateCVSummary(fixture(), " First line\nSecond line ", dependencies);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    expect(created.document.content.sections[0]).toMatchObject({
      id: "summary-section", kind: "summary",
      entries: [{ id: "summary-entry", content: { text: "First line\nSecond line" } }],
    });
    const updated = updateCVSummary(created.document, "Updated", dependencies);
    expect(updated.ok).toBe(true);
    if (!updated.ok) return;
    expect(updated.document.content.sections[0].entries[0].id).toBe("summary-entry");
    const cleared = updateCVSummary(updated.document, " ", dependencies);
    expect(cleared.ok).toBe(true);
    if (cleared.ok) expect(cleared.document.content.sections).toEqual([]);
  });
});
