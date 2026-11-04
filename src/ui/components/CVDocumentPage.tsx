import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import type { PersonalDetails, ProfileLink } from "../../domain/cv/types";
import { updateCVPersonalDetails } from "../../application/cv/updateCVPersonalDetails";
import { updateCVSummary } from "../../application/cv/updateCVSummary";
import { setActiveCV } from "../../application/cv/cvSession";
import { useActiveCV } from "../hooks/useActiveCV";
import AppLink from "./AppLink";
import ContentSection from "./ContentSection";
import CVPreview from "./CVPreview";
import ExperienceEditor from "./ExperienceEditor";
import EducationEditor from "./EducationEditor";
import SkillsEditor from "./SkillsEditor";

interface Props { editingDependencies: CVCreationDependencies }
const emptyDetails: PersonalDetails = {};

export default function CVDocumentPage({ editingDependencies }: Props) {
  const document = useActiveCV();
  const [details, setDetails] = useState<PersonalDetails>(emptyDetails);
  const [summary, setSummary] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [summaryError, setSummaryError] = useState("");
  const lastSavedForm = useRef<"details" | "summary" | "section" | null>(null);

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
      <ContentSection className="creation-page" labelledBy="missing-cv-title">
        <p className="eyebrow">NO ACTIVE DOCUMENT</p>
        <h1 id="missing-cv-title">Your CV isn’t <em>open.</em></h1>
        <p className="intro">This document is held only in the current app session. Start a new CV to continue.</p>
        <AppLink href="#/new-cv" variant="action">Create a CV</AppLink>
      </ContentSection>
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
    <ContentSection className="creation-page cv-editor" labelledBy="document-title">
      <p className="eyebrow">YOUR CV · EDIT CONTENT</p>
      <h1 id="document-title">{document.metadata.title}</h1>
      <p className="intro">Add the details you want employers to see. You can leave optional fields blank.</p>

      <div className="cv-editor__layout">
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
          <ExperienceEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <EducationEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
          <SkillsEditor document={activeDocument} editingDependencies={editingDependencies} onDocumentChange={saveSectionDocument} />
        </div>
        <CVPreview document={activeDocument} />
      </div>

      <p className="field-hint">This CV is currently held in memory for this app session only. It is not saved when you refresh or close the page.</p>
      <AppLink href="#/" className="back-link">Back to home</AppLink>
    </ContentSection>
  );
}
