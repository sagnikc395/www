import { READING_STATUS_MARK, readingByMonth } from "@/content/reading";
import { LinkPreviews } from "@/components/LinkPreviews";

export function ReadingList() {
  const months = readingByMonth();

  return (
    <section className="wrap">
      <h1>Reading</h1>
      <p className="muted">What I am reading, have read, and mean to read.</p>

      <LinkPreviews className="references">
        <h2 className="reading-section">Papers &amp; books</h2>

        {months.map(({ month, items }, i) => (
          // The most recent month starts open; older ones collapse.
          <details className="reading-month" key={month} open={i === 0}>
            <summary>{month}</summary>
            <ul className="entries">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`reading-item${item.status === "done" ? " is-done" : ""}`}
                >
                  <span aria-hidden="true" className="faint">
                    {READING_STATUS_MARK[item.status]}
                  </span>
                  <span>
                    {item.href ? (
                      <a className="entry-link" href={item.href} rel="external" data-preview="">
                        {item.title}
                      </a>
                    ) : (
                      <span className="entry-link entry-title">{item.title}</span>
                    )}
                    {item.author && <span className="entry-meta"> · {item.author}</span>}
                    <span className="sr-only">{` (${item.status})`}</span>
                    {item.note && <p className="entry-note small">{item.note}</p>}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </LinkPreviews>
    </section>
  );
}
