"use client";

import { useCallback, useState } from "react";
import { WALLET_PARTNER } from "@/data/eas";
import type { TutorialStep } from "@/lib/i18n";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

function CopyButton(): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WALLET_PARTNER);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = WALLET_PARTNER;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        copied
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-gradient-to-r from-gold-light to-gold-deep text-ink hover:brightness-110"
      }`}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {t.tutorial.copied}
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {t.tutorial.copy}
        </>
      )}
    </button>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.07] p-4">
      <svg className="mt-0.5 shrink-0 text-red-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <p className="text-sm leading-relaxed text-red-300/90">{children}</p>
    </div>
  );
}

function StepContent({ step }: { step: TutorialStep }) {
  const { t } = useI18n();

  return (
    <>
      <p className="leading-relaxed">{step.body}</p>

      {step.wallet && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gold/30 bg-gold/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-light/80">{t.tutorial.walletLabel}</p>
            <p className="mt-1 select-all font-mono text-lg font-bold tracking-wider text-white">{WALLET_PARTNER}</p>
          </div>
          <CopyButton />
        </div>
      )}

      {step.bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {step.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
              <svg className="mt-1 shrink-0 text-gold" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}

      {step.warning !== null && <Warning>{step.warning}</Warning>}
    </>
  );
}

export default function TutorialSteps() {
  const { t } = useI18n();
  const steps = t.tutorial.steps;

  return (
    <section id="cara-klaim" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.tutorial.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.tutorial.title}
            </h2>
            <p className="mt-4 text-zinc-400">
              {t.tutorial.subtitle}
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 space-y-6">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 60}>
                <div className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg font-bold text-gold-light">
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-gold/40 to-transparent" />}
                  </div>
                  <div className="pb-2">
                    <h3 className="pt-2 font-display text-lg font-bold text-white">{step.title}</h3>
                    <div className="mt-2 text-sm text-zinc-400">
                      <StepContent step={step} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
