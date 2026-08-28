"use client";

import { useI18n } from "./LanguageProvider";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Gratis Selamanya",
    titleEn: "Free Forever",
    description: "Semua EA bisa didownload tanpa biaya. Kamu hanya perlu buka akun di bawah afiliasi kami.",
    descriptionEn: "All EAs can be downloaded for free. You just need to open an account under our affiliation."
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Tanpa Biaya Tersembunyi",
    titleEn: "No Hidden Fees",
    description: "Tidak ada biaya tambahan, tidak ada langganan. Profitmu 100% milikmu.",
    descriptionEn: "No additional fees, no subscriptions. Your profit is 100% yours."
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "Support 24/7 via Telegram",
    titleEn: "24/7 Support via Telegram",
    description: "Tim support kami selalu siap membantu kamu kapan saja melalui Telegram.",
    descriptionEn: "Our support team is always ready to help you anytime via Telegram."
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: "Update EA Berkala",
    titleEn: "Regular EA Updates",
    description: "EA kami terus di-update mengikuti kondisi pasar terkini. Profitmu tetap optimal.",
    descriptionEn: "Our EAs are constantly updated to follow current market conditions. Your profit stays optimal."
  }
];

export default function WhyGoldPulsar() {
  const { locale, t } = useI18n();

  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">{t.why.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {t.why.title}
            </h2>
            <p className="mt-4 text-zinc-400">
              {t.why.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(212,175,55,0.1)]">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/5 transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative text-gold-light">
                  {benefit.icon}
                </div>

                <h3 className="relative mt-4 font-display text-lg font-bold text-white">
                  {locale === "en" ? benefit.titleEn : benefit.title}
                </h3>

                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {locale === "en" ? benefit.descriptionEn : benefit.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
