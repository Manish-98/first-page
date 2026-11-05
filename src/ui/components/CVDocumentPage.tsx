import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import type { PersonalDetails, ProfileLink } from "../../domain/cv/types";
import { updateCVPersonalDetails } from "../../application/cv/updateCVPersonalDetails";
import { updateCVSummary } from "../../application/cv/updateCVSummary";
import { setActiveCV } from "../../application/cv/cvSession";
import { useActiveCV } from "../hooks/useActiveCV";
import AppLink from "./AppLink";
import ContentSection from "./ContentSection";
import CVDocumentCanvas from "./CVDocumentCanvas";
import ExperienceEditor from "./ExperienceEditor";
import EducationEditor from "./EducationEditor";
import SkillsEditor from "./SkillsEditor";
import AdditionalStandardSectionsEditor from "./AdditionalStandardSectionsEditor";
import CVSectionManager from "./CVSectionManager";
import CustomSectionsEditor from "./CustomSectionsEditor";
import CVEditorHeader from "./CVEditorHeader";
import CVEditorWorkspace from "./CVEditorWorkspace";
import type { CVSelection } from "./cvSelection";
import { getSectionLabel } from "./cvSelection";

interface Props { editingDependencies: CVCreationDependencies }
const emptyDetails: PersonalDetails = {};

