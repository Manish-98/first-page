import { useState, type FormEvent } from "react";
import type { CVDocument } from "../../domain/cv/types";
import type { CVPartialDate, ExperienceSectionContent } from "../../domain/cv/sections";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { getExperienceEntries, removeCVExperience, saveCVExperience } from "../../application/cv/updateCVExperience";
import { setActiveCV } from "../../application/cv/cvSession";

interface Props {
  document: CVDocument;
  editingDependencies: CVCreationDependencies;
}
interface ExperienceDraft {
  role: string;
  employer: string;
  location: string;
  employmentType: string;
  startYear: string;
  startMonth: string;
  startDay: string;
  endYear: string;
  endMonth: string;
  endDay: string;
  ongoing: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
}
const emptyDraft: ExperienceDraft = {
  role: "", employer: "", location: "", employmentType: "",
  startYear: "", startMonth: "", startDay: "",
  endYear: "", endMonth: "", endDay: "", ongoing: false,
  description: "", responsibilities: "", achievements: "",
};
const employmentTypes = [
  ["full-time", "Full-time"], ["part-time", "Part-time"], ["contract", "Contract"],
  ["internship", "Internship"], ["freelance", "Freelance"], ["other", "Other"],
] as const;

function dateToDraft(date: CVPartialDate | undefined, part: "start" | "end", draft: ExperienceDraft): ExperienceDraft {
  if (!date) return draft;
  return {
    ...draft,
    [part + "Year"]: String(date.year),
    [part + "Month"]: date.month === undefined ? "" : String(date.month),
    [part + "Day"]: date.day === undefined ? "" : String(date.day),
  };
}
function draftFromContent(content: ExperienceSectionContent): ExperienceDraft {
  let draft = {
    ...emptyDraft,
    role: content.role,
    employer: content.employer,
    location: content.location ?? "",
    employmentType: content.employmentType ?? "",
    ongoing: content.dateRange?.ongoing === true,
    description: content.description ?? "",
    responsibilities: content.responsibilities?.join("\n") ?? "",
    achievements: content.achievements?.join("\n") ?? "",
  };
  draft = dateToDraft(content.dateRange?.startDate, "start", draft);
  return dateToDraft(content.dateRange?.ongoing ? undefined : content.dateRange?.endDate, "end", draft);
}
function partialDate(draft: ExperienceDraft, part: "start" | "end", errors: Record<string, string>): CVPartialDate | undefined {
  const year = draft[part + "Year" as "startYear" | "endYear"].trim();
  const month = draft[part + "Month" as "startMonth" | "endMonth"].trim();
  const day = draft[part + "Day" as "startDay" | "endDay"].trim();
  if (!year && !month && !day) return undefined;
  if (!year) {
    errors["dateRange." + part + "Date"] = "Enter a year when providing a month or day.";
    return undefined;
  }
  if (day && !month) {
    errors["dateRange." + part + "Date"] = "Enter a month when providing a day.";
    return undefined;
  }
  const date: Record<string, number> = { year: Number(year) };
  if (month) date.month = Number(month);
  if (day) date.day = Number(day);
  return date as CVPartialDate;
}

function displayDate(date: CVPartialDate | undefined): string {
  if (!date) return "";
  return [date.day, date.month, date.year].filter(value => value !== undefined).join("/");
}

