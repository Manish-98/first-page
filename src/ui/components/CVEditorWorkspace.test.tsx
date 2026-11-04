// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CVEditorWorkspace from "./CVEditorWorkspace";

const originalMatchMedia = window.matchMedia;
const originalInnerWidth = window.innerWidth;

function setViewport(isMobile: boolean) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: isMobile ? 768 : 1280 });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(max-width: 960px)" && isMobile,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function renderWorkspace() {
  return render(
    <CVEditorWorkspace
      title="My CV"
      leftPanel={<button type="button">Add section</button>}
      rightPanel={<p>Choose an item to inspect its properties.</p>}
    >
      <article aria-label="Document canvas">Rendered CV</article>
    </CVEditorWorkspace>,
  );
}

describe("CVEditorWorkspace", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
  });

  it("renders the three workspace regions on desktop", () => {
    setViewport(false);
    renderWorkspace();

    expect(screen.getByRole("complementary", { name: "Tools and sections" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Document canvas" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Contextual properties" })).toBeInTheDocument();
  });

  it("collapses and independently reopens desktop panels", () => {
    setViewport(false);
    renderWorkspace();

    fireEvent.click(screen.getByRole("button", { name: "Hide tools" }));
    expect(screen.getByRole("button", { name: "Show tools" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("complementary", { name: "Tools and sections" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide properties" }));
    expect(screen.getByRole("button", { name: "Show properties" })).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "Show tools" }));
    expect(screen.getByRole("button", { name: "Hide tools" })).toHaveAttribute("aria-expanded", "true");
  });

  it("opens the tools drawer on narrow screens and dismisses it with Escape", () => {
    setViewport(true);
    renderWorkspace();

    const trigger = screen.getByRole("button", { name: "Show tools" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Tools and sections" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    expect(screen.getByRole("article", { name: "Document canvas" })).toHaveAttribute("aria-hidden", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Tools and sections" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("opens the properties drawer on narrow screens", () => {
    setViewport(true);
    renderWorkspace();

    fireEvent.click(screen.getByRole("button", { name: "Show properties" }));
    expect(screen.getByRole("dialog", { name: "Contextual properties" })).toBeInTheDocument();
    expect(screen.getByText("Choose an item to inspect its properties.")).toBeInTheDocument();
  });
});
