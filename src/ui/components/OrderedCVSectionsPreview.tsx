import type { CVDocument, CVSection } from "../../domain/cv/types";
import type { CVPartialDate, EducationSectionContent, ExperienceSectionContent, SkillSectionContent, CustomField, CustomSectionContent } from "../../domain/cv/sections";
import AdditionalSectionsPreview from "./AdditionalSectionsPreview";
import type { AdditionalStandardSectionKind } from "../../application/cv/updateCVStandardSections";
function dateText(date: CVPartialDate | undefined): string | undefined {
 if(!date)return undefined;
 const month=date.month===undefined?undefined:new Intl.DateTimeFormat("en",{month:"short"}).format(new Date(2000,date.month-1,1));
 return [date.day===undefined?undefined:String(date.day),month,String(date.year)].filter(Boolean).join(" ");
}
function sectionEntries<T>(section:CVSection):T[]{return section.entries.map(entry=>entry.content as T);}
function range(value:{startDate?:CVPartialDate;endDate?:CVPartialDate;ongoing?:boolean}|undefined):string{return[dateText(value?.startDate),value?.ongoing?"Present":dateText(value?.endDate)].filter(Boolean).join(" – ");}
function safeUrl(value:string):boolean{try{const url=new URL(value);return url.protocol==="http:"||url.protocol==="https:";}catch{return false;}}
function renderCustomField(field:CustomField){
 switch(field.value.type){
  case "boolean":return field.value.value?"Yes":"No";
  case "date":return dateText(field.value.value);
  case "text-list":return field.value.value.length?<ul>{field.value.value.map((item,index)=><li key={index}>{item}</li>)}</ul>:null;
  case "url":return safeUrl(field.value.value)?<a href={field.value.value} target="_blank" rel="noopener noreferrer">{field.value.value}</a>:field.value.value;
  case "email":return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(field.value.value)?<a href={`mailto:${field.value.value}`}>{field.value.value}</a>:field.value.value;
  default:return String(field.value.value);
 }
}
function renderSection(document:CVDocument,section:CVSection,selectedKey:string|null,accessible:boolean){
 const id=`cv-preview-section-${section.id}`;
 switch(section.kind){
  case "summary":{const items=sectionEntries<{text:string}>(section).filter(item=>item.text?.trim());return items.length?<section className="cv-preview__section" aria-labelledby={id} data-cv-selection-key={`section:${section.id}`} data-cv-selected={selectedKey === `section:${section.id}`} tabIndex={accessible ? 0 : undefined} role={accessible ? "group" : undefined} aria-label={accessible ? `Select ${section.title || section.kind} section` : undefined} key={section.id}><h4 id={id}>Professional Summary</h4>{items.map((item,index)=><p className="cv-preview__summary" key={index}>{item.text}</p>)}</section>:null;}
  case "experience":{const items=sectionEntries<ExperienceSectionContent>(section);return items.length?<section className="cv-preview__section" aria-labelledby={id} data-cv-selection-key={`section:${section.id}`} data-cv-selected={selectedKey === `section:${section.id}`} tabIndex={accessible ? 0 : undefined} role={accessible ? "group" : undefined} aria-label={accessible ? `Select ${section.title || section.kind} section` : undefined} key={section.id}><h4 id={id}>Work Experience</h4>{items.map((item,index)=><div className="cv-preview__experience" key={index}><h5>{item.role}</h5><p className="cv-preview__experience-meta">{item.employer}{item.location?` · ${item.location}`:""}</p>{range(item.dateRange)&&<p className="cv-preview__experience-period">{range(item.dateRange)}</p>}{item.employmentType&&<p className="cv-preview__experience-period">{item.employmentType.replace("-"," ")}</p>}{item.description&&<p className="cv-preview__summary">{item.description}</p>}{item.responsibilities?.length?<ul>{item.responsibilities.map((value,i)=><li key={i}>{value}</li>)}</ul>:null}{item.achievements?.length?<div className="cv-preview__achievements"><strong>Key achievements</strong><ul>{item.achievements.map((value,i)=><li key={i}>{value}</li>)}</ul></div>:null}</div>)}</section>:null;}
  case "education":{const items=sectionEntries<EducationSectionContent>(section);return items.length?<section className="cv-preview__section" aria-labelledby={id} data-cv-selection-key={`section:${section.id}`} data-cv-selected={selectedKey === `section:${section.id}`} tabIndex={accessible ? 0 : undefined} role={accessible ? "group" : undefined} aria-label={accessible ? `Select ${section.title || section.kind} section` : undefined} key={section.id}><h4 id={id}>Education</h4>{items.map((item,index)=><div className="cv-preview__education" key={index}><h5>{item.qualification}{item.fieldOfStudy?` · ${item.fieldOfStudy}`:""}</h5><p className="cv-preview__experience-meta">{item.institution}{item.location?` · ${item.location}`:""}</p>{range(item.dateRange)&&<p className="cv-preview__experience-period">{range(item.dateRange)}</p>}{item.grade&&<p className="cv-preview__experience-period">Grade: {item.grade}</p>}{item.description&&<p className="cv-preview__summary">{item.description}</p>}</div>)}</section>:null;}
  case "skills":{const items=sectionEntries<SkillSectionContent>(section);return items.length?<section className="cv-preview__section" aria-labelledby={id} data-cv-selection-key={`section:${section.id}`} data-cv-selected={selectedKey === `section:${section.id}`} tabIndex={accessible ? 0 : undefined} role={accessible ? "group" : undefined} aria-label={accessible ? `Select ${section.title || section.kind} section` : undefined} key={section.id}><h4 id={id}>Skills</h4><ul className="cv-preview__skills">{items.map((item,index)=><li key={index}><strong>{item.name}</strong>{item.category&&<span>{item.category}</span>}{item.level&&<span>{item.level[0].toUpperCase()+item.level.slice(1)}</span>}{item.keywords?.length?<span>{item.keywords.join(" · ")}</span>:null}</li>)}</ul></section>:null;}
  case "projects":case "languages":case "certifications":case "awards":case "volunteering":case "publications":case "interests":case "references":
   return <AdditionalSectionsPreview document={document} kind={section.kind as AdditionalStandardSectionKind} key={section.id} sectionId={section.id} selectedKey={selectedKey} accessible={accessible}/>;
  case "custom":{
   const items=sectionEntries<CustomSectionContent>(section);
   const descriptions=items.map(item=>item.description?.trim()).filter((value):value is string=>Boolean(value));
   const fields=items.flatMap(item=>item.fields).filter(field=>field.label.trim());
   return fields.length||descriptions.length?<section className="cv-preview__section" aria-labelledby={id} data-cv-selection-key={`section:${section.id}`} data-cv-selected={selectedKey === `section:${section.id}`} tabIndex={accessible ? 0 : undefined} role={accessible ? "group" : undefined} aria-label={accessible ? `Select ${section.title || section.kind} section` : undefined} key={section.id}><h4 id={id}>{section.title||"Additional information"}</h4>{descriptions.map((description,index)=><p className="cv-preview__summary" key={index}>{description}</p>)}<dl className="cv-preview__custom-fields">{fields.map(field=><div key={field.id}><dt>{field.label}</dt><dd>{renderCustomField(field)}</dd></div>)}</dl></section>:null;
  }
  default:return null;
 }
}
export default function OrderedCVSectionsPreview({document,selectedKey=null,accessible=false}:{document:CVDocument;selectedKey?:string|null;accessible?:boolean}){return <>{document.content.sections.map(section=>renderSection(document,section,selectedKey,accessible))}</>;}
