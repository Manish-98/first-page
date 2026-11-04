import { describe, expect, it, vi } from "vitest";
import { createCV } from "./createCV";

describe("createCV", () => {
  it("creates a canonical empty CV using injected identity and time providers", () => {
    const generateId = vi.fn(() => "cv-test-1");
    const now = vi.fn(() => "2026-11-04T10:00:00.000Z");

    const result = createCV("  Product Designer CV  ", { generateId, now });

    expect(result).toEqual({
      ok: true,
      document: {
        id: "cv-test-1",
        metadata: {
          title: "Product Designer CV",
          createdAt: "2026-11-04T10:00:00.000Z",
          updatedAt: "2026-11-04T10:00:00.000Z",
        },
        content: { personalDetails: {}, sections: [] },
      },
    });
    expect(generateId).toHaveBeenCalledOnce();
    expect(now).toHaveBeenCalledOnce();
  });

  it("rejects an empty title without generating identifiers or timestamps", () => {
    const generateId = vi.fn(() => "unused");
    const now = vi.fn(() => "2026-11-04T10:00:00.000Z");

    expect(createCV("   ", { generateId, now })).toMatchObject({
      ok: false,
      error: { code: "invalid-title" },
    });
    expect(generateId).not.toHaveBeenCalled();
    expect(now).not.toHaveBeenCalled();
  });

  it("surfaces dependency failures as a creation failure", () => {
    expect(createCV("My CV", {
      generateId: () => { throw new Error("UUID unavailable"); },
      now: () => "2026-11-04T10:00:00.000Z",
    })).toMatchObject({
      ok: false,
      error: { code: "creation-failed" },
    });
  });
});
