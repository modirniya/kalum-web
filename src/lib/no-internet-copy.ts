import type { Locale } from "./i18n";

/**
 * Copy for the single-page locales of /call-without-internet/.
 *
 * English is not in this table; its page is the original and still stands on
 * its own. Spanish was not either, on the grounds that it was indexed and
 * earning at position 7.6 and there was no reason to churn it — the same
 * exemption src/pages/es/_destinations-es.ts once made for Mexico, and it
 * failed the same way: the destination-links block every other locale had was
 * missing from Spanish for months because the page was hand-written. Since
 * 2026-09-19 Spanish renders from a row here like everyone else.
 *
 * A locale with a tree of its own (Spanish has one: a home, a how-it-works,
 * five destination pages) sets `homeHref` and `destinationsHreflang` so its
 * breadcrumb and its rate links stay in-language. A single-page locale leaves
 * both unset and links the English pages, saying so in `destinationsNote`.
 *
 * Each row is purpose-written for the corridor that language actually calls
 * on, not translated from the English: the Arabic page talks about a landline
 * in Cairo and calling from the Gulf, the Turkish page about calling from
 * Germany and the Netherlands, the Tagalog page about an OFW in Riyadh. The
 * examples move; the claims do not.
 *
 * THE CLAIM SET IS FIXED. Every row must stay inside what the English page
 * says and nothing more:
 *   - the person you call needs no internet, no app, no smartphone
 *   - Kalum routes the call over real phone networks
 *   - a landline or a basic keypad phone rings like any normal call
 *   - the caller needs data or Wi-Fi on their own end only
 *   - landlines and mobiles in {countries}+ countries (interpolated, never typed)
 *   - rates are per country; the app shows the exact per-minute rate before you dial
 *   - prepaid credit from $4.99; no subscription; credit never expires
 *   - billed per minute, one-minute minimum
 * Nothing about quality, nothing about specific rates, nothing that says or
 * implies a restriction is being circumvented. A translation that reads
 * better by adding a claim is wrong.
 *
 * Authorship: LLM-written to native register, claims-checked line by line
 * against the list above. Same footing the Spanish shipped on in Phase 5, with
 * the same recommendation — a native reader's pass applies as plain content
 * edits here, nothing structural. Arabic and the Indic languages carry more
 * register risk than Spanish did; treat that pass as more than a nicety.
 */
export interface NoInternetCopy {
  /** <title>. Keep the brand suffix so the tab reads as Kalum. */
  title: string;
  description: (countries: number) => string;
  /** Breadcrumb: the home crumb links to the English home unless `homeHref`. */
  crumbHome: string;
  /** Home-crumb target. Default "/" — set only by a locale with its own tree. */
  homeHref?: string;
  crumbSelf: string;
  eyebrow: string;
  /** Two-line hero headline. */
  h1: [string, string];
  intro: (countries: number) => string;
  finePrint: string;
  explainerH2: string;
  explainer: string[];
  reasonsH2: string;
  reasons: { title: string; body: string }[];
  /** Optional link under the reason tiles, to this locale's lead corridor. */
  reasonsMore?: { label: string; href: string };
  /** Heading over the links to destination rate pages, and the links. */
  destinationsH2: string;
  /** Optional paragraph between that heading and the links. */
  destinationsIntro?: (countries: number) => string;
  /**
   * `slug` is optional and opts a link into the live per-minute rate, rendered
   * after the label exactly as the destination pages render their siblings.
   * Only a locale linking its own rate pages should set it: the price shown
   * must be on a page in the same language as the chip.
   */
  destinations: { label: string; href: string; slug?: string }[];
  /** hreflang on those links. Default "en". */
  destinationsHreflang?: Locale;
  /** Optional "see every destination" link under the chips. */
  destinationsMore?: { label: string; href: string };
  /**
   * Small note under the destination links saying those pages are in English.
   * Omitted by a locale whose links are already in its own language.
   */
  destinationsNote?: string;
  faqH2: string;
  faqs: (countries: number) => { q: string; a: string }[];
  ctaH2: string;
  ctaBody: (countries: number) => string;
  /** Store-badge campaign tag. */
  utm: string;
  /**
   * Link text used ON ENGLISH DESTINATION PAGES pointing at this page, so a
   * reader who landed on /call/egypt/ in English can find the Arabic. Written
   * in the target language, because that is the reader it is for.
   */
  readHere: string;
}

