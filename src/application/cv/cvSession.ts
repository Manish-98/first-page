import type { CVDocument } from "../../domain/cv/types";

let activeDocument: CVDocument | null = null;
const listeners = new Set<() => void>();

export function getActiveCV(): CVDocument | null {
  return activeDocument;
}

export function setActiveCV(document: CVDocument): void {
  activeDocument = document;
  listeners.forEach(listener => listener());
}

export function clearActiveCV(): void {
  activeDocument = null;
  listeners.forEach(listener => listener());
}

export function subscribeToActiveCV(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
