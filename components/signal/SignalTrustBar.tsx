"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { PROOF, signalCopies } from "@/data/signal";

export default function SignalTrustBar() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  const items = [
    { value: PROOF.winRate, label: c.trust.winRate },
    { value: PROOF.totalSignals, label: c.trust.totalSignals },
    { value: PROOF.netPips, label: c.trust.netPips },
    { value: PROOF.pair, label: c.trust.pair }
  ];

  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 70}>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-gold-light sm:text-3xl">{item.value}</div>
              <div className="mt-1.5 text-xs text-zinc-400 sm:text-sm">{item.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
