import { useState, type FormEvent } from "react";
import type { CVDocument } from "../../domain/cv/types";
import type { CVPartialDate, EducationSectionContent } from "../../domain/cv/sections";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { getEducationEntries, removeCVEducation, saveCVEducation } from "../../application/cv/updateCVEducation";

interface Props { document: CVDocument; editingDependencies: CVCreationDependencies; onDocumentChange: (document: CVDocument) => void }
interface Draft {
  institution: string; qualification: string; fieldOfStudy: string; location: string;
  startYear: string; startMonth: string; startDay: string; endYear: string; endMonth: string; endDay: string;
  ongoing: boolean; grade: string; description: string;
}
const emptyDraft: Draft = {
  institution: "", qualification: "", fieldOfStudy: "", location: "",
  startYear: "", startMonth: "", startDay: "", endYear: "", endMonth: "", endDay: "",
  ongoing: false, grade: "", description: "",
};
function toDraftDate(date: CVPartialDate | undefined, prefix: "start" | "end", draft: Draft): Draft {
  if (!date) return draft;
  return { ...draft, [prefix+"Year"]: String(date.year), [prefix+"Month"]: date.month === undefined ? "" : String(date.month), [prefix+"Day"]: date.day === undefined ? "" : String(date.day) };
}
function fromContent(content: EducationSectionContent): Draft {
  let draft = { ...emptyDraft, institution: content.institution, qualification: content.qualification, fieldOfStudy: content.fieldOfStudy ?? "", location: content.location ?? "", ongoing: content.dateRange?.ongoing === true, grade: content.grade ?? "", description: content.description ?? "" };
  draft = toDraftDate(content.dateRange?.startDate, "start", draft);
  return toDraftDate(content.dateRange?.ongoing ? undefined : content.dateRange?.endDate, "end", draft);
}
function parseDate(draft: Draft, prefix: "start" | "end", errors: Record<string,string>): CVPartialDate | undefined {
  const yearKey = prefix === "start" ? "startYear" : "endYear";
  const monthKey = prefix === "start" ? "startMonth" : "endMonth";
  const dayKey = prefix === "start" ? "startDay" : "endDay";
  const year=draft[yearKey].trim(), month=draft[monthKey].trim(), day=draft[dayKey].trim();
  if(!year&&!month&&!day)return undefined;
  if(!year){errors["dateRange."+prefix+"Date"]="Enter a year when providing a month or day.";return undefined;}
  if(day&&!month){errors["dateRange."+prefix+"Date"]="Enter a month when providing a day.";return undefined;}
  const value: Record<string,number>={year:Number(year)};
  if(month)value.month=Number(month);
  if(day)value.day=Number(day);
  return value as CVPartialDate;
}
function showDate(date: CVPartialDate | undefined): string {
  if(!date)return "";
  return [date.day,date.month,date.year].filter(value=>value!==undefined).join("/");
}

