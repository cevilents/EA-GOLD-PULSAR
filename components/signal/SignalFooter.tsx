"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../LanguageProvider";
import { signalCopies, telegramStartLink } from "@/data/signal";

export default function SignalFooter() {
  const { locale } = useI18n();
  const c = signalCopies[locale];
  const [year, setYear] = useState<number | null>(null);

  // Halaman ini statis: menghitung tahun saat render akan membekukannya ke waktu build.
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="border-t border-white/5 py-10 pb-24 md:pb-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-display text-lg font-bold text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>
          </span>
          <div className="flex items-center gap-5 text-sm">
            <a href="/ea" className="text-zinc-400 transition-colors hover:text-gold-light">
              {c.footer.back}
            </a>
            <a
              href={telegramStartLink("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light transition-colors hover:text-gold"
            >
              Telegram
            </a>
          </div>
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-400">{c.footer.disclaimer}</p>
          <p className="text-xs text-zinc-400">
            {year === null ? "" : c.footer.rights.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
