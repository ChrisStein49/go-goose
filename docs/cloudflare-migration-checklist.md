# Hosting on Cloudflare: migration checklist

For Go Goose (Gänseschar), and a template for future ganzgraz apps. The app is a plain static
site: `npm run build` produces the `dist` folder, with no server code and no redirect rules.
That is why moving from Netlify is mostly dashboard settings, not code changes.

## Can Netlify and Cloudflare run in parallel?

Yes. Both only read the GitHub repository, and each one builds and deploys on every push to
`main` independently. They do not interfere with each other:

- `netlify.toml` is ignored by Cloudflare, and Cloudflare's own settings are ignored by Netlify.
- Each service gets its own URL (`...netlify.app` and `...pages.dev` or `...workers.dev`).
- Only one of them should own the final custom domain at a time.

Recommended: run both during the switch, compare, then disconnect Netlify (step 9).

## Before you start (decisions)

- [ ] Which Cloudflare product: Cloudflare currently steers new static sites to Workers
      (static assets); Pages is the older option. Either works for this app. Use whichever
      the dashboard offers for "connect a Git repository".
- [ ] Which address will players use? (a ganzgraz.at subdomain or a separate domain)
- [ ] Is the DNS of that domain already on Cloudflare? If not, a CNAME at the current DNS
      provider is enough.
- [ ] Who owns the Cloudflare account, and who can approve the GitHub connection?

## 1. Connect the repository

- [ ] In Cloudflare, create a new project from Git and install the Cloudflare GitHub app.
      Grant it access to this one repository only.
- [ ] Production branch: `main`. Preview deployments for other branches are optional.

## 2. Build settings

- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: set the environment variable `NODE_VERSION` = `24` (same as `netlify.toml`).
      A `.node-version` file containing `24` in the repo would also work on both hosts.
- [ ] No other environment variables are needed. The app has no secrets or API keys.

## 3. First deploy and smoke test (on the temporary Cloudflare URL)

- [ ] The build finishes green.
- [ ] Main menu, Play, a level, Today's Challenge, How to Play and Credits all open.
- [ ] EN and DE both work. The browser tab title and the favicon are correct.
- [ ] Credits: logo, newsletter and member buttons, Imprint and Privacy Policy links open the
      right pages in a new tab.
- [ ] Install-to-home-screen still works on a phone (manifest and icons load).

Important: progress, stars, language and the daily streak live in the browser's localStorage,
which is separate for every address. Players who switch to the new address start fresh. There
is no migration in code, so announce the new address, or keep the same domain from the start.

## 4. Privacy check: no third-party requests

- [ ] Open the Cloudflare URL, press F12 and run in the Console, after reloading the page and
      visiting Credits:
      `[...new Set(performance.getEntriesByType('resource').map(r => new URL(r.name).host))]`
      The result must contain only the app's own host.
- [ ] Nothing was added by Cloudflare itself: no Web Analytics beacon, Rocket Loader, email
      obfuscation or Zaraz script in the page source. Keep those features off unless the team
      decides otherwise (and then update the privacy policy).

## 5. Optional hardening: security headers

A file `public/_headers` is read by both Netlify and Cloudflare, so one file covers both hosts.
Suggested starting point (test with `Content-Security-Policy-Report-Only` first, then switch to
the enforcing header):

```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://ganzgraz.at https://*.ganzgraz.at
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
```

`'unsafe-inline'` for styles is needed because the game board sets styles directly. This policy
is a proposal and has not been tested on the live site yet.

## 6. Data protection (for the team to confirm; this is not legal advice)

- [ ] Every host sees visitor IP addresses in its server logs. Make sure the hosting agreement
      (data processing addendum) with Cloudflare is in place.
- [ ] The privacy policy (Datenschutzerklärung) on ganzgraz.at names the hosting provider.

## 6b. Embedding on ganzgraz.at/spiel (iframe)

The game is shown on ganzgraz.at inside an iframe (like the ad booking tool and the event
calendar), so no DNS change in the we.publish Cloudflare account is needed.

```html
<iframe src="https://<cloudflare-url>/#heute"
  style="width:100%;height:85vh;border:0"
  allow="web-share; clipboard-write" title="Gänseschar"></iframe>
```

- `#heute` opens Today's Challenge directly; leave it off to start at the main menu.
- `allow="web-share; clipboard-write"` is required, otherwise the share button is blocked
  inside the frame.
- `public/_headers` sets `frame-ancestors` so only ganzgraz.at may embed the game.
- The share button always links to https://ganzgraz.at/spiel (fixed in code). Promote only that
  address; localStorage (progress, streak) is separate for the embedded and the direct URL.
- Test on a phone: the board should fill roughly one screen inside the frame.

## 7. Custom domain

- [ ] Add the domain to the Cloudflare project, create or confirm the DNS record, and wait for
      the HTTPS certificate.
- [ ] Lower the DNS TTL a day in advance so a rollback is quick.

## 8. Switch over

- [ ] Re-run steps 3 and 4 on the final domain.
- [ ] Update every place that links to the old address: ganzgraz.at, newsletter, QR codes,
      messages to colleagues.

## 9. Retire Netlify (only when satisfied)

- [ ] Keep the Netlify site for a few days as a fallback. Rolling back means pointing the DNS back.
- [ ] Then stop its auto-deploys (or delete the site) so each push is not built twice.
- [ ] Optionally remove `netlify.toml` from the repo.

## For future apps

Repeat steps 1-4 per app. Before the first deploy of any app: self-host fonts and other assets
(no Google Fonts or CDN links), keep localStorage keys unique per app, and run the privacy
check from step 4.
