import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ChatFlow — Modern Real-Time Messaging Platform',
    template: '%s | ChatFlow',
  },
  description:
    'Connect with your team instantly with lightning-fast real-time messaging, group channels, live typing indicators, and enterprise-grade reliability.',
  keywords: [
    'chat',
    'messaging',
    'team collaboration',
    'real-time chat',
    'socket.io chat',
    'live chat application',
    'ChatFlow',
  ],
  authors: [{ name: 'ChatFlow' }],
  creator: 'ChatFlow',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://chat-app-with-landing.vercel.app'
  ),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'ChatFlow — Modern Real-Time Messaging Platform',
    description:
      'Connect with your team instantly with lightning-fast real-time messaging, group channels, and enterprise-grade reliability.',
    siteName: 'ChatFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatFlow — Modern Real-Time Messaging Platform',
    description:
      'Connect with your team instantly with lightning-fast real-time messaging, group channels, and enterprise-grade reliability.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
