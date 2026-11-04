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
    expect(screen.getByText(/First line/)).toHaveClass("cv-preview__summary");
  });

  it("renders committed work experience including dates, responsibilities and achievements", () => {
    render(<CVPreview document={fixture({
      personalDetails: {},
      sections: [{
        id: "experience-section",
        kind: "experience",
        entries: [{
          id: "experience-entry",
          content: {
            role: "Senior Engineer",
            employer: "Example Ltd",
            location: "Pune",
            dateRange: { startDate: { year: 2021, month: 4 }, ongoing: true },
            responsibilities: ["Designed APIs"],
            achievements: ["Reduced latency by 30%"],
          },
        }],
      }],
    })} />);
    const preview = screen.getByRole("article", { name: "CV preview" });
    expect(preview).toHaveTextContent("Senior Engineer");
    expect(preview).toHaveTextContent("Example Ltd");
    expect(preview).toHaveTextContent("Apr 2021 – Present");
    expect(preview).toHaveTextContent("Designed APIs");
    expect(preview).toHaveTextContent("Reduced latency by 30%");
  });

  it("renders committed education and skills while omitting blank optional values", () => {
    render(<CVPreview document={fixture({
      personalDetails: {},
      sections: [
        { id: "education", kind: "education", entries: [{ id: "degree", content: {
          institution: "Example University", qualification: "BSc", fieldOfStudy: "Computer Science",
          dateRange: { startDate: { year: 2021 }, endDate: { year: 2024 }, ongoing: false },
          grade: "First Class", description: "Focused on software engineering",
        } }] },
        { id: "skills", kind: "skills", entries: [{ id: "skill", content: {
          name: "TypeScript", level: "advanced", category: "Engineering", keywords: ["typed systems", "APIs"],
        } }, { id: "skill-2", content: { name: "React" } }] },
      ],
    })} />);
    const preview = screen.getByRole("article", { name: "CV preview" });
    expect(preview).toHaveTextContent("Education");
    expect(preview).toHaveTextContent("BSc · Computer Science");
    expect(preview).toHaveTextContent("Example University");
    expect(preview).toHaveTextContent("2021 – 2024");
    expect(preview).toHaveTextContent("First Class");
    expect(preview).toHaveTextContent("Skills");
    expect(preview).toHaveTextContent("TypeScript");
    expect(preview).toHaveTextContent("Advanced");
    expect(preview).toHaveTextContent("typed systems · APIs");
    expect(preview).not.toHaveTextContent("undefined");
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
