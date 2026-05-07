# yulia-site

Static site for [yuliamiller.com](https://yuliamiller.com) — Yulia Miller LCSW, Psychotherapy.

Deployed via **Cloudflare Pages** with automatic deployment on push to `main`.

## Structure

```
index.html          — Home page (bio + contact methods)
insurances/         — Fees & Insurance page
education/          — Education & Credentials page
images/             — headshot, logo
styles.css          — Shared stylesheet
```

## Direct Booking

Zocdoc's Book Online widget is embedded on every public page so patients can schedule while browsing the site. Keep `referrerType=widget` in the Zocdoc URL to preserve tracking and avoid online scheduling charges.

The widget script uses `data-static-as-sticky-bob` so Zocdoc treats the static button as the persistent sticky booking control instead of injecting a second sticky button.

The appointment request form was removed to keep scheduling in one place. The contact section now lists direct text and email methods for questions before booking.

## DNS Cutover (GoDaddy → Cloudflare)

1. Add `yuliamiller.com` to Cloudflare (free plan)
2. Cloudflare will scan existing DNS records
3. Update nameservers at GoDaddy to Cloudflare's NS
4. In Cloudflare Pages: add custom domain `yuliamiller.com`
5. SSL cert issued automatically
