export const A4_PAGE = { width: (210 / 25.4) * 96, height: (297 / 25.4) * 96, margin: (18 / 25.4) * 96 } as const;
export const A4_CONTENT_WIDTH = A4_PAGE.width - A4_PAGE.margin * 2;
export const A4_CONTENT_HEIGHT = A4_PAGE.height - A4_PAGE.margin * 2;
export const A4_COLUMN_GAP = (36 / 25.4) * 96;
export function calculatePageCount(contentHeight: number): number {
  if (!Number.isFinite(contentHeight) || contentHeight <= 0) return 1;
  return Math.max(1, Math.ceil(contentHeight / A4_CONTENT_HEIGHT));
}
