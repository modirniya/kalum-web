export interface Destination {
  /** URL segment under /call/ — e.g. "egypt" → /call/egypt/ */
  slug: string;
  name: string;
  /** Adjective used in copy: "any Egyptian number". */
  demonym: string;
  /** Country calling code without the plus sign. */
  dialCode: string;
  /** Per-minute rate in US cents, copied from the live rate table. */
  rateCents: number;
  /** One or two unique sentences for the page intro. Verified claims only. */
  intro: string;
  /**
   * Factual dialing-format note: number length, leading-zero rule, common
   * prefixes. Public numbering-plan facts only — shown on the page and in
   * the FAQ schema.
   */
  dialingNote: string;
}

/**
 * Rates below were copied from the Kalum rate table (admin panel) on this
 * date. When rates change, update the numbers here AND this date — every
 * destination page prints it next to the rate.
 */
export const RATES_AS_OF = "March 23, 2026";

export const destinations: Destination[] = [
  {
    slug: "mexico",
    name: "Mexico",
    demonym: "Mexican",
    dialCode: "52",
    rateCents: 6,
    intro:
      "One flat rate to every Mexican number — a landline in Guadalajara or a cell phone in Mexico City, same six cents a minute.",
    dialingNote:
      "Mexican numbers are 10 digits, landlines and mobiles alike. Dial +52 followed by the full 10-digit number — there are no extra prefixes to add or drop.",
  },
  {
    slug: "egypt",
    name: "Egypt",
    demonym: "Egyptian",
    dialCode: "20",
    rateCents: 24,
    intro:
      "Family in Cairo, Alexandria, or anywhere in between — reach any Egyptian landline or mobile at one per-minute rate.",
    dialingNote:
      "Egyptian mobiles are 10 digits starting with 1 (written locally as 010, 011, 012, or 015); landlines add a city code like 2 for Cairo. Drop the leading 0 and dial +20, then the rest of the number.",
  },
  {
    slug: "lebanon",
    name: "Lebanon",
    demonym: "Lebanese",
    dialCode: "961",
    rateCents: 39,
    intro:
      "Beirut, Tripoli, or up in the mountains — Kalum calls regular Lebanese phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Lebanese numbers are short — usually 7 or 8 digits including the prefix. If the number is written with a leading 0 (like 03 or 070), drop that 0 and dial +961, then the rest.",
  },
  {
    slug: "jordan",
    name: "Jordan",
    demonym: "Jordanian",
    dialCode: "962",
    rateCents: 33,
    intro:
      "Amman, Irbid, Zarqa — call any Jordanian landline or mobile and it rings like any normal call.",
    dialingNote:
      "Jordanian mobiles are 9 digits starting with 7 (written locally as 077, 078, or 079). Drop the leading 0 and dial +962, then the rest of the number.",
  },
  {
    slug: "palestine",
    name: "Palestine",
    demonym: "Palestinian",
    dialCode: "970",
    rateCents: 40,
    intro:
      "Call landlines and mobiles across the West Bank and Gaza at one per-minute rate — no app or internet needed on their side.",
    dialingNote:
      "Palestinian mobiles are 9 digits starting with 5 (written locally as 059 or 056). Drop the leading 0 and dial +970, then the rest of the number.",
  },
  {
    slug: "iraq",
    name: "Iraq",
    demonym: "Iraqi",
    dialCode: "964",
    rateCents: 41,
    intro:
      "Baghdad, Basra, Erbil — reach any Iraqi landline or mobile without asking anyone to install anything.",
    dialingNote:
      "Iraqi mobiles are 10 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +964, then the rest of the number.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    demonym: "Saudi",
    dialCode: "966",
    rateCents: 33,
    intro:
      "Riyadh, Jeddah, Dammam — call any Saudi number, landline or mobile, at one flat per-minute rate.",
    dialingNote:
      "Saudi mobiles are 9 digits starting with 5 and landlines are 9 digits starting with 1 (written locally with a leading 0). Drop that 0 and dial +966, then the rest of the number.",
  },
  {
    slug: "uae",
    name: "the UAE",
    demonym: "UAE",
    dialCode: "971",
    rateCents: 31,
    intro:
      "Dubai, Abu Dhabi, Sharjah — voice calls on many internet apps are restricted in the UAE, so Kalum dials regular UAE phone numbers instead.",
    dialingNote:
      "UAE mobiles are 9 digits starting with 5 (written locally as 050, 052, 054, 055, 056, or 058). Drop the leading 0 and dial +971, then the rest of the number.",
  },
  {
    slug: "yemen",
    name: "Yemen",
    demonym: "Yemeni",
    dialCode: "967",
    rateCents: 29,
    intro:
      "Sanaa, Aden, Taiz — call any Yemeni landline or mobile; there is nothing to download or set up on their end.",
    dialingNote:
      "Yemeni mobiles are 9 digits starting with 7 (written locally with a leading 0). Drop that 0 and dial +967, then the rest of the number.",
  },
  {
    slug: "turkey",
    name: "Turkey",
    demonym: "Turkish",
    dialCode: "90",
    rateCents: 31,
    intro:
      "Istanbul, Ankara, Izmir — any Turkish number, landline or mobile, one per-minute rate.",
    dialingNote:
      "Turkish numbers are 10 digits — mobiles start with 5, landlines with a city code like 212 or 216 in Istanbul. Drop the leading 0 and dial +90, then the full 10-digit number.",
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    demonym: "Kuwaiti",
    dialCode: "965",
    rateCents: 17,
    intro:
      "Kuwait City, Hawalli, Salmiya — call any Kuwaiti landline or mobile at one flat per-minute rate, with nothing to install or sign up for on their end.",
    dialingNote:
      "Kuwaiti numbers are 8 digits with no leading zero — mobiles start with 5, 6, or 9. Dial +965 and then the full 8-digit number.",
  },
  {
    slug: "qatar",
    name: "Qatar",
    demonym: "Qatari",
    dialCode: "974",
    rateCents: 40,
    intro:
      "Doha, Al Rayyan, Al Wakrah — voice calls on many internet apps are restricted in Qatar, so Kalum dials regular Qatari phone numbers instead.",
    dialingNote:
      "Qatari numbers are 8 digits with no leading zero — mobiles start with 3, 5, 6, or 7. Dial +974 and then the full 8-digit number.",
  },
  {
    slug: "oman",
    name: "Oman",
    demonym: "Omani",
    dialCode: "968",
    rateCents: 52,
    intro:
      "Muscat, Salalah, Sohar — voice calls on many internet apps are restricted in Oman, so Kalum dials regular Omani phone numbers instead.",
    dialingNote:
      "Omani numbers are 8 digits with no leading zero — mobiles start with 7 or 9. Dial +968 and then the full 8-digit number.",
  },
  {
    slug: "bahrain",
    name: "Bahrain",
    demonym: "Bahraini",
    dialCode: "973",
    rateCents: 26,
    intro:
      "Manama, Riffa, Muharraq — reach any Bahraini landline or mobile at one flat per-minute rate; there's nothing for them to download or set up.",
    dialingNote:
      "Bahraini numbers are 8 digits with no leading zero — mobiles start with 3. Dial +973 and then the full 8-digit number.",
  },
  {
    slug: "sudan",
    name: "Sudan",
    demonym: "Sudanese",
    dialCode: "249",
    rateCents: 45,
    intro:
      "Khartoum, Omdurman, Port Sudan — Kalum calls regular Sudanese phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Sudanese mobiles are nine digits starting with 9, written locally with a leading 0 (09…). Drop the leading 0 and dial +249, then the rest of the number.",
  },
  {
    slug: "guatemala",
    name: "Guatemala",
    demonym: "Guatemalan",
    dialCode: "502",
    rateCents: 24,
    intro:
      "Guatemala City, Quetzaltenango, Escuintla — call any Guatemalan landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Guatemalan numbers are 8 digits with no leading zero — mobiles start with 3, 4, or 5. Dial +502 and then the full 8-digit number.",
  },
  {
    slug: "el-salvador",
    name: "El Salvador",
    demonym: "Salvadoran",
    dialCode: "503",
    rateCents: 35,
    intro:
      "San Salvador, Santa Ana, San Miguel — reach any Salvadoran landline or mobile at one per-minute rate, with nothing to set up on their side.",
    dialingNote:
      "Salvadoran numbers are 8 digits with no leading zero — mobiles start with 6 or 7. Dial +503 and then the full 8-digit number.",
  },
  {
    slug: "honduras",
    name: "Honduras",
    demonym: "Honduran",
    dialCode: "504",
    rateCents: 29,
    intro:
      "Tegucigalpa, San Pedro Sula, La Ceiba — call any Honduran landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Honduran numbers are 8 digits with no leading zero — mobiles usually start with 3, 8, or 9. Dial +504 and then the full 8-digit number.",
  },
];

/** "6¢" / "24¢" display form. */
export function rateLabel(d: Destination): string {
  return `${d.rateCents}¢`;
}

/** Capitalized country name for sentence starts ("The UAE" vs "the UAE"). */
export function nameAtSentenceStart(d: Destination): string {
  return d.name.charAt(0).toUpperCase() + d.name.slice(1);
}

/**
 * Corridors surfaced in the homepage "Popular destinations" strip and the
 * footer, in display order. Data-driven: edit this list to change what's
 * featured, and newly added destinations flow in the moment they appear here.
 */
export const featuredSlugs = [
  "mexico",
  "egypt",
  "lebanon",
  "turkey",
  "saudi-arabia",
  "uae",
];

/** Featured destinations in `featuredSlugs` order, skipping any unknown slug. */
export function featuredDestinations(): Destination[] {
  return featuredSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => Boolean(d));
}
