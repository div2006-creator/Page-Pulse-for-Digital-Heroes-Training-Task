# ⚡ Page Pulse — Web URL Audit Tool

> A web auditing tool built to inspect web pages, evaluate SEO & accessibility metrics, and output structured JSON reports.

![Page Pulse Banner](https://img.shields.sh/badge/Page_Pulse-v1.0-cyan?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## 🌟 Deliverables & Requirements Checklist

- [x] **Backend API Endpoint (`/api/audit`)**: Accepts any URL (via POST body or GET query param), fetches the page, and calculates:
  - **HTTP Status Code** (e.g. `200 OK`, `404 Not Found`)
  - **Response Time** (elapsed milliseconds)
  - **Page Title** (`<title>` tag text & length check)
  - **Meta Description** (`<meta name="description">` content & status)
  - **H1 Heading Count & List** (Count of `<h1>` tags and text snippets)
  - **Images Missing Alt Text** (Total `<img>` tags, missing count, and image source breakdown)
  - **Approximate Word Count** (Scanned text body word count)
  - **Overall Health Score** (Calculates a 0-100 rating across SEO, alt text, and HTTPS security)
- [x] **Frontend UI**:
  - Input field with real-time validation and sample preset buttons (`https://example.com`, `https://en.wikipedia.org`, `https://github.com`, etc.).
  - Visual Health Score gauge (A+/A/B/C/F grade rating).
  - Metric cards grid with status badges (Pass / Warning / Issue).
  - Image alt text audit visual table with source links and HTML snippets.
  - Interactive Raw JSON viewer with 1-click Copy & Download (`.json`).
  - Export CSV report feature for spreadsheet analysis.
  - Recent audit history cached in `localStorage`.
- [x] **Footer Credit Line**: Visible credit in footer reading `"Built for Digital Heroes Training Task"` linked to [digitalheroesco.com](https://digitalheroesco.com).
- [x] **Graceful Error Handling**:
  - Handles invalid URLs, malformed schemes (`ftp://`, missing domain).
  - Handles request timeouts gracefully (10s limit using `AbortController`).
  - Detects non-HTML responses (e.g. `application/json`, `application/pdf`, images) without crashing.
  - Handles DNS failures and unreachable hosts with clean error messages.

---

## 🛠️ Stack & Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Node.js runtime)
- **Language**: TypeScript
- **HTML Parser**: [Cheerio](https://cheerio.js.org/)
- **Styling**: Tailwind CSS & Lucide Icons
- **HTTP Engine**: Native `fetch` with `AbortController` timeout

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
Ensure Node.js `v18.0.0` or higher is installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoint Reference

### `POST /api/audit`
**Request Body**:
```json
{
  "url": "https://example.com"
}
```

### `GET /api/audit?url=https://example.com`

#### Sample Success Response (`200 OK`)
```json
{
  "url": "https://example.com",
  "finalUrl": "https://example.com/",
  "status": 200,
  "statusText": "OK",
  "responseTime": 184,
  "contentType": "text/html; charset=UTF-8",
  "isHtml": true,
  "title": "Example Domain",
  "metaDescription": null,
  "h1Count": 1,
  "h1List": [
    "Example Domain"
  ],
  "totalImages": 0,
  "imagesMissingAltCount": 0,
  "missingAltImages": [],
  "approximateWordCount": 42,
  "ogTitle": null,
  "ogDescription": null,
  "ogImage": null,
  "canonicalUrl": null,
  "hasHttps": true,
  "healthScore": 72,
  "scoreBreakdown": {
    "titleScore": 20,
    "metaScore": 0,
    "h1Score": 20,
    "altScore": 20,
    "httpsScore": 20
  },
  "auditedAt": "2026-07-24T10:00:00.000Z"
}
```

#### Sample Error Response (`422 Unprocessable Entity` - Non-HTML)
```json
{
  "error": "Target URL returned a non-HTML response (application/json).",
  "code": "NON_HTML",
  "status": 200,
  "details": "Page Pulse can only audit HTML documents."
}
```

---

## 📤 Public GitHub Repo & Live Deployment Steps

### Step 1: Push to GitHub Repo
```bash
git init
git add .
git commit -m "Initial commit: Page Pulse URL Audit Tool"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/page-pulse.git
git push -u origin main
```

### Step 2: Live Deployment on Vercel (Free Tier)
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select your pushed `page-pulse` repository from GitHub.
4. Click **Deploy** (No environment variables required).
5. Your live deployed link will be ready in ~1 minute (e.g. `https://page-pulse.vercel.app`).

---

## 📜 License
MIT License. Built for URL auditing tasks.
