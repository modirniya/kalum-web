import type { Locale } from "./i18n";

/**
 * Header and footer strings for every locale.
 *
 * The roadmap's gating rule for a localized page is that it ships fully
 * translated, and it names nav explicitly — an Arabic page wrapped in an
 * English header is not an Arabic page. So each locale gets its chrome here.
 *
 * Where a locale's nav points is the honest part. Spanish is a tree, so its
 * links stay inside /es/. The single-page locales have exactly one page of
 * their own, so their "Destinations" and "Support" links carry a translated
 * label and land on the English page. That is the same call the Spanish hub
 * makes for destinations without a Spanish version — a reader is told where
 * they are going rather than shown a localized URL that does not exist.
 *
 * Product links for a single-page locale therefore run: its own page first,
 * then how-it-works, destinations and support in English. No popular-
 * destinations row — that row renders English country names, and the Spanish
 * footer already declines it for the same reason.
 */
export interface Chrome {
  /** Header */
  home: string;
  homeLabel: string;
  download: string;
  menu: string;
  nav: { label: string; href: string }[];
  /** Footer */
  blurb: (countries: number) => string;
  product: string;
  legal: string;
  getApp: string;
  productLinks: { label: string; href: string }[];
  legalLinks: { label: string; href: string }[];
  madeBy: string;
  /** Aria label on the language link, per target. */
  switchTo: (target: "en" | "es") => string;
}

const legalEn = [
  { href: "/privacy/", label: "Privacy policy" },
  { href: "/terms/", label: "Terms of service" },
];

