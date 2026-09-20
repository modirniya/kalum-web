// Every word on a /how-it-works/ page, one object per locale.
//
// Both pages were hand-written before 2026-09-19 and had drifted in opposite
// directions, which is the whole argument for this file existing:
//
//   - English had no FAQPage structured data. Spanish did.
//   - English had no store badges in its hero. Spanish did.
//   - English had no link to the rates hub after the steps. Spanish did.
//   - Spanish had a brand-gradient hero like the rest of the site. English
//     had a plain white header, the only top-level page that did.
//
// Nobody chose any of that. The pages simply got edited at different times.
// The shared component renders the union, so each locale gained whatever the
// other already had, and neither can drift again without the parity guard
// failing the build.
//
// RULE: a locale's strings are that locale's own. Spanish here is
// purpose-written in a neutral Latin-American register, not a translation of
// the English. Edit a locale's copy only to say something truer in that
// locale. See docs/locale-parity-refactor-2026-09-19.md.

export type HowItWorksLocale = "en" | "es";

export interface HowItWorksCopy {
  title: string;
  description: string;
  /** Path of this locale's page, for canonical and hreflang. */
  path: string;
  crumbHome: string;
  crumbHomeHref: string;
  crumbSelf: string;
  h1: string;
  intro: string;
  steps: { n: string; title: string; body: string; note: string }[];
  /** Line under the steps pointing at this locale's rates hub. */
  ratesLink: { lead: string; label: string; href: string };
  faqH2: string;
  faqs: (countries: number) => { q: string; a: string }[];
  ctaH2: string;
  ctaBody: string;
  /** Store-badge campaign tag, used in both the hero and the CTA. */
  utm: string;
}

const en: HowItWorksCopy = {
  title: "How Kalum Works — Cheap Calls With No App for Recipients",
  description:
    "Sign up with your number, add $4.99 in credit, dial any phone. The person you call doesn't need an app or internet — they just pick up.",
  path: "/how-it-works/",
  crumbHome: "Home",
  crumbHomeHref: "/",
  crumbSelf: "How it works",
  h1: "How Kalum works",
  intro:
    "Three steps to call anyone, anywhere — even when they have no internet and no smartphone.",
  steps: [
    {
      n: "1",
      title: "Sign up with your phone number",
      body: "Open Kalum, type your number, and enter the verification code you receive by SMS. No email, no password to remember. Your account is created in under a minute.",
      note: "Your phone number is how you log in. We use it for verification only.",
    },
    {
      n: "2",
      title: "Add $4.99 in credit",
      body: "Top up through the App Store on iPhone or with any debit or credit card on Android. Start with $4.99 to test the connection to your destination country, then add more whenever you want. Pay-as-you-go, no monthly fees, no contracts.",
      note: "Your credit never expires. Whatever you add stays on your account.",
    },
    {
      n: "3",
      title: "Dial like any phone",
      body: "Pick the country code, type the number, and hit call. The person you're calling answers their regular phone — landline or mobile, smartphone or feature phone, anywhere in the world. They don't need Kalum.",
      note: "See the per-minute rate before you dial. No surprises.",
    },
  ],
  // The one string on this page with no prior original in English: the Spanish
  // page had carried this link to its rates hub since it was written, and the
  // English page had nothing pointing there from below the steps.
  ratesLink: {
    lead: "Want rates by country?",
    label: "See the destinations and their rates",
    href: "/call/",
  },
  faqH2: "Frequently asked questions",
  faqs: (n) => [
    {
      q: "Do I need internet to call?",
      a: "Yes — on your end. The recipient does not. Kalum uses your data connection to start the call, then routes through real phone networks worldwide. The person you call answers on their regular phone like any other call.",
    },
    {
      q: "Does the person I call need the app?",
      a: "No. They just answer their phone. Kalum works with any landline or mobile number, even old feature phones with no internet. You don't need to convince anyone to download anything.",
    },
    {
      q: "How are calls billed?",
      a: "Per minute, with a 60-second minimum. Calls round up to the next full minute. You can see the exact per-minute rate for any country before you dial. No connection fees, no hidden charges.",
    },
    {
      q: "Does my credit expire?",
      a: "Never. Credit you add stays on your account until you use it. There are no monthly fees, no minimum balance, and no contracts.",
    },
    {
      q: "Which countries can I call?",
      a: `Over ${n} destinations worldwide — landlines and mobiles across Africa, the Americas, Asia, Europe, and the Middle East. You can see the exact per-minute rate for any country before you dial.`,
    },
  ],
  ctaH2: "Ready to make your first call?",
  ctaBody: "Available on iPhone and Android.",
  utm: "kalum-web-howitworks",
};

