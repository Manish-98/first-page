import type { CVDocument, CVSection } from "./types";
import {
  withCVDesign,
  type CVDesignConfiguration,
  type CVDesignedDocument,
} from "./presentation";

type SummarySection = CVSection<"summary", { text: string }>;

const factualDocument: CVDocument<SummarySection> = {
  id: "cv-presentation-fixture",
  metadata: {
    title: "Independent CV",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  content: {
    personalDetails: {
      name: { givenName: "Alex", familyName: "Example" },
    },
    sections: [
      {
        id: "summary-1",
        kind: "summary",
        entries: [{ id: "summary-entry-1", content: { text: "Factual summary." } }],
      },
    ],
  },
};

const printDesign: CVDesignConfiguration = {
  id: "print",
  name: "Print",
  presentation: {
    typography: { fontFamily: "Serif", bodyFontSize: { value: 11, unit: "pt" } },
    colors: { text: "#222222", accent: "#345678" },
    margins: {
      top: { value: 18, unit: "mm" },
      right: { value: 18, unit: "mm" },
      bottom: { value: 18, unit: "mm" },
      left: { value: 18, unit: "mm" },
    },
  },
  layout: { page: { size: "A4", orientation: "portrait" }, columns: 1 },
};

const compactDesign: CVDesignConfiguration = {
  id: "compact",
  name: "Compact",
  presentation: {
    typography: { fontFamily: "Sans-serif", bodyFontSize: { value: 10, unit: "pt" } },
    spacing: { sectionGap: { value: 6, unit: "pt" } },
    alignment: "left",
  },
  layout: {
    page: { size: "Letter", orientation: "portrait" },
    columns: 2,
    sectionPlacements: [{ sectionId: "summary-1", order: 0, column: 1 }],
  },
};

const printDocument: CVDesignedDocument<SummarySection> = {
  document: factualDocument,
  design: printDesign,
};

/** Executable fixture for asserting that design replacement preserves facts. */
export function assertDesignReplacementPreservesFacts(): void {
  const compactDocument = withCVDesign(printDocument, compactDesign);

  if (compactDocument.document !== factualDocument) {
    throw new Error("Replacing a design must retain the factual document reference.");
  }

  if (compactDocument.document.content !== factualDocument.content) {
    throw new Error("Replacing a design must retain the factual CV content reference.");
  }

  if (compactDocument.design !== compactDesign) {
    throw new Error("The replacement design must be applied to the new composition.");
  }
}

/** Both designs can be paired with the same factual document. */
export const sameFactsWithDifferentDesigns = [
  printDocument,
  withCVDesign(printDocument, compactDesign),
] satisfies readonly CVDesignedDocument<SummarySection>[];

// The design composition preserves the concrete section payload type.
export const preservedSummaryText: string =
  sameFactsWithDifferentDesigns[1].document.content.sections[0].entries[0].content.text;

export const invalidContentWithLayout: CVDocument<SummarySection> = {
  ...factualDocument,
  content: {
    ...factualDocument.content,
    // @ts-expect-error Layout configuration cannot be stored as factual CV content.
    layout: compactDesign.layout,
  },
};

// @ts-expect-error Presentation settings are required by a design configuration.
export const invalidDesign: CVDesignConfiguration = {
  layout: { page: { size: "A4" }, columns: 1 },
};
