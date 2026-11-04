// @vitest-environment jsdom
import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import { createCVDocument } from "../../domain/cv/operations";
import OrderedCVSectionsPreview from "./OrderedCVSectionsPreview";
describe("OrderedCVSectionsPreview custom sections",()=>{
 it("renders fields from every entry in a custom section",()=>{
  const result=createCVDocument({id:"cv",title:"CV",createdAt:"2026-11-04T10:00:00.000Z",sections:[{id:"custom",kind:"custom",title:"Community",entries:[{id:"entry-one",content:{fields:[{id:"field-one",key:"first",label:"First role",value:{type:"text",value:"Mentor"}}]}},{id:"entry-two",content:{fields:[{id:"field-two",key:"second",label:"Second role",value:{type:"text",value:"Organizer"}}]}}]}]});
  if(!result.ok)throw Error("fixture");
  render(<OrderedCVSectionsPreview document={result.value}/>);
  expect(screen.getByText("First role")).toBeInTheDocument();
  expect(screen.getByText("Mentor")).toBeInTheDocument();
  expect(screen.getByText("Second role")).toBeInTheDocument();
  expect(screen.getByText("Organizer")).toBeInTheDocument();
 });
});
