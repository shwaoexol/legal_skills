'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Меню"
        aria-expanded={open}
        className="rounded p-2 text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full z-40 flex flex-col gap-1 border-t border-white/10 bg-navy-900 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2.5 text-white/80 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+998778210877" className="mt-2 rounded px-2 py-2.5 text-gold-500">
            +998 77 821 08 77
          </a>
        </nav>
      )}
    </div>
  );
}