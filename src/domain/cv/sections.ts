import type { CVSection } from "./types";

/**
 * Calendar dates are deliberately partial: CVs commonly know a year or
 * month/year without knowing the exact day. Numeric bounds are validated at
 * an untrusted-input boundary, not by these compile-time contracts.
 */
export type CVPartialDate =
  | { year: number; month?: never; day?: never }
  | { year: number; month: number; day?: never }
  | { year: number; month: number; day: number };

/**
 * An omitted end date can mean an incomplete record; ongoing is explicit so
 * consumers never have to infer that a role is current from missing data.
 */
export type CVDateRange =
  | {
      startDate?: CVPartialDate;
      endDate?: CVPartialDate;
      ongoing?: false;
    }
  | {
      startDate?: CVPartialDate;
      endDate?: never;
      ongoing: true;
    };

export interface SummarySectionContent {
  text: string;
}

export interface ExperienceSectionContent {
  role: string;
  employer: string;
  location?: string;
  dateRange?: CVDateRange;
  employmentType?: "full-time" | "part-time" | "contract" | "internship" | "freelance" | "other";
  description?: string;
  responsibilities?: readonly string[];
  achievements?: readonly string[];
}

export interface EducationSectionContent {
  institution: string;
  qualification: string;
  fieldOfStudy?: string;
  location?: string;
  dateRange?: CVDateRange;
  grade?: string;
  description?: string;
}

export interface SkillSectionContent {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
  keywords?: readonly string[];
}

export interface ProjectSectionContent {
  name: string;
  description?: string;
  role?: string;
  url?: string;
  dateRange?: CVDateRange;
  highlights?: readonly string[];
}

export interface LanguageSectionContent {
  language: string;
  proficiency?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "basic" | "conversational" | "professional" | "fluent" | "native";
}

export interface CertificationSectionContent {
  name: string;
  issuer?: string;
  issuedOn?: CVPartialDate;
  expiresOn?: CVPartialDate;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AwardSectionContent {
  title: string;
  issuer?: string;
  awardedOn?: CVPartialDate;
  description?: string;
}

export interface VolunteeringSectionContent {
  role: string;
  organization: string;
  dateRange?: CVDateRange;
  description?: string;
  highlights?: readonly string[];
}

export interface PublicationSectionContent {
  title: string;
  publisher?: string;
  publishedOn?: CVPartialDate;
  authors?: readonly string[];
  url?: string;
  description?: string;
}

export interface InterestSectionContent {
  name: string;
  description?: string;
}

export interface ReferenceSectionContent {
  name: string;
  relationship?: string;
  organization?: string;
  email?: string;
  phone?: string;
}

/** A deliberately bounded set of custom field value types; never use any. */
export type CustomFieldValue =
  | { type: "text"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "date"; value: CVPartialDate }
  | { type: "url"; value: string }
  | { type: "email"; value: string }
  | { type: "phone"; value: string }
  | { type: "text-list"; value: readonly string[] };

export type CustomFieldId = string;

export interface CustomField {
  id: CustomFieldId;
  key: string;
  label: string;
  value: CustomFieldValue;
}

export interface CustomSectionContent {
  description?: string;
  fields: readonly CustomField[];
}

/** Maps every supported section discriminant to its factual entry payload. */
export interface CVSectionContentMap {
  summary: SummarySectionContent;
  experience: ExperienceSectionContent;
  education: EducationSectionContent;
  skills: SkillSectionContent;
  projects: ProjectSectionContent;
  languages: LanguageSectionContent;
  certifications: CertificationSectionContent;
  awards: AwardSectionContent;
  volunteering: VolunteeringSectionContent;
  publications: PublicationSectionContent;
  interests: InterestSectionContent;
  references: ReferenceSectionContent;
  custom: CustomSectionContent;
}

export type StandardCVSectionKind = Exclude<keyof CVSectionContentMap, "custom">;
export type CVSectionKind = keyof CVSectionContentMap;

/** Discriminated union connecting each section kind to its entry content. */
export type CVSectionVariant = {
  [TKind in CVSectionKind]: CVSection<TKind, CVSectionContentMap[TKind]>;
}[CVSectionKind];

/** Custom fields are available only within custom sections. */
export type CustomCVSection = CVSection<"custom", CustomSectionContent>;
