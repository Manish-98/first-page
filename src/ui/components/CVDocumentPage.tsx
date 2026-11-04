import AppLink from "./AppLink";
import ContentSection from "./ContentSection";
import { useActiveCV } from "../hooks/useActiveCV";

export default function CVDocumentPage() {
  const document = useActiveCV();

  if (!document) {
    return (
      <ContentSection className="creation-page" labelledBy="missing-cv-title">
        <p className="eyebrow">NO ACTIVE DOCUMENT</p>
        <h1 id="missing-cv-title">Your CV isn’t <em>open.</em></h1>
        <p className="intro">This document is held only in the current app session. Start a new CV to continue.</p>
        <AppLink href="#/new-cv" variant="action">Create a CV</AppLink>
      </ContentSection>
    );
  }

  return (
    <ContentSection className="creation-page document-empty" labelledBy="document-title">
      <p className="eyebrow">YOUR CV · EMPTY DOCUMENT</p>
      <h1 id="document-title">{document.metadata.title}</h1>
      <p className="intro">Your document is ready. It starts empty so every detail you add is yours.</p>
      <div className="empty-document-panel">
        <span className="empty-document-panel__mark" aria-hidden="true">✦</span>
        <h2>A clear page to begin with.</h2>
        <p>Personal details, your summary, experience, education and skills can be added as the content tools become available.</p>
        <p className="field-hint">This CV currently exists in memory for this app session only. It is not saved when you refresh or close the page.</p>
      </div>
      <AppLink href="#/" className="back-link">Back to home</AppLink>
    </ContentSection>
  );
}
