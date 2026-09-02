"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../LanguageProvider";
import { TELEGRAM_ADMIN, signalCopies } from "@/data/signal";

export default function SignalStickyCta() {
  const { locale } = useI18n();
  const c = signalCopies[locale];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-zinc-400">{c.sticky.label}</p>
          <p className="font-display text-sm font-bold text-white">{c.sticky.headline}</p>
        </div>
        <a
          href={TELEGRAM_ADMIN}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="sticky"
          tabIndex={visible ? undefined : -1}
          className="shrink-0 rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-6 py-3 font-display text-sm font-bold text-ink shadow-[0_0_24px_rgba(212,175,55,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          {c.sticky.cta}
        </a>
      </div>
    </div>
  );
}
