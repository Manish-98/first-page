import type { CVDocument } from "../../domain/cv/types";
import type { CVPartialDate, AwardSectionContent, CertificationSectionContent, InterestSectionContent, LanguageSectionContent, ProjectSectionContent, PublicationSectionContent, ReferenceSectionContent, VolunteeringSectionContent } from "../../domain/cv/sections";

function safeLink(url: string | undefined): boolean {
  if (!url) return false;
  try { const parsed = new URL(url); return parsed.protocol === "http:" || parsed.protocol === "https:"; } catch { return false; }
}
function dateText(date: CVPartialDate | undefined): string {
  if (!date) return "";
  const month = date.month === undefined ? "" : new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2000, date.month - 1, 1));
  return [date.day, month, date.year].filter(value => value !== undefined && value !== "").join(" ");
}
function entries<T>(document: CVDocument, kind: string): T[] {
  const section = document.content.sections.find(item => item.kind === kind);
  return section?.entries.map(entry => entry.content as T) ?? [];
}
function Lines({ values }: { values: readonly string[] | undefined }) {
  return values?.length ? <ul>{values.map((value,index) => <li key={index}>{value}</li>)}</ul> : null;
}
export default function AdditionalSectionsPreview({ document }: { document: CVDocument }) {
  const projects = entries<ProjectSectionContent>(document,"projects");
  const languages = entries<LanguageSectionContent>(document,"languages");
  const certifications = entries<CertificationSectionContent>(document,"certifications");
  const awards = entries<AwardSectionContent>(document,"awards");
  const volunteering = entries<VolunteeringSectionContent>(document,"volunteering");
  const publications = entries<PublicationSectionContent>(document,"publications");
  const interests = entries<InterestSectionContent>(document,"interests");
  const references = entries<ReferenceSectionContent>(document,"references");
  const range = (value: { startDate?: CVPartialDate; endDate?: CVPartialDate; ongoing?: boolean } | undefined) =>
    [dateText(value?.startDate), value?.ongoing ? "Present" : dateText(value?.endDate)].filter(Boolean).join(" – ");
  return <>
    {projects.length > 0 && <section className="cv-preview__section"><h4>Projects</h4>{projects.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.name}</h5>{item.role && <p className="cv-preview__experience-meta">{item.role}</p>}{range(item.dateRange) && <p className="cv-preview__experience-period">{range(item.dateRange)}</p>}
      {item.description && <p className="cv-preview__summary">{item.description}</p>}<Lines values={item.highlights}/>{safeLink(item.url) && <a href={item.url} target="_blank" rel="noopener noreferrer">Project link</a>}
    </div>)}</section>}
    {languages.length > 0 && <section className="cv-preview__section"><h4>Languages</h4><ul>{languages.map((item,index)=><li key={index}>{item.language}{item.proficiency ? ` — ${item.proficiency}` : ""}</li>)}</ul></section>}
    {certifications.length > 0 && <section className="cv-preview__section"><h4>Certifications</h4>{certifications.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.name}</h5>{item.issuer && <p className="cv-preview__experience-meta">{item.issuer}</p>}
      {(dateText(item.issuedOn)||dateText(item.expiresOn)) && <p className="cv-preview__experience-period">{[dateText(item.issuedOn),dateText(item.expiresOn)].filter(Boolean).join(" – ")}</p>}
      {item.credentialId && <p className="cv-preview__experience-period">Credential ID: {item.credentialId}</p>}
      {safeLink(item.credentialUrl) && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer">View credential</a>}
    </div>)}</section>}
    {awards.length > 0 && <section className="cv-preview__section"><h4>Awards</h4>{awards.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.title}</h5>{item.issuer && <p className="cv-preview__experience-meta">{item.issuer}</p>}{dateText(item.awardedOn) && <p className="cv-preview__experience-period">{dateText(item.awardedOn)}</p>}{item.description && <p className="cv-preview__summary">{item.description}</p>}
    </div>)}</section>}
    {volunteering.length > 0 && <section className="cv-preview__section"><h4>Volunteering</h4>{volunteering.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.role}</h5><p className="cv-preview__experience-meta">{item.organization}</p>{range(item.dateRange) && <p className="cv-preview__experience-period">{range(item.dateRange)}</p>}{item.description && <p className="cv-preview__summary">{item.description}</p>}<Lines values={item.highlights}/>
    </div>)}</section>}
    {publications.length > 0 && <section className="cv-preview__section"><h4>Publications</h4>{publications.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.title}</h5>{item.authors?.length && <p className="cv-preview__experience-meta">{item.authors.join(", ")}</p>}{item.publisher && <p className="cv-preview__experience-meta">{item.publisher}</p>}{dateText(item.publishedOn) && <p className="cv-preview__experience-period">{dateText(item.publishedOn)}</p>}{item.description && <p className="cv-preview__summary">{item.description}</p>}{safeLink(item.url) && <a href={item.url} target="_blank" rel="noopener noreferrer">Read publication</a>}
    </div>)}</section>}
    {interests.length > 0 && <section className="cv-preview__section"><h4>Interests</h4><ul>{interests.map((item,index)=><li key={index}><strong>{item.name}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul></section>}
    {references.length > 0 && <section className="cv-preview__section"><h4>References</h4>{references.map((item,index)=><div className="cv-preview__experience" key={index}>
      <h5>{item.name}</h5>{[item.relationship,item.organization].filter(Boolean).join(" · ") && <p className="cv-preview__experience-meta">{[item.relationship,item.organization].filter(Boolean).join(" · ")}</p>}
      {item.email && <p><a href={`mailto:${item.email}`}>{item.email}</a></p>}{item.phone && <p>{item.phone}</p>}
    </div>)}</section>}
  </>;
}
