import random
from sqlmodel import Session, select
from .db import engine
from .models import Favorite, Lead, Phase, Professional, Progress, Property, Step, Tip

CITIES = [
    ("Tehran", "تهران", 35.72, 51.40, [("Zaferanieh", "زعفرانیه"), ("Elahieh", "الهیه"), ("Saadat Abad", "سعادت‌آباد"), ("Mirdamad", "میرداماد"), ("Ekbatan", "اکباتان")]),
    ("Isfahan", "اصفهان", 32.65, 51.66, [("Jolfa", "جلفا"), ("Mardavij", "مرداویج"), ("Sepahan Shahr", "سپاهان‌شهر")]),
    ("Shiraz", "شیراز", 29.60, 52.53, [("Ghasrodasht", "قصردشت"), ("Maali Abad", "معالی‌آباد"), ("Eram", "ارم")]),
    ("Mashhad", "مشهد", 36.29, 59.60, [("Vakil Abad", "وکیل‌آباد"), ("Hashemieh", "هاشمیه"), ("Farhang", "فرهنگ")]),
    ("Tabriz", "تبریز", 38.07, 46.29, [("Valiasr", "ولیعصر"), ("Roshdieh", "رشدیه")]),
    ("Karaj", "کرج", 35.83, 50.99, [("Gohardasht", "گوهردشت"), ("Mehrshahr", "مهرشهر")]),
]

KINDS = [
    ("apartment", "Apartment", "آپارتمان"),
    ("villa", "Villa", "ویلا"),
    ("penthouse", "Penthouse", "پنت‌هاوس"),
    ("office", "Office", "دفتر کار"),
    ("land", "Land", "زمین"),
]

ADJ = [
    ("Sunlit", "آفتاب‌گیر"), ("Modern", "مدرن"), ("Garden", "باغ‌دار"), ("Quiet", "دنج"),
    ("Panoramic", "رو به منظره"), ("Newly built", "نوساز"), ("Family", "خانوادگی"), ("Smart", "هوشمند"),
]

FEATURES = ["elevator", "parking", "storage", "balcony", "pool", "gym", "lobby", "smart", "garden", "furnished", "security", "view"]

DESC_EN = "A carefully finished {kind} in {district}, {city}. Wide openings bring in daylight all day, the layout separates living and sleeping zones, and the building is walking distance from daily needs."
DESC_FA = "یک {kind} با نورگیری عالی در {district}، {city}. پنجره‌های بزرگ، نقشه‌ای که فضای نشیمن را از اتاق‌ها جدا می‌کند و دسترسی پیاده به نیازهای روزمره."

PROS = [
    ("Sara Ahmadi", "سارا احمدی", "agent", "Doorsteps Prime", "دُرستپس پرایم", 0, ["luxury", "negotiation"], 340),
    ("Reza Kamali", "رضا کمالی", "agent", "Kamali Realty", "املاک کمالی", 0, ["first-home", "apartments"], 28),
    ("Niloofar Yazdani", "نیلوفر یزدانی", "agent", "Shiraz Homes", "خانه‌های شیراز", 2, ["villas", "gardens"], 160),
    ("Amir Hosseini", "امیر حسینی", "lender", "Mellat Bank", "بانک ملت", 0, ["mortgage", "first-home"], 265),
    ("Mahdis Rahimi", "مهدیس رحیمی", "lender", "Maskan Bank", "بانک مسکن", 3, ["construction-loan"], 190),
    ("Kaveh Tabatabai", "کاوه طباطبایی", "inspector", "SafeHome", "خانه امن", 0, ["structure", "utilities"], 120),
    ("Elham Sadeghi", "الهام صادقی", "inspector", "CheckPoint", "چک‌پوینت", 1, ["humidity", "electrical"], 80),
    ("Pouya Nazari", "پویا نظری", "designer", "Studio Naaz", "استودیو ناز", 0, ["interior", "renovation"], 45),
    ("Shirin Farhadi", "شیرین فرهادی", "designer", "Atelier Shirin", "آتلیه شیرین", 2, ["lighting", "kitchen"], 300),
    ("Hamed Gholami", "حامد غلامی", "lawyer", "Gholami Law", "حقوقی غلامی", 0, ["contracts", "title-deed"], 220),
    ("Roya Mousavi", "رویا موسوی", "lawyer", "Mousavi & Co", "موسوی و همکاران", 4, ["disputes"], 140),
    ("Behzad Karimi", "بهزاد کریمی", "mover", "Barbari Aram", "باربری آرام", 0, ["packing", "storage"], 20),
]

