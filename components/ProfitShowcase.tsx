"use client";

import { PROFIT_CARDS, getProfitHighlight } from "@/data/testimonials";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

function MiniChart() {
  return (
    <div className="flex h-16 items-end gap-1">
      {[40, 55, 45, 70, 60, 85, 75, 95, 80, 100].map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-t bg-gradient-to-t from-emerald-500/60 to-emerald-400"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
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
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5 transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative">
                  <h3 className="font-display text-xl font-bold text-white">{card.eaName}</h3>
                  <p className="mt-1 text-sm text-emerald-400/80">{getProfitHighlight(card, locale)}</p>
                </div>

                <div className="relative mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <MiniChart />
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-emerald-400">{card.returnPct}</span>
                    <span className="text-xs text-zinc-500">{card.duration}</span>
                  </div>
                </div>

                <dl className="relative mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.profit.initialDeposit}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-white">{card.initialDeposit}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{t.profit.winLoss}</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-white">{card.winLoss}</dd>
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
