import { Fragment } from "react";
import { NavLink, Link } from "react-router";
import { SearchTrigger } from "@/components/SearchTrigger";
import { ThemePicker } from "@/components/ThemePicker";
import { site } from "@/site.config";

/** Nav is inline text separated by hairline-colored pipes — not a button bar. */
export function SiteHeader() {
  return (
    <header className="wrap site-header">
      <h1>
        <Link to="/">{site.name}</Link>
      </h1>
      <nav className="site-nav">
        {site.nav.map((item) => (
          <Fragment key={item.href}>
            {"external" in item && item.external ? (
              <a href={item.href} rel="external">
                {item.label}
              </a>
            ) : (
              <NavLink to={item.href}>{item.label}</NavLink>
            )}
            <span className="sep" aria-hidden="true">
              |
            </span>
          </Fragment>
        ))}
        <SearchTrigger />
        <span className="sep" aria-hidden="true">
          |
        </span>
        <ThemePicker />
      </nav>
    </header>
  );
}
