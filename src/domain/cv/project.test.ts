import { describe, expect, it } from "vitest";
import type { CVProject } from "./project";
import {
  CV_PROJECT_FORMAT,
  CV_PROJECT_SCHEMA_VERSION,
  deserializeCVProject,
  serializeCVProject,
  validateCVProject,
} from "./project";

const validProject = (): CVProject => ({
  format: CV_PROJECT_FORMAT,
  schemaVersion: CV_PROJECT_SCHEMA_VERSION,
  document: {
    id: "cv-project-test",
    metadata: {
      title: "Project round trip",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
    },
    content: {
      personalDetails: {
        name: { givenName: "Alex", familyName: "Example" },
        contact: { email: "alex@example.test" },
      },
      sections: [
        {
          id: "summary-1",
          kind: "summary",
          entries: [{ id: "summary-entry-1", content: { text: "A concise summary." } }],
        },
        {
          id: "certifications-1",
          kind: "certifications",
          entries: [{
            id: "certification-entry-1",
            content: {
              name: "Example certification",
              credentialId: "CERT-123",
              credentialUrl: "https://example.test/certificate",
            },
          }],
        },
        {
          id: "extension-1",
          kind: "vendor.timeline",
          entries: [{ id: "extension-entry-1", content: { arbitrary: ["preserve", 42] } }],
        },
      ],
    },
  },
  design: {
    id: "clean",
    name: "Clean",
    presentation: {
      typography: {
        fontFamily: "Inter",
        bodyFontSize: { value: 10.5, unit: "pt" },
        headingScale: 1.25,
        lineHeight: 1.4,
        bodyFontWeight: 400,
        headingFontWeight: 700,
      },
      colors: { text: "#222222", accent: "#336699" },
      spacing: { sectionGap: { value: 8, unit: "mm" } },
      margins: {
        top: { value: 15, unit: "mm" },
        right: { value: 15, unit: "mm" },
        bottom: { value: 15, unit: "mm" },
        left: { value: 15, unit: "mm" },
      },
      alignment: "left",
    },
    layout: {
      page: { size: "A4", orientation: "portrait" },
      columns: 2,
      columnGap: { value: 6, unit: "mm" },
      sectionPlacements: [
        { sectionId: "summary-1", order: 0, column: 1 },
        { sectionId: "certifications-1", order: 1, column: 2 },
      ],
    },
  },
});

