'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Copy, Check, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  status: 'pass' | 'warning' | 'fail' | 'info';
  subtitle?: string;
  icon: React.ElementType;
  copyableText?: string;
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  status,
  subtitle,
  icon: Icon,
  copyableText,
  badgeText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyableText && typeof value !== 'string') return;
    const textToCopy = copyableText || String(value);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let statusBadge = (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="w-3 h-3" />
      <span>{badgeText || 'Pass'}</span>
    </span>
  );

  if (status === 'warning') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" />
        <span>{badgeText || 'Warning'}</span>
      </span>
    );
  } else if (status === 'fail') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3 h-3" />
        <span>{badgeText || 'Issue'}</span>
      </span>
    );
  } else if (status === 'info') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <Info className="w-3 h-3" />
        <span>{badgeText || 'Info'}</span>
      </span>
    );
  }

  return (
    <div className="clean-card clean-card-hover rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#191d2d] text-slate-400 border border-[#252b42]">
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h4 className="text-xs font-medium text-slate-300">{title}</h4>
          </div>
          {statusBadge}
        </div>

        <div className="mt-2">
          <p className="text-base font-semibold text-white tracking-tight break-words line-clamp-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{subtitle}</p>
          )}
        </div>
      </div>

      {(copyableText || typeof value === 'string') && (
        <div className="mt-3 pt-2 border-t border-[#1e2336] flex items-center justify-end">
          <button
            onClick={handleCopy}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-[#191d2d]"
            title="Copy text"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
