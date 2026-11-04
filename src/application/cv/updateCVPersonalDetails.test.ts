import { describe, expect, it } from "vitest";
import { createCVDocument } from "../../domain/cv/operations";
import { updateCVPersonalDetails } from "./updateCVPersonalDetails";

const fixture = () => {
  const result = createCVDocument({ id: "cv-1", title: "CV", createdAt: "2026-11-04T10:00:00.000Z" });
  if (!result.ok) throw new Error("Fixture failed");
  return result.value;
};
const dependencies = { now: () => "2026-11-04T11:00:00.000Z" };

describe("updateCVPersonalDetails", () => {
  it("trims values and omits blank optional properties and empty parents", () => {
    const result = updateCVPersonalDetails(fixture(), {
      name: { givenName: " Ada ", familyName: " " },
      headline: " ",
      contact: { email: " ada@example.com ", address: { locality: " " } },
    }, dependencies);
    expect(result).toMatchObject({ ok: true, document: { content: { personalDetails: {
      name: { givenName: "Ada" }, contact: { email: "ada@example.com" },
    } } } });
  });

  it("maps domain validation to field-level errors", () => {
    const result = updateCVPersonalDetails(fixture(), { contact: { email: "bad", website: "invalid" } }, dependencies);
    expect(result).toMatchObject({ ok: false, fieldErrors: {
      "contact.email": "Email address is not valid.",
      "contact.website": "Website must be an absolute HTTP or HTTPS URL.",
    } });
  });
});
