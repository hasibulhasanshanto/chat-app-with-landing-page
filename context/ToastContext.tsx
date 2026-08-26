'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  // Read and trigger any flash toast saved across page reloads/navigations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const flash = sessionStorage.getItem('chatflow_flash_toast');
      if (flash) {
        sessionStorage.removeItem('chatflow_flash_toast');
        const parsed = JSON.parse(flash);
        if (parsed?.message) {
          toast(parsed.message, parsed.type || 'success');
        }
      }
    } catch (e) {
      // ignore
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-top-3 duration-200 ${
              t.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-900/10'
                : t.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-900/10'
                : 'bg-indigo-50/95 border-indigo-200 text-indigo-900 shadow-indigo-900/10'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-indigo-600 shrink-0" />}
              <span className="text-sm font-medium leading-snug break-words">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-black/5 rounded-full transition-colors ml-2 shrink-0 text-current cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
