import AppLink from "./AppLink";

export default function AppHeader() {
  return (
    <header className="app-header">
      <AppLink variant="wordmark" href="#/" aria-label="First Page home">
        first<span>page</span>
      </AppLink>
      <nav className="primary-navigation" aria-label="Primary navigation">
        <AppLink href="#/">Home</AppLink>
      </nav>
      <p className="header-note">A considered space for your next chapter</p>
    </header>
  );
}
