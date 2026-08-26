# GoldPulsarEA — Design Document

Tanggal: 2026-08-26
Status: Disetujui (dengan revisi scope — fase 1 frontend only)

## 1. Overview

Landing page GoldPulsarEA: distribusi Expert Advisor (EA) gratis untuk trading XAUUSD. Syarat mendapat EA: klaim lisensi dengan pindah afiliasi ke IB Exness pemilik situs (wallet partner `1149206011366637938`), lalu submit nomor akun real melalui form.

**Fase 1 (sekarang):** tampilan website lengkap + form yang mengirim data klaim ke GitHub Issues.
**Fase 2 (nanti, di luar scope ini):** verifikasi otomatis via API Exness — nomor akun hanya diterima bila terbaca under afiliasi IB; EA aktif otomatis setelah nomor terverifikasi.

Bahasa antarmuka: Indonesia.

## 2. Stack

| Komponen | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict | native Vercel, satu repo untuk statis + serverless |
| Styling | Tailwind CSS v4 | cepat, konsisten |
| Animasi | CSS + IntersectionObserver reveal ringan | tanpa dependency tambahan |
| Font | Space Grotesk (heading) + Inter (body) via `next/font` | tanpa network request runtime |
| Hosting | Vercel | keputusan user |
| Penyimpanan klaim | GitHub Issues di repo privat via REST API | bebas konflik tulis bersamaan, gratis, UI admin gratis |

## 3. Struktur Halaman (single page)

1. **Navbar** sticky — logo GoldPulsarEA, link: Beranda / Koleksi EA / Cara Klaim / FAQ, tombol CTA "Klaim Lisensi".
2. **Hero** — headline, subheadline, dua CTA ("Lihat Koleksi EA", "Klaim Sekarang"), badge "100% Gratis — Syarat: Affiliasi Exness", visual chart XAUUSD animasi canvas halus + ticker harga.
3. **Stats bar** — 4 metrik singkat (EA tersedia, trader aktif, pasangan pair, dukungan).
4. **Koleksi EA** — grid 6 kartu dari satu file data (`data/eas.ts`): nama, deskripsi, tag strategi, winrate, profit factor, max drawdown, timeframe, badge "GRATIS". Data adalah contoh placeholder yang mudah diedit user.
5. **Cara Klaim (tutorial 5 langkah)** — teks persis milik user, branding Phoenix diganti GoldPulsarEA:
   - Langkah 1: Pindah Affiliasi + isi wallet partner → tombol salin wallet `1149206011366637938`, instruksi Live Chat "Partner Change", callout peringatan jangan ketik manual.
   - Langkah 2: Tunggu disetujui Exness → callout: jangan buat akun sebelum disetujui.
   - Langkah 3: WAJIB buat akun real BARU → callout: akun demo tidak dihitung.
   - Langkah 4: Deposit minimal $100 ke akun baru → callout: transfer antar akun tidak dihitung.
   - Langkah 5: Submit nomor akun di form bawah → sistem cek berkala; akses terbuka sendiri saat cocok.
6. **Form Klaim** — input nama, nomor WhatsApp, nomor akun real. Validasi client+server. Submit → `POST /api/submit`. Sukses → membuka/meng-scroll ke section Download.
7. **Download** — daftar file EA dari `data/eas.ts`, tombol unduh dari `public/downloads/`. Terbuka setelah submit sukses (fase 1).
8. **FAQ** — accordion ±6 item (syarat, kenapa harus akun baru, berapa lama proses, dsb).
9. **Footer** — disclaimer risiko trading, kontak, copyright.

## 4. API — `/api/submit`

- Input JSON: `{ name, whatsapp, account }`.
- Validasi: nama 2–60 karakter; WhatsApp digit 9–16 (boleh awali `+`); nomor akun digit 5–12; honeypot field wajib kosong.
- Server membuat Issue di repo GitHub (`GITHUB_REPO` env, mis. `user/goldpulsarea-claims`) dengan token `GITHUB_TOKEN` (env var Vercel, tidak pernah ada di client):
  - Title: `Claim: {name} — {account}`
  - Body: nama, WhatsApp, nomor akun, timestamp ISO, user-agent.
  - Label: `claim`.
- Respons: `200 {ok:true}` / `400 {error}` validasi / `503 {error}` bila env belum dikonfigurasi (UI menampilkan pesan layanan belum siap — jangan bohong sukses).
- Rate limit sederhana in-memory per IP (10 req/jam) sebagai anti-spam dasar.

## 5. Data Model & Konten

- `data/eas.ts`: array objek EA `{ id, name, tagline, description, strategy tags[], winRate, profitFactor, maxDd, timeframe, file }` — sumber tunggal kartu Koleksi & list Download.
- `public/downloads/`: folder kosong berisi `.gitkeep`; user taruh `.ex4/.ex5` + setting nanti. Tombol unduh selalu aktif mengarah ke `/downloads/{file}`; README menjelaskan bahwa nama file di `data/eas.ts` harus sama persis dengan nama file yang diunggah, jika belum ada akan 404 (diterima untuk fase 1).

## 6. Tema Visual

- Dark premium: base `#07080C`–`#0B0D14`, aksen gradasi emas `#F5D06F → #B8860B`, teks putih/abu netral.
- Glassmorphism card, glow emas halus, garis tipis emas pada elemen penting.
- Heading Space Grotesk bold, body Inter; hierarchy jelas, whitespace lega.
- Mobile-first responsif penuh; hormati `prefers-reduced-motion`.

## 7. Error Handling & Robustness

- Semua input divalidasi ulang di server (jangan percaya client).
- Form disable + loading state saat submit; pesan error inline per field.
- Canvas hero berhenti saat tab tidak visible; cleanup listener on unmount (no memory leak).
- Tanpa log data sensitif di console/server (WhatsApp hanya masuk issue body repo privat).

## 8. Verifikasi

- `npm run build` harus lulus (typecheck + lint Next.js).
- `npm run dev` + curl halaman `/` render tanpa error.
- Uji manual validasi form (field kosong, non-numerik, honeypot).
- Submit nyata hanya bisa diuji setelah user isi env `GITHUB_TOKEN` & `GITHUB_REPO` — didokumentasikan di README bagian Setup.

## 9. Out of Scope (Fase 2)

- Integrasi API Exness: cek afiliasi nomor akun, status checker realtime, aktivasi lisensi otomatis.
- Auth/admin dashboard.
