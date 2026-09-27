export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";
export const isRtl = (l: Locale) => l === "fa";
export type Bi = { en: string; fa: string };
export const pick = (v: Bi | undefined, l: Locale) => (v ? v[l] || v.en : "");
export const sep = (l: Locale) => (l === "fa" ? "\u060C " : ", ");

const fa = {
  brand: "دُرستپس",
  tagline: "همراه شما تا کلید خانه",
  nav: { home: "خانه", properties: "خانه‌ها", swipe: "ورق بزن", journey: "مسیر خرید", pros: "متخصص‌ها", tips: "راهنماها", favorites: "علاقه‌مندی‌ها" },
  cta: { start: "رایگان شروع کنید", explore: "گشت‌وگذار در خانه‌ها", more: "بیشتر بدانید", details: "جزئیات بیشتر", contact: "گفت‌وگو با مشاور", send: "ارسال", continue: "ادامه", back: "بازگشت", apply: "اعمال", reset: "پاک کردن", all: "همه", seeAll: "دیدن همه" },
  hero: {
    badge: "شش مرحله تا خانه‌ای که دوستش دارید",
    title1: "خانه بعدی‌تان",
    title2: "یک حدس نیست",
    lead: "دُرستپس شما را از «کاش یک روز» تا «کلید در دست» همراهی می‌کند: خانه‌های واقعی، مشاوران تاییدشده، بودجه شفاف و یک مسیر شش‌مرحله‌ای که همیشه می‌دانید کجای آن ایستاده‌اید.",
    searchPlaceholder: "شهر، محله یا نوع خانه را بنویسید",
    quick: "جستجوهای پرتکرار",
  },
  stats: { properties: "خانه فعال", pros: "متخصص تاییدشده", cities: "شهر", deals: "معامله موفق", satisfaction: "رضایت کاربران", avgMeter: "میانگین هر متر" },
  search: { title: "جستجو", results: "نتیجه", noResults: "خانه‌ای با این شرایط پیدا نشد", filters: "فیلترها", city: "شهر", deal: "نوع معامله", kind: "نوع ملک", price: "بازه قیمت", beds: "اتاق خواب", area: "متراژ", features: "امکانات", sort: "مرتب‌سازی", page: "صفحه" },
  deal: { sale: "فروش", rent: "رهن و اجاره", any: "همه" },
  kinds: { apartment: "آپارتمان", villa: "ویلا", penthouse: "پنت‌هاوس", office: "دفتر کار", land: "زمین" },
  sort: { newest: "جدیدترین", "price-asc": "ارزان‌ترین", "price-desc": "گران‌ترین", "area-desc": "بزرگ‌ترین", rating: "بهترین امتیاز", popular: "پربازدیدترین" },
  unit: { toman: "تومان", perMonth: "ماهانه", meter: "متر", bed: "خواب", bath: "سرویس", floor: "طبقه", deposit: "ودیعه", rent: "اجاره", perMeter: "هر متر", year: "سال ساخت", parking: "پارکینگ" },
  features: { elevator: "آسانسور", parking: "پارکینگ", storage: "انباری", balcony: "بالکن", pool: "استخر", gym: "باشگاه", lobby: "لابی", smart: "خانه هوشمند", garden: "حیاط", furnished: "مبله", security: "نگهبانی", view: "منظره" },
  swipe: { title: "ورق بزن، خانه‌ات را پیدا کن", lead: "راست برای پسندیدن، چپ برای رد کردن. هر انتخاب به ما یاد می‌دهد دنبال چه هستید.", like: "می‌پسندم", skip: "بعدی", undo: "بازگشت", empty: "فعلاً همین بود! فهرست علاقه‌مندی‌ها را ببینید.", liked: "پسندیدید", matches: "پسندهای شما" },
  journey: { title: "مسیر شش‌مرحله‌ای خرید خانه", lead: "هر مرحله چند کار کوچک دارد. تیک بزنید و ببینید چقدر جلو رفته‌اید.", progress: "پیشرفت شما", done: "انجام‌شده", of: "از", duration: "زمان معمول", start: "شروع این مرحله" },
  pros: { title: "متخصص‌های تاییدشده", lead: "مشاور، وام‌دهنده، بازرس، طراح و حقوق‌دان؛ همگی با سابقه‌ای که می‌توانید ببینید.", roles: { agent: "مشاور املاک", lender: "وام‌دهنده", inspector: "بازرس فنی", designer: "طراح داخلی", lawyer: "حقوق‌دان", mover: "باربری" }, deals: "معامله", reviews: "دیدگاه", call: "تماس", book: "درخواست گفت‌وگو" },
  tips: { title: "راهنماها و سیاهه‌ها", lead: "تجربه‌ای که متخصص‌ها رایگان در اختیار شما می‌گذارند.", read: "دقیقه مطالعه", by: "نوشته" },
  lead: { title: "بگذارید مشاور به شما زنگ بزند", name: "نام و نام خانوادگی", phone: "شماره موبایل", email: "رایانامه (اختیاری)", message: "پیام شما", success: "پیام شما ثبت شد، به‌زودی تماس می‌گیریم.", error: "ارسال نشد، دوباره تلاش کنید.", required: "اینجا نباید خالی باشد" },
  prop: { about: "درباره این خانه", facts: "مشخصات", features: "امکانات", agent: "مشاور این خانه", similar: "خانه‌های مشابه", views: "بازدید", save: "ذخیره", saved: "ذخیره شد", share: "هم‌رسانی", map: "موقعیت روی نقشه" },
  fav: { title: "علاقه‌مندی‌ها", empty: "هنوز خانه‌ای نپسندیده‌اید. از بخش «ورق بزن» شروع کنید." },
  theme: { light: "روشن", dark: "تاریک", system: "پیش‌فرض" },
  footer: { about: "درباره ما", product: "محصول", support: "پشتیبانی آنلاین", legal: "قوانین", privacy: "حریم خصوصی", terms: "شرایط استفاده", rights: "همه حقوق محفوظ است.", newsletter: "تازه‌ها را برایم بفرست", subscribe: "عضویت" },
  home: {
    featured: "خانه‌های منتخب",
    featuredLead: "گزیده‌ای از بهترین‌های این هفته در شش شهر.",
    journeyLead: "از رویا تا کلید، شش مرحله روشن.",
    prosLead: "با کسانی کار کنید که کارنامه‌شان پیداست.",
    how: "دُرستپس چطور کار می‌کند؟",
    steps: [
      { t: "خواسته‌تان را روشن کنید", d: "چند سوال کوتاه و چند ورق زدن، تا بدانیم دنبال چه خانه‌ای هستید." },
      { t: "بودجه واقعی بسازید", d: "وام، پس‌انداز و هزینه‌های پنهان را کنار هم ببینید." },
      { t: "با متخصص درست کار کنید", d: "مشاور، بازرس و حقوق‌دان؛ همه در یک میز کار مشترک." },
    ],
    trust: "مورد اعتماد خانه‌اولی‌ها در شش شهر ایران",
  },
};

