'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex items-center justify-center p-6 bg-[#f8fafc] text-[#0f172a] font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Critical System Error
          </h1>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            A critical error occurred while initializing the application. Please try reloading the system.
          </p>

          {error?.digest && (
            <div className="bg-slate-100 rounded-xl p-2.5 mb-6 text-xs font-mono text-slate-500 truncate">
              ID: {error.digest}
            </div>
          )}

          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#4f46e5] text-white font-semibold text-sm py-3.5 rounded-xl shadow-md hover:bg-[#4338ca] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
