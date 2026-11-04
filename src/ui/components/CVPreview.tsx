import type { CVDocument } from "../../domain/cv/types";
import type { CVPartialDate, ExperienceSectionContent } from "../../domain/cv/sections";

interface CVPreviewProps {
  document: CVDocument;
}

function nonBlank(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getDisplayName(document: CVDocument): string | undefined {
  const name = document.content.personalDetails.name;
  if (!name) return undefined;
  return [
    name.prefix,
    name.givenName,
    name.additionalName,
    name.familyName,
    name.suffix,
  ].map(nonBlank).filter((part): part is string => Boolean(part)).join(" ") || undefined;
}

function getAddressLines(document: CVDocument): string[] {
  const address = document.content.personalDetails.contact?.address;
  if (!address) return [];
  const street = [address.addressLine1, address.addressLine2]
    .map(nonBlank).filter((part): part is string => Boolean(part)).join(", ");
  const locality = [address.locality, address.region, address.postalCode]
    .map(nonBlank).filter((part): part is string => Boolean(part)).join(", ");
  return [street, locality, nonBlank(address.country)]
    .filter((part): part is string => Boolean(part));
}

function formatPartialDate(date: CVPartialDate | undefined): string | undefined {
  if (!date) return undefined;
  const month = date.month === undefined ? undefined : new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2000, date.month - 1, 1));
  return [month, String(date.year)].filter(Boolean).join(" ");
}

function getExperienceEntries(document: CVDocument): ExperienceSectionContent[] {
  const section = document.content.sections.find(item => item.kind === "experience");
  if (!section) return [];
  return section.entries.flatMap(entry => {
    const content = entry.content;
    return content && typeof content === "object" && "role" in content && "employer" in content
      ? [content as ExperienceSectionContent]
      : [];
  });
}

function getSummaryEntries(document: CVDocument): string[] {
  const section = document.content.sections.find(item => item.kind === "summary");
  if (!section) return [];
  return section.entries.flatMap(entry => {
    if (!entry.content || typeof entry.content !== "object" || !("text" in entry.content)) return [];
    const text = nonBlank(typeof entry.content.text === "string" ? entry.content.text : undefined);
    return text ? [text] : [];
  });
}

export default function CVPreview({ document }: CVPreviewProps) {
  const details = document.content.personalDetails;
  const name = getDisplayName(document);
  const headline = nonBlank(details.headline);
  const email = nonBlank(details.contact?.email);
  const phone = nonBlank(details.contact?.phone);
  const website = nonBlank(details.contact?.website);
  const addressLines = getAddressLines(document);
  const profiles = (details.contact?.profiles ?? []).filter(profile =>
    nonBlank(profile.label) && isHttpUrl(profile.url.trim()),
  );
  const summaryEntries = getSummaryEntries(document);
  const experienceEntries = getExperienceEntries(document);
  const hasContent = Boolean(
    name || headline || email || phone || (website && isHttpUrl(website)) ||
    addressLines.length || profiles.length || summaryEntries.length || experienceEntries.length,
  );

  return (
    <aside className="cv-preview-panel" aria-label="CV preview panel">
      <div className="cv-preview-panel__topline">
        <h2>Live preview</h2>
        <span>Saved content</span>
      </div>
      <article className="cv-preview" aria-label="CV preview">
        {hasContent ? (
          <>
            {(name || headline) && (
              <header className="cv-preview__header">
                {name && <h3>{name}</h3>}
                {headline && <p className="cv-preview__headline">{headline}</p>}
              </header>
            )}
            {(email || phone || (website && isHttpUrl(website)) || addressLines.length || profiles.length) && (
              <section className="cv-preview__contact" aria-label="Contact information">
                {email && <a href={`mailto:${email}`}>{email}</a>}
                {phone && <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>}
                {website && isHttpUrl(website) && (
                  <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
                )}
                {addressLines.map((line, index) => <p key={`address-${index}`}>{line}</p>)}
                {profiles.map(profile => (
                  <a key={profile.url} href={profile.url.trim()} target="_blank" rel="noopener noreferrer">
                    {profile.label.trim()}
                  </a>
                ))}
              </section>
            )}
            {summaryEntries.length > 0 && (
              <section className="cv-preview__section" aria-labelledby="cv-preview-summary-title">
                <h4 id="cv-preview-summary-title">Professional Summary</h4>
                {summaryEntries.map((summary, index) => <p className="cv-preview__summary" key={index}>{summary}</p>)}
              </section>
            )}
            {experienceEntries.length > 0 && (
              <section className="cv-preview__section" aria-labelledby="cv-preview-experience-title">
                <h4 id="cv-preview-experience-title">Work Experience</h4>
                {experienceEntries.map((experience, index) => {
                  const start = formatPartialDate(experience.dateRange?.startDate);
                  const end = experience.dateRange?.ongoing ? "Present" : formatPartialDate(experience.dateRange?.endDate);
                  const period = [start, end].filter(Boolean).join(" – ");
                  return (
                    <section className="cv-preview__experience" key={index}>
                      <h5>{experience.role}</h5>
                      <p className="cv-preview__experience-meta">
                        {experience.employer}{experience.location ? " · " + experience.location : ""}
                      </p>
                      {period && <p className="cv-preview__experience-period">{period}</p>}
                      {experience.employmentType && <p className="cv-preview__experience-period">{experience.employmentType.replace("-", " ")}</p>}
                      {experience.description && <p className="cv-preview__summary">{experience.description}</p>}
                      {experience.responsibilities?.length ? (
                        <ul>{experience.responsibilities.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                      ) : null}
                      {experience.achievements?.length ? (
                        <div className="cv-preview__achievements">
                          <strong>Key achievements</strong>
                          <ul>{experience.achievements.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </section>
            )}
          </>
        ) : (
          <div className="cv-preview__empty">
            <span aria-hidden="true">✦</span>
            <h3>Your CV will take shape here</h3>
            <p>Save your name, contact details or professional summary to see them in this preview.</p>
          </div>
        )}
      </article>
    </aside>
  );
}
