"use client";

import { useState } from "react";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  return (
    <section id="faq" className="scroll-mt-20 border-t border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.faq.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.faq.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <div className={`overflow-hidden rounded-xl border transition-colors ${open ? "border-gold/40 bg-gold/[0.05]" : "border-white/10 bg-white/[0.03]"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <svg
                      className={`shrink-0 text-gold-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {open && <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
