// Every word on a home page, one object per locale.
//
// Why this file exists: until 2026-09-19 /es/ was hand-written markup that
// happened to resemble /. It reused one of the eight home sections, so every
// improvement made to the English page — the hero screenshot, the trust strip,
// the destinations grid — skipped Spanish by construction. Eight separate
// parity gaps were fixed by hand before someone noticed they were all the same
// bug. The fix is structural: one set of components, one copy object per
// locale, and scripts/check-parity.mjs to fail the build if a locale ever
// drops a section again. See docs/locale-parity-refactor-2026-09-19.md.
//
// RULE: a locale's strings are that locale's own. Spanish here is
// purpose-written for the Mexico corridor (celular, saldo, marcar), not a
// translation of the English, and the two differ in message where they should
// — the Spanish final CTA asks for a first call, the English one names a
// price. Do not "align" them. Edit a locale's copy only to say something
// truer in that locale.
//
// {countries} is the only placeholder. It is the live coverage floor from
// lib/rates.ts, so it must not be hard-coded into a string; pass copy through
// fill() wherever it can appear.

export type HomeLocale = "en" | "es";

export interface HomeCopy {
  /** utm_campaign stem for store badges: `${utmPrefix}-hero`, `-final`. */
  utmPrefix: string;
  hero: {
    eyebrow: string;
    headline: string;
    /** Second line of the h1, set in a lighter ink. */
    headlineAccent: string;
    body: string;
    note: string;
    imageAlt: string;
  };
  noInternet: {
    heading: string;
    body: string;
    tiles: { title: string; body: string }[];
    moreLabel: string;
    moreHref: string;
  };
  steps: {
    heading: string;
    items: { n: string; title: string; body: string }[];
    /** Optional: a locale only links a page that exists in that locale. */
    more?: { label: string; href: string };
  };
  faq: {
    heading: string;
    /** Optional standfirst under the heading. */
    intro?: string;
    items: { q: string; a: string }[];
  };
  finalCta: { heading: string; body: string };
}

/** Substitute the live coverage count into a copy string. */
export function fill(text: string, countries: number): string {
  return text.replace(/\{countries\}/g, String(countries));
}

const en: HomeCopy = {
  utmPrefix: "kalum-web",
  hero: {
    eyebrow: "Pay-as-you-go international calling app",
    headline: "Cheap international calls to any phone, anywhere.",
    headlineAccent: "They just pick up.",
    body: "Cheap calls to landlines and mobiles in {countries}+ countries. No app on their side. No internet on their side. Just a regular phone call.",
    note: "Start with $4.99. No subscription. Credit never expires.",
    imageAlt: "Kalum dialer showing the per-minute rate before placing a call",
  },
  noInternet: {
    heading: "Works with the phone they already have.",
    body: "Kalum connects to real phone networks, not another app. Whoever you call answers on whatever phone they own.",
    tiles: [
      {
        title: "Home landlines",
        body: "Perfect for parents and grandparents who never switched.",
      },
      {
        title: "Old mobiles",
        body: "Any number. Any carrier. Any country.",
      },
      {
        title: "No internet needed",
        body: "They don't download anything. They don't sign up. They just answer.",
      },
    ],
    moreLabel: "How calling without internet works",
    moreHref: "/call-without-internet/",
  },
  steps: {
    heading: "Three steps. Then you're calling.",
    items: [
      {
        n: "1",
        title: "Sign up with your phone number",
        body: "One verification code. No email, no password to remember.",
      },
      {
        n: "2",
        title: "Add $4.99 in credit",
        body: "Pay through the App Store on iPhone or with any card on Android. Top up more anytime. Your credit never expires.",
      },
      {
        n: "3",
        title: "Dial like any phone",
        body: "Pick a country, type the number, hit call. Their phone rings like normal.",
      },
    ],
    more: { label: "See the full how-it-works", href: "/how-it-works/" },
  },
  // Homepage FAQ. Kept distinct from the longer /how-it-works FAQ to avoid
  // duplicate content. Doubles as keyword-rich body copy and emits FAQPage
  // structured data for rich results. Copy must stay within verified claims.
  faq: {
    heading: "Cheap international calls, answered.",
    intro: "The questions people ask before they call abroad with Kalum.",
    items: [
      {
        q: "What is Kalum?",
        a: "Kalum is an international calling app for cheap calls to any phone abroad. You call landlines and mobiles in {countries}+ countries straight from your iPhone or Android, and the person on the other end answers on whatever phone they already have.",
      },
      {
        q: "Does the person I call need the app or internet?",
        a: "No. They need no app, no smartphone, and no internet. Kalum routes through real phone networks, so their phone simply rings like any normal call — even an old landline or feature phone works.",
      },
      {
        q: "How cheap are international calls with Kalum?",
        a: "You can start from $4.99 in credit, and you see the exact per-minute rate for each country before you dial. Rates vary by destination, so you always know the price up front.",
      },
      {
        q: "Is there a subscription or contract?",
        a: "No subscriptions and no contracts. You add credit when you want it, top up anytime, and your credit never expires.",
      },
      {
        q: "Which countries can I call?",
        a: "Over {countries} destinations worldwide — landlines and mobiles across Africa, the Americas, Asia, Europe, and the Middle East.",
      },
    ],
  },
  finalCta: {
    heading: "Try Kalum for $4.99.",
    body: "No commitment. Add more anytime. Cheap calls to landlines and mobiles in {countries}+ countries — on iPhone and Android.",
  },
};

