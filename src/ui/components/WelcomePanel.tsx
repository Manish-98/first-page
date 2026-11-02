export default function WelcomePanel() {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <p className="eyebrow">CV BUILDER</p>
      <h1 id="welcome-title">
        Your experience, <em>beautifully</em> told.
      </h1>
      <p className="intro">
        A focused workspace for shaping your next opportunity. Your CV stays
        on your device, and you stay in control.
      </p>
      <p className="status-note" role="status">
        Your workspace is ready for the next step. CV editing tools are coming
        soon.
      </p>
    </section>
  );
}
