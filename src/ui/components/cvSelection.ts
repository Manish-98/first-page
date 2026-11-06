import type { CVSection } from "../../domain/cv/types";

export type CVSelection =
  | { type: "personal-details" }
  | { type: "section"; sectionId: string }
  | null;

export function getSelectionKey(selection: CVSelection): string | null {
  if (!selection) return null;
  return selection.type === "personal-details" ? "personal-details" : `section:${selection.sectionId}`;
}

export function getSectionLabel(section: CVSection): string {
  if (section.title?.trim()) return section.title.trim();
  const labels: Record<string, string> = {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    languages: "Languages",
    certifications: "Certifications",
    awards: "Awards",
    volunteering: "Volunteering",
    publications: "Publications",
    interests: "Interests",
    references: "References",
    custom: "Additional information",
  };
  return labels[section.kind] ?? "CV section";
}
