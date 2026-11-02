import AppLink from "./AppLink";
import ContentSection from "./ContentSection";

export default function NotFoundPage() {
  return (
    <ContentSection
      className="welcome not-found"
      labelledBy="not-found-title"
    >
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1 id="not-found-title">This page isn’t here.</h1>
      <p className="intro">
        The address may be incorrect, or this page may not be part of the
        current workspace.
      </p>
      <AppLink className="home-link" variant="action" href="#/">
        Return to the home page
      </AppLink>
    </ContentSection>
  );
}
