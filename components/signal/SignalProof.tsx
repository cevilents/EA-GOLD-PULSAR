"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { TRACK_RECORD, signalCopies } from "@/data/signal";

/** Menangani hyphen ASCII maupun tanda minus tipografis (U+2212). */
function isNegative(net: string): boolean {
  const value = Number.parseFloat(net.replace(/\u2212/g, "-").replace(/[^\d.-]/g, ""));
  return Number.isFinite(value) && value < 0;
}

export default function SignalProof() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  if (TRACK_RECORD.length === 0) return null;

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

        <Reveal delay={120}>
          <div
            role="region"
            aria-label={c.proof.title}
            tabIndex={0}
            className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th scope="col" className="px-5 py-3.5 font-medium">{c.proof.columns.month}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{c.proof.columns.signals}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{c.proof.columns.win}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{c.proof.columns.loss}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{c.proof.columns.net}</th>
                </tr>
              </thead>
              <tbody>
                {TRACK_RECORD.map((row) => (
                  <tr key={row.month} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5 font-display font-semibold text-white">{row.month}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-zinc-400">{row.signals}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-emerald-400">{row.win}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-red-400">{row.loss}</td>
                    <td
                      className={`px-5 py-3.5 text-right font-display font-bold tabular-nums ${
                        isNegative(row.net) ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {row.net}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-zinc-400">
            {c.proof.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