const en: typeof fa = {
  brand: "Doorsteps",
  tagline: "With you until the keys are yours",
  nav: { home: "Home", properties: "Homes", swipe: "Swipe", journey: "Journey", pros: "Pros", tips: "Guides", favorites: "Favourites" },
  cta: { start: "Start free", explore: "Explore homes", more: "Learn more", details: "See details", contact: "Talk to an agent", send: "Send", continue: "Continue", back: "Back", apply: "Apply", reset: "Clear", all: "All", seeAll: "See all" },
  hero: {
    badge: "Six phases to a home you love",
    title1: "Your next home",
    title2: "is not a guess",
    lead: "Doorsteps walks you from “maybe one day” to keys in hand: real listings, verified pros, an honest budget and a six-phase path where you always know where you stand.",
    searchPlaceholder: "Type a city, a district or a home type",
    quick: "Popular searches",
  },
  stats: { properties: "live homes", pros: "verified pros", cities: "cities", deals: "closed deals", satisfaction: "satisfaction", avgMeter: "avg. per m²" },
  search: { title: "Search", results: "results", noResults: "No home matches these filters yet", filters: "Filters", city: "City", deal: "Deal", kind: "Type", price: "Price range", beds: "Bedrooms", area: "Area", features: "Features", sort: "Sort", page: "Page" },
  deal: { sale: "For sale", rent: "For rent", any: "All" },
  kinds: { apartment: "Apartment", villa: "Villa", penthouse: "Penthouse", office: "Office", land: "Land" },
  sort: { newest: "Newest", "price-asc": "Lowest price", "price-desc": "Highest price", "area-desc": "Largest", rating: "Top rated", popular: "Most viewed" },
  unit: { toman: "toman", perMonth: "per month", meter: "m²", bed: "bed", bath: "bath", floor: "floor", deposit: "Deposit", rent: "Rent", perMeter: "per m²", year: "Built", parking: "Parking" },
  features: { elevator: "Elevator", parking: "Parking", storage: "Storage", balcony: "Balcony", pool: "Pool", gym: "Gym", lobby: "Lobby", smart: "Smart home", garden: "Garden", furnished: "Furnished", security: "Security", view: "View" },
  swipe: { title: "Swipe your way home", lead: "Right to like, left to skip. Every choice teaches the matcher what you mean.", like: "Like", skip: "Skip", undo: "Undo", empty: "That is all for now. Check your favourites.", liked: "Liked", matches: "Your likes" },
  journey: { title: "The six-phase home buying journey", lead: "Each phase is a few small tasks. Tick them off and watch the bar move.", progress: "Your progress", done: "done", of: "of", duration: "Typical time", start: "Start this phase" },
  pros: { title: "Verified professionals", lead: "Agents, lenders, inspectors, designers and lawyers with a track record you can see.", roles: { agent: "Agent", lender: "Lender", inspector: "Inspector", designer: "Designer", lawyer: "Lawyer", mover: "Mover" }, deals: "deals", reviews: "reviews", call: "Call", book: "Request a call" },
  tips: { title: "Guides and checklists", lead: "What the pros know, shared for free.", read: "min read", by: "by" },
  lead: { title: "Let an agent call you", name: "Full name", phone: "Mobile number", email: "Email (optional)", message: "Your message", success: "Got it. We will call you shortly.", error: "Could not send, please try again.", required: "This should not be empty" },
  prop: { about: "About this home", facts: "Facts", features: "Features", agent: "Your agent", similar: "Similar homes", views: "views", save: "Save", saved: "Saved", share: "Share", map: "On the map" },
  fav: { title: "Favourites", empty: "No liked homes yet. Start with Swipe." },
  theme: { light: "Light", dark: "Dark", system: "System" },
  footer: { about: "About", product: "Product", support: "Support", legal: "Legal", privacy: "Privacy", terms: "Terms of service", rights: "All rights reserved.", newsletter: "Send me what is new", subscribe: "Subscribe" },
  home: {
    featured: "Featured homes",
    featuredLead: "A handful of this week's best across six cities.",
    journeyLead: "From dream to keys, six clear phases.",
    prosLead: "Work with people whose record is in the open.",
    how: "How Doorsteps works",
    steps: [
      { t: "Sharpen what you want", d: "A few questions and a few swipes tell us the home you actually mean." },
      { t: "Build a real budget", d: "Loan, savings and the hidden costs, side by side." },
      { t: "Work with the right pro", d: "Agent, inspector and lawyer around one shared workspace." },
    ],
    trust: "Trusted by first-time buyers in six Iranian cities",
  },
};

export const dict = { fa, en } as const;
export type Dict = typeof fa;
export const getDict = (l: Locale): Dict => dict[l] ?? dict.fa;
