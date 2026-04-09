# 🚀 Apollo Traders - Deployment Guide

## 📁 Files You Need

| File | Purpose |
|------|---------|
| `dist/index.html` | The compiled React app (single HTML file, ~346KB) |
| `DEPLOY-worker.js` | Your Cloudflare Worker code (API + serves HTML from KV) |

---

## 🔧 How to Get `dist/index.html`

### Option A: GitHub Actions (Recommended)

1. Push this entire project to a **GitHub repository**
2. Go to **Actions** tab → the build will run automatically
3. After it finishes (green ✅), click the run → scroll down → download **`index-html`** artifact
4. OR go to **Releases** → download from the latest release

### Option B: From Browser Preview

1. When viewing the preview of this app
2. Press **`Ctrl+U`** (View Source) → **`Ctrl+A`** (Select All) → **`Ctrl+C`** (Copy)
3. That's your `dist/index.html` content

### Option C: Build Locally

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
npm run build
# Output: dist/index.html
```

---

## 📋 Step-by-Step Deployment

### STEP 1: Store HTML in KV

1. Go to **https://dash.cloudflare.com** → Login
2. Left sidebar → **Workers & Pages** → **KV**
3. Click your **DATA_STORE** KV namespace
4. Click **"+ Add entry"**
5. **Key:** `APP_HTML`
6. **Value:** Paste the ENTIRE content of `dist/index.html`
7. Click **Save**

### STEP 2: Update Worker Code

1. Left sidebar → **Workers & Pages**
2. Click your worker (e.g., `appollowtraders-app`)
3. Click **"Edit Code"** button (top right)
4. **Select All (Ctrl+A) → Delete** the old code
5. Open **`DEPLOY-worker.js`**, copy ALL content, paste into editor
6. Click **"Save and Deploy"**

### STEP 3: Verify Bindings

In worker **Settings → Variables and Secrets → Bindings**, make sure these exist:

| Binding Type | Variable Name | Resource |
|---|---|---|
| **KV Namespace** | `DATA_STORE` | Your KV namespace |
| **R2 Bucket** | `DOC_BUCKET` | Your R2 bucket |

### STEP 4: Test

1. Open your worker URL in browser
2. Login with PIN: **`1234`** (default)
3. Test all pages: Banks, Vehicles, Documents, Admin

---

## 🔑 PIN & Master Key (Stored in KV)

PIN and Master Key are now stored in **KV** (not hardcoded):

| KV Key | Default Value | Purpose |
|--------|---------------|---------|
| `APP_PIN` | `1234` | User login PIN |
| `APP_MASTER_KEY` | `698846` | Super Admin access key |

### How to change PIN/Master Key:

**Option A: From Admin Panel (easiest)**
1. Login → Go to Admin (⚙) tab
2. Click "পিন ও মাস্টার কী" section
3. Enter new PIN/Master Key → Click "পরিবর্তন"

**Option B: From Cloudflare KV directly**
1. Go to KV → DATA_STORE namespace
2. Find key `APP_PIN` → edit its value
3. Find key `APP_MASTER_KEY` → edit its value

### First-time setup:
On first load, if `APP_PIN` doesn't exist in KV, it will automatically create:
- `APP_PIN` = `1234`
- `APP_MASTER_KEY` = `698846`

---

## 🔄 How to Update the App Later

1. Make changes to the source code
2. Push to GitHub → GitHub Actions builds new `dist/index.html`
3. Download the new `index.html`
4. Go to KV → update `APP_HTML` value with the new HTML
5. No need to touch worker.js unless API changes

---

## ⚠ Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console (F12). Make sure `APP_HTML` KV entry exists |
| "unauthorized" errors | Login again. Check that PIN is correct in KV |
| Data not loading | Check KV and R2 bindings in worker settings |
| License expired | Access with `?master=YOUR_MASTER_KEY` in URL |
| Telegram spam | Alerts now only send once per day (stored in KV as `LAST_ALERT_DATE`) |

---

## 🏗 Architecture

```
User → Cloudflare Worker
         ├── /api/*     → API logic (KV for data, R2 for files)
         ├── /file?key= → Serve files from R2
         └── /*         → Serve React app HTML from KV (APP_HTML)
```

- **KV** stores: banks, vehicles, documents, settings, PIN, license, alerts
- **R2** stores: uploaded document files, backups
- **React app** is a single HTML file stored in KV
