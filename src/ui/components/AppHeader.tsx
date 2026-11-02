export default function AppHeader() {
  return (
    <header className="app-header">
      <a className="wordmark" href="#/" aria-label="First Page home">
        first<span>page</span>
      </a>
      <nav className="primary-navigation" aria-label="Primary navigation">
        <a href="#/">Home</a>
      </nav>
      <p className="header-note">A considered space for your next chapter</p>
    </header>
  );
}
