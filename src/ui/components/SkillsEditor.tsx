import { useState, type FormEvent } from "react";
import type { CVDocument } from "../../domain/cv/types";
import type { SkillSectionContent } from "../../domain/cv/sections";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { getSkillEntries, removeCVSkill, saveCVSkill } from "../../application/cv/updateCVSkills";

interface Props { document: CVDocument; editingDependencies: CVCreationDependencies; onDocumentChange: (document: CVDocument) => void }
interface Draft { name:string; level:string; category:string; keywords:string }
const emptyDraft:Draft={name:"",level:"",category:"",keywords:""};
const levels:[string,string][]=[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"],["expert","Expert"]];
export default function SkillsEditor({document,editingDependencies,onDocumentChange}:Props){
 const [draft,setDraft]=useState<Draft>(emptyDraft);
 const [editingId,setEditingId]=useState<string|undefined>();
 const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});
 const [formOpen,setFormOpen]=useState(false);
 const entries=getSkillEntries(document);
 function reset(){setDraft(emptyDraft);setEditingId(undefined);setFieldErrors({});setFormOpen(false);}
 function update<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(current=>({...current,[key]:value}));}
 function edit(id:string){const entry=entries.find(item=>item.id===id);if(!entry)return;setDraft({name:entry.content.name,level:entry.content.level??"",category:entry.content.category??"",keywords:entry.content.keywords?.join("\n")??""});setEditingId(id);setFieldErrors({});setFormOpen(true);}
 function save(event:FormEvent<HTMLFormElement>){event.preventDefault();const result=saveCVSkill(document,editingId,{name:draft.name,level:draft.level as SkillSectionContent["level"],category:draft.category,keywords:draft.keywords.split("\n")},editingDependencies);if(!result.ok){setFieldErrors(result.fieldErrors);return;}onDocumentChange(result.document);reset();}
 function remove(id:string){const result=removeCVSkill(document,id,editingDependencies);if(!result.ok){setFieldErrors(result.fieldErrors);return;}onDocumentChange(result.document);if(editingId===id)reset();}
 return <section className="cv-editor__section" aria-labelledby="skills-title">
  <div className="experience-section__heading"><h2 id="skills-title">Skills</h2>{!formOpen&&<button className="button button--secondary" type="button" onClick={()=>{setDraft(emptyDraft);setEditingId(undefined);setFieldErrors({});setFormOpen(true);}}>Add skill</button>}</div>
  {entries.length?<ul className="experience-entry-list">{entries.map(entry=><li className="experience-entry" key={entry.id}><div className="experience-entry__content"><h3>{entry.content.name}</h3>{entry.content.category&&<p className="experience-entry__meta">{entry.content.category}</p>}{entry.content.level&&<p className="experience-entry__period">{entry.content.level[0].toUpperCase()+entry.content.level.slice(1)}</p>}{entry.content.keywords && entry.content.keywords.length > 0 ? <p>{entry.content.keywords.join(" · ")}</p> : null}</div><div className="experience-entry__actions"><button className="text-button" type="button" onClick={()=>edit(entry.id)}>Edit</button><button className="text-button" type="button" aria-label={"Remove "+entry.content.name} onClick={()=>remove(entry.id)}>Remove</button></div></li>)}</ul>:<p className="field-hint">Add skills that reflect your capabilities and strengths.</p>}
  {fieldErrors.form&&<p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
  {formOpen&&<form className="experience-form" onSubmit={save} noValidate><h3>{editingId?"Edit skill":"Add skill"}</h3>
   <div className="cv-editor__grid">
    <label className="cv-field"><span>Skill name <span aria-hidden="true">*</span></span><input required value={draft.name} onChange={e=>update("name",e.target.value)} aria-invalid={Boolean(fieldErrors.name)}/>{fieldErrors.name&&<span className="cv-field__error" role="alert">{fieldErrors.name}</span>}</label>
    <label className="cv-field"><span>Level</span><select value={draft.level} onChange={e=>update("level",e.target.value)}><option value="">Not specified</option>{levels.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    <label className="cv-field"><span>Category</span><input value={draft.category} onChange={e=>update("category",e.target.value)}/></label>
   </div>
   <label className="cv-field"><span>Keywords (one per line)</span><textarea rows={3} value={draft.keywords} onChange={e=>update("keywords",e.target.value)} /></label>
   {fieldErrors.form&&<p className="cv-field__error" role="alert">{fieldErrors.form}</p>}
   <div className="experience-form__actions"><button className="button button--primary" type="submit">{editingId?"Save skill":"Add skill"}</button><button className="button button--secondary" type="button" onClick={reset}>Cancel</button></div>
  </form>}
 </section>;
}
