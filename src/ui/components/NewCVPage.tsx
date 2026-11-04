import { useState, type FormEvent } from "react";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { createCV } from "../../application/cv/createCV";
import { setActiveCV } from "../../application/cv/cvSession";
import AppLink from "./AppLink";
import ContentSection from "./ContentSection";

type CreationPath = "blank" | "guided";

interface NewCVPageProps {
  creationDependencies: CVCreationDependencies;
}

export default function NewCVPage({ creationDependencies }: NewCVPageProps) {
  const [path, setPath] = useState<CreationPath | null>(null);
  const [title, setTitle] = useState("");
  const [guidedStep, setGuidedStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");

  function createDocument() {
    const result = createCV(title, creationDependencies);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setActiveCV(result.document);
    window.location.hash = "#/cv";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (path === "guided" && guidedStep === 1) {
      if (!title.trim()) {
        setError("Enter a title for your CV.");
        return;
      }
      setGuidedStep(2);
      return;
    }
    createDocument();
  }

  return (
    <ContentSection className="creation-page" labelledBy="creation-title">
      <p className="eyebrow">START SOMETHING NEW</p>
      <h1 id="creation-title">Create your <em>CV.</em></h1>
      <p className="intro">Choose a starting point. You can add and shape your content as you go.</p>

      {!path ? (
        <div className="creation-options" aria-label="Choose how to start">
          <button className="creation-option" type="button" onClick={() => { setPath("guided"); setError(""); }}>
            <span className="creation-option__icon" aria-hidden="true">✦</span>
            <span className="creation-option__title">Guided setup</span>
            <span className="creation-option__description">A few clear steps to help you get started.</span>
          </button>
          <button className="creation-option" type="button" onClick={() => { setPath("blank"); setError(""); }}>
            <span className="creation-option__icon" aria-hidden="true">＋</span>
            <span className="creation-option__title">Blank CV</span>
            <span className="creation-option__description">Start with an empty document and make it your own.</span>
          </button>
        </div>
      ) : (
        <form className="creation-form" onSubmit={handleSubmit} noValidate>
          <div className="creation-form__topline">
            <p className="creation-form__step">
              {path === "guided" ? `GUIDED SETUP · STEP ${guidedStep} OF 2` : "BLANK CV"}
            </p>
            <button className="text-button" type="button" onClick={() => { setPath(null); setGuidedStep(1); setError(""); }}>
              Change starting point
            </button>
          </div>

          {guidedStep === 1 || path === "blank" ? (
            <>
              <label className="field-label" htmlFor="cv-title">Give your CV a title</label>
              <input
                id="cv-title"
                className="text-field"
                type="text"
                value={title}
                onChange={event => { setTitle(event.target.value); setError(""); }}
                placeholder="e.g. Product Designer CV"
                autoComplete="off"
                maxLength={120}
                required
                aria-describedby={error ? "creation-error" : "title-hint"}
                autoFocus
              />
              <p className="field-hint" id="title-hint">This is a working title for your document. You can change it later.</p>
            </>
          ) : (
            <div className="guided-preview">
              <h2>Your starting checklist</h2>
              <p>Your CV has not been filled in for you. When the content tools are available, you can add:</p>
              <ul>
                <li>Personal details and a professional summary</li>
                <li>Work experience and education</li>
                <li>Skills and any additional sections you need</li>
              </ul>
              <p className="field-hint">Next, we’ll create an empty document ready for your information.</p>
            </div>
          )}

          {error && <p className="form-error" id="creation-error" role="alert">{error}</p>}

          <div className="creation-form__actions">
            <button className="button button--primary" type="submit">
              {path === "guided" && guidedStep === 1 ? "Continue" : "Create CV"}
            </button>
            <button className="button button--secondary" type="button" onClick={() => { setPath(null); setGuidedStep(1); setError(""); }}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <AppLink href="#/" className="back-link">Back to home</AppLink>
    </ContentSection>
  );
}