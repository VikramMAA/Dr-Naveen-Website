# Plan: Dr Naveen Govind website (v1)

## Status
Building PART 1 (sections 0-6 of the brief) now: scaffold, design tokens, shared
components, knee map. PART 2 (exact page content, SEO/schema, perf/a11y/privacy
rules, QA checklist) is expected in a follow-up message before pages, SEO work
and final QA are done.

## Stack
- Astro (latest stable, `output: "static"`), no UI framework, near-zero JS.
- Plain CSS: `src/styles/tokens.css` (custom properties only), `src/styles/global.css`
  (resets, type scale, layout helpers), component-scoped `<style>` blocks.
- Content collections: `src/content/guides`, `src/content/conditions` (Markdown/MDX),
  typed with a zod schema in `src/content/config.ts`.
- Single fact/config source: `src/config/site.ts`. Every component/page reads
  phone numbers, address, socials, flags, etc. from here, never hard-coded twice.
- Fonts self-hosted via `@fontsource-variable/manrope` and
  `@fontsource/noto-sans-malayalam` (no Google Fonts runtime request).
- Hosting target: Netlify (`netlify.toml`), but must work on any static host.
- Node LTS pinned via `.nvmrc`.

## Routes (final set confirmed once Part 2 arrives; scaffolding now)
- `/` Home
- `/about` About Dr Naveen
- `/what-i-treat` overview + condition detail pages (content collection `conditions`)
- `/patient-guides` index + guide detail pages (content collection `guides`)
- `/videos`
- `/planning-from-abroad`
- `/contact`
- `/medical-disclaimer`
- `/privacy`
- 404

## Components (built now, per section 4.3/4.4/6 of the brief)
Layout: `BaseLayout`, `Header`, `Footer`, `MobileCallBar`, `MobileMenu`.
Content: `Button`, `CallButton`, `Card`, `ConditionCard`, `UrgentBlock`,
`MythFactPair`, `Checklist`, `QuestionList`, `ComparisonTable`, `KneeMap`,
`VideoEmbed`, `Disclaimer`, `Breadcrumbs`, `FAQ`, `MalayalamSummary`,
`SectionHeading`.
Icons/illustrations: inline SVG set in `src/components/icons/` and
`src/components/illustrations/` (knee front view, shoulder joint, knee+shoulder
pair, small line icons).

## Build stages
1. Scaffold + config files + design tokens (this stage).
2. Layout and shared components, incl. KneeMap.
3. Pages and content collections (needs Part 2 content).
4. SEO, JSON-LD schema, sitemap (needs Part 2).
5. Accessibility and performance pass (needs Part 2 checklist).
6. Deployment config (netlify.toml, headers, caching).
7. QA: `astro check`, `lint:copy` (dash + banned-word scan), `test:links`,
   production build.

## Open items tracked in REVIEW.md
- Headshot image missing (placeholder in use).
- Welcare Hospital logo missing (placeholder in use).
- Domain is a placeholder (`https://www.drnaveengovind.com`).
- Every clinical page: "Pending Dr Naveen review".