PHASES = [
    ("dream", "Dream", "رویا", "Turn a vague wish into a written picture of the home you want.", "خواسته‌های مبهم را به تصویری روشن از خانه‌ دلخواه تبدیل کنید.", "sparkles", "violet", "2-6 months", "۲ تا ۶ ماه", [
        ("Write your must-haves", "بایدهای خانه را بنویسید", "Five things you will not give up on.", "پنج چیزی که از آن‌ها نمی‌گذرید."),
        ("Pick three neighbourhoods", "سه محله را انتخاب کنید", "Visit each one on a weekday and a weekend.", "هر کدام را یک‌بار در روز کاری و یک‌بار آخر هفته ببینید."),
        ("Swipe 30 listings", "۳۰ آگهی را ورق بزنید", "Your likes teach the matcher what you mean.", "پسندهای شما به سامانه یاد می‌دهد چه می‌خواهید."),
        ("Talk to one agent", "با یک مشاور گفت‌وگو کنید", "No commitment, just calibration.", "بدون تعهد، فقط برای تنظیم انتظارها."),
    ]),
    ("budget", "Budget", "بودجه", "Know exactly what you can pay before you fall in love with a place.", "پیش از دل‌بستن به یک خانه، بدانید دقیقاً چقدر می‌توانید بپردازید.", "wallet", "emerald", "2-4 weeks", "۲ تا ۴ هفته", [
        ("Add up your savings", "پس‌انداز خود را جمع بزنید", "Cash, deposits, help from family.", "نقد، سپرده و کمک خانواده."),
        ("Check loan eligibility", "شرایط وام را بررسی کنید", "A lender on Doorsteps answers in one day.", "وام‌دهنده‌های دُرستپس در یک روز پاسخ می‌دهند."),
        ("Budget the hidden costs", "هزینه‌های پنهان را حساب کنید", "Transfer tax, commission, moving, repairs.", "مالیات نقل‌وانتقال، کمیسیون، اسباب‌کشی و تعمیرات."),
        ("Set your ceiling", "سقف قیمت را تعیین کنید", "Write it down, it protects you later.", "بنویسیدش؛ بعدها از شما محافظت می‌کند."),
    ]),
    ("search", "Search", "جستجو", "Visit smart, compare fairly, keep notes in one place.", "هوشمندانه بازدید کنید، منصفانه مقایسه کنید و یادداشت‌ها را یک‌جا نگه دارید.", "search", "sky", "1-3 months", "۱ تا ۳ ماه", [
        ("Save a shortlist", "فهرست کوتاه بسازید", "Max seven homes, otherwise nothing is comparable.", "حداکثر هفت خانه؛ بیشتر از آن قابل مقایسه نیست."),
        ("Tour like a pro", "مثل حرفه‌ای‌ها بازدید کنید", "Use the free checklist before every visit.", "پیش از هر بازدید از سیاهه رایگان استفاده کنید."),
        ("Photograph problems", "ایرادها را عکس بگیرید", "Damp, cracks, windows, water pressure.", "نم، ترک، پنجره‌ها و فشار آب."),
        ("Rank your top three", "سه گزینه برتر را رتبه دهید", "Compare on price per metre, not feeling.", "بر پایه قیمت هر متر مقایسه کنید، نه حس لحظه‌ای."),
    ]),
    ("offer", "Offer", "پیشنهاد", "Make an offer that is strong, fair and reversible if something breaks.", "پیشنهادی بدهید که محکم، منصفانه و در صورت بروز مشکل قابل بازگشت باشد.", "handshake", "amber", "1-2 weeks", "۱ تا ۲ هفته", [
        ("Check comparable prices", "قیمت‌های مشابه را بسنجید", "The last three deals on the same street.", "سه معامله آخر همان خیابان."),
        ("Agree the conditions", "شرط‌ها را توافق کنید", "Inspection, loan approval, handover date.", "بازرسی، تایید وام و تاریخ تحویل."),
        ("Book an inspection", "بازرسی فنی رزرو کنید", "Two hours that can save a hundred million.", "دو ساعتی که می‌تواند صد میلیون را نجات دهد."),
        ("Sign the pre-contract", "مبایعه‌نامه را امضا کنید", "Have a lawyer read it first.", "اول بگذارید یک حقوق‌دان آن را بخواند."),
    ]),
    ("close", "Close", "قرارداد", "Paperwork, money and keys, in the right order.", "مدارک، پول و کلید؛ به ترتیب درست.", "file", "rose", "2-6 weeks", "۲ تا ۶ هفته", [
        ("Collect the documents", "مدارک را جمع کنید", "Title deed, ID, clearance certificates.", "سند، مدارک هویتی و مفاصاحساب‌ها."),
        ("Final walk-through", "بازدید نهایی", "The day before the notary, not after.", "روز پیش از دفترخانه، نه بعد از آن."),
        ("Transfer at the notary", "انتقال در دفترخانه", "Money moves when the deed moves.", "پول همزمان با سند جابه‌جا می‌شود."),
        ("Get every key", "همه کلیدها را بگیرید", "Including storage, parking and mailbox.", "شامل انباری، پارکینگ و صندوق پست."),
    ]),
    ("move", "Move in", "اسباب‌کشی", "Land softly: utilities, movers and the first night box.", "نرم فرود بیایید: انشعاب‌ها، باربری و جعبه شب اول.", "home", "cyan", "1-2 weeks", "۱ تا ۲ هفته", [
        ("Transfer utilities", "انشعاب‌ها را منتقل کنید", "Electricity, gas, water, internet.", "برق، گاز، آب و اینترنت."),
        ("Book the movers", "باربری را رزرو کنید", "Mid-month is cheaper than month end.", "میانه ماه ارزان‌تر از پایان ماه است."),
        ("Pack a first-night box", "جعبه شب اول را ببندید", "Bedding, kettle, chargers, tools.", "رخت‌خواب، کتری، شارژر و ابزار."),
        ("Update your address", "نشانی خود را به‌روز کنید", "Bank, insurance, deliveries.", "بانک، بیمه و سفارش‌ها."),
    ]),
]

