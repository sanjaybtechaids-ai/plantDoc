import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PlantProvider } from '@/context/PlantContext';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plant Doctor AI — Plant Health Scanner & Monitoring',
  description: 'AI-powered plant disease diagnosis, organic & chemical treatments, fertilizer recommendations, and continuous health tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAF8] text-neutral-900">
        <PlantProvider>
          <Suspense fallback={<div className="min-h-screen bg-[#F8FAF8]" />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </PlantProvider>
      </body>
    </html>
  );
}
