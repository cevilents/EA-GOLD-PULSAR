import type { Locale } from "@/lib/i18n";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  flag: string;
  avatar: string;
  profit: string;
  duration: string;
  type: "pemula" | "berpengalaman";
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
  monthlyReturn: string;
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
    duration: "2 bulan",
    type: "pemula",
    comment: "Baru mulai trading 3 bulan lalu. Pakai Phoenix Cent, saldo awal $500 sekarang udah $745. Withdraw pertama langsung cair. Gak nyangka bisa profit dari EA gratis!",
    commentEn: "Started trading 3 months ago. Using Phoenix Cent, $500 starting balance is now $745. First withdrawal processed immediately. Can't believe I could profit from a free EA!",
    rating: 5
  },
  {
    id: "riko",
    name: "Riko P.",
    location: "Surabaya",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/riko.png",
    profit: "+$4,820",
    duration: "4 bulan",
    type: "berpengalaman",
    comment: "Phoenix Alpha V5 bener-bener beda dari EA lain. Multi-pair analysis-nya akurat, profit konsisten. Udah 4 tahun trading, ini EA terbaik yang pernah saya pakai.",
    commentEn: "Phoenix Alpha V5 is truly different from other EAs. The multi-pair analysis is accurate, consistent profit. 4 years trading, this is the best EA I've ever used.",
    rating: 5
  },
  {
    id: "sari",
    name: "Sari W.",
    location: "Bandung",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/sari.png",
    profit: "+$3,100",
    duration: "3 bulan",
    type: "pemula",
    comment: "Awalnya takut pakai EA, tapi Phoenix DCA auto-nya beneran work. Drawdown kecil, profit stabil. Cocok banget buat yang masih pemula kayak saya.",
    commentEn: "Initially afraid to use EAs, but Phoenix DCA auto really works. Low drawdown, stable profit. Perfect for beginners like me.",
    rating: 5
  },
  {
    id: "budi",
    name: "Budi K.",
    location: "Medan",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/budi.png",
    profit: "+$8,750",
    duration: "6 bulan",
    type: "berpengalaman",
    comment: "Phoenix Breakout + Phoenix Demond combo gila! $2,000 jadi $10,750 dalam 6 bulan. udah withdraw 3x, semuanya lancar. GoldPulsarEA the best!",
    commentEn: "Phoenix Breakout + Phoenix Demond combo is insane! $2,000 became $10,750 in 6 months. Withdrawn 3 times, all smooth. GoldPulsarEA the best!",
    rating: 5
  },
  {
    id: "maya",
    name: "Maya L.",
    location: "Yogyakarta",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/maya.png",
    profit: "+$1,200",
    duration: "2 bulan",
    type: "pemula",
    comment: "Sebagai ibu rumah tangga, saya cari penghasilan tambahan. Phoenix Cent cocok banget — modal kecil, hasil nyata. Seneng banget!",
    commentEn: "As a housewife looking for extra income, Phoenix Cent is perfect — small capital, real results. So happy!",
    rating: 5
  },
  {
    id: "dani",
    name: "Dani F.",
    location: "Semarang",
    flag: "\ud83c\uddee\ud83c\uddf9",
    avatar: "/avatars/dani.png",
    profit: "+$5,400",
    duration: "5 bulan",
    type: "berpengalaman",
    comment: "Phoenix IDR cocok banget buat broker lokal. Spread rendah, profit konsisten. Udah coba banyak EA, ini yang paling stabil.",
    commentEn: "Phoenix IDR is perfect for local brokers. Low spread, consistent profit. Tried many EAs, this is the most stable.",
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
    monthlyReturn: "+28%",
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
    monthlyReturn: "+31%",
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
    monthlyReturn: "+30%",
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
