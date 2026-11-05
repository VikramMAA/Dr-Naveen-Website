# Review checklist: Dr Naveen Govind website v1

For Vikram and Dr Naveen. Tick each item when it is done. Every placeholder lives in `src/config/site.ts` and is hidden on the site until a real value replaces it.

## 1. Open questions

- [ ] **Real domain.** Placeholder `https://www.drnaveengovind.com` is set in `src/config/site.ts` (`domain`) and `astro.config.mjs` (`SITE`). Canonical URLs, sitemap, OG images and schema all use it.
- [ ] **Consultation days and times.** `consultationTimes` is `[CONSULTATION DAYS AND TIMES]` (hidden until set).
- [ ] **Is 96508 59766 on WhatsApp?** `whatsappEnabled: false`. The WhatsApp buttons are built and appear everywhere once this is `true`.
- [ ] **Social profile URLs:** Facebook page (to be created), work Instagram, YouTube channel, LinkedIn. All empty, so hidden in the footer, About page and schema `sameAs`.
- [ ] **Google Business Profile link.** `googleBusinessProfileUrl` is a placeholder. Name, address and phone on the site must match the profile exactly (NAP consistency).
- [ ] **Exact Google Maps link for Welcare Hospital.** `mapsUrl` is currently a Google Maps search for "Welcare Hospital Vyttila Ernakulam". Replace with the place link.
- [ ] **Hospital postal code** (`hospital.postalCode`, hidden until set).
- [ ] **Does Dr Naveen offer robotic joint replacement?** The joint replacement page makes no robotic claim. Add only if he confirms.
- [ ] **Education and training details for the About page** (`educationAndTraining` is `[EDUCATION AND TRAINING DETAILS]`, hidden). Years in practice and memberships also not supplied; nothing has been invented.
- [ ] **Written confirmation that the Welcare Hospital logo may be used on the website.**
- [ ] **YouTube video IDs.** `videos` is empty, so Home, the video guide and `/videos` show a "Coming soon" card.
- [ ] **Home meta description length.** The brief's exact Home description is 205 characters; Google shows about 155. Kept word for word. Shorten if you prefer.

## 2. Assets

- [ ] **Headshot** at `src/assets/dr-naveen-headshot.jpg` (placeholder card "Photo of Dr Naveen Govind" shows until then). Used on Home and About.
- [ ] **Welcare logo** at `src/assets/welcare-logo.png` (placeholder shows until then). Used only in "Where I consult" and on Contact.
- [ ] After adding the headshot, re-run `npm run qa:lighthouse` (it becomes the largest image on Home).

## 3. Clinical pages awaiting approval

All have `reviewStatus: pending` and show "Last updated" (not "Reviewed by"). See README for how to approve.

| Page | Status |
|---|---|
| `/what-i-treat/knee-pain-and-arthritis` | Pending Dr Naveen review |
| `/what-i-treat/sports-injuries` | Pending Dr Naveen review |
| `/what-i-treat/shoulder-pain` | Pending Dr Naveen review |
| `/what-i-treat/joint-replacement` | Pending Dr Naveen review |
| `/what-i-treat/arthroscopy` | Pending Dr Naveen review |
| `/what-i-treat/fracture-management` | Pending Dr Naveen review |
| `/guides/what-does-an-orthopaedic-surgeon-treat` | Pending Dr Naveen review |
| `/guides/knee-pain-by-location` | Pending Dr Naveen review |
| `/guides/can-you-walk-with-a-torn-acl` | Pending Dr Naveen review |
| `/guides/frozen-shoulder-or-rotator-cuff` | Pending Dr Naveen review |
| `/guides/questions-to-ask-before-knee-or-shoulder-surgery` | Pending Dr Naveen review |
| `/guides/knee-and-shoulder-pain-just-age` | Pending Dr Naveen review |

Points to check closely (written from mainstream sources, not from his approved posts):

