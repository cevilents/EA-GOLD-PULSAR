"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { signalCopies } from "@/data/signal";

const ICONS = [
  "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  "M12 8v4l3 3M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9M3 12H1m2-4H1",
  "M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4M8 8h8M8 12h8M8 16h4",
  "M12 8v4l2.5 2.5M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z",
  "M11 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M11 8v6M8 11h6"
];

export default function SignalFeatures() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.features.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.features.title}
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-400">{c.features.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.features.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-gold/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold-light" aria-hidden="true">
                    <path d={ICONS[i % ICONS.length]} />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
