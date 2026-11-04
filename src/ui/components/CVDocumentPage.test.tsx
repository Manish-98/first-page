// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { clearActiveCV, getActiveCV, setActiveCV } from "../../application/cv/cvSession";
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

describe("CVDocumentPage", () => {
  afterEach(() => clearActiveCV());

  it("shows a recovery state when no in-memory document is active", () => {
    render(<CVDocumentPage editingDependencies={dependencies} />);
    expect(screen.getByRole("heading", { name: /your cv isn’t open/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create a cv/i })).toHaveAttribute("href", "#/new-cv");
  });

  it("saves personal details and creates a multiline summary", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "First line\nSecond line" } });
    fireEvent.click(screen.getByRole("button", { name: "Save summary" }));
    expect(getActiveCV()?.content.personalDetails).toEqual({ name: { givenName: "Ada" }, contact: { email: "ada@example.com" } });
    expect(getActiveCV()?.content.sections[0].entries[0].content).toEqual({ text: "First line\nSecond line" });
  });

  it("reports field-level errors without mutating the active document", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Email address is not valid.");
    expect(getActiveCV()?.content.personalDetails).toEqual({});
  });

  it("adds profile links and omits cleared optional values", () => {
    setActiveCV({ ...fixture(), content: { personalDetails: { headline: "Designer", contact: { email: "old@example.com" } }, sections: [] } });
    render(<CVDocumentPage editingDependencies={dependencies} />);
    fireEvent.click(screen.getByRole("button", { name: "Add profile link" }));
    fireEvent.change(screen.getByLabelText("Label"), { target: { value: "LinkedIn" } });
    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://linkedin.com/in/ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(getActiveCV()?.content.personalDetails.contact?.profiles).toEqual([{ label: "LinkedIn", url: "https://linkedin.com/in/ada" }]);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(getActiveCV()?.content.personalDetails.contact).toEqual({ profiles: [{ label: "LinkedIn", url: "https://linkedin.com/in/ada" }] });
  });

  it("preserves the other form's unsaved draft when either form is saved", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);

    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Unsaved Ada" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Saved summary" } });
    fireEvent.click(screen.getByRole("button", { name: "Save summary" }));

    expect(screen.getByLabelText("Given name")).toHaveValue("Unsaved Ada");
    expect(getActiveCV()?.content.personalDetails).toEqual({});
    expect(getActiveCV()?.content.sections[0].entries[0].content).toEqual({ text: "Saved summary" });

    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Unsaved summary draft" } });
    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Saved Ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));

    expect(screen.getByLabelText("Summary")).toHaveValue("Unsaved summary draft");
    expect(getActiveCV()?.content.personalDetails).toEqual({ name: { givenName: "Saved Ada" } });
    expect(getActiveCV()?.content.sections[0].entries[0].content).toEqual({ text: "Saved summary" });
  });


  it("preserves personal and summary drafts when education and skills are saved", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);

    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Unsaved Ada" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Unsaved summary" } });

    fireEvent.click(screen.getByRole("button", { name: "Add education" }));
    fireEvent.change(screen.getByLabelText(/Institution/), { target: { value: "Example University" } });
    fireEvent.change(screen.getByLabelText(/Qualification/), { target: { value: "BSc" } });
    fireEvent.click(screen.getByRole("button", { name: "Add education" }));

    expect(screen.getByLabelText("Given name")).toHaveValue("Unsaved Ada");
    expect(screen.getByLabelText("Summary")).toHaveValue("Unsaved summary");

    fireEvent.click(screen.getByRole("button", { name: "Add skill" }));
    fireEvent.change(screen.getByLabelText(/Skill name/), { target: { value: "TypeScript" } });
    fireEvent.click(screen.getByRole("button", { name: "Add skill" }));

    expect(screen.getByLabelText("Given name")).toHaveValue("Unsaved Ada");
    expect(screen.getByLabelText("Summary")).toHaveValue("Unsaved summary");
    expect(getActiveCV()?.content.sections.find(section => section.kind === "education")?.entries).toHaveLength(1);
    expect(getActiveCV()?.content.sections.find(section => section.kind === "skills")?.entries).toHaveLength(1);
  });

  it("shows only committed details and summary in the live preview", () => {
    setActiveCV(fixture());
    render(<CVDocumentPage editingDependencies={dependencies} />);

    expect(screen.getByRole("heading", { name: "Your CV will take shape here" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "Draft Ada" } });
    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Draft summary" } });
    expect(screen.getByRole("heading", { name: "Your CV will take shape here" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));
    expect(screen.getByRole("heading", { name: "Draft Ada" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "CV preview" })).not.toHaveTextContent("Draft summary");

    fireEvent.change(screen.getByLabelText("Summary"), { target: { value: "Committed summary" } });
    expect(screen.getByRole("article", { name: "CV preview" })).not.toHaveTextContent("Committed summary");
    fireEvent.click(screen.getByRole("button", { name: "Save summary" }));
    expect(screen.getByRole("article", { name: "CV preview" })).toHaveTextContent("Committed summary");
  });

  it("removes cleared details from the preview after saving", () => {
    setActiveCV({
      ...fixture(),
      content: { personalDetails: { name: { givenName: "Ada" }, contact: { email: "ada@example.com" } }, sections: [] },
    });
    render(<CVDocumentPage editingDependencies={dependencies} />);
    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ada@example.com" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Given name"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save personal details" }));

    expect(screen.queryByRole("heading", { name: "Ada" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "ada@example.com" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your CV will take shape here" })).toBeInTheDocument();
  });

});
