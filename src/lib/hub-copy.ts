// Every word on a /call/ rates hub, one object per locale.
//
// Like the how-it-works pages, the two hubs were hand-written twins that had
// drifted without anyone deciding to:
//
//   - English had no store badges in its hero. Spanish did.
//   - Spanish had a brand-gradient hero, matching every other page on the
//     site. English packed its hero, the rate finder and the whole
//     destination index into one flat cream section.
//   - The two explainers ended on links to different pages. That one IS a
//     decision and it stays per-locale: an English reader here is choosing a
//     destination, a Spanish reader is more often checking whether the person
//     they call needs internet.
//
// The UAE corridor box is English-only on purpose, not by drift: the three
// pages it links exist only in English. It carries no `data-section` marker,
// so the parity guard ignores it rather than demanding a Spanish twin.
//
// RULE: a locale's strings are that locale's own; do not "align" them.
// See docs/locale-parity-refactor-2026-09-19.md.

export type HubLocale = "en" | "es";

export interface HubCopy {
  /** Both take the number of priced destinations, which moves with the card. */
  title: (destinations: number) => string;
  description: (destinations: number) => string;
  path: string;
  crumbHome: string;
  crumbHomeHref: string;
  crumbSelf: string;
  eyebrow: string;
  h1: string;
  /** Optional second line of the h1, set in a lighter ink. */
  h1Accent?: string;
  intro: (countries: number) => string;
  /** Region heading labels, keyed by the English region name in rates.ts. */
  regions: Record<string, string>;
  /** Destination card microcopy. `callName` takes the localized country name. */
  callName: (name: string) => string;
  cardSubtitle: string;
  /** Micro-label over the price, shown only when rates are "from" prices. */
  fromLabel: string;
  explainerH2: string;
  /** Paragraphs; the link below is appended inside the last one. */
  explainer: string[];
  explainerLink: { label: string; href: string };
  ctaH2: string;
  ctaBody: (countries: number) => string;
  utm: string;
}

const en: HubCopy = {
  // The title used to lead with the cheapest rate and it was a bid on a SERP
  // this site loses: over the three months to 2026-08-30 the hub took 33
  // rate-comparison queries for 95 impressions, zero clicks, at an average
  // position of 43. Rivals' retail beats our cost on those corridors, so
  // leading with a number hands the reader the comparison before the click.
  // The dial-code framing targets the intent the destination pages rank for.
  title: (n) => `Country Codes & Calling Rates — ${n} Destinations | Kalum`,
  description: (n) =>
    `Dialing codes, number formats and per-minute rates for ${n} destinations — Mexico, India, Egypt, Nigeria and more. No app or internet on their end.`,
  path: "/call/",
  crumbHome: "Home",
  crumbHomeHref: "/",
  crumbSelf: "Destinations",
  eyebrow: "Destinations",
  h1: "Country codes and calling rates, by destination.",
  intro: (n) =>
    `Per-minute rates to landlines and mobiles, and the person you call never needs an app or internet. Here are some of the most-called destinations, grouped by region; the app shows live rates for ${n}+ countries before you dial.`,
  regions: {
    Americas: "Americas",
    "Middle East": "Middle East",
    Asia: "Asia",
    Africa: "Africa",
  },
  callName: (name) => `Call ${name}`,
  cardSubtitle: "landlines & mobiles",
  fromLabel: "from",
  explainerH2: "How international calling rates work",
  explainer: [
    "Phone networks in every country charge their own price to connect an incoming call, which is why international calling rates differ by destination — a minute to Mexico doesn't cost the same as a minute to Lebanon. Rates can also change over time as networks adjust what they charge.",
    "Rates can also differ within a country: a mobile and a landline sit on different networks, which is why the figures above are a starting price per destination rather than one price for every number there. That's why Kalum shows you the live per-minute rate for the exact number you're dialing, before the call starts. Calls are billed by the minute, rounded up, with a one-minute minimum — no connection fees and no hidden charges.",
    "There's no subscription either: you add prepaid credit starting from $4.99, it never expires, and you pay only for the minutes you use.",
  ],
  explainerLink: { label: "See how Kalum works", href: "/how-it-works/" },
  ctaH2: "Don't see your country?",
  ctaBody: (n) =>
    `Kalum reaches landlines and mobiles in ${n}+ countries. Download the app and check the live rate for any destination — free to look, no subscription.`,
  utm: "kalum-web-destinations",
};

const es: HubCopy = {
  title: (n) => `Códigos de País y Tarifas — ${n} Destinos | Kalum`,
  description: (n) =>
    `Códigos para marcar, formato de los números y tarifas por minuto para ${n} destinos — México, Colombia, Guatemala y más. Sin app de su lado.`,
  path: "/es/call/",
  crumbHome: "Inicio",
  crumbHomeHref: "/es/",
  crumbSelf: "Destinos",
  eyebrow: "Destinos",
  h1: "Llama a cualquier teléfono, en cualquier país.",
  h1Accent: "Fijos y celulares.",
  intro: (n) =>
    `Kalum marca números de teléfono reales, así que la persona a la que llamas no necesita app, ni smartphone, ni internet. Estos son algunos de los destinos más llamados; en la app ves la tarifa de más de ${n} países antes de marcar.`,
  // América leads because this is the Spanish subtree and that is where its
  // readers call, not because the site favours a region.
  regions: {
    Americas: "América",
    "Middle East": "Medio Oriente",
    Asia: "Asia",
    Africa: "África",
  },
  callName: (name) => `Llamar a ${name}`,
  cardSubtitle: "fijos y celulares",
  fromLabel: "desde",
  explainerH2: "Cómo funcionan las tarifas internacionales",
  explainer: [
    "Las redes telefónicas de cada país cobran su propio precio por conectar una llamada entrante, y por eso las tarifas cambian según el destino — un minuto a México no cuesta lo mismo que un minuto a Honduras. Las tarifas también se mueven con el tiempo, según lo que cobren esas redes.",
    "Dentro de un mismo país también hay diferencias: un celular y un fijo están en redes distintas, así que las cifras de arriba son un precio de partida por destino, no un precio único para todos los números de ese país. Por eso Kalum te muestra la tarifa por minuto del número exacto que marcas, antes de que empiece la llamada. Se cobra por minuto, redondeando hacia arriba, con un mínimo de un minuto — sin cargos por conexión ni cobros escondidos.",
    "Tampoco hay suscripción: agregas saldo de prepago desde $4.99, nunca vence, y pagas solo los minutos que usas.",
  ],
  explainerLink: {
    label: "Mira cómo se llama sin internet de su lado",
    href: "/es/call-without-internet/",
  },
  ctaH2: "¿No ves tu país?",
  ctaBody: (n) =>
    `Kalum llama a fijos y celulares en más de ${n} países. Descarga la app y consulta la tarifa de cualquier destino — verla es gratis y no hay suscripción.`,
  utm: "kalum-web-es-destinos",
};

export const HUB_COPY: Record<HubLocale, HubCopy> = { en, es };
