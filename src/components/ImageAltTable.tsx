'use client';

import React, { useState } from 'react';
import { ImageAltDetails } from '@/types/audit';
import { Image as ImageIcon, AlertCircle, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface ImageAltTableProps {
  totalImages: number;
  missingCount: number;
  missingImages: ImageAltDetails[];
}

export const ImageAltTable: React.FC<ImageAltTableProps> = ({
  totalImages,
  missingCount,
  missingImages,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopySrc = (src: string, index: number) => {
    navigator.clipboard.writeText(src);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const passRatio = totalImages > 0 ? Math.round(((totalImages - missingCount) / totalImages) * 100) : 100;

  return (
    <div className="clean-card rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2336] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            Image Alt Text Audit
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspection of alt attributes for WCAG accessibility and search indexability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#141724] px-2.5 py-1 rounded-md border border-[#1e2336] text-xs font-medium text-slate-300">
            Total Images: <span className="font-mono font-semibold text-white">{totalImages}</span>
          </div>
          <div className={`px-2.5 py-1 rounded-md border text-xs font-medium font-mono ${
            missingCount === 0 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            Missing Alt: {missingCount} ({100 - passRatio}%)
          </div>
        </div>
      </div>

      {missingCount === 0 ? (
        <div className="bg-[#141724] border border-[#1e2336] rounded-lg p-5 text-center space-y-1.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <h4 className="font-medium text-xs text-slate-200">All Images Include Alt Text</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Every image tag detected on this web page includes non-empty alt text.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-[#141724] border border-rose-500/20 rounded-lg p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-medium text-slate-200">Missing Alt Attributes: </span>
              {missingCount} image{missingCount > 1 ? 's' : ''} missing descriptive alt text.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e2336] text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Image Source (src)</th>
                  <th className="py-2.5 px-3">HTML Snippet</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2336]">
                {missingImages.map((img, idx) => (
                  <tr key={idx} className="hover:bg-[#141724] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="truncate font-mono text-indigo-300 text-[11px]" title={img.src}>
                        {img.src}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-md">
                      <code className="text-[11px] bg-[#090a0f] text-slate-300 px-2 py-0.5 rounded block truncate font-mono border border-[#1e2336]">
                        {img.snippet || `<img src="${img.src}">`}
                      </code>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopySrc(img.src, idx)}
                          className="px-2 py-1 rounded bg-[#191d2d] hover:bg-[#252b42] text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                          title="Copy Src URL"
                        >
                          {copiedIndex === idx ? (
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
                        {img.src.startsWith('http') && (
                          <a
                            href={img.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-[#191d2d] hover:bg-[#252b42] text-slate-400 hover:text-slate-200 transition-colors"
                            title="Open image in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
