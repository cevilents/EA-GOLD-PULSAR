"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { TELEGRAM_ADMIN, signalCopies } from "@/data/signal";

export default function SignalCTA() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.06] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.cta.eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            {c.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {c.cta.body}
          </p>

          <a
            href={TELEGRAM_ADMIN}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="final"
            className="mt-10 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-9 py-4 font-display text-base font-bold text-ink shadow-[0_0_60px_rgba(212,175,55,0.45)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M21.7 3.3 2.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.1-1.5Z" />
            </svg>
            {c.cta.primary}
          </a>

          <p className="mt-6 text-xs text-zinc-400">{c.cta.reassurance}</p>
        </Reveal>
      </div>
    </section>
  );
}
