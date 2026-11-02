export default function NotFoundPage() {
  return (
    <section className="welcome not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1 id="not-found-title">This page isn’t here.</h1>
      <p className="intro">
        The address may be incorrect, or this page may not be part of the
        current workspace.
      </p>
      <a className="home-link" href="#/">
        Return to the home page
      </a>
    </section>
  );
}
