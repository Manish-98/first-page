import type { CVSectionContentMap, CVSectionKind, CVPartialDate } from "./sections";

export type CVValidationIssueCode =
  | "invalid-document"
  | "missing-field"
  | "invalid-type"
  | "invalid-identifier"
  | "duplicate-identifier"
  | "invalid-date"
  | "invalid-date-range"
  | "invalid-email"
  | "invalid-url"
  | "invalid-enum"
  | "invalid-custom-field";

export type CVValidationIssueCategory = "structure" | "format" | "invariant";

export interface CVValidationIssue {
  readonly code: CVValidationIssueCode;
  readonly category: CVValidationIssueCategory;
  readonly path: string;
  readonly message: string;
  readonly documentId?: string;
  readonly sectionId?: string;
  readonly entryId?: string;
  readonly fieldId?: string;
}

export interface CVValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CVValidationIssue[];
}

type UnknownRecord = Record<string, unknown>;

const builtInSectionKinds = [
  "summary", "experience", "education", "skills", "projects", "languages",
  "certifications", "awards", "volunteering", "publications", "interests",
  "references", "custom",
] as const satisfies readonly CVSectionKind[];

const requiredEntryFields: { [K in keyof CVSectionContentMap]: readonly string[] } = {
  summary: ["text"],
  experience: ["role", "employer"],
  education: ["institution", "qualification"],
  skills: ["name"],
  projects: ["name"],
  languages: ["language"],
  certifications: ["name"],
  awards: ["title"],
  volunteering: ["role", "organization"],
  publications: ["title"],
  interests: ["name"],
  references: ["name"],
  custom: ["fields"],
};

const stringEntryFields: { [K in keyof CVSectionContentMap]: readonly string[] } = {
  summary: ["text"],
  experience: ["role", "employer", "location", "description"],
  education: ["institution", "qualification", "fieldOfStudy", "location", "grade", "description"],
  skills: ["name", "category"],
  projects: ["name", "description", "role", "url"],
  languages: ["language"],
  certifications: ["name", "issuer", "credentialId", "credentialUrl"],
  awards: ["title", "issuer", "description"],
  volunteering: ["role", "organization", "description"],
  publications: ["title", "publisher", "url", "description"],
  interests: ["name", "description"],
  references: ["name", "relationship", "organization", "email", "phone"],
  custom: ["description"],
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: UnknownRecord, key: string): boolean {
  return !(key in value) || typeof value[key] === "string";
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999 ||
      !Number.isInteger(month) || month < 1 || month > 12 ||
      !Number.isInteger(day) || day < 1) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysByMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysByMonth[month - 1];
}

function comparePartialDates(left: CVPartialDate, right: CVPartialDate): number | undefined {
  if (left.year !== right.year) return left.year - right.year;
  if (left.month === undefined || right.month === undefined) return undefined;
  if (left.month !== right.month) return left.month - right.month;
  if (left.day === undefined || right.day === undefined) return undefined;
  return left.day - right.day;
}

function isValidPartialDate(value: unknown): value is CVPartialDate {
  if (!isRecord(value) || typeof value.year !== "number" || !Number.isInteger(value.year) ||
      value.year < 1 || value.year > 9999) return false;
  if ("month" in value && (typeof value.month !== "number" || !Number.isInteger(value.month) || value.month < 1 || value.month > 12)) return false;
  if ("day" in value && (!("month" in value) || typeof value.day !== "number" || !Number.isInteger(value.day) ||
      !isValidCalendarDate(value.year, value.month as number, value.day))) return false;
  return Object.keys(value).every(key => key === "year" || key === "month" || key === "day");
}

function isValidISODateTime(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) return isValidCalendarDate(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3]));
  const dateTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!dateTime || !isValidCalendarDate(Number(dateTime[1]), Number(dateTime[2]), Number(dateTime[3]))) return false;
  const [, , , hour, minute, second] = dateTime;
  return Number(hour) <= 23 && Number(minute) <= 59 && Number(second) <= 59 && !Number.isNaN(Date.parse(value));
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate untrusted CV data without changing it. Unknown extension section
 * kinds are accepted when their generic section/entry structure is sound;
 * their extension-specific payload semantics are intentionally not guessed.
 */
