"use client";

import { useEffect } from "react";
import Script from "next/script";

const PIXEL_ID = "1365920892422834";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel untuk landing page iklan.
 *
 * - PageView dikirim otomatis oleh base code saat halaman dimuat.
 * - Lead dikirim saat pengunjung mengklik CTA yang benar-benar menuju kontak
 *   admin. CTA yang hanya men-scroll ke section lain sengaja TIDAK dihitung:
 *   kalau ikut dikirim, algoritma Meta akan dioptimasi ke orang yang gemar
 *   scroll, bukan ke orang yang menghubungi kita.
 */
export default function MetaPixel() {
  useEffect(() => {
    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest("a[data-cta]");
      if (!(trigger instanceof HTMLAnchorElement)) return;
      if (!trigger.href.includes("t.me/")) return;

      window.fbq?.("track", "Lead", {
        content_name: trigger.dataset.cta ?? "unknown",
        content_category: "signal-licence"
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
