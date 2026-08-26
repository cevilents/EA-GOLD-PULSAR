# GoldPulsarEA Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing page satu halaman GoldPulsarEA (Bahasa Indonesia): koleksi 6 EA gratis XAUUSD, tutorial klaim afiliasi 5 langkah, form klaim → GitHub Issues, download terbuka setelah submit.

**Architecture:** Next.js 15 App Router statis + satu API route (`/api/submit`) sebagai Vercel Function yang membuat Issue di repo GitHub privat. State klaim bersama (`ClaimFlow`) menghubungkan form dan section download. Sumber data tunggal `data/eas.ts`.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Tailwind CSS v4, Vitest (logic saja).

**Spec:** `docs/superpowers/specs/2026-08-26-goldpulsarea-design.md`

## Global Constraints

- Semua copy UI Bahasa Indonesia. Tidak ada komentar dalam kode.
- TypeScript `strict: true`. Dilarang `any`.
- Wallet partner WAJIB persis: `1149206011366637938` (konstanta `WALLET_PARTNER` di `data/eas.ts`).
- Token GitHub hanya lewat env `GITHUB_TOKEN` + `GITHUB_REPO`; tidak pernah di frontend/log.
- Tema: bg `#07080C`, permukaan glass putih transparan, emas `#F7D774 → #D4AF37 → #B8860B`.
- Mobile-first responsif; hormati `prefers-reduced-motion`; semua interval/rAF/listener di-cleanup.
- Tanpa dependency baru selain yang didaftarkan Task 1.
- Setiap task diakhiri commit; `npm run build` wajib lulus di task yang menyentuh kode app.

---

### Task 1: Scaffold proyek Next.js + Tailwind v4 + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.example`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/downloads/.gitkeep`

**Interfaces:**
- Produces: proyek build-able; font variables `--font-display` (Space Grotesk) & `--font-sans` (Inter) tersedia global; token warna Tailwind `gold-light/gold/gold-deep/ink/ink-soft`.

- [ ] **Step 1: Tulis semua file konfigurasi**

`package.json`:
```json
{
  "name": "goldpulsarea",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }
};

export default nextConfig;
```

`postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};

export default config;
```

`.gitignore`:
```
node_modules/
.next/
out/
.env
.env.*
!.env.example
*.tsbuildinfo
next-env.d.ts
.DS_Store
```

`.env.example`:
```
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=username/nama-repo-claims
```

- [ ] **Step 2: Tulis app/layout.tsx, app/page.tsx, app/globals.css awal**

`app/layout.tsx`:
```tsx
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
```

`app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="font-display text-4xl font-bold text-gold">GoldPulsarEA</h1>
    </main>
  );
}
```

`app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-ink: #07080c;
  --color-ink-soft: #0d0f16;
  --color-gold-light: #f7d774;
  --color-gold: #d4af37;
  --color-gold-deep: #b8860b;
  --font-display: var(--font-space), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-image:
    radial-gradient(ellipse 60% 40% at 70% -10%, rgba(212, 175, 55, 0.12), transparent),
    radial-gradient(ellipse 40% 30% at 10% 110%, rgba(212, 175, 55, 0.06), transparent);
}

::selection {
  background: rgba(212, 175, 55, 0.35);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Install & verifikasi build**

Run: `mkdir -p public/downloads && touch public/downloads/.gitkeep && npm install && npm run build`
Expected: `npm run build` PASS (route `/` statis).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold nextjs + tailwind v4"
```

---

### Task 2: Data EA + validasi + Vitest (TDD)

