"use client";

import AppScreenshot from "./AppScreenshot";
import Reveal from "../Reveal";
import { useI18n } from "../LanguageProvider";
import { signalCopies } from "@/data/signal";

/** Screenshot dipetakan lewat kunci, bukan urutan array. */
const SHOTS: Record<"chat" | "materi" | "indikator" | "ea", string> = {
  chat: "chat.jpg",
  materi: "materi.jpg",
  indikator: "indikator.jpg",
  ea: "ea.jpg"
};

export default function SignalAppTour() {
  const { locale } = useI18n();
  const c = signalCopies[locale];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{c.appTour.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {c.appTour.title}
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-400">{c.appTour.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.appTour.items.map((item, i) => (
            <Reveal key={item.key} delay={i * 110}>
              <article className="text-center">
                <AppScreenshot
                  src={SHOTS[item.key]}
                  alt={item.title}
                  fallback={false}
                  className="!w-[200px]"
                />
                <h3 className="mt-6 font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
