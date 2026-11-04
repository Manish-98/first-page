import { addSection, removeSection, updateSection } from "../../domain/cv/operations";
import { addCustomField, removeCustomField, updateCustomField } from "../../domain/cv/custom-field-operations";
import type { CustomField, CustomFieldValue } from "../../domain/cv/sections";
import type { CVDocument, CVSection } from "../../domain/cv/types";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVCreationDependencies } from "./createCV";

export type CustomSectionResult = { ok: true; document: CVDocument } | { ok: false; fieldErrors: Readonly<Record<string,string>> };
const customSection = (document: CVDocument, sectionId: string) => document.content.sections.find(section => section.id === sectionId && section.kind === "custom");
function validate(document: CVDocument, fieldId?: string): Record<string,string> {
  const errors: Record<string,string> = {};
  for (const issue of validateCVDocument(document).issues) {
    if (fieldId && issue.fieldId !== fieldId) continue;
    if (!fieldId && issue.fieldId) continue;
    const key = issue.path.split(".").pop() ?? "form";
    errors[key] ??= issue.message;
  }
  return errors;
}
function validated(document: CVDocument, fieldId?: string): CustomSectionResult {
  const errors = validate(document, fieldId);
  return Object.keys(errors).length ? { ok: false, fieldErrors: errors } : { ok: true, document };
}
export function createCustomCVSection(document: CVDocument, title: string, dependencies: Pick<CVCreationDependencies,"generateId"|"now">): CustomSectionResult {
  const normalized = title.trim();
  if (!normalized) return { ok:false, fieldErrors:{ title:"Enter a section name." } };
  const section: CVSection = { id: dependencies.generateId(), kind:"custom", title:normalized, entries:[{ id:dependencies.generateId(), content:{ fields:[] } }] };
  const result = addSection(document, section, dependencies.now());
  return result.ok ? { ok:true, document:result.value } : { ok:false, fieldErrors:{ form:result.error.message } };
}
export function renameCustomCVSection(document: CVDocument, sectionId: string, title: string, dependencies: Pick<CVCreationDependencies,"now">): CustomSectionResult {
  if (!customSection(document,sectionId)) return { ok:false, fieldErrors:{ form:"Custom section could not be found." } };
  const normalized=title.trim();
  if (!normalized) return { ok:false, fieldErrors:{ title:"Enter a section name." } };
  const result=updateSection(document,sectionId,{title:normalized},dependencies.now());
  return result.ok ? {ok:true,document:result.value} : {ok:false,fieldErrors:{form:result.error.message}};
}
export function removeCustomCVSection(document: CVDocument, sectionId: string, dependencies: Pick<CVCreationDependencies,"now">): CustomSectionResult {
  if (!customSection(document,sectionId)) return {ok:false,fieldErrors:{form:"Custom section could not be found."}};
  const result=removeSection(document,sectionId,dependencies.now());
  return result.ok ? {ok:true,document:result.value} : {ok:false,fieldErrors:{form:result.error.message}};
}
function keyFromLabel(label: string, fields: readonly CustomField[]): string {
  const base=label.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"") || "field";
  let key=base, suffix=2;
  while(fields.some(field=>field.key===key)) key=`${base}_${suffix++}`;
  return key;
}
function fieldsForEntry(section: NonNullable<ReturnType<typeof customSection>>, entryId: string): readonly CustomField[] | undefined {
  const entry=section.entries.find(item=>item.id===entryId);
  return entry ? (entry.content as {fields:readonly CustomField[]}).fields : undefined;
}
export function addCVCustomField(document: CVDocument, sectionId: string, entryId: string, label: string, value: CustomFieldValue, dependencies: Pick<CVCreationDependencies,"generateId"|"now">): CustomSectionResult {
  const section=customSection(document,sectionId), fields=section && fieldsForEntry(section,entryId);
  if (!section || !fields) return {ok:false,fieldErrors:{form:"Custom section entry could not be found."}};
  if (!label.trim()) return {ok:false,fieldErrors:{label:"Enter a field label."}};
  if (!["text","number","boolean","date","url","email","phone","text-list"].includes(value.type)) return {ok:false,fieldErrors:{type:"Choose a supported field type."}};
  const field: CustomField={id:dependencies.generateId(),key:keyFromLabel(label,fields),label:label.trim(),value};
  const result=addCustomField(document,sectionId,entryId,field,dependencies.now());
  return result.ok ? validated(result.value,field.id) : {ok:false,fieldErrors:{form:result.error.message}};
}
export function updateCVCustomField(document: CVDocument, sectionId: string, entryId: string, fieldId: string, updates: {label?:string;value?:CustomFieldValue}, dependencies: Pick<CVCreationDependencies,"now">): CustomSectionResult {
  const section=customSection(document,sectionId);
  if (!section || !fieldsForEntry(section,entryId)) return {ok:false,fieldErrors:{form:"Custom section entry could not be found."}};
  if (updates.label !== undefined && !updates.label.trim()) return {ok:false,fieldErrors:{label:"Enter a field label."}};
  const result=updateCustomField(document,sectionId,entryId,fieldId,{...updates,label:updates.label?.trim()},dependencies.now());
  return result.ok ? validated(result.value,fieldId) : {ok:false,fieldErrors:{form:result.error.message}};
}
export function removeCVCustomField(document: CVDocument, sectionId: string, entryId: string, fieldId: string, dependencies: Pick<CVCreationDependencies,"now">): CustomSectionResult {
  const section=customSection(document,sectionId);
  if (!section || !fieldsForEntry(section,entryId)) return {ok:false,fieldErrors:{form:"Custom section entry could not be found."}};
  const result=removeCustomField(document,sectionId,entryId,fieldId,dependencies.now());
  return result.ok ? {ok:true,document:result.value} : {ok:false,fieldErrors:{form:result.error.message}};
}