// Spanish homepage (Mexico corridor). Purpose-written Spanish, not a literal
// translation — Mexican conventions (celular, saldo, marcar) and keyword
// intent ("llamadas internacionales baratas", "app de llamadas
// internacionales"). Claims held to the same verified facts as the English
// site. LLM-authored; a native review pass is welcome and applies as plain
// content edits.
const es: HomeCopy = {
  utmPrefix: "kalum-web-es",
  hero: {
    eyebrow: "Llamadas internacionales de prepago",
    headline: "Llamadas internacionales baratas a cualquier teléfono.",
    headlineAccent: "Solo contestan.",
    body: "Llama a teléfonos fijos y celulares en más de {countries} países. Sin app de su lado. Sin internet de su lado. Es una llamada telefónica normal.",
    note: "Empieza con $4.99. Sin suscripción. Tu saldo nunca vence.",
    imageAlt: "Marcador de Kalum mostrando la tarifa por minuto antes de llamar",
  },
  noInternet: {
    heading: "Funciona con el teléfono que ya tienen.",
    body: "Kalum se conecta a las redes telefónicas reales, no a otra app. A quien llamas contesta en el teléfono que ya usa.",
    tiles: [
      {
        title: "Teléfonos fijos",
        body: "Perfecto para los papás y abuelos que nunca cambiaron.",
      },
      {
        title: "Celulares viejos",
        body: "Cualquier número. Cualquier compañía. Cualquier país.",
      },
      {
        title: "Sin internet",
        body: "No descargan nada. No se registran. Solo contestan.",
      },
    ],
    moreLabel: "Cómo funciona llamar sin internet",
    moreHref: "/es/call-without-internet/",
  },
  steps: {
    heading: "Tres pasos. Y ya estás llamando.",
    items: [
      {
        n: "1",
        title: "Regístrate con tu número",
        body: "Un código de verificación. Sin correo ni contraseña que recordar.",
      },
      {
        n: "2",
        title: "Agrega $4.99 de saldo",
        body: "Paga por el App Store en iPhone o con cualquier tarjeta en Android. Recarga cuando quieras. Tu saldo nunca vence.",
      },
      {
        n: "3",
        title: "Marca como cualquier teléfono",
        body: "Elige el país, escribe el número y llama. Su teléfono suena como siempre.",
      },
    ],
  },
  faq: {
    heading: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué es Kalum?",
        a: "Kalum es una app de llamadas internacionales baratas a cualquier teléfono. Llamas a fijos y celulares en más de {countries} países desde tu iPhone o Android, y la persona contesta en el teléfono que ya tiene.",
      },
      {
        q: "¿La persona a la que llamo necesita la app o internet?",
        a: "No. No necesita app, ni smartphone, ni internet. Kalum pasa por las redes telefónicas reales, así que su teléfono suena como cualquier llamada normal — hasta un fijo o un teléfono básico funciona.",
      },
      {
        q: "¿Qué tan baratas son las llamadas?",
        a: "Puedes empezar con $4.99 de saldo y ves la tarifa por minuto de cada país antes de marcar. Las tarifas varían según el destino, así que siempre sabes el precio de antemano.",
      },
      {
        q: "¿Hay suscripción o contrato?",
        a: "No hay suscripciones ni contratos. Agregas saldo cuando quieras, recargas cuando quieras, y tu saldo nunca vence.",
      },
      {
        q: "¿A qué países puedo llamar?",
        a: "Más de {countries} destinos en todo el mundo — fijos y celulares en África, América, Asia, Europa y el Medio Oriente.",
      },
    ],
  },
  finalCta: {
    heading: "¿Listo para tu primera llamada?",
    body: "Descarga Kalum, agrega $4.99 de saldo y marca. Pagas solo los minutos que usas.",
  },
};

export const HOME_COPY: Record<HomeLocale, HomeCopy> = { en, es };
