// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { clearActiveCV, getActiveCV, setActiveCV } from "../../application/cv/cvSession";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import CVDocumentPage from "./CVDocumentPage";

const dependencies: CVCreationDependencies = {
  generateId: (() => { let id = 0; return () => `generated-${++id}`; })(),
  now: () => "2026-11-04T12:00:00.000Z",
};
const fixture = () => ({
  id: "cv-1",
  metadata: { title: "My CV", createdAt: "2026-11-04T10:00:00.000Z", updatedAt: "2026-11-04T10:00:00.000Z" },
  content: { personalDetails: {}, sections: [] },
});

describe("additional standard section editors", () => {
  afterEach(() => clearActiveCV());

  it("adds, edits and removes a project with optional fields", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add project" }));
    fireEvent.change(screen.getByLabelText("Project name *"), { target: { value: "Atlas" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Lead" } });
    fireEvent.change(screen.getByLabelText("Project URL"), { target: { value: "https://example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
    expect(getActiveCV()?.content.sections.find(section => section.kind === "projects")?.entries[0].content).toMatchObject({ name: "Atlas", role: "Lead", url: "https://example.com" });
    const entry = screen.getByRole("heading", { name: /name: Atlas/i }).closest("li");
    if (!entry) throw new Error("Project entry not found");
    fireEvent.click(entry.querySelector("button")!);
    fireEvent.change(screen.getByLabelText("Project name *"), { target: { value: "Atlas II" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(getActiveCV()?.content.sections.find(section => section.kind === "projects")?.entries[0]).toMatchObject({ id: "generated-1", content: { name: "Atlas II" } });
    fireEvent.click(screen.getByRole("button", { name: "Remove projects entry generated-1" }));
    expect(getActiveCV()?.content.sections.some(section => section.kind === "projects")).toBe(false);
  });

  it("maps language proficiency and certification partial dates", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add language" }));
    fireEvent.change(screen.getByLabelText("Language *"), { target: { value: "English" } });
    fireEvent.change(screen.getByLabelText("Proficiency"), { target: { value: "C2" } });
    fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
    expect(getActiveCV()?.content.sections.find(section => section.kind === "languages")?.entries[0].content).toEqual({ language: "English", proficiency: "C2" });
    fireEvent.click(screen.getByRole("button", { name: "Add certification" }));
    fireEvent.change(screen.getByLabelText("Certification name *"), { target: { value: "Cloud" } });
    fireEvent.change(screen.getByLabelText(/Issue date/), { target: { value: "2024-06" } });
    fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
    expect(getActiveCV()?.content.sections.find(section => section.kind === "certifications")?.entries[0].content).toMatchObject({ name: "Cloud", issuedOn: { year: 2024, month: 6 } });
  });

  it("preserves personal and summary drafts when an additional section is saved", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Unsaved Ada" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Unsaved summary" } });
    fireEvent.click(screen.getByRole("button", { name: "Add interest" }));
    fireEvent.change(screen.getByLabelText("Interest *"), { target: { value: "Reading" } });
    fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
    expect(screen.getByLabelText("Given name")).toHaveValue("Unsaved Ada");
    expect(screen.getByLabelText("Summary")).toHaveValue("Unsaved summary");
    expect(screen.getByRole("article", { name: "CV preview" })).not.toHaveTextContent("Reading");
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(screen.getByRole("article", { name: "CV preview" })).toHaveTextContent("Reading");
  });
});
