"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const ITEMS = [
  {
    q: "Apakah semua EA-nya benar-benar gratis?",
    a: "Ya, seluruh koleksi EA gratis selamanya. Satu-satunya 'pembayaran' adalah kamu bergabung sebagai klien IB di bawah afiliasi GoldPulsarEA melalui Exness — tanpa biaya apa pun darimu."
  },
  {
    q: "Kenapa saya harus pindah afiliasi/partner?",
    a: "GoldPulsarEA didukung oleh program IB Exness. Dengan kamu bergabung under afiliasi kami, broker memberi komisi kepada kami sehingga EA premium bisa dibagikan gratis ke kamu."
  },
  {
    q: "Akun lama saya bisa dipakai?",
    a: "Tidak. Akun yang dibuat sebelum perpindahan partner disetujui tetap tercatat milik partner lama selamanya. Kamu wajib membuat akun real BARU setelah perpindahan disetujui."
  },
  {
    q: "Berapa deposit minimum?",
    a: "Minimal $100 langsung ke akun real baru yang kamu buat setelah perpindahan disetujui. Transfer antar akun tidak dihitung."
  },
  {
    q: "Berapa lama proses klaim saya diproses?",
    a: "Setelah kamu submit nomor akun, sistem mengecek secara berkala. Jika datamu sudah cocok dengan afiliasi kami, akses unduhan terbuka. Biasanya maksimal beberapa jam setelah Exness menyetujui perpindahanmu."
  },
  {
    q: "Apakah EA cocok untuk pemula?",
    a: "Ya. Setiap EA dilengkapi panduan setting dan rekomendasi pair serta timeframe. Untuk awal, kami merekomendasikan Pulsar Scalper XAU dengan risk rendah di akun cent atau micro."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Pertanyaan Umum
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-3">
          {ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <div className={`overflow-hidden rounded-xl border transition-colors ${open ? "border-gold/40 bg-gold/[0.05]" : "border-white/10 bg-white/[0.03]"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <svg
                      className={`shrink-0 text-gold-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {open && <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
