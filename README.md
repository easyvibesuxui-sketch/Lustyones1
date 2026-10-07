# Unlockd showroom

The studio's storefront: a landing page and a template listing for subscription-site templates sold to creators.
Six languages (en, de, es, pt, ru, uk); visitors get theirs automatically.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to change things

| What | File |
|---|---|
| Studio name, domain, email, Telegram | `lib/site.ts` |
| Templates (names, colours, demo creator, price) | `lib/templates.ts` |
| All page text, per language | `lib/i18n/dictionaries/<lang>.ts` (`en.ts` defines the shape) |
| Theme colours, fonts, radii | `app/globals.css` (`@theme`) |
| Country → language map | `lib/i18n/config.ts` |

## Adding the demo images

1. Put each template's images in `public/demo/<template-id>/`, e.g. `public/demo/velvet/avatar.jpg`, `cover.jpg`, `01.jpg` … `09.jpg`.
2. List them in that template's `images` in `lib/templates.ts`:
   ```ts
   images: { avatar: "/demo/velvet/avatar.jpg", cover: "/demo/velvet/cover.jpg", feed: ["/demo/velvet/01.jpg", /* … */] },
   ```
   Tiles 2 and 6 of the grid are shown unblurred as free posts; the rest are blurred. Only use non-nude images in the showroom.
   Blurring here is CSS, so the original file is still downloadable.

Until images are added, the previews use abstract colour placeholders.

## How the language is chosen

`proxy.ts` redirects any path without a language prefix (`/`, `/templates`) to `/<lang>/…`, picking in this order:

1. the `NEXT_LOCALE` cookie, set when the visitor picks a language in the switcher;
2. the visitor's country from the host's header: `x-vercel-ip-country` (Vercel), `cf-ipcountry` (Cloudflare) or `cloudfront-viewer-country` (AWS);
3. the browser's `Accept-Language`;
4. English.

Country detection only works behind one of those hosts; locally it falls through to the browser language.
Countries not in the map (e.g. Georgia, the US) use step 3.
