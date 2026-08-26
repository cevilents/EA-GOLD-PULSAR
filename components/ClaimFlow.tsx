"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { EAS } from "@/data/eas";
import { validateClaim, type FieldErrors } from "@/lib/validation";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

type Status = "idle" | "loading" | "success";

const EMPTY_ERRORS: FieldErrors = {};

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function DownloadPanel({ unlocked }: { unlocked: boolean }) {
  const { t } = useI18n();

  if (!unlocked) {
    return (
      <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <svg className="text-gold-light" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">{t.download.lockedTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {t.download.lockedBody}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="unduhan" className="mt-12 scroll-mt-24 rounded-2xl border border-gold/30 bg-gold/[0.05] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-gold-light to-gold-deep">
          <svg className="text-ink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">{t.download.unlockedTitle}</h3>
          <p className="text-sm text-zinc-400">{t.download.unlockedBody}</p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {EAS.map((ea) => (
          <li
            key={ea.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-soft px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{ea.name}</p>
              <p className="truncate font-mono text-xs text-zinc-500">{ea.file}</p>
            </div>
            <Link
              href={`/downloads/${ea.file}`}
              download
              prefetch={false}
              className="shrink-0 rounded-lg bg-gradient-to-r from-gold-light to-gold-deep px-4 py-2 text-xs font-bold text-ink transition-transform hover:scale-105"
            >
              {t.download.cta}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ClaimFlow() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [serverError, setServerError] = useState("");
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setServerError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      account: String(data.get("account") ?? ""),
      website: String(data.get("website") ?? "")
    };

    const validation = validateClaim(payload);
    if (!validation.ok) {
      const localized: FieldErrors = {};
      if (validation.errors.name !== undefined) localized.name = t.form.errors.name;
      if (validation.errors.email !== undefined) localized.email = t.form.errors.email;
      if (validation.errors.telegram !== undefined) localized.telegram = t.form.errors.telegram;
      if (validation.errors.account !== undefined) localized.account = t.form.errors.account;
      setErrors(localized);
      return;
    }
    setErrors(EMPTY_ERRORS);
    setStatus("loading");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => {
          document.getElementById("unduhan")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }

      const message =
        typeof json === "object" && json !== null && "error" in json
          ? String((json as { error: unknown }).error)
          : t.form.fallbackError;
      const fields =
        typeof json === "object" && json !== null && "fields" in json
          ? ((json as { fields: unknown }).fields as FieldErrors)
          : undefined;
      if (fields) setErrors(fields);
      setServerError(message);
      setStatus("idle");
    } catch {
      setServerError(t.form.networkError);
      setStatus("idle");
    }
  }

  return (
    <section id="klaim" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.form.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{t.form.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              {t.form.subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {status === "success" ? (
            <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 text-center">
              <p className="font-display text-lg font-bold text-emerald-400">{t.form.successTitle}</p>
              <p className="mt-1 text-sm text-zinc-400">
                {t.form.successBody}
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.form.nameLabel} error={errors.name}>
                  <input name="name" type="text" autoComplete="name" placeholder={t.form.namePlaceholder} className={inputClass} maxLength={60} required />
                </Field>
                <Field label={t.form.whatsappLabel} error={errors.email}>
                  <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder={t.form.whatsappPlaceholder} className={inputClass} required />
                </Field>
              </div>
              <div className="mt-5">
                <Field label={t.form.accountLabel} error={errors.account}>
                  <input name="account" type="text" inputMode="numeric" pattern="[0-9]*" placeholder={t.form.accountPlaceholder} className={inputClass} maxLength={12} required />
                </Field>
                <p className="mt-2 text-xs text-zinc-600">
                  {t.form.accountHelper}
                </p>
              </div>

              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {serverError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-7 w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.3)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? t.form.submitting : t.form.submit}
              </button>
            </form>
          )}
        </Reveal>

        <DownloadPanel unlocked={status === "success"} />
      </div>
    </section>
  );
}
