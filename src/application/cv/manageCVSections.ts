import { addSection, moveSectionDown, moveSectionUp, removeSection } from "../../domain/cv/operations";
import type { StandardCVSectionKind } from "../../domain/cv/sections";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { CVCreationDependencies } from "./createCV";
export type ManagedCVSectionKind = StandardCVSectionKind;
export type SectionManagementResult = { ok: true; document: CVDocument } | { ok: false; message: string };
export const standardSectionTitles: Record<ManagedCVSectionKind, string> = {
  summary: "Professional Summary", experience: "Work Experience", education: "Education", skills: "Skills",
  projects: "Projects", languages: "Languages", certifications: "Certifications", awards: "Awards",
  volunteering: "Volunteering", publications: "Publications", interests: "Interests", references: "References",
};
export function getAvailableCVSections(document: CVDocument): ManagedCVSectionKind[] {
  const present = new Set(document.content.sections.map(section => section.kind));
  return (Object.keys(standardSectionTitles) as ManagedCVSectionKind[]).filter(kind => !present.has(kind));
}
export function addCVSection(document: CVDocument, kind: ManagedCVSectionKind, dependencies: Pick<CVCreationDependencies, "generateId" | "now">): SectionManagementResult {
  if (document.content.sections.some(section => section.kind === kind)) return { ok: false, message: `${standardSectionTitles[kind]} is already in this CV.` };
  const section: CVSection = { id: dependencies.generateId(), kind, title: standardSectionTitles[kind], entries: [] };
  const result = addSection(document, section, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
}
export function removeCVSection(document: CVDocument, sectionId: string, dependencies: Pick<CVCreationDependencies, "now">): SectionManagementResult {
  const result = removeSection(document, sectionId, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
}
export function moveCVSection(document: CVDocument, sectionId: string, direction: "up" | "down", dependencies: Pick<CVCreationDependencies, "now">): SectionManagementResult {
  const result = direction === "up" ? moveSectionUp(document, sectionId, dependencies.now()) : moveSectionDown(document, sectionId, dependencies.now());
  return result.ok ? { ok: true, document: result.value } : { ok: false, message: result.error.message };
}
