import Link from 'next/link';

interface LandingFooterProps {
  className?: string;
}

export function LandingFooter({ className = '' }: LandingFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto py-8 bg-surface-container-lowest border-t border-outline-variant/30 text-xs text-on-surface-variant ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-on-primary text-xs font-bold shadow-xs">
            CF
          </div>
          <span className="font-semibold text-on-surface">ChatFlow</span>
          <span className="text-on-surface-variant/60">•</span>
          <span>&copy; {currentYear} All rights reserved.</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span>All Systems Operational</span>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer Navigation" className="flex items-center gap-6 font-medium">
          <Link href="/login" className="hover:text-primary transition-colors py-2">
            Log In
          </Link>
          <Link href="/chat" className="hover:text-primary transition-colors py-2">
            Chat Dashboard
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors py-2">
            Get Started
          </Link>
        </nav>
      </div>
    </footer>
  );
}
