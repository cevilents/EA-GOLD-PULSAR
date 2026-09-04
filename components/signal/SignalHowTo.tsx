"use client";

import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { signalCopies, telegramStartLink } from "@/data/signal";

export default function SignalHowTo() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section id="cara-kerja" className="relative scroll-mt-16 border-y border-white/5 bg-white/[0.02] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.howTo.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.howTo.title}
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-400">{c.howTo.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {c.howTo.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 110}>
              <article className="relative h-full rounded-2xl border border-white/10 bg-ink-soft/60 p-6 backdrop-blur-sm transition-colors hover:border-gold/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ink font-display text-base font-bold text-gold-light shadow-[0_0_24px_rgba(212,175,55,0.25)]">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250}>
          <div className="mt-12 text-center">
            <a
              href={telegramStartLink("howto")}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="howto"
              className="inline-block rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-8 py-4 font-display text-base font-bold text-ink shadow-[0_0_45px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {c.howTo.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
