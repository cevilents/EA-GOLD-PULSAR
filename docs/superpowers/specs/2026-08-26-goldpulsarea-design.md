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

---

## Addendum Fase 2 — Verifikasi Exness + Admin Panel (2026-08-26)

### API Exness Partnership (base https://my.exnessaffiliates.com)

- Auth: `POST /api/v2/auth/` body `{login, password}` → `{token}`; header `Authorization: JWT <token>`; kredensial hanya via env `EXNESS_LOGIN`/`EXNESS_PASSWORD`; token dicache in-memory, re-login saat 401.
- Cek afiliasi akun: `GET /api/reports/clients/accounts/?client_account={mt5}&limit=10` → array kosong berarti bukan di bawah kita; row memberi `client_uid`, `client_account_type` (deteksi Cent), `volume_mln_usd`.
- Statistik client: `GET /api/v2/reports/clients/?client_uid={uid}&limit=1` → `deposit_amount`, `client_balance`, `ftd_received`, `client_status`. Angka diasumsikan unit akun (lihat Cent di bawah).
- Daftar pendaftar: endpoint v2 clients tanpa filter `client_uid` (paginate limit/offset).

### Aturan verifikasi

- APPROVED bila: akun ada di report kita DAN (`deposit_amount >= 100` ATAU `client_balance >= 50`) — konstanta `MIN_DEPOSIT_USD=100`, `MIN_BALANCE_USD=50`.
- Akun Cent (type mengandung "cent"): threshold dikali `CENT_FACTOR=100` (unit cent). Faktor & threshold dikonsentrasikan di `lib/exness.ts` agar mudah diubah.
- Nilai mentah selalu tampil di admin; admin dapat override approve/reject manual.

### Storage klaim (menggantikan skema issue lama)

- Tetap GitHub Issues repo privat (env sama). Body issue = blok JSON tunggal: `{version, name, email, telegram, account, createdAt, updatedAt, status: "pending"|"approved"|"rejected", checks: [...], note}`; title `[CLAIM] {name} — {account}`.
- Status diubah via PATCH issue body (tanpa label — hindari 422 label tidak ada).

### Endpoint baru

- `POST /api/submit` (rework): validasi field baru → simpan issue `pending` → verifikasi langsung → respons `{ok, status}`.
- `GET /api/claim/status?account=` → status klaim terakhir untuk nomor itu (untuk buka unduhan saat kembali).
- `POST /api/admin/login` — `ADMIN_PASSWORD` env → cookie HttpOnly bertanda-tangan HMAC (`ADMIN_SESSION_SECRET`); rate limit reuse limiter.
- `GET /api/admin/claims` — daftar klaim; `PATCH /api/admin/claims` — `{account, action: approve|reject, note?}`.
- `GET /api/admin/clients` — proxy daftar pendaftar dari Exness (limit 100).
- `GET /api/cron/verify` — dipanggil Vercel Cron tiap 30 menit (vercel.json): verifikasi ulang semua `pending`.

### Form baru

Nama Lengkap, Email, Username Telegram (opsional), Akun real MT5. Validasi: nama 2–60; email RFC-praktis ≤120; telegram opsional `^@?[a-zA-Z0-9_]{4,32}$`; akun MT5 digit 5–12.

### UI

- ClaimFlow: field baru, status `approved` membuka unduhan; `pending` menampilkan pesan cek berkala + tombol "Cek Status Lagi" (panggil `/api/claim/status`).
- `/admin` (halaman statis client, Indonesia saja): login → dua tab (Klaim: tabel status + approve/reject; Pendaftar: tabel clients Exness). Tanpa i18n.

### Env tambahan

`EXNESS_LOGIN`, `EXNESS_PASSWORD`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
