"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";
import LanguageGate from "./LanguageGate";

const STORAGE_KEY = "gp-locale";

interface I18nContextValue {
  locale: Locale | null;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: null,
  setLocale: () => undefined
});

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "id" || stored === "en" ? stored : null;
  } catch {
    return null;
  }
}

interface LanguageProviderProps {
  children: React.ReactNode;
  /**
   * Tampilkan interstitial pilih bahasa saat kunjungan pertama.
   * Dimatikan di landing page iklan: satu klik tambahan sebelum pengunjung
   * melihat penawaran adalah kebocoran konversi yang mahal.
   */
  gate?: boolean;
  /**
   * Bahasa yang dipakai saat gate dimatikan. Saat `gate` false, pilihan bahasa
   * yang tersimpan dari halaman lain sengaja diabaikan supaya konten halaman
   * selalu cocok dengan metadata dan structured data-nya.
   */
  defaultLocale?: Locale;
}

export function LanguageProvider({
  children,
  gate = true,
  defaultLocale = "id"
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    const resolved = gate ? readStoredLocale() : defaultLocale;
    if (resolved !== null) {
      document.documentElement.lang = resolved;
    }
    setLocaleState(resolved);
  }, [gate, defaultLocale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      return;
    }
    document.documentElement.lang = next;
    setLocaleState(next);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
      {gate && locale === null ? <LanguageGate /> : null}
    </I18nContext.Provider>
  );
}

export function useI18nContext(): I18nContextValue {
  return useContext(I18nContext);
}

export function useI18n(): { locale: Locale; t: Dictionary } {
  const { locale } = useContext(I18nContext);
  const resolved: Locale = locale ?? "id";
  return { locale: resolved, t: getDictionary(resolved) };
}
