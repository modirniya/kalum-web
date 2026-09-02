/**
 * Spanish copy table for the /es/ subtree.
 *
 * `src/pages/es/call/mexico.astro` says it plainly: "Scaling Spanish to more
 * countries later should move these strings into a per-locale table rather
 * than copy this file." This is that table. Mexico itself is deliberately left
 * on its hand-written page — it is indexed and earning impressions, and there
 * is no reason to churn it to prove a pattern. Migrate it here only if it needs
 * editing anyway.
 *
 * Underscore prefix keeps Astro from treating this as a route.
 *
 * Everything here is prose. No rate, and no fact that moves when a rate moves,
 * is stored in this file — prices come from the live card at build time via
 * `pricedDestination()`, exactly as the English pages do, so ES and EN can
 * never quote different numbers.
 */

/**
 * Above this, a Spanish destination page stops leading with the price.
 *
 * Mirrors `PRICE_LED_MAX_CENTS` in `src/pages/call/[slug].astro`. It is
 * duplicated rather than imported because that constant is page-local, and
 * Astro pages cannot export to one another. If you tune one, tune both — the
 * failure mode is an English page leading with a price while its Spanish
 * counterpart leads with connectivity, which reads as two different offers.
 *
 * The rationale is the same as the English one: "Llama a México desde 3¢ el
 * minuto" sells; "Llama a Honduras desde 40¢ el minuto" is an anti-hook, and
 * on a comparison SERP it hands the reader a number to lose on. It changes
 * only what the page LEADS with — the figure still appears in the hero rate
 * line, the FAQ and the schema. Hiding a price to win a click is the trust
 * failure this section exists to avoid.
 */
export const PRICE_LED_MAX_CENTS_ES = 10;

export interface DestinationCopyEs {
  /** Country name in Spanish, as it appears mid-sentence ("a Guatemala"). */
  name: string;
  /** Adjective form, plural masculine: "números guatemaltecos". */
  adjective: string;
  /** Breadcrumb / title form: "Llamar a Guatemala". */
  linkLabel: string;
  /** One line under the H1. Concrete places, no claims that can expire. */
  heroSubline: string;
  /** Heading + body for the dialing-format block. */
  numberFormat: { title: string; body: string };
  /** Answer to "¿cuál es el formato de los números?" — mirrors numberFormat. */
  numberFormatFaq: string;
  /**
   * The same fact in one clause, for the meta description. Mirrors
   * `numberFormat` in `src/lib/destinations.ts` and exists for the same reason:
   * the full block runs past where Google cuts a description, and the useful
   * half is the one that gets clipped.
   *
   * This is the highest-value string on the Spanish pages. /es/call/honduras/
   * ranks #1 for "código para llamar a teléfono fijo", #2 for "teléfono fijo",
   * 8 for "honduras numeros de celular" and 11 for "honduras indicativo" — the
   * whole page is found on number-format questions, and answered none of them
   * in its snippet.
   */
  numberFormatShort: string;
}

/**
 * Spanish display names for every destination, for the /es/call/ hub.
 *
 * `destinations.ts` carries English names ("the UAE"), which cannot be
 * rendered on a Spanish page. Keyed by slug so a destination added there
 * without a Spanish name is caught at build time by the hub, which falls back
 * to the English name rather than dropping the row.
 */
export const ES_NAMES: Record<string, string> = {
  mexico: "México",
  colombia: "Colombia",
  guatemala: "Guatemala",
  honduras: "Honduras",
  "el-salvador": "El Salvador",
  egypt: "Egipto",
  lebanon: "Líbano",
  jordan: "Jordania",
  palestine: "Palestina",
  iraq: "Irak",
  "saudi-arabia": "Arabia Saudita",
  uae: "Emiratos Árabes Unidos",
  yemen: "Yemen",
  turkey: "Turquía",
  kuwait: "Kuwait",
  qatar: "Catar",
  oman: "Omán",
  bahrain: "Baréin",
  sudan: "Sudán",
  ethiopia: "Etiopía",
  ghana: "Ghana",
  kenya: "Kenia",
  nigeria: "Nigeria",
  afghanistan: "Afganistán",
  bangladesh: "Bangladés",
  india: "India",
  nepal: "Nepal",
  pakistan: "Pakistán",
  philippines: "Filipinas",
  "sri-lanka": "Sri Lanka",
  vietnam: "Vietnam",
};

/** Region headings for the Spanish hub, in the same order the English hub uses. */
export const ES_REGIONS: Record<string, string> = {
  Americas: "América",
  "Middle East": "Medio Oriente",
  Asia: "Asia",
  Africa: "África",
};

