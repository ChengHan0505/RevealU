import type { ReactNode } from 'react';
import { AppNavbar } from './AppNavbar';

type AppShellProps = {
  children: ReactNode;
  footer?: boolean;
};

export function AppShell({ children, footer = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-app text-ink">
      <AppNavbar authLabel="Logout" authHref="/" />
      {children}
      {footer && (
        <footer className="bg-night px-6 py-7 text-xs text-white/55">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span>
              Reveal<span className="text-cyan">U</span>
            </span>
            <span>&copy; 2026 RevealU. All rights reserved.</span>
            <span className="hidden gap-7 sm:flex">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#support">Support</a>
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
