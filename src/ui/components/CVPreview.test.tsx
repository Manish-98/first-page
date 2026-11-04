// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CVDocument } from "../../domain/cv/types";
import CVPreview from "./CVPreview";

function fixture(content: CVDocument["content"] = { personalDetails: {}, sections: [] }): CVDocument {
  return {
    id: "cv-preview-test",
    metadata: {
      title: "My CV",
      createdAt: "2026-11-04T10:00:00.000Z",
      updatedAt: "2026-11-04T10:00:00.000Z",
    },
    content,
  };
}

describe("CVPreview", () => {
  it("shows an intentional empty state for an empty document", () => {
    render(<CVPreview document={fixture()} />);
    expect(screen.getByRole("heading", { name: "Your CV will take shape here" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Professional Summary" })).not.toBeInTheDocument();
  });

  it("renders partial personal details and omits blank optional fields", () => {
    render(<CVPreview document={fixture({
      personalDetails: {
        name: { givenName: "Ada", familyName: "Lovelace" },
        contact: { email: "ada@example.com", address: { locality: "London", region: " " } },
      },
      sections: [],
    })} />);
    expect(screen.getByRole("heading", { name: "Ada Lovelace" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ada@example.com" })).toHaveAttribute("href", "mailto:ada@example.com");
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.queryByText(",")).not.toBeInTheDocument();
    expect(screen.queryByText("Professional Summary")).not.toBeInTheDocument();
  });

  it("renders all supported content and preserves summary line breaks", () => {
    render(<CVPreview document={fixture({
      personalDetails: {
        name: { prefix: "Dr.", givenName: "Ada", additionalName: "Byron", familyName: "Lovelace", suffix: "PhD" },
        headline: "Mathematician",
        contact: {
          email: "ada@example.com",
          phone: "+44 20 1234 5678",
          website: "https://ada.example.com",
          address: { addressLine1: "1 Analytical Engine Way", locality: "London", country: "UK" },
          profiles: [{ label: "Portfolio", url: "https://portfolio.example.com/ada" }],
        },
      },
      sections: [{
        id: "summary-section",
        kind: "summary",
        title: "Professional Summary",
        entries: [{ id: "summary-entry", content: { text: "First line\nSecond line" } }],
      }],
    })} />);
    expect(screen.getByRole("heading", { name: "Dr. Ada Byron Lovelace PhD" })).toBeInTheDocument();
    expect(screen.getByText("Mathematician")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ada@example.com" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+44 20 1234 5678" })).toHaveAttribute("href", "tel:+442012345678");
    expect(screen.getByRole("link", { name: "https://ada.example.com" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Portfolio" })).toHaveAttribute("href", "https://portfolio.example.com/ada");
    expect(screen.getByText("First line\nSecond line")).toBeInTheDocument();
  });

  it("does not create unsafe external links from malformed URLs", () => {
    render(<CVPreview document={fixture({
      personalDetails: { contact: {
        website: "javascript:alert(1)",
        profiles: [{ label: "Unsafe", url: "javascript:alert(1)" }],
      } },
      sections: [],
    })} />);
    expect(screen.queryByRole("link", { name: "javascript:alert(1)" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your CV will take shape here" })).toBeInTheDocument();
  });
});
