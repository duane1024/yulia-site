# yulia-site

Static site for [yuliamiller.com](https://yuliamiller.com) — Yulia Miller LCSW, Psychotherapy.

Deployed via **Cloudflare Pages** with automatic deployment on push to `main`.

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

Uses a Cloudflare Pages Function (`functions/api/contact.js`) to relay form submissions via [Resend](https://resend.com).

Set the following environment variables in the Cloudflare Pages dashboard:

| Variable         | Value                              |
|------------------|------------------------------------|
| `RESEND_API_KEY` | Your Resend API key                |
| `CONTACT_EMAIL`  | Destination email for submissions  |

## DNS Cutover (GoDaddy → Cloudflare)

1. Add `yuliamiller.com` to Cloudflare (free plan)
2. Cloudflare will scan existing DNS records
3. Update nameservers at GoDaddy to Cloudflare's NS
4. In Cloudflare Pages: add custom domain `yuliamiller.com`
5. SSL cert issued automatically
