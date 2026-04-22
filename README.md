# Habit Tracker PWA | متتبع العادات

A mobile-first Progressive Web App for tracking daily habits, maintaining streaks, and viewing weekly statistics.

تطبيق ويب تقدمي مصمم أولاً للهواتف لتتبع العادات اليومية والحفاظ على سلاسل الإنجاز وعرض إحصاءات أسبوعية.

## Features | الميزات

- Add and delete habits | إضافة العادات وحذفها
- Mark daily completion | تسجيل إنجاز اليوم
- Track current streaks | تتبع سلسلة الإنجاز الحالية
- View weekly summary | عرض ملخص الأسبوع
- Arabic and English UI | واجهة عربية وإنجليزية
- Local browser storage | تخزين محلي داخل المتصفح
- Offline support with Service Worker | دعم العمل دون اتصال عبر عامل خدمة

## Project Structure | هيكل المشروع

- `index.html` — Main app shell | الواجهة الرئيسية
- `styles.css` — App styling | تنسيقات التطبيق
- `app.js` — App logic and storage | منطق التطبيق والحفظ
- `sw.js` — Offline caching | التخزين المؤقت دون اتصال
- `manifest.webmanifest` — PWA manifest | ملف التطبيق التقدمي

## How It Works | كيف يعمل

The app stores habit data in `localStorage` as a list of habits, each with a unique ID, creation date, and an array of completed dates.

يقوم التطبيق بتخزين بيانات العادات داخل `localStorage` على شكل قائمة عادات، تحتوي كل عادة على معرف فريد وتاريخ إنشاء ومصفوفة لتواريخ الإنجاز.

## Run Locally | التشغيل محلياً

1. Download or copy the project files.
2. Serve the folder using a local static server.
3. Open the app in your browser.

1. قم بتنزيل ملفات المشروع أو نسخها.
2. شغّل المجلد باستخدام خادم محلي للملفات الثابتة.
3. افتح التطبيق داخل المتصفح.

## Example Local Servers | أمثلة لخوادم محلية

### Using Python | باستخدام بايثون

```bash
python -m http.server 8080
```

### Using Node.js | باستخدام Node.js

```bash
npx serve .
```

Then open:

```text
http://localhost:8080
```

أو حسب المنفذ الذي يعرضه الخادم المحلي.

## Notes | ملاحظات

- Data is stored only in the current browser. | يتم حفظ البيانات داخل المتصفح الحالي فقط.
- Clearing browser storage will remove habits. | حذف بيانات المتصفح سيؤدي إلى حذف العادات.
- Service worker requires local or hosted HTTP server. | عامل الخدمة يحتاج إلى خادم محلي أو استضافة HTTP.
