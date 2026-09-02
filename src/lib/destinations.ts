export interface Destination {
  /** URL segment under /call/ — e.g. "egypt" → /call/egypt/ */
  slug: string;
  /** Region bucket for grouping on the /call/ index. */
  region: "Americas" | "Middle East" | "Africa" | "Asia";
  name: string;
  /** Adjective used in copy: "any Egyptian number". */
  demonym: string;
  /** Country calling code without the plus sign. Also the join key against the
   *  rate card's `country_code` — see src/lib/rates.ts. */
  dialCode: string;
  /** One or two unique sentences for the page intro. Verified claims only. */
  intro: string;
  /**
   * Factual dialing-format note: number length, leading-zero rule, common
   * prefixes. Public numbering-plan facts only — shown on the page and in
   * the FAQ schema.
   */
  dialingNote: string;
  /**
   * The same fact as `dialingNote`, compressed to one clause for the meta
   * description — digit count, the prefixes a number is written with, and the
   * dial. Kept separate rather than truncating `dialingNote` because that note
   * runs 140-180 characters and Google cuts a description near 160, which
   * would clip mid-sentence exactly where the useful part is.
   *
   * Strictly a restatement: never assert here anything `dialingNote` does not
   * already say, or the page and its snippet start making different claims.
   */
  numberFormat: string;
  /**
   * True where voice calls on many internet apps are commonly restricted
   * (the Gulf). Drives the /whatsapp-calls-blocked/ explainer's country list,
   * the /call-from-uae/ cluster, and a cross-link callout on the destination
   * page. Kept to the countries whose intro copy already states the
   * restriction.
   *
   * ⚠️ THIS FLAG DECAYS. It is a claim about another country's current policy,
   * and those move. Oman carried it until 2026-08 and was removed after its
   * block was reported lifted; Saudi Arabia liberalised back in 2017 and has
   * never carried it; Kuwait and Bahrain have no active block. Egypt and
   * Jordan restrict *periodically* or degrade quality rather than blocking
   * outright — too unsettled to assert, so they stay unflagged.
   *
   * Re-verify before adding a country, and prefer removing a flag to keeping
   * a stale one: every page this drives states the restriction as fact, so a
   * wrong flag publishes a wrong claim.
   */
  voipRestricted?: boolean;
}

/**
 * The curated destination list: which countries get their own page, and the
 * hand-written copy that earns each one. Deliberately a fraction of the ~200
 * callable destinations — a page is worth publishing only when it has a real
 * intro, a real dialing note, and a rate, and templated filler for the long
 * tail is what "the app shows live rates for 200+ countries" covers instead.
 *
 * PRICES ARE NOT IN THIS FILE. They used to be, hand-copied from the admin
 * panel with a manually stamped "rates as of" date, and they drifted — the app
 * reprices daily and the site did not. Rates now come from the live rate card
 * at build time; see `pricedDestinations()` in src/lib/rates.ts. Copy here must
 * stay price-free, and must not claim one rate covers a country's mobiles and
 * landlines: under prefix pricing they can differ, and the figure this site
 * prints is a "from".
 *
 * Sanctioned destinations (Syria, Iran, Cuba) are excluded on purpose — they
 * are not callable, and a public rate page for one is a compliance problem
 * rather than a dead link.
 */
