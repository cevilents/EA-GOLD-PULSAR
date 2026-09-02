"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { SIGNAL_TESTIMONIALS, signalCopies } from "@/data/signal";

export default function SignalTestimonials() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  // Section sengaja tidak dirender selama belum ada testimoni nyata.
  if (SIGNAL_TESTIMONIALS.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.testimonials.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.testimonials.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNAL_TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 90}>
              <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <blockquote className="text-sm leading-relaxed text-zinc-300">“{item.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-white/5 pt-4">
                  <p className="font-display text-sm font-bold text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
