import type { ReactNode } from "react";
import { Link } from "react-router";

export type Entry = {
  title: string;
  href: string;
  /** Date for posts, year for projects — rendered muted after the title. */
  meta?: string;
  /** Optional second line of muted description. */
  note?: string;
  /** Posts put the date on its own line; projects keep it inline. */
  metaOnNewLine?: boolean;
  external?: boolean;
};

export function EntryList({ entries }: { entries: readonly Entry[] }) {
  return (
    <ul className="entries">
      {entries.map((entry) => (
        <li key={entry.href}>
          <EntryLink entry={entry} />
          {entry.meta &&
            (entry.metaOnNewLine ? (
              <>
                <br />
                <span className="entry-meta small">{entry.meta}</span>
              </>
            ) : (
              <span className="entry-meta"> · {entry.meta}</span>
            ))}
          {entry.note && <p className="entry-note">{entry.note}</p>}
        </li>
      ))}
    </ul>
  );
}

function EntryLink({ entry }: { entry: Entry }): ReactNode {
  if (entry.external) {
    return (
      <a href={entry.href} rel="external">
        {entry.title}
      </a>
    );
  }
  return <Link to={entry.href}>{entry.title}</Link>;
}
