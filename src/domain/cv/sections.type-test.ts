import type { CVDocument } from "./types";
import type {
  CVDateRange,
  CVPartialDate,
  CVSectionVariant,
  CustomField,
} from "./sections";

const yearOnly: CVPartialDate = { year: 2024 };
const monthAndYear: CVPartialDate = { year: 2025, month: 3 };
const fullDate: CVPartialDate = { year: 2026, month: 6, day: 15 };

// @ts-expect-error A day cannot be specified without its month.
export const invalidDayOnlyDate: CVPartialDate = { year: 2024, day: 12 };

const completedRange: CVDateRange = {
  startDate: monthAndYear,
  endDate: fullDate,
};
const ongoingRange: CVDateRange = {
  startDate: yearOnly,
  ongoing: true,
};
export const incompleteRange: CVDateRange = { startDate: yearOnly };

// @ts-expect-error An ongoing range cannot also have an end date.
export const invalidOngoingRange: CVDateRange = { endDate: fullDate, ongoing: true };

const customFields: readonly CustomField[] = [
  { id: "field-1", key: "clearance", label: "Clearance", value: { type: "text", value: "Public" } },
  { id: "field-2", key: "years", label: "Years", value: { type: "number", value: 5 } },
  { id: "field-3", key: "remote", label: "Remote", value: { type: "boolean", value: true } },
  { id: "field-4", key: "available", label: "Available from", value: { type: "date", value: yearOnly } },
  { id: "field-5", key: "portfolio", label: "Portfolio", value: { type: "url", value: "https://example.test" } },
  { id: "field-6", key: "contact", label: "Contact", value: { type: "email", value: "alex@example.test" } },
  { id: "field-7", key: "phone", label: "Phone", value: { type: "phone", value: "+10000000000" } },
  { id: "field-8", key: "tools", label: "Tools", value: { type: "text-list", value: ["TypeScript", "React"] } },
];

// @ts-expect-error Unsupported custom field value types are rejected.
export const invalidCustomField: CustomField = { id: "field-invalid", key: "payload", label: "Payload", value: { type: "object", value: { arbitrary: true } } };

export const representativeSections = [
  { id: "summary-1", kind: "summary", entries: [{ id: "summary-entry-1", content: { text: "Product engineer." } }] },
  { id: "experience-1", kind: "experience", entries: [{ id: "experience-entry-1", content: { role: "Engineer", employer: "Example Ltd", dateRange: ongoingRange } }] },
  { id: "education-1", kind: "education", entries: [{ id: "education-entry-1", content: { institution: "Example University", qualification: "BSc", dateRange: completedRange } }] },
  { id: "skills-1", kind: "skills", entries: [{ id: "skill-entry-1", content: { name: "TypeScript", level: "advanced" } }] },
  { id: "projects-1", kind: "projects", entries: [{ id: "project-entry-1", content: { name: "First Page", dateRange: incompleteRange, highlights: ["Structured CV data"] } }] },
  { id: "languages-1", kind: "languages", entries: [{ id: "language-entry-1", content: { language: "English", proficiency: "C1" } }] },
  { id: "certifications-1", kind: "certifications", entries: [{ id: "cert-entry-1", content: { name: "Cloud Practitioner", issuedOn: monthAndYear } }] },
  { id: "awards-1", kind: "awards", entries: [{ id: "award-entry-1", content: { title: "Engineering Award", awardedOn: fullDate } }] },
  { id: "volunteering-1", kind: "volunteering", entries: [{ id: "volunteer-entry-1", content: { role: "Mentor", organization: "Community", dateRange: ongoingRange } }] },
  { id: "publications-1", kind: "publications", entries: [{ id: "publication-entry-1", content: { title: "Typed Systems", authors: ["Alex Example"] } }] },
  { id: "interests-1", kind: "interests", entries: [{ id: "interest-entry-1", content: { name: "Open source" } }] },
  { id: "references-1", kind: "references", entries: [{ id: "reference-entry-1", content: { name: "Jordan Example", relationship: "Former manager" } }] },
  { id: "custom-1", kind: "custom", entries: [{ id: "custom-entry-1", content: { description: "Additional information", fields: customFields } }] },
] satisfies readonly CVSectionVariant[];

/** Every section variant is usable through the root document contract. */
export const representativeDocument: CVDocument<CVSectionVariant> = {
  id: "cv-standard-sections",
  metadata: {
    title: "Representative CV",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  content: {
    personalDetails: {},
    sections: representativeSections,
  },
};

export function sectionEntryCount(section: CVSectionVariant): number {
  switch (section.kind) {
    case "summary":
    case "experience":
    case "education":
    case "skills":
    case "projects":
    case "languages":
    case "certifications":
    case "awards":
    case "volunteering":
    case "publications":
    case "interests":
    case "references":
    case "custom":
      return section.entries.length;
  }
}
