// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CVDocument } from "../../domain/cv/types";
import CVDocumentCanvas from "./CVDocumentCanvas";
function fixture(sections: CVDocument["content"]["sections"] = []): CVDocument {
  return { id:"canvas-test", metadata:{title:"Test CV",createdAt:"2026-11-04T10:00:00.000Z",updatedAt:"2026-11-04T10:00:00.000Z"},
    content:{personalDetails:{name:{givenName:"Ada",familyName:"Lovelace"}},sections} };
}
describe("CVDocumentCanvas", () => {
  it("renders one accessible content flow for an empty CV", () => {
    render(<CVDocumentCanvas document={fixture()} />);
    const canvas=screen.getByRole("region",{name:"Paginated CV document"});
    expect(screen.getByText("1 page · A4 portrait")).toBeInTheDocument();
    expect(screen.getAllByRole("heading",{name:"Ada Lovelace"})).toHaveLength(1);
    expect(canvas.querySelectorAll(".cv-document-canvas__flow .cv-preview")).toHaveLength(1);
  });
  it("preserves canonical section order in the single rendered flow", () => {
    render(<CVDocumentCanvas document={fixture([
      {id:"skills",kind:"skills",entries:[{id:"skill",content:{name:"TypeScript"}}]},
      {id:"summary",kind:"summary",entries:[{id:"summary-entry",content:{text:"Profile first"}}]},
    ])} />);
    const flow=screen.getByRole("region",{name:"Paginated CV document"}).querySelector(".cv-document-canvas__flow");
    expect(flow).not.toBeNull();
    const renderedText=flow?.textContent ?? "";
    const skillsIndex=renderedText.indexOf("Skills");
    const summaryIndex=renderedText.indexOf("Professional Summary");
    expect(skillsIndex).toBeGreaterThanOrEqual(0);
    expect(summaryIndex).toBeGreaterThan(skillsIndex);
  });
  it("updates the page count when content overflows without duplicating the preview", () => {
    const original=Object.getOwnPropertyDescriptor(HTMLElement.prototype,"scrollHeight");
    Object.defineProperty(HTMLElement.prototype,"scrollHeight",{configurable:true,get:()=>1200});
    class Observer { observe=vi.fn(); disconnect=vi.fn(); }
    vi.stubGlobal("ResizeObserver",Observer);
    render(<CVDocumentCanvas document={fixture()} />);
    const canvas=screen.getByRole("region",{name:"Paginated CV document"});
    expect(screen.getByText("2 pages · A4 portrait")).toBeInTheDocument();
    expect(canvas.querySelectorAll(".cv-document-canvas__flow .cv-preview")).toHaveLength(1);
    if(original) Object.defineProperty(HTMLElement.prototype,"scrollHeight",original);
    else Reflect.deleteProperty(HTMLElement.prototype,"scrollHeight");
    vi.unstubAllGlobals();
  });
});
