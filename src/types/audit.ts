export interface ImageAltDetails {
  src: string;
  alt: string | null;
  isMissing: boolean;
  snippet?: string;
}

export interface ScoreBreakdown {
  titleScore: number;       // max 20
  metaScore: number;        // max 20
  h1Score: number;          // max 20
  altScore: number;         // max 20
  httpsScore: number;       // max 20
}

export interface AuditReport {
  url: string;
  finalUrl: string;
  status: number;
  statusText: string;
  responseTime: number;     // in milliseconds
  contentType: string;
  isHtml: boolean;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  h1List: string[];
  totalImages: number;
  imagesMissingAltCount: number;
  missingAltImages: ImageAltDetails[];
  approximateWordCount: number;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  hasHttps: boolean;
  healthScore: number;      // 0 to 100
  scoreBreakdown: ScoreBreakdown;
  auditedAt: string;
}

export type AuditErrorCode = 
  | 'INVALID_URL' 
  | 'TIMEOUT' 
  | 'NON_HTML' 
  | 'FETCH_FAILED' 
  | 'SERVER_ERROR';

export interface AuditErrorResponse {
  error: string;
  code: AuditErrorCode;
  status?: number;
  details?: string;
  partialReport?: Partial<AuditReport>;
}
