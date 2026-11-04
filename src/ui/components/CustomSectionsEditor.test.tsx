// @vitest-environment jsdom
import {fireEvent,render,screen} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import type {CVCreationDependencies} from "../../application/cv/createCV";
import {createCVDocument} from "../../domain/cv/operations";
import CustomSectionsEditor from "./CustomSectionsEditor";
const deps:CVCreationDependencies={generateId:(()=>{let id=0;return()=>`generated-${++id}`;})(),now:()=>"2026-11-04T11:00:00.000Z"};
const fixture=()=>{const result=createCVDocument({id:"cv",title:"CV",createdAt:"2026-11-04T10:00:00.000Z"});if(!result.ok)throw Error("fixture");return result.value;};
describe("CustomSectionsEditor",()=>{it("creates a section and adds an accessible typed field",()=>{let current=fixture();const update=(next:typeof current)=>{current=next;};const view=render(<CustomSectionsEditor document={current} editingDependencies={deps} onDocumentChange={update}/>);fireEvent.change(screen.getByLabelText("New section name"),{target:{value:"Community"}});fireEvent.click(screen.getByRole("button",{name:"Create custom section"}));view.rerender(<CustomSectionsEditor document={current} editingDependencies={deps} onDocumentChange={update}/>);expect(screen.getByRole("heading",{name:"Community"})).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Add field"}));fireEvent.change(screen.getByLabelText("Field label"),{target:{value:"Volunteer role"}});fireEvent.change(screen.getByLabelText("Value"),{target:{value:"Mentor"}});fireEvent.click(screen.getByRole("button",{name:"Add field"}));expect(current.content.sections[0].kind).toBe("custom");expect((current.content.sections[0].entries[0].content as {fields:{label:string}[]}).fields[0].label).toBe("Volunteer role");});});
