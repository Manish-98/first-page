// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import NewCVPage from "./NewCVPage";
import { clearActiveCV, getActiveCV } from "../../application/cv/cvSession";

const testCreationDependencies: CVCreationDependencies = {
  generateId: () => "test-cv-id",
  now: () => "2026-11-04T10:00:00.000Z",
};

describe("NewCVPage", () => {
  afterEach(() => {
    clearActiveCV();
    window.location.hash = "";
  });

  it("offers guided and blank creation paths", () => {
    render(<NewCVPage creationDependencies={testCreationDependencies} />);
    expect(screen.getByRole("button", { name: /guided setup/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /blank cv/i })).toBeInTheDocument();
  });

  it("creates an empty document from the blank path and navigates only after success", () => {
    render(<NewCVPage creationDependencies={testCreationDependencies} />);
    fireEvent.click(screen.getByRole("button", { name: /blank cv/i }));
    fireEvent.change(screen.getByLabelText(/give your cv a title/i), {
      target: { value: "My CV" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create CV" }));

    expect(getActiveCV()).toEqual({
      id: "test-cv-id",
      metadata: {
        title: "My CV",
        createdAt: "2026-11-04T10:00:00.000Z",
        updatedAt: "2026-11-04T10:00:00.000Z",
      },
      content: { personalDetails: {}, sections: [] },
    });
    expect(window.location.hash).toBe("#/cv");
  });

  it("guides the user through a checklist before creating the same empty model", () => {
    render(<NewCVPage creationDependencies={testCreationDependencies} />);
    fireEvent.click(screen.getByRole("button", { name: /guided setup/i }));
    fireEvent.change(screen.getByLabelText(/give your cv a title/i), {
      target: { value: "Guided CV" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("heading", { name: "Your starting checklist" })).toBeInTheDocument();
    expect(getActiveCV()).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Create CV" }));
    expect(getActiveCV()?.content).toEqual({ personalDetails: {}, sections: [] });
    expect(getActiveCV()?.metadata.title).toBe("Guided CV");
    expect(window.location.hash).toBe("#/cv");
  });

  it("rejects a blank title accessibly and does not create or navigate", () => {
    render(<NewCVPage creationDependencies={testCreationDependencies} />);
    fireEvent.click(screen.getByRole("button", { name: /blank cv/i }));
    fireEvent.click(screen.getByRole("button", { name: "Create CV" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a title for your CV.");
    expect(getActiveCV()).toBeNull();
    expect(window.location.hash).toBe("");
  });
});