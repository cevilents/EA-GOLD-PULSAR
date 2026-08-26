import Reveal from "./Reveal";

const STATS = [
  { value: "6", label: "EA Premium" },
  { value: "2.400+", label: "Trader Aktif" },
  { value: "XAUUSD", label: "Spesialis Gold" },
  { value: "24/7", label: "Dukungan" }
];

export default function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gold-light">{stat.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