export function validateCVDocument(input: unknown): CVValidationResult {
  const issues: CVValidationIssue[] = [];
  const sectionIds = new Set<string>();
  const entryIds = new Set<string>();
  const customFieldIds = new Set<string>();

  const add = (
    code: CVValidationIssueCode,
    category: CVValidationIssueCategory,
    path: string,
    message: string,
    context: Omit<CVValidationIssue, "code" | "category" | "path" | "message"> = {},
  ): void => {
    issues.push({ code, category, path, message, ...context });
  };

  const checkId = (
    value: unknown,
    path: string,
    seen: Set<string>,
    duplicateCode: "duplicate-identifier",
    context: Omit<CVValidationIssue, "code" | "category" | "path" | "message"> = {},
  ): void => {
    if (!isNonEmptyString(value)) {
      add("invalid-identifier", "structure", path, "Identifier must be a non-empty string.", context);
      return;
    }
    if (seen.has(value)) add(duplicateCode, "invariant", path, `Identifier '${value}' is duplicated.`, context);
    else seen.add(value);
  };

  if (!isRecord(input)) {
    add("invalid-document", "structure", "$", "CV document must be an object.");
    return { valid: false, issues };
  }

  const documentId = isNonEmptyString(input.id) ? input.id : undefined;
  checkId(input.id, "$.id", new Set<string>(), "duplicate-identifier");
  if (!isRecord(input.metadata)) {
    add("invalid-type", "structure", "$.metadata", "Metadata must be an object.", { documentId });
  } else {
    if (!isNonEmptyString(input.metadata.title)) add("missing-field", "structure", "$.metadata.title", "Document title must be a non-empty string.", { documentId });
    for (const key of ["createdAt", "updatedAt"] as const) {
      if (!(key in input.metadata)) add("missing-field", "structure", `$.metadata.${key}`, "Timestamp is required.", { documentId });
      else if (!isValidISODateTime(input.metadata[key])) add("invalid-date", "format", `$.metadata.${key}`, "Timestamp must be a valid ISO date or timezone-qualified ISO date-time.", { documentId });
    }
    if (isValidISODateTime(input.metadata.createdAt) && isValidISODateTime(input.metadata.updatedAt) &&
        Date.parse(input.metadata.updatedAt) < Date.parse(input.metadata.createdAt)) {
      add("invalid-date-range", "invariant", "$.metadata.updatedAt", "Updated timestamp cannot precede creation timestamp.", { documentId });
    }
  }

  if (!isRecord(input.content)) {
    add("invalid-type", "structure", "$.content", "Document content must be an object.", { documentId });
    return { valid: false, issues };
  }

  if (!isRecord(input.content.personalDetails)) {
    add("invalid-type", "structure", "$.content.personalDetails", "Personal details must be an object.", { documentId });
  } else {
    const personal = input.content.personalDetails;
    for (const key of ["headline"] as const) {
      if (!isOptionalString(personal, key)) add("invalid-type", "structure", `$.content.personalDetails.${key}`, "Value must be a string when provided.", { documentId });
    }
    if ("name" in personal) {
      if (!isRecord(personal.name)) add("invalid-type", "structure", "$.content.personalDetails.name", "Name must be an object.", { documentId });
      else for (const key of ["givenName", "additionalName", "familyName", "prefix", "suffix"]) {
        if (!isOptionalString(personal.name, key)) add("invalid-type", "structure", `$.content.personalDetails.name.${key}`, "Value must be a string when provided.", { documentId });
      }
    }
    if ("contact" in personal) validateContact(personal.contact, "$.content.personalDetails.contact", documentId, add);
  }

  if (!Array.isArray(input.content.sections)) {
    add("invalid-type", "structure", "$.content.sections", "Sections must be an array.", { documentId });
  } else {
    input.content.sections.forEach((section, sectionIndex) => {
      const sectionPath = `$.content.sections[${sectionIndex}]`;
      if (!isRecord(section)) {
        add("invalid-type", "structure", sectionPath, "Section must be an object.", { documentId });
        return;
      }
      const sectionId = isNonEmptyString(section.id) ? section.id : undefined;
      checkId(section.id, `${sectionPath}.id`, sectionIds, "duplicate-identifier", { documentId, sectionId });
      if (!isNonEmptyString(section.kind)) add("missing-field", "structure", `${sectionPath}.kind`, "Section kind must be a non-empty string.", { documentId, sectionId });
      if (!isOptionalString(section, "title")) add("invalid-type", "structure", `${sectionPath}.title`, "Section title must be a string when provided.", { documentId, sectionId });
      if (!Array.isArray(section.entries)) {
        add("invalid-type", "structure", `${sectionPath}.entries`, "Section entries must be an array.", { documentId, sectionId });
        return;
      }
      section.entries.forEach((entry, entryIndex) => {
        const entryPath = `${sectionPath}.entries[${entryIndex}]`;
        if (!isRecord(entry)) {
          add("invalid-type", "structure", entryPath, "Entry must be an object.", { documentId, sectionId });
          return;
        }
        const entryId = isNonEmptyString(entry.id) ? entry.id : undefined;
        checkId(entry.id, `${entryPath}.id`, entryIds, "duplicate-identifier", { documentId, sectionId, entryId });
        if (!("content" in entry)) {
          add("missing-field", "structure", `${entryPath}.content`, "Entry content property is required.", { documentId, sectionId, entryId });
          return;
        }
        if (typeof section.kind === "string" && (builtInSectionKinds as readonly string[]).includes(section.kind)) {
          if (!isRecord(entry.content)) {
            add("invalid-type", "structure", `${entryPath}.content`, "Built-in section entry content must be an object.", { documentId, sectionId, entryId });
            return;
          }
          validateBuiltInEntry(section.kind as CVSectionKind, entry.content, entryPath, { documentId, sectionId, entryId }, add, customFieldIds);
        }
      });
    });
  }

  return { valid: issues.length === 0, issues };
}

