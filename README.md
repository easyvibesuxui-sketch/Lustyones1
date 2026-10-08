# Unlockd showroom

The studio's storefront: a landing page and a template listing for subscription-site templates sold to creators.
Six languages (en, de, es, pt, ru, uk); visitors get theirs automatically. Hosted on GitHub Pages.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build   # static site in out/
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

The site is static (GitHub Pages), so the choice happens in the browser.
`/` and `/templates` are small redirect pages (`app/(redirect)/`) that send the visitor to `/<lang>/…`, picking in this order (`lib/i18n/detect-locale.ts`):

1. the language they picked earlier in the switcher (saved in `localStorage`);
2. their country by IP, from the free `api.country.is` service (1.5 s timeout; the visitor's IP is sent to that service);
3. their time zone;
4. their browser language;
5. English.

Countries and time zones not in the maps in `lib/i18n/config.ts` (e.g. Georgia, the US) fall through to the browser language.

## Deploying

Every push to `claude/nifty-ritchie-wp6v2n` or `main` runs `.github/workflows/pages.yml`, which builds the static site (`out/`) and publishes it to
https://easyvibesuxui-sketch.github.io/Lustyones/

The repository's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment → Source).
