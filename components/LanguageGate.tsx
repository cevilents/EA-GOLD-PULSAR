"use client";

import { useEffect, useState } from "react";
import { dictionaries } from "@/lib/i18n";
import { useI18nContext } from "./LanguageProvider";

export default function LanguageGate() {
  const { setLocale } = useI18nContext();
  const [shown, setShown] = useState(false);
  const gate = dictionaries.id.gate;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-ink px-4 transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label={gate.prompt}
    >
      <div className="w-full max-w-md text-center">
        <span className="font-display text-3xl font-bold tracking-tight text-white">
          Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
        </span>

        <p className="mt-6 text-sm text-zinc-400">{gate.prompt}</p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setLocale("id")}
            aria-label={gate.indonesian}
            className="w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-10 py-4 font-display text-lg font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
          >
            {gate.indonesian}
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            aria-label={gate.english}
            className="w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-10 py-4 font-display text-lg font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
          >
            {gate.english}
          </button>
        </div>
      </div>
    </div>
  );
}
