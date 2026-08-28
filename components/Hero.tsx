"use client";

import { useEffect, useState } from "react";
import CandleChart from "./CandleChart";
import { useI18n } from "./LanguageProvider";

function useLivePrice(): { price: number; delta: number } {
  const [tick, setTick] = useState({ price: 2384.25, delta: 12.4 });

  useEffect(() => {
    const id = setInterval(() => {
      setTick((prev) => {
        const change = (Math.random() - 0.48) * 2.2;
        const price = Math.max(2300, Math.min(2480, prev.price + change));
        return { price, delta: prev.delta + change };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return tick;
}

function useProfitCounter(): number {
  const [profit, setProfit] = useState(2400000);

  useEffect(() => {
    const id = setInterval(() => {
      setProfit((prev) => prev + Math.floor(Math.random() * 500) + 100);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return profit;
}

function SocialProofBadge() {
  const [users, setUsers] = useState(10847);

  useEffect(() => {
    const id = setInterval(() => {
      setUsers((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-bold">{users.toLocaleString()}+</span>
      <span>trader sudah claim</span>
    </div>
  );
}

export default function Hero() {
  const { price, delta } = useLivePrice();
  const totalProfit = useProfitCounter();
  const { t } = useI18n();
  const up = delta >= 0;

  return (
    <section id="beranda" className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <CandleChart />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex flex-col items-center gap-3">
            <SocialProofBadge />
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-light">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
              </span>
              {t.hero.badge}
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            {t.hero.headline1}
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-deep bg-clip-text text-transparent">
              {t.hero.headline2}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t.hero.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#koleksi"
              className="w-full rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/20 sm:w-auto"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#klaim"
              className="w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-8 py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-transform hover:scale-105 sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-md">
              <span className="text-xs uppercase tracking-widest text-zinc-500">XAUUSD</span>
              <span className="font-display text-xl font-bold text-white">
                {price.toFixed(2)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={up ? "" : "rotate-180"}>
                  <path d="M6 1l5 7H1z" />
                </svg>
                {up ? "+" : ""}
                {delta.toFixed(2)}
              </span>
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 backdrop-blur-md">
              <span className="text-xs uppercase tracking-widest text-emerald-500">Total Profit Trader</span>
              <span className="font-display text-xl font-bold text-emerald-400">
                ${(totalProfit / 1000000).toFixed(1)}M+
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
