# Contact form setup

The form keeps the destination email out of the page source. It is delivered by the Cloudflare Worker to your verified Cloudflare Email Routing destination after Turnstile verification.

## 1. Create a Turnstile widget

In Cloudflare, create a Turnstile widget for `abdiel.works` and `www.abdiel.works`.

## 2. Enable Cloudflare Email Routing

In Cloudflare, go to **Compute > Email Service > Email Routing**.

1. Enable Email Routing for `abdiel.works` and allow Cloudflare to add its DNS records.
2. Under **Destination addresses**, add the inbox that should receive form submissions.
3. Open the verification message Cloudflare sends and verify that inbox.

You do not need to create a public `contact@abdiel.works` address or a routing rule for the form.

## 3. Add Worker secrets

Run these from this repository. The values are stored by Cloudflare and are not committed to Git.

```bash
npx wrangler secret put TURNSTILE_SITE_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put CONTACT_FROM_EMAIL
npx wrangler secret put CONTACT_TO_EMAIL
```

`CONTACT_FROM_EMAIL` is the sender shown in your inbox, for example `contact@abdiel.works`.

`CONTACT_TO_EMAIL` is the verified Cloudflare Email Routing destination inbox that receives submissions.

## 4. Deploy

Deploy through the usual Cloudflare workflow after the secrets are set.

## Notes

- Turnstile is validated server-side before an email can be sent.
- Cloudflare's native `EMAIL` Worker binding delivers the form submission. No external email service or API key is used.
- A hidden honeypot field catches basic form bots.
- Do not put the destination email back into the footer or JSON-LD.
