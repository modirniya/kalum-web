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
  },
  {
    slug: "egypt",
    name: "Egypt",
    demonym: "Egyptian",
    dialCode: "20",
    rateCents: 24,
    intro:
      "Family in Cairo, Alexandria, or anywhere in between — reach any Egyptian landline or mobile at one per-minute rate.",
  },
  {
    slug: "lebanon",
    name: "Lebanon",
    demonym: "Lebanese",
    dialCode: "961",
    rateCents: 39,
    intro:
      "Beirut, Tripoli, or up in the mountains — Kalum calls regular Lebanese phone numbers, so even when the internet over there is out, their phone still rings.",
  },
  {
    slug: "jordan",
    name: "Jordan",
    demonym: "Jordanian",
    dialCode: "962",
    rateCents: 33,
    intro:
      "Amman, Irbid, Zarqa — call any Jordanian landline or mobile and it rings like any normal call.",
  },
  {
    slug: "palestine",
    name: "Palestine",
    demonym: "Palestinian",
    dialCode: "970",
    rateCents: 40,
    intro:
      "Call landlines and mobiles across the West Bank and Gaza at one per-minute rate — no app or internet needed on their side.",
  },
  {
    slug: "iraq",
    name: "Iraq",
    demonym: "Iraqi",
    dialCode: "964",
    rateCents: 41,
    intro:
      "Baghdad, Basra, Erbil — reach any Iraqi landline or mobile without asking anyone to install anything.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    demonym: "Saudi",
    dialCode: "966",
    rateCents: 33,
    intro:
      "Riyadh, Jeddah, Dammam — call any Saudi number, landline or mobile, at one flat per-minute rate.",
  },
  {
    slug: "uae",
    name: "the UAE",
    demonym: "UAE",
    dialCode: "971",
    rateCents: 31,
    intro:
      "Dubai, Abu Dhabi, Sharjah — voice calls on many internet apps are restricted in the UAE, so Kalum dials regular UAE phone numbers instead.",
  },
  {
    slug: "yemen",
    name: "Yemen",
    demonym: "Yemeni",
    dialCode: "967",
    rateCents: 29,
    intro:
      "Sanaa, Aden, Taiz — call any Yemeni landline or mobile; there is nothing to download or set up on their end.",
  },
  {
    slug: "turkey",
    name: "Turkey",
    demonym: "Turkish",
    dialCode: "90",
    rateCents: 31,
    intro:
      "Istanbul, Ankara, Izmir — any Turkish number, landline or mobile, one per-minute rate.",
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