type IssueAdder = (
  code: CVValidationIssueCode,
  category: CVValidationIssueCategory,
  path: string,
  message: string,
  context?: Omit<CVValidationIssue, "code" | "category" | "path" | "message">,
) => void;

function validateContact(value: unknown, path: string, documentId: string | undefined, add: IssueAdder): void {
  if (!isRecord(value)) {
    add("invalid-type", "structure", path, "Contact details must be an object.", { documentId });
    return;
  }
  for (const key of ["email", "phone", "website"] as const) {
    if (key in value && typeof value[key] !== "string") add("invalid-type", "structure", `${path}.${key}`, "Value must be a string when provided.", { documentId });
  }
  if (typeof value.email === "string" && !isValidEmail(value.email)) add("invalid-email", "format", `${path}.email`, "Email address is not valid.", { documentId });
  if (typeof value.website === "string" && !isValidUrl(value.website)) add("invalid-url", "format", `${path}.website`, "Website must be an absolute HTTP or HTTPS URL.", { documentId });
  if ("address" in value) {
    if (!isRecord(value.address)) add("invalid-type", "structure", `${path}.address`, "Postal address must be an object.", { documentId });
    else for (const key of ["addressLine1", "addressLine2", "locality", "region", "postalCode", "country"]) {
      if (!isOptionalString(value.address, key)) add("invalid-type", "structure", `${path}.address.${key}`, "Value must be a string when provided.", { documentId });
    }
  }
  if ("profiles" in value) {
    if (!Array.isArray(value.profiles)) add("invalid-type", "structure", `${path}.profiles`, "Profiles must be an array.", { documentId });
    else value.profiles.forEach((profile, index) => {
      const profilePath = `${path}.profiles[${index}]`;
      if (!isRecord(profile)) {
        add("invalid-type", "structure", profilePath, "Profile link must be an object.", { documentId });
        return;
      }
      if (!isNonEmptyString(profile.label)) add("missing-field", "structure", `${profilePath}.label`, "Profile label must be a non-empty string.", { documentId });
      if (typeof profile.url !== "string" || !isValidUrl(profile.url)) add("invalid-url", "format", `${profilePath}.url`, "Profile URL must be an absolute HTTP or HTTPS URL.", { documentId });
    });
  }
}

