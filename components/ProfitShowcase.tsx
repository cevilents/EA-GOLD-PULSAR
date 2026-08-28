"use client";

import { PROFIT_CARDS, getProfitHighlight } from "@/data/testimonials";
import PlaceholderImage from "./PlaceholderImage";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

function EquityCurve() {
  const points = [10, 15, 12, 25, 20, 35, 30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 95, 90, 100];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return (
    <svg viewBox="0 0 200 60" className="h-16 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${60 - ((points[0] - min) / range) * 50} ${points.map((p, i) => `L${(i / (points.length - 1)) * 200},${60 - ((p - min) / range) * 50}`).join(" ")} L200,60 L0,60 Z`}
        fill="url(#profitGrad)"
      />
      <path
        d={`M0,${60 - ((points[0] - min) / range) * 50} ${points.map((p, i) => `L${(i / (points.length - 1)) * 200},${60 - ((p - min) / range) * 50}`).join(" ")}`}
        fill="none"
        stroke="rgb(16,185,129)"
        strokeWidth="2"
      />
      <circle cx="200" cy={60 - ((points[points.length - 1] - min) / range) * 50} r="3" fill="rgb(16,185,129)" />
    </svg>
  );
}

export default function ProfitShowcase() {
  const { locale, t } = useI18n();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.profit.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.profit.title}
            </h2>
            <p className="mt-4 text-zinc-400">
              {t.profit.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROFIT_CARDS.map((card, i) => (
            <Reveal key={card.id} delay={i * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.2)]">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5 transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative">
                  <PlaceholderImage type="profit" className="h-32" label={card.returnPct} />
                </div>

                <div className="relative mt-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-bold text-white">{card.eaName}</h3>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      LIVE ACCOUNT
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-emerald-400/80">{getProfitHighlight(card, locale)}</p>
                </div>

                <div className="relative mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <EquityCurve />
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-emerald-400">{card.returnPct}</span>
                    <span className="text-xs text-zinc-500">{card.duration}</span>
                  </div>
                </div>

                <dl className="relative mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.profit.initialDeposit}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-white">{card.initialDeposit}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.profit.winLoss}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-white">{card.winLoss}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Monthly</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-emerald-400">{card.monthlyReturn}</dd>
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
