"use client";

import { WHATSAPP_SUPPORT } from "@/data/eas";
import { useI18n } from "./LanguageProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-display text-lg font-bold text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
          </span>
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-500">
            {t.footer.disclaimer}
          </p>
          <p className="text-xs text-zinc-600">
            {t.footer.needHelp}{" "}
            <a
              href={WHATSAPP_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:underline"
            >
              {t.footer.contactLink}
            </a>
          </p>
          <p className="text-xs text-zinc-600">
            {t.footer.rights.replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  );
}
