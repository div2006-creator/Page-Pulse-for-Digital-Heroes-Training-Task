'use client';

import React, { useState, useEffect } from 'react';
import { UrlForm } from '@/components/UrlForm';
import { AuditDashboard } from '@/components/AuditDashboard';
import { AuditReport, AuditErrorResponse } from '@/types/audit';
import { 
  Activity, 
  AlertCircle, 
  History, 
  Github, 
  Trash2, 
  FileCode2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const RECENT_STORAGE_KEY = 'page_pulse_recent_audits';

export default function Home() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<AuditErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentAudits, setRecentAudits] = useState<AuditReport[]>([]);
  const [showDeploymentGuide, setShowDeploymentGuide] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) {
        setRecentAudits(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToHistory = (newReport: AuditReport) => {
    setRecentAudits((prev) => {
      const filtered = prev.filter((item) => item.url !== newReport.url);
      const updated = [newReport, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentAudits([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json as AuditErrorResponse);
      } else {
        const auditData = json as AuditReport;
        setReport(auditData);
        saveToHistory(auditData);
      }
    } catch (err: unknown) {
      setError({
        error: 'Failed to complete request. Please check your network connection.',
        code: 'FETCH_FAILED',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full border-b border-[#1e2336] bg-[#090a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              Page Pulse
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#191d2d] text-slate-400 font-normal">
                v1.0
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowDeploymentGuide(!showDeploymentGuide)}
              className="px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#191d2d] text-slate-300 border border-[#1e2336] transition-colors flex items-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Deployment Guide</span>
            </button>

            <a
              href="https://github.com/div2006-creator/Page-Pulse-for-Digital-Heroes-Training-Task"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#191d2d] text-slate-300 border border-[#1e2336] transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">GitHub Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-1 w-full">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Web Page Audit Inspector
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Audit any URL to extract HTTP status, response time, title, meta description, H1 tags, missing image alt attributes, and word count.
          </p>
        </div>

        {/* URL Input Form */}
        <UrlForm onAudit={handleAudit} isLoading={isLoading} />

        {/* Deliverables & Deployment Guide Banner */}
        {showDeploymentGuide && (
          <div className="clean-card rounded-xl p-5 border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2336] pb-2.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                Project Deliverables & Deployment Guide
              </h3>
              <button
                onClick={() => setShowDeploymentGuide(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-[#141724] rounded-lg border border-[#1e2336] space-y-1">
                <h4 className="font-medium text-indigo-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  a) Backend Endpoint (`/api/audit`)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  GET/POST endpoint returning HTTP status, response time (ms), page title, meta description, H1 count, missing image alts, and word count.
                </p>
              </div>

              <div className="p-3 bg-[#141724] rounded-lg border border-[#1e2336] space-y-1">
                <h4 className="font-medium text-indigo-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  b) Frontend Interface
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Input validation, audit dashboard, score gauge, metric cards, missing alt table, raw JSON view, and CSV export.
                </p>
              </div>

              <div className="p-3 bg-[#141724] rounded-lg border border-[#1e2336] space-y-1">
                <h4 className="font-medium text-indigo-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  c) Error Handling
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Handles invalid URLs, 10s AbortController timeouts, non-HTML responses (JSON/PDF), and DNS errors without crashing.
                </p>
              </div>

              <div className="p-3 bg-[#141724] rounded-lg border border-[#1e2336] space-y-1">
                <h4 className="font-medium text-indigo-300 text-xs flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  Free Deployment (Vercel / Netlify)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Push repository to GitHub and connect to Vercel/Netlify for instant 1-click deployment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="max-w-2xl mx-auto clean-card rounded-xl p-4 border-l-4 border-l-rose-500 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-rose-300">
                    Audit Error: {error.code}
                  </h3>
                  {error.status && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-semibold">
                      HTTP {error.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 mt-1">{error.error}</p>
                {error.details && (
                  <p className="text-[11px] text-slate-400 mt-2 font-mono bg-[#090a0f] p-2 rounded border border-[#1e2336]">
                    Details: {error.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audit Dashboard */}
        {report && <AuditDashboard report={report} />}

        {/* Recent Audit History */}
        {recentAudits.length > 0 && (
          <div className="max-w-5xl mx-auto clean-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2336] pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-semibold text-white">Recent Audits</h3>
              </div>
              <button
                onClick={clearHistory}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Clear recent history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {recentAudits.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setReport(item);
                    setError(null);
                  }}
                  className="p-2.5 bg-[#141724] hover:bg-[#191d2d] rounded-lg border border-[#1e2336] text-left transition-all group flex flex-col justify-between space-y-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                    <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${
                      item.healthScore >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.healthScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.status} OK</span>
                    <span>{item.responseTime} ms</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1e2336] bg-[#090a0f] py-5">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-400 space-y-1.5">
          <p className="font-medium text-slate-300">
            <a 
              href="https://digitalheroesco.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-500/40"
            >
              Built for Digital Heroes Training Task
            </a>
          </p>
          <p className="text-[11px] text-slate-500">
            Page Pulse — Web Page Audit Inspector
          </p>
        </div>
      </footer>
    </div>
  );
}
