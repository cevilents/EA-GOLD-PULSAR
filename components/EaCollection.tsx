import { EAS } from "@/data/eas";
import Reveal from "./Reveal";

export default function EaCollection() {
  return (
    <section id="koleksi" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Koleksi EA</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Enam Senjata untuk Menaklukkan Gold
            </h2>
            <p className="mt-4 text-zinc-400">
              Setiap EA punya karakter dan strategi berbeda. Pilih yang cocok dengan gaya tradingmu — semuanya gratis.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EAS.map((ea, i) => (
            <Reveal key={ea.id} delay={(i % 3) * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)]">
                <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-3 py-1 text-[10px] font-bold tracking-wider text-ink">
                  GRATIS
                </div>

                <h3 className="pr-16 font-display text-xl font-bold text-white">{ea.name}</h3>
                <p className="mt-1 text-sm text-gold-light/90">{ea.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{ea.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {ea.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <dl className="mt-auto grid grid-cols-4 gap-2 border-t border-white/5 pt-5 text-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Winrate</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.winRate}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">PF</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.profitFactor}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Max DD</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.maxDd}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">TF</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.timeframe}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
