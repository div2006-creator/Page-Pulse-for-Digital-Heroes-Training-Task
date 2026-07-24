'use client';

import React, { useState } from 'react';
import { AuditReport } from '@/types/audit';
import { ScoreGauge } from './ScoreGauge';
import { MetricCard } from './MetricCard';
import { ImageAltTable } from './ImageAltTable';
import { RawJsonViewer } from './RawJsonViewer';
import { 
  LayoutDashboard, 
  Heading, 
  Image as ImageIcon, 
  Code, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Globe, 
  FileText, 
  Tag, 
  Download, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AuditDashboardProps {
  report: AuditReport;
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'images' | 'json'>('overview');

  const exportCsv = () => {
    const csvRows = [
      ['Metric', 'Value', 'Details'],
      ['Target URL', report.url, ''],
      ['Final Redirected URL', report.finalUrl, ''],
      ['HTTP Status', `${report.status} ${report.statusText}`, ''],
      ['Response Time (ms)', `${report.responseTime}`, 'ms'],
      ['Health Score', `${report.healthScore}/100`, ''],
      ['Page Title', report.title || 'MISSING', report.title ? `${report.title.length} chars` : ''],
      ['Meta Description', report.metaDescription || 'MISSING', report.metaDescription ? `${report.metaDescription.length} chars` : ''],
      ['H1 Headings Count', `${report.h1Count}`, report.h1List.join(' | ')],
      ['Total Images', `${report.totalImages}`, ''],
      ['Images Missing Alt', `${report.imagesMissingAltCount}`, ''],
      ['Approx Word Count', `${report.approximateWordCount}`, 'words'],
      ['HTTPS Enabled', report.hasHttps ? 'Yes' : 'No', ''],
      ['Canonical URL', report.canonicalUrl || 'Not specified', ''],
      ['Audited At', report.auditedAt, '']
    ];

    const csvContent = csvRows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedDomain = report.url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `page_pulse_${sanitizedDomain}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusMetricState = report.status >= 200 && report.status < 300 ? 'pass' : 'warning';
  const responseTimeState = report.responseTime < 1500 ? 'pass' : report.responseTime < 3500 ? 'warning' : 'fail';
  const titleState = report.title ? (report.title.length >= 10 && report.title.length <= 70 ? 'pass' : 'warning') : 'fail';
  const metaState = report.metaDescription ? (report.metaDescription.length >= 50 && report.metaDescription.length <= 160 ? 'pass' : 'warning') : 'fail';
  const h1State = report.h1Count === 1 ? 'pass' : report.h1Count > 1 ? 'warning' : 'fail';
  const altState = report.imagesMissingAltCount === 0 ? 'pass' : 'fail';
  const wordCountState = report.approximateWordCount >= 300 ? 'pass' : report.approximateWordCount >= 100 ? 'warning' : 'info';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="clean-card rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Target Web Page</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="truncate max-w-lg">{report.url}</span>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              title="Open URL in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Audited: {new Date(report.auditedAt).toLocaleString()}</span>
            <span>•</span>
            <span className="font-mono text-slate-400">{report.finalUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg bg-[#191d2d] hover:bg-[#252b42] text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5 border border-[#252b42]"
            title="Export audit as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-[#090a0f] border border-[#1e2336] text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{report.responseTime} ms</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#1e2336] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#141724]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'structure'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#141724]'
          }`}
        >
          <Heading className="w-3.5 h-3.5" />
          <span>SEO & Headings</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#191d2d] text-slate-300">
            {report.h1Count}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'images'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#141724]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image Alt Audit</span>
          {report.imagesMissingAltCount > 0 ? (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
              {report.imagesMissingAltCount}
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              Pass
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'json'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#141724]'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Raw JSON</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <ScoreGauge score={report.healthScore} breakdown={report.scoreBreakdown} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <MetricCard
              title="HTTP Status"
              value={`${report.status} ${report.statusText}`}
              status={statusMetricState}
              badgeText={report.status === 200 ? '200 OK' : `HTTP ${report.status}`}
              subtitle={`Content-Type: ${report.contentType.split(';')[0]}`}
              icon={CheckCircle2}
            />

            <MetricCard
              title="Response Time"
              value={`${report.responseTime} ms`}
              status={responseTimeState}
              badgeText={report.responseTime < 1500 ? 'Fast' : 'Slow'}
              subtitle="Server response duration"
              icon={Clock}
            />

            <MetricCard
              title="Page Title"
              value={report.title || 'Missing <title> Tag'}
              status={titleState}
              badgeText={report.title ? `${report.title.length} chars` : 'Missing'}
              subtitle={report.title ? 'HTML <title> tag' : 'Missing title tag'}
              icon={FileText}
              copyableText={report.title || ''}
            />

            <MetricCard
              title="Meta Description"
              value={report.metaDescription || 'Missing Meta Description'}
              status={metaState}
              badgeText={report.metaDescription ? `${report.metaDescription.length} chars` : 'Missing'}
              subtitle={report.metaDescription ? 'Snippet description' : 'Add meta description tag'}
              icon={Tag}
              copyableText={report.metaDescription || ''}
            />

            <MetricCard
              title="H1 Headings"
              value={`${report.h1Count} Tag${report.h1Count === 1 ? '' : 's'}`}
              status={h1State}
              badgeText={report.h1Count === 1 ? 'Optimal (1 H1)' : report.h1Count === 0 ? 'No H1' : 'Multiple H1s'}
              subtitle={report.h1List[0] ? `H1: "${report.h1List[0].slice(0, 35)}..."` : 'No H1 tags found'}
              icon={Heading}
            />

            <MetricCard
              title="Images Missing Alt"
              value={`${report.imagesMissingAltCount} / ${report.totalImages}`}
              status={altState}
              badgeText={report.imagesMissingAltCount === 0 ? 'Passed' : `${report.imagesMissingAltCount} Missing`}
              subtitle={`${report.totalImages} <img> tags scanned`}
              icon={ImageIcon}
            />

            <MetricCard
              title="Approx Word Count"
              value={`${report.approximateWordCount.toLocaleString()} words`}
              status={wordCountState}
              badgeText={`${report.approximateWordCount > 300 ? 'Rich Text' : 'Low Word Count'}`}
              subtitle="Scanned text body"
              icon={FileText}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Structure */}
      {activeTab === 'structure' && (
        <div className="clean-card rounded-xl p-5 space-y-4">
          <div className="border-b border-[#1e2336] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Heading className="w-4 h-4 text-indigo-400" />
              Page Structure & Social Metadata
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              H1 heading tag hierarchy, OpenGraph social cards, canonical URL, and security protocol
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141724] rounded-lg p-4 border border-[#1e2336] space-y-2.5">
              <h4 className="text-xs font-medium text-slate-200 flex items-center justify-between">
                <span>H1 Heading Tags ({report.h1Count})</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  report.h1Count === 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {report.h1Count === 1 ? 'Optimal' : 'Review'}
                </span>
              </h4>

              {report.h1List.length > 0 ? (
                <ul className="space-y-1.5 text-xs font-mono">
                  {report.h1List.map((h1, index) => (
                    <li key={index} className="p-2 bg-[#090a0f] rounded border border-[#1e2336] text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">H1 [{index + 1}]:</span>
                      <span>"{h1}"</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 bg-[#090a0f] border border-rose-500/20 rounded text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>No &lt;h1&gt; tags were found on this web page.</span>
                </div>
              )}
            </div>

            <div className="bg-[#141724] rounded-lg p-4 border border-[#1e2336] space-y-3">
              <h4 className="text-xs font-medium text-slate-200">Social Cards & Security</h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#090a0f] rounded border border-[#1e2336]">
                  <span className="text-slate-400 block font-medium mb-0.5">OpenGraph Title:</span>
                  <span className="text-slate-200 font-mono">{report.ogTitle || 'Not defined'}</span>
                </div>

                <div className="p-2.5 bg-[#090a0f] rounded border border-[#1e2336]">
                  <span className="text-slate-400 block font-medium mb-0.5">Canonical URL:</span>
                  <span className="text-indigo-300 font-mono break-all">{report.canonicalUrl || 'Not defined'}</span>
                </div>

                <div className="p-2.5 bg-[#090a0f] rounded border border-[#1e2336] flex items-center justify-between">
                  <span className="text-slate-400 font-medium">HTTPS Protocol Security:</span>
                  <span className={`font-semibold flex items-center gap-1 ${report.hasHttps ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {report.hasHttps ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Images */}
      {activeTab === 'images' && (
        <ImageAltTable
          totalImages={report.totalImages}
          missingCount={report.imagesMissingAltCount}
          missingImages={report.missingAltImages}
        />
      )}

      {/* Tab 4: JSON */}
      {activeTab === 'json' && <RawJsonViewer report={report} />}
    </div>
  );
};
