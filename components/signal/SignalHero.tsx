"use client";

import AppScreenshot from "./AppScreenshot";
import CandleChart from "../CandleChart";
import { useI18n } from "../LanguageProvider";
import { PROOF, TELEGRAM_ADMIN, signalCopies } from "@/data/signal";

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M21.7 3.3 2.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.1-1.5Z" />
    </svg>
  );
}

export default function SignalHero() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <CandleChart />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {c.hero.badge}
            </div>

            <h1 className="mt-6 font-display text-[2.1rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {c.hero.title}{" "}
              <span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">
                {c.hero.titleAccent}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0">
              {c.hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={TELEGRAM_ADMIN}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="hero-primary"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-8 py-4 font-display text-base font-bold text-ink shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <TelegramIcon />
                {c.hero.ctaPrimary}
              </a>
              <a
                href="#isi-sinyal"
                data-cta="hero-secondary"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold-light sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>

            <p className="mt-5 text-xs text-zinc-400">{c.hero.reassurance}</p>

            <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {["#f7d774", "#10b981", "#60a5fa", "#f472b6"].map((color) => (
                  <span
                    key={color}
                    className="h-7 w-7 rounded-full border-2 border-ink"
                    style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.15))` }}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-400">
                {c.hero.socialProof
                  .replace("{signals}", PROOF.totalSignals)
                  .replace("{winRate}", PROOF.winRate)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 blur-3xl" />
            <AppScreenshot
              src="beranda.jpg"
              alt={locale === "id" ? "Tampilan beranda aplikasi GoldPulsar" : "GoldPulsar app home screen"}
              priority
              className="relative"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
