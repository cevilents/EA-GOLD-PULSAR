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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== null) {
      document.documentElement.lang = stored;
    }
    setLocaleState(stored);
  }, []);

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
      {locale === null ? <LanguageGate /> : null}
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
