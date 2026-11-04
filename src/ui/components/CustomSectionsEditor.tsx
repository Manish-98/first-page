import { useState, type FormEvent } from "react";
import type { CustomField, CustomFieldValue, CVPartialDate } from "../../domain/cv/sections";
import type { CVDocument } from "../../domain/cv/types";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { addCVCustomField, createCustomCVSection, removeCustomCVSection, removeCVCustomField, renameCustomCVSection, updateCVCustomField } from "../../application/cv/manageCVCustomSections";
interface Props { document:CVDocument; editingDependencies:CVCreationDependencies; onDocumentChange:(document:CVDocument)=>void }
type FieldType=CustomFieldValue["type"];
const types:FieldType[]=["text","number","boolean","date","url","email","phone","text-list"];
function fieldValue(field:CustomField):string {
 switch(field.value.type) {
  case "date": return [field.value.value.year,"month" in field.value.value?String(field.value.value.month).padStart(2,"0"):undefined,"day" in field.value.value?String(field.value.value.day).padStart(2,"0"):undefined].filter(Boolean).join("-");
  case "text-list": return field.value.value.join("\n");
  default: return String(field.value.value);
 }
}
function parseValue(type:FieldType,raw:string):CustomFieldValue|undefined {
 if(type==="boolean") return {type,value:raw==="true"};
 if(type==="number") {if(!raw.trim()||!Number.isFinite(Number(raw)))return undefined;return {type,value:Number(raw)};}
 if(type==="date") {
  const parts=raw.trim().split("-").map(Number);
  if(!raw.trim()||parts.length>3||parts.some(n=>!Number.isInteger(n))||parts[0]<1||parts[0]>9999|| (parts.length>1&&(parts[1]<1||parts[1]>12)) || (parts.length>2&&(parts[2]<1||parts[2]>31)))return undefined;
  return {type,value:{year:parts[0],...(parts.length>1?{month:parts[1]}:{}),...(parts.length>2?{day:parts[2]}:{})} as CVPartialDate};
 }
 if(type==="text-list") return {type,value:raw.split("\n").map(item=>item.trim()).filter(Boolean)};
 return raw.trim()?{type,value:raw.trim()} as CustomFieldValue:undefined;
}
export default function CustomSectionsEditor({document,editingDependencies,onDocumentChange}:Props) {
 const [newTitle,setNewTitle]=useState(""); const [editingTitle,setEditingTitle]=useState<Record<string,string>>({});
 const [activeSection,setActiveSection]=useState(""); const [editingField,setEditingField]=useState<string|undefined>();
 const [label,setLabel]=useState(""); const [type,setType]=useState<FieldType>("text"); const [raw,setRaw]=useState("");
 const [error,setError]=useState(""); const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});
 const sections=document.content.sections.filter(section=>section.kind==="custom");
 function resetField(){setEditingField(undefined);setLabel("");setType("text");setRaw("");setError("");setFieldErrors({});}
 function createSection(event:FormEvent){event.preventDefault();const result=createCustomCVSection(document,newTitle,editingDependencies);if(!result.ok){setFieldErrors(result.fieldErrors);return;}setNewTitle("");setFieldErrors({});onDocumentChange(result.document);}
 function rename(sectionId:string){const result=renameCustomCVSection(document,sectionId,editingTitle[sectionId]??"",editingDependencies);if(!result.ok){setError(result.fieldErrors.title??result.fieldErrors.form??"Unable to rename section.");return;}setError("");onDocumentChange(result.document);}
 function removeSection(sectionId:string){const result=removeCustomCVSection(document,sectionId,editingDependencies);if(!result.ok){setError(result.fieldErrors.form??"Unable to remove section.");return;}if(activeSection===sectionId){setActiveSection("");resetField();}onDocumentChange(result.document);}
 function startEdit(sectionId:string,field:CustomField){setActiveSection(sectionId);setEditingField(field.id);setLabel(field.label);setType(field.value.type);setRaw(fieldValue(field));setFieldErrors({});setError("");}
 function saveField(event:FormEvent){event.preventDefault();const value=parseValue(type,raw);if(!value){setFieldErrors({value:type==="number"?"Enter a finite number.":type==="date"?"Use YYYY, YYYY-MM or YYYY-MM-DD.":"Enter a value."});return;}
  const result=editingField?updateCVCustomField(document,activeSection,editingField,{label,value},editingDependencies):addCVCustomField(document,activeSection,label,value,editingDependencies);
  if(!result.ok){setFieldErrors(result.fieldErrors);setError(result.fieldErrors.form??"Check the field value.");return;}onDocumentChange(result.document);resetField();
 }
 function removeField(sectionId:string,fieldId:string){const result=removeCVCustomField(document,sectionId,fieldId,editingDependencies);if(!result.ok){setError(result.fieldErrors.form??"Unable to remove field.");return;}onDocumentChange(result.document);if(editingField===fieldId)resetField();}
 return <section className="cv-editor__section custom-sections-editor" aria-labelledby="custom-sections-title">
  <h2 id="custom-sections-title">Custom sections</h2>
  <p className="field-hint">Add your own sections and factual fields. Custom sections appear in the preview in the same order as the other CV sections.</p>
  <form className="experience-form" onSubmit={createSection} noValidate>
   <label className="cv-field"><span>New section name</span><input value={newTitle} onChange={event=>setNewTitle(event.target.value)} aria-invalid={Boolean(fieldErrors.title)}/>{fieldErrors.title&&<span role="alert" className="cv-field__error">{fieldErrors.title}</span>}</label>
   <button className="button button--secondary" type="submit">Create custom section</button>
  </form>
  {sections.map(section=>{
   const fields=(section.entries[0]?.content as {fields:readonly CustomField[]}|undefined)?.fields??[];
   const title=section.title??"Custom section";
   return <div className="custom-section" key={section.id}>
    <div className="experience-section__heading">
     <div className="custom-section__title"><h3>{title}</h3><label className="cv-field"><span>Section name</span><input aria-label={`Rename ${title}`} value={editingTitle[section.id]??title} onChange={event=>setEditingTitle(current=>({...current,[section.id]:event.target.value}))}/></label></div>
     <div className="experience-entry__actions"><button className="text-button" type="button" onClick={()=>rename(section.id)}>Save name</button><button className="text-button" type="button" onClick={()=>removeSection(section.id)}>Remove section</button></div>
    </div>
    {fields.length?<ul className="experience-entry-list">{fields.map(field=><li className="experience-entry" key={field.id}><div className="experience-entry__content"><strong>{field.label}</strong><p className="field-hint">{field.value.type}</p></div><div className="experience-entry__actions"><button className="text-button" type="button" onClick={()=>startEdit(section.id,field)}>Edit</button><button className="text-button" type="button" onClick={()=>removeField(section.id,field.id)}>Remove</button></div></li>)}</ul>:<p className="field-hint">No fields yet.</p>}
    {activeSection===section.id&&<form className="experience-form" onSubmit={saveField} noValidate>
     <h4>{editingField?"Edit field":"Add field"}</h4>
     <div className="cv-editor__grid">
      <label className="cv-field"><span>Field label</span><input value={label} onChange={event=>setLabel(event.target.value)} aria-invalid={Boolean(fieldErrors.label)}/>{fieldErrors.label&&<span role="alert" className="cv-field__error">{fieldErrors.label}</span>}</label>
      <label className="cv-field"><span>Field type</span><select value={type} disabled={Boolean(editingField)} onChange={event=>{setType(event.target.value as FieldType);setRaw("");}}>{types.map(item=><option key={item} value={item}>{item}</option>)}</select></label>
      {type==="boolean"?<label className="experience-ongoing"><input type="checkbox" checked={raw==="true"} onChange={event=>setRaw(String(event.target.checked))}/> True</label>:
       <label className="cv-field"><span>{type==="date"?"Value (YYYY, YYYY-MM or YYYY-MM-DD)":type==="text-list"?"Values (one per line)":"Value"}</span>{type==="text-list"?<textarea rows={3} value={raw} onChange={event=>setRaw(event.target.value)}/>:<input type={type==="url"?"url":type==="email"?"email":type==="number"?"number":type==="phone"?"tel":"text"} value={raw} onChange={event=>setRaw(event.target.value)} aria-invalid={Boolean(fieldErrors.value)}/>}{fieldErrors.value&&<span role="alert" className="cv-field__error">{fieldErrors.value}</span>}</label>}
     </div>
     {error&&<p role="alert" className="cv-field__error">{error}</p>}
     <div className="experience-form__actions"><button className="button button--primary" type="submit">{editingField?"Save field":"Add field"}</button><button className="button button--secondary" type="button" onClick={resetField}>Cancel</button></div>
    </form>}
    {activeSection!==section.id&&<button className="button button--secondary" type="button" onClick={()=>{setActiveSection(section.id);resetField();}}>Add field</button>}
   </div>;
  })}
  {error&&!activeSection&&<p role="alert" className="cv-field__error">{error}</p>}
 </section>;
}
