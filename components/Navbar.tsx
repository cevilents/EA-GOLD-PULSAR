"use client";

import { useState } from "react";
import { useI18n } from "./LanguageProvider";

const LINKS = [
  { href: "#koleksi", key: "koleksi" },
  { href: "#cara-klaim", key: "caraKlaim" },
  { href: "#faq", key: "faq" }
] as const;

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="url(#g)" strokeWidth="2" />
      <path d="M9 19l4-6 3 4 3-7 4 9" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="g" x1="2" y1="2" x2="30" y2="30">
          <stop stopColor="#F7D774" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-gold-light">
              {t.nav.links[link.key]}
            </a>
          ))}
          <a
            href="#klaim"
            className="rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2 text-sm font-semibold text-ink shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
          >
            {t.nav.cta}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t.nav.menuAria}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-ink/95 px-4 pb-4 pt-2 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-gold-light"
            >
              {t.nav.links[link.key]}
            </a>
          ))}
          <a
            href="#klaim"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2.5 text-center text-sm font-semibold text-ink"
          >
            {t.nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}
