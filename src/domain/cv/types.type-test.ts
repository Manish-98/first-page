import type {
  CVDocument,
  CVSection,
  CVSectionEntry,
} from "./types";

interface SummaryContent {
  text: string;
}

interface ExperienceContent {
  employer: string;
  role: string;
}

type KnownSection =
  | CVSection<"summary", SummaryContent>
  | CVSection<"experience", ExperienceContent>;

/**
 * Compile-time exhaustiveness check for section discriminants. This fixture
 * ensures future variants require an explicit handling decision.
 */
function assertNever(value: never): never {
  throw new Error(`Unhandled section variant: ${String(value)}`);
}

export function describeKnownSection(section: KnownSection): string {
  switch (section.kind) {
    case "summary":
      return section.entries.map((entry) => entry.content.text).join(" ");
    case "experience":
      return section.entries
        .map((entry) => `${entry.content.role} at ${entry.content.employer}`)
        .join(", ");
    default:
      return assertNever(section);
  }
}

/**
 * The root document must preserve a concrete section union. Narrowing by
 * kind after reading through CVDocument must expose the corresponding payload.
 */
export const typedDocument: CVDocument<KnownSection> = {
  id: "cv-typed",
  metadata: {
    title: "Typed CV",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  content: {
    personalDetails: {},
    sections: [
      {
        id: "summary-1",
        kind: "summary",
        entries: [{ id: "summary-entry-1", content: { text: "Summary" } }],
      },
      {
        id: "experience-1",
        kind: "experience",
        entries: [
          {
            id: "experience-entry-1",
            content: { employer: "Example Ltd", role: "Engineer" },
          },
        ],
      },
    ],
  },
};

export function readTypedDocument(document: CVDocument<KnownSection>): string[] {
  return document.content.sections.map((section) => describeKnownSection(section));
}

export const validDocumentShape = {
  id: "cv-1",
  metadata: {
    title: "Professional CV",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  content: {
    personalDetails: {
      name: { givenName: "Alex", familyName: "Example" },
      contact: { email: "alex@example.test" },
    },
    sections: [
      {
        id: "section-1",
        kind: "summary",
        entries: [
          {
            id: "entry-1",
            content: { text: "A concise professional summary." },
          },
        ],
      },
    ],
  },
} satisfies CVDocument;

export const validEntryIdentity: CVSectionEntry<{ text: string }> = {
  id: "entry-2",
  content: { text: "A section entry with a stable identifier." },
};

// @ts-expect-error Document identifiers are required.
export const invalidDocumentShape: CVDocument = {
  metadata: {
    title: "Invalid",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  content: {
    personalDetails: {},
    sections: [],
  },
};
