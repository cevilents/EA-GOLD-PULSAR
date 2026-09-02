"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { PROOF, signalCopies } from "@/data/signal";

export default function SignalProof() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  const stats = [
    { value: PROOF.winRate, label: c.proof.stats.winRate },
    { value: PROOF.totalSignals, label: c.proof.stats.totalSignals },
    { value: PROOF.netPips, label: c.proof.stats.netPips }
  ];

  return (
    <section id="transparansi" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">{c.proof.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.proof.title}
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-400">{c.proof.body}</p>
          </div>
        </Reveal>

        <dl className="mt-12 grid gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-6 text-center">
                <dd className="font-display text-3xl font-bold text-emerald-400 sm:text-4xl">{stat.value}</dd>
                <dt className="mt-2 text-xs uppercase tracking-wide text-zinc-400">{stat.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={180}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-400">
            {c.proof.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
