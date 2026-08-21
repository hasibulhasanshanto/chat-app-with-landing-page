import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChatFlow — Modern Real-Time Messaging Platform',
  description: 'Connect with your team instantly with lightning-fast real-time messaging, group channels, and enterprise-grade reliability.',
  keywords: ['chat', 'messaging', 'team collaboration', 'real-time chat', 'ChatFlow'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
