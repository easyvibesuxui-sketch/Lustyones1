# Unlockd showroom

The studio's storefront for subscription-site templates sold to creators. Separate pages under `app/[lang]/(showroom)/`:
home, `templates`, `how-it-works`, `admin`, `pricing`, `faq` and `order` (menu order is in `lib/pages.ts`).
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
| Theme colours, fonts (showroom: Fira Sans Extra Condensed + Lora, outlined numerals in Cormorant), radii | `app/globals.css` (`@theme`) |
| Animations and page transitions | `app/globals.css` (bottom), `components/page-shell.tsx` |
| Country → language map | `lib/i18n/config.ts` |

## Look

Cinematic and dark: each home-page chapter is a blurred photo with the same photo shown sharp through a keyhole
(`components/chapter.tsx`, `components/keyhole.tsx`), big outlined numerals, film grain over everything, and a full-screen
"Menu" (`components/menu-overlay.tsx`). Each template's keyhole photo and backdrop are `scene.webp` and `bg.webp` in
`public/demo/<template>/`; the opening chapter's are in `public/showroom/`.

## Motion

Pages rise in on load (`.animate-rise`), sections fade up as they scroll into view (`.reveal`, CSS scroll-driven
animations; browsers without them just show the content), and moving between pages crossfades through React's
`<ViewTransition>` while the header stays still. The hero unlocks and relocks its preview by itself until the visitor
presses the button. Everything stops for visitors who ask their system for reduced motion.

## Adding the demo images

1. Put each template's images in `public/demo/<template-id>/`, e.g. `public/demo/velvet/avatar.jpg`, `cover.jpg`, `01.jpg` … `09.jpg`.
2. List them in that template's `images` in `lib/templates.ts`:
   ```ts
   images: { avatar: "/demo/velvet/avatar.jpg", cover: "/demo/velvet/cover.jpg", feed: ["/demo/velvet/01.jpg", /* … */] },
   ```
   Tiles 2 and 6 of the grid are shown unblurred as free posts; the rest are blurred. Only use non-nude images in the showroom.
   Blurring here is CSS, so the original file is still downloadable.

Until images are added, the previews use abstract colour placeholders.

## Live demos

`/<lang>/demo/<template>` (e.g. `/en/demo/velvet`) is a full creator page in that template's theme, built from
`components/demo/demo-site.tsx`. Everything is simulated in the browser: the 18+ gate (remembered in `localStorage`),
subscription plans and checkout, a pay-per-view post, the welcome message, tips with a goal bar, and a poll.
Demo pages are marked `noindex`. Their text lives under `demo` in each dictionary.

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
