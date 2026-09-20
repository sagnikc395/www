import { Fragment } from "react";
import { site } from "@/site.config";

export function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {site.social.map((link) => (
          <Fragment key={link.href}>
            {" · "}
            <a rel="external" href={link.href}>
              {link.label}
            </a>
          </Fragment>
        ))}
      </p>
      <p className="muted">Last updated: {site.lastUpdated}.</p>
    </footer>
  );
}
