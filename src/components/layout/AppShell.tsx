'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-neutral-900 selection:bg-emerald-200 selection:text-emerald-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {!isLanding && <Sidebar />}

        <main className={`flex-1 min-w-0 ${!isLanding ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
          <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      }
    >
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}
