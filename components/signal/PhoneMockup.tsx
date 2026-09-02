"use client";

/**
 * Ilustrasi tampilan aplikasi, dirender penuh dari kode (bukan screenshot).
 * Ganti dengan screenshot aplikasi asli begitu tersedia — ilustrasi ini hanya
 * menggambarkan antarmuka, dan tidak boleh dipakai sebagai bukti performa.
 */

interface PhoneMockupProps {
  className?: string;
  showNotification?: boolean;
}

function Row({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "success" }) {
  const toneClass =
    tone === "danger" ? "text-red-400" : tone === "success" ? "text-emerald-400" : "text-white";
  return (
    <div className="flex items-center justify-between border-t border-white/5 py-2">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={`font-display text-[13px] font-bold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

export default function PhoneMockup({ className = "", showNotification = true }: PhoneMockupProps) {
  return (
    <div className={`relative mx-auto w-[270px] sm:w-[300px] ${className}`}>
      {showNotification && (
        <div className="absolute -left-6 -top-6 z-20 w-[230px] rounded-2xl border border-white/10 bg-ink-soft/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:-left-14">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-gold-light to-gold-deep text-[10px] font-bold text-ink">
              GP
            </span>
            <span className="text-[10px] font-semibold text-zinc-300">GoldPulsar Signals</span>
            <span className="ml-auto text-[9px] text-zinc-600">now</span>
          </div>
          <p className="mt-2 text-[11px] font-bold text-white">Sinyal baru · XAUUSD BUY</p>
          <p className="text-[10px] leading-snug text-zinc-400">Entry 2.384,20 – 2.386,00 · SL 2.378,50</p>
        </div>
      )}

      <div className="relative rounded-[2.2rem] border border-white/12 bg-gradient-to-b from-white/10 to-white/[0.02] p-[3px] shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />

          <div className="flex items-center justify-between px-5 pb-1 pt-2.5">
            <span className="text-[9px] font-semibold text-zinc-400">09:41</span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              <span className="h-1.5 w-3 rounded-sm bg-zinc-600" />
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 px-4 pb-3 pt-2">
            <div>
              <p className="font-display text-[13px] font-bold text-white">Signals</p>
              <p className="text-[9px] text-zinc-500">XAUUSD · live</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              AKTIF
            </span>
          </div>

          <div className="space-y-3 px-3 py-3">
            <article className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-3.5">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-display text-[10px] font-bold tracking-wide text-emerald-400">
                  BUY
                </span>
                <span className="font-display text-[13px] font-bold text-white">XAUUSD</span>
              </div>
              <div className="mt-2">
                <Row label="Entry" value="2.384,20 – 2.386,00" />
                <Row label="Stop loss" value="2.378,50" tone="danger" />
                <Row label="Target 1" value="2.392,00" tone="success" />
                <Row label="Target 2" value="2.398,40" tone="success" />
                <Row label="Target 3" value="2.407,10" tone="success" />
              </div>
              <p className="mt-2.5 rounded-lg bg-white/[0.04] p-2 text-[10px] leading-snug text-zinc-400">
                Rejection di area demand H1, momentum kembali menguat setelah retest.
              </p>
            </article>

            <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-red-500/15 px-2 py-0.5 font-display text-[9px] font-bold text-red-400">
                  SELL
                </span>
                <span className="text-[10px] text-zinc-500">2 jam lalu</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">TP2 tercapai</span>
                <span className="font-display text-[12px] font-bold text-emerald-400">+64 pips</span>
              </div>
            </article>

            <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-display text-[9px] font-bold text-emerald-400">
                  BUY
                </span>
                <span className="text-[10px] text-zinc-500">kemarin</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Stop loss kena</span>
                <span className="font-display text-[12px] font-bold text-red-400">-31 pips</span>
              </div>
            </article>
          </div>

          <div className="flex items-center justify-around border-t border-white/5 px-4 py-2.5">
            {["Sinyal", "Riwayat", "Kalkulator", "Akun"].map((tab, i) => (
              <span
                key={tab}
                className={`text-[9px] ${i === 0 ? "font-semibold text-gold-light" : "text-zinc-600"}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
