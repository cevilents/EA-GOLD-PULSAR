"use client";

import PhoneMockup from "./PhoneMockup";
import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { TELEGRAM_ADMIN, signalCopies } from "@/data/signal";

export default function SignalAnatomy() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section id="isi-sinyal" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.anatomy.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.anatomy.title}
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-400">{c.anatomy.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <PhoneMockup showNotification={false} />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {c.anatomy.parts.map((part, i) => (
              <Reveal key={part.title} delay={i * 70}>
                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-gold/30">
                  <h3 className="flex items-start gap-2 font-display text-sm font-bold text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-gold-light" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {part.title}
                  </h3>
                  <p className="mt-2 pl-6 text-xs leading-relaxed text-zinc-400">{part.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={150}>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-6 py-5 text-center">
            <p className="flex items-center justify-center gap-2 text-sm leading-relaxed text-emerald-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {c.anatomy.safety}
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <a
              href={TELEGRAM_ADMIN}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="anatomy"
              className="inline-block rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 font-display text-sm font-bold text-gold-light transition-colors hover:bg-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {c.anatomy.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
