// Single source of truth for every fact and placeholder on the site.
// Components and pages must read from here, never hard-code a fact twice.
// Anything marked PLACEHOLDER is tracked in REVIEW.md and must be confirmed
// before launch.

export const site = {
  name: "Dr Naveen Govind",
  title: "Orthopaedic Surgeon, Kochi",
  qualifications: "MBBS, MS (Orthopaedics)",

  // PLACEHOLDER: confirm the real domain before launch (see REVIEW.md).
  domain: "https://www.drnaveengovind.com",

  phone: {
    display: "96508 59766",
    e164: "+919650859766",
    tel: "tel:+919650859766",
  },

  whatsapp: {
    // Not confirmed as an active channel for the practice. Keep the button
    // built but hidden until this is switched on (see REVIEW.md).
    enabled: false,
    url: "https://wa.me/919650859766",
  },

  hospital: {
    name: "Welcare Hospital",
    addressLines: ["S. A. Road, Vyttila", "Ernakulam, Kerala"],
    // PLACEHOLDER: confirm the real Google Maps link (see REVIEW.md).
    mapsUrl: "https://maps.google.com/?q=Welcare+Hospital+Vyttila+Ernakulam",
    // PLACEHOLDER: confirm the real Google Business Profile link.
    businessProfileUrl: "",
  },

  // PLACEHOLDER: exact consultation days/timings not yet confirmed.
  consultation: {
    note: "Consultation days and timings: to be confirmed.",
  },

  hashtag: "#AskDrNaveen",

  // Social links: empty string hides the link in header/footer.
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  },

  // PLACEHOLDER: real YouTube video IDs pending (section on Videos page).
  // Each video is spoken in Malayalam.
  videos: [] as Array<{ id: string; title: string; description: string }>,

  showMalayalam: true,
} as const;

export type SiteConfig = typeof site;
