// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearActiveCV, getActiveCV, setActiveCV } from "../../application/cv/cvSession";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import CVDocumentPage from "./CVDocumentPage";

const dependencies: CVCreationDependencies = {
  generateId: (() => { let id = 0; return () => "generated-" + ++id; })(),
  now: () => "2026-11-04T12:00:00.000Z",
};
const fixture = () => ({
  id: "cv-1",
  metadata: { title: "My CV", createdAt: "2026-11-04T10:00:00.000Z", updatedAt: "2026-11-04T10:00:00.000Z" },
  content: { personalDetails: {}, sections: [] },
});

describe("work experience editor", () => {
  afterEach(() => clearActiveCV());

  it("adds multiple roles with partial dates and explicit ongoing status", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Engineer" } });
    fireEvent.change(screen.getByLabelText("Employer"), { target: { value: "Example Ltd" } });
    fireEvent.change(screen.getByLabelText("Start Year"), { target: { value: "2022" } });
    fireEvent.change(screen.getByLabelText("Start Month (optional)"), { target: { value: "4" } });
    fireEvent.click(screen.getByLabelText("I currently work here"));
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    expect(getActiveCV()?.content.sections[0].entries[0].content).toMatchObject({
      role: "Engineer", employer: "Example Ltd",
      dateRange: { startDate: { year: 2022, month: 4 }, ongoing: true },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Designer" } });
    fireEvent.change(screen.getByLabelText("Employer"), { target: { value: "Studio" } });
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    expect(getActiveCV()?.content.sections[0].entries).toHaveLength(2);
  });

  it("edits without changing identity and removes only the selected entry", () => {
    setActiveCV({
      ...fixture(),
      content: { personalDetails: {}, sections: [{
        id: "work", kind: "experience", entries: [
          { id: "entry-1", content: { role: "Engineer", employer: "Example" } },
          { id: "entry-2", content: { role: "Designer", employer: "Studio" } },
        ],
      }] },
    });
    render(<CVDocumentPage editingDependencies={dependencies} />);
    const first = screen.getByRole("listitem", { name: /Engineer/ });
    fireEvent.click(within(first).getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Staff Engineer" } });
    fireEvent.click(screen.getByRole("button", { name: "Save experience" }));
    expect(getActiveCV()?.content.sections[0].entries[0].id).toBe("entry-1");
    expect(getActiveCV()?.content.sections[0].entries[0].content).toMatchObject({ role: "Staff Engineer" });
    fireEvent.click(screen.getByRole("button", { name: "Remove Designer at Studio" }));
    expect(getActiveCV()?.content.sections[0].entries.map(entry => entry.id)).toEqual(["entry-1"]);
  });

  it("shows field errors and does not save invalid date input", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Engineer" } });
    fireEvent.change(screen.getByLabelText("Employer"), { target: { value: "Example" } });
    fireEvent.change(screen.getByLabelText("Month (optional)"), { target: { value: "13" } });
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/month/i);
    expect(getActiveCV()?.content.sections).toEqual([]);
  });

  it("keeps experience drafts when another editor section is saved and previews only committed roles", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Draft Engineer" } });
    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(screen.getByLabelText(/Job title/)).toHaveValue("Draft Engineer");
    expect(screen.getByRole("article", { name: "CV preview" })).not.toHaveTextContent("Draft Engineer");
    fireEvent.change(screen.getByLabelText("Employer"), { target: { value: "Committed Co" } });
    fireEvent.click(screen.getByRole("button", { name: "Add experience" }));
    expect(screen.getByRole("article", { name: "CV preview" })).toHaveTextContent("Draft Engineer");
  });
});
