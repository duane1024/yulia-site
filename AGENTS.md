# Repository Guidelines

## Project Structure & Module Organization

This is a static site for `yuliamiller.com`, deployed through Cloudflare Pages.

- `index.html` is the home page and contains contact methods plus the Zocdoc booking widget.
- `insurances/index.html` and `education/index.html` are secondary content pages.
- `styles.css` is the shared stylesheet for all pages.
- `images/` contains site assets such as `logo.jpg` and `headshot.png`.
- `robots.txt` and `sitemap.xml` should be updated when public routes change.

There is no build system or package manifest in this repository. Keep changes simple and static unless a toolchain is intentionally introduced.

## Build, Test, and Development Commands

- `python3 -m http.server 8000` serves the static files locally at `http://localhost:8000`.
- `npx wrangler pages dev .` previews the site with Cloudflare Pages behavior when Wrangler is available.
- `git status --short` checks the working tree before committing.

Cloudflare Pages deploys automatically when changes are pushed to `main`.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript. Match the existing plain HTML/CSS style: semantic sections, shared classes, and CSS custom properties in `:root` for colors and fonts. Prefer lowercase, hyphenated class names such as `site-nav`, `nav-booking`, and `contact-method`.

Keep JavaScript dependency-free. The Zocdoc widget code should retain `referrerType=widget` in its booking URL.

## Testing Guidelines

There is no automated test suite. Manually verify:

- Each page loads locally and navigation links resolve correctly.
- Layout remains readable on mobile and desktop widths.
- The Zocdoc Book Online button remains visible while scrolling.
- The Zocdoc widget script includes `data-static-as-sticky-bob` so it does not inject a duplicate sticky button.
- The Zocdoc booking URL includes `referrerType=widget`.

For content or SEO changes, check `title`, `meta description`, canonical URL, `sitemap.xml`, and `robots.txt` as applicable.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries, for example `Fix headshot crop` or `Update README`. Follow that style and keep commits focused.

Pull requests should include a brief summary, affected pages or files, manual test notes, and screenshots for visual changes. For booking widget changes, mention whether the Zocdoc modal was tested on desktop and mobile.

## Security & Configuration Tips

Do not commit secrets. Keep user-submitted contact data out of logs except for minimal error diagnostics if any server-side forms are reintroduced.
