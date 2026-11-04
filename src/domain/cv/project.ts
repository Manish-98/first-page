import type { CVDesignedDocument, CVDesignConfiguration, CVMeasurement } from "./presentation";
import type { CVValidationIssueCode } from "./validation";
import { validateCVDocument } from "./validation";

export const CV_PROJECT_FORMAT = "first-page-cv-project" as const;
export const CV_PROJECT_SCHEMA_VERSION = 1 as const;

/**
 * Portable project data contains factual CV content and its associated design.
 * Credentials and application/runtime state are deliberately outside this contract.
 */
export interface CVProject {
  readonly format: typeof CV_PROJECT_FORMAT;
  readonly schemaVersion: typeof CV_PROJECT_SCHEMA_VERSION;
  readonly document: CVDesignedDocument["document"];
  readonly design: CVDesignConfiguration;
}

export type CVProjectIssueCode =
  | "invalid-project"
  | "invalid-format"
  | "invalid-schema-version"
  | "unsupported-schema-version"
  | "invalid-document"
  | "invalid-design"
  | "invalid-measurement"
  | "invalid-layout"
  | "invalid-section-placement"
  | "sensitive-data"
  | "invalid-json"
  | "serialization-failed"
  | `cv-${CVValidationIssueCode}`;

export type CVProjectIssueCategory =
  | "structure"
  | "format"
  | "compatibility"
  | "invariant"
  | "security";

export interface CVProjectIssue {
  readonly code: CVProjectIssueCode;
  readonly category: CVProjectIssueCategory;
  readonly path: string;
  readonly message: string;
}

export interface CVProjectValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CVProjectIssue[];
}

export type CVProjectSerializationResult =
  | { readonly ok: true; readonly json: string }
  | { readonly ok: false; readonly issues: readonly CVProjectIssue[] };

export type CVProjectDeserializationResult =
  | { readonly ok: true; readonly project: CVProject }
  | { readonly ok: false; readonly issues: readonly CVProjectIssue[] };

type UnknownRecord = Record<string, unknown>;
type IssueAdder = (
  code: CVProjectIssueCode,
  category: CVProjectIssueCategory,
  path: string,
  message: string,
) => void;

const pageSizes = ["A3", "A4", "A5", "Letter", "Legal", "custom"] as const;
const orientations = ["portrait", "landscape"] as const;
const alignments = ["left", "center", "right", "justify"] as const;
const measurementUnits = ["pt", "mm", "in"] as const;
const sensitiveKeyPattern = /(?:^|[-_])(?:api[-_]?key|private[-_]?key|access[-_]?token|refresh[-_]?token|id[-_]?token|bearer[-_]?token|token|authorization|auth|authentication|client[-_]?secret|secret|password|credentials|session|runtime[-_]?state|transient[-_]?state|cache)(?:$|[-_])/i;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFinitePositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function validateMeasurement(
  value: unknown,
  path: string,
  add: IssueAdder,
): value is CVMeasurement {
  if (!isRecord(value) || !isFinitePositiveNumber(value.value) ||
      typeof value.unit !== "string" ||
      !(measurementUnits as readonly string[]).includes(value.unit)) {
    add("invalid-measurement", "format", path, "Measurement must have a finite positive value and a supported unit (pt, mm, or in).");
    return false;
  }
  return true;
}

function validateOptionalMeasurement(
  record: UnknownRecord,
  key: string,
  path: string,
  add: IssueAdder,
): void {
  if (key in record) validateMeasurement(record[key], `${path}.${key}`, add);
}