export const destinations: Destination[] = [
  {
    slug: "mexico",
    region: "Americas",
    name: "Mexico",
    demonym: "Mexican",
    dialCode: "52",
    intro:
      "A landline in Guadalajara or a cell phone in Mexico City — Kalum dials Mexican numbers directly, so whoever you call just answers their phone.",
    dialingNote:
      "Mexican numbers are 10 digits, landlines and mobiles alike. Dial +52 followed by the full 10-digit number — there are no extra prefixes to add or drop.",
    numberFormat:
      "Mexican numbers are 10 digits — dial +52 and the full number.",
  },
  {
    slug: "egypt",
    region: "Middle East",
    name: "Egypt",
    demonym: "Egyptian",
    dialCode: "20",
    intro:
      "Family in Cairo, Alexandria, or anywhere in between — reach any Egyptian landline or mobile straight from your own phone.",
    dialingNote:
      "Egyptian mobiles are 10 digits starting with 1 (written locally as 010, 011, 012, or 015); landlines add a city code like 2 for Cairo. Drop the leading 0 and dial +20, then the rest of the number.",
    numberFormat:
      "Egyptian mobiles are 10 digits (written 010, 011, 012, or 015) — drop the 0 and dial +20.",
  },
  {
    slug: "lebanon",
    region: "Middle East",
    name: "Lebanon",
    demonym: "Lebanese",
    dialCode: "961",
    intro:
      "Beirut, Tripoli, or up in the mountains — Kalum calls regular Lebanese phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Lebanese numbers are short — usually 7 or 8 digits including the prefix. If the number is written with a leading 0 (like 03 or 070), drop that 0 and dial +961, then the rest.",
    numberFormat:
      "Lebanese numbers are 7 or 8 digits — drop any leading 0 and dial +961.",
  },
  {
    slug: "jordan",
    region: "Middle East",
    name: "Jordan",
    demonym: "Jordanian",
    dialCode: "962",
    intro:
      "Amman, Irbid, Zarqa — call any Jordanian landline or mobile and it rings like any normal call.",
    dialingNote:
      "Jordanian mobiles are 9 digits starting with 7 (written locally as 077, 078, or 079). Drop the leading 0 and dial +962, then the rest of the number.",
    numberFormat:
      "Jordanian mobiles are 9 digits (written 077, 078, or 079) — drop the 0 and dial +962.",
  },
  {
    slug: "palestine",
    region: "Middle East",
    name: "Palestine",
    demonym: "Palestinian",
    dialCode: "970",
    intro:
      "Call landlines and mobiles across the West Bank and Gaza — no app, no smartphone, and no internet needed on their side.",
    dialingNote:
      "Palestinian mobiles are 9 digits starting with 5 (written locally as 059 or 056). Drop the leading 0 and dial +970, then the rest of the number.",
    numberFormat:
      "Palestinian mobiles are 9 digits (written 059 or 056) — drop the 0 and dial +970.",
  },
  {
    slug: "iraq",
    region: "Middle East",
    name: "Iraq",
    demonym: "Iraqi",
    dialCode: "964",
    intro:
      "Baghdad, Basra, Erbil — reach any Iraqi landline or mobile without asking anyone to install anything.",
    dialingNote:
      "Iraqi mobiles are 10 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +964, then the rest of the number.",
    numberFormat:
      "Iraqi mobiles are 10 digits written 07… — drop the 0 and dial +964.",
  },
  {
    slug: "saudi-arabia",
    region: "Middle East",
    name: "Saudi Arabia",
    demonym: "Saudi",
    dialCode: "966",
    intro:
      "Riyadh, Jeddah, Dammam — call any Saudi number, landline or mobile, and it rings the way a local call does.",
    dialingNote:
      "Saudi mobiles are 9 digits starting with 5 and landlines are 9 digits starting with 1 (written locally with a leading 0). Drop that 0 and dial +966, then the rest of the number.",
    numberFormat:
      "Saudi mobiles are 9 digits starting with 5 — drop the leading 0 and dial +966.",
  },
  {
    slug: "uae",
    region: "Middle East",
    name: "the UAE",
    demonym: "UAE",
    dialCode: "971",
    intro:
      "Dubai, Abu Dhabi, Sharjah — voice calls on many internet apps are restricted in the UAE, so Kalum dials regular UAE phone numbers instead.",
    dialingNote:
      "UAE mobiles are 9 digits starting with 5 (written locally as 050, 052, 054, 055, 056, or 058). Drop the leading 0 and dial +971, then the rest of the number.",
    numberFormat:
      "UAE mobiles are 9 digits (written 050, 052, 054, 055, 056, or 058) — drop the 0 and dial +971.",
    voipRestricted: true,
  },
  {
    slug: "yemen",
    region: "Middle East",
    name: "Yemen",
    demonym: "Yemeni",
    dialCode: "967",
    intro:
      "Sanaa, Aden, Taiz — call any Yemeni landline or mobile; there is nothing to download or set up on their end.",
    dialingNote:
      "Yemeni mobiles are 9 digits starting with 7 (written locally with a leading 0). Drop that 0 and dial +967, then the rest of the number.",
    numberFormat:
      "Yemeni mobiles are 9 digits starting with 7 — drop the leading 0 and dial +967.",
  },
  {
    slug: "turkey",
    region: "Middle East",
    name: "Turkey",
    demonym: "Turkish",
    dialCode: "90",
    intro:
      "Istanbul, Ankara, Izmir — any Turkish number, landline or mobile, dialed straight from the phone in your hand.",
    dialingNote:
      "Turkish numbers are 10 digits — mobiles start with 5, landlines with a city code like 212 or 216 in Istanbul. Drop the leading 0 and dial +90, then the full 10-digit number.",
    numberFormat:
      "Turkish numbers are 10 digits, mobiles starting with 5 — drop the leading 0 and dial +90.",
  },
  {
    slug: "kuwait",
    region: "Middle East",
    name: "Kuwait",
    demonym: "Kuwaiti",
    dialCode: "965",
    intro:
      "Kuwait City, Hawalli, Salmiya — call any Kuwaiti landline or mobile, with nothing to install or sign up for on their end.",
    dialingNote:
      "Kuwaiti numbers are 8 digits with no leading zero — mobiles start with 5, 6, or 9. Dial +965 and then the full 8-digit number.",
    numberFormat:
      "Kuwaiti numbers are 8 digits with no leading zero — dial +965 and the full number.",
  },
  {
    slug: "qatar",
    region: "Middle East",
    name: "Qatar",
    demonym: "Qatari",
    dialCode: "974",
    intro:
      "Doha, Al Rayyan, Al Wakrah — voice calls on many internet apps are restricted in Qatar, so Kalum dials regular Qatari phone numbers instead.",
    dialingNote:
      "Qatari numbers are 8 digits with no leading zero — mobiles start with 3, 5, 6, or 7. Dial +974 and then the full 8-digit number.",
    numberFormat:
      "Qatari numbers are 8 digits with no leading zero — dial +974 and the full number.",
    voipRestricted: true,
  },
  {
    slug: "oman",
    region: "Middle East",
    name: "Oman",
    demonym: "Omani",
    dialCode: "968",
    intro:
      "Muscat, Salalah, Sohar — call any Omani landline or mobile, with nothing to install or sign up for on their end.",
    dialingNote:
      "Omani numbers are 8 digits with no leading zero — mobiles start with 7 or 9. Dial +968 and then the full 8-digit number.",
    numberFormat:
      "Omani numbers are 8 digits with no leading zero — dial +968 and the full number.",
    // voipRestricted removed 2026-08: Oman's long-standing WhatsApp-calling
    // block was widely reported lifted in December 2024, and users have since
    // reported calls connecting without a VPN. The TRA never announced a
    // formal change, so the position is unsettled rather than reversed — which
    // is precisely why this page should no longer assert a restriction. A
    // claim that has stopped being reliably true is worse than a missing one.
  },
  {
    slug: "bahrain",
    region: "Middle East",
    name: "Bahrain",
    demonym: "Bahraini",
    dialCode: "973",
    intro:
      "Manama, Riffa, Muharraq — reach any Bahraini landline or mobile; there's nothing for them to download or set up.",
    dialingNote:
      "Bahraini numbers are 8 digits with no leading zero — mobiles start with 3. Dial +973 and then the full 8-digit number.",
    numberFormat:
      "Bahraini numbers are 8 digits with no leading zero — dial +973 and the full number.",
  },
  {
    slug: "sudan",
    region: "Africa",
    name: "Sudan",
    demonym: "Sudanese",
    dialCode: "249",
    intro:
      "Khartoum, Omdurman, Port Sudan — Kalum calls regular Sudanese phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Sudanese mobiles are nine digits starting with 9, written locally with a leading 0 (09…). Drop the leading 0 and dial +249, then the rest of the number.",
    numberFormat:
      "Sudanese mobiles are 9 digits written 09… — drop the leading 0 and dial +249.",
  },
  {
    slug: "guatemala",
    region: "Americas",
    name: "Guatemala",
    demonym: "Guatemalan",
    dialCode: "502",
    intro:
      "Guatemala City, Quetzaltenango, Escuintla — call any Guatemalan landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Guatemalan numbers are 8 digits with no leading zero — mobiles start with 3, 4, or 5. Dial +502 and then the full 8-digit number.",
    numberFormat:
      "Guatemalan numbers are 8 digits with no leading zero — dial +502 and the full number.",
  },
  {
    slug: "el-salvador",
    region: "Americas",
    name: "El Salvador",
    demonym: "Salvadoran",
    dialCode: "503",
    intro:
      "San Salvador, Santa Ana, San Miguel — reach any Salvadoran landline or mobile, with nothing to set up on their side.",
    dialingNote:
      "Salvadoran numbers are 8 digits with no leading zero — mobiles start with 6 or 7. Dial +503 and then the full 8-digit number.",
    numberFormat:
      "Salvadoran numbers are 8 digits with no leading zero — dial +503 and the full number.",
  },
  {
    slug: "honduras",
    region: "Americas",
    name: "Honduras",
    demonym: "Honduran",
    dialCode: "504",
    intro:
      "Tegucigalpa, San Pedro Sula, La Ceiba — call any Honduran landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Honduran numbers are 8 digits with no leading zero — mobiles usually start with 3, 8, or 9. Dial +504 and then the full 8-digit number.",
    numberFormat:
      "Honduran numbers are 8 digits with no leading zero — dial +504 and the full number.",
  },
  {
    slug: "colombia",
    region: "Americas",
    name: "Colombia",
    demonym: "Colombian",
    dialCode: "57",
    intro:
      "Bogotá, Medellín, Cali — call any Colombian landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Colombian mobiles are 10 digits starting with 3. Dial +57 and then the full 10-digit number; landlines add a city code like 1 for Bogotá.",
    numberFormat:
      "Colombian mobiles are 10 digits starting with 3 — dial +57 and the full number.",
  },
  {
    slug: "india",
    region: "Asia",
    name: "India",
    demonym: "Indian",
    dialCode: "91",
    intro:
      "Delhi, Mumbai, Chennai, or a village landline — reach any Indian number, with nothing to install on their end.",
    dialingNote:
      "Indian mobiles are 10 digits starting with 6, 7, 8, or 9. Drop any leading 0 and dial +91, then the full 10-digit number.",
    numberFormat:
      "Indian mobiles are 10 digits starting with 6, 7, 8, or 9 — drop any leading 0 and dial +91.",
  },
  {
    slug: "pakistan",
    region: "Asia",
    name: "Pakistan",
    demonym: "Pakistani",
    dialCode: "92",
    intro:
      "Karachi, Lahore, Islamabad — call any Pakistani landline or mobile; there's nothing for them to download.",
    dialingNote:
      "Pakistani mobiles are 10 digits starting with 3 (written locally as 03…). Drop the leading 0 and dial +92, then the rest of the number.",
    numberFormat:
      "Pakistani mobiles are 10 digits written 03… — drop the 0 and dial +92.",
  },
  {
    slug: "bangladesh",
    region: "Asia",
    name: "Bangladesh",
    demonym: "Bangladeshi",
    dialCode: "880",
    intro:
      "Dhaka, Chattogram, Sylhet — reach any Bangladeshi landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Bangladeshi mobiles are 10 digits starting with 1 (written locally as 01…). Drop the leading 0 and dial +880, then the rest of the number.",
    numberFormat:
      "Bangladeshi mobiles are 10 digits written 01… — drop the 0 and dial +880.",
  },
  {
    slug: "nepal",
    region: "Asia",
    name: "Nepal",
    demonym: "Nepali",
    dialCode: "977",
    intro:
      "Kathmandu, Pokhara, or a hillside village — call any Nepali landline or mobile, with nothing to set up on their side.",
    dialingNote:
      "Nepali mobiles are 10 digits starting with 98 or 97. Dial +977 and then the full 10-digit number.",
    numberFormat:
      "Nepali mobiles are 10 digits starting with 98 or 97 — dial +977 and the full number.",
  },
  {
    slug: "sri-lanka",
    region: "Asia",
    name: "Sri Lanka",
    demonym: "Sri Lankan",
    dialCode: "94",
    intro:
      "Colombo, Kandy, Jaffna — reach any Sri Lankan landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Sri Lankan mobiles are 9 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +94, then the rest of the number.",
    numberFormat:
      "Sri Lankan mobiles are 9 digits written 07… — drop the 0 and dial +94.",
  },
  {
    slug: "philippines",
    region: "Asia",
    name: "the Philippines",
    demonym: "Philippine",
    dialCode: "63",
    intro:
      "Manila, Cebu, Davao — call any Philippine landline or mobile; they just answer their phone, no app needed.",
    dialingNote:
      "Philippine mobiles are 10 digits starting with 9 (written locally as 09…). Drop the leading 0 and dial +63, then the rest of the number.",
    numberFormat:
      "Philippine mobiles are 10 digits written 09… — drop the 0 and dial +63.",
  },
  {
    slug: "vietnam",
    region: "Asia",
    name: "Vietnam",
    demonym: "Vietnamese",
    dialCode: "84",
    intro:
      "Hanoi, Ho Chi Minh City, Da Nang — reach any Vietnamese landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Vietnamese mobiles are 9 digits starting with 3, 5, 7, 8, or 9 (written locally with a leading 0). Drop the leading 0 and dial +84, then the rest of the number.",
    numberFormat:
      "Vietnamese mobiles are 9 digits — drop the leading 0 and dial +84.",
  },
  {
    slug: "afghanistan",
    region: "Asia",
    name: "Afghanistan",
    demonym: "Afghan",
    dialCode: "93",
    intro:
      "Kabul, Herat, Mazar-i-Sharif — Kalum calls regular Afghan phone numbers, so even when the internet over there is down, their phone still rings.",
    dialingNote:
      "Afghan mobiles are 9 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +93, then the rest of the number.",
    numberFormat:
      "Afghan mobiles are 9 digits written 07… — drop the 0 and dial +93.",
  },
  {
    slug: "nigeria",
    region: "Africa",
    name: "Nigeria",
    demonym: "Nigerian",
    dialCode: "234",
    intro:
      "Lagos, Abuja, Kano — call any Nigerian landline or mobile, with nothing to install or sign up for on their end.",
    dialingNote:
      "Nigerian mobiles are 10 digits starting with 7, 8, or 9 (written locally with a leading 0). Drop the leading 0 and dial +234, then the rest of the number.",
    numberFormat:
      "Nigerian mobiles are 10 digits starting with 7, 8, or 9 — drop the leading 0 and dial +234.",
  },
  {
    slug: "ghana",
    region: "Africa",
    name: "Ghana",
    demonym: "Ghanaian",
    dialCode: "233",
    intro:
      "Accra, Kumasi, Tamale — reach any Ghanaian landline or mobile; there's nothing for them to download or set up.",
    dialingNote:
      "Ghanaian mobiles are 9 digits starting with 2 or 5 (written locally with a leading 0). Drop the leading 0 and dial +233, then the rest of the number.",
    numberFormat:
      "Ghanaian mobiles are 9 digits starting with 2 or 5 — drop the leading 0 and dial +233.",
  },
  {
    slug: "kenya",
    region: "Africa",
    name: "Kenya",
    demonym: "Kenyan",
    dialCode: "254",
    intro:
      "Nairobi, Mombasa, Kisumu — call any Kenyan landline or mobile, no app or internet needed on their end.",
    dialingNote:
      "Kenyan mobiles are 9 digits starting with 7 or 1 (written locally as 07… or 01…). Drop the leading 0 and dial +254, then the rest of the number.",
    numberFormat:
      "Kenyan mobiles are 9 digits written 07… or 01… — drop the 0 and dial +254.",
  },
  {
    slug: "ethiopia",
    region: "Africa",
    name: "Ethiopia",
    demonym: "Ethiopian",
    dialCode: "251",
    intro:
      "Addis Ababa, Dire Dawa, Bahir Dar — Kalum calls regular Ethiopian phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Ethiopian mobiles are 9 digits starting with 9 (written locally as 09…). Drop the leading 0 and dial +251, then the rest of the number.",
    numberFormat:
      "Ethiopian mobiles are 9 digits written 09… — drop the 0 and dial +251.",
  },
];