/**
 * Per-country Spanish copy for the destination pages that have one.
 *
 * Dialing formats are the stable, checkable kind — digit counts and the
 * prefixes a number starts with. Nothing here depends on a carrier's pricing
 * or on a restriction that could be lifted next quarter.
 */
export const DESTINATION_COPY_ES: Record<string, DestinationCopyEs> = {
  colombia: {
    name: "Colombia",
    adjective: "colombianos",
    linkLabel: "Llamar a Colombia",
    heroSubline:
      "Un fijo en Medellín o un celular en Bogotá — Kalum marca números colombianos de verdad, así que quien contesta solo levanta su teléfono.",
    numberFormat: {
      title: "El formato de los números colombianos",
      body: "Los celulares en Colombia son de 10 dígitos y empiezan con 3. Los fijos también se marcan con 10 dígitos: se antepone 60 al indicativo de la ciudad. En el marcador de Kalum eliges Colombia (+57) y escribes el número completo — el código de país ya está puesto.",
    },
    numberFormatFaq:
      "Los celulares colombianos son de 10 dígitos y empiezan con 3. Los fijos también se marcan con 10 dígitos, anteponiendo 60 al indicativo de la ciudad. En Kalum eliges Colombia (+57) y escribes el número — el código de país ya está puesto.",
    numberFormatShort:
      "Los celulares en Colombia son de 10 dígitos y empiezan con 3 — marca +57 y el número completo.",
  },
  guatemala: {
    name: "Guatemala",
    adjective: "guatemaltecos",
    linkLabel: "Llamar a Guatemala",
    heroSubline:
      "Un fijo en Quetzaltenango o un celular en la Ciudad de Guatemala — Kalum marca números guatemaltecos de verdad, así que quien contesta solo levanta su teléfono.",
    numberFormat: {
      title: "El formato de los números guatemaltecos",
      body: "Los números de Guatemala son de 8 dígitos, sin indicativo de ciudad. Los celulares suelen empezar con 3, 4 o 5, y los fijos con 2, 6 o 7. En el marcador de Kalum eliges Guatemala (+502) y escribes los 8 dígitos.",
    },
    numberFormatFaq:
      "Los números de Guatemala son de 8 dígitos y no llevan indicativo de ciudad. Los celulares suelen empezar con 3, 4 o 5 y los fijos con 2, 6 o 7. En Kalum eliges Guatemala (+502) y escribes los 8 dígitos.",
    numberFormatShort:
      "Los números de Guatemala son de 8 dígitos, sin cero inicial — marca +502 y los 8 dígitos.",
  },
  honduras: {
    name: "Honduras",
    adjective: "hondureños",
    linkLabel: "Llamar a Honduras",
    heroSubline:
      "Un fijo en San Pedro Sula o un celular en Tegucigalpa — Kalum marca números hondureños de verdad, así que quien contesta solo levanta su teléfono.",
    numberFormat: {
      title: "El formato de los números hondureños",
      body: "Los números de Honduras son de 8 dígitos, sin indicativo de ciudad. Los celulares suelen empezar con 3, 7, 8 o 9, y los fijos con 2. En el marcador de Kalum eliges Honduras (+504) y escribes los 8 dígitos.",
    },
    numberFormatFaq:
      "Los números de Honduras son de 8 dígitos y no llevan indicativo de ciudad. Los celulares suelen empezar con 3, 7, 8 o 9 y los fijos con 2. En Kalum eliges Honduras (+504) y escribes los 8 dígitos.",
    numberFormatShort:
      "Los números de Honduras son de 8 dígitos, sin cero inicial — marca +504 y los 8 dígitos.",
  },
  "el-salvador": {
    name: "El Salvador",
    adjective: "salvadoreños",
    linkLabel: "Llamar a El Salvador",
    heroSubline:
      "Un fijo en Santa Ana o un celular en San Salvador — Kalum marca números salvadoreños de verdad, así que quien contesta solo levanta su teléfono.",
    numberFormat: {
      title: "El formato de los números salvadoreños",
      body: "Los números de El Salvador son de 8 dígitos, sin indicativo de ciudad. Los celulares suelen empezar con 6 o 7, y los fijos con 2. En el marcador de Kalum eliges El Salvador (+503) y escribes los 8 dígitos.",
    },
    numberFormatFaq:
      "Los números de El Salvador son de 8 dígitos y no llevan indicativo de ciudad. Los celulares suelen empezar con 6 o 7 y los fijos con 2. En Kalum eliges El Salvador (+503) y escribes los 8 dígitos.",
    numberFormatShort:
      "Los números de El Salvador son de 8 dígitos, sin cero inicial — marca +503 y los 8 dígitos.",
  },
};
