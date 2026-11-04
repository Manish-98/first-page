import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CVDocument } from "../../domain/cv/types";
import { A4_CONTENT_HEIGHT, A4_CONTENT_WIDTH, A4_PAGE, calculatePageCount } from "../../application/cv/pagination";
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
      <div className="cv-document-canvas__viewport">
        <div className="cv-document-canvas__pages" data-page-count={pageCount}>
          {Array.from({ length: pageCount }, (_, index) => (
            <div className="cv-document-canvas__page" key={index} aria-hidden="true">
              <div className="cv-document-canvas__page-content" style={{ "--page-offset": index } as CSSProperties}>
                <CVPreview document={document} />
              </div>
              <span className="cv-document-canvas__page-number">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="cv-document-canvas__accessible-content">
        <CVPreview document={document} />
      </div>
      <div className="cv-document-canvas__measure" ref={measureRef} aria-hidden="true" inert>
        <CVPreview document={document} />
      </div>
    </section>
  );
}
