import { useState, type FormEvent } from "react";
import type { CVDocument } from "../../domain/cv/types";
import type { CVPartialDate } from "../../domain/cv/sections";
import type { AdditionalStandardSectionKind } from "../../application/cv/updateCVStandardSections";
import type { CVSectionContentMap } from "../../domain/cv/sections";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { getStandardCVEntries, removeStandardCVEntry, saveStandardCVEntry } from "../../application/cv/updateCVStandardSections";

interface Props { document: CVDocument; editingDependencies: CVCreationDependencies; onDocumentChange: (document: CVDocument) => void }
type Draft = Record<string, string | boolean>;
interface FieldDefinition { key: string; label: string; type?: "text" | "textarea" | "url" | "email" | "select" | "list" | "date" | "date-range"; required?: boolean; options?: readonly string[] }
interface SectionDefinition { kind: AdditionalStandardSectionKind; title: string; fields: readonly FieldDefinition[] }

const definitions: readonly SectionDefinition[] = [
  { kind: "projects", title: "Projects", fields: [
    { key: "name", label: "Project name", required: true }, { key: "role", label: "Role" },
    { key: "url", label: "Project URL", type: "url" }, { key: "dateRange", label: "Project dates", type: "date-range" },
    { key: "description", label: "Description", type: "textarea" }, { key: "highlights", label: "Highlights (one per line)", type: "list" },
  ]},
  { kind: "languages", title: "Languages", fields: [
    { key: "language", label: "Language", required: true },
    { key: "proficiency", label: "Proficiency", type: "select", options: ["A1","A2","B1","B2","C1","C2","basic","conversational","professional","fluent","native"] },
  ]},
  { kind: "certifications", title: "Certifications", fields: [
    { key: "name", label: "Certification name", required: true }, { key: "issuer", label: "Issuing organization" },
    { key: "issuedOn", label: "Issue date", type: "date" }, { key: "expiresOn", label: "Expiry date", type: "date" },
    { key: "credentialId", label: "Credential ID" }, { key: "credentialUrl", label: "Credential URL", type: "url" },
  ]},
  { kind: "awards", title: "Awards", fields: [
    { key: "title", label: "Award title", required: true }, { key: "issuer", label: "Issuing organization" },
    { key: "awardedOn", label: "Award date", type: "date" }, { key: "description", label: "Description", type: "textarea" },
  ]},
  { kind: "volunteering", title: "Volunteering", fields: [
    { key: "role", label: "Role", required: true }, { key: "organization", label: "Organization", required: true },
    { key: "dateRange", label: "Volunteering dates", type: "date-range" },
    { key: "description", label: "Description", type: "textarea" }, { key: "highlights", label: "Highlights (one per line)", type: "list" },
  ]},
  { kind: "publications", title: "Publications", fields: [
    { key: "title", label: "Publication title", required: true }, { key: "publisher", label: "Publisher" },
    { key: "publishedOn", label: "Publication date", type: "date" }, { key: "authors", label: "Authors (one per line)", type: "list" },
    { key: "url", label: "Publication URL", type: "url" }, { key: "description", label: "Description", type: "textarea" },
  ]},
  { kind: "interests", title: "Interests", fields: [
    { key: "name", label: "Interest", required: true }, { key: "description", label: "Description", type: "textarea" },
  ]},
  { kind: "references", title: "References", fields: [
    { key: "name", label: "Name", required: true }, { key: "relationship", label: "Relationship" },
    { key: "organization", label: "Organization" }, { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
  ]},
];

function blankDraft(definition: SectionDefinition): Draft {
  const draft: Draft = {};
  for (const field of definition.fields) draft[field.key === "dateRange" ? "startDate" : field.key] = "";
  if (definition.fields.some(field => field.type === "date-range")) {
    draft.endDate = "";
    draft.ongoing = false;
  }
  return draft;
}
function formatDate(date: CVPartialDate | undefined): string {
  if (!date) return "";
  return [date.year, date.month, date.day].filter(value => value !== undefined).join("-");
}
function parseDate(value: string, key: string, errors: Record<string,string>): CVPartialDate | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split("-").map(Number);
  if (parts.length > 3 || parts.some(part => !Number.isInteger(part)) || !parts[0]) {
    errors[key] = "Use YYYY, YYYY-MM or YYYY-MM-DD.";
    return undefined;
  }
  if (parts.length >= 2 && (parts[1] < 1 || parts[1] > 12)) errors[key] = "Month must be between 1 and 12.";
  if (parts.length === 3 && (parts[2] < 1 || parts[2] > 31)) errors[key] = "Day must be between 1 and 31.";
  return { year: parts[0], ...(parts.length >= 2 ? { month: parts[1] } : {}), ...(parts.length === 3 ? { day: parts[2] } : {}) } as CVPartialDate;
}
function draftFromContent(definition: SectionDefinition, content: Record<string, unknown>): Draft {
  const draft = blankDraft(definition);
  for (const field of definition.fields) {
    const value = content[field.key];
    if (field.type === "date") draft[field.key] = formatDate(value as CVPartialDate | undefined);
    else if (field.type === "date-range") {
      const range = value as { startDate?: CVPartialDate; endDate?: CVPartialDate; ongoing?: boolean } | undefined;
      draft.startDate = formatDate(range?.startDate);
      draft.endDate = formatDate(range?.endDate);
      draft.ongoing = range?.ongoing === true;
    } else if (field.type === "list") draft[field.key] = Array.isArray(value) ? value.join("\n") : "";
    else draft[field.key] = typeof value === "string" ? value : "";
  }
  return draft;
}
function buildContent(definition: SectionDefinition, draft: Draft): { content?: Record<string, unknown>; errors: Record<string,string> } {
  const content: Record<string, unknown> = {};
  const errors: Record<string,string> = {};
  for (const field of definition.fields) {
    if (field.type === "date") {
      const date = parseDate(String(draft[field.key] ?? ""), field.key, errors);
      if (date) content[field.key] = date;
    } else if (field.type === "date-range") {
      const start = parseDate(String(draft.startDate ?? ""), "startDate", errors);
      const end = draft.ongoing ? undefined : parseDate(String(draft.endDate ?? ""), "endDate", errors);
      if (start || end || draft.ongoing) content.dateRange = { ...(start ? { startDate: start } : {}), ...(end ? { endDate: end } : {}), ...(draft.ongoing ? { ongoing: true } : { ongoing: false }) };
    } else if (field.type === "list") {
      const values = String(draft[field.key] ?? "").split("\n").map(value => value.trim()).filter(Boolean);
      if (values.length) content[field.key] = values;
    } else {
      const value = String(draft[field.key] ?? "").trim();
      if (field.required && !value) errors[field.key] = `Enter ${field.label.toLowerCase()}.`;
      if (value) content[field.key] = value;
    }
  }
  return { content: Object.keys(errors).length ? undefined : content, errors };
}
function summaryFor(content: Record<string, unknown>): string {
  return Object.entries(content).filter(([,value]) => typeof value === "string" && value.trim())
    .map(([key,value]) => `${key.replace(/[A-Z]/g, letter => " "+letter.toLowerCase())}: ${value}`).join(" · ");
}