TIPS = [
    ("tour-like-a-pro", "search", "Checklist", "سیاهه", "Tour a house like a pro", "مثل یک حرفه‌ای از خانه بازدید کنید",
     "Open every window. Run the taps for two minutes. Look at ceiling corners for damp. Stand in the street at 9pm. Ask what the neighbours are like, then ask a neighbour.",
     "همه پنجره‌ها را باز کنید. دو دقیقه شیرهای آب را باز بگذارید. گوشه‌های سقف را از نظر نم بررسی کنید. ساعت ۹ شب در کوچه بایستید. درباره همسایه‌ها بپرسید و بعد از خود همسایه بپرسید.", 4, 1),
    ("price-per-metre", "offer", "Numbers", "اعداد", "Price per metre beats gut feeling", "قیمت هر متر از حس لحظه‌ای مهم‌تر است",
     "Divide the asking price by usable area, then compare with the last three deals on the same street. A difference above 15% needs an explanation you can see with your own eyes.",
     "قیمت پیشنهادی را بر متراژ مفید تقسیم کنید و با سه معامله آخر همان خیابان بسنجید. اختلاف بیش از ۱۵ درصد باید دلیلی داشته باشد که با چشم خودتان ببینید.", 3, 2),
    ("loan-in-one-day", "budget", "Financing", "تامین مالی", "Get a loan answer in one day", "پاسخ وام را در یک روز بگیرید",
     "Bring three months of statements, your ID and a payslip. A pre-approval is not a promise, but it turns you from a browser into a buyer in the eyes of the seller.",
     "سه ماه گردش حساب، مدارک هویتی و فیش حقوقی را آماده کنید. تاییدیه اولیه یک تعهد قطعی نیست، اما شما را از یک تماشاچی به یک خریدار جدی تبدیل می‌کند.", 5, 4),
    ("hidden-costs", "budget", "Numbers", "اعداد", "The seven hidden costs of buying", "هفت هزینه پنهان خرید خانه",
     "Commission, transfer tax, notary fees, clearance certificates, moving, immediate repairs and two months of double bills. Plan for 6% of the price on top of the price.",
     "کمیسیون، مالیات نقل‌وانتقال، هزینه دفترخانه، مفاصاحساب‌ها، اسباب‌کشی، تعمیرات فوری و دو ماه قبض دوبرابر. حدود ۶ درصد قیمت را جدا کنار بگذارید.", 4, 4),
    ("first-night-box", "move", "Moving", "اسباب‌کشی", "What goes in the first-night box", "در جعبه شب اول چه بگذاریم",
     "Bedding, towels, kettle, mugs, phone chargers, a screwdriver, light bulbs, paracetamol and the contract. Tape it shut and carry it in your own car.",
     "رخت‌خواب، حوله، کتری، لیوان، شارژر، پیچ‌گوشتی، لامپ، مسکن و قرارداد. درش را بچسبانید و خودتان با ماشین ببرید.", 2, 12),
    ("inspection-worth-it", "offer", "Inspection", "بازرسی", "A two-hour inspection saves months", "بازرسی دوساعته، ماه‌ها را نجات می‌دهد",
     "An inspector checks structure, humidity, wiring and plumbing. Whatever is found becomes a bargaining chip or a reason to walk away with your deposit intact.",
     "بازرس، سازه، رطوبت، سیم‌کشی و لوله‌کشی را بررسی می‌کند. هرچه پیدا شود یا برگ برنده مذاکره است یا دلیلی برای کنار کشیدن بدون از دست دادن بیعانه.", 3, 6),
    ("neighbourhood-test", "dream", "Guide", "راهنما", "The three-visit neighbourhood test", "آزمون سه‌بازدیدی محله",
     "Visit at 8am, at 7pm and on Friday. Parking, noise and light change completely between them. If you still like it three times, you will like it for years.",
     "ساعت ۸ صبح، ۷ عصر و روز جمعه به محله بروید. پارکینگ، صدا و نور در این سه زمان کاملاً فرق می‌کند. اگر هر سه بار را دوست داشتید، سال‌ها دوستش خواهید داشت.", 3, 3),
    ("contract-red-flags", "close", "Legal", "حقوقی", "Five red flags in a contract", "پنج نشانه خطر در قرارداد",
     "No penalty clause, a vague handover date, unpaid utility bills, a seller who is not the registered owner, and any blank space left in the text.",
     "نبود وجه التزام، تاریخ تحویل مبهم، قبض‌های پرداخت‌نشده، فروشنده‌ای که مالک رسمی نیست و هر جای خالی در متن قرارداد.", 5, 10),
]


