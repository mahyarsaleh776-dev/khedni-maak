# خدني معك | Khedni Ma'ak

**Take Me With You** — a front-end prototype exploring a ride-sharing concept: search/matching UI, mock trip data, and a live weather API integration. Built with vanilla HTML, CSS, and JavaScript — a static demo page, not a full deployed app (no backend/server).

نموذج أولي (واجهة أمامية) لفكرة مشاركة رحلات — بحث ومطابقة، بيانات رحلات تجريبية، وربط فعلي بـAPI طقس حي. مبني بـHTML/CSS/JavaScript خام — صفحة عرض ثابتة، مش تطبيق كامل منشور (بدون سيرفر/Backend).

*[English](#-english) · [العربية](#-العربية)*

---

## 🇬🇧 English

### About

**Khedni Ma'ak** ("Take Me With You") is a ride-sharing / carpooling web app concept built as a JavaScript course project. It connects riders with drivers who are already traveling in the same direction, aiming to ease rush-hour congestion and reduce the cost and hassle of daily commutes.

Riders search by **origin, destination, and time**. The app matches them against drivers whose route passes through both points — in the correct order — even if the rider isn't the driver's first or last stop.

### Features

- 🔍 **Smart route matching** — a rider's stops just need to appear on a driver's route, in the right order (not necessarily the start/end points)
- 🕒 **Time-window matching** — trips are matched within a practical time tolerance
- ⭐ **Rating-based sorting** — best-reviewed drivers appear first
- 📝 **Trip requests** — saved to `localStorage`, with duplicate-request prevention via `Set`
- 🌦️ **Live weather** — real-time data for major Syrian cities via the [Open-Meteo](https://open-meteo.com/) API
- 📱 **Fully responsive** — mobile-first design
- 🎨 **Consistent brand identity** — a signature orange badge motif used across the app

### Tech Stack

Vanilla **HTML / CSS / JavaScript** — no frameworks, no build step.

Core JS concepts used: `fetch` + `async/await`, JSON, array methods (`filter`, `sort`, `flatMap`, `map`), Regex validation, `Set`, `localStorage`, DOM manipulation, event delegation, Date/time handling.

### Business Model

An **ad-supported model**, not a fare-based one:

| Who | What they get |
|---|---|
| **Rider** | Free or symbolic-cost rides, clear trip info, offers from local advertisers |
| **Driver** | The **largest share** of ad revenue, plus fuel & maintenance perks |
| **Platform** | A small, sustainable cut that grows with active users |

### Project Structure

```
project/
├── index.html
├── style.css
├── drivers.json
├── js/
│   └── app.js
└── assets/
    ├── logo.png
    ├── city-man.png
    ├── woman-phone.png
    └── farmer-tablet.png
```

### Getting Started

> ⚠️ Don't open `index.html` directly by double-clicking — `fetch("drivers.json")` will fail due to browser CORS restrictions on local files.

1. Clone or download this repository
2. Open the folder in VS Code
3. Install the **Live Server** extension
4. Right-click `index.html` → **Open with Live Server**

### Design Decisions (Scope)

Given a tight build timeline, two deliberate trade-offs were made:

- **No separate driver interface** — drivers exist as structured JSON data, not a login-based app
- **No full admin dashboard** — the admin view is a read-only stats display, not a management tool

### What's Next

- A dedicated driver app for managing trips
- A real backend with live location tracking
- An official safety-reporting channel
- Full integration with a real advertising network

---

## 🇸🇾 العربية

### الفكرة

**خدني معك** هو تطبيق ويب لمشاركة الرحلات (Carpooling)، بُني كمشروع لمادة JavaScript. يربط التطبيق الراكب بسائقين متوجهين أصلاً لنفس الاتجاه، بهدف تخفيف ازدحام ساعات الذروة وتقليل تكلفة ومشقة التنقل اليومي.

الراكب بيبحث بـ**نقطة الانطلاق، الوجهة، والوقت**. التطبيق بيطابقه مع السائقين يلي مسارهم يمر بالنقطتين — وبالترتيب الصحيح — حتى لو الراكب مو أول أو آخر محطة بمسار السائق.

### الميزات

- 🔍 **مطابقة ذكية للمسار** — يكفي إنه نقطتي الراكب موجودين بمسار السائق وبالترتيب الصح، مو شرط يكونوا أول وآخر نقطة
- 🕒 **مطابقة الوقت** — الرحلات بتتطابق ضمن هامش زمني عملي
- ⭐ **ترتيب حسب التقييم** — أفضل السائقين تقييمًا بيظهروا أول
- 📝 **طلب الرحلات** — بيُحفظ بـ`localStorage`، مع منع تكرار الطلب عبر `Set`
- 🌦️ **طقس حي** — بيانات لحظية لأهم المدن السورية عبر [Open-Meteo](https://open-meteo.com/) API
- 📱 **متجاوب بالكامل** — تصميم Mobile-first
- 🎨 **هوية بصرية متسقة** — شارة برتقالية مميزة تظهر بكل أرجاء التطبيق

### التقنيات المستخدمة

**HTML / CSS / JavaScript** خام — بدون أي إطار عمل (Framework) أو أدوات بناء (Build tools).

المفاهيم الأساسية المستخدمة: `fetch` + `async/await`، JSON، دوال المصفوفات (`filter`, `sort`, `flatMap`, `map`)، التحقق بـRegex، `Set`، `localStorage`، التعامل مع DOM، تفويض الأحداث (Event Delegation)، التعامل مع الوقت والتاريخ.

### نموذج العمل

نموذج **قائم على الإعلانات**، مو على الأجرة:

| الطرف | شو بياخد |
|---|---|
| **الراكب** | رحلات مجانية أو بسعر رمزي، معلومات واضحة، عروض من معلنين محليين |
| **السائق** | **الحصة الأكبر** من عائدات الإعلانات، بالإضافة لعروض وقود وصيانة |
| **المنصة** | نسبة صغيرة ومستدامة، بتكبر مع زيادة المستخدمين |

### بنية المشروع

```
project/
├── index.html
├── style.css
├── drivers.json
├── js/
│   └── app.js
└── assets/
    ├── logo.png
    ├── city-man.png
    ├── woman-phone.png
    └── farmer-tablet.png
```

### كيفية التشغيل

> ⚠️ ما تفتح `index.html` مباشرة بدبل كليك — `fetch("drivers.json")` رح يفشل بسبب قيود CORS على الملفات المحلية بالمتصفح.

1. حمّل أو استنسخ المستودع (Repository)
2. افتح المجلد بـ VS Code
3. ثبّت إضافة **Live Server**
4. كليك يمين على `index.html` → **Open with Live Server**

### قرارات النطاق (Scope)

بسبب ضيق وقت البناء، اتخذت قرارين واعيين:

- **بدون واجهة سائق منفصلة** — بيانات السائقين موجودة كـJSON منظم، مش تطبيق بتسجيل دخول
- **بدون لوحة تحكم إدارية كاملة** — واجهة الأدمن هي عرض إحصائيات فقط، مو أداة إدارة

### التوسعات المستقبلية

- تطبيق مخصص للسائقين لإدارة رحلاتهم
- سيرفر حقيقي مع تتبع موقع لحظي
- قناة رسمية للإبلاغ عن مشاكل السلامة
- تكامل كامل مع شبكة إعلانات حقيقية
