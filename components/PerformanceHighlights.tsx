"use client";

import { EAS } from "@/data/eas";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

export default function PerformanceHighlights() {
  const { t } = useI18n();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.performance.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.performance.title}
            </h2>
            <p className="mt-4 text-zinc-400">
              {t.performance.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EAS.filter((ea) => ea.winRate !== "\u2014").map((ea, i) => (
            <Reveal key={ea.id} delay={(i % 4) * 100}>
              <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 transition-all duration-500 group-hover:scale-150 group-hover:bg-emerald-500/20" />
                
                <h3 className="relative font-display text-lg font-bold text-white">{ea.name}</h3>
                
                <div className="relative mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-emerald-400">{ea.winRate}</span>
                  <span className="text-xs text-zinc-500">WR</span>
                </div>
                
                <dl className="relative mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.collection.metrics.pf}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-emerald-400">{ea.profitFactor}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.collection.metrics.maxDd}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-yellow-400">{ea.maxDd}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