- [ ] Sports injuries: "often injured ... without anyone touching you"; MCL/LCL "many heal with protection and physiotherapy"; ACL reconstruction "usually done by keyhole surgery".
- [ ] Shoulder: dislocation advice (go to emergency, do not push it back) and "can come out again, especially in young, active people".
- [ ] Joint replacement: "Who is usually considered" list and the recovery-at-home list.
- [ ] Arthroscopy: the list of uses, and "for knee pain caused mainly by wear and tear, keyhole surgery is usually not recommended".
- [ ] Fracture: urgent list (deformity, cannot bear weight, numbness or cold pale limb), the older-parent fall FAQ, osteoporosis line.
- [ ] About page: "How I work" wording.
- [ ] Planning from abroad: the four steps and recovery-at-home list.

## 4. Malayalam summaries awaiting review

All drafted with `lang="ml"`, hidden because `showMalayalam: false`. Need a native speaker and Dr Naveen to approve each before switching on.

- [ ] Home (`src/pages/index.astro`)
- [ ] Knee pain and arthritis
- [ ] Sports injuries
- [ ] Shoulder pain
- [ ] Joint replacement
- [ ] Arthroscopy
- [ ] Fracture management
- [ ] Guide: what does an orthopaedic surgeon treat
- [ ] Guide: knee pain by location
- [ ] Guide: can you walk with a torn ACL
- [ ] Guide: frozen shoulder or rotator cuff
- [ ] Guide: 5 questions before surgery
- [ ] Guide: knee and shoulder pain, just age

## 5. Design notes

- **Teal contrast.** `--teal` #1F8A8A is 3.8:1 on off-white and 4.2:1 on white, which fails WCAG AA for small text. No token values were changed. Instead: buttons, pills and big numerals use 19 to 20px bold text (counts as large text, needs 3:1), and small teal text (links, eyebrows, the "Orthopaedic Surgeon, Kochi" line under the wordmark) uses `--teal-dark` #176B6B (5.7:1). Teal stays the accent for icons, bars, borders and fills.
- **Two exceptions in the copy lint**, both approved wording: "Painless clicking is common and usually normal." and "...leading to irreversible damage."
- The Contact page "For a medical emergency" line and the fracture emergency list use the red urgent style, since both are "act now" messages.

## 6. QA results (5 November 2026)

| Check | Result |
|---|---|
| `npm run build` (includes `astro check`) | Pass: 0 errors, 0 warnings, 0 hints |
| `npm run lint:copy` (dashes, banned words) | Pass: 0 hits |
| Spine check (spine, spinal, vertebra, back pain, disc) | Pass: 0 hits |
| Phone check (only 96508 59766; no 0484, 4091111, 3518666) | Pass: 0 hits |
| Knee map (`npm run test:kneemap`) | Pass: Outer side (3) left, Inner side (2) right, Back (4) right and below the joint, Whole knee (5) centred below; Tab, Enter and Space work; focus ring visible; all five texts show without JavaScript |
| Links (`npm run test:links`) | Pass: 0 broken internal links or anchors |
| JSON-LD (`npm run test:schema`) | Pass: Physician, WebSite, MedicalWebPage, FAQPage (text matches visible FAQ), BreadcrumbList; no ratings or reviews |
| Screenshots 360, 768, 1280px (`qa/screenshots/`) | Pass: no horizontal overflow, call bar does not cover the footer |
| Content Security Policy | No console errors on any page with the `netlify.toml` CSP applied |
| Total JavaScript | About 2 KB (1.4 KB gzipped) across all pages |

Lighthouse, mobile (Lighthouse 13.6, against `astro preview`, placeholder headshot):

| Page | Performance | Accessibility | Best Practices | SEO | LCP |
|---|---|---|---|---|---|
| Home `/` | 100 | 100 | 100 | 100 | 0.8 s |
| Knee map guide `/guides/knee-pain-by-location` | 100 | 100 | 100 | 100 | 0.8 s |
| Contact `/contact` | 100 | 100 | 100 | 100 | 0.9 s |
