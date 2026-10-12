'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sprout,
  Scan,
  Activity,
  MessageSquareText
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Plants', href: '/plants', icon: Sprout },
    { label: 'Scan', href: '/scan', icon: Scan, isFab: true },
    { label: 'Monitor', href: '/monitoring', icon: Activity },
    { label: 'Chat', href: '/chat', icon: MessageSquareText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-emerald-950/10 px-3 py-2 shadow-lg">
      <nav className="flex items-center justify-around max-w-md mx-auto relative">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -top-6 relative group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-4 ring-white group-active:scale-95 transition-transform animate-pulse">
                  <Icon className="w-6 h-6 text-emerald-100" />
                </div>
                <span className="text-[10px] font-bold text-emerald-900 mt-1">
                  Scan Plant
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-neutral-500 hover:text-emerald-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-neutral-500'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
