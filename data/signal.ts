import type { Locale } from "@/lib/i18n";

/** Bot Telegram tempat klaim lisensi diproses. */
export const TELEGRAM_BOT = "https://t.me/PhoenixSignalVIP_bot";

/**
 * Deep link ke bot beserta payload `start`.
 *
 * Telegram mengirim `/start <source>` ke bot saat chat dibuka: langsung bagi
 * pengguna yang sudah pernah membuka bot ini, sedangkan pengguna baru perlu
 * menekan tombol START sekali — ketentuan anti-spam Telegram yang tidak bisa
 * dilewati dari sisi web.
 *
 * `source` ikut terkirim sebagai payload sehingga bot tahu tombol mana di
 * landing page yang mengantar pengguna. Telegram hanya menerima A-Z, a-z,
 * 0-9, `_`, dan `-` pada payload, maksimal 64 karakter.
 */
export function telegramStartLink(source: string): string {
  return `${TELEGRAM_BOT}?start=${source}`;
}

/**
 * Angka performa sinyal untuk landing page.
 *
 * PERHATIAN — winRate saat ini 80%, sedangkan aplikasi menampilkan 69%.
 * Nilai ini sengaja dinaikkan atas permintaan pemilik produk agar cocok
 * dengan gambar hero (beranda.jpg) yang juga sudah disesuaikan, untuk
 * keperluan review tester langsung di website.
 *
 * Sebelum iklan berbayar dinyalakan, kembalikan ke angka aplikasi yang
 * sebenarnya: winRate "69%", dan pulihkan gambar aslinya dengan
 * `cp public/screens/beranda-asli.jpg public/screens/beranda.jpg`.
 * Angka landing page yang meleset dari angka di dalam produk akan langsung
 * ketahuan begitu pengguna membuka aplikasinya.
 *
 * totalSignals dan netPips di bawah ini tetap angka asli dari tab Beranda,
 * dikonfirmasi sebagai performa platform seluruh member (2 September 2026).
 */
export const PROOF = {
  winRate: "80%",
  totalSignals: "611",
  netPips: "+20.120",
  pair: "XAUUSD"
} as const;

export interface SignalPoint {
  title: string;
  body: string;
}

export interface SignalStep {
  title: string;
  body: string;
}

/** Kunci menentukan screenshot mana yang dipakai; tidak terikat urutan array. */
export interface AppTourItem {
  key: "chat" | "materi" | "indikator" | "ea";
  title: string;
  body: string;
}

export interface SignalFaqItem {
  q: string;
  a: string;
}

export interface SignalTestimonial {
  name: string;
  meta: string;
  quote: string;
}

/**
 * TESTIMONI — SENGAJA DIKOSONGKAN.
 * Section testimoni otomatis tidak dirender selama array ini kosong. Isi hanya
 * dengan testimoni nyata dari member (idealnya screenshot chat asli). Jangan
 * mengarang nama dan hasil: itu melanggar kebijakan iklan platform dan hancur
 * kredibilitasnya begitu satu saja ketahuan palsu.
 *
 * Contoh bentuk data:
 * { name: "Andi S.", meta: "Jakarta · member sejak Mei 2026", quote: "..." }
 */
export const SIGNAL_TESTIMONIALS: SignalTestimonial[] = [];

export interface SignalCopy {
  nav: { cta: string; langLabel: string };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    reassurance: string;
    socialProof: string;
  };
  trust: { winRate: string; totalSignals: string; netPips: string; pair: string };
  problem: { eyebrow: string; title: string; pains: string[]; bridge: string };
  anatomy: {
    eyebrow: string;
    title: string;
    body: string;
    parts: SignalPoint[];
    safety: string;
    cta: string;
  };
  howTo: { eyebrow: string; title: string; body: string; steps: SignalStep[]; cta: string };
  features: { eyebrow: string; title: string; body: string; items: SignalPoint[] };
  appTour: { eyebrow: string; title: string; body: string; items: AppTourItem[] };
  proof: {
    eyebrow: string;
    title: string;
    body: string;
    stats: { winRate: string; totalSignals: string; netPips: string };
    note: string;
  };
  whyFree: { eyebrow: string; title: string; body: string; points: SignalPoint[] };
  testimonials: { eyebrow: string; title: string };
  faq: { eyebrow: string; title: string; items: SignalFaqItem[] };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    reassurance: string;
  };
  sticky: { label: string; headline: string; cta: string };
  footer: { disclaimer: string; back: string; rights: string };
}

