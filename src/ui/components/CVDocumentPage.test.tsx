// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CVDocumentPage from "./CVDocumentPage";
import { clearActiveCV, setActiveCV } from "../../application/cv/cvSession";

describe("CVDocumentPage", () => {
  afterEach(() => clearActiveCV());

  it("shows a recovery state when no in-memory document is active", () => {
    render(<CVDocumentPage />);
    expect(screen.getByRole("heading", { name: /your cv isn’t open/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create a cv/i })).toHaveAttribute("href", "#/new-cv");
  });

  it("shows the created title and an intentional empty-document state", () => {
    setActiveCV({
      id: "cv-1",
      metadata: { title: "My CV", createdAt: "2026-11-04T10:00:00.000Z", updatedAt: "2026-11-04T10:00:00.000Z" },
      content: { personalDetails: {}, sections: [] },
    });
    render(<CVDocumentPage />);
    expect(screen.getByRole("heading", { name: "My CV" })).toBeInTheDocument();
    expect(screen.getByText(/not saved when you refresh/i)).toBeInTheDocument();
  });
});
