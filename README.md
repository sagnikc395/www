# Flexoki personal-site template — React + TypeScript

The visual system of `sagnikc395.github.io`, rebuilt as a Vite + React 19 +
TypeScript starter. Copy the folder, edit `src/site.config.ts` and `src/content/`,
ship.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  →  dist/
npm run typecheck
```

## Layout

```
index.html              no-flash theme script + mount point
vite.config.ts          "@/" alias → src/, base for GH Pages
src/
  site.config.ts        name, email, nav, social — edit this first
  main.tsx              BrowserRouter mount
  App.tsx               routes
  styles/style.css      the entire design system (~180 lines, plain CSS)
  lib/theme.ts          useTheme(): system | light | dark, persisted
  lib/search.ts         in-memory index + ranking for the ⌘K dialog
  lib/previews.ts       href → hover-card metadata registry
  components/
    Layout.tsx          header + <Outlet/> + footer, scroll reset
    SiteHeader.tsx      pipe-separated inline nav
    SiteFooter.tsx
    ThemePicker.tsx     dropdown, closes on outside-click and Escape
    SearchTrigger.tsx   the ⌘K affordance + global shortcut
    SearchDialog.tsx    the overlay itself (portal, listbox, keyboard nav)
    LinkPreviews.tsx    <LinkPreviews> delegation wrapper + <PreviewLink>
    EntryList.tsx       the post/project list primitive
    Prose.tsx           <Prose> and <ProseHtml html={...}> long-form wrapper
  content/
    posts.ts            typed post metadata
    projects.ts         typed project metadata
    reading.ts          reading list, grouped by month
  pages/                Home, Blog, Post, Projects, ReadingList, NotFound
public/assets/          placeholder portrait.svg and figure.svg
```

## The rules the style encodes

- **One column, 44rem.** `--measure`. Every page is `.wrap`. No sidebars, no grids.
- **No decoration.** Zero `border-radius`, zero shadows, no cards, no gradients,
  no borders-as-containers. Hairline `--rule` separates everything.
- **Four type sizes**: 1.6 / 1.2 / 1.05 / 1rem, plus `.small` at .87rem.
  Hierarchy comes from `font-weight: 700` and the `--fg` / `--muted` / `--faint`
  color ramp, never from scaling text up.
- **Denser on desktop**: root font-size drops 16px → 15px above 40rem. Deliberate.
- **System font stack.** Monospace (`ui-monospace`) only for code.
- **Links are underlined** at `text-underline-offset: 2px`. Never color-only.
- **Prose over bullets** in intro sections; bullets only for lists of links.

## Color tokens (Flexoki)

|  | light | dark |
|---|---|---|
| `--bg` | `#fffcf0` | `#100f0f` |
| `--fg` | `#100f0f` | `#cecdc3` |
| `--muted` | `#6f6e69` | `#878580` |
| `--faint` | `#878580` | `#6f6e69` |
| `--rule` | `#dad8ce` | `#343331` |
| `--link` | `#bc5215` (orange) | `#8b7ec8` (purple) |
| `--mark` | `#f6e2a0` | `#3a2d04` |
| `--code-bg` | `#f2f0e5` | `#1c1b1a` |

Never hardcode a color in a component — use the tokens so dark mode follows for free.

## Theming contract

Three states: **system** (no attribute, follows `prefers-color-scheme`), **light**
(`data-theme="light"`), **dark** (`data-theme="dark"`). Dark values are declared
twice in `style.css` — once under the media query guarded by
`:root:not([data-theme="light"])`, once under `:root[data-theme="dark"]` — so an
explicit choice wins in both directions.

`useTheme()` owns the runtime state; the inline `<head>` script in `index.html`
handles first paint. They share the `"theme"` localStorage key — change one and you
must change the other, or you reintroduce the flash.

## Class vocabulary

Layout `.wrap` · Text `.small` `.muted` `.faint` ·
Header `.site-header` `.site-nav` `.sep` `a[aria-current=page]` ·
Theme `.theme-picker` `.theme-toggle` `.theme-menu` ·
Intro `.intro` `.intro-photo` (floats right ≥34rem) ·
Lists `.entries` `.entry-title` `.entry-meta` `.entry-note` ·
Inline pairs `.kv` · Article body `.md-output` · Footer `.site-footer` `.note-back`

## Search (⌘K)

`src/lib/search.ts` builds one flat index from `content/*` plus a hand-listed
array of static pages. Add a content module and you must add it to `searchIndex`
too — nothing discovers it automatically.

Matching is case-folded substring, not fuzzy or token-based: the corpus is a few
hundred short documents, so a real index would cost more to ship than it saves.
Title hits outrank body hits, earlier positions outrank later ones, and shorter
titles win ties. Body matches render a ±60-character snippet with `<mark>` on the
match. If the corpus ever grows past a few thousand entries, swap the `search()`
body for MiniSearch or FlexSearch — the `SearchHit` shape is the seam.

Keyboard: ⌘K / Ctrl-K toggles, ↑↓ move, ↵ opens (new tab for external hits),
Escape closes. The dialog is a portal with `role="dialog"`, an ARIA listbox, and
background scroll locked while open.

## Link previews

Register an href in `src/lib/previews.ts`, then mark the link with `data-preview`
— either by hand or via `<PreviewLink href="…">`. Links *not* in the registry
render no popup, so the dotted underline never promises a card that isn't there.

`<LinkPreviews>` delegates from a container rather than wrapping each anchor, so
it works on JSX children and on `dangerouslySetInnerHTML` output alike — that is
why `<Prose>` gets previews for free. Mouse hovers open after 120ms; keyboard
focus opens immediately; below 34rem the card docks to the bottom edge
(`.link-popup--pinned`) with a Close button, and the first tap previews instead of
navigating. Scrolling closes a floating card rather than repositioning it.

## Reading list

`src/content/reading.ts` holds the items; `readingByMonth()` groups them
preserving first-appearance order. Each month is a `<details>` — the most recent
starts open. Status is `reading | done | queued`, rendered as a faint glyph, with
`done` struck through via `.reading-item.is-done`. Status is also announced to
screen readers, since the glyph alone is decorative.

## Adding a post

1. Append an entry to `src/content/posts.ts`.
2. Render the body however you like — hand-written JSX inside `<Prose>`, or
   `<ProseHtml html={...} />` if you build markdown to HTML.

For MDX instead, add `@mdx-js/rollup` to `vite.config.ts` and render the MDX default
export inside `<Prose>`; the CSS needs no changes since `.md-output` styles bare
elements.

## Deploying to GitHub Pages

Set `base: "/<repo-name>/"` in `vite.config.ts` for a project site (leave `"/"` for
a `USER.github.io` repo). Because this uses `BrowserRouter`, deep links need a
`404.html` that mirrors `index.html`, or switch to `HashRouter` in `src/main.tsx`.

## Syntax highlighting

`.md-output pre` is already styled. For [Shiki](https://shiki.style) with dual
themes, keep `background: var(--code-bg)` on `pre.shiki` and flip the
`--shiki-dark` variables under the same two dark-mode selectors used for tokens.
