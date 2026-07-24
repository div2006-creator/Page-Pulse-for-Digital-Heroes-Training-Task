'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, X, Globe, CornerDownLeft } from 'lucide-react';

interface UrlFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onAudit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Enter a valid web page URL to begin audit.');
      return;
    }

    onAudit(trimmed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row items-center bg-[#11131f] border border-[#1e2336] focus-within:border-indigo-500/80 rounded-xl p-1.5 gap-2 shadow-xl transition-all duration-200">
          <div className="flex items-center flex-1 w-full px-3 py-1">
            <Globe className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="https://example.com"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-normal py-1.5"
              disabled={isLoading}
              id="url-audit-input"
              aria-label="Target URL to audit"
            />
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-slate-500 hover:text-slate-300 p-1 transition-colors mr-1"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#191d2d] border border-[#252b42] text-[10px] font-mono text-slate-400">
              <CornerDownLeft className="w-2.5 h-2.5" />
              <span>Enter</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="btn-run-audit"
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Audit URL</span>
              </>
            )}
          </button>
        </div>
      </form>

      {inputError && (
        <p className="text-rose-400 text-xs mt-2 text-center font-medium">
          {inputError}
        </p>
      )}
    </div>
  );
};
