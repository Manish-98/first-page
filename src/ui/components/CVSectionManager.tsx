import { useState } from "react";
import type { CVDocument } from "../../domain/cv/types";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import { addCVSection, getAvailableCVSections, moveCVSection, removeCVSection, standardSectionTitles, type ManagedCVSectionKind } from "../../application/cv/manageCVSections";
interface Props { document: CVDocument; editingDependencies: CVCreationDependencies; onDocumentChange: (document: CVDocument) => void }
export default function CVSectionManager({ document, editingDependencies, onDocumentChange }: Props) {
  const [selectedKind, setSelectedKind] = useState<ManagedCVSectionKind | "">("");
  const [error, setError] = useState("");
  const available = getAvailableCVSections(document);
  function addSelectedSection() {
    if (!selectedKind) return;
    const result = addCVSection(document, selectedKind, editingDependencies);
    if (!result.ok) { setError(result.message); return; }
    setError(""); setSelectedKind(""); onDocumentChange(result.document);
  }
  function move(sectionId: string, direction: "up" | "down") {
    const result = moveCVSection(document, sectionId, direction, editingDependencies);
    if (!result.ok) { setError(result.message); return; }
    setError(""); if (result.document !== document) onDocumentChange(result.document);
  }
  function remove(sectionId: string) {
    const result = removeCVSection(document, sectionId, editingDependencies);
    if (!result.ok) { setError(result.message); return; }
    setError(""); onDocumentChange(result.document);
  }
  return <section className="cv-editor__section cv-section-manager" aria-labelledby="section-manager-title">
    <div className="experience-section__heading"><div><h2 id="section-manager-title">Manage CV sections</h2><p className="field-hint">Add sections, remove sections, or change their order. The preview follows this order.</p></div></div>
    {document.content.sections.length ? <ol className="cv-section-manager__list">
      {document.content.sections.map((section,index) => {
        const title = standardSectionTitles[section.kind as ManagedCVSectionKind] ?? section.title ?? section.kind;
        return <li className="cv-section-manager__item" key={section.id}>
          <div className="cv-section-manager__details"><strong>{title}</strong><span>{section.entries.length === 0 ? "Empty section — add content below" : `${section.entries.length} ${section.entries.length === 1 ? "entry" : "entries"}`}</span></div>
          <div className="cv-section-manager__actions" aria-label={`Actions for ${title}`}>
            <button className="text-button" type="button" aria-label={`Move ${title} up`} disabled={index === 0} onClick={() => move(section.id,"up")}>Move up</button>
            <button className="text-button" type="button" aria-label={`Move ${title} down`} disabled={index === document.content.sections.length-1} onClick={() => move(section.id,"down")}>Move down</button>
            <button className="text-button" type="button" aria-label={`Remove ${title} section`} onClick={() => remove(section.id)}>Remove</button>
          </div>
        </li>;
      })}
    </ol> : <p className="field-hint">No sections have been added yet. Choose a section below to start building your CV.</p>}
    <div className="cv-section-manager__add">
      <label className="cv-field" htmlFor="add-cv-section"><span>Add a standard section</span>
        <select id="add-cv-section" value={selectedKind} onChange={event => setSelectedKind(event.target.value as ManagedCVSectionKind | "")}>
          <option value="">Choose a section…</option>{available.map(kind=><option value={kind} key={kind}>{standardSectionTitles[kind]}</option>)}
        </select>
      </label>
      <button className="button button--secondary" type="button" disabled={!selectedKind} onClick={addSelectedSection}>Add section</button>
    </div>
    {available.length===0 && <p className="field-hint">All supported standard sections are already in this CV.</p>}
    {error && <p className="cv-field__error" role="alert">{error}</p>}
  </section>;
}