function validateBuiltInEntry(
  kind: CVSectionKind,
  content: UnknownRecord,
  path: string,
  context: Omit<CVValidationIssue, "code" | "category" | "path" | "message">,
  add: IssueAdder,
  customFieldIds: Set<string>,
): void {
  for (const field of requiredEntryFields[kind]) {
    if (!(field in content)) add("missing-field", "structure", `${path}.content.${field}`, `Required '${field}' property is missing.`, context);
  }
  for (const field of stringEntryFields[kind]) {
    if (field in content && typeof content[field] !== "string") add("invalid-type", "structure", `${path}.content.${field}`, "Value must be a string when provided.", context);
  }

  const optionalArrays: Partial<Record<CVSectionKind, readonly string[]>> = {
    experience: ["responsibilities", "achievements"],
    projects: ["highlights"],
    volunteering: ["highlights"],
    publications: ["authors"],
    skills: ["keywords"],
  };
  for (const field of optionalArrays[kind] ?? []) {
    if (field in content && (!Array.isArray(content[field]) || !(content[field] as unknown[]).every(item => typeof item === "string"))) {
      add("invalid-type", "structure", `${path}.content.${field}`, "Value must be an array of strings when provided.", context);
    }
  }

  const enumValues: Partial<Record<CVSectionKind, Record<string, readonly string[]>>> = {
    experience: { employmentType: ["full-time", "part-time", "contract", "internship", "freelance", "other"] },
    skills: { level: ["beginner", "intermediate", "advanced", "expert"] },
    languages: { proficiency: ["A1", "A2", "B1", "B2", "C1", "C2", "basic", "conversational", "professional", "fluent", "native"] },
  };
  for (const [field, allowed] of Object.entries(enumValues[kind] ?? {})) {
    if (field in content && (typeof content[field] !== "string" || !allowed.includes(content[field] as string))) {
      add("invalid-enum", "format", `${path}.content.${field}`, `Value for '${field}' is not supported.`, context);
    }
  }

  const dateFields: Partial<Record<CVSectionKind, readonly string[]>> = {
    experience: ["dateRange"], education: ["dateRange"], projects: ["dateRange"],
    volunteering: ["dateRange"], certifications: ["issuedOn", "expiresOn"],
    awards: ["awardedOn"], publications: ["publishedOn"],
  };
  for (const field of dateFields[kind] ?? []) {
    if (!(field in content)) continue;
    const fieldPath = `${path}.content.${field}`;
    if (field === "dateRange") validateDateRange(content[field], fieldPath, context, add);
    else if (!isValidPartialDate(content[field])) add("invalid-date", "format", fieldPath, "Date must contain a valid year and optional month/day.", context);
  }
  if (kind === "certifications" && isValidPartialDate(content.issuedOn) && isValidPartialDate(content.expiresOn)) {
    const comparison = comparePartialDates(content.expiresOn, content.issuedOn);
    if (comparison !== undefined && comparison < 0) add("invalid-date-range", "invariant", `${path}.content.expiresOn`, "Expiry date cannot precede issue date.", context);
  }
  if (kind === "projects" && "url" in content && typeof content.url === "string" && !isValidUrl(content.url)) {
    add("invalid-url", "format", `${path}.content.url`, "Project URL must be an absolute HTTP or HTTPS URL.", context);
  }
  if (kind === "certifications" && "credentialUrl" in content && typeof content.credentialUrl === "string" && !isValidUrl(content.credentialUrl)) {
    add("invalid-url", "format", `${path}.content.credentialUrl`, "Credential URL must be an absolute HTTP or HTTPS URL.", context);
  }
  if (kind === "publications" && "url" in content && typeof content.url === "string" && !isValidUrl(content.url)) {
    add("invalid-url", "format", `${path}.content.url`, "Publication URL must be an absolute HTTP or HTTPS URL.", context);
  }
  if (kind === "references" && "email" in content && typeof content.email === "string" && !isValidEmail(content.email)) {
    add("invalid-email", "format", `${path}.content.email`, "Email address is not valid.", context);
  }
  if (kind === "custom") validateCustomFields(content.fields, `${path}.content.fields`, context, add, customFieldIds);
}

