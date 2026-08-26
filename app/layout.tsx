import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "GoldPulsarEA — EA XAUUSD Premium, Gratis",
  description:
    "Koleksi Expert Advisor XAUUSD kelas premium yang bisa kamu dapatkan gratis. Klaim lisensi dengan pindah afiliasi ke IB Exness GoldPulsarEA."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink font-sans text-zinc-200 antialiased">
        {children}
      </body>
    </html>
  );
}