function validateDesign(value: unknown, documentSectionIds: ReadonlySet<string>, add: IssueAdder): void {
  if (!isRecord(value)) {
    add("invalid-design", "structure", "$.design", "Design configuration must be an object.");
    return;
  }

  if ("id" in value && typeof value.id !== "string") {
    add("invalid-design", "structure", "$.design.id", "Design ID must be a string when provided.");
  }
  if ("name" in value && typeof value.name !== "string") {
    add("invalid-design", "structure", "$.design.name", "Design name must be a string when provided.");
  }

  const presentation = value.presentation;
  if (!isRecord(presentation)) {
    add("invalid-design", "structure", "$.design.presentation", "Presentation settings must be an object.");
  } else {
    if ("alignment" in presentation &&
        (typeof presentation.alignment !== "string" ||
          !(alignments as readonly string[]).includes(presentation.alignment))) {
      add("invalid-design", "format", "$.design.presentation.alignment", "Alignment must be left, center, right, or justify.");
    }

    if ("typography" in presentation) {
      const typography = presentation.typography;
      if (!isRecord(typography)) {
        add("invalid-design", "structure", "$.design.presentation.typography", "Typography settings must be an object.");
      } else {
        if ("fontFamily" in typography && typeof typography.fontFamily !== "string") {
          add("invalid-design", "structure", "$.design.presentation.typography.fontFamily", "Font family must be a string.");
        }
        validateOptionalMeasurement(typography, "bodyFontSize", "$.design.presentation.typography", add);
        for (const key of ["headingScale", "lineHeight", "bodyFontWeight", "headingFontWeight"] as const) {
          if (key in typography && !isFinitePositiveNumber(typography[key])) {
            add("invalid-design", "format", `$.design.presentation.typography.${key}`, "Typography values must be finite positive numbers.");
          }
        }
      }
    }

    if ("colors" in presentation) {
      const colors = presentation.colors;
      if (!isRecord(colors)) {
        add("invalid-design", "structure", "$.design.presentation.colors", "Color palette must be an object.");
      } else {
        for (const key of ["text", "mutedText", "accent", "background", "surface", "border"] as const) {
          if (key in colors && typeof colors[key] !== "string") {
            add("invalid-design", "structure", `$.design.presentation.colors.${key}`, "Color values must be strings.");
          }
        }
      }
    }

    if ("spacing" in presentation) {
      const spacing = presentation.spacing;
      if (!isRecord(spacing)) {
        add("invalid-design", "structure", "$.design.presentation.spacing", "Spacing settings must be an object.");
      } else {
        for (const key of ["sectionGap", "entryGap", "paragraphGap"] as const) {
          validateOptionalMeasurement(spacing, key, "$.design.presentation.spacing", add);
        }
      }
    }

    if ("margins" in presentation) {
      const margins = presentation.margins;
      if (!isRecord(margins)) {
        add("invalid-design", "structure", "$.design.presentation.margins", "Margins must be an object.");
      } else {
        for (const key of ["top", "right", "bottom", "left"] as const) {
          if (!(key in margins)) add("invalid-design", "structure", `$.design.presentation.margins.${key}`, "Margin measurement is required.");
          else validateMeasurement(margins[key], `$.design.presentation.margins.${key}`, add);
        }
      }
    }
  }

  const layout = value.layout;
  if (!isRecord(layout)) {
    add("invalid-layout", "structure", "$.design.layout", "Layout configuration must be an object.");
    return;
  }

  if (layout.columns !== 1 && layout.columns !== 2 && layout.columns !== 3) {
    add("invalid-layout", "format", "$.design.layout.columns", "Column count must be 1, 2, or 3.");
  }
  validateOptionalMeasurement(layout, "columnGap", "$.design.layout", add);

  const page = layout.page;
  if (!isRecord(page)) {
    add("invalid-layout", "structure", "$.design.layout.page", "Page configuration must be an object.");
  } else {
    if (typeof page.size !== "string" || !(pageSizes as readonly string[]).includes(page.size)) {
      add("invalid-layout", "format", "$.design.layout.page.size", "Page size is not supported.");
    }
    if ("orientation" in page &&
        (typeof page.orientation !== "string" ||
          !(orientations as readonly string[]).includes(page.orientation))) {
      add("invalid-layout", "format", "$.design.layout.page.orientation", "Page orientation must be portrait or landscape.");
    }
    validateOptionalMeasurement(page, "customWidth", "$.design.layout.page", add);
    validateOptionalMeasurement(page, "customHeight", "$.design.layout.page", add);
    if (page.size === "custom") {
      if (!("customWidth" in page)) add("invalid-layout", "structure", "$.design.layout.page.customWidth", "Custom page size requires a width.");
      if (!("customHeight" in page)) add("invalid-layout", "structure", "$.design.layout.page.customHeight", "Custom page size requires a height.");
    }
  }

  if ("sectionPlacements" in layout) {
    if (!Array.isArray(layout.sectionPlacements)) {
      add("invalid-section-placement", "structure", "$.design.layout.sectionPlacements", "Section placements must be an array.");
    } else {
      const placedIds = new Set<string>();
      const orders = new Set<number>();
      layout.sectionPlacements.forEach((placement, index) => {
        const path = `$.design.layout.sectionPlacements[${index}]`;
        if (!isRecord(placement)) {
          add("invalid-section-placement", "structure", path, "Section placement must be an object.");
          return;
        }
        if (!isNonEmptyString(placement.sectionId)) {
          add("invalid-section-placement", "structure", `${path}.sectionId`, "Section ID must be a non-empty string.");
        } else {
          if (!documentSectionIds.has(placement.sectionId)) {
            add("invalid-section-placement", "invariant", `${path}.sectionId`, "Placement references a section that does not exist in the document.");
          }
          if (placedIds.has(placement.sectionId)) {
            add("invalid-section-placement", "invariant", `${path}.sectionId`, "A section may have only one placement.");
          }
          placedIds.add(placement.sectionId);
        }
        if (typeof placement.order !== "number" || !Number.isInteger(placement.order) || placement.order < 0) {
          add("invalid-section-placement", "format", `${path}.order`, "Placement order must be a non-negative integer.");
        } else {
          if (orders.has(placement.order)) add("invalid-section-placement", "invariant", `${path}.order`, "Placement order values must be unique.");
          orders.add(placement.order);
        }
        if ("column" in placement &&
            (typeof placement.column !== "number" || !Number.isInteger(placement.column) ||
              placement.column < 1 || typeof layout.columns !== "number" || placement.column > layout.columns)) {
          add("invalid-section-placement", "format", `${path}.column`, "Placement column must be within the configured column count.");
        }
      });
    }
  }
}