// Purpose-written Spanish, neutral Latin-American register. Same verified
// claims as the English page — nothing added, nothing softened.
const es: HowItWorksCopy = {
  title: "Cómo Funciona Kalum — Llamadas Baratas, Sin App de Su Lado",
  description:
    "Regístrate con tu número, agrega $4.99 de saldo y marca a cualquier teléfono. La persona a la que llamas no necesita app ni internet — solo contesta.",
  path: "/es/how-it-works/",
  crumbHome: "Inicio",
  crumbHomeHref: "/es/",
  crumbSelf: "Cómo funciona",
  h1: "Cómo funciona Kalum",
  intro:
    "Tres pasos para llamar a quien sea, donde sea — aunque no tenga internet ni smartphone.",
  steps: [
    {
      n: "1",
      title: "Regístrate con tu número",
      body: "Abre Kalum, escribe tu número y pon el código de verificación que te llega por SMS. Sin correo y sin contraseña que recordar. Tu cuenta queda lista en menos de un minuto.",
      note: "Tu número de teléfono es con lo que entras. Lo usamos solo para verificarte.",
    },
    {
      n: "2",
      title: "Agrega $4.99 de saldo",
      body: "Recarga por el App Store en iPhone o con cualquier tarjeta de débito o crédito en Android. Empieza con $4.99 para probar la conexión al país al que llamas y agrega más cuando quieras. Pagas sobre la marcha: sin mensualidades ni contratos.",
      note: "Tu saldo nunca vence. Lo que agregas se queda en tu cuenta.",
    },
    {
      n: "3",
      title: "Marca como con cualquier teléfono",
      body: "Elige el código del país, escribe el número y llama. La persona contesta en su teléfono de siempre — fijo o celular, smartphone o teléfono básico, en cualquier parte del mundo. No necesita tener Kalum.",
      note: "Ves la tarifa por minuto antes de marcar. Sin sorpresas.",
    },
  ],
  ratesLink: {
    lead: "¿Quieres ver las tarifas por país?",
    label: "Mira los destinos y sus tarifas",
    href: "/es/call/",
  },
  faqH2: "Preguntas frecuentes",
  faqs: (n) => [
    {
      q: "¿Necesito internet para llamar?",
      a: "Sí, pero solo de tu lado. Quien recibe la llamada no. Kalum usa tus datos o Wi-Fi para iniciar la llamada y luego la pasa por las redes telefónicas reales de todo el mundo. La persona a la que llamas contesta en su teléfono normal, como en cualquier otra llamada.",
    },
    {
      q: "¿La persona a la que llamo necesita la app?",
      a: "No. Solo contesta su teléfono. Kalum funciona con cualquier número fijo o celular, incluso con teléfonos básicos sin internet. No tienes que convencer a nadie de descargar nada.",
    },
    {
      q: "¿Cómo se cobran las llamadas?",
      a: "Por minuto, con un mínimo de 60 segundos. Las llamadas se redondean al minuto completo. Puedes ver la tarifa exacta por minuto de cualquier país antes de marcar. Sin cargos por conexión ni cobros escondidos.",
    },
    {
      q: "¿Mi saldo vence?",
      a: "Nunca. El saldo que agregas se queda en tu cuenta hasta que lo uses. No hay mensualidades, ni saldo mínimo, ni contratos.",
    },
    {
      q: "¿A qué países puedo llamar?",
      a: `A más de ${n} destinos en todo el mundo — fijos y celulares en África, América, Asia, Europa y el Medio Oriente. Puedes ver la tarifa exacta por minuto de cualquier país antes de marcar.`,
    },
  ],
  ctaH2: "¿Listo para tu primera llamada?",
  ctaBody: "Disponible en iPhone y Android.",
  utm: "kalum-web-es-como-funciona",
};

export const HOW_IT_WORKS_COPY: Record<HowItWorksLocale, HowItWorksCopy> = { en, es };