/** Capitalized country name for sentence starts ("The UAE" vs "the UAE"). */
export function nameAtSentenceStart(d: Destination): string {
  return d.name.charAt(0).toUpperCase() + d.name.slice(1);
}

/**
 * Corridors surfaced in the homepage "Popular destinations" strip and the
 * footer, in display order. Data-driven: edit this list to change what's
 * featured, and newly added destinations flow in the moment they appear here.
 *
 * Two rules this list has to keep satisfying, both easy to break by accident:
 *
 * 1. **Spread the regions.** This strip is the clearest signal of who the
 *    product is for. It was five-sixths Middle East, which read as a
 *    diaspora-first service and contradicted the general-provider positioning
 *    the rest of the site was rewritten around. All four regions now appear.
 * 2. **Feature corridors whose price still sells.** Every entry sits under the
 *    price-led threshold in `call/[slug].astro`, so the strip never advertises
 *    a figure the destination page itself has decided not to lead with. The
 *    UAE was dropped for exactly that reason when it repriced past it — it is
 *    still linked everywhere else, and it leads the /whatsapp-calls-blocked/
 *    page, where its story is the restriction rather than the rate.
 *
 * Rates move on their own now, so re-check this list when they do.
 */
export const featuredSlugs = [
  "mexico",
  "colombia",
  "india",
  "turkey",
  "egypt",
  "nigeria",
];

/** Featured destinations in `featuredSlugs` order, skipping any unknown slug. */
export function featuredDestinations(): Destination[] {
  return featuredSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => Boolean(d));
}

/** Destinations flagged where internet-app voice calls are commonly restricted. */
export function voipRestrictedDestinations(): Destination[] {
  return destinations.filter((d) => d.voipRestricted);
}
