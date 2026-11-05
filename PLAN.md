# Build plan: Dr Naveen Govind website v1

## Stack
- Astro 7 (static output), no client framework. Two small vanilla scripts only: mobile menu and knee map (plus a one-line print button and the click-to-load YouTube embed).
- Plain CSS: `src/styles/tokens.css` (colours, type, spacing), `src/styles/global.css` (base, layout, print), scoped component styles.
- Fonts self-hosted: `@fontsource-variable/manrope`, `@fontsource/noto-sans-malayalam` (applied with `:lang(ml)`).
- Content collections (MDX) in `src/content/guides` and `src/content/conditions`, typed with zod in `src/content.config.ts`.
- All facts and placeholders in `src/config/site.ts`.
- `@astrojs/sitemap`, `@astrojs/mdx`, `sharp` (image pipeline, OG images, favicons).
- Netlify (`netlify.toml`), works on any static host.

## Routes
| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/what-i-treat` | `src/pages/what-i-treat/index.astro` |
| `/what-i-treat/[slug]` (6) | `src/content/conditions/*.mdx` |
| `/guides` | `src/pages/guides/index.astro` |
| `/guides/[slug]` (6) | `src/content/guides/*.mdx` |
| `/videos` | `src/pages/videos.astro` |
| `/planning-from-abroad` | `src/pages/planning-from-abroad.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/medical-disclaimer`, `/privacy` | legal pages |
| `/404` | brand 404 |
| `/og/[slug].png` | build-time OG images (sharp) |
| `/favicon.svg`, `/favicon-32.png`, `/apple-touch-icon.png` | "NG" favicon set |

## Components
Layout: `BaseLayout`, `Header`, `Footer`, `MobileCallBar`, `SchemaScript`.
UI: `Button`, `CallButton`, `WhatsAppButton`, `Card`, `ConditionCard`, `GuideCard`, `UrgentBlock`, `KneeUrgent`, `ShoulderUrgent`, `MythFactPair`, `Checklist`, `QuestionList`, `ComparisonTable`, `KneeMap`, `VideoEmbed`, `Disclaimer`, `Breadcrumbs`, `FAQ`, `MalayalamSummary`, `SectionHeading`, `ReviewNote`, `Sources`, `Headshot`, `HospitalLogo`, `WhereIConsult`, `PullQuote`, `Icon`, `Illustrations`.

## Stages (one commit each)
1. Scaffold, config, design tokens.
2. Layout and components.
3. Pages and content.
4. SEO and schema (meta, OG, JSON-LD, sitemap, robots).
5. Accessibility and performance pass.
6. Deployment config (Netlify headers, caching).
7. QA (copy lint, spine and phone checks, links, schema, Lighthouse, screenshots).
