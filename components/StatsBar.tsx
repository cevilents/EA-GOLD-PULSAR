"use client";

import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

export default function StatsBar() {
  const { t } = useI18n();

  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
        {t.stats.items.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-gold-light sm:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
