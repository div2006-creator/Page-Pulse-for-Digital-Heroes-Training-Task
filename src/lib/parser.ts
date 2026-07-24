import * as cheerio from 'cheerio';
import { AuditReport, ImageAltDetails, ScoreBreakdown } from '@/types/audit';

/**
 * Parses raw HTML string and extracts key SEO, structural, accessibility, and quality metrics.
 * 
 * Features:
 * - Page title & length audit
 * - Meta description extraction (supports meta name description, og:description, twitter:description)
 * - H1 heading tag count and list extraction
 * - Image accessibility audit (total images, missing alt attribute count, relative URL resolution)
 * - Visible body text approximate word count calculation
 * - OpenGraph & canonical metadata inspection
 * - Health score rating calculation (0-100 pts)
 * 
 * Edge Case Resilience:
 * - Handles empty or malformed HTML strings without throwing exceptions.
 * - Safely returns fallback nulls / empty arrays for missing tags.
 * 
 * @param html Raw HTML response body text
 * @param targetUrl Original requested URL
 * @param finalUrl Final redirected URL after fetch
 * @param status HTTP response status code
 * @param statusText HTTP response status text
 * @param responseTime Network response time in milliseconds
 * @param contentType Content-Type header string
 * @returns AuditReport Structured audit report payload
 */
export function parseHtmlReport(
  html: string,
  targetUrl: string,
  finalUrl: string,
  status: number,
  statusText: string,
  responseTime: number,
  contentType: string
): AuditReport {
  const $ = cheerio.load(html);

  // 1. Page Title
  const titleRaw = $('title').first().text().trim();
  const title = titleRaw.length > 0 ? titleRaw : null;

  // 2. Meta Description
  const metaDescRaw = 
    $('meta[name="description" i]').attr('content')?.trim() ||
    $('meta[property="og:description" i]').attr('content')?.trim() ||
    $('meta[name="twitter:description" i]').attr('content')?.trim();
  const metaDescription = metaDescRaw && metaDescRaw.length > 0 ? metaDescRaw : null;

  // 3. H1 Headings
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1List: string[] = [];
  h1Elements.each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) {
      h1List.push(txt);
    }
  });

  // 4. Images & Alt Text Audit
  const imgElements = $('img');
  const totalImages = imgElements.length;
  const missingAltImages: ImageAltDetails[] = [];

  imgElements.each((_, el) => {
    const rawSrc = $(el).attr('src') || $(el).attr('data-src') || '[no src attribute]';
    const altAttr = $(el).attr('alt');
    const isMissing = altAttr === undefined || altAttr === null || altAttr.trim() === '';

    let absoluteSrc = rawSrc;
    if (rawSrc && !rawSrc.startsWith('http://') && !rawSrc.startsWith('https://') && !rawSrc.startsWith('data:')) {
      try {
        absoluteSrc = new URL(rawSrc, finalUrl).href;
      } catch {
        absoluteSrc = rawSrc;
      }
    }

    if (isMissing) {
      const outerHtml = $(el).toString();
      const snippet = outerHtml.length > 120 ? outerHtml.slice(0, 120) + '...' : outerHtml;
      
      missingAltImages.push({
        src: absoluteSrc,
        alt: altAttr ?? null,
        isMissing: true,
        snippet
      });
    }
  });

  const imagesMissingAltCount = missingAltImages.length;

  // 5. Word Count (Removes non-visible script, style, head, nav, footer tags)
  const cloneDoc = cheerio.load(html);
  cloneDoc('script, style, noscript, svg, iframe, head, nav, footer').remove();
  const bodyText = cloneDoc('body').text() || cloneDoc.text();
  const words = bodyText
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0 && !/^[^a-zA-Z0-9]+$/.test(w));
  const approximateWordCount = words.length;

  // 6. Open Graph & Canonical Tags
  const ogTitle = $('meta[property="og:title" i]').attr('content')?.trim() || null;
  const ogDescription = $('meta[property="og:description" i]').attr('content')?.trim() || null;
  const ogImageRaw = $('meta[property="og:image" i]').attr('content')?.trim() || null;
  
  let ogImage: string | null = null;
  if (ogImageRaw) {
    try {
      ogImage = new URL(ogImageRaw, finalUrl).href;
    } catch {
      ogImage = ogImageRaw;
    }
  }

  const canonicalRaw = $('link[rel="canonical" i]').attr('href')?.trim() || null;
  let canonicalUrl: string | null = null;
  if (canonicalRaw) {
    try {
      canonicalUrl = new URL(canonicalRaw, finalUrl).href;
    } catch {
      canonicalUrl = canonicalRaw;
    }
  }

  const hasHttps = finalUrl.startsWith('https://');

  // 7. Health Score Calculation (Max 100 Points)
  let titleScore = 0;
  if (title) {
    titleScore = (title.length >= 10 && title.length <= 70) ? 20 : 12;
  }

  let metaScore = 0;
  if (metaDescription) {
    metaScore = (metaDescription.length >= 50 && metaDescription.length <= 160) ? 20 : 12;
  }

  let h1Score = 0;
  if (h1Count === 1) {
    h1Score = 20;
  } else if (h1Count > 1) {
    h1Score = 10;
  }

  let altScore = 20;
  if (totalImages > 0) {
    const altRatio = (totalImages - imagesMissingAltCount) / totalImages;
    altScore = Math.round(altRatio * 20);
  }

  const httpsScore = hasHttps ? 20 : 0;

  const scoreBreakdown: ScoreBreakdown = {
    titleScore,
    metaScore,
    h1Score,
    altScore,
    httpsScore,
  };

  const healthScore = titleScore + metaScore + h1Score + altScore + httpsScore;

  return {
    url: targetUrl,
    finalUrl,
    status,
    statusText,
    responseTime,
    contentType,
    isHtml: true,
    title,
    metaDescription,
    h1Count,
    h1List,
    totalImages,
    imagesMissingAltCount,
    missingAltImages,
    approximateWordCount,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    hasHttps,
    healthScore,
    scoreBreakdown,
    auditedAt: new Date().toISOString(),
  };
}