export default function EducationEditor({document,editingDependencies,onDocumentChange}:Props){
  const [draft,setDraft]=useState<Draft>(emptyDraft);
  const [editingId,setEditingId]=useState<string|undefined>();
  const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});
  const [formOpen,setFormOpen]=useState(false);
  const entries=getEducationEntries(document);
  function reset(){setDraft(emptyDraft);setEditingId(undefined);setFieldErrors({});setFormOpen(false);}
  function update<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(current=>({...current,[key]:value}));}
  function edit(id:string){const entry=entries.find(item=>item.id===id);if(!entry)return;setDraft(fromContent(entry.content));setEditingId(id);setFieldErrors({});setFormOpen(true);}
  function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const errors:Record<string,string>={};
    const start=parseDate(draft,"start",errors),end=draft.ongoing?undefined:parseDate(draft,"end",errors);
    if(Object.keys(errors).length){setFieldErrors(errors);return;}
    const result=saveCVEducation(document,editingId,{
      institution:draft.institution,qualification:draft.qualification,fieldOfStudy:draft.fieldOfStudy,location:draft.location,
      ...(draft.ongoing?{dateRange:{...(start?{startDate:start}:{}),ongoing:true}}:start||end?{dateRange:{...(start?{startDate:start}:{}),...(end?{endDate:end}:{}),ongoing:false}}:{}),
      grade:draft.grade,description:draft.description,
    },editingDependencies);
    if(!result.ok){setFieldErrors({...errors,...result.fieldErrors});return;}
    onDocumentChange(result.document);reset();
  }
  function remove(id:string){const result=removeCVEducation(document,id,editingDependencies);if(!result.ok){setFieldErrors(result.fieldErrors);return;}onDocumentChange(result.document);if(editingId===id)reset();}
  const dateField=(prefix:"start"|"end",part:"Year"|"Month"|"Day",hint:string)=>{
    const key=(prefix+part) as keyof Draft, errorKey="dateRange."+prefix+"Date";
    return <label className="cv-field education-date-field"><span>{prefix==="start"?"Start ":"End "}{part}{part!=="Year"?" (optional)":""}</span><input type="number" min={1} max={part==="Year"?9999:part==="Month"?12:31} step="1" inputMode="numeric" placeholder={hint} value={draft[key] as string} disabled={prefix==="end"&&draft.ongoing} onChange={event=>update(key,event.target.value as never)} aria-invalid={Boolean(fieldErrors[errorKey])} /></label>;
  };
  return <section className="cv-editor__section" aria-labelledby="education-title">
    <div className="experience-section__heading"><h2 id="education-title">Education</h2>{!formOpen&&<button className="button button--secondary" type="button" onClick={()=>{setDraft(emptyDraft);setEditingId(undefined);setFieldErrors({});setFormOpen(true);}}>Add education</button>}</div>
    {entries.length?<ul className="experience-entry-list">{entries.map(entry=><li className="experience-entry" key={entry.id}>
      <div className="experience-entry__content"><h3>{entry.content.qualification}</h3><p className="experience-entry__meta">{entry.content.institution}{entry.content.fieldOfStudy?" · "+entry.content.fieldOfStudy:""}</p>
        {entry.content.location&&<p>{entry.content.location}</p>}
        {(entry.content.dateRange?.startDate||entry.content.dateRange?.endDate||entry.content.dateRange?.ongoing)&&<p className="experience-entry__period">{[showDate(entry.content.dateRange?.startDate),entry.content.dateRange?.ongoing?"Present":showDate(entry.content.dateRange?.endDate)].filter(Boolean).join(" – ")}</p>}
        {entry.content.grade&&<p>Grade: {entry.content.grade}</p>}{entry.content.description&&<p>{entry.content.description}</p>}
      </div><div className="experience-entry__actions"><button className="text-button" type="button" onClick={()=>edit(entry.id)}>Edit</button><button className="text-button" type="button" aria-label={"Remove "+entry.content.qualification+" at "+entry.content.institution} onClick={()=>remove(entry.id)}>Remove</button></div>
    </li>)}</ul>:<p className="field-hint">Add qualifications, institutions and details of your studies.</p>}
    {fieldErrors.form&&<p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
    {formOpen&&<form className="experience-form" onSubmit={save} noValidate><h3>{editingId?"Edit education":"Add education"}</h3>
      <div className="cv-editor__grid">
        <label className="cv-field"><span>Institution <span aria-hidden="true">*</span></span><input required value={draft.institution} onChange={e=>update("institution",e.target.value)} aria-invalid={Boolean(fieldErrors.institution)}/>{fieldErrors.institution&&<span className="cv-field__error" role="alert">{fieldErrors.institution}</span>}</label>
        <label className="cv-field"><span>Qualification / degree <span aria-hidden="true">*</span></span><input required value={draft.qualification} onChange={e=>update("qualification",e.target.value)} aria-invalid={Boolean(fieldErrors.qualification)}/>{fieldErrors.qualification&&<span className="cv-field__error" role="alert">{fieldErrors.qualification}</span>}</label>
        <label className="cv-field"><span>Field of study</span><input value={draft.fieldOfStudy} onChange={e=>update("fieldOfStudy",e.target.value)}/></label>
        <label className="cv-field"><span>Location</span><input value={draft.location} onChange={e=>update("location",e.target.value)}/></label>
        <label className="cv-field"><span>Grade</span><input value={draft.grade} onChange={e=>update("grade",e.target.value)}/></label>
      </div>
      <fieldset className="experience-dates"><legend>Study dates</legend><div className="experience-date-grid">
        <div className="experience-date-group"><h4>Start date</h4><div className="experience-date-fields">{dateField("start","Year","YYYY")}{dateField("start","Month","MM")}{dateField("start","Day","DD")}</div>{fieldErrors["dateRange.startDate"]&&<p className="cv-field__error" role="alert">{fieldErrors["dateRange.startDate"]}</p>}</div>
        <div className="experience-date-group"><h4>End date</h4><div className="experience-date-fields">{dateField("end","Year","YYYY")}{dateField("end","Month","MM")}{dateField("end","Day","DD")}</div>{fieldErrors["dateRange.endDate"]&&<p className="cv-field__error" role="alert">{fieldErrors["dateRange.endDate"]}</p>}</div>
      </div><label className="experience-ongoing"><input type="checkbox" checked={draft.ongoing} onChange={e=>update("ongoing",e.target.checked)}/> I am currently studying here</label></fieldset>
      <label className="cv-field"><span>Description</span><textarea rows={4} value={draft.description} onChange={e=>update("description",e.target.value)}/></label>
      {fieldErrors.form&&<p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
      <div className="experience-form__actions"><button className="button button--primary" type="submit">{editingId?"Save education":"Add education"}</button><button className="button button--secondary" type="button" onClick={reset}>Cancel</button></div>
    </form>}
  </section>;
}