export const CHROME: Record<Locale, Chrome> = {
  en: {
    home: "/",
    homeLabel: "Kalum home",
    download: "Get the app",
    menu: "Open menu",
    nav: [
      { label: "How it works", href: "/how-it-works/" },
      { label: "Destinations", href: "/call/" },
      { label: "Support", href: "/support/" },
    ],
    blurb: (n) => `Cheap calls to landlines and mobiles in ${n}+ countries. They just pick up the phone.`,
    product: "Product",
    legal: "Legal",
    getApp: "Get the app",
    productLinks: [
      { href: "/how-it-works/", label: "How it works" },
      { href: "/call/", label: "Destinations" },
      { href: "/call-without-internet/", label: "Call without internet" },
      { href: "/calling-app-vs-internet-calling/", label: "App vs internet calling" },
      { href: "/whatsapp-calls-blocked/", label: "Gulf calling app" },
      { href: "/support/", label: "Support" },
    ],
    legalLinks: legalEn,
    madeBy: "Kalum is a product of Neuera",
    switchTo: (t) => (t === "es" ? "Cambiar a español" : "Switch to English"),
  },

  es: {
    home: "/es/",
    homeLabel: "Inicio de Kalum",
    download: "Descargar",
    menu: "Abrir menú",
    // The Spanish header and footer listed only Mexico and the no-internet
    // page, so /es/how-it-works/ hung on a single inbound link (the English
    // page's language switch) and the four Spanish corridors on two each —
    // the thinnest pages on the site per the 2026-09-19 audit, and the
    // section that already converts at nearly twice the English rate.
    nav: [
      { label: "Cómo funciona", href: "/es/how-it-works/" },
      { label: "Destinos", href: "/es/call/" },
      { label: "Llamar sin internet", href: "/es/call-without-internet/" },
    ],
    blurb: (n) => `Llamadas económicas a teléfonos fijos y celulares en más de ${n} países. Solo contestan su teléfono.`,
    product: "Producto",
    legal: "Legal",
    getApp: "Descargar la app",
    productLinks: [
      { href: "/es/how-it-works/", label: "Cómo funciona" },
      { href: "/es/call/", label: "Todos los destinos" },
      { href: "/es/call-without-internet/", label: "Llamar sin internet" },
      { href: "/es/call/mexico/", label: "Llamar a México" },
      { href: "/es/call/colombia/", label: "Llamar a Colombia" },
      { href: "/es/call/guatemala/", label: "Llamar a Guatemala" },
      { href: "/es/call/honduras/", label: "Llamar a Honduras" },
      { href: "/es/call/el-salvador/", label: "Llamar a El Salvador" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "Privacidad" },
      { href: "/terms/", label: "Términos" },
    ],
    madeBy: "Kalum es un producto de Neuera",
    switchTo: (t) => (t === "es" ? "Cambiar a español" : "Switch to English"),
  },

  ar: {
    home: "/ar/call-without-internet/",
    homeLabel: "الصفحة الرئيسية لكالوم",
    download: "حمّل التطبيق",
    menu: "فتح القائمة",
    nav: [
      { label: "الاتصال بدون إنترنت", href: "/ar/call-without-internet/" },
      { label: "الوجهات", href: "/call/" },
      { label: "الدعم", href: "/support/" },
    ],
    blurb: (n) => `مكالمات بأسعار مناسبة إلى الخطوط الأرضية والجوّالات في أكثر من ${n} دولة. يكفي أن يردّوا على الهاتف.`,
    product: "المنتج",
    legal: "قانوني",
    getApp: "حمّل التطبيق",
    productLinks: [
      { href: "/ar/call-without-internet/", label: "الاتصال بدون إنترنت" },
      { href: "/how-it-works/", label: "كيف يعمل (بالإنجليزية)" },
      { href: "/call/", label: "الوجهات والأسعار (بالإنجليزية)" },
      { href: "/support/", label: "الدعم" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "الخصوصية" },
      { href: "/terms/", label: "الشروط" },
    ],
    madeBy: "كالوم منتج من Neuera",
    switchTo: (t) => (t === "es" ? "التبديل إلى الإسبانية" : "التبديل إلى الإنجليزية"),
  },

  tr: {
    home: "/tr/call-without-internet/",
    homeLabel: "Kalum ana sayfa",
    download: "Uygulamayı indir",
    menu: "Menüyü aç",
    nav: [
      { label: "İnternetsiz arama", href: "/tr/call-without-internet/" },
      { label: "Ülkeler", href: "/call/" },
      { label: "Destek", href: "/support/" },
    ],
    blurb: (n) => `${n}'den fazla ülkede sabit hatlara ve cep telefonlarına uygun fiyatlı aramalar. Karşı taraf sadece telefonu açar.`,
    product: "Ürün",
    legal: "Yasal",
    getApp: "Uygulamayı indir",
    productLinks: [
      { href: "/tr/call-without-internet/", label: "İnternetsiz arama" },
      { href: "/how-it-works/", label: "Nasıl çalışır (İngilizce)" },
      { href: "/call/", label: "Ülkeler ve tarifeler (İngilizce)" },
      { href: "/support/", label: "Destek" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "Gizlilik" },
      { href: "/terms/", label: "Kullanım koşulları" },
    ],
    madeBy: "Kalum bir Neuera ürünüdür",
    switchTo: (t) => (t === "es" ? "İspanyolcaya geç" : "İngilizceye geç"),
  },

  hi: {
    home: "/hi/call-without-internet/",
    homeLabel: "Kalum होम",
    download: "ऐप डाउनलोड करें",
    menu: "मेन्यू खोलें",
    nav: [
      { label: "बिना इंटरनेट कॉल", href: "/hi/call-without-internet/" },
      { label: "देश और रेट", href: "/call/" },
      { label: "सहायता", href: "/support/" },
    ],
    blurb: (n) => `${n}+ देशों में लैंडलाइन और मोबाइल पर सस्ती कॉल। सामने वाला बस फ़ोन उठाता है।`,
    product: "प्रोडक्ट",
    legal: "कानूनी",
    getApp: "ऐप डाउनलोड करें",
    productLinks: [
      { href: "/hi/call-without-internet/", label: "बिना इंटरनेट कॉल" },
      { href: "/how-it-works/", label: "यह कैसे काम करता है (अंग्रेज़ी)" },
      { href: "/call/", label: "देश और रेट (अंग्रेज़ी)" },
      { href: "/support/", label: "सहायता" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "प्राइवेसी" },
      { href: "/terms/", label: "नियम व शर्तें" },
    ],
    madeBy: "Kalum, Neuera का प्रोडक्ट है",
    switchTo: (t) => (t === "es" ? "स्पैनिश में देखें" : "अंग्रेज़ी में देखें"),
  },

  ur: {
    home: "/ur/call-without-internet/",
    homeLabel: "Kalum ہوم",
    download: "ایپ ڈاؤن لوڈ کریں",
    menu: "مینو کھولیں",
    nav: [
      { label: "انٹرنیٹ کے بغیر کال", href: "/ur/call-without-internet/" },
      { label: "ممالک اور ریٹ", href: "/call/" },
      { label: "مدد", href: "/support/" },
    ],
    blurb: (n) => `${n} سے زیادہ ممالک میں لینڈ لائن اور موبائل پر سستی کالیں۔ دوسری طرف بس فون اٹھاتے ہیں۔`,
    product: "پروڈکٹ",
    legal: "قانونی",
    getApp: "ایپ ڈاؤن لوڈ کریں",
    productLinks: [
      { href: "/ur/call-without-internet/", label: "انٹرنیٹ کے بغیر کال" },
      { href: "/how-it-works/", label: "یہ کیسے کام کرتا ہے (انگریزی)" },
      { href: "/call/", label: "ممالک اور ریٹ (انگریزی)" },
      { href: "/support/", label: "مدد" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "پرائیویسی" },
      { href: "/terms/", label: "شرائط" },
    ],
    madeBy: "Kalum ایک Neuera پروڈکٹ ہے",
    switchTo: (t) => (t === "es" ? "ہسپانوی میں دیکھیں" : "انگریزی میں دیکھیں"),
  },

  bn: {
    home: "/bn/call-without-internet/",
    homeLabel: "Kalum হোম",
    download: "অ্যাপ ডাউনলোড করুন",
    menu: "মেনু খুলুন",
    nav: [
      { label: "ইন্টারনেট ছাড়া কল", href: "/bn/call-without-internet/" },
      { label: "দেশ ও রেট", href: "/call/" },
      { label: "সাপোর্ট", href: "/support/" },
    ],
    blurb: (n) => `${n}+ দেশে ল্যান্ডলাইন ও মোবাইলে সাশ্রয়ী কল। ওপাশে শুধু ফোনটা ধরলেই হয়।`,
    product: "প্রোডাক্ট",
    legal: "আইনি",
    getApp: "অ্যাপ ডাউনলোড করুন",
    productLinks: [
      { href: "/bn/call-without-internet/", label: "ইন্টারনেট ছাড়া কল" },
      { href: "/how-it-works/", label: "কীভাবে কাজ করে (ইংরেজি)" },
      { href: "/call/", label: "দেশ ও রেট (ইংরেজি)" },
      { href: "/support/", label: "সাপোর্ট" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "প্রাইভেসি" },
      { href: "/terms/", label: "শর্তাবলি" },
    ],
    madeBy: "Kalum, Neuera-এর একটি প্রোডাক্ট",
    switchTo: (t) => (t === "es" ? "স্প্যানিশে দেখুন" : "ইংরেজিতে দেখুন"),
  },

  tl: {
    home: "/tl/call-without-internet/",
    homeLabel: "Kalum home",
    download: "I-download ang app",
    menu: "Buksan ang menu",
    nav: [
      { label: "Tumawag nang walang internet", href: "/tl/call-without-internet/" },
      { label: "Mga bansa", href: "/call/" },
      { label: "Suporta", href: "/support/" },
    ],
    blurb: (n) => `Murang tawag sa landline at cellphone sa ${n}+ na bansa. Sasagutin lang nila ang telepono.`,
    product: "Produkto",
    legal: "Legal",
    getApp: "I-download ang app",
    productLinks: [
      { href: "/tl/call-without-internet/", label: "Tumawag nang walang internet" },
      { href: "/how-it-works/", label: "Paano ito gumagana (Ingles)" },
      { href: "/call/", label: "Mga bansa at rate (Ingles)" },
      { href: "/support/", label: "Suporta" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Mga tuntunin" },
    ],
    madeBy: "Ang Kalum ay produkto ng Neuera",
    switchTo: (t) => (t === "es" ? "Lumipat sa Espanyol" : "Lumipat sa Ingles"),
  },

  vi: {
    home: "/vi/call-without-internet/",
    homeLabel: "Trang chủ Kalum",
    download: "Tải ứng dụng",
    menu: "Mở menu",
    nav: [
      { label: "Gọi không cần internet", href: "/vi/call-without-internet/" },
      { label: "Quốc gia", href: "/call/" },
      { label: "Hỗ trợ", href: "/support/" },
    ],
    blurb: (n) => `Gọi giá rẻ tới điện thoại bàn và di động ở hơn ${n} quốc gia. Người nhận chỉ cần bắt máy.`,
    product: "Sản phẩm",
    legal: "Pháp lý",
    getApp: "Tải ứng dụng",
    productLinks: [
      { href: "/vi/call-without-internet/", label: "Gọi không cần internet" },
      { href: "/how-it-works/", label: "Cách hoạt động (tiếng Anh)" },
      { href: "/call/", label: "Quốc gia và cước phí (tiếng Anh)" },
      { href: "/support/", label: "Hỗ trợ" },
    ],
    legalLinks: [
      { href: "/privacy/", label: "Quyền riêng tư" },
      { href: "/terms/", label: "Điều khoản" },
    ],
    madeBy: "Kalum là sản phẩm của Neuera",
    switchTo: (t) => (t === "es" ? "Chuyển sang tiếng Tây Ban Nha" : "Chuyển sang tiếng Anh"),
  },
};