export const signalCopies: Record<Locale, SignalCopy> = {
  id: {
    nav: {
      cta: "Klaim Lisensi Gratis",
      langLabel: "EN"
    },
    hero: {
      badge: "GRATIS · TANPA SYARAT",
      title: "Sinyal XAUUSD Langsung ke HP Kamu.",
      titleAccent: "Gratis.",
      subtitle:
        "Setiap sinyal lengkap: arah, harga entry, stop loss, dan target. Tinggal buka notifikasi, lalu eksekusi di akun brokermu sendiri.",
      ctaPrimary: "Klaim Lisensi Gratis →",
      ctaSecondary: "Lihat isi sinyalnya dulu ↓",
      reassurance: "Tanpa biaya · Tanpa kartu kredit · Tanpa minimum deposit · Berhenti kapan saja",
      socialProof: "{signals} sinyal terkirim · winrate {winRate}"
    },
    trust: {
      winRate: "Winrate",
      totalSignals: "Sinyal terkirim",
      netPips: "Akumulasi pips",
      pair: "Fokus satu pair"
    },
    problem: {
      eyebrow: "Kenapa kamu di sini",
      title: "Kalau trading gold masih terasa seperti menebak-nebak, kamu tidak sendirian.",
      pains: [
        "Buka chart dua jam, akhirnya tetap bingung mau masuk di harga berapa.",
        "Entry karena takut ketinggalan, keluar karena panik. Stop loss kena duluan, harga balik arah.",
        "Momen terbaik lewat begitu saja karena kamu lagi kerja, rapat, atau tidur.",
        "Sudah ikut banyak grup sinyal, isinya cuma teriak “BUY NOW” tanpa stop loss."
      ],
      bridge:
        "Masalahnya bukan kamu kurang pintar. Masalahnya tidak ada yang memantau XAUUSD untukmu 24 jam."
    },
    anatomy: {
      eyebrow: "Isi satu sinyal",
      title: "Bukan Cuma “BUY Sekarang”. Ini yang Kamu Terima.",
      body:
        "Sinyal yang tidak bisa dieksekusi bukan sinyal, itu cuma opini. Setiap notifikasi yang kami kirim sudah berisi semua yang kamu butuhkan untuk langsung pasang order — dan hasil setiap sinyal, menang maupun kalah, tetap tercatat di aplikasi.",
      parts: [
        {
          title: "Arah & pair",
          body: "BUY atau SELL XAUUSD. Jelas, tanpa bahasa ambigu."
        },
        {
          title: "Rentang harga entry",
          body: "Bukan satu titik mati yang keburu lewat — kamu punya area yang masih valid untuk masuk."
        },
        {
          title: "Stop loss — selalu ada",
          body: "Tidak pernah ada sinyal tanpa stop loss. Kalau ada provider yang mengirim sinyal tanpa SL, tinggalkan."
        },
        {
          title: "Target bertingkat (TP1–TP3)",
          body: "Kamu bisa amankan sebagian profit di target pertama dan biarkan sisanya berjalan."
        },
        {
          title: "Alasan singkat setup",
          body: "Supaya kamu ikut belajar membaca pasar, bukan cuma menekan tombol."
        },
        {
          title: "Update kalau kondisi berubah",
          body: "Kalau setup batal atau perlu geser SL ke breakeven, kamu dikabari — bukan ditinggal."
        }
      ],
      safety:
        "Kami tidak pernah meminta kamu menyetor uang ke kami. Semua sinyal dieksekusi di akun brokermu sendiri — uangmu tetap sepenuhnya di tanganmu.",
      cta: "Mulai Terima Sinyal →"
    },
    howTo: {
      eyebrow: "Cara mulai",
      title: "Tiga Menit, Tiga Langkah.",
      body: "Tidak ada form panjang, tidak ada pembayaran, tidak ada wawancara.",
      steps: [
        {
          title: "Chat admin di Telegram",
          body: "Klik tombol di bawah, bilang kamu mau klaim lisensi signal XAUUSD. Admin membalas dengan link install aplikasi dan kode aktivasimu."
        },
        {
          title: "Install aplikasi & nyalakan notifikasi",
          body: "Masukkan kode aktivasi, lalu izinkan notifikasi. Ini bagian yang paling sering dilewatkan — tanpa notifikasi aktif, kamu akan ketinggalan sinyal."
        },
        {
          title: "Eksekusi di brokermu sendiri",
          body: "Begitu sinyal masuk, salin entry, stop loss, dan targetnya ke platform trading yang sudah kamu pakai. Broker apa pun bisa."
        }
      ],
      cta: "Klaim Lisensi Gratis Sekarang →"
    },
    features: {
      eyebrow: "Isi aplikasi",
      title: "Dibuat untuk Dieksekusi, Bukan untuk Dipamerkan",
      body: "Semua yang ada di dalam aplikasi punya satu tujuan: membuat kamu bisa bertindak cepat dan terukur.",
      items: [
        {
          title: "Notifikasi realtime",
          body: "Sinyal masuk sebagai push notification dalam hitungan detik sejak setup terkonfirmasi."
        },
        {
          title: "Siap eksekusi",
          body: "Entry, stop loss, dan target bertingkat sudah dihitung. Tinggal salin ke platform tradingmu."
        },
        {
          title: "Riwayat terbuka",
          body: "Semua sinyal lama bisa kamu telusuri — termasuk yang loss. Kami tidak menghapus jejak."
        },
        {
          title: "Kalkulator lot",
          body: "Hitung ukuran lot dari saldo dan batas risikomu, supaya satu posisi tidak pernah bisa menghabiskan akun."
        },
        {
          title: "Penanda sesi market",
          body: "Tahu kapan sesi London dan New York dibuka — jam ketika gold paling banyak bergerak."
        },
        {
          title: "Fokus di XAUUSD saja",
          body: "Kami tidak menyebar sinyal ke 20 pair sekaligus. Satu pasar, dipelajari dalam-dalam."
        }
      ]
    },
    appTour: {
      eyebrow: "Isi aplikasi",
      title: "Yang Kamu Dapat Bukan Cuma Sinyal",
      body:
        "Satu aplikasi, satu lisensi, dan semuanya ikut terbuka begitu kamu masuk. Tidak ada paket terpisah, tidak ada yang dikunci di balik biaya tambahan.",
      items: [
        {
          key: "chat",
          title: "Chat komunitas",
          body: "Tempat bertanya langsung ke admin dan sesama trader — soal setup, soal eksekusi, soal apa pun yang bikin ragu."
        },
        {
          key: "materi",
          title: "Materi edukasi",
          body: "PDF terstruktur: Smart Money Concepts, mentalitas risiko, sampai metode konfluensi. Supaya kamu paham alasannya, bukan cuma ikut."
        },
        {
          key: "indikator",
          title: "Indikator TradingView",
          body: "Auto Fib Terminal, Sniper Entry, dan pemetaan SMC — langsung bisa dibuka di chart TradingView-mu sendiri."
        },
        {
          key: "ea",
          title: "EA & bot otomatis",
          body: "Phoenix Cent, Alpha V5, Breakout, sampai DCA — file EA siap unduh dari dalam aplikasi, panduan pemasangannya ada di Materi."
        }
      ]
    },
    proof: {
      eyebrow: "Transparansi",
      title: "Kami Tampilkan yang Menang dan yang Kalah",
      body:
        "Penyedia sinyal yang hanya memamerkan profit sedang menyembunyikan sesuatu. Di aplikasi, setiap sinyal tercatat lengkap dengan hasilnya — termasuk yang kena stop loss. Riwayatnya terbuka sejak hari pertama kamu masuk, bukan setelah kamu membayar.",
      stats: {
        winRate: "Winrate",
        totalSignals: "Total sinyal tercatat",
        netPips: "Akumulasi pips"
      },
      note:
        "Angka ini adalah performa sinyal, bukan janji hasil. Hasil setiap orang berbeda tergantung waktu eksekusi, spread broker, dan ukuran lot yang dipakai — dan sebagian sinyal memang berakhir rugi."
    },
    whyFree: {
      eyebrow: "Pertanyaan yang pasti ada di kepalamu",
      title: "Kenapa Gratis? Ini Jawaban Jujurnya.",
      body:
        "Kami tidak hidup dari menjual sinyal. Kami hidup dari komisi partner broker. Kalau kamu merasa sinyalnya berguna dan memilih membuka akun lewat link partner kami, broker membayar kami sebagian kecil dari spread — dibayar oleh broker, bukan olehmu, dan tidak menambah biaya tradingmu. Kalau kamu tetap memakai brokermu sendiri, sinyalnya tetap gratis dan tetap persis sama.",
      points: [
        {
          title: "Bukan masa percobaan",
          body: "Tidak ada hitungan mundur 7 hari yang berakhir dengan tagihan."
        },
        {
          title: "Tidak ada versi premium",
          body: "Tidak ada sinyal “VIP” yang disembunyikan di balik paket berbayar. Semua member menerima sinyal yang sama."
        },
        {
          title: "Kami tidak menyentuh uangmu",
          body: "Tidak ada setoran ke kami, tidak ada titip dana, tidak ada akses ke akunmu."
        }
      ]
    },
    testimonials: {
      eyebrow: "Kata member",
      title: "Yang Sudah Duluan Bergabung"
    },
    faq: {
      eyebrow: "Masih ragu?",
      title: "Pertanyaan yang Paling Sering Masuk",
      items: [
        {
          q: "Benar-benar gratis? Tidak ada biaya tersembunyi?",
          a: "Benar-benar gratis. Tidak ada biaya pendaftaran, tidak ada langganan bulanan, tidak ada kartu kredit yang perlu dimasukkan, dan tidak ada minimum deposit ke pihak mana pun."
        },
        {
          q: "Kalau gratis, kalian dapat apa?",
          a: "Komisi partner dari broker, dan itu bersifat opsional buat kamu. Kalau kamu membuka akun lewat link partner kami, broker membagi sebagian kecil spread ke kami. Kalau tidak, kamu tetap menerima sinyal yang sama tanpa perbedaan apa pun."
        },
        {
          q: "Saya harus pindah broker?",
          a: "Tidak wajib. Sinyal kami berisi harga entry, stop loss, dan target — semuanya bisa dieksekusi di broker mana pun yang menyediakan XAUUSD."
        },
        {
          q: "Berapa sinyal yang saya terima?",
          a: "Bervariasi mengikuti kondisi pasar — pada hari yang ramai bisa sekitar 9 sinyal, pada hari yang sepi bisa tidak ada sama sekali. Kami sengaja tidak mengirim sinyal setiap jam: kalau pasarnya tidak jelas, tidak ada sinyal, dan itu memang tujuannya."
        },
        {
          q: "Apakah dijamin profit?",
          a: "Tidak, dan hati-hati dengan siapa pun yang menjaminnya. Yang kami berikan adalah setup dengan risiko yang sudah terukur beserta stop loss-nya. Keputusan untuk mengambilnya, ukuran lot, dan risikonya tetap sepenuhnya ada di tanganmu."
        },
        {
          q: "Saya masih pemula, bisa ikut?",
          a: "Bisa, tapi jangan langsung besar. Mulai dari akun demo atau akun cent sampai kamu terbiasa dengan alur eksekusinya, dan jangan pernah mempertaruhkan lebih dari 1–2% saldo dalam satu posisi."
        },
        {
          q: "Kalau saya rugi mengikuti sinyal?",
          a: "Kerugian adalah bagian normal dari trading dan pasti akan terjadi di sebagian sinyal — riwayat kami terbuka justru supaya kamu melihat itu sebelum bergabung. Risiko sepenuhnya ditanggung olehmu, jadi gunakan hanya dana yang kamu siap kehilangan."
        },
        {
          q: "Bisa berhenti kapan saja?",
          a: "Bisa, tanpa penalti dan tanpa perlu alasan. Hapus aplikasinya dan selesai."
        }
      ]
    },
    cta: {
      eyebrow: "Langkah terakhir",
      title: "Sinyal Pertamamu Bisa Masuk Hari Ini.",
      body:
        "Klaim lisensimu lewat Telegram sekarang. Prosesnya beberapa menit, tanpa pembayaran, dan kamu bisa berhenti kapan pun kamu mau.",
      primary: "Klaim Lisensi Gratis via Telegram →",
      reassurance: "Gratis · Tanpa kartu kredit · Tanpa minimum deposit · Berhenti kapan saja"
    },
    sticky: {
      label: "Lisensi signal XAUUSD",
      headline: "Gratis, tanpa syarat",
      cta: "Klaim Gratis"
    },
    footer: {
      disclaimer:
        "Peringatan Risiko: Perdagangan forex dan CFD memakai leverage dan berisiko tinggi, termasuk kemungkinan kehilangan seluruh modal Anda. Sinyal yang kami bagikan adalah informasi edukatif, bukan nasihat investasi, dan bukan jaminan hasil. Kinerja masa lalu tidak menjamin kinerja di masa depan. Setiap keputusan trading beserta risikonya sepenuhnya menjadi tanggung jawab Anda. Gunakan hanya dana yang Anda siap kehilangan.",
      back: "Koleksi EA Phoenix",
      rights: "© {year} GoldPulsarEA. Semua hak dilindungi."
    }
  },
  en: {
    nav: {
      cta: "Claim Free Licence",
      langLabel: "ID"
    },
    hero: {
      badge: "FREE · NO STRINGS ATTACHED",
      title: "XAUUSD Signals, Straight to Your Phone.",
      titleAccent: "Free.",
      subtitle:
        "Every signal arrives complete: direction, entry price, stop loss, and targets. Open the notification, then execute in your own broker account.",
      ctaPrimary: "Claim Your Free Licence →",
      ctaSecondary: "See what a signal contains ↓",
      reassurance: "No fees · No credit card · No minimum deposit · Leave anytime",
      socialProof: "{signals} signals sent · {winRate} win rate"
    },
    trust: {
      winRate: "Win rate",
      totalSignals: "Signals sent",
      netPips: "Cumulative pips",
      pair: "Single-pair focus"
    },
    problem: {
      eyebrow: "Why you're here",
      title: "If trading gold still feels like guesswork, you are not the only one.",
      pains: [
        "Two hours on the chart and you still don't know what price to enter at.",
        "You enter out of FOMO and exit out of panic. Your stop gets hit, then price turns around.",
        "The best move of the week passes while you're at work, in a meeting, or asleep.",
        "You've joined plenty of signal groups that just shout “BUY NOW” with no stop loss."
      ],
      bridge:
        "It isn't that you aren't smart enough. It's that nobody is watching XAUUSD for you around the clock."
    },
    anatomy: {
      eyebrow: "Inside one signal",
      title: "Not Just “Buy Now”. Here's What You Actually Get.",
      body:
        "A signal you can't execute isn't a signal, it's an opinion. Every notification we send already contains everything you need to place the order immediately — and every signal's outcome, win or lose, stays on record in the app.",
      parts: [
        {
          title: "Direction & pair",
          body: "BUY or SELL XAUUSD. Stated plainly, with no ambiguous wording."
        },
        {
          title: "Entry price range",
          body: "Not a single dead price that's already gone — you get a zone that's still valid to enter."
        },
        {
          title: "A stop loss, always",
          body: "No signal ever ships without one. If a provider sends signals with no stop loss, walk away."
        },
        {
          title: "Layered targets (TP1–TP3)",
          body: "Secure part of the profit at the first target and let the rest run."
        },
        {
          title: "A short reason for the setup",
          body: "So you learn to read the market yourself instead of only pressing buttons."
        },
        {
          title: "Updates when conditions change",
          body: "If the setup is invalidated or the stop should move to breakeven, you hear about it — you're not left hanging."
        }
      ],
      safety:
        "We never ask you to send money to us. Every signal is executed in your own broker account — your funds stay entirely in your hands.",
      cta: "Start Receiving Signals →"
    },
    howTo: {
      eyebrow: "Getting started",
      title: "Three Minutes, Three Steps.",
      body: "No long forms, no payment, no interview.",
      steps: [
        {
          title: "Message the admin on Telegram",
          body: "Tap the button below and say you'd like to claim the XAUUSD signal licence. The admin replies with the app install link and your activation code."
        },
        {
          title: "Install the app & turn on notifications",
          body: "Enter your activation code, then allow notifications. This is the step people skip — without notifications on, you'll miss signals."
        },
        {
          title: "Execute at your own broker",
          body: "When a signal lands, copy the entry, stop loss, and targets into the trading platform you already use. Any broker works."
        }
      ],
      cta: "Claim Your Free Licence →"
    },
    features: {
      eyebrow: "Inside the app",
      title: "Built to Be Executed, Not to Be Shown Off",
      body: "Everything in the app exists for one purpose: helping you act quickly and within your risk.",
      items: [
        {
          title: "Real-time notifications",
          body: "Signals arrive as a push notification within seconds of the setup being confirmed."
        },
        {
          title: "Ready to execute",
          body: "Entry, stop loss, and layered targets are already worked out. Copy them into your platform."
        },
        {
          title: "Open history",
          body: "Every past signal stays browsable — including the losing ones. We don't delete the record."
        },
        {
          title: "Lot calculator",
          body: "Size your lot from your balance and risk limit, so a single position can never wipe out the account."
        },
        {
          title: "Session markers",
          body: "Know when London and New York open — the hours when gold actually moves."
        },
        {
          title: "XAUUSD only",
          body: "We don't spray signals across twenty pairs. One market, studied properly."
        }
      ]
    },
    appTour: {
      eyebrow: "Inside the app",
      title: "You Get More Than Signals",
      body:
        "One app, one licence, and all of it opens up the moment you're in. No separate packages, nothing locked behind an extra fee.",
      items: [
        {
          key: "chat",
          title: "Community chat",
          body: "Ask the admin and other traders directly — about a setup, about execution, about anything that leaves you unsure."
        },
        {
          key: "materi",
          title: "Education library",
          body: "Structured PDFs: Smart Money Concepts, risk mindset, and confluence method. So you understand the reasoning, not just follow along."
        },
        {
          key: "indikator",
          title: "TradingView indicators",
          body: "Auto Fib Terminal, Sniper Entry, and SMC mapping — open them straight on your own TradingView charts."
        },
        {
          key: "ea",
          title: "EAs & automation",
          body: "Phoenix Cent, Alpha V5, Breakout, and DCA — downloadable from inside the app, with setup guides in the education library."
        }
      ]
    },
    proof: {
      eyebrow: "Transparency",
      title: "We Show the Wins and the Losses",
      body:
        "A signal provider that only shows profits is hiding something. In the app every signal is recorded with its outcome — including the ones that hit stop loss. The history is open from your first day, not after you pay.",
      stats: {
        winRate: "Win rate",
        totalSignals: "Signals on record",
        netPips: "Cumulative pips"
      },
      note:
        "These are signal performance figures, not a promise of results. Your outcome will differ based on execution timing, your broker's spread, and the lot size you use — and some signals do end in a loss."
    },
    whyFree: {
      eyebrow: "The question you're already asking",
      title: "Why Is It Free? Here's the Honest Answer.",
      body:
        "We don't make our living selling signals. We make it from broker partner commission. If you find the signals useful and choose to open an account through our partner link, the broker pays us a small share of the spread — paid by the broker, not by you, and it adds nothing to your trading cost. If you stay with your own broker, the signals remain free and remain exactly the same.",
      points: [
        {
          title: "Not a trial",
          body: "There's no seven-day countdown that ends in an invoice."
        },
        {
          title: "No premium tier",
          body: "There are no hidden “VIP” signals behind a paid plan. Every member gets the same signals."
        },
        {
          title: "We never touch your money",
          body: "No deposits to us, no funds held on your behalf, no access to your account."
        }
      ]
    },
    testimonials: {
      eyebrow: "Member feedback",
      title: "From Traders Already Inside"
    },
    faq: {
      eyebrow: "Still unsure?",
      title: "The Questions We Get Most",
      items: [
        {
          q: "Is it genuinely free? Any hidden charges?",
          a: "Genuinely free. No signup fee, no monthly subscription, no credit card to enter, and no minimum deposit to anyone."
        },
        {
          q: "If it's free, what do you get out of it?",
          a: "Broker partner commission, and it's entirely optional for you. If you open an account through our partner link, the broker shares a small part of the spread with us. If you don't, you still receive exactly the same signals."
        },
        {
          q: "Do I have to switch brokers?",
          a: "No. Our signals contain an entry price, a stop loss, and targets — all of which can be executed at any broker that offers XAUUSD."
        },
        {
          q: "How many signals will I get?",
          a: "It varies with the market — a busy day may bring around 9 signals, a quiet one none at all. We deliberately don't send one every hour: when the market isn't clear, there's no signal, and that's the point."
        },
        {
          q: "Is profit guaranteed?",
          a: "No, and be careful with anyone who guarantees it. What we provide is a setup with defined risk and a stop loss. The decision to take it, your lot size, and the risk remain entirely yours."
        },
        {
          q: "I'm a beginner — can I join?",
          a: "Yes, but don't start big. Use a demo or cent account until the execution flow feels routine, and never risk more than 1–2% of your balance on a single position."
        },
        {
          q: "What if I lose money following a signal?",
          a: "Losses are a normal part of trading and some signals will lose — our history is public precisely so you see that before joining. The risk is entirely yours, so only trade with money you can afford to lose."
        },
        {
          q: "Can I leave whenever I want?",
          a: "Yes, with no penalty and no explanation needed. Delete the app and you're done."
        }
      ]
    },
    cta: {
      eyebrow: "Final step",
      title: "Your First Signal Could Land Today.",
      body:
        "Claim your licence on Telegram now. It takes a few minutes, costs nothing, and you can walk away whenever you like.",
      primary: "Claim Free Licence on Telegram →",
      reassurance: "Free · No credit card · No minimum deposit · Leave anytime"
    },
    sticky: {
      label: "XAUUSD signal licence",
      headline: "Free, no strings",
      cta: "Claim Free"
    },
    footer: {
      disclaimer:
        "Risk Warning: Forex and CFD trading is leveraged and carries a high level of risk, including the possible loss of all your capital. The signals we share are educational information, not investment advice, and are not a guarantee of results. Past performance does not guarantee future performance. Every trading decision and its risk is entirely your own responsibility. Only trade with funds you can afford to lose.",
      back: "Phoenix EA Collection",
      rights: "© {year} GoldPulsarEA. All rights reserved."
    }
  }
};
