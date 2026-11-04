import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CVDocument } from "../../domain/cv/types";
import { A4_COLUMN_GAP, A4_CONTENT_HEIGHT, A4_CONTENT_WIDTH, A4_PAGE, calculatePageCount } from "../../application/cv/pagination";
import CVPreview from "./CVPreview";
import "./cv-document-canvas.css";

export default function CVDocumentCanvas({ document }: { document: CVDocument }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    const measure = () => {
      const article = measureRef.current?.querySelector<HTMLElement>(".cv-preview");
      if (!article) return;
      setPageCount(calculatePageCount(article.scrollHeight - A4_PAGE.margin * 2));
    };
    measure();
    const article = measureRef.current?.querySelector(".cv-preview");
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    if (article) observer.observe(article);
    return () => observer.disconnect();
  }, [document]);
  const pageFlowWidth = A4_PAGE.width * pageCount + A4_COLUMN_GAP * (pageCount - 1);
  const style = {
    "--cv-page-width": String(A4_PAGE.width) + "px",
    "--cv-page-height": String(A4_PAGE.height) + "px",
    "--cv-page-margin": String(A4_PAGE.margin) + "px",
    "--cv-content-width": String(A4_CONTENT_WIDTH) + "px",
    "--cv-content-height": String(A4_CONTENT_HEIGHT) + "px",
    "--cv-column-gap": String(A4_COLUMN_GAP) + "px",
    "--cv-page-count": pageCount,
    "--cv-canvas-content-width": String(pageFlowWidth) + "px",
  } as CSSProperties;
  return <section className="cv-document-canvas" aria-label="Paginated CV document" style={style}>
    <div className="cv-document-canvas__heading"><h2>Document</h2>
      <span aria-live="polite">{pageCount} {pageCount === 1 ? "page" : "pages"} · A4 portrait</span>
    </div>
    <div className="cv-document-canvas__viewport">
      <div className="cv-document-canvas__page-flow" data-page-count={pageCount}>
        <CVPreview document={document} />
        {Array.from({ length: pageCount - 1 }, (_, index) => (
          <div className="cv-document-canvas__page-break" key={index} style={{ "--page-number": index + 1 } as CSSProperties} aria-hidden="true" />
        ))}
      </div>
    </div>
    <div className="cv-document-canvas__measure" ref={measureRef} aria-hidden="true" inert><CVPreview document={document} /></div>
  </section>;
}
