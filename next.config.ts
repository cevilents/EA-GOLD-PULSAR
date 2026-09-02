import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      // LP signal pindah dari /promo ke root; jaga URL lama tetap hidup
      // supaya materi iklan atau tautan yang sudah beredar tidak mati.
      { source: "/promo", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;