function validateDateRange(value: unknown, path: string, context: Omit<CVValidationIssue, "code" | "category" | "path" | "message">, add: IssueAdder): void {
  if (!isRecord(value)) {
    add("invalid-type", "structure", path, "Date range must be an object.", context);
    return;
  }
  if ("startDate" in value && !isValidPartialDate(value.startDate)) add("invalid-date", "format", `${path}.startDate`, "Start date must contain a valid year and optional month/day.", context);
  if ("endDate" in value && !isValidPartialDate(value.endDate)) add("invalid-date", "format", `${path}.endDate`, "End date must contain a valid year and optional month/day.", context);
  if ("ongoing" in value && typeof value.ongoing !== "boolean") add("invalid-type", "structure", `${path}.ongoing`, "Ongoing must be a boolean when provided.", context);
  if (value.ongoing === true && "endDate" in value) add("invalid-date-range", "invariant", `${path}.endDate`, "An ongoing date range cannot have an end date.", context);
  if (isValidPartialDate(value.startDate) && isValidPartialDate(value.endDate)) {
    const comparison = comparePartialDates(value.endDate, value.startDate);
    if (comparison !== undefined && comparison < 0) {
      add("invalid-date-range", "invariant", `${path}.endDate`, "End date cannot precede start date.", context);
    }
  }
  if (Object.keys(value).some(key => !["startDate", "endDate", "ongoing"].includes(key))) {
    add("invalid-type", "structure", path, "Date range contains an unsupported property.", context);
  }
}

function validateCustomFields(
  value: unknown,
  path: string,
  context: Omit<CVValidationIssue, "code" | "category" | "path" | "message">,
  add: IssueAdder,
  seenIds: Set<string>,
): void {
  if (!Array.isArray(value)) {
    add("invalid-type", "structure", path, "Custom fields must be an array.", context);
    return;
  }
  value.forEach((field, index) => {
    const fieldPath = `${path}[${index}]`;
    if (!isRecord(field)) {
      add("invalid-type", "structure", fieldPath, "Custom field must be an object.", context);
      return;
    }
    const fieldId = isNonEmptyString(field.id) ? field.id : undefined;
    const fieldContext = { ...context, fieldId };
    if (!fieldId) add("invalid-identifier", "structure", `${fieldPath}.id`, "Custom field identifier must be a non-empty string.", fieldContext);
    else if (seenIds.has(fieldId)) add("duplicate-identifier", "invariant", `${fieldPath}.id`, `Identifier '${fieldId}' is duplicated.`, fieldContext);
    else seenIds.add(fieldId);
    if (!isNonEmptyString(field.key)) add("missing-field", "structure", `${fieldPath}.key`, "Custom field key must be a non-empty string.", fieldContext);
    if (!isNonEmptyString(field.label)) add("missing-field", "structure", `${fieldPath}.label`, "Custom field label must be a non-empty string.", fieldContext);
    if (!isRecord(field.value) || typeof field.value.type !== "string") {
      add("invalid-custom-field", "structure", `${fieldPath}.value`, "Custom field value must use a supported discriminated shape.", fieldContext);
      return;
    }
    const payload = field.value.value;
    switch (field.value.type) {
      case "text":
      case "phone":
        if (typeof payload !== "string") add("invalid-custom-field", "structure", `${fieldPath}.value.value`, "Value must be a string.", fieldContext);
        break;
      case "number":
        if (typeof payload !== "number" || !Number.isFinite(payload)) add("invalid-custom-field", "structure", `${fieldPath}.value.value`, "Value must be a finite number.", fieldContext);
        break;
      case "boolean":
        if (typeof payload !== "boolean") add("invalid-custom-field", "structure", `${fieldPath}.value.value`, "Value must be a boolean.", fieldContext);
        break;
      case "date":
        if (!isValidPartialDate(payload)) add("invalid-custom-field", "format", `${fieldPath}.value.value`, "Value must be a valid partial date.", fieldContext);
        break;
      case "url":
        if (typeof payload !== "string" || !isValidUrl(payload)) add("invalid-url", "format", `${fieldPath}.value.value`, "Value must be an absolute HTTP or HTTPS URL.", fieldContext);
        break;
      case "email":
        if (typeof payload !== "string" || !isValidEmail(payload)) add("invalid-email", "format", `${fieldPath}.value.value`, "Value must be a valid email address.", fieldContext);
        break;
      case "text-list":
        if (!Array.isArray(payload) || !payload.every(item => typeof item === "string")) add("invalid-custom-field", "structure", `${fieldPath}.value.value`, "Value must be an array of strings.", fieldContext);
        break;
      default:
        add("invalid-custom-field", "structure", `${fieldPath}.value.type`, "Custom field value type is not supported.", fieldContext);
    }
  });
}
