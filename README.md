# ⚡ Page Pulse — Web URL Audit & Health Inspector

> A web auditing tool that fetches any web page URL, evaluates key SEO, accessibility, performance, and structure metrics, and returns structured JSON reports paired with a modern UI.


![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-1.6-green?style=for-the-badge&logo=vitest)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## # Project Overview

**Page Pulse** is designed to audit any public web page URL on demand. It provides developers, SEO specialists, and technical auditors with instant insights into page health. The core engine inspects HTTP response status, server roundtrip response time, page title validity, meta description quality, `<h1>` heading tag structure, images missing `alt` text attributes, and approximate visible word count.

---

## # Features

- 🎯 **Comprehensive Backend Endpoint (`/api/audit`)**: Accepts target URLs via `POST` or `GET`, fetching the page safely and returning detailed metrics.
- 📊 **Health Score Engine**: Calculates an overall quality score (0–100 pts) based on title length, meta description quality, `<h1>` tag structure, alt text ratio, and HTTPS security.
- 🛡️ **Resilient Error Handling**: Never crashes. Gracefully catches invalid URL formatting, request timeouts (10s ceiling via `AbortController`), non-HTML responses (e.g. JSON, PDF, images), and DNS/network failures.
- 🎨 **Modern Handcrafted UI**: Sleek dark-mode interface featuring metric cards, interactive alt text inspection table, raw JSON viewer with 1-click copy/download, CSV report export, and recent audit history.
- 🧪 **Automated Test Suite**: Unit tests built with **Vitest** covering happy paths, missing tags, empty HTML payloads, malformed markup, and URL resolution.

---

## # Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript (`v5.6`)
- **HTML Parsing Engine**: [Cheerio](https://cheerio.js.org/) (`v1.0.0-rc.12`)
- **Testing Framework**: [Vitest](https://vitest.dev/) (`v1.6`)
- **Styling**: Tailwind CSS & Lucide Icons

---

## # Folder Structure

```text
c:\Users\hp\OneDrive\Desktop\Digital Heros\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── audit/
│   │   │       └── route.ts          # API Endpoint (POST & GET handlers)
│   │   ├── globals.css                # Handcrafted theme styles & design tokens
│   │   ├── layout.tsx                 # Root layout & font configurations
│   │   └── page.tsx                   # Main Page Pulse application UI
│   ├── components/
│   │   ├── AuditDashboard.tsx         # Tabbed results dashboard
│   │   ├── ImageAltTable.tsx          # Missing alt text audit table
│   │   ├── MetricCard.tsx             # Reusable stat card with status badges
│   │   ├── RawJsonViewer.tsx          # Syntax-highlighted JSON viewer & download
│   │   ├── ScoreGauge.tsx             # Circular health score gauge & grade badge
│   │   └── UrlForm.tsx                # URL search input form
│   ├── lib/
│   │   ├── parser.ts                  # Core HTML parser & metric calculation engine
│   │   └── parser.test.ts             # Vitest unit test suite
│   └── types/
│       └── audit.ts                   # TypeScript interfaces & response schemas
├── README.md                          # Project documentation & deliverables
├── package.json                       # Dependencies & scripts
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript compiler configuration
└── vitest.config.ts                   # Vitest configuration & path aliases
```

---

## # Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/div2006-creator/Page-Pulse-for-Digital-Heroes-Training-Task.git
   cd Page-Pulse-for-Digital-Heroes-Training-Task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## # Running Locally

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm run start
```

---

## # Environment Variables

No external API keys or secret environment variables are required. Page Pulse operates using standard server-side Node.js fetch mechanisms.

---

## # API Documentation

### Endpoint: `POST /api/audit`

Accepts a target URL in the request body and returns the audit report.

#### Example Request
```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Example Response (`200 OK`)
```json
{
  "url": "https://example.com/",
  "finalUrl": "https://example.com/",
  "status": 200,
  "statusText": "OK",
  "responseTime": 240,
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
  "healthScore": 80,
  "scoreBreakdown": {
    "titleScore": 20,
    "metaScore": 0,
    "h1Score": 20,
    "altScore": 20,
    "httpsScore": 20
  },
  "auditedAt": "2026-07-24T17:00:00.000Z"
}
```

### Error Responses

#### 1. Invalid URL (`400 Bad Request`)
```json
{
  "error": "Invalid URL provided. Please provide a valid web address (e.g., https://example.com).",
  "code": "INVALID_URL",
  "details": "Input received: \"not-a-valid-url\""
}
```

#### 2. Request Timeout (`504 Gateway Timeout`)
```json
{
  "error": "Request timed out after 10 seconds while connecting to the URL.",
  "code": "TIMEOUT",
  "details": "The target server took too long to respond."
}
```

#### 3. Non-HTML Target (`422 Unprocessable Entity`)
```json
{
  "error": "Target URL returned a non-HTML response (application/json).",
  "code": "NON_HTML",
  "status": 200,
  "details": "Page Pulse can only audit HTML documents."
}
```

---

## # Design Decisions

### 1. Decoupled Parser Architecture (`src/lib/parser.ts`)
**Reasoning**: The HTML parsing logic is completely isolated from Next.js route handlers (`src/app/api/audit/route.ts`). This modular design allows the parser to be unit-tested in complete isolation with fast execution times (sub-50ms), and allows it to be reused across different worker scripts or CLI utilities without HTTP dependencies.

### 2. Server-Side Static Parsing with Cheerio over Headless Browsers
**Reasoning**: Using Cheerio rather than Playwright/Puppeteer allows Page Pulse to parse HTML documents in milliseconds with minimal CPU and RAM usage. Serverless platforms (e.g., Vercel) have strict memory limits and execution timeouts; Cheerio avoids spawning heavy Chromium instances while fulfilling all static HTML audit requirements.

### 3. Resilient Fetch Ceiling via AbortController (10-Second Timeout)
**Reasoning**: Web scraping can hang indefinitely if a target server is unresponsive or misconfigured. Utilizing native Node.js `AbortController` with a 10,000ms timeout prevents serverless function invocations from hanging, saving resource costs and ensuring the user receives a prompt, sensible error message (`504 TIMEOUT`) rather than a silent failure or gateway crash.

---

## # Future Improvements

1. **Playwright / Headless Browser Mode**: Add an optional headless browser renderer mode to audit single-page client-rendered applications (SPAs) built with React/Vue that populate text via JavaScript execution.
2. **Google Lighthouse Integration**: Incorporate Lighthouse performance scores, Core Web Vitals (LCP, CLS, FID), and real device network emulation.
3. **Redis / LRU Response Caching**: Add a Redis caching layer to store audit reports for frequently checked URLs to reduce redundant outbound requests and rate limits.
4. **User Authentication & Historical Dashboard**: Allow users to log in, save target websites, monitor score history over time, and receive email alerts when audit scores drop.
5. **PDF Report Export**: Generate downloadable, branded PDF audit executive summaries for agency client handoffs.

---

## # Live Demo

- **Live Deployed App**: [https://page-pulse-for-digital-heroes-train.vercel.app/](https://page-pulse-for-digital-heroes-train.vercel.app/)

**Loom video**: https://www.loom.com/share/d0802eff35744ac49cf523191e061f19

---

## Self Critique

> *"If you had another day, what would you improve?"*

If I had another day, I would focus on three improvements:

1. **Support JavaScript-rendered websites** by integrating Playwright as a fallback for pages that rely on client-side rendering.
2. **Add rate limiting and caching** to improve performance, reduce repeated requests, and protect the API from abuse.
3. **Implement multi-page crawling** to audit entire websites, including internal links and broken link detection, instead of analyzing a single page.