describe("validateCVProject", () => {
  it("accepts a valid versioned project with factual and design data", () => {
    expect(validateCVProject(validProject())).toEqual({ valid: true, issues: [] });
  });

  it("rejects non-object envelopes and incorrect format identifiers", () => {
    expect(validateCVProject(null).issues).toEqual([
      expect.objectContaining({ code: "invalid-project", path: "$" }),
    ]);
    expect(validateCVProject({ ...validProject(), format: "other-format" }).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-format", path: "$.format" }),
      ]),
    );
  });

  it("rejects missing, malformed, older, and future schema versions explicitly", () => {
    const project = validProject();
    const missingVersion = { ...project } as Record<string, unknown>;
    delete missingVersion.schemaVersion;
    expect(validateCVProject(missingVersion).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema-version", path: "$.schemaVersion" }),
      ]),
    );

    expect(validateCVProject({ ...project, schemaVersion: 1.5 }).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema-version" }),
      ]),
    );
    expect(validateCVProject({ ...project, schemaVersion: 0 }).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema-version" }),
      ]),
    );
    expect(validateCVProject({ ...project, schemaVersion: 2 }).issues).toEqual([
      expect.objectContaining({ code: "unsupported-schema-version", path: "$.schemaVersion" }),
    ]);
  });

  it("prefixes CV validation issues with the project document path", () => {
    const project = validProject();
    const invalidDocument = {
      ...project.document,
      metadata: { ...project.document.metadata, title: "" },
    };
    const result = validateCVProject({ ...project, document: invalidDocument });
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "cv-missing-field",
          path: "$.document.metadata.title",
        }),
      ]),
    );
  });

  it("validates measurements and layout configuration", () => {
    const project = validProject();
    const result = validateCVProject({
      ...project,
      design: {
        ...project.design,
        presentation: {
          ...project.design.presentation,
          typography: { bodyFontSize: { value: Number.POSITIVE_INFINITY, unit: "px" } },
        },
        layout: {
          ...project.design.layout,
          sectionPlacements: [{ sectionId: "missing-section", order: -1, column: 3 }],
        },
      },
    });

    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid-measurement", path: "$.design.presentation.typography.bodyFontSize" }),
      expect.objectContaining({ code: "invalid-section-placement", path: "$.design.layout.sectionPlacements[0].sectionId" }),
      expect.objectContaining({ code: "invalid-section-placement", path: "$.design.layout.sectionPlacements[0].order" }),
      expect.objectContaining({ code: "invalid-section-placement", path: "$.design.layout.sectionPlacements[0].column" }),
    ]));
  });

  it("requires dimensions for a custom page size", () => {
    const project = validProject();
    const result = validateCVProject({
      ...project,
      design: {
        ...project.design,
        layout: { ...project.design.layout, page: { size: "custom" } },
      },
    });
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: "$.design.layout.page.customWidth" }),
      expect.objectContaining({ path: "$.design.layout.page.customHeight" }),
    ]));
  });

  it("rejects credentials and transient runtime state, including inside extensions", () => {
    const project = validProject();
    const withSecret = {
      ...project,
      document: {
        ...project.document,
        content: {
          ...project.document.content,
          sections: [
            ...project.document.content.sections,
            {
              id: "unsafe-extension",
              kind: "vendor.extension",
              entries: [{ id: "unsafe-entry", content: { apiKey: "do-not-export" } }],
            },
          ],
        },
      },
    };
    expect(validateCVProject(withSecret).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "sensitive-data",
          category: "security",
          path: "$.document.content.sections[3].entries[0].content.apiKey",
        }),
      ]),
    );
  });

  it("does not mutate the supplied project", () => {
    const project = validProject();
    const before = structuredClone(project);
    expect(validateCVProject(project)).toEqual({ valid: true, issues: [] });
    expect(project).toEqual(before);
  });
});

describe("serializeCVProject and deserializeCVProject", () => {
  it("round-trips CV facts, extension payloads, and presentation/layout settings", () => {
    const project = validProject();
    const serialized = serializeCVProject(project);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) throw new Error("Expected valid project to serialize.");

    const deserialized = deserializeCVProject(serialized.json);
    expect(deserialized).toEqual({ ok: true, project });
  });

  it("does not serialize unrecognized top-level runtime properties", () => {
    const project = {
      ...validProject(),
      debugLabel: "local-only",
    } as CVProject;
    const serialized = serializeCVProject(project);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) throw new Error("Expected valid project to serialize.");
    expect(JSON.parse(serialized.json)).not.toHaveProperty("debugLabel");
  });

  it("rejects sensitive properties during serialization", () => {
    const project = {
      ...validProject(),
      runtimeState: { currentTab: "editor" },
    } as CVProject;
    expect(serializeCVProject(project)).toMatchObject({
      ok: false,
      issues: [expect.objectContaining({ code: "sensitive-data", path: "$.runtimeState" })],
    });
  });

  it("returns a structured error for malformed JSON", () => {
    expect(deserializeCVProject("{not json")).toEqual({
      ok: false,
      issues: [expect.objectContaining({ code: "invalid-json", path: "$" })],
    });
  });

  it("rejects unsupported versions before interpreting their payload", () => {
    const future = JSON.stringify({ ...validProject(), schemaVersion: 99, document: "future-shape" });
    expect(deserializeCVProject(future)).toEqual({
      ok: false,
      issues: [expect.objectContaining({ code: "unsupported-schema-version", path: "$.schemaVersion" })],
    });
  });

  it("does not expose malformed parsed data as a project", () => {
    const invalid = { ...validProject(), design: { presentation: {}, layout: { columns: 5 } } };
    const result = deserializeCVProject(JSON.stringify(invalid));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Invalid project must not be returned.");
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-layout", path: "$.design.layout.columns" }),
      ]),
    );
  });
});
