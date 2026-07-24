import { describe, it, expect } from 'vitest';
import { parseHtmlReport } from './parser';

describe('parseHtmlReport Unit Tests', () => {
  const mockTargetUrl = 'https://digitalheroesco.com';
  const mockFinalUrl = 'https://digitalheroesco.com/';
  const mockStatus = 200;
  const mockStatusText = 'OK';
  const mockResponseTime = 250;
  const mockContentType = 'text/html; charset=utf-8';

  describe('Happy Path', () => {
    it('should correctly parse valid HTML with title, meta description, H1, images, and word count', () => {
      const validHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Digital Heroes - Web Development & SEO Training</title>
          <meta name="description" content="Master full-stack web development and technical audits with Digital Heroes courses." />
          <meta property="og:title" content="Digital Heroes OG Title" />
          <link rel="canonical" href="https://digitalheroesco.com/" />
        </head>
        <body>
          <h1>Digital Heroes Web Audit Platform</h1>
          <p>Welcome to Page Pulse. This tool allows users to inspect web page architecture, SEO status codes, and accessibility compliance quickly.</p>
          <img src="/assets/logo.png" alt="Digital Heroes Brand Logo" />
          <img src="/assets/banner.jpg" alt="" />
          <img src="/assets/icon.svg" />
        </body>
        </html>
      `;

      const report = parseHtmlReport(
        validHtml,
        mockTargetUrl,
        mockFinalUrl,
        mockStatus,
        mockStatusText,
        mockResponseTime,
        mockContentType
      );

      // Verify Page Title
      expect(report.title).toBe('Digital Heroes - Web Development & SEO Training');

      // Verify Meta Description
      expect(report.metaDescription).toBe(
        'Master full-stack web development and technical audits with Digital Heroes courses.'
      );

      // Verify H1 Tags
      expect(report.h1Count).toBe(1);
      expect(report.h1List).toEqual(['Digital Heroes Web Audit Platform']);

      // Verify Image Alt Text Audit
      expect(report.totalImages).toBe(3);
      expect(report.imagesMissingAltCount).toBe(2);
      expect(report.missingAltImages.length).toBe(2);
      expect(report.missingAltImages[0].src).toBe('https://digitalheroesco.com/assets/banner.jpg');
      expect(report.missingAltImages[1].src).toBe('https://digitalheroesco.com/assets/icon.svg');

      // Verify Word Count
      expect(report.approximateWordCount).toBeGreaterThan(10);

      // Verify Health Score Calculation
      expect(report.healthScore).toBeGreaterThan(0);
      expect(report.hasHttps).toBe(true);
      expect(report.scoreBreakdown.titleScore).toBe(20);
      expect(report.scoreBreakdown.metaScore).toBe(20);
      expect(report.scoreBreakdown.h1Score).toBe(20);
      expect(report.scoreBreakdown.httpsScore).toBe(20);
    });
  });

  describe('Failure Case 1: Missing Metadata Tags', () => {
    it('should handle HTML missing title, meta description, and H1 tags without throwing exceptions', () => {
      const htmlWithoutMetadata = `
        <!DOCTYPE html>
        <html>
        <head></head>
        <body>
          <h2>Subheading Only</h2>
          <p>Page without main title or description.</p>
        </body>
        </html>
      `;

      expect(() => {
        const report = parseHtmlReport(
          htmlWithoutMetadata,
          mockTargetUrl,
          mockFinalUrl,
          mockStatus,
          mockStatusText,
          mockResponseTime,
          mockContentType
        );

        expect(report.title).toBeNull();
        expect(report.metaDescription).toBeNull();
        expect(report.h1Count).toBe(0);
        expect(report.h1List).toEqual([]);
        expect(report.scoreBreakdown.titleScore).toBe(0);
        expect(report.scoreBreakdown.metaScore).toBe(0);
        expect(report.scoreBreakdown.h1Score).toBe(0);
      }).not.toThrow();
    });
  });

  describe('Failure Case 2: Empty HTML', () => {
    it('should return sensible default metrics for an empty HTML string without crashing', () => {
      const emptyHtml = '';

      expect(() => {
        const report = parseHtmlReport(
          emptyHtml,
          mockTargetUrl,
          mockFinalUrl,
          mockStatus,
          mockStatusText,
          mockResponseTime,
          mockContentType
        );

        expect(report.title).toBeNull();
        expect(report.metaDescription).toBeNull();
        expect(report.h1Count).toBe(0);
        expect(report.h1List).toEqual([]);
        expect(report.totalImages).toBe(0);
        expect(report.imagesMissingAltCount).toBe(0);
        expect(report.missingAltImages).toEqual([]);
        expect(report.approximateWordCount).toBe(0);
        expect(report.healthScore).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Additional Edge Cases', () => {
    it('should parse malformed or unclosed HTML tags without throwing', () => {
      const malformedHtml = `
        <html>
        <head><title>Page Title</title></head>
        <body>
        <h1>Unclosed Heading 1
        <img src="test.jpg"
        <p>Text body content here
      `;

      expect(() => {
        const report = parseHtmlReport(
          malformedHtml,
          mockTargetUrl,
          mockFinalUrl,
          mockStatus,
          mockStatusText,
          mockResponseTime,
          mockContentType
        );

        expect(report.h1Count).toBeGreaterThanOrEqual(1);
        expect(report.isHtml).toBe(true);
      }).not.toThrow();
    });

    it('should return full alt score (20 pts) when a page has zero images', () => {
      const noImageHtml = `
        <html>
          <head><title>Page Without Images</title></head>
          <body><h1>Heading</h1><p>Some text content</p></body>
        </html>
      `;

      const report = parseHtmlReport(
        noImageHtml,
        mockTargetUrl,
        mockFinalUrl,
        mockStatus,
        mockStatusText,
        mockResponseTime,
        mockContentType
      );

      expect(report.totalImages).toBe(0);
      expect(report.imagesMissingAltCount).toBe(0);
      expect(report.scoreBreakdown.altScore).toBe(20);
    });

    it('should return full alt score (20 pts) when all images have non-empty alt attributes', () => {
      const allAltsHtml = `
        <html>
          <body>
            <img src="/img1.png" alt="First image description" />
            <img src="/img2.png" alt="Second image description" />
          </body>
        </html>
      `;

      const report = parseHtmlReport(
        allAltsHtml,
        mockTargetUrl,
        mockFinalUrl,
        mockStatus,
        mockStatusText,
        mockResponseTime,
        mockContentType
      );

      expect(report.totalImages).toBe(2);
      expect(report.imagesMissingAltCount).toBe(0);
      expect(report.missingAltImages).toEqual([]);
      expect(report.scoreBreakdown.altScore).toBe(20);
    });

    it('should resolve relative image src URLs against the final target URL', () => {
      const relativeImgHtml = `
        <html>
          <body>
            <img src="subfolder/image.png" alt="" />
          </body>
        </html>
      `;

      const report = parseHtmlReport(
        relativeImgHtml,
        mockTargetUrl,
        'https://digitalheroesco.com/docs/',
        mockStatus,
        mockStatusText,
        mockResponseTime,
        mockContentType
      );

      expect(report.missingAltImages[0].src).toBe('https://digitalheroesco.com/docs/subfolder/image.png');
    });
  });
});