export default function CVDocumentPage({ editingDependencies }: Props) {
  const document = useActiveCV();
  const [details, setDetails] = useState<PersonalDetails>(emptyDetails);
  const [summary, setSummary] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [summaryError, setSummaryError] = useState("");
  const [selection, setSelection] = useState<CVSelection>(null);
  const previousDocumentId = useRef<string | null>(null);
  const lastSavedForm = useRef<"details" | "summary" | "section" | null>(null);

  useEffect(() => {
    window.document.body.classList.add("cv-editor-active");
    return () => window.document.body.classList.remove("cv-editor-active");
  }, []);

  useEffect(() => {
    if (!document) {
      setSelection(null);
      previousDocumentId.current = null;
      return;
    }
    if (previousDocumentId.current !== document.id) {
      previousDocumentId.current = document.id;
      setSelection(null);
      return;
    }
    if (selection?.type === "section" && !document.content.sections.some(section => section.id === selection.sectionId)) {
      setSelection(null);
    }
  }, [document, selection]);

  useEffect(() => {
    if (!document) return;
    if (lastSavedForm.current !== "summary" && lastSavedForm.current !== "section") setDetails(document.content.personalDetails);
    const entry = document.content.sections.find(section => section.kind === "summary")?.entries[0];
    const text = entry?.content && typeof entry.content === "object" && "text" in entry.content
      ? String(entry.content.text) : "";
    if (lastSavedForm.current !== "details" && lastSavedForm.current !== "section") setSummary(text);
    lastSavedForm.current = null;
  }, [document]);

  if (!document) {
    return (
      <div className="cv-editor-route">
        <CVEditorHeader />
        <ContentSection className="creation-page" labelledBy="missing-cv-title">
        <p className="eyebrow">NO ACTIVE DOCUMENT</p>
        <h1 id="missing-cv-title">Your CV isn’t <em>open.</em></h1>
        <p className="intro">This document is held only in the current app session. Start a new CV to continue.</p>
        <AppLink href="#/new-cv" variant="action">Create a CV</AppLink>
        </ContentSection>
      </div>
    );
  }

  const activeDocument = document;

  const setName = (key: keyof NonNullable<PersonalDetails["name"]>, value: string) =>
    setDetails(current => ({ ...current, name: { ...current.name, [key]: value } }));
  const setContact = (key: "email" | "phone" | "website", value: string) =>
    setDetails(current => ({ ...current, contact: { ...current.contact, [key]: value } }));
  const setAddress = (key: keyof NonNullable<NonNullable<PersonalDetails["contact"]>["address"]>, value: string) =>
    setDetails(current => ({ ...current, contact: { ...current.contact, address: { ...current.contact?.address, [key]: value } } }));
  const profiles = details.contact?.profiles ?? [];
  const setProfile = (index: number, key: keyof ProfileLink, value: string) =>
    setDetails(current => ({
      ...current,
      contact: {
        ...current.contact,
        profiles: (current.contact?.profiles ?? []).map((profile, i) => i === index ? { ...profile, [key]: value } : profile),
      },
    }));

  function saveSectionDocument(updatedDocument: typeof activeDocument) {
    const hadSummarySection = activeDocument.content.sections.some(section => section.kind === "summary");
    const hasSummarySection = updatedDocument.content.sections.some(section => section.kind === "summary");
    if (hadSummarySection && !hasSummarySection) {
      setSummary("");
      setSummaryError("");
    }
    lastSavedForm.current = "section";
    setActiveCV(updatedDocument);
  }

  function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = updateCVPersonalDetails(activeDocument, details, editingDependencies);
    if (!result.ok) { setFieldErrors(result.fieldErrors); return; }
    setFieldErrors({});
    lastSavedForm.current = "details";
    setActiveCV(result.document);
  }
  function saveSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = updateCVSummary(activeDocument, summary, editingDependencies);
    if (!result.ok) { setSummaryError(result.message); return; }
    setSummaryError("");
    lastSavedForm.current = "summary";
    setActiveCV(result.document);
  }

  const field = (label: string, value: string | undefined, onChange: (value: string) => void, key: string, type = "text") => (
    <label className="cv-field" key={key}>
      <span>{label}</span>
      <input type={type} value={value ?? ""} onChange={event => onChange(event.target.value)}
        aria-invalid={Boolean(fieldErrors[key])} aria-describedby={fieldErrors[key] ? `error-${key}` : undefined} />
      {fieldErrors[key] && <span className="cv-field__error" id={`error-${key}`} role="alert">{fieldErrors[key]}</span>}
    </label>
  );

  return (
    <div className="cv-editor-route">
      <CVEditorHeader />
      <CVEditorWorkspace
        title={document.metadata.title}
        leftPanel={(
          <div className="cv-editor__forms">
          <section className="cv-editor__section" aria-labelledby="personal-details-title">
            <h2 id="personal-details-title">Personal details</h2>
            <form onSubmit={saveDetails} noValidate>
              <div className="cv-editor__grid">
                {field("Given name", details.name?.givenName, value => setName("givenName", value), "name.givenName")}
                {field("Additional name", details.name?.additionalName, value => setName("additionalName", value), "name.additionalName")}
                {field("Family name", details.name?.familyName, value => setName("familyName", value), "name.familyName")}
                {field("Name prefix", details.name?.prefix, value => setName("prefix", value), "name.prefix")}
                {field("Name suffix", details.name?.suffix, value => setName("suffix", value), "name.suffix")}
                {field("Professional headline", details.headline, value => setDetails(current => ({ ...current, headline: value })), "headline")}
                {field("Email", details.contact?.email, value => setContact("email", value), "contact.email", "email")}
                {field("Phone", details.contact?.phone, value => setContact("phone", value), "contact.phone", "tel")}
                {field("Website", details.contact?.website, value => setContact("website", value), "contact.website", "url")}
                {field("Address line 1", details.contact?.address?.addressLine1, value => setAddress("addressLine1", value), "contact.address.addressLine1")}
                {field("Address line 2", details.contact?.address?.addressLine2, value => setAddress("addressLine2", value), "contact.address.addressLine2")}
                {field("City / locality", details.contact?.address?.locality, value => setAddress("locality", value), "contact.address.locality")}
                {field("State / region", details.contact?.address?.region, value => setAddress("region", value), "contact.address.region")}
                {field("Postal code", details.contact?.address?.postalCode, value => setAddress("postalCode", value), "contact.address.postalCode")}
                {field("Country", details.contact?.address?.country, value => setAddress("country", value), "contact.address.country")}
              </div>
              <fieldset className="cv-profiles">
                <legend>Profile links</legend>
                {profiles.map((profile, index) => (
                  <div className="cv-profile-row" key={index}>
                    <label className="cv-field"><span>Label</span><input value={profile.label} onChange={event => setProfile(index, "label", event.target.value)} /></label>
                    <label className="cv-field"><span>URL</span><input type="url" value={profile.url} onChange={event => setProfile(index, "url", event.target.value)} aria-invalid={Boolean(fieldErrors[`contact.profiles[${index}].url`])} /></label>
                    <button className="text-button" type="button" onClick={() => setDetails(current => ({ ...current, contact: { ...current.contact, profiles: (current.contact?.profiles ?? []).filter((_, i) => i !== index) } }))}>Remove</button>
                    {fieldErrors[`contact.profiles[${index}].label`] && <p role="alert" className="cv-field__error">{fieldErrors[`contact.profiles[${index}].label`]}</p>}
                    {fieldErrors[`contact.profiles[${index}].url`] && <p role="alert" className="cv-field__error">{fieldErrors[`contact.profiles[${index}].url`]}</p>}
                  </div>
                ))}
                <button className="text-button" type="button" onClick={() => setDetails(current => ({ ...current, contact: { ...current.contact, profiles: [...(current.contact?.profiles ?? []), { label: "", url: "" }] } }))}>Add profile link</button>
              </fieldset>
              {fieldErrors.form && <p role="alert" className="cv-field__error">{fieldErrors.form}</p>}
              <button className="button button--primary" type="submit">Save personal details</button>
            </form>
          </section>

          <section className="cv-editor__section" aria-labelledby="summary-title">
            <h2 id="summary-title">Professional summary</h2>
            <form onSubmit={saveSummary}>
              <label className="cv-field"><span>Summary</span>
                <textarea rows={6} value={summary} onChange={event => setSummary(event.target.value)} placeholder="Write a concise overview of your experience, strengths and goals." />
              </label>
              {summaryError && <p role="alert" className="cv-field__error">{summaryError}</p>}
              <button className="button button--primary" type="submit">Save summary</button>
            </form>
          </section>
          <CVSectionManager document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <CustomSectionsEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <ExperienceEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <EducationEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <SkillsEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <AdditionalStandardSectionsEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
            <p className="field-hint">This CV is held in memory for this app session only. It is not saved when you refresh or close the page.</p>
          </div>
        )}
        rightPanel={(
          selection === null ? (
            <div className="editor-properties-empty">
              <span className="editor-properties-empty__mark" aria-hidden="true">✦</span>
              <h3>Nothing selected</h3>
              <p>Select a section or personal details on the document to inspect it here.</p>
            </div>
          ) : selection.type === "personal-details" ? (
            <section className="editor-selection-details" aria-live="polite">
              <p className="eyebrow">SELECTED ELEMENT</p>
              <h3>Personal details</h3>
              <p>Document identity and contact information</p>
              <dl>
                <div><dt>Name</dt><dd>{[activeDocument.content.personalDetails.name?.givenName, activeDocument.content.personalDetails.name?.familyName].filter(Boolean).join(" ") || "Not provided"}</dd></div>
                <div><dt>Headline</dt><dd>{activeDocument.content.personalDetails.headline || "Not provided"}</dd></div>
                <div><dt>Contact fields</dt><dd>{[activeDocument.content.personalDetails.contact?.email, activeDocument.content.personalDetails.contact?.phone, activeDocument.content.personalDetails.contact?.website].filter(Boolean).length}</dd></div>
              </dl>
            </section>
          ) : (() => {
            const sectionIndex = activeDocument.content.sections.findIndex(section => section.id === selection.sectionId);
            const selectedSection = activeDocument.content.sections[sectionIndex];
            return selectedSection ? (
              <section className="editor-selection-details" aria-live="polite">
                <p className="eyebrow">SELECTED ELEMENT</p>
                <h3>{getSectionLabel(selectedSection)}</h3>
                <p>CV section</p>
                <dl>
                  <div><dt>Type</dt><dd>{selectedSection.kind}</dd></div>
                  <div><dt>Entries</dt><dd>{selectedSection.entries.length}</dd></div>
                  <div><dt>Position</dt><dd>{sectionIndex + 1} of {activeDocument.content.sections.length}</dd></div>
                </dl>
              </section>
            ) : null;
          })()
        )}
      >
        <CVDocumentCanvas document={activeDocument} selection={selection} onSelectionChange={setSelection} />
      </CVEditorWorkspace>
    </div>
  );
}
