"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { signalCopies } from "@/data/signal";

export default function SignalWhyFree() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section className="relative border-y border-white/5 bg-white/[0.02] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.whyFree.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.whyFree.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-ink-soft/60 p-6 text-base leading-relaxed text-zinc-300 backdrop-blur-sm sm:p-7">
            {c.whyFree.body}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {c.whyFree.points.map((point, i) => (
            <Reveal key={point.title} delay={i * 90}>
              <article className="h-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-400" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {point.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{point.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
