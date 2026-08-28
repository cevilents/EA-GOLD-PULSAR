"use client";

import { EAS } from "@/data/eas";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

function MiniEquityCurve() {
  const points = [20, 25, 22, 35, 30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 95];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return (
    <svg viewBox="0 0 100 40" className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="equityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${40 - ((points[0] - min) / range) * 35} ${points.map((p, i) => `L${(i / (points.length - 1)) * 100},${40 - ((p - min) / range) * 35}`).join(" ")} L100,40 L0,40 Z`}
        fill="url(#equityGrad)"
      />
      <path
        d={`M0,${40 - ((points[0] - min) / range) * 35} ${points.map((p, i) => `L${(i / (points.length - 1)) * 100},${40 - ((p - min) / range) * 35}`).join(" ")}`}
        fill="none"
        stroke="rgb(16,185,129)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

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
          {EAS.filter((ea) => ea.winRate !== "\u2014").map((ea, i) => {
            const isPopular = ea.id === "phoenix-alpha-v5";
            const isBeginner = ea.id === "phoenix-cent";

            return (
              <Reveal key={ea.id} delay={(i % 4) * 100}>
                <article className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                  isPopular 
                    ? "border-gold/40 bg-gradient-to-br from-gold/10 to-transparent hover:shadow-[0_8px_40px_rgba(212,175,55,0.2)]" 
                    : "border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent hover:border-emerald-500/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]"
                }`}>
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 transition-all duration-500 group-hover:scale-150 group-hover:bg-emerald-500/20" />
                  
                  <div className="relative flex items-start justify-between">
                    <h3 className="font-display text-lg font-bold text-white">{ea.name}</h3>
                    {isPopular && (
                      <span className="rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-2 py-0.5 text-[10px] font-bold text-ink">
                        POPULAR
                      </span>
                    )}
                    {isBeginner && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        PEMULA
                      </span>
                    )}
                  </div>
                  
                  <div className="relative mt-3">
                    <MiniEquityCurve />
                  </div>
                  
                  <div className="relative mt-3 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold text-emerald-400">{ea.winRate}</span>
                    <span className="text-xs text-zinc-500">WR</span>
                  </div>
                  
                  <dl className="relative mt-3 grid grid-cols-2 gap-3">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
