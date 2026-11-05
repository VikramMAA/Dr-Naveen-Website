# Dr Naveen Govind: website

The personal website of **Dr Naveen Govind, Orthopaedic Surgeon, Kochi** (MBBS, MS (Orthopaedics)). Patient education on knee pain, sports injuries, shoulder problems, joint replacement, keyhole surgery and fractures, with one clear next step: call **96508 59766**.

Built with [Astro](https://astro.build) as a static site. Almost no JavaScript (about 2 KB in total: the mobile menu, the knee map, the print button and the click-to-load video).

Before editing any copy, read [`CONTENT-RULES.md`](CONTENT-RULES.md). Open items are in [`REVIEW.md`](REVIEW.md).

## Run it

Needs Node 22 (see `.nvmrc`).

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321.

## Build and check

```bash
npm run qa
```

That runs, in order:

| Script | What it does |
|---|---|
| `npm run build` | `astro check` (types) then the production build into `dist/` |
| `npm run lint:copy` | Fails on em or en dashes, banned words ("best", "painless", "journey" and so on), spine terms, and any phone number other than 96508 59766 |
| `npm run test:links` | Checks every internal link and `#anchor` in `dist/` |
| `npm run test:schema` | Checks JSON-LD, that FAQ schema matches the visible FAQ, breadcrumbs, one H1 per page, titles, descriptions and internal-link rules |

With `npm run preview` running in another terminal you can also run:

| Script | What it does |
|---|---|
| `npm run test:kneemap` | Knee map positions (Outer side left, Inner side right), keyboard use, and the no-JavaScript fallback |
| `npm run qa:screenshots` | Screenshots at 360, 768 and 1280px into `qa/screenshots/`, failing on horizontal overflow or the call bar covering the footer |
| `npm run qa:lighthouse` | Lighthouse (mobile) on Home, the knee map guide and Contact. Set `CHROME_PATH` if Chrome is not found |

## Deploy to Netlify

1. In Netlify, choose **Add new site, Import an existing project**, and pick this GitHub repository.
2. Netlify reads `netlify.toml`: build command `npm run build`, publish directory `dist`, Node 22. Nothing else to set.
3. Add the real domain under **Domain management**, then update the domain in two places: `src/config/site.ts` (`domain`) and `astro.config.mjs` (`SITE`).

`netlify.toml` also sets the security headers (Content-Security-Policy and others) and long caching for `/_astro/*`. The site works on any static host: upload `dist/`. Pages are built as `about.html` and so on, so the host must serve `/about` from `about.html` (Netlify, Cloudflare Pages and Vercel do this by default).

## Where to edit facts

Every fact lives in **`src/config/site.ts`**: name, qualifications, phone, WhatsApp switch, hospital address, Google Maps link, consultation times, domain, social links, videos and the Malayalam switch. Components read only from this file, so change a fact once and it changes everywhere (pages, footer, schema).

Values in `[SQUARE BRACKETS]` are placeholders. They are hidden on the site until you replace them with a real value.

Common changes:

- **Consultation times:** set `consultationTimes`, for example `'Monday to Saturday, 9am to 1pm'`.
- **Turn on WhatsApp:** set `whatsappEnabled: true` once Dr Naveen confirms the number is on WhatsApp.
- **Social links:** fill in `social.facebook`, `social.instagram`, `social.youtube`, `social.linkedin`. Empty ones are hidden.
- **Malayalam summaries:** set `showMalayalam: true` only after a native speaker and Dr Naveen approve every block.
- **Analytics:** off by default. To use Plausible, set `analytics.provider: 'plausible'` and `plausibleDomain`, and add `https://plausible.io` to `script-src` and `connect-src` in `netlify.toml`. For Netlify Analytics (server-side, no script), set `provider: 'netlify'` and enable it in Netlify.

## Add a video

Add an entry to `videos` in `src/config/site.ts`, newest first:

```ts
videos: [
  { id: 'YOUTUBE_ID', title: 'Knee pain: just age?', date: '2026-11-20', language: 'Malayalam' },
],
```

The first video appears on the Home page and on the "just age" video guide. All videos appear on `/videos`. Video schema is added automatically.

## Add a patient guide

1. Copy a file in `src/content/guides/` and rename it to the new slug, for example `knee-swelling.mdx`.
2. Edit the frontmatter (the block between `---` lines). Required: `title` (the question people type), `seoTitle`, `description` (under 155 characters), `slug`, `updated`, `reviewStatus: pending`, `shortAnswer`, `conditionPath` and `conditionLabel` (the "What I treat" page it belongs to), `faqs`, `relatedGuides`, `sources`.
3. Write the body in Markdown. Components such as `Checklist`, `KneeUrgent` and `MythFactPair` can be imported at the top (see the existing guides).
4. Run `npm run qa`. The guide appears on `/guides` automatically, with its schema.

Condition pages work the same way in `src/content/conditions/`.

## Replace the headshot and hospital logo

- Headshot: save the photo as `src/assets/dr-naveen-headshot.jpg` (portrait, at least 1000px wide, shoulders up). It replaces the placeholder on Home and About and is optimised automatically (AVIF, responsive sizes).
- Welcare logo: save it as `src/assets/welcare-logo.png`, only after written permission from the hospital. It shows only in "Where I consult" and on Contact.

No code changes are needed for either.

## Approve a page (pending to approved)

When Dr Naveen has reviewed a page, open its `.mdx` file and change:

```yaml
updated: 2026-12-01      # the date he reviewed it
reviewStatus: approved
```

The page then shows "Reviewed by Dr Naveen Govind, MBBS, MS (Orthopaedics). Last reviewed ..." and its schema gains `lastReviewed` and `reviewedBy`. Pending pages show "Last updated" only. Tick it off in `REVIEW.md`.

## Project layout

```
src/config/site.ts        all facts and placeholders
src/content/conditions/   six "What I treat" pages (MDX)
src/content/guides/       six patient guides (MDX)
src/content.config.ts     frontmatter schema (zod)
src/data/kneeZones.ts     knee map zone text (approved, word for word)
src/components/           UI components
src/layouts/BaseLayout.astro  head, meta, schema, header, footer, call bar
src/lib/                  schema.org builders, OG image and favicon rendering
src/pages/                routes
src/styles/tokens.css     the only colours and type sizes
scripts/                  QA scripts
```