def seed(force: bool = False) -> None:
    rnd = random.Random(43)
    with Session(engine) as s:
        if s.exec(select(Property)).first() and not force:
            return
        if force:
            for m in (Favorite, Lead, Progress, Tip, Step, Phase, Property, Professional):
                for row in s.exec(select(m)).all():
                    s.delete(row)
            s.commit()

        pros = []
        for i, (en, fa, role, agen, agfa, ci, spec, rev) in enumerate(PROS):
            c = CITIES[ci]
            p = Professional(
                name_en=en, name_fa=fa, role=role, agency_en=agen, agency_fa=agfa,
                city_en=c[0], city_fa=c[1], phone=f"+98 21 {4000 + i * 7} {1000 + i * 13}",
                bio_en=f"{en} has closed {rev} deals and answers within a few hours.",
                bio_fa=f"{fa} تا امروز {rev} معامله را به سرانجام رسانده و معمولاً ظرف چند ساعت پاسخ می‌دهد.",
                rating=round(4.4 + (i % 6) * 0.1, 1), reviews=rev, deals=rev // 2 + 8,
                hue=(i * 37 + 200) % 360, initials="".join(w[0] for w in en.split()[:2]),
                specialties=spec,
            )
            s.add(p)
            pros.append(p)
        s.commit()
        for p in pros:
            s.refresh(p)

        n = 0
        for c_en, c_fa, lat, lng, districts in CITIES:
            for d_en, d_fa in districts:
                for j in range(2):
                    n += 1
                    kind, k_en, k_fa = KINDS[(n + j) % len(KINDS)]
                    adj_en, adj_fa = ADJ[n % len(ADJ)]
                    deal = "rent" if n % 4 == 0 else "sale"
                    area = rnd.choice([58, 72, 84, 96, 110, 128, 145, 180, 240])
                    beds = 1 if area < 70 else 2 if area < 110 else 3 if area < 180 else 4
                    base = {"Tehran": 95, "Isfahan": 48, "Shiraz": 45, "Mashhad": 42, "Tabriz": 38, "Karaj": 40}[c_en]
                    per_m = int(base * 1_000_000 * (0.8 + (n % 7) * 0.09))
                    price = per_m * area if deal == "sale" else 0
                    deposit = int(per_m * area * 0.12 / 1_000_000) * 1_000_000 if deal == "rent" else 0
                    rent_m = int(deposit * 0.03 / 1_000_000) * 1_000_000 if deal == "rent" else 0
                    feats = rnd.sample(FEATURES, k=rnd.randint(4, 7))
                    pro = pros[n % len(pros)] if pros[n % len(pros)].role == "agent" else pros[n % 3]
                    s.add(Property(
                        slug=f"{c_en.lower()}-{d_en.lower().replace(' ', '-')}-{n}",
                        title_en=f"{adj_en} {k_en} in {d_en}",
                        title_fa=f"{k_fa} {adj_fa} در {d_fa}",
                        description_en=DESC_EN.format(kind=k_en.lower(), district=d_en, city=c_en),
                        description_fa=DESC_FA.format(kind=k_fa, district=d_fa, city=c_fa),
                        city_en=c_en, city_fa=c_fa, district_en=d_en, district_fa=d_fa,
                        deal=deal, kind=kind, price=price, deposit=deposit, rent=rent_m,
                        area=area, beds=beds, baths=1 + beds // 2, parking=1 if n % 3 else 0,
                        floor=n % 12, year_built=1392 + (n % 12),
                        lat=round(lat + rnd.uniform(-0.05, 0.05), 5), lng=round(lng + rnd.uniform(-0.05, 0.05), 5),
                        cover=f"a{(n % 8) + 1}",
                        gallery=[f"a{((n + k) % 8) + 1}" for k in range(4)],
                        features=feats, rating=round(4.0 + (n % 10) * 0.1, 1),
                        views=120 + n * 37, likes=n * 3 % 90,
                        featured=n % 5 == 0, pro_id=pro.id,
                    ))
        s.commit()

        for i, (key, t_en, t_fa, s_en, s_fa, icon, accent, d_en, d_fa, steps) in enumerate(PHASES):
            s.add(Phase(key=key, order=i, title_en=t_en, title_fa=t_fa, summary_en=s_en, summary_fa=s_fa,
                        icon=icon, accent=accent, duration_en=d_en, duration_fa=d_fa))
            for k, (st_en, st_fa, h_en, h_fa) in enumerate(steps):
                s.add(Step(phase_key=key, order=k, title_en=st_en, title_fa=st_fa, hint_en=h_en, hint_fa=h_fa))

        for i, (slug, phase, c_en, c_fa, t_en, t_fa, b_en, b_fa, rm, pid) in enumerate(TIPS):
            s.add(Tip(slug=slug, phase_key=phase, category_en=c_en, category_fa=c_fa, title_en=t_en, title_fa=t_fa,
                      body_en=b_en, body_fa=b_fa, read_min=rm, cover=f"t{(i % 4) + 1}", pro_id=pid))
        s.commit()
