import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import type { CVDocument } from "../../domain/cv/types";
import { A4_CONTENT_HEIGHT, A4_CONTENT_WIDTH, A4_PAGE, calculatePageCount } from "../../application/cv/pagination";
import type { CVSelection } from "./cvSelection";
import { getSelectionKey } from "./cvSelection";
import CVPreview from "./CVPreview";
import "./cv-document-canvas.css";

interface Props {
  document: CVDocument;
  selection?: CVSelection;
  onSelectionChange?: (selection: CVSelection) => void;
}

function selectionFromKey(key: string | undefined): CVSelection {
  if (key === "personal-details") return { type: "personal-details" };
  if (key?.startsWith("section:")) return { type: "section", sectionId: key.slice("section:".length) };
  return null;
}

function selectedTarget(event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>): HTMLElement | null {
  const target = event.target;
  return target instanceof Element ? target.closest<HTMLElement>("[data-cv-selection-key]") : null;
}

export default function CVDocumentCanvas({ document, selection = null, onSelectionChange }: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const selectedKey = getSelectionKey(selection);

  useEffect(() => {
    const measure = () => {
      const article = measureRef.current?.querySelector<HTMLElement>(".cv-preview");
      if (article) setPageCount(calculatePageCount(article.scrollHeight));
    };
    measure();
    const article = measureRef.current?.querySelector<HTMLElement>(".cv-preview");
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    if (article) observer.observe(article);
    return () => observer.disconnect();
  }, [document]);

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    const target = selectedTarget(event);
    onSelectionChange?.(selectionFromKey(target?.dataset.cvSelectionKey));
  }

  function handleAccessibleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onSelectionChange?.(null);
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = selectedTarget(event);
    if (!target) return;
    event.preventDefault();
    onSelectionChange?.(selectionFromKey(target.dataset.cvSelectionKey));
  }

  const style = {
    "--cv-page-width": `${A4_PAGE.width}px`,
    "--cv-page-height": `${A4_PAGE.height}px`,
    "--cv-page-margin": `${A4_PAGE.margin}px`,
    "--cv-content-width": `${A4_CONTENT_WIDTH}px`,
    "--cv-content-height": `${A4_CONTENT_HEIGHT}px`,
  } as CSSProperties;

  return (
    <section className="cv-document-canvas" aria-label="Paginated CV document" style={style}>
      <div className="cv-document-canvas__heading">
        <h2>Document</h2>
        <span aria-live="polite">{pageCount} {pageCount === 1 ? "page" : "pages"} · A4 portrait</span>
      </div>
      <div className="cv-document-canvas__viewport" onKeyDown={handleAccessibleKeyDown}>
        <div className="cv-document-canvas__pages" data-page-count={pageCount} onClick={handleCanvasClick}>
          {Array.from({ length: pageCount }, (_, index) => (
            <article className="cv-document-canvas__page" aria-label={`Page ${index + 1} of ${pageCount}`} key={index}>
              <div className="cv-document-canvas__page-content" aria-hidden="true">
                <div className="cv-document-canvas__page-flow" style={{ top: `-${index * A4_CONTENT_HEIGHT}px` }}>
                  <CVPreview document={document} selectedKey={selectedKey} />
                </div>
              </div>
              <span className="cv-document-canvas__page-number">{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="cv-document-canvas__accessible-content" aria-label="CV content for assistive technology"
        onClick={handleCanvasClick}>
        <CVPreview document={document} selectedKey={selectedKey} accessibleSelection />
      </div>
      <div className="cv-document-canvas__measure" ref={measureRef} aria-hidden="true" inert>
        <CVPreview document={document} />
      </div>
    </section>
  );
}
