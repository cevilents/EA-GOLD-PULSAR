"use client";

import { useState } from "react";
import PhoneMockup from "./PhoneMockup";

interface AppScreenshotProps {
  /** Nama file di /public/screens, mis. "beranda.png". */
  src: string;
  alt: string;
  className?: string;
  /** Tampilkan mockup kode sebagai cadangan kalau screenshot belum ada. */
  fallback?: boolean;
  priority?: boolean;
}

/**
 * Bingkai ponsel berisi screenshot aplikasi asli.
 *
 * Selama file di /public/screens belum ada, komponen ini jatuh ke mockup kode
 * supaya landing page tidak pernah menampilkan gambar rusak.
 */
export default function AppScreenshot({
  src,
  alt,
  className = "",
  fallback = true,
  priority = false
}: AppScreenshotProps) {
  const [failed, setFailed] = useState(false);

  if (failed && fallback) {
    return <PhoneMockup className={className} showNotification={false} />;
  }

  if (failed) return null;

  return (
    <div className={`relative mx-auto w-[260px] sm:w-[290px] ${className}`}>
      <div className="rounded-[2.2rem] border border-white/12 bg-gradient-to-b from-white/10 to-white/[0.02] p-[3px] shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
        <img
          src={`/screens/${src}`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className="block h-auto w-full rounded-[2rem]"
        />
      </div>
    </div>
  );
}
