import type { Locale } from "@/lib/i18n";

export const WALLET_PARTNER = "1149206011366637938";

export const TELEGRAM_SUPPORT = "https://t.me/EAGOLDPULSAR";

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
    id: "phoenix-cent",
    name: "Phoenix Cent",
    tagline: "EA untuk akun cent, risiko rendah",
    description:
      "Dirancang khusus untuk akun cent dengan lot minimal. Cocok untuk pemula yang ingin belajar trading dengan risiko terkontrol.",
    taglineEn: "EA for cent accounts, low risk",
    descriptionEn:
      "Purpose-built for cent accounts with minimal lot sizing. Ideal for beginners learning to trade with controlled risk.",
    tags: ["Cent"],
    winRate: "78%",
    profitFactor: "1.65",
    maxDd: "8.5%",
    timeframe: "All Timeframe",
    file: "PhoenixCent.ex5"
  },
  {
    id: "phoenix-alpha-v5",
    name: "Phoenix Alpha V5",
    tagline: " Strategi multi-pair berbasis momentum",
    description:
      "Menganalisis momentum beberapa pair sekaligus dan memilih peluang terbaik. Entry presisi dengan manajemen risiko otomatis.",
    taglineEn: "Multi-pair momentum strategy",
    descriptionEn:
      "Analyzes momentum across multiple pairs simultaneously and selects the best opportunities. Precise entries with automatic risk management.",
    tags: ["Multi-Pair"],
    winRate: "76%",
    profitFactor: "1.92",
    maxDd: "10.2%",
    timeframe: "All Timeframe",
    file: "PhoenixAlphaV5.ex5"
  },
  {
    id: "phoenix-breakout",
    name: "Phoenix Breakout",
    tagline: "Penembusan level kunci otomatis",
    description:
      "Mendeteksi support/resistance kunci dan masuk saat breakout terkonfirmasi. Dilengkapi filter false breakout untuk mengurangi sinyal palsu.",
    taglineEn: "Automatic key level breakouts",
    descriptionEn:
      "Detects key support/resistance levels and enters on confirmed breakouts. Equipped with false breakout filters to reduce fake signals.",
    tags: ["Breakout"],
    winRate: "79%",
    profitFactor: "2.18",
    maxDd: "9.1%",
    timeframe: "All Timeframe",
    file: "PhoenixBreakout.ex5"
  },
  {
    id: "phoenix-dca",
    name: "Phoenix DCA",
    tagline: "Dollar Cost Averaging terstruktur",
    description:
      "Membuka posisi bertahap dengan interval dan lot terukur. Tidak menggunakan martingale — setiap level memiliki batas risiko yang jelas.",
    taglineEn: "Structured Dollar Cost Averaging",
    descriptionEn:
      "Opens positions gradually with measured intervals and lot sizes. No martingale — each level has clear risk limits.",
    tags: ["DCA"],
    winRate: "81%",
    profitFactor: "1.78",
    maxDd: "12.3%",
    timeframe: "All Timeframe",
    file: "PhoenixDCA.ex5"
  },
  {
    id: "phoenix-dashboard",
    name: "Phoenix Dashboard",
    tagline: "Panel monitoring semua EA Phoenix",
    description:
      "Menampilkan performa real-time semua EA Phoenix dalam satu panel. Monitoring equity, drawdown, dan profit dari satu tempat.",
    taglineEn: "Monitor all Phoenix EAs in one panel",
    descriptionEn:
      "Displays real-time performance of all Phoenix EAs in a single panel. Monitor equity, drawdown, and profit from one place.",
    tags: ["Dashboard"],
    winRate: "—",
    profitFactor: "—",
    maxDd: "—",
    timeframe: "All Timeframe",
    file: "PhoenixDashboard.ex5"
  },
  {
    id: "phoenix-demond",
    name: "Phoenix Demond",
    tagline: "EA agresif target besar",
    description:
      "Strategi agresif dengan target profit tinggi dan toleransi drawdown lebih besar. Cocok untuk akun yang siap menangani volatilitas.",
    taglineEn: "Aggressive EA with big targets",
    descriptionEn:
      "Aggressive strategy with high profit targets and larger drawdown tolerance. Suited for accounts that can handle volatility.",
    tags: ["Aggressive"],
    winRate: "68%",
    profitFactor: "2.45",
    maxDd: "15.8%",
    timeframe: "All Timeframe",
    file: "PhoenixDemond.ex5"
  },
  {
    id: "phoenix-idr",
    name: "Phoenix IDR",
    tagline: "EA khusus akun Rupiah",
    description:
      "Optimized untuk akun dengan mata uang IDR. Menyesuaikan spread dan komisi khas broker lokal Indonesia.",
    taglineEn: "EA for Rupiah accounts only",
    descriptionEn:
      "Optimized for IDR-denominated accounts. Adjusts for the spreads and commissions typical of local Indonesian brokers.",
    tags: ["IDR"],
    winRate: "77%",
    profitFactor: "1.85",
    maxDd: "9.7%",
    timeframe: "All Timeframe",
    file: "PhoenixIDR.ex5"
  }
];
