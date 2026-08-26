import { WHATSAPP_SUPPORT } from "@/data/eas";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-display text-lg font-bold text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
          </span>
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-500">
            Peringatan Risiko: Perdagangan forex dan CFD memiliki tingkat risiko tinggi dan dapat mengakibatkan hilangnya seluruh modal Anda. Kinerja masa lalu tidak menjamin hasil di masa depan. Gunakan hanya dana yang siap Anda rugikan. GoldPulsarEA tidak memberikan nasihat investasi.
          </p>
          <p className="text-xs text-zinc-600">
            Butuh bantuan?{" "}
            <a
              href={WHATSAPP_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:underline"
            >
              Hubungi admin via WhatsApp
            </a>
          </p>
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} GoldPulsarEA. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