export const NO_INTERNET_COPY: Partial<Record<Locale, NoInternetCopy>> = {
  /* ------------------------------------------------------------------ */
  // Spanish. Unlike the single-page locales this one sits inside a full
  // Spanish tree, so its breadcrumb goes to /es/ and its destination links go
  // to the Spanish rate pages, priced, rather than to the English ones.
  // Every string below is the hand-written page's own, lifted unchanged.
  es: {
    title: "Llamar a Alguien Sin Internet — Su Teléfono Suena | Kalum",
    description: (n) =>
      `Llama a quien no tiene internet ni smartphone. Kalum usa las redes telefónicas reales, así que cualquier fijo o teléfono básico en más de ${n} países suena.`,
    crumbHome: "Inicio",
    homeHref: "/es/",
    crumbSelf: "Llamar sin internet",
    eyebrow: "Sin internet de su lado",
    h1: ["Llama a quien no tiene internet.", "Su teléfono suena igual."],
    intro: (n) =>
      `Kalum es una app de llamadas internacionales que marca a números de teléfono reales — fijos y celulares en más de ${n} países. La persona a la que llamas no necesita app, ni smartphone, ni internet.`,
    finePrint: "Empieza con $4.99. Sin suscripción. Tu saldo nunca vence.",
    explainerH2: "Tú necesitas internet. Ellos no.",
    explainer: [
      "Las apps de llamadas por internet solo funcionan cuando ambos lados están en línea con la misma app instalada. Kalum funciona distinto: la app usa tus datos o Wi-Fi para iniciar la llamada y luego la pasa por las redes telefónicas normales hasta el número que marcaste.",
      "Del otro lado, nada cambia. Su teléfono suena como cualquier llamada — ya sea un fijo en la pared de la cocina o un teléfono básico de hace quince años. Contestan, y hablas.",
      "Ves la tarifa por minuto de su país antes de marcar, y las llamadas se cobran por minuto con un mínimo de 60 segundos.",
    ],
    reasonsH2: "Hecho para los teléfonos que las apps olvidaron.",
    reasons: [
      {
        title: "Casas con teléfono fijo",
        body: "Papás y abuelos que nunca dejaron el teléfono de casa. Un fijo no puede instalar una app — con Kalum no hace falta.",
      },
      {
        title: "Teléfonos básicos",
        body: "Buena parte del mundo llama desde teléfonos de botones. Cualquier número, en cualquier compañía, suena — sin necesidad de smartphone.",
      },
      {
        title: "Internet poco confiable",
        body: "Cortes de luz, mala señal, datos caros. Cuando el internet de su lado falla, una llamada telefónica normal igual entra.",
      },
    ],
    reasonsMore: {
      label: "Ver tarifas para llamar a México",
      href: "/es/call/mexico/",
    },
    destinationsH2: "Tarifas a destinos en español",
    destinationsIntro: (n) =>
      `Kalum llama a fijos y celulares en más de ${n} países. Estos destinos tienen página en español:`,
    destinations: [
      { label: "México", href: "/es/call/mexico/", slug: "mexico" },
      { label: "Colombia", href: "/es/call/colombia/", slug: "colombia" },
      { label: "Guatemala", href: "/es/call/guatemala/", slug: "guatemala" },
      { label: "Honduras", href: "/es/call/honduras/", slug: "honduras" },
      { label: "El Salvador", href: "/es/call/el-salvador/", slug: "el-salvador" },
    ],
    destinationsHreflang: "es",
    destinationsMore: {
      label: "Ver todos los destinos y tarifas",
      href: "/es/call/",
    },
    faqH2: "Llamar sin internet, sin dudas.",
    faqs: (n) => [
      {
        q: "¿Puedo llamar a alguien que no tiene internet?",
        a: "Sí. Kalum pasa la llamada por las redes telefónicas reales, así que la persona a la que llamas no necesita internet, ni app, ni smartphone. Un fijo viejo o un teléfono básico suena como en cualquier llamada normal.",
      },
      {
        q: "¿Necesito internet para hacer la llamada?",
        a: "Sí, pero solo de tu lado. La app de Kalum usa tus datos o Wi-Fi para iniciar la llamada y luego la pasa a las redes telefónicas normales. La persona a la que llamas nunca necesita conexión.",
      },
      {
        q: "¿Puedo llamar a teléfonos fijos?",
        a: `Sí. Kalum llama a fijos y celulares en más de ${n} países. A quien llames contesta en el teléfono que ya tiene — nada que descargar, nada que configurar de su lado.`,
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Las tarifas son por país, y la app te muestra la tarifa exacta por minuto antes de marcar. Agregas saldo de prepago desde $4.99 — sin suscripción, y tu saldo nunca vence.",
      },
    ],
    ctaH2: "¿Listo para llamar?",
    ctaBody: (n) =>
      `Descarga Kalum, agrega $4.99 de saldo y marca a cualquier fijo o celular en más de ${n} países. Pagas solo los minutos que usas.`,
    utm: "kalum-web-es-sin-internet",
    // Unused today: no destination in LOCALE_FOR_DESTINATION maps to "es",
    // because the Spanish corridors have Spanish destination pages of their
    // own and the English page links those directly.
    readHere: "En español: llama a quien no tiene internet",
  },
  /* ------------------------------------------------------------------ */
  ar: {
    title: "اتصل بشخص ليس لديه إنترنت — هاتفه يرنّ كالمعتاد | Kalum",
    description: (n) =>
      `اتصل بمن لا يملك إنترنت ولا هاتفاً ذكياً ولا تطبيقات. يمرّر Kalum مكالمتك عبر شبكات الهاتف الحقيقية، فيرنّ أي خط أرضي أو هاتف عادي في أكثر من ${n} دولة.`,
    crumbHome: "الرئيسية",
    crumbSelf: "الاتصال بدون إنترنت",
    eyebrow: "لا يحتاجون إلى إنترنت",
    h1: ["اتصل بمن ليس لديه إنترنت.", "هاتفه يرنّ كأي مكالمة عادية."],
    intro: (n) =>
      `Kalum تطبيق مكالمات دولية يتصل بأرقام هاتف حقيقية — خطوط أرضية وجوّالات في أكثر من ${n} دولة. الشخص الذي تتصل به لا يحتاج إلى تطبيق ولا هاتف ذكي ولا إنترنت.`,
    finePrint: "ابدأ بـ 4.99 دولار. بدون اشتراك. رصيدك لا تنتهي صلاحيته.",
    explainerH2: "أنت تحتاج إلى الإنترنت. هم لا.",
    explainer: [
      "تطبيقات المكالمات عبر الإنترنت لا تعمل إلا حين يكون الطرفان متصلين بالإنترنت وعلى التطبيق نفسه. Kalum يعمل بطريقة مختلفة: يستخدم التطبيق بياناتك أو شبكة الواي فاي لبدء المكالمة، ثم يمرّرها عبر شبكات الهاتف العادية إلى الرقم الذي طلبته.",
      "على الطرف الآخر لا يتغيّر شيء. يرنّ الهاتف كأي مكالمة — سواء كان خطاً أرضياً في بيت العائلة بالقاهرة أو عمّان، أو هاتفاً عادياً بأزرار عمره سنوات. يردّون، وتتكلمون.",
      "ترى سعر الدقيقة لبلدهم قبل أن تتصل، وتُحتسب المكالمات بالدقيقة بحدّ أدنى دقيقة واحدة.",
    ],
    reasonsH2: "صُنع للهواتف التي نسيتها التطبيقات.",
    reasons: [
      {
        title: "بيوت الخط الأرضي",
        body: "الأهل والأجداد الذين لم يتركوا هاتف البيت يوماً. الخط الأرضي لا يستطيع تثبيت تطبيق — ومع Kalum لا يحتاج إلى ذلك.",
      },
      {
        title: "الهواتف العادية",
        body: "كثير من الناس ما زالوا يتصلون من هواتف بأزرار. أي رقم على أي شبكة يرنّ، بلا حاجة إلى هاتف ذكي.",
      },
      {
        title: "إنترنت غير مستقرّ",
        body: "انقطاع الكهرباء، تغطية ضعيفة، باقات غالية. حين يتعطّل الإنترنت عندهم، المكالمة الهاتفية العادية تصل رغم ذلك.",
      },
    ],
    destinationsH2: "أسعار الاتصال بالوجهات العربية",
    destinations: [
      { label: "الاتصال بمصر", href: "/call/egypt/" },
      { label: "الاتصال بالأردن", href: "/call/jordan/" },
      { label: "الاتصال بالعراق", href: "/call/iraq/" },
      { label: "الاتصال بلبنان", href: "/call/lebanon/" },
      { label: "الاتصال بالسعودية", href: "/call/saudi-arabia/" },
      { label: "الاتصال بالسودان", href: "/call/sudan/" },
      { label: "الاتصال باليمن", href: "/call/yemen/" },
      { label: "الاتصال بفلسطين", href: "/call/palestine/" },
      { label: "الاتصال من الخليج", href: "/whatsapp-calls-blocked/" },
    ],
    destinationsNote: "صفحات الأسعار بالإنجليزية.",
    faqH2: "الاتصال بدون إنترنت — أسئلة وأجوبة",
    faqs: (n) => [
      {
        q: "هل أستطيع الاتصال بشخص ليس لديه إنترنت إطلاقاً؟",
        a: "نعم. يمرّر Kalum مكالمتك عبر شبكات الهاتف الحقيقية، فلا يحتاج من تتصل به إلى إنترنت ولا تطبيق ولا هاتف ذكي. الخط الأرضي القديم أو الهاتف العادي يرنّ كما في أي مكالمة طبيعية.",
      },
      {
        q: "هل أحتاج أنا إلى الإنترنت لإجراء المكالمة؟",
        a: "نعم — من جهتك فقط. يستخدم تطبيق Kalum بياناتك أو الواي فاي لبدء المكالمة، ثم يسلّمها إلى شبكات الهاتف العادية. الشخص الذي تتصل به لا يحتاج إلى اتصال أبداً.",
      },
      {
        q: "هل أستطيع الاتصال بالخطوط الأرضية؟",
        a: `نعم. يتصل Kalum بالخطوط الأرضية والجوّالات في أكثر من ${n} دولة. من تتصل به يردّ على الهاتف الذي يملكه أصلاً — لا شيء يحمّله ولا شيء يضبطه من جهته.`,
      },
      {
        q: "كم التكلفة؟",
        a: "الأسعار حسب البلد، ويعرض لك التطبيق سعر الدقيقة بالضبط قبل أن تتصل. تضيف رصيداً مسبق الدفع ابتداءً من 4.99 دولار — بلا اشتراك، ورصيدك لا تنتهي صلاحيته.",
      },
    ],
    ctaH2: "جاهز للاتصال؟",
    ctaBody: (n) =>
      `حمّل Kalum، أضف رصيداً بـ 4.99 دولار، واتصل بأي خط أرضي أو جوّال في أكثر من ${n} دولة. تدفع فقط ثمن الدقائق التي تستخدمها.`,
    utm: "kalum-web-ar-no-internet",
    readHere: "بالعربية: اتصل بمن ليس لديه إنترنت",
  },

  /* ------------------------------------------------------------------ */
  tr: {
    // Worded as the H1: Google was replacing the old, differently-worded
    // title with the H1 in results (seen 2026-09-23).
    title: "İnterneti olmayanı arayın. Telefonu yine de çalar. | Kalum",
    description: (n) =>
      `İnterneti ve akıllı telefonu olmayan kişileri arayın. Kalum gerçek telefon şebekelerini kullanır; ${n}'den fazla ülkede sabit hat ve tuşlu telefon çalar.`,
    crumbHome: "Ana sayfa",
    crumbSelf: "İnternetsiz arama",
    eyebrow: "Karşı tarafta internet gerekmez",
    h1: ["İnterneti olmayanı arayın.", "Telefonu yine de çalar."],
    intro: (n) =>
      `Kalum, gerçek telefon numaralarını arayan bir uluslararası arama uygulamasıdır — ${n}'den fazla ülkede sabit hatlar ve cep telefonları. Aradığınız kişinin uygulamaya, akıllı telefona ya da internete ihtiyacı yoktur.`,
    finePrint: "4,99 $ ile başlayın. Abonelik yok. Bakiyenizin süresi dolmaz.",
    explainerH2: "İnternet size lazım. Onlara değil.",
    explainer: [
      "İnternet üzerinden arama uygulamaları ancak iki taraf da çevrimiçiyse ve aynı uygulama yüklüyse çalışır. Kalum farklı çalışır: uygulama, aramayı başlatmak için sizin mobil verinizi ya da Wi-Fi'nizi kullanır, sonra aramayı normal telefon şebekeleri üzerinden tuşladığınız numaraya ulaştırır.",
      "Karşı tarafta hiçbir şey değişmez. Telefonları her zamanki gibi çalar — ister memleketteki evin duvarındaki sabit hat olsun, ister on beş yıllık tuşlu bir telefon. Açarlar, konuşursunuz.",
      "Aramadan önce o ülkenin dakika ücretini görürsünüz; aramalar dakika başına, en az bir dakika üzerinden ücretlendirilir.",
    ],
    reasonsH2: "Uygulamaların unuttuğu telefonlar için yapıldı.",
    reasons: [
      {
        title: "Sabit hatlı evler",
        body: "Ev telefonundan hiç vazgeçmemiş anneler, babalar, dedeler. Sabit hatta uygulama yüklenmez — Kalum ile gerek de yok.",
      },
      {
        title: "Tuşlu telefonlar",
        body: "Dünyanın büyük kısmı hâlâ tuşlu telefondan arıyor. Hangi operatörde olursa olsun her numara çalar; akıllı telefon şart değil.",
      },
      {
        title: "Güvenilmez internet",
        body: "Elektrik kesintisi, zayıf çekim, pahalı internet paketi. Onların tarafında internet gittiğinde normal bir telefon araması yine de ulaşır.",
      },
    ],
    destinationsH2: "Türkiye'yi arama tarifeleri",
    destinations: [
      { label: "Türkiye'yi arayın", href: "/call/turkey/" },
      { label: "Tüm ülkeler ve tarifeler", href: "/call/" },
    ],
    destinationsNote: "Tarife sayfaları İngilizcedir.",
    faqH2: "İnternetsiz arama, soru-cevap",
    faqs: (n) => [
      {
        q: "Hiç interneti olmayan birini arayabilir miyim?",
        a: "Evet. Kalum aramanızı gerçek telefon şebekeleri üzerinden geçirir; aradığınız kişinin internete, uygulamaya ya da akıllı telefona ihtiyacı yoktur. Eski bir sabit hat ya da basit bir tuşlu telefon, normal bir aramadaki gibi çalar.",
      },
      {
        q: "Aramayı yapmak için benim internetim olmalı mı?",
        a: "Evet — yalnızca sizin tarafınızda. Kalum uygulaması aramayı başlatmak için mobil verinizi ya da Wi-Fi'nizi kullanır, sonra aramayı normal telefon şebekelerine devreder. Aradığınız kişiye asla bağlantı gerekmez.",
      },
      {
        q: "Sabit hatları arayabilir miyim?",
        a: `Evet. Kalum ${n}'den fazla ülkede sabit hatları ve cep telefonlarını arar. Aradığınız kişi elindeki telefonla açar — onun tarafında indirilecek ya da ayarlanacak bir şey yoktur.`,
      },
      {
        q: "Ücreti nedir?",
        a: "Tarifeler ülkeye göredir ve uygulama aramadan önce dakika ücretini tam olarak gösterir. 4,99 $'dan başlayarak ön ödemeli bakiye yüklersiniz — abonelik yoktur ve bakiyenizin süresi dolmaz.",
      },
    ],
    ctaH2: "Aramaya hazır mısınız?",
    ctaBody: (n) =>
      `Kalum'u indirin, 4,99 $ bakiye yükleyin ve ${n}'den fazla ülkede istediğiniz sabit hattı ya da cep telefonunu arayın. Yalnızca konuştuğunuz dakikaları ödersiniz.`,
    utm: "kalum-web-tr-no-internet",
    readHere: "Türkçe: interneti olmayan birini arayın",
  },

  /* ------------------------------------------------------------------ */
  hi: {
    title: "बिना इंटरनेट वाले को कॉल करें — उनका फ़ोन वैसे ही बजता है",
    description: (n) =>
      `जिनके पास इंटरनेट या स्मार्टफ़ोन नहीं है, उन्हें कॉल करें। Kalum असली फ़ोन नेटवर्क से जोड़ता है, इसलिए ${n}+ देशों में लैंडलाइन या बटन फ़ोन बज उठता है।`,
    crumbHome: "होम",
    crumbSelf: "बिना इंटरनेट कॉल",
    eyebrow: "सामने वाले को इंटरनेट नहीं चाहिए",
    h1: ["बिना इंटरनेट वालों को कॉल करें।", "उनका फ़ोन वैसे ही बजता है।"],
    intro: (n) =>
      `Kalum एक इंटरनेशनल कॉलिंग ऐप है जो असली फ़ोन नंबर डायल करता है — ${n}+ देशों में लैंडलाइन और मोबाइल। जिसे आप कॉल कर रहे हैं, उसे न ऐप चाहिए, न स्मार्टफ़ोन, न इंटरनेट।`,
    finePrint: "$4.99 से शुरू करें। कोई सब्सक्रिप्शन नहीं। आपका बैलेंस कभी एक्सपायर नहीं होता।",
    explainerH2: "इंटरनेट आपको चाहिए। उन्हें नहीं।",
    explainer: [
      "इंटरनेट कॉलिंग ऐप तभी काम करते हैं जब दोनों तरफ़ इंटरनेट हो और वही ऐप इंस्टॉल हो। Kalum अलग तरीके से काम करता है: ऐप कॉल शुरू करने के लिए आपका डेटा या Wi-Fi इस्तेमाल करता है, फिर उसे सामान्य फ़ोन नेटवर्क से उस नंबर तक पहुँचाता है जो आपने डायल किया।",
      "दूसरी तरफ़ कुछ नहीं बदलता। उनका फ़ोन किसी भी आम कॉल की तरह बजता है — चाहे वह गाँव के घर की लैंडलाइन हो या पंद्रह साल पुराना कीपैड फ़ोन। वे उठाते हैं, आप बात करते हैं।",
      "डायल करने से पहले आप उनके देश का प्रति-मिनट रेट देख लेते हैं, और कॉल का बिल प्रति मिनट बनता है, कम से कम एक मिनट का।",
    ],
    reasonsH2: "उन फ़ोनों के लिए बना है जिन्हें ऐप्स भूल गए।",
    reasons: [
      {
        title: "लैंडलाइन वाले घर",
        body: "माँ-बाप और दादा-दादी जिन्होंने घर का फ़ोन कभी नहीं छोड़ा। लैंडलाइन पर ऐप इंस्टॉल नहीं हो सकता — Kalum के साथ ज़रूरत भी नहीं।",
      },
      {
        title: "कीपैड फ़ोन",
        body: "दुनिया का बड़ा हिस्सा आज भी बटन वाले फ़ोन से कॉल करता है। किसी भी नेटवर्क पर कोई भी नंबर बजता है, स्मार्टफ़ोन ज़रूरी नहीं।",
      },
      {
        title: "भरोसेमंद इंटरनेट नहीं",
        body: "बिजली कटौती, कमज़ोर सिग्नल, महँगा डेटा। जब उनकी तरफ़ का इंटरनेट बंद हो, तब भी एक सामान्य फ़ोन कॉल पहुँच जाती है।",
      },
    ],
    destinationsH2: "भारत कॉल करने के रेट",
    destinations: [
      { label: "भारत कॉल करें", href: "/call/india/" },
      { label: "UAE से भारत कॉल करें", href: "/call-india-from-uae/" },
      { label: "सभी देश और रेट", href: "/call/" },
    ],
    destinationsNote: "रेट वाले पेज अंग्रेज़ी में हैं।",
    faqH2: "बिना इंटरनेट कॉल — सवाल-जवाब",
    faqs: (n) => [
      {
        q: "क्या मैं ऐसे व्यक्ति को कॉल कर सकता हूँ जिसके पास बिल्कुल इंटरनेट नहीं है?",
        a: "हाँ। Kalum आपकी कॉल असली फ़ोन नेटवर्क से जोड़ता है, इसलिए जिसे आप कॉल करते हैं उसे न इंटरनेट चाहिए, न ऐप, न स्मार्टफ़ोन। पुरानी लैंडलाइन या साधारण कीपैड फ़ोन किसी भी आम कॉल की तरह बजता है।",
      },
      {
        q: "क्या कॉल करने के लिए मुझे इंटरनेट चाहिए?",
        a: "हाँ — सिर्फ़ आपकी तरफ़। Kalum ऐप कॉल शुरू करने के लिए आपका डेटा या Wi-Fi इस्तेमाल करता है, फिर उसे सामान्य फ़ोन नेटवर्क को सौंप देता है। जिसे आप कॉल करते हैं, उसे कभी कनेक्शन नहीं चाहिए।",
      },
      {
        q: "क्या मैं लैंडलाइन पर कॉल कर सकता हूँ?",
        a: `हाँ। Kalum ${n}+ देशों में लैंडलाइन और मोबाइल पर कॉल करता है। सामने वाला उसी फ़ोन से उठाता है जो उसके पास पहले से है — उसकी तरफ़ कुछ डाउनलोड या सेट नहीं करना।`,
      },
      {
        q: "इसका खर्च कितना है?",
        a: "रेट देश के हिसाब से हैं, और ऐप डायल करने से पहले सटीक प्रति-मिनट रेट दिखाता है। आप $4.99 से प्रीपेड बैलेंस डालते हैं — कोई सब्सक्रिप्शन नहीं, और आपका बैलेंस कभी एक्सपायर नहीं होता।",
      },
    ],
    ctaH2: "कॉल करने को तैयार?",
    ctaBody: (n) =>
      `Kalum डाउनलोड करें, $4.99 का बैलेंस डालें, और ${n}+ देशों में किसी भी लैंडलाइन या मोबाइल पर कॉल करें। सिर्फ़ उतने मिनट का भुगतान, जितने आप इस्तेमाल करते हैं।`,
    utm: "kalum-web-hi-no-internet",
    readHere: "हिन्दी में: बिना इंटरनेट वाले को कॉल करें",
  },

  /* ------------------------------------------------------------------ */
  ur: {
    title: "انٹرنیٹ کے بغیر کسی کو کال کریں — فون ویسے ہی بجتا ہے",
    description: (n) =>
      `جن کے پاس انٹرنیٹ یا اسمارٹ فون نہیں، انہیں کال کریں۔ Kalum اصل فون نیٹ ورک استعمال کرتا ہے، اس لیے ${n} سے زیادہ ممالک میں لینڈ لائن اور سادہ فون بجتا ہے۔`,
    crumbHome: "ہوم",
    crumbSelf: "انٹرنیٹ کے بغیر کال",
    eyebrow: "دوسری طرف انٹرنیٹ کی ضرورت نہیں",
    h1: ["جن کے پاس انٹرنیٹ نہیں، انہیں کال کریں۔", "ان کا فون ویسے ہی بجتا ہے۔"],
    intro: (n) =>
      `Kalum ایک انٹرنیشنل کالنگ ایپ ہے جو اصل فون نمبر ڈائل کرتی ہے — ${n} سے زیادہ ممالک میں لینڈ لائن اور موبائل۔ جسے آپ کال کر رہے ہیں اسے نہ ایپ چاہیے، نہ اسمارٹ فون، نہ انٹرنیٹ۔`,
    finePrint: "$4.99 سے شروع کریں۔ کوئی سبسکرپشن نہیں۔ آپ کا بیلنس کبھی ختم نہیں ہوتا۔",
    explainerH2: "انٹرنیٹ آپ کو چاہیے۔ انہیں نہیں۔",
    explainer: [
      "انٹرنیٹ کالنگ ایپس تبھی کام کرتی ہیں جب دونوں طرف انٹرنیٹ ہو اور وہی ایپ انسٹال ہو۔ Kalum مختلف طریقے سے کام کرتا ہے: ایپ کال شروع کرنے کے لیے آپ کا ڈیٹا یا وائی فائی استعمال کرتی ہے، پھر اسے عام فون نیٹ ورک کے ذریعے اس نمبر تک پہنچاتی ہے جو آپ نے ڈائل کیا۔",
      "دوسری طرف کچھ نہیں بدلتا۔ ان کا فون کسی بھی عام کال کی طرح بجتا ہے — چاہے وہ گاؤں کے گھر کی لینڈ لائن ہو یا پندرہ سال پرانا بٹن والا فون۔ وہ اٹھاتے ہیں، آپ بات کرتے ہیں۔",
      "ڈائل کرنے سے پہلے آپ ان کے ملک کا فی منٹ ریٹ دیکھ لیتے ہیں، اور کال کا بل فی منٹ بنتا ہے، کم از کم ایک منٹ کا۔",
    ],
    reasonsH2: "ان فونز کے لیے بنایا گیا جنہیں ایپس بھول گئیں۔",
    reasons: [
      {
        title: "لینڈ لائن والے گھر",
        body: "والدین اور دادا دادی جنہوں نے گھر کا فون کبھی نہیں چھوڑا۔ لینڈ لائن پر ایپ انسٹال نہیں ہو سکتی — Kalum کے ساتھ ضرورت بھی نہیں۔",
      },
      {
        title: "سادہ فون",
        body: "دنیا کا بڑا حصہ آج بھی بٹن والے فون سے کال کرتا ہے۔ کسی بھی نیٹ ورک پر کوئی بھی نمبر بجتا ہے، اسمارٹ فون ضروری نہیں۔",
      },
      {
        title: "غیر یقینی انٹرنیٹ",
        body: "لوڈ شیڈنگ، کمزور سگنل، مہنگا ڈیٹا۔ جب ان کی طرف انٹرنیٹ بند ہو، تب بھی ایک عام فون کال پہنچ جاتی ہے۔",
      },
    ],
    destinationsH2: "پاکستان کال کرنے کے ریٹ",
    destinations: [
      { label: "پاکستان کال کریں", href: "/call/pakistan/" },
      { label: "UAE سے پاکستان کال کریں", href: "/call-pakistan-from-uae/" },
      { label: "تمام ممالک اور ریٹ", href: "/call/" },
    ],
    destinationsNote: "ریٹ والے صفحات انگریزی میں ہیں۔",
    faqH2: "انٹرنیٹ کے بغیر کال — سوال و جواب",
    faqs: (n) => [
      {
        q: "کیا میں ایسے شخص کو کال کر سکتا ہوں جس کے پاس بالکل انٹرنیٹ نہیں؟",
        a: "جی ہاں۔ Kalum آپ کی کال اصل فون نیٹ ورک سے جوڑتا ہے، اس لیے جسے آپ کال کرتے ہیں اسے نہ انٹرنیٹ چاہیے، نہ ایپ، نہ اسمارٹ فون۔ پرانی لینڈ لائن یا سادہ بٹن والا فون کسی بھی عام کال کی طرح بجتا ہے۔",
      },
      {
        q: "کیا کال کرنے کے لیے مجھے انٹرنیٹ چاہیے؟",
        a: "جی ہاں — صرف آپ کی طرف۔ Kalum ایپ کال شروع کرنے کے لیے آپ کا ڈیٹا یا وائی فائی استعمال کرتی ہے، پھر اسے عام فون نیٹ ورک کے حوالے کر دیتی ہے۔ جسے آپ کال کرتے ہیں اسے کبھی کنکشن نہیں چاہیے۔",
      },
      {
        q: "کیا میں لینڈ لائن پر کال کر سکتا ہوں؟",
        a: `جی ہاں۔ Kalum ${n} سے زیادہ ممالک میں لینڈ لائن اور موبائل پر کال کرتا ہے۔ دوسری طرف والا اسی فون سے اٹھاتا ہے جو اس کے پاس پہلے سے ہے — اس کی طرف کچھ ڈاؤن لوڈ یا سیٹ نہیں کرنا۔`,
      },
      {
        q: "اس کا خرچ کتنا ہے؟",
        a: "ریٹ ملک کے حساب سے ہیں، اور ایپ ڈائل کرنے سے پہلے فی منٹ کا صحیح ریٹ دکھاتی ہے۔ آپ $4.99 سے پری پیڈ بیلنس ڈالتے ہیں — کوئی سبسکرپشن نہیں، اور آپ کا بیلنس کبھی ختم نہیں ہوتا۔",
      },
    ],
    ctaH2: "کال کرنے کو تیار؟",
    ctaBody: (n) =>
      `Kalum ڈاؤن لوڈ کریں، $4.99 کا بیلنس ڈالیں، اور ${n} سے زیادہ ممالک میں کسی بھی لینڈ لائن یا موبائل پر کال کریں۔ صرف اتنے منٹ کی ادائیگی، جتنے آپ استعمال کرتے ہیں۔`,
    utm: "kalum-web-ur-no-internet",
    readHere: "اردو میں: انٹرنیٹ کے بغیر کسی کو کال کریں",
  },

  /* ------------------------------------------------------------------ */
  bn: {
    title: "ইন্টারনেট নেই এমন কাউকে কল করুন — ফোন ঠিকই বাজে | Kalum",
    description: (n) =>
      `যাদের ইন্টারনেট বা স্মার্টফোন নেই, তাদের কল করুন। Kalum আসল ফোন নেটওয়ার্ক ব্যবহার করে, তাই ${n}+ দেশে যেকোনো ল্যান্ডলাইন বা বাটন ফোন বেজে ওঠে।`,
    crumbHome: "হোম",
    crumbSelf: "ইন্টারনেট ছাড়া কল",
    eyebrow: "ওপাশে ইন্টারনেট লাগে না",
    h1: ["যার ইন্টারনেট নেই, তাকে কল করুন।", "ফোনটা ঠিকই বাজে।"],
    intro: (n) =>
      `Kalum একটি আন্তর্জাতিক কলিং অ্যাপ, যা আসল ফোন নম্বরে ডায়াল করে — ${n}+ দেশে ল্যান্ডলাইন ও মোবাইলে। আপনি যাকে কল করছেন, তার অ্যাপ, স্মার্টফোন বা ইন্টারনেট কিছুই লাগে না।`,
    finePrint: "$4.99 দিয়ে শুরু করুন। কোনো সাবস্ক্রিপশন নেই। আপনার ব্যালেন্সের মেয়াদ কখনো শেষ হয় না।",
    explainerH2: "ইন্টারনেট আপনার লাগে। ওদের না।",
    explainer: [
      "ইন্টারনেট কলিং অ্যাপ তখনই কাজ করে যখন দুই পাশেই ইন্টারনেট থাকে আর একই অ্যাপ ইনস্টল থাকে। Kalum অন্যভাবে কাজ করে: কল শুরু করতে অ্যাপ আপনার ডেটা বা Wi-Fi ব্যবহার করে, তারপর সাধারণ ফোন নেটওয়ার্ক দিয়ে আপনার ডায়াল করা নম্বরে পৌঁছে দেয়।",
      "ওপাশে কিছুই বদলায় না। তাদের ফোন যেকোনো সাধারণ কলের মতোই বাজে — সেটা গ্রামের বাড়ির ল্যান্ডলাইন হোক বা পনেরো বছরের পুরোনো বাটন ফোন। তারা ধরে, আপনি কথা বলেন।",
      "ডায়াল করার আগেই আপনি তাদের দেশের প্রতি মিনিটের রেট দেখে নেন, আর কলের বিল হয় প্রতি মিনিটে, কমপক্ষে এক মিনিটের।",
    ],
    reasonsH2: "যে ফোনগুলোকে অ্যাপ ভুলে গেছে, তাদের জন্য তৈরি।",
    reasons: [
      {
        title: "ল্যান্ডলাইনের বাড়ি",
        body: "বাবা-মা আর দাদা-দাদি, যারা বাড়ির ফোন কখনো ছাড়েননি। ল্যান্ডলাইনে অ্যাপ ইনস্টল হয় না — Kalum-এ দরকারও নেই।",
      },
      {
        title: "বাটন ফোন",
        body: "দুনিয়ার বড় একটা অংশ এখনো বাটন ফোন থেকে কল করে। যেকোনো নেটওয়ার্কের যেকোনো নম্বর বাজে, স্মার্টফোন লাগে না।",
      },
      {
        title: "অনির্ভরযোগ্য ইন্টারনেট",
        body: "লোডশেডিং, দুর্বল নেটওয়ার্ক, দামি ডেটা। ওপাশের ইন্টারনেট বন্ধ থাকলেও একটা সাধারণ ফোন কল ঠিকই পৌঁছায়।",
      },
    ],
    destinationsH2: "বাংলাদেশে কল করার রেট",
    destinations: [
      { label: "বাংলাদেশে কল করুন", href: "/call/bangladesh/" },
      { label: "সব দেশ ও রেট", href: "/call/" },
    ],
    destinationsNote: "রেটের পেজগুলো ইংরেজিতে।",
    faqH2: "ইন্টারনেট ছাড়া কল — প্রশ্নোত্তর",
    faqs: (n) => [
      {
        q: "যার একেবারেই ইন্টারনেট নেই, তাকে কি কল করতে পারব?",
        a: "হ্যাঁ। Kalum আপনার কল আসল ফোন নেটওয়ার্ক দিয়ে পৌঁছে দেয়, তাই আপনি যাকে কল করছেন তার ইন্টারনেট, অ্যাপ বা স্মার্টফোন কিছুই লাগে না। পুরোনো ল্যান্ডলাইন বা সাধারণ বাটন ফোন যেকোনো সাধারণ কলের মতোই বাজে।",
      },
      {
        q: "কল করতে আমার কি ইন্টারনেট লাগবে?",
        a: "হ্যাঁ — শুধু আপনার পাশে। কল শুরু করতে Kalum অ্যাপ আপনার ডেটা বা Wi-Fi ব্যবহার করে, তারপর সাধারণ ফোন নেটওয়ার্কের হাতে তুলে দেয়। আপনি যাকে কল করছেন তার কখনোই কানেকশন লাগে না।",
      },
      {
        q: "ল্যান্ডলাইনে কল করা যাবে?",
        a: `হ্যাঁ। Kalum ${n}+ দেশে ল্যান্ডলাইন ও মোবাইলে কল করে। ওপাশের মানুষটি তার হাতে থাকা ফোনেই ধরে — তার পাশে কিছু ডাউনলোড বা সেট করতে হয় না।`,
      },
      {
        q: "খরচ কত?",
        a: "রেট দেশ অনুযায়ী, আর ডায়াল করার আগেই অ্যাপ প্রতি মিনিটের সঠিক রেট দেখায়। আপনি $4.99 থেকে প্রিপেইড ব্যালেন্স যোগ করেন — কোনো সাবস্ক্রিপশন নেই, আর ব্যালেন্সের মেয়াদ কখনো শেষ হয় না।",
      },
    ],
    ctaH2: "কল করতে তৈরি?",
    ctaBody: (n) =>
      `Kalum ডাউনলোড করুন, $4.99 ব্যালেন্স যোগ করুন, আর ${n}+ দেশে যেকোনো ল্যান্ডলাইন বা মোবাইলে কল করুন। যতটুকু কথা বলবেন, শুধু ততটুকু মিনিটের টাকা।`,
    utm: "kalum-web-bn-no-internet",
    readHere: "বাংলায়: ইন্টারনেট নেই এমন কাউকে কল করুন",
  },

  /* ------------------------------------------------------------------ */
  tl: {
    // The H1 verbatim (no brand: it would pass 60). Google was showing the
    // H1 in place of the old title-cased one (seen 2026-09-23).
    title: "Tumawag sa walang internet. Tutunog pa rin ang telepono nila",
    description: (n) =>
      `Tumawag sa mga walang internet o smartphone. Totoong phone network ang gamit ng Kalum, kaya tutunog ang landline o keypad phone sa ${n}+ na bansa.`,
    crumbHome: "Home",
    crumbSelf: "Tumawag nang walang internet",
    eyebrow: "Hindi kailangan ng internet sa kabilang linya",
    h1: ["Tumawag sa walang internet.", "Tutunog pa rin ang telepono nila."],
    intro: (n) =>
      `Ang Kalum ay international calling app na tumatawag sa totoong numero ng telepono — landline at cellphone sa ${n}+ na bansa. Hindi kailangan ng tinatawagan mo ng app, smartphone, o internet.`,
    finePrint: "Magsimula sa $4.99. Walang subscription. Hindi nag-e-expire ang load mo.",
    explainerH2: "Ikaw ang kailangan ng internet. Sila, hindi.",
    explainer: [
      "Gumagana lang ang mga internet calling app kapag online ang dalawang panig at pareho ang app na naka-install. Iba ang Kalum: ginagamit ng app ang data o Wi-Fi mo para simulan ang tawag, tapos ipinapasa ito sa normal na phone network papunta sa numerong dinial mo.",
      "Sa kabilang linya, walang nagbabago. Tutunog ang telepono nila tulad ng kahit anong tawag — landline man sa bahay sa probinsya o keypad phone na labinlimang taon na. Sasagutin nila, at mag-uusap kayo.",
      "Makikita mo ang per-minute rate ng bansa nila bago ka tumawag, at sinisingil ang tawag kada minuto, minimum na isang minuto.",
    ],
    reasonsH2: "Para sa mga teleponong nakalimutan ng mga app.",
    reasons: [
      {
        title: "Mga bahay na landline lang",
        body: "Nanay, tatay, lolo, at lola na hindi iniwan ang telepono sa bahay. Hindi makaka-install ng app ang landline — sa Kalum, hindi na kailangan.",
      },
      {
        title: "Keypad phone",
        body: "Marami pa ring tumatawag gamit ang teleponong may buttons. Tutunog ang kahit anong numero sa kahit anong network, hindi kailangan ng smartphone.",
      },
      {
        title: "Hindi maaasahang internet",
        body: "Brownout, mahinang signal, mahal na data. Kapag down ang internet sa kabilang linya, dumadating pa rin ang normal na tawag.",
      },
    ],
    destinationsH2: "Rate para tumawag sa Pilipinas",
    destinations: [
      { label: "Tumawag sa Pilipinas", href: "/call/philippines/" },
      { label: "Lahat ng bansa at rate", href: "/call/" },
    ],
    destinationsNote: "Nasa Ingles ang mga rate page.",
    faqH2: "Tumawag nang walang internet — mga tanong",
    faqs: (n) => [
      {
        q: "Puwede ba akong tumawag sa taong walang internet talaga?",
        a: "Oo. Dinadaan ng Kalum ang tawag mo sa totoong phone network, kaya hindi kailangan ng tinatawagan mo ng internet, app, o smartphone. Tutunog ang lumang landline o simpleng keypad phone tulad ng kahit anong normal na tawag.",
      },
      {
        q: "Kailangan ko ba ng internet para tumawag?",
        a: "Oo — sa panig mo lang. Ginagamit ng Kalum app ang data o Wi-Fi mo para simulan ang tawag, tapos ipinapasa ito sa normal na phone network. Hindi kailanman kailangan ng koneksyon ng tinatawagan mo.",
      },
      {
        q: "Puwede ba akong tumawag sa landline?",
        a: `Oo. Tumatawag ang Kalum sa landline at cellphone sa ${n}+ na bansa. Sasagutin ng tinatawagan mo gamit ang kahit anong telepono na hawak na nila — walang ida-download, walang ise-set up sa panig nila.`,
      },
      {
        q: "Magkano?",
        a: "Per-country ang rate, at ipinapakita ng app ang eksaktong per-minute rate bago ka tumawag. Nagdadagdag ka ng prepaid na load simula $4.99 — walang subscription, at hindi nag-e-expire ang load mo.",
      },
    ],
    ctaH2: "Handa ka na bang tumawag?",
    ctaBody: (n) =>
      `I-download ang Kalum, magdagdag ng $4.99 na load, at tumawag sa kahit anong landline o cellphone sa ${n}+ na bansa. Babayaran mo lang ang minutong nagamit mo.`,
    utm: "kalum-web-tl-no-internet",
    readHere: "Sa Tagalog: tumawag sa walang internet",
  },

  /* ------------------------------------------------------------------ */
  vi: {
    title: "Gọi Cho Người Không Có Internet — Điện Thoại Vẫn Đổ Chuông",
    description: (n) =>
      `Gọi cho người không có internet hay smartphone. Kalum dùng mạng điện thoại thật, nên máy bàn hay điện thoại phím bấm ở hơn ${n} quốc gia đều đổ chuông.`,
    crumbHome: "Trang chủ",
    crumbSelf: "Gọi không cần internet",
    eyebrow: "Đầu bên kia không cần internet",
    h1: ["Gọi cho người không có internet.", "Điện thoại của họ vẫn đổ chuông."],
    intro: (n) =>
      `Kalum là ứng dụng gọi quốc tế quay đến số điện thoại thật — điện thoại bàn và di động ở hơn ${n} quốc gia. Người bạn gọi không cần ứng dụng, không cần điện thoại thông minh, không cần internet.`,
    finePrint: "Bắt đầu với 4,99 $. Không thuê bao. Số dư của bạn không bao giờ hết hạn.",
    explainerH2: "Bạn cần internet. Họ thì không.",
    explainer: [
      "Các ứng dụng gọi qua internet chỉ hoạt động khi cả hai bên cùng online và cài cùng một ứng dụng. Kalum hoạt động khác: ứng dụng dùng dữ liệu di động hoặc Wi-Fi của bạn để bắt đầu cuộc gọi, rồi chuyển nó qua mạng điện thoại thông thường đến số bạn đã quay.",
      "Ở đầu bên kia, không có gì thay đổi. Điện thoại của họ đổ chuông như mọi cuộc gọi khác — dù là chiếc điện thoại bàn ở nhà dưới quê hay chiếc điện thoại phím bấm dùng đã mười lăm năm. Họ bắt máy, và hai người nói chuyện.",
      "Bạn thấy cước mỗi phút của nước họ trước khi gọi, và cuộc gọi được tính theo phút, tối thiểu một phút.",
    ],
    reasonsH2: "Làm ra cho những chiếc điện thoại mà các ứng dụng đã bỏ quên.",
    reasons: [
      {
        title: "Nhà chỉ có điện thoại bàn",
        body: "Ba mẹ, ông bà chưa bao giờ rời chiếc điện thoại bàn. Điện thoại bàn không cài được ứng dụng — với Kalum thì không cần.",
      },
      {
        title: "Điện thoại phím bấm",
        body: "Rất nhiều người vẫn gọi từ điện thoại có phím bấm. Số nào, nhà mạng nào cũng đổ chuông, không cần điện thoại thông minh.",
      },
      {
        title: "Internet chập chờn",
        body: "Mất điện, sóng yếu, dữ liệu đắt. Khi internet bên họ mất, một cuộc gọi điện thoại bình thường vẫn tới nơi.",
      },
    ],
    destinationsH2: "Cước gọi về Việt Nam",
    destinations: [
      { label: "Gọi về Việt Nam", href: "/call/vietnam/" },
      { label: "Tất cả quốc gia và cước phí", href: "/call/" },
    ],
    destinationsNote: "Các trang cước phí bằng tiếng Anh.",
    faqH2: "Gọi không cần internet — hỏi đáp",
    faqs: (n) => [
      {
        q: "Tôi có thể gọi cho người hoàn toàn không có internet không?",
        a: "Có. Kalum chuyển cuộc gọi của bạn qua mạng điện thoại thật, nên người bạn gọi không cần internet, không cần ứng dụng, không cần điện thoại thông minh. Một chiếc điện thoại bàn cũ hay điện thoại phím bấm đơn giản đổ chuông như mọi cuộc gọi bình thường.",
      },
      {
        q: "Tôi có cần internet để gọi không?",
        a: "Có — chỉ ở phía bạn. Ứng dụng Kalum dùng dữ liệu hoặc Wi-Fi của bạn để bắt đầu cuộc gọi, rồi chuyển sang mạng điện thoại thông thường. Người bạn gọi không bao giờ cần kết nối.",
      },
      {
        q: "Tôi có gọi được điện thoại bàn không?",
        a: `Có. Kalum gọi được điện thoại bàn và di động ở hơn ${n} quốc gia. Người nhận bắt máy bằng chính chiếc điện thoại họ đang có — không phải tải gì, không phải cài đặt gì ở phía họ.`,
      },
      {
        q: "Chi phí bao nhiêu?",
        a: "Cước tính theo từng nước, và ứng dụng hiển thị chính xác cước mỗi phút trước khi bạn gọi. Bạn nạp số dư trả trước từ 4,99 $ — không thuê bao, và số dư không bao giờ hết hạn.",
      },
    ],
    ctaH2: "Sẵn sàng gọi chưa?",
    ctaBody: (n) =>
      `Tải Kalum, nạp 4,99 $, và gọi đến bất kỳ điện thoại bàn hay di động nào ở hơn ${n} quốc gia. Bạn chỉ trả cho số phút đã dùng.`,
    utm: "kalum-web-vi-no-internet",
    readHere: "Tiếng Việt: gọi cho người không có internet",
  },
  /* ------------------------------------------------------------------ */
  // Indonesian. Written for a migrant worker in Malaysia, Hong Kong, Taiwan or
  // Saudi Arabia — all four can sign up — calling parents in the kampung.
  // Shipped 2026-09-23 with no Search Console demand behind it (0 Indonesian
  // queries in 16 months): the owner's call is that a cheap page is worth even
  // one click. Title is the H1 verbatim, brand dropped to fit 60.
  id: {
    title: "Telepon orang tanpa internet. Teleponnya tetap berdering.",
    description: (n) =>
      `Telepon orang yang tidak punya internet atau smartphone. Kalum memakai jaringan telepon sungguhan: telepon rumah dan HP biasa di ${n}+ negara berdering.`,
    crumbHome: "Beranda",
    crumbSelf: "Telepon tanpa internet",
    eyebrow: "Mereka tidak perlu internet",
    h1: ["Telepon orang tanpa internet.", "Teleponnya tetap berdering."],
    intro: (n) =>
      `Kalum adalah aplikasi telepon internasional yang menelepon nomor telepon sungguhan — telepon rumah dan HP di lebih dari ${n} negara. Orang yang Anda telepon tidak perlu aplikasi, smartphone, atau internet.`,
    finePrint: "Mulai dari US$4,99. Tanpa langganan. Saldo Anda tidak pernah hangus.",
    explainerH2: "Anda butuh internet. Mereka tidak.",
    explainer: [
      "Aplikasi telepon lewat internet hanya jalan kalau kedua pihak sedang online dan memakai aplikasi yang sama. Kalum bekerja dengan cara lain: aplikasinya memakai kuota data atau Wi-Fi Anda untuk memulai panggilan, lalu meneruskannya lewat jaringan telepon biasa ke nomor yang Anda tekan.",
      "Di sisi mereka, tidak ada yang berubah. Teleponnya berdering seperti panggilan biasa — entah telepon rumah di kampung atau HP jadul yang sudah dipakai lima belas tahun. Mereka mengangkat, dan kalian bisa mengobrol.",
      "Anda melihat tarif per menit negara tujuan sebelum menelepon; panggilan ditagih per menit, minimal satu menit.",
    ],
    reasonsH2: "Dibuat untuk telepon yang dilupakan aplikasi.",
    reasons: [
      {
        title: "Rumah dengan telepon rumah",
        body: "Orang tua dan kakek-nenek di kampung yang masih setia dengan telepon rumah. Telepon rumah tidak bisa dipasangi aplikasi — dengan Kalum, tidak perlu.",
      },
      {
        title: "HP jadul",
        body: "Banyak orang masih menelepon dari HP biasa bertombol. Nomor apa pun, operator apa pun, tetap berdering — tidak perlu smartphone.",
      },
      {
        title: "Internet yang tidak bisa diandalkan",
        body: "Listrik padam, sinyal lemah, kuota mahal. Saat internet di sisi mereka mati, panggilan telepon biasa tetap sampai.",
      },
    ],
    destinationsH2: "Tarif menelepon ke Indonesia",
    destinationsIntro: () =>
      "Bekerja di Malaysia, Hong Kong, Taiwan, atau Arab Saudi? Cari Indonesia di halaman tarif untuk melihat tarif per menitnya.",
    destinations: [{ label: "Semua negara dan tarif", href: "/call/" }],
    destinationsNote: "Halaman tarif dalam bahasa Inggris.",
    faqH2: "Telepon tanpa internet — tanya jawab",
    faqs: (n) => [
      {
        q: "Bisakah saya menelepon orang yang sama sekali tidak punya internet?",
        a: "Bisa. Kalum menyalurkan panggilan Anda lewat jaringan telepon sungguhan, jadi orang yang Anda telepon tidak perlu internet, aplikasi, atau smartphone. Telepon rumah lama atau HP bertombol biasa berdering seperti panggilan biasa.",
      },
      {
        q: "Apakah saya perlu internet untuk menelepon?",
        a: "Ya — hanya di sisi Anda. Aplikasi Kalum memakai kuota data atau Wi-Fi Anda untuk memulai panggilan, lalu meneruskannya ke jaringan telepon biasa. Orang yang Anda telepon tidak pernah butuh koneksi.",
      },
      {
        q: "Bisakah saya menelepon telepon rumah?",
        a: `Bisa. Kalum menelepon telepon rumah dan HP di lebih dari ${n} negara. Orang yang Anda telepon cukup mengangkat telepon yang sudah mereka punya — tidak ada yang perlu diunduh atau diatur di sisi mereka.`,
      },
      {
        q: "Berapa biayanya?",
        a: "Tarif berbeda per negara, dan aplikasi menampilkan tarif per menit yang pasti sebelum Anda menelepon. Anda mengisi saldo prabayar mulai dari US$4,99 — tanpa langganan, dan saldo tidak pernah hangus.",
      },
    ],
    ctaH2: "Siap menelepon?",
    ctaBody: (n) =>
      `Unduh Kalum, isi saldo US$4,99, lalu telepon telepon rumah atau HP mana pun di lebih dari ${n} negara. Anda hanya membayar menit yang Anda pakai.`,
    utm: "kalum-web-id-no-internet",
    // Unused today: there is no /call/indonesia/ page to carry it.
    readHere: "Bahasa Indonesia: telepon orang tanpa internet",
  },

  /* ------------------------------------------------------------------ */
  // Portuguese, Brazilian register. Written for a Brazilian in the US,
  // Portugal or Japan — all three can sign up — calling a landline back in
  // the interior. Same footing as Indonesian: shipped 2026-09-23 on the
  // owner's call, not on demand data. Title is the H1 verbatim, no brand.
  pt: {
    title: "Ligue para quem não tem internet. O telefone toca igual.",
    description: (n) =>
      `Ligue para quem não tem internet nem smartphone. O Kalum usa redes telefônicas de verdade: fixo e celular comum tocam em mais de ${n} países.`,
    crumbHome: "Início",
    crumbSelf: "Ligar sem internet",
    eyebrow: "Do outro lado, sem internet",
    h1: ["Ligue para quem não tem internet.", "O telefone toca igual."],
    intro: (n) =>
      `O Kalum é um app de ligações internacionais que liga para números de telefone de verdade — fixos e celulares em mais de ${n} países. Quem recebe não precisa de app, de smartphone nem de internet.`,
    finePrint: "A partir de US$ 4,99. Sem assinatura. Seu saldo não expira.",
    explainerH2: "Você precisa de internet. Eles, não.",
    explainer: [
      "Apps de chamada pela internet só funcionam quando os dois lados estão online e usam o mesmo app. O Kalum funciona de outro jeito: o app usa seus dados móveis ou seu Wi-Fi para iniciar a ligação e depois a leva pelas redes telefônicas comuns até o número que você discou.",
      "Do outro lado, nada muda. O telefone toca como qualquer ligação — seja o fixo na casa da sua mãe no interior, seja um celular de teclinha com quinze anos de uso. A pessoa atende e vocês conversam.",
      "Você vê a tarifa por minuto do país antes de ligar, e as ligações são cobradas por minuto, com mínimo de um minuto.",
    ],
    reasonsH2: "Feito para os telefones que os apps esqueceram.",
    reasons: [
      {
        title: "Casas com telefone fixo",
        body: "Pais e avós que nunca largaram o telefone de casa. Telefone fixo não instala app — com o Kalum, nem precisa.",
      },
      {
        title: "Celular de teclinha",
        body: "Muita gente ainda liga de um celular simples, de teclas. Qualquer número, de qualquer operadora, toca — sem precisar de smartphone.",
      },
      {
        title: "Internet que não dá para confiar",
        body: "Falta de luz, sinal fraco, pacote de dados caro. Quando a internet deles cai, uma ligação telefônica comum chega mesmo assim.",
      },
    ],
    destinationsH2: "Tarifas para ligar para o Brasil",
    destinationsIntro: () =>
      "Mora nos Estados Unidos, em Portugal ou no Japão? Procure o Brasil na página de tarifas para ver o preço por minuto.",
    destinations: [{ label: "Todos os países e tarifas", href: "/call/" }],
    destinationsNote: "As páginas de tarifas estão em inglês.",
    faqH2: "Ligar sem internet — perguntas frequentes",
    faqs: (n) => [
      {
        q: "Posso ligar para alguém que não tem internet nenhuma?",
        a: "Pode. O Kalum leva sua ligação pelas redes telefônicas de verdade, então quem recebe não precisa de internet, de app nem de smartphone. Um fixo antigo ou um celular simples de teclas toca como numa ligação normal.",
      },
      {
        q: "Eu preciso de internet para ligar?",
        a: "Sim — só do seu lado. O app Kalum usa seus dados ou seu Wi-Fi para iniciar a ligação e depois passa para as redes telefônicas comuns. Quem recebe nunca precisa de conexão.",
      },
      {
        q: "Dá para ligar para telefone fixo?",
        a: `Dá. O Kalum liga para fixos e celulares em mais de ${n} países. A pessoa atende no telefone que já tem — não precisa baixar nem configurar nada do lado dela.`,
      },
      {
        q: "Quanto custa?",
        a: "As tarifas variam por país, e o app mostra a tarifa exata por minuto antes de você ligar. Você coloca crédito pré-pago a partir de US$ 4,99 — sem assinatura, e o saldo não expira.",
      },
    ],
    ctaH2: "Pronto para ligar?",
    ctaBody: (n) =>
      `Baixe o Kalum, coloque US$ 4,99 de crédito e ligue para qualquer fixo ou celular em mais de ${n} países. Você só paga pelos minutos que usar.`,
    utm: "kalum-web-pt-no-internet",
    // Unused today: there is no /call/brazil/ page to carry it.
    readHere: "Em português: ligue para quem não tem internet",
  },
};

/**
 * Which single-page locale a destination maps to, for the "read this in …"
 * link on English destination pages. A reader on /call/egypt/ is very likely
 * an Arabic speaker; on /call/pakistan/, an Urdu speaker. Destinations with no
 * natural mapping — Nigeria, Kenya, Nepal, Sri Lanka, Afghanistan — get none,
 * rather than a guess.
 */
export const LOCALE_FOR_DESTINATION: Record<string, Locale> = {
  egypt: "ar",
  lebanon: "ar",
  jordan: "ar",
  palestine: "ar",
  iraq: "ar",
  "saudi-arabia": "ar",
  uae: "ar",
  yemen: "ar",
  kuwait: "ar",
  qatar: "ar",
  oman: "ar",
  bahrain: "ar",
  sudan: "ar",
  turkey: "tr",
  india: "hi",
  pakistan: "ur",
  bangladesh: "bn",
  philippines: "tl",
  vietnam: "vi",
};
