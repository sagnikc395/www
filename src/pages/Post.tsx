import { Link, useParams } from "react-router";
import { Prose } from "@/components/Prose";
import { PreviewLink } from "@/components/LinkPreviews";
import { findPost } from "@/content/posts";
import { NotFound } from "@/pages/NotFound";

export function Post() {
  const { slug } = useParams();
  const post = findPost(slug);
  if (!post) return <NotFound />;

  return (
    <article className="wrap">
      <h1>{post.title}</h1>
      <p className="entry-meta small">{post.date}</p>

      {/* Replace this body with your rendered markdown — see ProseHtml. */}
      <Prose>
        <p>
          Opening paragraph. Long-form body runs at line-height 1.6 with wider
          paragraph margins than the index page.
        </p>

        <h2>A section</h2>
        <p>
          Inline <code>code</code> sits on a tinted background. A{" "}
          <a href="#top">link</a> is underlined, never colored-only. Text can be{" "}
          <mark>highlighted</mark>. A link registered in{" "}
          <code>src/lib/previews.ts</code> gets a dotted underline and a hover
          card, like{" "}
          <PreviewLink href="https://transformer-circuits.pub/2022/toy_model/index.html">
            Toy Models of Superposition
          </PreviewLink>
          .
        </p>

        <blockquote>
          <p>A quotation. Muted, with a hairline rule on the left.</p>
        </blockquote>

        <pre>
          <code>{`def circuit(x):
    return x @ W_in @ W_out`}</code>
        </pre>

        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>AUROC</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Linear probe</td>
              <td>0.866</td>
              <td>ranks well</td>
            </tr>
            <tr>
              <td>SAE feature</td>
              <td>0.841</td>
              <td>costlier</td>
            </tr>
          </tbody>
        </table>

        <figure>
          <img src="/assets/figure.svg" alt="Description of the figure" />
          <figcaption>Captions are small and muted.</figcaption>
        </figure>
      </Prose>

      <p className="note-back">
        <Link to="/blog">← All posts</Link>
      </p>
    </article>
  );
}
