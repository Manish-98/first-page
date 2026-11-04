import { describe, expect, it } from "vitest";
import type { CVDocument, CVSection } from "./types";
import {
  withCVDesign,
  type CVDesignConfiguration,
  type CVDesignedDocument,
} from "./presentation";

type SummarySection = CVSection<"summary", { text: string }>;

const factualDocument: CVDocument<SummarySection> = {
  id: "cv-presentation-unit-test",
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
        entries: [
          {
            id: "summary-entry-1",
            content: { text: "Factual summary." },
          },
        ],
      },
    ],
  },
};

const printDesign: CVDesignConfiguration = {
  id: "print",
  name: "Print",
  presentation: {
    typography: {
      fontFamily: "Serif",
      bodyFontSize: { value: 11, unit: "pt" },
    },
  },
  layout: {
    page: { size: "A4", orientation: "portrait" },
    columns: 1,
  },
};

const compactDesign: CVDesignConfiguration = {
  id: "compact",
  name: "Compact",
  presentation: {
    typography: {
      fontFamily: "Sans-serif",
      bodyFontSize: { value: 10, unit: "pt" },
    },
    spacing: { sectionGap: { value: 6, unit: "pt" } },
  },
  layout: {
    page: { size: "Letter", orientation: "portrait" },
    columns: 2,
    sectionPlacements: [{ sectionId: "summary-1", order: 0, column: 1 }],
  },
};

const printComposition: CVDesignedDocument<SummarySection> = {
  document: factualDocument,
  design: printDesign,
};

describe("withCVDesign", () => {
  it("applies the replacement design while preserving the factual document and content references", () => {
    const compactComposition = withCVDesign(printComposition, compactDesign);

    expect(compactComposition.design).toBe(compactDesign);
    expect(compactComposition.document).toBe(factualDocument);
    expect(compactComposition.document.content).toBe(factualDocument.content);
    expect(compactComposition.document.content.sections[0].entries[0].content.text).toBe(
      "Factual summary.",
    );
  });

  it("does not mutate the source composition when replacing its design", () => {
    const compactComposition = withCVDesign(printComposition, compactDesign);

    expect(compactComposition).not.toBe(printComposition);
    expect(printComposition.design).toBe(printDesign);
    expect(compactComposition.design).toBe(compactDesign);
  });

  it("allows multiple designs to share the same factual document", () => {
    const compactComposition = withCVDesign(printComposition, compactDesign);
    const alternateComposition = withCVDesign(printComposition, {
      ...compactDesign,
      id: "alternate",
      name: "Alternate",
    });

    expect(compactComposition.document).toBe(alternateComposition.document);
    expect(compactComposition.design).not.toBe(alternateComposition.design);
  });
});
