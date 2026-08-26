"use client";

import { useEffect, useState } from "react";
import CandleChart from "./CandleChart";

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

export default function Hero() {
  const { price, delta } = useLivePrice();
  const up = delta >= 0;

  return (
    <section id="beranda" className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <CandleChart />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
            </span>
            100% Gratis — Syarat: Affiliasi Exness
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            EA XAUUSD Premium.
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-deep bg-clip-text text-transparent">
              Gratis Selamanya.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Koleksi Expert Advisor gold performa tinggi untuk akun Exness kamu.
            Satu syarat: pindah afiliasi ke IB GoldPulsarEA, submit nomor akunmu,
            dan seluruh koleksi menjadi milikmu.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#koleksi"
              className="w-full rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/20 sm:w-auto"
            >
              Lihat Koleksi EA
            </a>
            <a
              href="#klaim"
              className="w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-8 py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-transform hover:scale-105 sm:w-auto"
            >
              Klaim Sekarang
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-md">
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
        </div>
      </div>
    </section>
  );
}
