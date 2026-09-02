"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { signalCopies } from "@/data/signal";

export default function SignalProblem() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gold">
            {c.problem.eyebrow}
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {c.problem.title}
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {c.problem.pains.map((pain, i) => (
            <li key={pain} className="h-full">
              <Reveal delay={i * 80} className="h-full">
                <div className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0 text-red-400" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                  <span className="text-sm leading-relaxed text-zinc-300">{pain}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-2xl text-center font-display text-lg font-semibold leading-relaxed text-gold-light sm:text-xl">
            {c.problem.bridge}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