export default function AdditionalStandardSectionsEditor({ document, editingDependencies, onDocumentChange }: Props) {
  const [activeKind, setActiveKind] = useState<AdditionalStandardSectionKind | undefined>();
  const [editingId, setEditingId] = useState<string | undefined>();
  const [draft, setDraft] = useState<Draft>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [formError, setFormError] = useState("");
  const definition = definitions.find(item => item.kind === activeKind);
  function openForm(item: SectionDefinition, id?: string, content?: Record<string, unknown>) {
    setActiveKind(item.kind); setEditingId(id); setDraft(content ? draftFromContent(item, content) : blankDraft(item));
    setFieldErrors({}); setFormError("");
  }
  function reset() { setActiveKind(undefined); setEditingId(undefined); setDraft({}); setFieldErrors({}); setFormError(""); }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!definition) return;
    const built = buildContent(definition, draft);
    if (!built.content) { setFieldErrors(built.errors); return; }
    const result = saveStandardCVEntry(document, definition.kind, editingId, built.content as unknown as CVSectionContentMap[typeof definition.kind], editingDependencies);
    if (!result.ok) { setFieldErrors(result.fieldErrors); setFormError(result.fieldErrors.form ?? "Check the highlighted fields."); return; }
    onDocumentChange(result.document); reset();
  }
  function remove(kind: AdditionalStandardSectionKind, id: string) {
    const result = removeStandardCVEntry(document, kind, id, editingDependencies);
    if (!result.ok) { setFormError(result.fieldErrors.form ?? "The entry could not be removed."); return; }
    onDocumentChange(result.document);
    if (activeKind === kind && editingId === id) reset();
  }
  return <div className="additional-sections">
    {definitions.map(item => {
      const entries = getStandardCVEntries(document, item.kind);
      return <section className="cv-editor__section" aria-labelledby={`standard-${item.kind}-title`} key={item.kind}>
        <div className="experience-section__heading"><h2 id={`standard-${item.kind}-title`}>{item.title}</h2>
          {activeKind !== item.kind && <button className="button button--secondary" type="button" onClick={() => openForm(item)}>Add {item.title.toLowerCase().replace(/s$/, "")}</button>}
        </div>
        {entries.length ? <ul className="experience-entry-list">{entries.map(entry => <li className="experience-entry" key={entry.id}>
          <div className="experience-entry__content"><h3>{summaryFor(entry.content as unknown as Record<string,unknown>) || item.title}</h3></div>
          <div className="experience-entry__actions">
            <button className="text-button" type="button" onClick={() => openForm(item, entry.id, entry.content as Record<string,unknown>)}>Edit</button>
            <button className="text-button" type="button" aria-label={`Remove ${item.title.toLowerCase()} entry ${entry.id}`} onClick={() => remove(item.kind, entry.id)}>Remove</button>
          </div>
        </li>)}</ul> : <p className="field-hint">Add {item.title.toLowerCase()} to include them in your CV.</p>}
        {activeKind === item.kind && definition && <form className="experience-form" onSubmit={save} noValidate>
          <h3>{editingId ? `Edit ${item.title.toLowerCase().replace(/s$/, "")}` : `Add ${item.title.toLowerCase().replace(/s$/, "")}`}</h3>
          <div className="cv-editor__grid">{item.fields.map(field => {
            const value = String(draft[field.key] ?? "");
            if (field.type === "date-range") return <fieldset className="experience-dates standard-date-range" key={field.key}>
              <legend>{field.label}</legend>
              <label className="cv-field"><span>Start date (YYYY, YYYY-MM or YYYY-MM-DD)</span><input value={String(draft.startDate ?? "")} onChange={event => setDraft(current => ({...current,startDate:event.target.value}))} aria-invalid={Boolean(fieldErrors.startDate)} /></label>
              <label className="cv-field"><span>End date (optional)</span><input value={String(draft.endDate ?? "")} disabled={Boolean(draft.ongoing)} onChange={event => setDraft(current => ({...current,endDate:event.target.value}))} aria-invalid={Boolean(fieldErrors.endDate)} /></label>
              <label className="experience-ongoing"><input type="checkbox" checked={Boolean(draft.ongoing)} onChange={event => setDraft(current => ({...current,ongoing:event.target.checked,endDate:""}))} /> Ongoing</label>
              {fieldErrors.startDate && <p role="alert" className="cv-field__error">{fieldErrors.startDate}</p>}
              {fieldErrors.endDate && <p role="alert" className="cv-field__error">{fieldErrors.endDate}</p>}
            </fieldset>;
            if (field.type === "date") return <label className="cv-field" key={field.key}><span>{field.label} (YYYY, YYYY-MM or YYYY-MM-DD)</span><input value={value} onChange={event => setDraft(current => ({...current,[field.key]:event.target.value}))} aria-invalid={Boolean(fieldErrors[field.key])} />{fieldErrors[field.key] && <span role="alert" className="cv-field__error">{fieldErrors[field.key]}</span>}</label>;
            if (field.type === "select") return <label className="cv-field" key={field.key}><span>{field.label}</span><select value={value} onChange={event => setDraft(current => ({...current,[field.key]:event.target.value}))}><option value="">Not specified</option>{field.options?.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
            const common = { value, required: Boolean(field.required), "aria-invalid": Boolean(fieldErrors[field.key]) };
            return <label className="cv-field" key={field.key}><span>{field.label}{field.required ? " *" : ""}</span>
              {field.type === "textarea" || field.type === "list" ? <textarea rows={field.type === "list" ? 3 : 4} {...common} onChange={event => setDraft(current => ({...current,[field.key]:event.target.value}))} /> :
                <input type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"} {...common} onChange={event => setDraft(current => ({...current,[field.key]:event.target.value}))} />}
              {fieldErrors[field.key] && <span role="alert" className="cv-field__error">{fieldErrors[field.key]}</span>}
            </label>;
          })}</div>
          {formError && <p role="alert" className="cv-field__error">{formError}</p>}
          <div className="experience-form__actions"><button className="button button--primary" type="submit">{editingId ? "Save changes" : "Add entry"}</button><button className="button button--secondary" type="button" onClick={reset}>Cancel</button></div>
        </form>}
      </section>;
    })}
  </div>;
}
