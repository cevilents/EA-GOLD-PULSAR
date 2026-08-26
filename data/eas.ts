import type { Locale } from "@/lib/i18n";

export const WALLET_PARTNER = "1149206011366637938";

export const WHATSAPP_SUPPORT = "https://wa.me/62xxxxxxxxxx";

export interface EaItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  taglineEn?: string;
  descriptionEn?: string;
  tags: string[];
  winRate: string;
  profitFactor: string;
  maxDd: string;
  timeframe: string;
  file: string;
}

export function eaTagline(ea: EaItem, locale: Locale): string {
  if (locale === "en" && ea.taglineEn !== undefined) return ea.taglineEn;
  return ea.tagline;
}

export function eaDescription(ea: EaItem, locale: Locale): string {
  if (locale === "en" && ea.descriptionEn !== undefined) return ea.descriptionEn;
  return ea.description;
}

export const EAS: EaItem[] = [
  {
    id: "pulsar-scalper-xau",
    name: "Pulsar Scalper XAU",
    tagline: "Scalping kilat di jam London–NY",
    description:
      "Menangkap momentum mikro gold dengan entry cepat di likuiditas tertinggi. Cocok untuk akun kecil, stop loss ketat, target konsisten.",
    taglineEn: "Lightning scalping through London–NY hours",
    descriptionEn:
      "Captures micro momentum in gold with fast entries at peak liquidity. Built for small accounts, tight stop losses, and consistent targets.",
    tags: ["Scalping", "Momentum", "Low Spread"],
    winRate: "87%",
    profitFactor: "2.14",
    maxDd: "6.2%",
    timeframe: "M5",
    file: "PulsarScalperXAU.ex5"
  },
  {
    id: "golden-grid-master",
    name: "Golden Grid Master",
    tagline: "Grid adaptif anti-marjincall",
    description:
      "Grid dinamis dengan filter volatilitas ATR dan proteksi equity otomatis. Dirancang khusus untuk karakter pergerakan XAUUSD.",
    taglineEn: "Adaptive grid with margin-call protection",
    descriptionEn:
      "A dynamic grid with ATR volatility filtering and automatic equity protection. Purpose-built for the way XAUUSD actually moves.",
    tags: ["Grid", "Adaptif", "Equity Guard"],
    winRate: "91%",
    profitFactor: "1.98",
    maxDd: "9.8%",
    timeframe: "M15",
    file: "GoldenGridMaster.ex5"
  },
  {
    id: "aurora-breakout-xau",
    name: "Aurora Breakout XAU",
    tagline: "Breakout range sesi Eropa",
    description:
      "Membaca akumulasi range pre-London lalu meledak saat breakout sesungguhnya. Filter news bawaan menghindari spike berbahaya.",
    taglineEn: "European session range breakouts",
    descriptionEn:
      "Reads pre-London range accumulation, then strikes when the real breakout fires. A built-in news filter steers clear of dangerous spikes.",
    tags: ["Breakout", "Session", "News Filter"],
    winRate: "78%",
    profitFactor: "2.65",
    maxDd: "8.1%",
    timeframe: "M30",
    file: "AuroraBreakoutXAU.ex5"
  },
  {
    id: "nova-recovery-pro",
    name: "Nova Recovery Pro",
    tagline: "Recovery pintar, bukan martingale bodoh",
    description:
      "Sistem recovery bertahap dengan batas lot maksimum dan cut-loss struktural. Mengembalikan posisi minus tanpa mempertaruhkan seluruh equity.",
    taglineEn: "Smart recovery, not reckless martingale",
    descriptionEn:
      "A staged recovery system with maximum lot caps and structural cut-loss. Recovers losing positions without gambling your entire equity.",
    tags: ["Recovery", "Risk Managed"],
    winRate: "83%",
    profitFactor: "1.87",
    maxDd: "11.4%",
    timeframe: "M15",
    file: "NovaRecoveryPro.ex5"
  },
  {
    id: "quantum-trend-sniper",
    name: "Quantum Trend Sniper",
    tagline: "Sniper trend harian gold",
    description:
      "Multi-timeframe confluence mendeteksi arah trend H1–H4, entry presisi saat pullback selesai. Trailing profit otomatis mengunci gain.",
    taglineEn: "Daily gold trend sniper",
    descriptionEn:
      "Multi-timeframe confluence detects the H1–H4 trend direction and enters precisely once pullbacks complete. Automatic trailing profit locks in gains.",
    tags: ["Trend Following", "MTF", "Trailing"],
    winRate: "74%",
    profitFactor: "3.02",
    maxDd: "7.5%",
    timeframe: "H1",
    file: "QuantumTrendSniper.ex5"
  },
  {
    id: "helios-news-guard",
    name: "Helios News Guard",
    tagline: "Spesialis NFP & FOMC",
    description:
      "Mode defensif saat kalender ekonomi merah, mode agresif pasca-news saat likuiditas kembali. Sahabat trader berita gold.",
    taglineEn: "NFP & FOMC specialist",
    descriptionEn:
      "Defensive mode on red calendar days, aggressive mode post-news once liquidity returns. The gold news trader's best friend.",
    tags: ["News Trading", "Volatility"],
    winRate: "81%",
    profitFactor: "2.31",
    maxDd: "9.2%",
    timeframe: "M5",
    file: "HeliosNewsGuard.ex5"
  }
];
