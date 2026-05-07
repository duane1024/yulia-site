# yulia-site

Static site for [yuliamiller.com](https://yuliamiller.com) — Yulia Miller LCSW, Psychotherapy.

Deployed via **Cloudflare Pages** with automatic deployment on push to `master`.

## Structure

```
index.html          — Home page (bio + contact form)
insurances/         — Fees & Insurance page
education/          — Education & Credentials page
images/             — headshot, logo
styles.css          — Shared stylesheet
functions/
  api/
    contact.js      — Cloudflare Pages Function for contact form (POST /api/contact)
```

## Contact Form

Uses a Cloudflare Pages Function (`functions/api/contact.js`) to relay form submissions via the Gmail API using an OAuth refresh token.

Set the following environment variables in the Cloudflare Pages dashboard:

| Variable              | Value |
|-----------------------|-------|
| `GMAIL_CLIENT_ID`     | OAuth client id for the Gmail account |
| `GMAIL_CLIENT_SECRET` | OAuth client secret for the Gmail account |
| `GMAIL_REFRESH_TOKEN` | Refresh token with `gmail.send` access |
| `GMAIL_FROM_EMAIL`    | Gmail address used as sender (typically `millery212@gmail.com`) |
| `CONTACT_EMAIL`       | Delivery destination (typically `millery212@gmail.com`) |

Notes:
- `GMAIL_FROM_EMAIL` must match the authenticated Gmail account or an allowed Gmail "send as" alias.
- The contact form sets the visitor's address as `Reply-To`, so replies still go back to the person who filled out the form.
- A practical way to get the refresh token is to reuse the existing Gmail OAuth app credentials already used elsewhere, then mint a refresh token once with `https://www.googleapis.com/auth/gmail.send` scope.

## DNS Cutover (GoDaddy → Cloudflare)

1. Add `yuliamiller.com` to Cloudflare (free plan)
2. Cloudflare will scan existing DNS records
3. Update nameservers at GoDaddy to Cloudflare's NS
4. In Cloudflare Pages: add custom domain `yuliamiller.com`
5. SSL cert issued automatically
