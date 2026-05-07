# Repository Guidelines

## Project Structure & Module Organization

This is a static site for `yuliamiller.com`, deployed through Cloudflare Pages.

- `index.html` is the home page and contains the contact form client script.
- `insurances/index.html` and `education/index.html` are secondary content pages.
- `styles.css` is the shared stylesheet for all pages.
- `images/` contains site assets such as `logo.jpg` and `headshot.png`.
- `functions/api/contact.js` is the Cloudflare Pages Function for `POST /api/contact`.
- `robots.txt` and `sitemap.xml` should be updated when public routes change.

There is no build system or package manifest in this repository. Keep changes simple and static unless a toolchain is intentionally introduced.

## Build, Test, and Development Commands

- `python3 -m http.server 8000` serves the static files locally at `http://localhost:8000`.
- `npx wrangler pages dev .` previews the site with Cloudflare Pages Functions, including `/api/contact`, when Wrangler is available.
- `git status --short` checks the working tree before committing.

Cloudflare Pages deploys automatically when changes are pushed to `main`.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript. Match the existing plain HTML/CSS style: semantic sections, shared classes, and CSS custom properties in `:root` for colors and fonts. Prefer lowercase, hyphenated class names such as `site-nav`, `contact-form`, and `form-status`.

Keep JavaScript dependency-free. In `functions/api/contact.js`, use the Cloudflare Pages Function shape already present: `export async function onRequestPost(context)`.

## Testing Guidelines

There is no automated test suite. Manually verify:

- Each page loads locally and navigation links resolve correctly.
- Layout remains readable on mobile and desktop widths.
- Contact form validation requires name and email.
- `/api/contact` returns expected JSON responses when tested through Wrangler.

For content or SEO changes, check `title`, `meta description`, canonical URL, `sitemap.xml`, and `robots.txt` as applicable.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries, for example `Fix headshot crop` or `Update README`. Follow that style and keep commits focused.

Pull requests should include a brief summary, affected pages or files, manual test notes, and screenshots for visual changes. For contact form changes, mention whether `RESEND_API_KEY` and `CONTACT_EMAIL` behavior was tested or only code-reviewed.

## Security & Configuration Tips

Do not commit secrets. Configure `RESEND_API_KEY` and `CONTACT_EMAIL` in the Cloudflare Pages dashboard. Keep user-submitted contact data out of logs except for minimal error diagnostics.
