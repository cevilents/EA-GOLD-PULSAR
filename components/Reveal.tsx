"use client";

import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.15;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fail-safe: kalau IntersectionObserver tidak tersedia, tampilkan langsung.
    // Konten yang tidak pernah muncul jauh lebih mahal daripada animasi yang hilang.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: THRESHOLD }
    );
    observer.observe(element);

    // Jaring pengaman untuk in-app browser (Instagram/Facebook) yang kadang
    // menahan callback observer: cek posisi manual sekali setelah 2 detik.
    const fallback = window.setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (rect.height > 0 && shown / rect.height >= THRESHOLD) {
        setVisible(true);
        observer.disconnect();
      }
    }, 2000);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
