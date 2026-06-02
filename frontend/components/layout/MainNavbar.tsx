'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'New Session', href: '/sessions/new' }
];

type MainNavbarProps = {
  authLabel?: 'Login' | 'Logout' | 'Register';
  authHref?: string;
  showNavLinks?: boolean;
};

export function MainNavbar({ authLabel = 'Login', authHref = '/login', showNavLinks = true }: MainNavbarProps) {
  const [open, setOpen] = useState(false);
  const isLogout = authLabel === 'Logout';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,#393540_0%,#15121c_100%)] shadow-sm">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <div className="flex items-center gap-8">
          <BrandLogo />
          {showNavLinks && (
            <div className="hidden items-center gap-6 text-xs font-bold text-white sm:flex">
              {navItems.map((item) => (
                <Link className="text-white transition hover:text-cyan" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {isLogout ? (
          <div className="relative">
            <button
              aria-expanded={open}
              className="flex items-center gap-3 text-xs font-bold text-white transition hover:text-cyan"
              onClick={() => setOpen((current) => !current)}
              type="button"
            >
              Profile
              <span className="grid size-7 place-items-center rounded-full bg-white/14">
                <span className="size-2.5 rounded-full bg-white/80" />
              </span>
            </button>
            {open && (
              <div className="absolute right-0 mt-3 w-36 rounded-lg border border-white/12 bg-night p-2 shadow-soft">
                <Link className="block rounded-md px-3 py-2 text-xs font-black text-white transition hover:bg-white/10 hover:text-cyan" href="/">
                  Log out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link className="flex items-center gap-3 text-xs font-bold text-white transition hover:text-cyan" href={authHref}>
            {authLabel}
            <span className="grid size-7 place-items-center rounded-full bg-white/14">
              <span className="size-2.5 rounded-full bg-white/80" />
            </span>
          </Link>
        )}
      </nav>
    </header>
  );
}
