"use client";

import { TESTIMONIALS, getTestimonial } from "@/data/testimonials";
import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { locale, t } = useI18n();

  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.testimonials.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.testimonials.title}
            </h2>
            <p className="mt-4 text-zinc-400">
              {t.testimonials.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.id} delay={i * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(212,175,55,0.1)]">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/5 transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-deep text-sm font-bold text-ink">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">{testimonial.name}</h3>
                    <p className="text-xs text-zinc-500">{testimonial.flag} {testimonial.location}</p>
                  </div>
                </div>

                <div className="relative mt-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
                    <span className="text-xs text-emerald-400">{t.testimonials.profit}</span>
                    <span className="font-display text-sm font-bold text-emerald-400">{testimonial.profit}</span>
                  </div>
                </div>

                <p className="relative mt-4 flex-1 text-sm leading-relaxed text-zinc-400">
                  &ldquo;{getTestimonial(testimonial, locale)}&rdquo;
                </p>

                <div className="relative mt-4">
                  <StarRating rating={testimonial.rating} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
