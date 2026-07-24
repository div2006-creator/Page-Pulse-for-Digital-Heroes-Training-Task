'use client';

import React from 'react';
import { ScoreBreakdown } from '@/types/audit';
import { ShieldCheck, FileText, Tag, Heading, Image as ImageIcon } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  breakdown: ScoreBreakdown;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, breakdown }) => {
  let grade = 'F';
  let colorClass = 'text-rose-400';
  let strokeColor = '#f43f5e';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (score >= 90) {
    grade = 'A+';
    colorClass = 'text-emerald-400';
    strokeColor = '#10b981';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 80) {
    grade = 'A';
    colorClass = 'text-emerald-400';
    strokeColor = '#10b981';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 70) {
    grade = 'B';
    colorClass = 'text-indigo-400';
    strokeColor = '#6366f1';
    badgeBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (score >= 50) {
    grade = 'C';
    colorClass = 'text-amber-400';
    strokeColor = '#f59e0b';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdownItems = [
    { label: 'Title Tag', pts: breakdown.titleScore, max: 20, icon: FileText },
    { label: 'Meta Description', pts: breakdown.metaScore, max: 20, icon: Tag },
    { label: 'H1 Structure', pts: breakdown.h1Score, max: 20, icon: Heading },
    { label: 'Image Alt Text', pts: breakdown.altScore, max: 20, icon: ImageIcon },
    { label: 'HTTPS Security', pts: breakdown.httpsScore, max: 20, icon: ShieldCheck },
  ];

  return (
    <div className="clean-card rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 justify-between">
      {/* Circle Gauge */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-[#191d2d]"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-bold tracking-tight ${colorClass}`}>
            {score}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
            Score
          </span>
        </div>
      </div>

      {/* Grade & Score Summary */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-3 border-b border-[#1e2336] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Page Audit Score</h3>
            <p className="text-xs text-slate-400">SEO structure, image alt text, and HTTPS inspection</p>
          </div>
          <div className={`px-3 py-1 rounded-md border text-sm font-bold ${badgeBg}`}>
            Grade {grade}
          </div>
        </div>

        {/* Subscore Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {breakdownItems.map((item) => {
            const IconComponent = item.icon;
            const pct = (item.pts / item.max) * 100;
            return (
              <div key={item.label} className="bg-[#141724] rounded-lg p-2 border border-[#1e2336]">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <IconComponent className="w-3 h-3 text-slate-400" />
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {item.pts}/{item.max}
                  </span>
                </div>
                <div className="w-full h-1 bg-[#191d2d] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-indigo-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
