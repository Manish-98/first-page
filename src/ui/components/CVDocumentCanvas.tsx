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
            <article className="cv-document-canvas__page" aria-label={`Page ${index + 1} of ${pageCount}`} key={index}>
              <div className="cv-document-canvas__page-content" aria-hidden="true">
                <div
                  className="cv-document-canvas__page-flow"
                  style={{ top: `-${index * A4_CONTENT_HEIGHT}px` }}
                >
                  <CVPreview document={document} />
                </div>
              </div>
              <span className="cv-document-canvas__page-number">{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="cv-document-canvas__accessible-content" aria-label="CV content for assistive technology">
        <CVPreview document={document} />
      </div>
      <div className="cv-document-canvas__measure" ref={measureRef} aria-hidden="true" inert>
        <CVPreview document={document} />
      </div>
    </section>
  );
}
