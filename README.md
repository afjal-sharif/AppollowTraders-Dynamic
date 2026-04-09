# মেসার্স এপোলো ট্রেডার্স - ব্যবসা ব্যবস্থাপনা অ্যাপ

একটি পেশাদার, ফাস্ট, এবং মোবাইল-অপটিমাইজড ব্যবসা ব্যবস্থাপনা ওয়েব অ্যাপ। Cloudflare Workers, KV, এবং R2 এর মাধ্যমে ডিপ্লয় করা।

![Version](https://img.shields.io/badge/version-2.0-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## 📋 সূচিপত্র

- [বৈশিষ্ট্য](#-বৈশিষ্ট্য)
- [প্রযুক্তি](#️-প্রযুক্তি)
- [ফাইল স্ট্রাকচার](#-ফাইল-স্ট্রাকচার)
- [ডিপ্লয়মেন্ট](#️-ডিপ্লয়মেন্ট)
- [কনফিগারেশন](#-কনফিগারেশন)
- [ব্যবহার নির্দেশিকা](#-ব্যবহার-নির্দেশিকা)
- [API ডকুমেন্টেশন](#-api-ডকুমেন্টেশন)
- [ট্রাবলশুটিং](#-ট্রাবলশুটিং)

---

## ✨ বৈশিষ্ট্য

### 🔐 ত্রি-স্তরীয় নিরাপত্তা
| রোল | ডিফল্ট PIN | অ্যাক্সেস |
|------|-----------|---------|
| **সাধারণ ব্যবহারকারী** | `1234` | ড্যাশবোর্ড, ব্যাংক, গাড়ি, দলিল |
| **এডমিন** | `5678` | উপরের সব + এডমিন প্যানেল |
| **সুপার এডমিন** | `698846` | সবকিছু + লাইসেন্স ম্যানেজমেন্ট |

### 🏦 ব্যাংক অ্যাকাউন্ট ম্যানেজমেন্ট
- ✅ ব্যাংক অ্যাকাউন্ট যোগ/দেখুন/মুছুন
- ✅ এক-ক্লিক কপি
- ✅ SMS ও WhatsApp এ শেয়ার
- ✅ সার্চ ও ফিল্টার

### 🚗 গাড়ির নথি ম্যানেজমেন্ট
- ✅ গাড়ির তথ্য যোগ/সম্পাদনা
- ✅ মেয়াদ শেষের তারিখ ট্র্যাকিং
- ✅ রঙিন ব্যাজ (লাল=মেয়াদ শেষ, কমলা=৭ দিন, হলুদ=৩০ দিন)
- ✅ ডকুমেন্ট টাইপ (ফিটনেস, ট্যাক্স, ইন্সুরেন্স ইত্যাদি)
- ✅ ইনলাইন এডিট

### 📄 দলিল ব্যবস্থাপনা
- ✅ ফাইল আপলোড (R2 স্টোরেজ)
- ✅ ভিউয়ার (জুম/প্যান সাপোর্ট)
- ✅ সম্পাদনা/মুছে ফেলা
- ✅ ডকুমেন্ট টাইপ ও মেয়াদ ট্র্যাকিং

### 🔔 স্বয়ংক্রিয় সতর্কতা
- ✅ টেলিগ্রাম বট নোটিফিকেশন
- ✅ দিনে একবার (স্প্যাম-মুক্ত)
- ✅ গাড়ি ও দলিলের মেয়াদ শেষের আগে সতর্কতা
- ✅ হোমপেজে লাইভ এলার্ট

### 💾 ব্যাকআপ ও রিস্টোর
- ✅ সম্পূর্ণ ডেটা ব্যাকআপ (KV তে সংরক্ষণ)
- ✅ JSON ফাইল ডাউনলোড
- ✅ ব্যাকআপ থেকে রিস্টোর
- ✅ এক-ক্লিক সব ডেটা মুছে ফেলা

### 🎨 আধুনিক UI/UX
- ✅ ডার্ক/লাইট মোড
- ✅ মোবাইল-ফার্স্ট ডিজাইন
- ✅ বটম নেভিগেশন
- ✅ স্মুথ অ্যানিমেশন
- ✅ অফলাইন-রেডি (PWA)

---

## 🛠️ প্রযুক্তি

### ফ্রন্টএন্ড
- **React 18** - UI লাইব্রেরি
- **TypeScript** - টাইপ সেফটি
- **React Router v6** - ক্লায়েন্ট-সাইড রাউটিং
- **Tailwind CSS 3** - স্টাইলিং
- **Lucide React** - আইকন
- **Vite** - বিল্ড টুল

### ব্যাকএন্ড
- **Cloudflare Workers** - সার্ভারলেস কম্পিউট
- **Cloudflare KV** - কী-ভ্যালু ডেটাবেস
- **Cloudflare R2** - ফাইল স্টোরেজ
- **Telegram Bot API** - নোটিফিকেশন

---

## 📁 ফাইল স্ট্রাকচার

```
project/
├── src/
│   ├── pages/              # পেজ কম্পোনেন্ট
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── BanksPage.tsx
│   │   ├── VehiclesPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── ...
│   ├── components/         # রিইউজেবল কম্পোনেন্ট
│   │   ├── Layout.tsx
│   │   ├── DocumentViewer.tsx
│   │   └── ...
│   ├── api.ts             # API হেল্পার
│   ├── types.ts           # TypeScript টাইপ
│   ├── constants.ts       # কনস্ট্যান্ট
│   └── App.tsx            # মেইন অ্যাপ
├── public/
├── dist/                  # বিল্ড আউটপুট (auto-generated)
│   └── index.html        # সিঙ্গেল HTML ফাইল
├── DEPLOY-worker.js      # Cloudflare Worker কোড
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 ডিপ্লয়মেন্ট

### পদ্ধতি ১: GitHub Actions (সুপারিশকৃত)

#### ধাপ ১: GitHub এ পুশ করুন
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/apollo-traders.git
git push -u origin main
```

#### ধাপ 2: GitHub Actions স্বয়ংক্রিয়ভাবে বিল্ড করবে
- **Actions** ট্যাবে যান
- সর্বশেষ রান ক্লিক করুন
- **Artifacts** থেকে `index-html` ডাউনলোড করুন
- অথবা **Releases** থেকে `index.html` ডাউনলোড করুন

#### ধাপ 3: Cloudflare KV তে আপলোড করুন
1. [dash.cloudflare.com](https://dash.cloudflare.com) এ যান
2. **Workers & Pages** → **KV**
3. আপনার KV নেমস্পেস খুলুন (যেমন `DATA_STORE`)
4. **+ Add entry** ক্লিক করুন
5. **Key:** `APP_HTML`
6. **Value:** `index.html` ফাইলের সম্পূর্ণ কনটেন্ট পেস্ট করুন
7. **Save**

#### ধাপ 4: Worker কোড আপডেট করুন
1. **Workers & Pages** → আপনার worker ক্লিক করুন
2. **Edit Code** বাটন
3. সব ডিলিট করুন
4. `DEPLOY-worker.js` এর কনটেন্ট পেস্ট করুন
5. **Save and Deploy**

---

### পদ্ধতি ২: ম্যানুয়াল বিল্ড

#### ধাপ 1: লোকালি বিল্ড করুন
```bash
npm install
npm run build
```

#### ধাপ 2: `dist/index.html` কপি করুন
- `dist/index.html` ফাইলটি খুলুন
- সব কনটেন্ট কপি করুন (Ctrl+A, Ctrl+C)

#### ধাপ 3 ও 4: উপরের মত KV তে আপলোড ও Worker আপডেট করুন

---

### পদ্ধতি ৩: Wrangler CLI (অ্যাডভান্সড)

```bash
# Wrangler ইনস্টল করুন
npm install -g wrangler

# লগইন করুন
wrangler login

# KV তে HTML আপলোড করুন
wrangler kv:key put --binding=DATA_STORE "APP_HTML" --path=dist/index.html

# Worker ডিপ্লয় করুন
wrangler deploy
```

---

## ⚙️ কনফিগারেশন

### 1. Cloudflare সেটআপ

#### KV Namespace তৈরি করুন:
1. Dashboard → **Workers & Pages** → **KV**
2. **Create namespace** → নাম দিন `apollo-data`
3. Worker সেটিংসে বাইন্ড করুন:
   - Variable name: `DATA_STORE`
   - KV namespace: `apollo-data`

#### R2 Bucket তৈরি করুন:
1. Dashboard → **R2** → **Create bucket**
2. নাম দিন `apollo-docs`
3. Worker সেটিংসে বাইন্ড করুন:
   - Variable name: `DOC_BUCKET`
   - R2 bucket: `apollo-docs`

### 2. Worker Environment Variables

`DEPLOY-worker.js` ফাইলে এগুলো আপডেট করুন:

```javascript
// লাইন 12-18
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN";  // BotFather থেকে নিন
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID";       // @userinfobot থেকে নিন
const STATIC_LICENSE_ISO = "2027-03-01";       // লাইসেন্স মেয়াদ
```

### 3. প্রথমবার চালানোর সময়

Worker প্রথমবার চালালে স্বয়ংক্রিয়ভাবে এগুলো তৈরি হবে:
- `USER_PIN` = `1234`
- `ADMIN_PIN` = `5678`
- `SUPER_ADMIN_PIN` = `698846`
- `APP_LICENSE` = `{ "expiresAt": "2027-03-01" }`

---

## 📖 ব্যবহার নির্দেশিকা

### লগইন
1. অ্যাপ খুলুন
2. রোল নির্বাচন করুন (সাধারণ/এডমিন/সুপার এডমিন)
3. PIN দিন
4. লগইন করুন

**ডিফল্ট PIN:**
- সাধারণ: `1234`
- এডমিন: `5678`
- সুপার এডমিন: `698846`

### PIN পরিবর্তন
1. এডমিন হিসেবে লগইন করুন
2. **এডমিন প্যানেল** যান
3. **পিন পরিবর্তন** সেকশন
4. নতুন PIN দিন ও সেভ করুন

### ব্যাংক অ্যাকাউন্ট যোগ
1. **ব্যাংক** পেজ
2. **+ নতুন** বাটন
3. তথ্য পূরণ করুন
4. সেভ

### গাড়ি যোগ
1. **গাড়ি** পেজ
2. **+ নতুন**
3. নাম, নম্বর, ডকুমেন্ট টাইপ, মেয়াদ দিন
4. সেভ

### দলিল আপলোড
1. **দলিল** পেজ
2. **+ নতুন**
3. ফাইল সিলেক্ট করুন
4. তথ্য দিন ও আপলোড করুন

### ব্যাকআপ
1. **এডমিন প্যানেল**
2. **ব্যাকআপ তৈরি করুন** ক্লিক
3. ব্যাকআপ ID কপি করুন বা ডাউনলোড করুন

---

## 🔌 API ডকুমেন্টেশন

### অথেনটিকেশন
```
POST /api/login
Body: { "pin": "1234", "role": "user" }
Response: { "success": true, "role": "user" }
Sets-Cookie: auth=user

GET /api/check-auth
Response: { "loggedIn": true, "role": "user" }

POST /api/logout
```

### ব্যাংক
```
GET /api/banks
Response: { "banks": [...] }

POST /api/save-bank
Body: { "id"?, "name", "account", "bankName", "branch", "ifsc" }

POST /api/delete
Body: { "type": "bank", "id": "..." }
```

### গাড়ি
```
GET /api/vehicles
POST /api/save-vehicle
POST /api/delete
```

### দলিল
```
GET /api/documents
POST /api/save-document (multipart/form-data)
GET /api/file/:key (R2 থেকে ফাইল)
POST /api/delete
```

### এডমিন
```
GET /api/backup/list
POST /api/backup/create
GET /api/backup/download?id=...
POST /api/backup/restore
POST /api/backup/delete

GET /api/settings
POST /api/settings

POST /api/change-pin
POST /api/change-admin-pin
POST /api/change-super-admin-pin
```

---

## 🐛 ট্রাবলশুটিং

### সমস্যা: লগইন হচ্ছে না
**সমাধান:**
1. KV তে `USER_PIN`, `ADMIN_PIN` চেক করুন
2. Worker লগ দেখুন (Dashboard → Worker → Logs)
3. ব্রাউজার কুকি ক্লিয়ার করুন

### সমস্যা: ডেটা দেখাচ্ছে না
**সমাধান:**
1. KV বাইন্ডিং ঠিক আছে কি না চেক করুন
2. `/api/check-auth` কল করে লগইন স্ট্যাটাস দেখুন
3. ব্রাউজার কনসোলে এরর দেখুন (F12)

### সমস্যা: ফাইল আপলোড হচ্ছে না
**সমাধান:**
1. R2 বাকেট বাইন্ডিং চেক করুন
2. ফাইল সাইজ 10MB এর কম হতে হবে
3. Worker লগে এরর দেখুন

### সমস্যা: টেলিগ্রাম নোটিফিকেশন আসছে না
**সমাধান:**
1. `TELEGRAM_BOT_TOKEN` সঠিক কি না চেক করুন
2. `TELEGRAM_CHAT_ID` সঠিক কি না চেক করুন
3. বটকে মেসেজ পাঠিয়ে স্টার্ট করুন
4. Cron Trigger সেট করুন (Workers → Triggers → Cron)

### সমস্যা: লাইসেন্স এক্সপায়ার্ড দেখাচ্ছে
**সমাধান:**
1. `?master=698846` যোগ করে URL খুলুন
2. সুপার এডমিন প্যানেলে যান
3. নতুন মেয়াদ দিন

---

## 🔄 আপডেট করার নিয়ম

### কোড পরিবর্তনের পর:
1. GitHub এ পুশ করুন
2. Actions থেকে নতুন `index.html` ডাউনলোড করুন
3. KV তে `APP_HTML` আপডেট করুন
4. **Worker কোড পরিবর্তনের দরকার নেই!**

### Worker কোড পরিবর্তনের পর:
1. `DEPLOY-worker.js` আপডেট করুন
2. Worker editor এ পেস্ট করুন
3. Deploy করুন

---

## 📱 Android WebView ইন্টিগ্রেশন

```java
WebView webView = findViewById(R.id.webview);
WebSettings settings = webView.getSettings();
settings.setJavaScriptEnabled(true);
settings.setDomStorageEnabled(true);
settings.setDatabaseEnabled(true);

webView.setWebViewClient(new WebViewClient());
webView.loadUrl("https://your-worker.your-subdomain.workers.dev");
```

---

## 🔒 নিরাপত্তা টিপস

1. **PIN পরিবর্তন করুন** প্রথম লগইনের পর
2. **Master Key গোপন রাখুন**
3. **Telegram Token শেয়ার করবেন না**
4. **নিয়মিত ব্যাকআপ নিন**
5. **HTTPS ব্যবহার করুন** (Cloudflare স্বয়ংক্রিয়)

---

## 📄 লাইসেন্স

এই প্রজেক্টটি ব্যক্তিগত ব্যবহারের জন্য।

---

## 🤝 সাপোর্ট

সমস্যা হলে:
1. Worker Logs চেক করুন
2. Browser Console (F12) দেখুন
3. KV ডেটা চেক করুন

---

## 🎯 ভবিষ্যৎ ফিচার

- [ ] কাস্টমার ম্যানেজমেন্ট
- [ ] পেমেন্ট ট্র্যাকিং
- [ ] Excel এক্সপোর্ট
- [ ] QR কোড জেনারেশন
- [ ] অফলাইন মোড
- [ ] মাল্টি-ল্যাঙ্গুয়েজ

---

**তৈরি করেছেন:** Claude (Anthropic AI)  
**ভার্সন:** 2.0  
**শেষ আপডেট:** 2024