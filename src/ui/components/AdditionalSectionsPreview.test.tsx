// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CVPreview from "./CVPreview";

describe("additional standard section preview", () => {
  it("renders all eight section types and only safe external links", () => {
    const document = {
      id: "cv-1",
      metadata: { title: "CV", createdAt: "2026-11-04T10:00:00.000Z", updatedAt: "2026-11-04T10:00:00.000Z" },
      content: { personalDetails: {}, sections: [
        { id: "projects", kind: "projects", entries: [{ id: "p1", content: { name: "Atlas", url: "ftp://example.com", highlights: ["Delivered"] } }] },
        { id: "languages", kind: "languages", entries: [{ id: "l1", content: { language: "English", proficiency: "C2" } }] },
        { id: "certifications", kind: "certifications", entries: [{ id: "c1", content: { name: "Cloud", credentialUrl: "https://example.com" } }] },
        { id: "awards", kind: "awards", entries: [{ id: "a1", content: { title: "Prize" } }] },
        { id: "volunteering", kind: "volunteering", entries: [{ id: "v1", content: { role: "Mentor", organization: "Club" } }] },
        { id: "publications", kind: "publications", entries: [{ id: "u1", content: { title: "Paper", url: "https://example.org/paper" } }] },
        { id: "interests", kind: "interests", entries: [{ id: "i1", content: { name: "Reading" } }] },
        { id: "references", kind: "references", entries: [{ id: "r1", content: { name: "Ada", email: "ada@example.com" } }] },
      ] },
    };
    render(<CVPreview document={document as never} />);
    for (const heading of ["Projects","Languages","Certifications","Awards","Volunteering","Publications","Interests","References"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText("Atlas")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View credential" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByRole("link", { name: "Read publication" })).toHaveAttribute("href", "https://example.org/paper");
    expect(screen.queryByRole("link", { name: "Project link" })).not.toBeInTheDocument();
  });
});
