import AppLink from "./AppLink";
import ContentSection from "./ContentSection";

export default function WelcomePanel() {
  return (
    <ContentSection className="welcome" labelledBy="welcome-title">
      <p className="eyebrow">CV BUILDER</p>
      <h1 id="welcome-title">
        Your experience, <em>beautifully</em> told.
      </h1>
      <p className="intro">
        A focused workspace for shaping your next opportunity. Start with a
        blank CV or take a guided first step.
      </p>
      <AppLink className="home-create-link" variant="action" href="#/new-cv">
        Create your CV
      </AppLink>
    </ContentSection>
  );
}
