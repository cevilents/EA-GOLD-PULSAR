"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n, useI18nContext } from "../LanguageProvider";
import { signalCopies, telegramStartLink } from "@/data/signal";

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="url(#sg)" strokeWidth="2" />
      <path d="M9 19l4-6 3 4 3-7 4 9" stroke="url(#sg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="sg" x1="2" y1="2" x2="30" y2="30">
          <stop stopColor="#F7D774" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const LINKS = [
  { href: "#cara-kerja", key: "howTo" },
  { href: "#transparansi", key: "proof" },
  { href: "#faq", key: "faq" }
] as const;

export default function SignalNav() {
  const [open, setOpen] = useState(false);
  const { locale } = useI18n();
  const { setLocale } = useI18nContext();
  const c = signalCopies[locale];
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const links = LINKS.map((link) => ({
    href: link.href,
    label: link.key === "howTo" ? c.howTo.eyebrow : link.key === "proof" ? c.proof.eyebrow : "FAQ"
  }));

  // Ganti bahasa lewat state React: reload penuh di tengah funnel iklan
  // membuang bundle dan mereset posisi scroll pengunjung.
  function toggleLocale(): void {
    setLocale(locale === "id" ? "en" : "id");
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>
          </span>
        </a>

        <div className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-gold-light"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={locale === "id" ? "Switch to English" : "Beralih ke Bahasa Indonesia"}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold-light"
          >
            {c.nav.langLabel}
          </button>
          <a
            href={telegramStartLink("nav")}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="nav"
            className="rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2 text-sm font-semibold text-ink shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {c.nav.cta}
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="signal-mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-300 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="signal-mobile-menu" className="border-t border-white/5 bg-ink/95 px-4 pb-4 pt-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-gold-light"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Bahasa</span>
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold-light"
            >
              {c.nav.langLabel}
            </button>
          </div>
          <a
            href={telegramStartLink("nav-mobile")}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="nav-mobile"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2.5 text-center text-sm font-semibold text-ink"
          >
            {c.nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}
