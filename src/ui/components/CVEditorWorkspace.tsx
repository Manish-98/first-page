import "./cv-editor-workspace.css";
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

type Drawer = "left" | "right" | null;

interface CVEditorWorkspaceProps {
  title: string;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
}

function isNarrowViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= 960;
}

export default function CVEditorWorkspace({ title, leftPanel, rightPanel, children }: CVEditorWorkspaceProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<Drawer>(null);
  const [isMobile, setIsMobile] = useState(isNarrowViewport);
  const leftTriggerRef = useRef<HTMLButtonElement>(null);
  const rightTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateViewport = () => {
      const narrowViewport = isNarrowViewport();
      setIsMobile(narrowViewport);
      if (!narrowViewport) setActiveDrawer(null);
    };

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobile || !activeDrawer) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawerCloseRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [activeDrawer, isMobile]);

  useEffect(() => {
    if (!isMobile || !activeDrawer) return;

    const dismissOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveDrawer(null);
      }
    };
    document.addEventListener("keydown", dismissOnEscape);
    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [activeDrawer, isMobile]);

  function handleDrawerKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab" || !drawerRef.current) return;
    const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    if (focusable.length === 0) {
      event.preventDefault();
      drawerCloseRef.current?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function togglePanel(panel: Exclude<Drawer, null>) {
    if (isMobile) {
      if (panel === "left") leftTriggerRef.current?.focus();
      else rightTriggerRef.current?.focus();
      setActiveDrawer(current => current === panel ? null : panel);
      return;
    }
    if (panel === "left") setLeftCollapsed(current => !current);
    else setRightCollapsed(current => !current);
  }

  const drawerOpen = isMobile && activeDrawer !== null;
  const leftIsOpen = isMobile ? activeDrawer === "left" : !leftCollapsed;
  const rightIsOpen = isMobile ? activeDrawer === "right" : !rightCollapsed;

  return (
    <section className="editor-workspace" aria-label={`CV editor workspace for ${title}`}
      data-mobile={isMobile ? "true" : "false"}
      data-left-collapsed={!isMobile && leftCollapsed ? "true" : "false"}
      data-right-collapsed={!isMobile && rightCollapsed ? "true" : "false"}>
      <div className="editor-workspace__toolbar" aria-hidden={drawerOpen} inert={drawerOpen}>
        <div className="editor-workspace__panel-controls">
          <button ref={leftTriggerRef} className="editor-workspace__toggle" type="button"
            aria-controls="editor-tools-panel" aria-expanded={leftIsOpen}
            onClick={() => togglePanel("left")}>
            {leftIsOpen ? "Hide tools" : "Show tools"}
          </button>
          <span className="editor-workspace__separator" aria-hidden="true" />
          <span className="editor-workspace__document-name">{title}</span>
        </div>
        <button ref={rightTriggerRef} className="editor-workspace__toggle" type="button"
          aria-controls="editor-properties-panel" aria-expanded={rightIsOpen}
          onClick={() => togglePanel("right")}>
          {rightIsOpen ? "Hide properties" : "Show properties"}
        </button>
      </div>

      {drawerOpen && <button className="editor-workspace__backdrop" type="button"
        aria-label="Close panel" onClick={() => setActiveDrawer(null)} />}

      <div className="editor-workspace__layout">
        <aside id="editor-tools-panel"
          className={`editor-panel editor-panel--left${isMobile && activeDrawer === "left" ? " editor-panel--drawer-open" : ""}`}
          aria-label="Tools and sections"
          aria-hidden={isMobile && activeDrawer !== "left"}
          inert={isMobile && activeDrawer !== "left"}
          role={isMobile && activeDrawer === "left" ? "dialog" : undefined}
          aria-modal={isMobile && activeDrawer === "left" ? true : undefined}
          aria-labelledby={isMobile ? "editor-tools-title" : undefined}
          ref={isMobile && activeDrawer === "left" ? drawerRef : undefined}
          onKeyDown={isMobile && activeDrawer === "left" ? handleDrawerKeyDown : undefined}>
          <div className="editor-panel__heading">
            <h2 id="editor-tools-title">Tools and sections</h2>
            {isMobile && activeDrawer === "left" && <button ref={drawerCloseRef}
              className="editor-panel__close" type="button" onClick={() => setActiveDrawer(null)}>Close</button>}
          </div>
          <div className="editor-panel__content">{leftPanel}</div>
        </aside>

        <div className="editor-workspace__canvas" aria-hidden={drawerOpen} inert={drawerOpen}>
          {children}
        </div>

        <aside id="editor-properties-panel"
          className={`editor-panel editor-panel--right${isMobile && activeDrawer === "right" ? " editor-panel--drawer-open" : ""}`}
          aria-label="Contextual properties"
          aria-hidden={isMobile && activeDrawer !== "right"}
          inert={isMobile && activeDrawer !== "right"}
          role={isMobile && activeDrawer === "right" ? "dialog" : undefined}
          aria-modal={isMobile && activeDrawer === "right" ? true : undefined}
          aria-labelledby={isMobile ? "editor-properties-title" : undefined}
          ref={isMobile && activeDrawer === "right" ? drawerRef : undefined}
          onKeyDown={isMobile && activeDrawer === "right" ? handleDrawerKeyDown : undefined}>
          <div className="editor-panel__heading">
            <h2 id="editor-properties-title">Contextual properties</h2>
            {isMobile && activeDrawer === "right" && <button ref={drawerCloseRef}
              className="editor-panel__close" type="button" onClick={() => setActiveDrawer(null)}>Close</button>}
          </div>
          <div className="editor-panel__content">{rightPanel}</div>
        </aside>
      </div>
    </section>
  );
}
