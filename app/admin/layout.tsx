import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin — GoldPulsarEA",
  robots: { index: false }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-ink">{children}</div>;
}
