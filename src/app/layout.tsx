import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'BahiKhaata Voice | बहीखाता आवाज़ - बोलकर हिसाब रखें',
  description: 'Hands-free, voice-first financial ledger (Hisab-Kitab) web application for micro-vendors, chaiwalas, and small shopkeepers across India.',
  keywords: ['BahiKhaata', 'Voice Ledger', 'Chaiwala Khata', 'Udhaar Book', 'Hisab Kitab', 'Speech to Text Ledger', 'Indian Micro Economy'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BahiKhaata',
  },
  other: {
    google: 'notranslate',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="dark h-full antialiased" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-slate-100 select-none touch-manipulation`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