export default function ExperienceEditor({ document, editingDependencies }: Props) {
  const [draft, setDraft] = useState<ExperienceDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const entries = getExperienceEntries(document);

  function resetForm() {
    setDraft(emptyDraft);
    setEditingId(undefined);
    setFieldErrors({});
    setFormOpen(false);
  }
  function updateDraft<K extends keyof ExperienceDraft>(key: K, value: ExperienceDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  function editEntry(id: string) {
    const entry = entries.find(item => item.id === id);
    if (!entry) return;
    setDraft(draftFromContent(entry.content));
    setEditingId(id);
    setFieldErrors({});
    setFormOpen(true);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: Record<string, string> = {};
    const startDate = partialDate(draft, "start", errors);
    const endDate = draft.ongoing ? undefined : partialDate(draft, "end", errors);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    const employmentType = draft.employmentType as ExperienceSectionContent["employmentType"];
    const result = saveCVExperience(document, editingId, {
      role: draft.role,
      employer: draft.employer,
      location: draft.location,
      ...(employmentType ? { employmentType } : {}),
      ...(draft.ongoing
        ? { dateRange: { ...(startDate ? { startDate } : {}), ongoing: true } }
        : startDate || endDate
          ? { dateRange: { ...(startDate ? { startDate } : {}), ...(endDate ? { endDate } : {}), ongoing: false } }
          : {}),
      description: draft.description,
      responsibilities: draft.responsibilities.split("\n"),
      achievements: draft.achievements.split("\n"),
    }, editingDependencies);
    if (!result.ok) {
      setFieldErrors({ ...errors, ...result.fieldErrors });
      return;
    }
    setActiveCV(result.document);
    resetForm();
  }
  function removeEntry(id: string) {
    const result = removeCVExperience(document, id, editingDependencies);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      return;
    }
    setActiveCV(result.document);
    if (editingId === id) resetForm();
  }
  const entriesList = entries.map(entry => {
    const range = entry.content.dateRange;
    const period = [
      displayDate(range?.startDate),
      range?.ongoing ? "Present" : displayDate(range?.endDate),
    ].filter(Boolean).join(" – ");
    return (
      <li className="experience-entry" key={entry.id}>
        <div className="experience-entry__content">
          <h3>{entry.content.role}</h3>
          <p className="experience-entry__meta">{entry.content.employer}{entry.content.location ? " · " + entry.content.location : ""}</p>
          {period && <p className="experience-entry__period">{period}</p>}
          {entry.content.employmentType && <p className="experience-entry__period">{entry.content.employmentType.replace("-", " ")}</p>}
          {entry.content.description && <p>{entry.content.description}</p>}
          {entry.content.responsibilities?.length ? <ul>{entry.content.responsibilities.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
          {entry.content.achievements?.length ? <ul>{entry.content.achievements.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
        </div>
        <div className="experience-entry__actions">
          <button className="text-button" type="button" onClick={() => editEntry(entry.id)}>Edit</button>
          <button className="text-button" type="button" onClick={() => removeEntry(entry.id)} aria-label={"Remove " + entry.content.role + " at " + entry.content.employer}>Remove</button>
        </div>
      </li>
    );
  });

  const dateField = (label: string, key: "start" | "end", part: "Year" | "Month" | "Day", hint: string) => {
    const fieldKey = key + part as keyof ExperienceDraft;
    const errorKey = "dateRange." + key + "Date";
    return (
      <label className="cv-field experience-date-field">
        <span>{key === "start" ? "Start " : "End "}{label}</span>
        <input type="number" min={1} max={part === "Year" ? 9999 : part === "Month" ? 12 : 31}
          step="1" inputMode="numeric" placeholder={hint} value={draft[fieldKey] as string}
          disabled={key === "end" && draft.ongoing}
          onChange={event => updateDraft(fieldKey, event.target.value as never)}
          aria-invalid={Boolean(fieldErrors[errorKey])}
          aria-describedby={fieldErrors[errorKey] ? errorKey.replace(".", "-") : undefined} />
      </label>
    );
  };

  return (
    <section className="cv-editor__section" aria-labelledby="experience-title">
      <div className="experience-section__heading">
        <h2 id="experience-title">Work experience</h2>
        {!formOpen && <button className="button button--secondary" type="button" onClick={() => { setDraft(emptyDraft); setEditingId(undefined); setFieldErrors({}); setFormOpen(true); }}>Add experience</button>}
      </div>
      {entries.length ? <ul className="experience-entry-list">{entriesList}</ul> : <p className="field-hint">Add roles, employers and the experience you want to highlight.</p>}
      {fieldErrors.form && <p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
      {formOpen && (
        <form className="experience-form" onSubmit={save} noValidate>
          <h3>{editingId ? "Edit experience" : "Add experience"}</h3>
          <div className="cv-editor__grid">
            <label className="cv-field"><span>Job title <span aria-hidden="true">*</span></span>
              <input required value={draft.role} onChange={event => updateDraft("role", event.target.value)} aria-invalid={Boolean(fieldErrors.role)} aria-describedby={fieldErrors.role ? "experience-role-error" : undefined} />
              {fieldErrors.role && <span id="experience-role-error" className="cv-field__error" role="alert">{fieldErrors.role}</span>}
            </label>
            <label className="cv-field"><span>Employer <span aria-hidden="true">*</span></span>
              <input required value={draft.employer} onChange={event => updateDraft("employer", event.target.value)} aria-invalid={Boolean(fieldErrors.employer)} aria-describedby={fieldErrors.employer ? "experience-employer-error" : undefined} />
              {fieldErrors.employer && <span id="experience-employer-error" className="cv-field__error" role="alert">{fieldErrors.employer}</span>}
            </label>
            <label className="cv-field"><span>Location</span><input value={draft.location} onChange={event => updateDraft("location", event.target.value)} /></label>
            <label className="cv-field"><span>Employment type</span>
              <select value={draft.employmentType} onChange={event => updateDraft("employmentType", event.target.value)}>
                <option value="">Select employment type</option>
                {employmentTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <fieldset className="experience-dates">
            <legend>Employment dates</legend>
            <div className="experience-date-grid">
              <div className="experience-date-group">
                <h4>Start date</h4>
                <div className="experience-date-fields">
                  {dateField("Year", "start", "Year", "YYYY")}
                  {dateField("Month (optional)", "start", "Month", "MM")}
                  {dateField("Day (optional)", "start", "Day", "DD")}
                </div>
                {fieldErrors["dateRange.startDate"] && <p className="cv-field__error" id="dateRange-startDate" role="alert">{fieldErrors["dateRange.startDate"]}</p>}
              </div>
              <div className="experience-date-group">
                <h4>End date</h4>
                <div className="experience-date-fields">
                  {dateField("Year", "end", "Year", "YYYY")}
                  {dateField("Month (optional)", "end", "Month", "MM")}
                  {dateField("Day (optional)", "end", "Day", "DD")}
                </div>
                {fieldErrors["dateRange.endDate"] && <p className="cv-field__error" id="dateRange-endDate" role="alert">{fieldErrors["dateRange.endDate"]}</p>}
              </div>
            </div>
            <label className="experience-ongoing"><input type="checkbox" checked={draft.ongoing} onChange={event => updateDraft("ongoing", event.target.checked)} /> I currently work here</label>
            {draft.ongoing && <p className="field-hint">The end date will be omitted and the role will be marked as ongoing.</p>}
          </fieldset>
          <label className="cv-field"><span>Description</span>
            <textarea rows={4} value={draft.description} onChange={event => updateDraft("description", event.target.value)} />
          </label>
          <label className="cv-field"><span>Responsibilities (one per line)</span>
            <textarea rows={4} value={draft.responsibilities} onChange={event => updateDraft("responsibilities", event.target.value)} />
          </label>
          <label className="cv-field"><span>Achievements (one per line)</span>
            <textarea rows={4} value={draft.achievements} onChange={event => updateDraft("achievements", event.target.value)} />
          </label>
          {fieldErrors.form && <p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
          <div className="experience-form__actions">
            <button className="button button--primary" type="submit">{editingId ? "Save experience" : "Add experience"}</button>
            <button className="button button--secondary" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