**Files:**
- Create: `data/eas.ts`, `lib/validation.ts`, `lib/rateLimit.ts`, `data/eas.test.ts`, `lib/validation.test.ts`, `lib/rateLimit.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces:
  - `WALLET_PARTNER: string`, `interface EaItem { id: string; name: string; tagline: string; description: string; tags: string[]; winRate: string; profitFactor: string; maxDd: string; timeframe: string; file: string }`, `EAS: EaItem[]`
  - `validateClaim(raw: unknown): { ok: true; value: { name: string; whatsapp: string; account: string } } | { ok: false; errors: Partial<Record<"name" | "whatsapp" | "account", string>> }`
  - `checkRateLimit(key: string, now?: number): boolean` (true = boleh lewat)

- [ ] **Step 1: Tulis test gagal dulu**

`vitest.config.ts` (agar alias `@/*` dari tsconfig ter-resolve di test):
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  },
  test: {
    environment: "node"
  }
});
```

`lib/validation.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { validateClaim } from "./validation";

describe("validateClaim", () => {
  it("menerima klaim valid", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "+628123456789", account: "12345678" });
    expect(r).toEqual({
      ok: true,
      value: { name: "Budi", whatsapp: "+628123456789", account: "12345678" }
    });
  });

  it("membersihkan spasi pada whatsapp", () => {
    const r = validateClaim({ name: " Budi ", whatsapp: "6281 2345-6789", account: "12345678" });
    expect(r.ok && r.value.whatsapp).toBe("+628123456789");
  });

  it("tolak jika bukan objek", () => {
    expect(validateClaim(null).ok).toBe(false);
    expect(validateClaim("x").ok).toBe(false);
  });

  it("tolak nama terlalu pendek/panjang", () => {
    const r = validateClaim({ name: "B", whatsapp: "628123456789", account: "12345678" });
    expect(!r.ok && r.errors.name).toBeTruthy();
  });

  it("tolak whatsapp tanpa digit cukup", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "12345", account: "12345678" });
    expect(!r.ok && r.errors.whatsapp).toBeTruthy();
  });

  it("tolak whatsapp berisi huruf", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "08abc123456", account: "12345678" });
    expect(!r.ok && r.errors.whatsapp).toBeTruthy();
  });

  it("tolak nomor akun non-numerik atau salah panjang", () => {
    const r1 = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12ab" });
    const r2 = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12345678901234" });
    expect(!r1.ok && r1.errors.account).toBeTruthy();
    expect(!r2.ok && r2.errors.account).toBeTruthy();
  });

  it("tolak honeypot terisi", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12345678", website: "spam" });
    expect(r.ok).toBe(false);
  });
});
```

`lib/rateLimit.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rateLimit";

describe("checkRateLimit", () => {
  it("mengizinkan sampai batas lalu menolak", () => {
    let t = 1000;
    const now = () => t;
    const key = "ip-test-1";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(key, now())).toBe(true);
    }
    expect(checkRateLimit(key, now())).toBe(false);
  });

  it("mengizinkan lagi setelah jendela waktu lewat", () => {
    let t = 5000;
    const now = () => t;
    const key = "ip-test-2";
    for (let i = 0; i < 10; i++) checkRateLimit(key, now());
    t += 3_600_001;
    expect(checkRateLimit(key, now())).toBe(true);
  });
});
```

`data/eas.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { EAS, WALLET_PARTNER } from "./eas";

describe("data eas", () => {
  it("wallet partner benar", () => {
    expect(WALLET_PARTNER).toBe("1149206011366637938");
  });

  it("berisi 6 ea lengkap", () => {
    expect(EAS).toHaveLength(6);
    for (const ea of EAS) {
      expect(ea.id).toMatch(/^[a-z0-9-]+$/);
      expect(ea.file).toMatch(/\.(ex4|ex5)$/);
      expect(ea.tags.length).toBeGreaterThan(0);
    }
  });
});
```

Run: `npx vitest run`
Expected: FAIL (modul belum ada).

- [ ] **Step 2: Implementasi**

`lib/validation.ts`:
```ts
export interface ClaimFields {
  name: string;
  whatsapp: string;
  account: string;
}

export type FieldErrors = Partial<Record<keyof ClaimFields, string>>;

export type ClaimValidationResult =
  | { ok: true; value: ClaimFields }
  | { ok: false; errors: FieldErrors };

const NAME_MIN = 2;
const NAME_MAX = 60;

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function normalizeWhatsapp(value: string): string {
  const cleaned = value.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function validateClaim(raw: unknown): ClaimValidationResult {
  const record = asRecord(raw);
  if (!record) {
    return { ok: false, errors: { name: "Data tidak valid." } };
  }

  if (readString(record, "website").length > 0) {
    return { ok: false, errors: { name: "Data tidak valid." } };
  }

  const errors: FieldErrors = {};
  const name = readString(record, "name").trim();
  const whatsappRaw = readString(record, "whatsapp").trim();
  const account = readString(record, "account").trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = "Nama harus 2–60 karakter.";
  }

  const whatsapp = normalizeWhatsapp(whatsappRaw);
  if (!/^\+\d+$/.test(whatsapp) || countDigits(whatsapp) < 9 || countDigits(whatsapp) > 16) {
    errors.whatsapp = "Nomor WhatsApp tidak valid (9–16 digit).";
  }

  if (!/^\d{5,12}$/.test(account)) {
    errors.account = "Nomor akun harus 5–12 angka tanpa karakter lain.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { name, whatsapp, account } };
}
```

`lib/rateLimit.ts`:
```ts
const WINDOW_MS = 3_600_000;
const MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  const previous = hits.get(key) ?? [];
  const recent = previous.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}
```

`data/eas.ts`:
```ts
export const WALLET_PARTNER = "1149206011366637938";

export interface EaItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  winRate: string;
  profitFactor: string;
  maxDd: string;
  timeframe: string;
  file: string;
}

export const EAS: EaItem[] = [
  {
    id: "pulsar-scalper-xau",
    name: "Pulsar Scalper XAU",
    tagline: "Scalping kilat di jam London–NY",
    description:
      "Menangkap momentum mikro gold dengan entry cepat di likuiditas tertinggi. Cocok untuk akun kecil, stop loss ketat, target konsisten.",
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
    tags: ["News Trading", "Volatility"],
    winRate: "81%",
    profitFactor: "2.31",
    maxDd: "9.2%",
    timeframe: "M5",
    file: "HeliosNewsGuard.ex5"
  }
];
```

Run: `npx vitest run`
Expected: PASS semua.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: ea catalog data, claim validation, rate limit + tests"
```

---

### Task 3: API route `/api/submit` → GitHub Issues (TDD)

**Files:**
- Create: `app/api/submit/route.ts`, `app/api/submit/route.test.ts`

**Interfaces:**
- Consumes: `validateClaim` dari `lib/validation.ts`, `checkRateLimit` dari `lib/rateLimit.ts`.
- Produces: `POST /api/submit` — request `{ name, whatsapp, account, website? }`; respons `200 {"ok":true}` | `400 {"error":string,"fields":{...}}` | `429 {"error":"Terlalu banyak percobaan. Coba lagi nanti."}` | `503 {"error":"Layanan klaim belum dikonfigurasi."}` | `502 {"error":"Gagal menyimpan klaim. Silakan coba lagi."}`.

- [ ] **Step 1: Tulis test gagal**

`app/api/submit/route.test.ts`:
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

async function post(body: unknown, ip = "1.2.3.4"): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body)
    })
  );
}

describe("POST /api/submit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "me/claims";
    fetchMock.mockResolvedValue(new Response(null, { status: 201 }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sukses membuat issue github dengan payload benar", async () => {
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" });
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.github.com/repos/me/claims/issues");
    expect(init.headers).toMatchObject({ Authorization: "Bearer test-token" });
    const payload = JSON.parse(String(init.body));
    expect(payload.title).toBe("[CLAIM] Budi — 12345678");
    expect(payload.body).toContain("+628123456789");
  });

  it("400 untuk payload tidak valid", async () => {
    const res = await post({ name: "", whatsapp: "xx", account: "1" });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("503 saat env belum diset", async () => {
    delete process.env.GITHUB_TOKEN;
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" }, "5.6.7.8");
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("502 saat github gagal", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" }, "9.9.9.9");
    expect(res.status).toBe(502);
  });

  it("429 saat melebihi rate limit", async () => {
    const body = { name: "Budi", whatsapp: "628123456789", account: "12345678" };
    for (let i = 0; i < 10; i++) {
      await post(body, "7.7.7.7");
    }
    const res = await post(body, "7.7.7.7");
    expect(res.status).toBe(429);
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(10);
  });
});
```

Run: `npx vitest run app/api/submit`
Expected: FAIL (route belum ada).

- [ ] **Step 2: Implementasi route**

`app/api/submit/route.ts`:
```ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateClaim } from "@/lib/validation";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function jsonError(status: number, error: string, fields?: unknown): NextResponse {
  return NextResponse.json(fields ? { error, fields } : { error }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    return jsonError(503, "Layanan klaim belum dikonfigurasi.");
  }

  if (!checkRateLimit(clientIp(request))) {
    return jsonError(429, "Terlalu banyak percobaan. Coba lagi nanti.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const result = validateClaim(body);
  if (!result.ok) {
    return jsonError(400, "Periksa kembali isian formulir.", result.errors);
  }

  const { name, whatsapp, account } = result.value;
  const issueBody = [
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
    `Nomor Akun: ${account}`,
    `Waktu (UTC): ${new Date().toISOString()}`,
    `User-Agent: ${request.headers.get("user-agent") ?? "-"}`
  ].join("\n");

  try {
    const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `[CLAIM] ${name} — ${account}`,
        body: issueBody
      }),
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      console.error(`github issue failed with status ${response.status}`);
      return jsonError(502, "Gagal menyimpan klaim. Silakan coba lagi.");
    }
  } catch {
    console.error("github issue request threw");
    return jsonError(502, "Gagal menyimpan klaim. Silakan coba lagi.");
  }

  return NextResponse.json({ ok: true });
}
```

Run: `npx vitest run`
Expected: PASS semua.

- [ ] **Step 3: Build & commit**

Run: `npm run build && npx vitest run`
Expected: PASS.

```bash
git add -A
git commit -m "feat: /api/submit creating github issue claims"
```

---

### Task 4: Komponen UI inti — Navbar, Footer, Reveal

**Files:**
- Create: `components/Reveal.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`

**Interfaces:**
- Produces:
  - `Reveal({ children, delay?, className? }: { children: React.ReactNode; delay?: number; className?: string })` — client wrapper animasi masuk.
  - `Navbar()` — sticky; anchor `#koleksi`, `#cara-klaim`, `#faq`, CTA ke `#klaim`.
  - `Footer()` — disclaimer risiko.

- [ ] **Step 1: Implementasi ketiga komponen**

`components/Reveal.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
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
```

`components/Navbar.tsx`:
```tsx
"use client";

import { useState } from "react";

const LINKS = [
  { href: "#koleksi", label: "Koleksi EA" },
  { href: "#cara-klaim", label: "Cara Klaim" },
  { href: "#faq", label: "FAQ" }
];

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="url(#g)" strokeWidth="2" />
      <path d="M9 19l4-6 3 4 3-7 4 9" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="g" x1="2" y1="2" x2="30" y2="30">
          <stop stopColor="#F7D774" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-gold-light">
              {link.label}
            </a>
          ))}
          <a
            href="#klaim"
            className="rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2 text-sm font-semibold text-ink shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
          >
            Klaim Lisensi
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-ink/95 px-4 pb-4 pt-2 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-gold-light"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#klaim"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-5 py-2.5 text-center text-sm font-semibold text-ink"
          >
            Klaim Lisensi
          </a>
        </div>
      )}
    </header>
  );
}
```

`components/Footer.tsx`:
```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-display text-lg font-bold text-white">
            Gold<span className="bg-gradient-to-r from-gold-light to-gold-deep bg-clip-text text-transparent">Pulsar</span>EA
          </span>
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-500">
            Peringatan Risiko: Perdagangan forex dan CFD memiliki tingkat risiko tinggi dan dapat mengakibatkan hilangnya seluruh modal Anda. Kinerja masa lalu tidak menjamin hasil di masa depan. Gunakan hanya dana yang siap Anda rugikan. GoldPulsarEA tidak memberikan nasihat investasi.
          </p>
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} GoldPulsarEA. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: navbar, footer, reveal animation primitives"
```

---

### Task 5: Hero + StatsBar dengan chart canvas animasi

**Files:**
- Create: `components/CandleChart.tsx`, `components/Hero.tsx`, `components/StatsBar.tsx`

**Interfaces:**
- Produces: `Hero()` — section id `beranda`; `StatsBar()`; `CandleChart()` — canvas self-contained, cleanup penuh.

- [ ] **Step 1: Implementasi**

`components/CandleChart.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

const COUNT = 36;
const BASE = 2380;

function randomStep(): number {
  return (Math.random() - 0.48) * 6;
}

function nextCandle(previous: number): Candle {
  const open = previous;
  const close = Math.max(BASE - 60, Math.min(BASE + 90, open + randomStep()));
  const high = Math.max(open, close) + Math.random() * 3;
  const low = Math.min(open, close) - Math.random() * 3;
  return { open, close, high, low };
}

export default function CandleChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let candles: Candle[] = [];
    let lastPrice = BASE;
    for (let i = 0; i < COUNT; i++) {
      const candle = nextCandle(lastPrice);
      candles.push(candle);
      lastPrice = candle.close;
    }

    let frame = 0;
    let raf = 0;
    let running = true;

    const resize = (): void => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onVisibility = (): void => {
      running = document.visibilityState === "visible";
      if (running) tick(performance.now());
    };
    document.addEventListener("visibilitychange", onVisibility);

    function tick(now: number): void {
      if (!running) return;
      frame++;
      if (frame % 24 === 0) {
        candles.push(nextCandle(lastPrice));
        candles = candles.slice(-COUNT);
        lastPrice = candles[candles.length - 1].close;
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    }

    function draw(now: number): void {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const prices = candles.flatMap((c) => [c.high, c.low]);
      const min = Math.min(...prices) - 4;
      const max = Math.max(...prices) + 4;
      const y = (price: number): number => h - ((price - min) / (max - min)) * h;

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * i);
        ctx.lineTo(w, (h / 4) * i);
        ctx.stroke();
      }

      const slot = w / COUNT;
      const bodyWidth = slot * 0.55;
      const shift = ((now / 24) % slot) * 0.999;

      candles.forEach((candle, i) => {
        const x = i * slot - shift + slot / 2;
        const up = candle.close >= candle.open;
        const color = up ? "#E8C25A" : "rgba(160,120,40,0.85)";
        const glow = up ? "rgba(232,194,90,0.45)" : "rgba(160,120,40,0.25)";

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y(candle.high));
        ctx.lineTo(x, y(candle.low));
        ctx.stroke();

        ctx.shadowColor = glow;
        ctx.shadowBlur = up ? 8 : 0;
        ctx.fillStyle = color;
        const top = y(Math.max(candle.open, candle.close));
        const bottom = y(Math.min(candle.open, candle.close));
        ctx.fillRect(x - bodyWidth / 2, top, bodyWidth, Math.max(bottom - top, 1.5));
        ctx.shadowBlur = 0;
      });
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
```

`components/Hero.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import CandleChart from "./CandleChart";

function useLivePrice(): { price: number; delta: number } {
  const [tick, setTick] = useState({ price: 2384.25, delta: 12.4 });

  useEffect(() => {
    const id = setInterval(() => {
      setTick((prev) => {
        const change = (Math.random() - 0.48) * 2.2;
        const price = Math.max(2300, Math.min(2480, prev.price + change));
        return { price, delta: prev.delta + change };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return tick;
}

export default function Hero() {
  const { price, delta } = useLivePrice();
  const up = delta >= 0;

  return (
    <section id="beranda" className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <CandleChart />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
            </span>
            100% Gratis — Syarat: Affiliasi Exness
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            EA XAUUSD Premium.
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-deep bg-clip-text text-transparent">
              Gratis Selamanya.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Koleksi Expert Advisor gold performa tinggi untuk akun Exness kamu.
            Satu syarat: pindah afiliasi ke IB GoldPulsarEA, submit nomor akunmu,
            dan seluruh koleksi menjadi milikmu.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#koleksi"
              className="w-full rounded-full border border-gold/40 bg-gold/10 px-8 py-3.5 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/20 sm:w-auto"
            >
              Lihat Koleksi EA
            </a>
            <a
              href="#klaim"
              className="w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-8 py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-transform hover:scale-105 sm:w-auto"
            >
              Klaim Sekarang
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 backdrop-blur-md">
            <span className="text-xs uppercase tracking-widest text-zinc-500">XAUUSD</span>
            <span className="font-display text-xl font-bold text-white">
              {price.toFixed(2)}
            </span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={up ? "" : "rotate-180"}>
                <path d="M6 1l5 7H1z" />
              </svg>
              {up ? "+" : ""}
              {delta.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

`components/StatsBar.tsx`:
```tsx
import Reveal from "./Reveal";

const STATS = [
  { value: "6", label: "EA Premium" },
  { value: "2.400+", label: "Trader Aktif" },
  { value: "XAUUSD", label: "Spesialis Gold" },
  { value: "24/7", label: "Dukungan" }
];

export default function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gold-light">{stat.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verifikasi type-check & build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: hero with animated gold candlestick chart + stats bar"
```

---

### Task 6: Koleksi EA + Tutorial Cara Klaim

**Files:**
- Create: `components/EaCollection.tsx`, `components/TutorialSteps.tsx`

**Interfaces:**
- Consumes: `EAS` dari `data/eas.ts`; `WALLET_PARTNER` dari `data/eas.ts`.
- Produces: `EaCollection()` — section id `koleksi`; `TutorialSteps()` — section id `cara-klaim` dengan tombol salin wallet.

- [ ] **Step 1: Implementasi**

`components/EaCollection.tsx`:
```tsx
import { EAS } from "@/data/eas";
import Reveal from "./Reveal";

export default function EaCollection() {
  return (
    <section id="koleksi" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Koleksi EA</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Enam Senjata untuk Menaklukkan Gold
            </h2>
            <p className="mt-4 text-zinc-400">
              Setiap EA punya karakter dan strategi berbeda. Pilih yang cocok dengan gaya tradingmu — semuanya gratis.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EAS.map((ea, i) => (
            <Reveal key={ea.id} delay={(i % 3) * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)]">
                <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-gold-light to-gold-deep px-3 py-1 text-[10px] font-bold tracking-wider text-ink">
                  GRATIS
                </div>

                <h3 className="pr-16 font-display text-xl font-bold text-white">{ea.name}</h3>
                <p className="mt-1 text-sm text-gold-light/90">{ea.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{ea.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {ea.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <dl className="mt-auto grid grid-cols-4 gap-2 border-t border-white/5 pt-5 text-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Winrate</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.winRate}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">PF</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.profitFactor}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Max DD</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.maxDd}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-zinc-500">TF</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-gold-light">{ea.timeframe}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`components/TutorialSteps.tsx`:
```tsx
"use client";

import { useCallback, useState } from "react";
import { WALLET_PARTNER } from "@/data/eas";
import Reveal from "./Reveal";

function CopyButton(): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WALLET_PARTNER);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = WALLET_PARTNER;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        copied
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-gradient-to-r from-gold-light to-gold-deep text-ink hover:brightness-110"
      }`}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Tersalin!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Salin Nomor
        </>
      )}
    </button>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.07] p-4">
      <svg className="mt-0.5 shrink-0 text-red-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <p className="text-sm leading-relaxed text-red-300/90">{children}</p>
    </div>
  );
}

interface Step {
  title: string;
  content: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Pindah Affiliasi + Isi Wallet Partner",
    content: (
      <>
        <p className="leading-relaxed">
          Buka Live Chat Exness → kirim pesan <strong className="text-white">&ldquo;Partner Change&rdquo;</strong> →
          klik link form dari Exness Assistant. Di kolom{" "}
          <em className="text-zinc-300">&ldquo;New partner&rsquo;s link or wallet account number&rdquo;</em>, tempel nomor di bawah.
        </p>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gold/30 bg-gold/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-light/80">Wallet Partner GoldPulsarEA</p>
            <p className="mt-1 select-all font-mono text-lg font-bold tracking-wider text-white">{WALLET_PARTNER}</p>
          </div>
          <CopyButton />
        </div>
        <Warning>
          Jangan diketik manual — satu digit salah, permintaan ditolak. Gunakan tombol salin.
        </Warning>
      </>
    )
  },
  {
    title: "Tunggu Disetujui Exness",
    content: (
      <>
        <p className="leading-relaxed">
          Lengkapi sisa form → Submit → tunggu persetujuan Exness. Bisa makan waktu beberapa jam.
        </p>
        <Warning>
          Jangan buat akun apa pun sebelum ini disetujui — akun yang dibuat lebih dulu tetap terhitung milik partner lama.
        </Warning>
      </>
    )
  },
  {
    title: "WAJIB: Buat Akun Real BARU Setelah Disetujui",
    content: (
      <>
        <p className="leading-relaxed">
          Begitu Exness mengonfirmasi perpindahan partner berhasil, buat akun real <strong className="text-white">BARU</strong>.
          Akun real yang kamu punya sebelumnya tetap tercatat di partner lama dan tidak akan pernah terhitung ke
          GoldPulsarEA, berapa pun depositnya. Perpindahan partner hanya berlaku untuk akun yang dibuat sesudah disetujui.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            "Pastikan Exness sudah mengonfirmasi perpindahan partner",
            "Masuk ke Personal Area Exness → buat akun real baru",
            "Catat nomor akun barunya — itu yang dipakai di langkah berikutnya"
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
              <svg className="mt-1 shrink-0 text-gold" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <Warning>Akun DEMO tidak dihitung. Harus akun real, dan harus dibuat setelah perpindahan disetujui.</Warning>
      </>
    )
  },
  {
    title: "Deposit Minimal $100 ke Akun BARU",
    content: (
      <>
        <p className="leading-relaxed">
          Deposit langsung ke akun real yang baru kamu buat — bukan akun lama. Transfer saldo antar akun tidak dihitung.
        </p>
        <Warning>Deposit ke akun lama tidak akan membuat klaimmu valid.</Warning>
      </>
    )
  },
  {
    title: "Submit Nomor Akun di Form Bawah",
    content: (
      <p className="leading-relaxed">
        Setelah submit, sistem mengecek otomatis secara berkala. Begitu datamu cocok,
        akses terbuka sendiri — tidak perlu submit ulang.
      </p>
    )
  }
];

export default function TutorialSteps() {
  return (
    <section id="cara-klaim" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Cara Klaim</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Aktivasi VIP via Exness
            </h2>
            <p className="mt-4 text-zinc-400">
              Ikuti 5 langkah ini dengan urutan. Jangan loncat — setiap langkah punya syarat.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 60}>
                <div className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg font-bold text-gold-light">
                      {i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-gold/40 to-transparent" />}
                  </div>
                  <div className="pb-2">
                    <h3 className="pt-2 font-display text-lg font-bold text-white">{step.title}</h3>
                    <div className="mt-2 text-sm text-zinc-400">{step.content}</div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npx tsc --noEmit && npx vitest run`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: ea collection grid + 5-step claim tutorial with copy wallet"
```

---

### Task 7: ClaimFlow — form klaim + download terkunci

**Files:**
- Create: `components/ClaimFlow.tsx`

**Interfaces:**
- Consumes: `validateClaim` dari `lib/validation.ts`; `EAS` dari `data/eas.ts`.
- Produces: `ClaimFlow()` — section id `klaim`; state `submitted` menghubungkan form ↔ download; sukses scroll ke `#unduhan`.

- [ ] **Step 1: Implementasi**

`components/ClaimFlow.tsx`:
```tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { EAS } from "@/data/eas";
import { validateClaim, type FieldErrors } from "@/lib/validation";
import Reveal from "./Reveal";

type Status = "idle" | "loading" | "success";

const EMPTY_ERRORS: FieldErrors = {};

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function DownloadPanel({ unlocked }: { unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <svg className="text-gold-light" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">Download Terkunci</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Selesaikan langkah 1–4 di atas, lalu submit nomor akun real-mu di form untuk membuka semua file EA.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="unduhan" className="mt-12 scroll-mt-24 rounded-2xl border border-gold/30 bg-gold/[0.05] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-gold-light to-gold-deep">
          <svg className="text-ink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Klaim Diterima — Akses Dibuka!</h3>
          <p className="text-sm text-zinc-400">Unduh semua EA di bawah. Password setting ada di grup WhatsApp kamu.</p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {EAS.map((ea) => (
          <li
            key={ea.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-soft px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{ea.name}</p>
              <p className="truncate font-mono text-xs text-zinc-500">{ea.file}</p>
            </div>
            <Link
              href={`/downloads/${ea.file}`}
              download
              prefetch={false}
              className="shrink-0 rounded-lg bg-gradient-to-r from-gold-light to-gold-deep px-4 py-2 text-xs font-bold text-ink transition-transform hover:scale-105"
            >
              Unduh
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ClaimFlow() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setServerError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      account: String(data.get("account") ?? ""),
      website: String(data.get("website") ?? "")
    };

    const validation = validateClaim(payload);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setErrors(EMPTY_ERRORS);
    setStatus("loading");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => {
          document.getElementById("unduhan")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }

      const message =
        typeof json === "object" && json !== null && "error" in json
          ? String((json as { error: unknown }).error)
          : "Terjadi kesalahan. Coba lagi.";
      const fields =
        typeof json === "object" && json !== null && "fields" in json
          ? ((json as { fields: unknown }).fields as FieldErrors)
          : undefined;
      if (fields) setErrors(fields);
      setServerError(message);
      setStatus("idle");
    } catch {
      setServerError("Tidak dapat terhubung ke server. Periksa koneksi internetmu.");
      setStatus("idle");
    }
  }

  return (
    <section id="klaim" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Langkah Terakhir</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Klaim Lisensimu</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Sudah pindah afiliasi dan deposit di akun baru? Submit nomor akun real-mu sekarang.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {status === "success" ? (
            <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 text-center">
              <p className="font-display text-lg font-bold text-emerald-400">Klaim terkirim!</p>
              <p className="mt-1 text-sm text-zinc-400">
                Datamu sudah kami terima dan sedang diproses. Unduhan sudah terbuka di bawah.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama Lengkap" error={errors.name}>
                  <input name="name" type="text" autoComplete="name" placeholder="Nama sesuai akun Exness" className={inputClass} maxLength={60} required />
                </Field>
                <Field label="Nomor WhatsApp" error={errors.whatsapp}>
                  <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="08xxxxxxxxxx" className={inputClass} required />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Nomor Akun Real BARU" error={errors.account}>
                  <input name="account" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Contoh: 12345678" className={inputClass} maxLength={12} required />
                </Field>
                <p className="mt-2 text-xs text-zinc-600">
                  Akun demo tidak dihitung. Harus akun real yang dibuat setelah perpindahan partner disetujui.
                </p>
              </div>

              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {serverError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-7 w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_rgba(212,175,55,0.3)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Mengirim…" : "Submit & Buka Unduhan"}
              </button>
            </form>
          )}
        </Reveal>

        <DownloadPanel unlocked={status === "success"} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verifikasi type-check & build**

Run: `npx tsc --noEmit && npm run build && npx vitest run`
Expected: PASS. Catatan: `Link` dari `next/link` valid untuk anchor download internal.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: claim form wired to api with gated download panel"
```

---

### Task 8: FAQ accordion + perakitan page.tsx

**Files:**
- Create: `components/Faq.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: semua section dari Task 4–7.
- Produces: `Faq()` — section id `faq`; halaman lengkap.

- [ ] **Step 1: Implementasi Faq.tsx**

`components/Faq.tsx`:
```tsx
"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const ITEMS = [
  {
    q: "Apakah semua EA-nya benar-benar gratis?",
    a: "Ya, seluruh koleksi EA gratis selamanya. Satu-satunya 'pembayaran' adalah kamu bergabung sebagai klien IB di bawah afiliasi GoldPulsarEA melalui Exness — tanpa biaya apa pun darimu."
  },
  {
    q: "Kenapa saya harus pindah afiliasi/partner?",
    a: "GoldPulsarEA didukung oleh program IB Exness. Dengan kamu bergabung under afiliasi kami, broker memberi komisi kepada kami sehingga EA premium bisa dibagikan gratis ke kamu."
  },
  {
    q: "Akun lama saya bisa dipakai?",
    a: "Tidak. Akun yang dibuat sebelum perpindahan partner disetujui tetap tercatat milik partner lama selamanya. Kamu wajib membuat akun real BARU setelah perpindahan disetujui."
  },
  {
    q: "Berapa deposit minimum?",
    a: "Minimal $100 langsung ke akun real baru yang kamu buat setelah perpindahan disetujui. Transfer antar akun tidak dihitung."
  },
  {
    q: "Berapa lama proses klaim saya diproses?",
    a: "Setelah kamu submit nomor akun, sistem mengecek secara berkala. Jika datamu sudah cocok dengan afiliasi kami, akses unduhan terbuka. Biasanya maksimal beberapa jam setelah Exness menyetujui perpindahanmu."
  },
  {
    q: "Apakah EA cocok untuk pemula?",
    a: "Ya. Setiap EA dilengkapi panduan setting dan rekomendasi pair serta timeframe. Untuk awal, kami merekomendasikan Pulsar Scalper XAU dengan risk rendah di akun cent atau micro."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Pertanyaan Umum
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-3">
          {ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <div className={`overflow-hidden rounded-xl border transition-colors ${open ? "border-gold/40 bg-gold/[0.05]" : "border-white/10 bg-white/[0.03]"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <svg
                      className={`shrink-0 text-gold-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {open && <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rakit halaman di app/page.tsx**

`app/page.tsx`:
```tsx
import ClaimFlow from "@/components/ClaimFlow";
import EaCollection from "@/components/EaCollection";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StatsBar from "@/components/StatsBar";
import TutorialSteps from "@/components/TutorialSteps";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <EaCollection />
        <TutorialSteps />
        <ClaimFlow />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verifikasi build penuh + smoke test dev**

Run: `npm run build && npx vitest run`
Expected: PASS semua, route `/` prerendered static.

Run: `npm run start & SERVER_PID=$! ; sleep 4 ; curl -sf http://localhost:3000/ | grep -o GoldPulsarEA | head -n1 ; kill $SERVER_PID`
Expected: output `GoldPulsarEA`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: faq accordion + assemble landing page"
```

---

### Task 9: README setup & verifikasi akhir

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: dokumentasi setup env GitHub, cara ganti daftar EA, cara upload file EA, deploy Vercel.

- [ ] **Step 1: Tulis README.md**

`README.md`:
```markdown
# GoldPulsarEA

Landing page distribusi EA XAUUSD gratis via klaim afiliasi IB Exness.

## Menjalankan Lokal

\`\`\`bash
npm install
npm run dev
\`\`\`

Buka http://localhost:3000

## Setup Form Klaim (GitHub Issues)

Form klaim menyimpan pengajuan sebagai Issue di repo GitHub privat lewat \`/api/submit\`.

1. Buat repo privat kosong (mis. \`username/goldpulsarea-claims\`).
2. Buat Personal Access Token (classic) dengan scope \`repo\`: GitHub → Settings → Developer settings → Tokens.
3. Salin \`.env.example\` menjadi \`.env.local\`, isi:
   \`\`\`
   GITHUB_TOKEN=ghp_tokenmu
   GITHUB_REPO=username/goldpulsarea-claims
   \`\`\`
4. Di Vercel: Project Settings → Environment Variables → tambahkan kedua nilai yang sama.

Tanpa kedua variabel itu, form mengembalikan pesan "layanan belum dikonfigurasi".

## Mengubah Daftar EA

Edit satu file: \`data/eas.ts\`. Nama \`file\` harus sama persis dengan nama file yang kamu unggah.

## Menambahkan File EA

Taruh file \`.ex4\`/\`.ex5\` + setting ke folder \`public/downloads/\` dengan nama yang cocok dengan kolom \`file\` di \`data/eas.ts\`. Contoh: \`public/downloads/PulsarScalperXAU.ex5\`. File yang belum diunggah akan 404 saat diunduh.

## Deploy ke Vercel

\`\`\`bash
npx vercel
\`\`\`

Atau push repo ke GitHub lalu import di https://vercel.com/new. Jangan lupa set environment variables.

## Roadmap Fase 2

Verifikasi otomatis via API Exness: nomor akun hanya diterima bila terbaca under afiliasi IB; aktivasi lisensi otomatis. Lihat \`docs/superpowers/specs/2026-08-26-goldpulsarea-design.md\`.

## Testing

\`\`\`bash
npm test
\`\`\`
```

- [ ] **Step 2: Verifikasi akhir semua gate**

Run: `npm run build && npm test && git status --short`
Expected: build PASS, test PASS, working tree bersih setelah commit.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: readme setup, env, deploy guide"
```
