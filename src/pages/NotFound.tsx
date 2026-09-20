import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="wrap">
      <h1>Not found</h1>
      <p className="muted">That page does not exist.</p>
      <p>
        <Link to="/">← Home</Link>
      </p>
    </section>
  );
}
