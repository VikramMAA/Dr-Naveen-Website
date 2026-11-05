# Content rules

Every editor of this website must follow these rules.

## Non-negotiable content and compliance rules

These follow Indian medical professional conduct norms and the client's instructions. Breaking any of them is a failed build.

1. Patient education only. No patient testimonials, reviews, star ratings, success rates, "happy patients" counters, patient photographs, X-rays, MRI scans, surgical footage or before-and-after images.
2. Never use "best", "top", "leading", "No. 1", "expert in", "renowned", "world-class", "painless", "guaranteed" or any other superlative or promise of outcome.
3. No prices, packages, discounts, offers or cost estimates.
4. No home remedies, supplements, product or brand names.
5. When correcting a myth, never name a product, practitioner, hospital or system of medicine (no "Ayurveda", "quacks", etc.).
6. Every page that discusses symptoms or treatment shows this disclaimer near the end: "General education only, not a diagnosis. For advice on your own condition, please see a doctor."
7. No patient-data collection. Do not build any form that asks for symptoms, medical history, name, phone or email. Contact is by phone call (and WhatsApp only if the flag is on). No analytics that record personal data without consent; see section 10.
8. No em dashes (Unicode U+2014) or en dashes (U+2013) used as punctuation anywhere in copy, alt text, meta tags or code comments that render. Use commas, colons, full stops or parentheses. Hyphens in compound words (follow-up, 4-week) are fine. Add an automated check for this (section 12).
9. Tone: calm, clear, warm, consultative. Short sentences. Plain word first, medical term in brackets after it, e.g. "a sprained inner ligament (MCL)". It must not read like AI-written marketing copy. Avoid filler such as "In today's fast-paced world", "your journey", "holistic", "cutting-edge", "state-of-the-art", "seamless", "empower", "unlock", "delve".
10. First person ("I") for Dr Naveen's own voice on the home, about and guide pages. Third person ("Dr Naveen") in meta descriptions and schema.
11. Every clinical page is a draft until Dr Naveen approves it. List each one in `REVIEW.md` with status "Pending Dr Naveen review".

## Also from the brief

- Never mention spine conditions, show spine imagery, or use anything that looks like a vertebra. Dr Naveen does not treat the spine.
- The only phone number on the site is Dr Naveen's own: **96508 59766** (`tel:+919650859766`). Never show hospital call-centre numbers.
- Do NOT write "a large part of my work is telling people they don't need surgery" or anything similar. The positioning is: a surgeon who explains clearly, finds the right treatment for each patient, and tells you why, whether that is surgery or not.
- Write "Dr Naveen Govind" with no full stop after "Dr". Use British spelling (orthopaedic, programme), except in search keywords where people type "orthopedic".
- Plain word first, medical term in brackets: "a sprained inner ligament (MCL)". Use "ACL tear", "ACL surgery" or "knee ligament injury" in titles, never "ACL" alone.
- Red (`--red`) appears only in urgent-sign blocks. Amber (`--amber`) appears only on MYTH labels.
- Approved wording (knee map zones, urgent blocks, the pull quote, ACL return to sport, the 5 questions) is used word for word. Do not edit it without Dr Naveen's approval.

## Automated check

`npm run lint:copy` enforces the dash rule, the banned words, the spine check and the phone check on `src/` and the built site. Two approved phrases are allowed despite containing banned words, because they are Dr Naveen's approved wording and not promises:

- "Painless clicking is common and usually normal." (contains "painless")
- "...leading to irreversible damage." (contains "leading")

Any other exception must be agreed with Dr Naveen and added to the `allow` list in `scripts/lint-copy.mjs` with a comment.
