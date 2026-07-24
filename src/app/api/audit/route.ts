import { NextRequest, NextResponse } from 'next/server';
import { parseHtmlReport } from '@/lib/parser';
import { AuditErrorResponse } from '@/types/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validateAndNormalizeUrl(rawUrl: string): string | null {
  let urlString = rawUrl.trim();
  if (!urlString) return null;

  // Prepend https:// if no protocol is specified
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

async function auditUrl(rawUrl: string): Promise<{ data?: ReturnType<typeof parseHtmlReport>; errorResponse?: { status: number; body: AuditErrorResponse } }> {
  const validUrl = validateAndNormalizeUrl(rawUrl);

  if (!validUrl) {
    return {
      errorResponse: {
        status: 400,
        body: {
          error: 'Invalid URL provided. Please provide a valid web address (e.g., https://example.com).',
          code: 'INVALID_URL',
          details: `Input received: "${rawUrl}"`
        }
      }
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
  const startTime = Date.now();

  try {
    const response = await fetch(validUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PagePulse/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || 'unknown';

    // Verify if content is HTML
    const isHtmlContent = contentType.toLowerCase().includes('text/html') || 
                          contentType.toLowerCase().includes('application/xhtml+xml');

    const htmlText = await response.text();

    if (!isHtmlContent) {
      return {
        errorResponse: {
          status: 422,
          body: {
            error: `Target URL returned a non-HTML response (${contentType}).`,
            code: 'NON_HTML',
            status: response.status,
            details: `Page Pulse can only audit HTML documents. Content length: ${htmlText.length} bytes.`
          }
        }
      };
    }

    const report = parseHtmlReport(
      htmlText,
      validUrl,
      response.url || validUrl,
      response.status,
      response.statusText || 'OK',
      responseTime,
      contentType
    );

    return { data: report };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          errorResponse: {
            status: 504,
            body: {
              error: 'Request timed out after 10 seconds while connecting to the URL.',
              code: 'TIMEOUT',
              details: 'The target server took too long to respond.'
            }
          }
        };
      }

      return {
        errorResponse: {
          status: 502,
          body: {
            error: `Failed to connect to ${validUrl}. Network or DNS error.`,
            code: 'FETCH_FAILED',
            details: err.message
          }
        }
      };
    }

    return {
      errorResponse: {
        status: 500,
        body: {
          error: 'An unexpected internal error occurred while auditing the URL.',
          code: 'SERVER_ERROR'
        }
      }
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== 'string') {
      return NextResponse.json<AuditErrorResponse>(
        {
          error: 'Missing required "url" parameter in request body.',
          code: 'INVALID_URL'
        },
        { status: 400 }
      );
    }

    const result = await auditUrl(url);

    if (result.errorResponse) {
      return NextResponse.json(result.errorResponse.body, { status: result.errorResponse.status });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch {
    return NextResponse.json<AuditErrorResponse>(
      {
        error: 'Malformed JSON payload in request.',
        code: 'INVALID_URL'
      },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json<AuditErrorResponse>(
      {
        error: 'Missing required "url" query parameter. Example: /api/audit?url=https://example.com',
        code: 'INVALID_URL'
      },
      { status: 400 }
    );
  }

  const result = await auditUrl(url);

  if (result.errorResponse) {
    return NextResponse.json(result.errorResponse.body, { status: result.errorResponse.status });
  }

  return NextResponse.json(result.data, { status: 200 });
}
