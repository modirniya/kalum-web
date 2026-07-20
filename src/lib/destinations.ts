export interface Destination {
  /** URL segment under /call/ — e.g. "egypt" → /call/egypt/ */
  slug: string;
  /** Region bucket for grouping on the /call/ index. */
  region: "Americas" | "Middle East" | "Africa" | "Asia";
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
    region: "Americas",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Middle East",
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
    region: "Africa",
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
    region: "Americas",
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
    region: "Americas",
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
    region: "Americas",
    name: "Honduras",
    demonym: "Honduran",
    dialCode: "504",
    rateCents: 29,
    intro:
      "Tegucigalpa, San Pedro Sula, La Ceiba — call any Honduran landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Honduran numbers are 8 digits with no leading zero — mobiles usually start with 3, 8, or 9. Dial +504 and then the full 8-digit number.",
  },
  {
    slug: "colombia",
    region: "Americas",
    name: "Colombia",
    demonym: "Colombian",
    dialCode: "57",
    rateCents: 4,
    intro:
      "Bogotá, Medellín, Cali — call any Colombian landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Colombian mobiles are 10 digits starting with 3. Dial +57 and then the full 10-digit number; landlines add a city code like 1 for Bogotá.",
  },
  {
    slug: "india",
    region: "Asia",
    name: "India",
    demonym: "Indian",
    dialCode: "91",
    rateCents: 5,
    intro:
      "Delhi, Mumbai, Chennai, or a village landline — reach any Indian number at one per-minute rate, with nothing to install on their end.",
    dialingNote:
      "Indian mobiles are 10 digits starting with 6, 7, 8, or 9. Drop any leading 0 and dial +91, then the full 10-digit number.",
  },
  {
    slug: "pakistan",
    region: "Asia",
    name: "Pakistan",
    demonym: "Pakistani",
    dialCode: "92",
    rateCents: 22,
    intro:
      "Karachi, Lahore, Islamabad — call any Pakistani landline or mobile at one per-minute rate; there's nothing for them to download.",
    dialingNote:
      "Pakistani mobiles are 10 digits starting with 3 (written locally as 03…). Drop the leading 0 and dial +92, then the rest of the number.",
  },
  {
    slug: "bangladesh",
    region: "Asia",
    name: "Bangladesh",
    demonym: "Bangladeshi",
    dialCode: "880",
    rateCents: 7,
    intro:
      "Dhaka, Chattogram, Sylhet — reach any Bangladeshi landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Bangladeshi mobiles are 10 digits starting with 1 (written locally as 01…). Drop the leading 0 and dial +880, then the rest of the number.",
  },
  {
    slug: "nepal",
    region: "Asia",
    name: "Nepal",
    demonym: "Nepali",
    dialCode: "977",
    rateCents: 30,
    intro:
      "Kathmandu, Pokhara, or a hillside village — call any Nepali landline or mobile at one per-minute rate, with nothing to set up on their side.",
    dialingNote:
      "Nepali mobiles are 10 digits starting with 98 or 97. Dial +977 and then the full 10-digit number.",
  },
  {
    slug: "sri-lanka",
    region: "Asia",
    name: "Sri Lanka",
    demonym: "Sri Lankan",
    dialCode: "94",
    rateCents: 28,
    intro:
      "Colombo, Kandy, Jaffna — reach any Sri Lankan landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Sri Lankan mobiles are 9 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +94, then the rest of the number.",
  },
  {
    slug: "philippines",
    region: "Asia",
    name: "the Philippines",
    demonym: "Philippine",
    dialCode: "63",
    rateCents: 28,
    intro:
      "Manila, Cebu, Davao — call any Philippine landline or mobile at one per-minute rate; they just answer their phone, no app needed.",
    dialingNote:
      "Philippine mobiles are 10 digits starting with 9 (written locally as 09…). Drop the leading 0 and dial +63, then the rest of the number.",
  },
  {
    slug: "vietnam",
    region: "Asia",
    name: "Vietnam",
    demonym: "Vietnamese",
    dialCode: "84",
    rateCents: 15,
    intro:
      "Hanoi, Ho Chi Minh City, Da Nang — reach any Vietnamese landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Vietnamese mobiles are 9 digits starting with 3, 5, 7, 8, or 9 (written locally with a leading 0). Drop the leading 0 and dial +84, then the rest of the number.",
  },
  {
    slug: "afghanistan",
    region: "Asia",
    name: "Afghanistan",
    demonym: "Afghan",
    dialCode: "93",
    rateCents: 49,
    intro:
      "Kabul, Herat, Mazar-i-Sharif — Kalum calls regular Afghan phone numbers, so even when the internet over there is down, their phone still rings.",
    dialingNote:
      "Afghan mobiles are 9 digits starting with 7 (written locally as 07…). Drop the leading 0 and dial +93, then the rest of the number.",
  },
  {
    slug: "nigeria",
    region: "Africa",
    name: "Nigeria",
    demonym: "Nigerian",
    dialCode: "234",
    rateCents: 20,
    intro:
      "Lagos, Abuja, Kano — call any Nigerian landline or mobile at one per-minute rate, with nothing to install or sign up for on their end.",
    dialingNote:
      "Nigerian mobiles are 10 digits starting with 7, 8, or 9 (written locally with a leading 0). Drop the leading 0 and dial +234, then the rest of the number.",
  },
  {
    slug: "ghana",
    region: "Africa",
    name: "Ghana",
    demonym: "Ghanaian",
    dialCode: "233",
    rateCents: 49,
    intro:
      "Accra, Kumasi, Tamale — reach any Ghanaian landline or mobile at one per-minute rate; there's nothing for them to download or set up.",
    dialingNote:
      "Ghanaian mobiles are 9 digits starting with 2 or 5 (written locally with a leading 0). Drop the leading 0 and dial +233, then the rest of the number.",
  },
  {
    slug: "kenya",
    region: "Africa",
    name: "Kenya",
    demonym: "Kenyan",
    dialCode: "254",
    rateCents: 36,
    intro:
      "Nairobi, Mombasa, Kisumu — call any Kenyan landline or mobile at one per-minute rate, no app or internet needed on their end.",
    dialingNote:
      "Kenyan mobiles are 9 digits starting with 7 or 1 (written locally as 07… or 01…). Drop the leading 0 and dial +254, then the rest of the number.",
  },
  {
    slug: "ethiopia",
    region: "Africa",
    name: "Ethiopia",
    demonym: "Ethiopian",
    dialCode: "251",
    rateCents: 47,
    intro:
      "Addis Ababa, Dire Dawa, Bahir Dar — Kalum calls regular Ethiopian phone numbers, so even when the internet over there is out, their phone still rings.",
    dialingNote:
      "Ethiopian mobiles are 9 digits starting with 9 (written locally as 09…). Drop the leading 0 and dial +251, then the rest of the number.",
  },
];

/** Display form: "6¢" / "24¢" under a dollar, "$1.10" at or above it. */
export function rateLabel(d: Destination): string {
  if (d.rateCents >= 100) {
    return `$${(d.rateCents / 100).toFixed(2)}`;
  }
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
