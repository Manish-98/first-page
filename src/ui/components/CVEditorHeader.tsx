import AppLink from "./AppLink";
import { useActiveCV } from "../hooks/useActiveCV";

export default function CVEditorHeader() {
  const document = useActiveCV();

  return (
    <header className="editor-header">
      <AppLink variant="wordmark" href="#/" aria-label="First Page home">
        first<span>page</span>
      </AppLink>
      <div className="editor-header__context">
        <span className="editor-header__label">CV EDITOR</span>
        <span className="editor-header__document-title">
          {document?.metadata.title ?? "No active CV"}
        </span>
      </div>
      <span className="editor-header__status">Changes held in this session</span>
    </header>
  );
}
