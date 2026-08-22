'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MessageSquare, ArrowRight, ArrowLeft, AlertCircle, User, Phone, Loader2, Sparkles, ChevronDown, Check } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+880', country: 'BD', name: 'Bangladesh' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+81', country: 'JP', name: 'Japan' },
];

const DEMO_ACCOUNTS = [
  { name: 'Maruf Hossain', countryCode: '+880', phone: '1712345111' },
  { name: 'Sarah Ahmed', countryCode: '+1', phone: '5550192834' },
  { name: 'Ada Lovelace', countryCode: '+1', phone: '5551111111' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already authenticated, redirect to /chat
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      router.replace('/chat');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setPhone(raw);
  };

  const handleQuickFill = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setName(demo.name);
    setPhone(demo.phone);
    const country = COUNTRY_CODES.find((c) => c.code === demo.countryCode) || COUNTRY_CODES[0];
    setSelectedCountry(country);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 5) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    // Combine country code and digits
    const fullPhoneNumber = `${selectedCountry.code}${cleanPhone}`;

    setIsSubmitting(true);
    try {
      const user = await login(fullPhoneNumber, name.trim());
      success(`Welcome back, ${user.name}!`);
      router.push('/chat');
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err?.message || 'Login failed. Please try again.';
      setErrorMsg(message);
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface relative overflow-hidden">
      {/* Decorative background blur elements matching Stich design */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top navigation back to home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-on-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1.5">
            Welcome to ChatFlow
          </h1>
          <p className="text-sm text-on-surface-variant">Connect with your team instantly</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/30">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Test Accounts</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = name === acc.name && phone === acc.phone;
              return (
                <button
                  key={acc.name}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`text-[11px] py-1.5 px-2 transition-all rounded-lg font-medium truncate text-center cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-xs border border-primary scale-[1.02]'
                      : 'bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-on-surface'
                  }`}
                  title={`Click to fill: ${acc.name} (${acc.countryCode}${acc.phone})`}
                >
                  {acc.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-error-container/60 border border-error/30 text-on-error-container text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col w-full">
          {/* Name Input */}
          <div className="space-y-1.5 flex flex-col w-full">
            <label
              htmlFor="fullName"
              className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
            >
              Full Name
            </label>
            <div className="relative flex items-center w-full group">
              <User className="absolute left-3.5 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none" />
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-3 pl-11 pr-4 border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-1.5 flex flex-col w-full">
            <label
              htmlFor="phoneNumber"
              className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
            >
              Phone Number
            </label>
            <div className="relative flex items-center w-full h-12 bg-surface-container-low rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-surface-container-lowest transition-all">
              {/* Country Code Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center gap-1 pl-3.5 pr-2.5 py-2 border-r border-outline-variant/30 h-full hover:bg-surface-container-high/60 transition-colors text-on-surface text-sm font-semibold focus:outline-none rounded-l-xl"
                >
                  <span>{selectedCountry.country}</span>
                  <span className="text-xs text-on-surface-variant font-normal">{selectedCountry.code}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isCountryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsCountryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-30 py-1.5 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.country}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-surface-container-high transition-colors text-left ${selectedCountry.code === c.code ? 'bg-primary-fixed text-on-primary-container font-semibold' : 'text-on-surface'
                            }`}
                        >
                          <span className="truncate">{c.name}</span>
                          <span className="font-mono text-[11px] text-on-surface-variant ml-2">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Phone Input */}
              <input
                id="phoneNumber"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="555 123 4567"
                required
                className="w-full bg-transparent text-on-surface text-sm py-3 px-3.5 focus:outline-none placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary text-sm font-semibold uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 hover:brightness-105 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center pt-5 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            New here? No problem — we&apos;ll create your account automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
