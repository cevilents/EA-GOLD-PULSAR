import type { Locale } from "@/lib/i18n";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  flag: string;
  avatar: string;
  profit: string;
  comment: string;
  commentEn?: string;
  rating: number;
}

export interface ProfitCard {
  id: string;
  eaName: string;
  returnPct: string;
  duration: string;
  initialDeposit: string;
  winLoss: string;
  highlight: string;
  highlightEn?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "andi",
    name: "Andi S.",
    location: "Jakarta",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/andi.png",
    profit: "+$2,450",
    comment: "Baru 2 bulan pakai Phoenix Cent, saldo awal $500 sekarang udah $745. Withdraw pertama langsung cair. Mantap!",
    commentEn: "Only 2 months using Phoenix Cent, $500 starting balance is now $745. First withdrawal processed immediately. Awesome!",
    rating: 5
  },
  {
    id: "riko",
    name: "Riko P.",
    location: "Surabaya",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/riko.png",
    profit: "+$1,820",
    comment: "Phoenix Alpha V5 bener-bener beda. Multi-pair analysis-nya akurat, nggak perlu monitor terus. Passive income beneran.",
    commentEn: "Phoenix Alpha V5 is truly different. The multi-pair analysis is accurate, no need to monitor constantly. Real passive income.",
    rating: 5
  },
  {
    id: "sari",
    name: "Sari W.",
    location: "Bandung",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/sari.png",
    profit: "+$3,100",
    comment: "Phoenix DCA auto-nya keren. Drawdown kecil, profit konsisten. Cocok buat yang nggak mau ribet.",
    commentEn: "Phoenix DCA auto is amazing. Low drawdown, consistent profit. Perfect for those who don't want hassle.",
    rating: 5
  }
];

export const PROFIT_CARDS: ProfitCard[] = [
  {
    id: "phoenix-cent",
    eaName: "Phoenix Cent",
    returnPct: "+85%",
    duration: "3 Bulan",
    initialDeposit: "$500",
    winLoss: "78/22",
    highlight: "Cocok untuk pemula dengan modal kecil",
    highlightEn: "Perfect for beginners with small capital"
  },
  {
    id: "phoenix-alpha",
    eaName: "Phoenix Alpha V5",
    returnPct: "+125%",
    duration: "4 Bulan",
    initialDeposit: "$1,000",
    winLoss: "76/24",
    highlight: "Multi-pair analysis menghasilkan profit lebih",
    highlightEn: "Multi-pair analysis generates more profit"
  },
  {
    id: "phoenix-breakout",
    eaName: "Phoenix Breakout",
    returnPct: "+92%",
    duration: "3 Bulan",
    initialDeposit: "$750",
    winLoss: "79/21",
    highlight: "Breakout akurat dengan filter false signal",
    highlightEn: "Accurate breakouts with false signal filter"
  }
];

export function getTestimonial(t: Testimonial, locale: Locale): string {
  if (locale === "en" && t.commentEn !== undefined) return t.commentEn;
  return t.comment;
}

export function getProfitHighlight(c: ProfitCard, locale: Locale): string {
  if (locale === "en" && c.highlightEn !== undefined) return c.highlightEn;
  return c.highlight;
}
