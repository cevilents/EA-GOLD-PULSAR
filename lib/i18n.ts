export type Locale = "id" | "en";

export interface StatItem {
  value: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface TutorialStep {
  title: string;
  body: string;
  bullets: string[];
  warning: string | null;
  wallet: boolean;
}

export interface Dictionary {
  gate: {
    prompt: string;
    indonesian: string;
    english: string;
  };
  nav: {
    links: {
      koleksi: string;
      caraKlaim: string;
      faq: string;
    };
    cta: string;
    menuAria: string;
  };
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: {
    items: StatItem[];
  };
  collection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    freeBadge: string;
    metrics: {
      winrate: string;
      pf: string;
      maxDd: string;
      tf: string;
    };
  };
  tutorial: {
    eyebrow: string;
    title: string;
    subtitle: string;
    walletLabel: string;
    copy: string;
    copied: string;
    steps: TutorialStep[];
  };
  checker: {
    title: string;
    subtitle: string;
    accountLabel: string;
    checkButton: string;
    checking: string;
    resultNotFoundTitle: string;
    resultNotFoundBody: string;
    resultBelowTitle: string;
    resultBelowBody: string;
    yourDeposit: string;
    yourBalance: string;
    requirementSeparator: string;
    activeTitle: string;
    activeBody: string;
    checkAnother: string;
    centRecommendation: string;
  };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    telegramLabel: string;
    accountLabel: string;
    accountPlaceholder: string;
    accountHelper: string;
    submit: string;
    submitting: string;
    approvedTitle: string;
    approvedBody: string;
    pendingTitle: string;
    pendingBody: string;
    rejectedTitle: string;
    rejectedBody: string;
    checkAgain: string;
    checking: string;
    notFound: string;
    fallbackError: string;
    networkError: string;
    errors: {
      name: string;
      email: string;
      telegram: string;
      account: string;
    };
  };
  download: {
    lockedTitle: string;
    lockedBody: string;
    unlockedTitle: string;
    unlockedBody: string;
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  footer: {
    disclaimer: string;
    needHelp: string;
    contactLink: string;
    rights: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  id: {
    gate: {
      prompt: "Pilih Bahasa / Choose Language",
      indonesian: "Bahasa Indonesia",
      english: "English"
    },
    nav: {
      links: {
        koleksi: "Koleksi EA",
        caraKlaim: "Cara Klaim",
        faq: "FAQ"
      },
      cta: "Klaim Lisensi",
      menuAria: "Buka menu"
    },
    hero: {
      badge: "100% Gratis — Syarat: Affiliasi Exness",
      headline1: "EA XAUUSD Premium.",
      headline2: "Gratis 100%.",
      description:
        "Koleksi Expert Advisor gold performa tinggi untuk akun Exness kamu. Satu syarat: pindah afiliasi ke IB GoldPulsarEA, submit nomor akunmu, dan seluruh koleksi menjadi milikmu.",
      ctaPrimary: "Lihat Koleksi EA",
      ctaSecondary: "Klaim Sekarang"
    },
    stats: {
      items: [
        { value: "6", label: "EA Premium" },
        { value: "2.400+", label: "Trader Aktif" },
        { value: "XAUUSD", label: "Spesialis Gold" },
        { value: "24/7", label: "Dukungan" }
      ]
    },
    collection: {
      eyebrow: "Koleksi EA",
      title: "Enam Senjata untuk Menaklukkan Gold",
      subtitle:
        "Setiap EA punya karakter dan strategi berbeda. Pilih yang cocok dengan gaya tradingmu — semuanya gratis.",
      freeBadge: "GRATIS",
      metrics: {
        winrate: "Winrate",
        pf: "PF",
        maxDd: "Max DD",
        tf: "TF"
      }
    },
    tutorial: {
      eyebrow: "Cara Klaim",
      title: "Aktivasi VIP via Exness",
      subtitle: "Ikuti 5 langkah ini dengan urutan. Jangan loncat — setiap langkah punya syarat.",
      walletLabel: "Wallet Partner GoldPulsarEA",
      copy: "Salin Nomor",
      copied: "Tersalin!",
      steps: [
        {
          title: "Pindah Affiliasi + Isi Wallet Partner",
          body:
            "Buka Live Chat Exness → kirim pesan “Partner Change” → klik link form dari Exness Assistant. Di kolom “New partner’s link or wallet account number”, tempel nomor di bawah.",
          bullets: [],
          warning:
            "Jangan diketik manual — satu digit salah, permintaan ditolak. Gunakan tombol salin.",
          wallet: true
        },
        {
          title: "Tunggu Disetujui Exness",
          body:
            "Lengkapi sisa form → Submit → tunggu persetujuan Exness. Bisa makan waktu beberapa jam.",
          bullets: [],
          warning:
            "Jangan buat akun apa pun sebelum ini disetujui — akun yang dibuat lebih dulu tetap terhitung milik partner lama.",
          wallet: false
        },
        {
          title: "WAJIB: Buat Akun Real BARU Setelah Disetujui",
          body:
            "Begitu Exness mengonfirmasi perpindahan partner berhasil, buat akun real BARU. Akun real yang kamu punya sebelumnya tetap tercatat di partner lama dan tidak akan pernah terhitung ke GoldPulsarEA, berapa pun depositnya. Perpindahan partner hanya berlaku untuk akun yang dibuat sesudah disetujui.",
          bullets: [
            "Pastikan Exness sudah mengonfirmasi perpindahan partner",
            "Masuk ke Personal Area Exness → buat akun real baru",
            "Catat nomor akun barunya — itu yang dipakai di langkah berikutnya",
            "Rekomendasi: pilih tipe **Standard Cent** (micro) — nilai pip lebih kecil, risiko dollar per trade lebih rendah, cocok untuk EA scalper"
          ],
          warning:
            "Akun DEMO tidak dihitung. Harus akun real, dan harus dibuat setelah perpindahan disetujui.",
          wallet: false
        },
        {
          title: "Deposit Minimal $100 ke Akun BARU",
          body:
            "Deposit langsung ke akun real yang baru kamu buat — bukan akun lama. Transfer saldo antar akun tidak dihitung.",
          bullets: [],
          warning: "Deposit ke akun lama tidak akan membuat klaimmu valid.",
          wallet: false
        },
        {
          title: "Submit Nomor Akun di Form Bawah",
          body:
            "Masukkan nomor akun real BARU-mu di form bawah untuk mengecek statusnya. Selama belum aktif, sistem menunjukkan apa yang masih kurang — begitu akunmu aktif di afiliasi kami, klaim lisensi langsung terbuka.",
          bullets: [],
          warning: null,
          wallet: false
        }
      ]
    },
    checker: {
      title: "Cek Akun Dulu",
      subtitle:
        "Masukkan nomor akun real BARU-mu untuk mengecek apakah sudah terbaca dan memenuhi syarat di afiliasi kami sebelum klaim.",
      accountLabel: "Nomor Akun Real",
      checkButton: "Cek Akun",
      checking: "Memeriksa…",
      resultNotFoundTitle: "Akun Belum Terbaca di Afiliasi Kami",
      resultNotFoundBody:
        "Kemungkinan perpindahan IB kamu belum di-ACC Exness, atau akun dibuat sebelum persetujuan. Pastikan akun dibuat SETELAH perpindahan disetujui — lihat kembali langkah 1–3 di atas.",
      resultBelowTitle: "Akun Terbaca, Tapi Belum Memenuhi Syarat",
      resultBelowBody:
        "Ada dua kemungkinan: (a) kamu belum membuat akun real BARU atau belum deposit ke akun tersebut, atau (b) saldo/deposit masih di bawah syarat minimum.",
      yourDeposit: "Deposit kamu {amount} / syarat {required}",
      yourBalance: "Saldo {amount} / syarat {required}",
      requirementSeparator: " · ",
      activeTitle: "Akun aktif!",
      activeBody:
        "Akunmu sudah terverifikasi under afiliasi GoldPulsarEA. Silakan klaim lisensimu di bawah.",
      checkAnother: "Cek akun lain",
      centRecommendation:
        "Rekomendasi: gunakan akun CENT (micro) untuk lebih aman — nilai pip lebih kecil, risiko dollar per trade lebih rendah, cocok untuk EA scalper."
    },
    form: {
      eyebrow: "Langkah Terakhir",
      title: "Klaim Lisensimu",
      subtitle:
        "Sudah pindah afiliasi dan deposit di akun baru? Submit nomor akun real-mu sekarang.",
      nameLabel: "Nama Lengkap",
      namePlaceholder: "Nama sesuai akun Exness",
      emailLabel: "Email",
      emailPlaceholder: "nama@email.com",
      telegramLabel: "Username Telegram (opsional)",
      accountLabel: "Nomor Akun Real BARU",
      accountPlaceholder: "Contoh: 12345678",
      accountHelper:
        "Akun demo tidak dihitung. Harus akun real yang dibuat setelah perpindahan partner disetujui.",
      submit: "Submit & Buka Unduhan",
      submitting: "Mengirim…",
      approvedTitle: "Klaim terverifikasi!",
      approvedBody:
        "Datamu sudah cocok dengan catatan afiliasi kami. Unduhan semua EA sudah terbuka di bawah.",
      pendingTitle: "Menunggu Verifikasi",
      pendingBody:
        "Datamu sudah kami terima dan sistem mengecek berkala ke Exness — proses bisa memakan waktu beberapa jam setelah deposit masuk. Tidak perlu submit ulang.",
      rejectedTitle: "Klaim Ditolak",
      rejectedBody:
        "Klaim kamu ditolak admin. Hubungi admin via Telegram untuk info lebih lanjut.",
      checkAgain: "Cek Status Lagi",
      checking: "Memeriksa…",
      notFound:
        "Klaim belum ditemukan. Pastikan kamu sudah submit form dengan nomor akun yang benar.",
      fallbackError: "Terjadi kesalahan. Coba lagi.",
      networkError: "Tidak dapat terhubung ke server. Periksa koneksi internetmu.",
      errors: {
        name: "Nama harus 2–60 karakter.",
        email: "Email tidak valid.",
        telegram: "Username Telegram tidak valid.",
        account: "Nomor akun harus 5–12 angka tanpa karakter lain."
      }
    },
    download: {
      lockedTitle: "Download Terkunci",
      lockedBody:
        "Selesaikan langkah 1–4 di atas, lalu submit nomor akun real-mu di form untuk membuka semua file EA.",
      unlockedTitle: "Klaim Terverifikasi — Akses Dibuka!",
      unlockedBody:
        "Unduh semua EA di bawah. Password setting ada di grup Telegram kamu.",
      cta: "Unduh"
    },
    faq: {
      eyebrow: "FAQ",
      title: "Pertanyaan Umum",
      items: [
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
      ]
    },
    footer: {
      disclaimer:
        "Peringatan Risiko: Perdagangan forex dan CFD memiliki tingkat risiko tinggi dan dapat mengakibatkan hilangnya seluruh modal Anda. Kinerja masa lalu tidak menjamin hasil di masa depan. Gunakan hanya dana yang siap Anda rugikan. GoldPulsarEA tidak memberikan nasihat investasi.",
      needHelp: "Butuh bantuan?",
      contactLink: "Hubungi admin via Telegram",
      rights: "© {year} GoldPulsarEA. Semua hak dilindungi."
    }
  },
  en: {
    gate: {
      prompt: "Pilih Bahasa / Choose Language",
      indonesian: "Bahasa Indonesia",
      english: "English"
    },
    nav: {
      links: {
        koleksi: "EA Collection",
        caraKlaim: "How to Claim",
        faq: "FAQ"
      },
      cta: "Claim License",
      menuAria: "Open menu"
    },
    hero: {
      badge: "100% Free — Requirement: Exness Affiliate",
      headline1: "Premium XAUUSD EAs.",
      headline2: "100% Free.",
      description:
        "A high-performance gold Expert Advisor collection for your Exness account. One condition: move your affiliate to the GoldPulsarEA IB, submit your account number, and the entire collection is yours.",
      ctaPrimary: "Browse the EA Collection",
      ctaSecondary: "Claim Yours Now"
    },
    stats: {
      items: [
        { value: "6", label: "Premium EAs" },
        { value: "2,400+", label: "Active Traders" },
        { value: "XAUUSD", label: "Gold Specialist" },
        { value: "24/7", label: "Support" }
      ]
    },
    collection: {
      eyebrow: "EA Collection",
      title: "Six Weapons to Conquer Gold",
      subtitle:
        "Every EA brings its own character and strategy. Pick the one that matches your trading style — all of them free.",
      freeBadge: "FREE",
      metrics: {
        winrate: "Winrate",
        pf: "PF",
        maxDd: "Max DD",
        tf: "TF"
      }
    },
    tutorial: {
      eyebrow: "How to Claim",
      title: "VIP Activation via Exness",
      subtitle:
        "Follow these 5 steps in exact order. Don't skip any — every step has its own requirements.",
      walletLabel: "GoldPulsarEA Partner Wallet",
      copy: "Copy Number",
      copied: "Copied!",
      steps: [
        {
          title: "Switch Affiliate + Fill In the Partner Wallet",
          body:
            "Open Exness Live Chat → send the message “Partner Change” → click the form link from the Exness Assistant. In the “New partner’s link or wallet account number” field, paste the number below.",
          bullets: [],
          warning:
            "Never type it manually — a single wrong digit gets your request rejected. Use the copy button.",
          wallet: true
        },
        {
          title: "Wait for Exness Approval",
          body:
            "Complete the rest of the form → Submit → wait for Exness approval. This can take a few hours.",
          bullets: [],
          warning:
            "Don't create any account before this is approved — accounts opened earlier still count under your old partner.",
          wallet: false
        },
        {
          title: "REQUIRED: Open a NEW Real Account After Approval",
          body:
            "Once Exness confirms the partner change succeeded, open a NEW real account. Any real account you held before stays recorded under the old partner forever and will never count toward GoldPulsarEA, no matter how much you deposit. The partner change only applies to accounts created after approval.",
          bullets: [
            "Make sure Exness has confirmed the partner change",
            "Log in to your Exness Personal Area → open a new real account",
            "Write down the new account number — you'll need it in the next step",
            "Recommendation: choose **Standard Cent** (micro) — smaller pip value, lower dollar risk per trade, ideal for EA scalpers"
          ],
          warning:
            "DEMO accounts don't count. It must be a real account, created after the transfer is approved.",
          wallet: false
        },
        {
          title: "Deposit at Least $100 into the NEW Account",
          body:
            "Deposit directly into the brand-new real account you just created — not the old one. Internal balance transfers between accounts don't count.",
          bullets: [],
          warning: "Depositing into your old account won't make your claim valid.",
          wallet: false
        },
        {
          title: "Submit Your Account Number in the Form Below",
          body:
            "Enter your NEW real account number in the form below to check its status. While it isn't active yet, the system shows what's still missing — as soon as your account reads active under our affiliate, the license claim unlocks.",
          bullets: [],
          warning: null,
          wallet: false
        }
      ]
    },
    checker: {
      title: "Check Your Account First",
      subtitle:
        "Enter your NEW real account number to verify it already shows and qualifies under our affiliate before claiming.",
      accountLabel: "Real Account Number",
      checkButton: "Check Account",
      checking: "Checking…",
      resultNotFoundTitle: "Account Not Visible Under Our Affiliate Yet",
      resultNotFoundBody:
        "Your IB transfer likely hasn't been approved by Exness yet, or the account was created before approval. Make sure the account is created AFTER the transfer is approved — revisit steps 1–3 above.",
      resultBelowTitle: "Account Found, But Requirements Not Met Yet",
      resultBelowBody:
        "Two possibilities: (a) you haven't opened a NEW real account or deposited into it yet, or (b) your deposit/balance is still below the minimum requirement.",
      yourDeposit: "Your deposit {amount} / required {required}",
      yourBalance: "Balance {amount} / required {required}",
      requirementSeparator: " · ",
      activeTitle: "Account active!",
      activeBody:
        "Your account is verified under the GoldPulsarEA affiliate. Claim your license below.",
      checkAnother: "Check another account",
      centRecommendation:
        "Recommendation: use a CENT (micro) account for safety — smaller pip value, lower dollar risk per trade, ideal for EA scalpers."
    },
    form: {
      eyebrow: "Final Step",
      title: "Claim Your License",
      subtitle:
        "Already switched affiliates and deposited into your new account? Submit your real account number now.",
      nameLabel: "Full Name",
      namePlaceholder: "Name matching your Exness account",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      telegramLabel: "Telegram Username (optional)",
      accountLabel: "NEW Real Account Number",
      accountPlaceholder: "e.g. 12345678",
      accountHelper:
        "Demo accounts don't count. Must be a real account created after the partner change is approved.",
      submit: "Submit & Unlock Downloads",
      submitting: "Sending…",
      approvedTitle: "Claim verified!",
      approvedBody:
        "Your data matches our affiliate records. Downloads for every EA are unlocked below.",
      pendingTitle: "Waiting for Verification",
      pendingBody:
        "We've received your data and the system checks Exness periodically — this can take a few hours after your deposit lands. No need to resubmit.",
      rejectedTitle: "Claim Rejected",
      rejectedBody:
        "Your claim was rejected by the admin. Contact the admin via Telegram for more information.",
      checkAgain: "Check Status Again",
      checking: "Checking…",
      notFound:
        "No claim found yet. Make sure you've submitted the form with the correct account number.",
      fallbackError: "Something went wrong. Please try again.",
      networkError: "Cannot reach the server. Please check your internet connection.",
      errors: {
        name: "Name must be 2–60 characters.",
        email: "Invalid email address.",
        telegram: "Invalid Telegram username.",
        account: "Account number must be 5–12 digits with no other characters."
      }
    },
    download: {
      lockedTitle: "Downloads Locked",
      lockedBody:
        "Complete steps 1–4 above, then submit your real account number in the form to unlock every EA file.",
      unlockedTitle: "Claim Verified — Access Unlocked!",
      unlockedBody:
        "Download all EAs below. Your set-file password is waiting in your Telegram group.",
      cta: "Download"
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Are the EAs really free?",
          a: "Yes, the entire EA collection is free forever. The only 'payment' is joining as an IB client under the GoldPulsarEA affiliate through Exness — at no cost whatsoever to you."
        },
        {
          q: "Why do I have to switch affiliates/partners?",
          a: "GoldPulsarEA is backed by the Exness IB program. When you join under our affiliate, the broker pays us a commission — which is what lets us share premium EAs with you for free."
        },
        {
          q: "Can I use my existing account?",
          a: "No. Accounts created before the partner change is approved remain registered to your old partner permanently. You must open a NEW real account after the transfer is approved."
        },
        {
          q: "What is the minimum deposit?",
          a: "At least $100, deposited directly into the new real account you open after the transfer is approved. Internal transfers between accounts don't count."
        },
        {
          q: "How long does the claim process take?",
          a: "After you submit your account number, the system checks periodically. Once your data matches our affiliate records, downloads unlock automatically. Usually within a few hours of Exness approving your transfer."
        },
        {
          q: "Are these EAs suitable for beginners?",
          a: "Yes. Every EA comes with setup guidance plus recommended pairs and timeframes. To start, we recommend Pulsar Scalper XAU on low risk in a cent or micro account."
        }
      ]
    },
    footer: {
      disclaimer:
        "Risk Warning: Forex and CFD trading carry a high level of risk and can result in the loss of all your capital. Past performance does not guarantee future results. Only trade with funds you can afford to lose. GoldPulsarEA does not provide investment advice.",
      needHelp: "Need help?",
      contactLink: "Contact admin via Telegram",
      rights: "© {year} GoldPulsarEA. All rights reserved."
    }
  }
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