/** Reject secret-like fields anywhere in portable data, including extension payloads. */
function findSensitiveFields(value: unknown, add: IssueAdder): void {
  const active = new WeakSet<object>();

  const visit = (current: unknown, path: string): void => {
    if (current === undefined || typeof current === "function" ||
        typeof current === "symbol" || typeof current === "bigint" ||
        (typeof current === "number" && !Number.isFinite(current))) {
      add("serialization-failed", "format", path, "Project values must be losslessly representable in JSON.");
      return;
    }
    if (typeof current !== "object" || current === null) return;
    if (!Array.isArray(current)) {
      const prototype = Object.getPrototypeOf(current) as unknown;
      if (prototype !== Object.prototype && prototype !== null) {
        add("serialization-failed", "format", path, "Project objects must use plain JSON object values.");
        return;
      }
    }
    if (active.has(current)) {
      add("serialization-failed", "format", path, "Project data must not contain circular references.");
      return;
    }
    active.add(current);
    if (Array.isArray(current)) {
      current.forEach((item, index) => visit(item, `${path}[${index}]`));
    } else {
      for (const [key, child] of Object.entries(current)) {
        const childPath = `${path}.${key}`;
        const normalizedKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/_/g, "-");
        if (sensitiveKeyPattern.test(normalizedKey)) {
          add("sensitive-data", "security", childPath, "Portable project data cannot contain credentials or transient runtime state.");
        } else {
          visit(child, childPath);
        }
      }
    }
    active.delete(current);
  };

  visit(value, "$");
}

/**
 * Validate the complete untrusted project envelope. Future schema versions are
 * rejected before their contents are interpreted using this version's rules.
 */
export function validateCVProject(input: unknown): CVProjectValidationResult {
  const issues: CVProjectIssue[] = [];
  const add: IssueAdder = (code, category, path, message) => {
    issues.push({ code, category, path, message });
  };

  if (!isRecord(input)) {
    add("invalid-project", "structure", "$", "Project data must be an object.");
    return { valid: false, issues };
  }

  if (input.format !== CV_PROJECT_FORMAT) {
    add("invalid-format", "compatibility", "$.format", `Project format must be '${CV_PROJECT_FORMAT}'.`);
  }

  if (typeof input.schemaVersion !== "number" ||
      !Number.isInteger(input.schemaVersion) || input.schemaVersion < 1) {
    add("invalid-schema-version", "structure", "$.schemaVersion", "Schema version must be a positive integer.");
  } else if (input.schemaVersion !== CV_PROJECT_SCHEMA_VERSION) {
    add("unsupported-schema-version", "compatibility", "$.schemaVersion", `Schema version ${input.schemaVersion} is not supported; this application supports version ${CV_PROJECT_SCHEMA_VERSION}.`);
    return { valid: false, issues };
  }

  const sectionIds = new Set<string>();
  if (isRecord(input.document) && isRecord(input.document.content) && Array.isArray(input.document.content.sections)) {
    for (const section of input.document.content.sections) {
      if (isRecord(section) && isNonEmptyString(section.id)) sectionIds.add(section.id);
    }
  }

  if (!("document" in input)) {
    add("invalid-document", "structure", "$.document", "Project document is required.");
  } else {
    const documentResult = validateCVDocument(input.document);
    for (const issue of documentResult.issues) {
      add(`cv-${issue.code}`, issue.category, `$.document${issue.path === "$" ? "" : issue.path.slice(1)}`, issue.message);
    }
  }

  if (!("design" in input)) {
    add("invalid-design", "structure", "$.design", "Project design configuration is required.");
  } else {
    validateDesign(input.design, sectionIds, add);
  }

  findSensitiveFields(input, add);
  return { valid: issues.length === 0, issues };
}

/** Validate and encode a canonical JSON project envelope. */
export function serializeCVProject(project: CVProject): CVProjectSerializationResult {
  const validation = validateCVProject(project);
  if (!validation.valid) return { ok: false, issues: validation.issues };

  try {
    const canonicalProject: CVProject = {
      format: CV_PROJECT_FORMAT,
      schemaVersion: CV_PROJECT_SCHEMA_VERSION,
      document: project.document,
      design: project.design,
    };
    const json = JSON.stringify(canonicalProject, null, 2);
    if (typeof json !== "string") {
      return { ok: false, issues: [{
        code: "serialization-failed",
        category: "format",
        path: "$",
        message: "Project data could not be encoded as JSON.",
      }] };
    }
    return { ok: true, json };
  } catch {
    return { ok: false, issues: [{
      code: "serialization-failed",
      category: "format",
      path: "$",
      message: "Project data could not be encoded as JSON.",
    }] };
  }
}

/** Parse JSON and validate it before exposing project data to domain consumers. */
export function deserializeCVProject(serialized: string): CVProjectDeserializationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    return { ok: false, issues: [{
      code: "invalid-json",
      category: "format",
      path: "$",
      message: "Project file is not valid JSON.",
    }] };
  }

  const validation = validateCVProject(parsed);
  if (!validation.valid) return { ok: false, issues: validation.issues };

  return {
    ok: true,
    project: parsed as CVProject,
  };
}
