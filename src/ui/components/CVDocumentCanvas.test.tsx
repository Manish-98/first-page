// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CVDocument } from "../../domain/cv/types";
import CVDocumentCanvas from "./CVDocumentCanvas";

function fixture(sections: CVDocument["content"]["sections"] = []): CVDocument {
  return {
    id: "canvas-test",
    metadata: { title: "Test CV", createdAt: "2026-11-04T10:00:00.000Z", updatedAt: "2026-11-04T10:00:00.000Z" },
    content: { personalDetails: { name: { givenName: "Ada", familyName: "Lovelace" } }, sections },
  };
}

describe("CVDocumentCanvas", () => {
  it("renders one distinct A4 page for an empty CV", () => {
    render(<CVDocumentCanvas document={fixture()} />);
    const canvas = screen.getByRole("region", { name: "Paginated CV document" });
    expect(screen.getByText("1 page · A4 portrait")).toBeInTheDocument();
    expect(canvas.querySelectorAll(".cv-document-canvas__page")).toHaveLength(1);
    expect(canvas.querySelectorAll(".cv-document-canvas__accessible-content .cv-preview")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Ada Lovelace" })).toHaveLength(1);
  });

  it("preserves canonical section order in the accessible document", () => {
    render(<CVDocumentCanvas document={fixture([
      { id: "skills", kind: "skills", entries: [{ id: "skill", content: { name: "TypeScript" } }] },
      { id: "summary", kind: "summary", entries: [{ id: "summary-entry", content: { text: "Profile first" } }] },
    ])} />);
    const accessibleContent = screen.getByRole("region", { name: "Paginated CV document" })
      .querySelector(".cv-document-canvas__accessible-content");
    expect(accessibleContent).not.toBeNull();
    const renderedText = accessibleContent?.textContent ?? "";
    const skillsIndex = renderedText.indexOf("Skills");
    const summaryIndex = renderedText.indexOf("Professional Summary");
    expect(skillsIndex).toBeGreaterThanOrEqual(0);
    expect(summaryIndex).toBeGreaterThan(skillsIndex);
  });

  it("selects a section from the visual canvas without mutating CV content", () => {
    const cvDocument = fixture([
      { id: "summary", kind: "summary", entries: [{ id: "summary-entry", content: { text: "Profile" } }] },
    ]);
    const onSelectionChange = vi.fn();
    render(<CVDocumentCanvas document={cvDocument} onSelectionChange={onSelectionChange} />);
    const target = document.querySelector(".cv-document-canvas__page-flow [data-cv-selection-key='section:summary']");
    expect(target).not.toBeNull();
    if (target) fireEvent.click(target);
    expect(onSelectionChange).toHaveBeenCalledWith({ type: "section", sectionId: "summary" });
    expect(cvDocument.content.sections[0].id).toBe("summary");
  });

  it("supports keyboard selection and Escape deselection", () => {
    const cvDocument = fixture([
      { id: "summary", kind: "summary", entries: [{ id: "summary-entry", content: { text: "Profile" } }] },
    ]);
    const onSelectionChange = vi.fn();
    render(<CVDocumentCanvas document={cvDocument} onSelectionChange={onSelectionChange} />);
    const target = screen.getByRole("group", { name: "Select summary section" });
    fireEvent.keyDown(target, { key: "Enter" });
    expect(onSelectionChange).toHaveBeenCalledWith({ type: "section", sectionId: "summary" });
    fireEvent.keyDown(target, { key: "Escape" });
    expect(onSelectionChange).toHaveBeenLastCalledWith(null);
  });

  it("clears selection when an empty canvas area is clicked", () => {
    const onSelectionChange = vi.fn();
    render(<CVDocumentCanvas document={fixture()} selection={{ type: "personal-details" }} onSelectionChange={onSelectionChange} />);
    const pages = document.querySelector(".cv-document-canvas__pages");
    expect(pages).not.toBeNull();
    if (pages) fireEvent.click(pages);
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });

  it("renders separate page surfaces when measured content overflows", () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollHeight");
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, get: () => 1200 });
    class Observer { observe = vi.fn(); disconnect = vi.fn(); }
    vi.stubGlobal("ResizeObserver", Observer);

    render(<CVDocumentCanvas document={fixture()} />);
    const canvas = screen.getByRole("region", { name: "Paginated CV document" });
    expect(screen.getByText("2 pages · A4 portrait")).toBeInTheDocument();
    expect(canvas.querySelectorAll(".cv-document-canvas__page")).toHaveLength(2);
    expect(canvas.querySelectorAll(".cv-document-canvas__page-content")).toHaveLength(2);
    expect(canvas.querySelectorAll(".cv-document-canvas__accessible-content .cv-preview")).toHaveLength(1);

    if (original) Object.defineProperty(HTMLElement.prototype, "scrollHeight", original);
    else Reflect.deleteProperty(HTMLElement.prototype, "scrollHeight");
    vi.unstubAllGlobals();
  });
});
