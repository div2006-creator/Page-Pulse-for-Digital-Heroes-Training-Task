'use client';

import React, { useState } from 'react';
import { AuditReport } from '@/types/audit';
import { Code, Copy, Check, Download } from 'lucide-react';

interface RawJsonViewerProps {
  report: AuditReport;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(report, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedDomain = report.url
      .replace(/^https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `page_pulse_audit_${sanitizedDomain}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="clean-card rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2336] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            Raw JSON Audit Report
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            JSON payload returned by <code className="text-indigo-300 font-mono">/api/audit</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#191d2d] hover:bg-[#252b42] text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-[#252b42]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-indigo-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="bg-[#090a0f] text-indigo-200 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-[#1e2336] max-h-[450px] leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
