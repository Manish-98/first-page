import { replacePersonalDetails } from "../../domain/cv/operations";
import { validateCVDocument } from "../../domain/cv/validation";
import type { CVDocument, PersonalDetails } from "../../domain/cv/types";
import type { CVCreationDependencies } from "./createCV";

export type PersonalDetailsUpdate =
  | { ok: true; document: CVDocument }
  | { ok: false; fieldErrors: Readonly<Record<string, string>> };

const trim = (value?: string) => value?.trim() || undefined;

function normalize(input: PersonalDetails): PersonalDetails {
  const name = input.name ? Object.fromEntries(
    Object.entries(input.name).flatMap(([key, value]) => trim(value) ? [[key, trim(value)]] : []),
  ) : undefined;
  const address = input.contact?.address ? Object.fromEntries(
    Object.entries(input.contact.address).flatMap(([key, value]) => trim(value) ? [[key, trim(value)]] : []),
  ) : undefined;
  const profiles = input.contact?.profiles?.flatMap(({ label, url }) => {
    const l = trim(label), u = trim(url);
    return l || u ? [{ label: l ?? "", url: u ?? "" }] : [];
  });
  const contact = input.contact ? {
    ...(trim(input.contact.email) ? { email: trim(input.contact.email) } : {}),
    ...(trim(input.contact.phone) ? { phone: trim(input.contact.phone) } : {}),
    ...(trim(input.contact.website) ? { website: trim(input.contact.website) } : {}),
    ...(address && Object.keys(address).length ? { address } : {}),
    ...(profiles?.length ? { profiles } : {}),
  } : undefined;
  return {
    ...(name && Object.keys(name).length ? { name } : {}),
    ...(trim(input.headline) ? { headline: trim(input.headline) } : {}),
    ...(contact && Object.keys(contact).length ? { contact } : {}),
  } as PersonalDetails;
}

export function updateCVPersonalDetails(
  document: CVDocument,
  details: PersonalDetails,
  dependencies: Pick<CVCreationDependencies, "now">,
): PersonalDetailsUpdate {
  const updated = replacePersonalDetails(document, normalize(details), dependencies.now());
  if (!updated.ok) return { ok: false, fieldErrors: { form: updated.error.message } };
  const errors: Record<string, string> = {};
  for (const issue of validateCVDocument(updated.value).issues) {
    if (issue.path.startsWith("$.content.personalDetails")) {
      errors[issue.path.replace("$.content.personalDetails.", "")] = issue.message;
    }
  }
  return Object.keys(errors).length
    ? { ok: false, fieldErrors: errors }
    : { ok: true, document: updated.value };
}
