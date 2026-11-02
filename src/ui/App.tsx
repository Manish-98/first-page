export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="wordmark" href="./" aria-label="First Page home">
          first<span>page</span>
        </a>
        <span className="header-note">A considered space for your next chapter</span>
      </header>

      <section className="welcome" aria-labelledby="welcome-title">
        <p className="eyebrow">CV BUILDER</p>
        <h1 id="welcome-title">Your experience, <em>beautifully</em> told.</h1>
        <p className="intro">
          A focused workspace for shaping your next opportunity. Your CV stays
          on your device, and you stay in control.
        </p>
        <p className="status-note">Your workspace is being prepared.</p>
      </section>

      <footer className="app-footer">
        <span>FIRST PAGE</span>
        <span>Local-first · Private by design</span>
      </footer>
    </main>
  );
}
