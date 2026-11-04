import type { CVDocument, CVSection, CVSectionId } from "./types";

/** Physical measurement units keep design values independent of CSS/renderers. */
export type CVMeasurementUnit = "pt" | "mm" | "in";

export interface CVMeasurement {
  value: number;
  unit: CVMeasurementUnit;
}

export interface CVTypographySettings {
  fontFamily?: string;
  bodyFontSize?: CVMeasurement;
  headingScale?: number;
  lineHeight?: number;
  bodyFontWeight?: number;
  headingFontWeight?: number;
}

export interface CVColorPalette {
  text?: string;
  mutedText?: string;
  accent?: string;
  background?: string;
  surface?: string;
  border?: string;
}

export interface CVSpacingSettings {
  sectionGap?: CVMeasurement;
  entryGap?: CVMeasurement;
  paragraphGap?: CVMeasurement;
}

export type CVTextAlignment = "left" | "center" | "right" | "justify";

/**
 * Visual-only settings. These values never live on CVContent or its factual
 * section payloads, and intentionally contain no renderer-specific objects.
 */
export interface CVPresentationSettings {
  typography?: CVTypographySettings;
  colors?: CVColorPalette;
  spacing?: CVSpacingSettings;
  margins?: {
    top: CVMeasurement;
    right: CVMeasurement;
    bottom: CVMeasurement;
    left: CVMeasurement;
  };
  alignment?: CVTextAlignment;
}

export type CVPageSize = "A3" | "A4" | "A5" | "Letter" | "Legal" | "custom";
export type CVPageOrientation = "portrait" | "landscape";

export interface CVPageConfiguration {
  size: CVPageSize;
  orientation?: CVPageOrientation;
  customWidth?: CVMeasurement;
  customHeight?: CVMeasurement;
}

/**
 * Placement metadata refers to stable factual section IDs but does not
 * reorder or mutate the sections stored in CVContent.
 */
export interface CVSectionPlacement {
  sectionId: CVSectionId;
  order: number;
  column?: 1 | 2 | 3;
}

export interface CVLayoutConfiguration {
  page: CVPageConfiguration;
  columns: 1 | 2 | 3;
  columnGap?: CVMeasurement;
  sectionPlacements?: readonly CVSectionPlacement[];
}

/** A replaceable design bundle, composed independently of CV facts. */
export interface CVDesignConfiguration {
  id?: string;
  name?: string;
  presentation: CVPresentationSettings;
  layout: CVLayoutConfiguration;
}

/**
 * Composition boundary for applying a design to a factual document.
 * The original CVDocument remains independently reusable with other designs.
 */
export interface CVDesignedDocument<TSection extends CVSection = CVSection> {
  document: CVDocument<TSection>;
  design: CVDesignConfiguration;
}

/**
 * Return a new design composition while retaining the exact factual document
 * reference. Neither the document nor its content/sections are modified.
 */
export function withCVDesign<TSection extends CVSection>(
  source: CVDesignedDocument<TSection>,
  design: CVDesignConfiguration,
): CVDesignedDocument<TSection> {
  return { document: source.document, design };
}
