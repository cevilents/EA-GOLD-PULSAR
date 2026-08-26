# GoldPulsarEA

Landing page distribusi EA XAUUSD gratis via klaim afiliasi IB Exness.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Setup Form Klaim (GitHub Issues)

Form klaim menyimpan pengajuan sebagai Issue di repo GitHub privat lewat `/api/submit`.

1. Buat repo privat kosong (mis. `username/goldpulsarea-claims`).
2. Buat Personal Access Token (classic) dengan scope `repo`: GitHub → Settings → Developer settings → Tokens.
3. Salin `.env.example` menjadi `.env.local`, isi:
   ```
   GITHUB_TOKEN=ghp_tokenmu
   GITHUB_REPO=username/goldpulsarea-claims
   ```
4. Di Vercel: Project Settings → Environment Variables → tambahkan kedua nilai yang sama.

Tanpa kedua variabel itu, form mengembalikan pesan "layanan belum dikonfigurasi".

## Admin Panel

Buka `/admin` untuk mengelola klaim secara manual: tab **Klaim** menampilkan semua pengajuan beserta statusnya dan tombol Setujui/Tolak; tab **Pendaftar** menarik daftar klien langsung dari API afiliasi Exness.

1. Tambahkan env berikut (lokal di `.env.local`, produksi di Vercel):
   ```
   ADMIN_PASSWORD=password-admin-yang-kuat
   ADMIN_SESSION_SECRET=string-acak-panjang-minimal-32-karakter
   ```
   `ADMIN_SESSION_SECRET` bertugas menandatangani cookie sesi admin (HMAC, berlaku 8 jam) — isi acak, jangan pernah dipakai ulang untuk keperluan lain.
2. Tab pendaftar hanya berfungsi bila `EXNESS_LOGIN` dan `EXNESS_PASSWORD` sudah diisi.
3. Menyetujui/menolak klaim akan mengubah status di repo GitHub Issues dan menambahkan catatan `manual_approve`/`manual_reject` pada riwayat pengecekan.

## Mengubah Daftar EA

Edit satu file: `data/eas.ts`. Nama `file` harus sama persis dengan nama file yang kamu unggah.

## Kontak Support

Ganti nilai `WHATSAPP_SUPPORT` di `data/eas.ts` dengan link WhatsApp admin asli (format `https://wa.me/62xxxxxxxxxx`). Link ini dipakai footer sebagai kanal bantuan pengunjung.

## Menambahkan File EA

Taruh file `.ex4`/`.ex5` + setting ke folder `public/downloads/` dengan nama yang cocok dengan kolom `file` di `data/eas.ts`. Contoh: `public/downloads/PulsarScalperXAU.ex5`. File yang belum diunggah akan 404 saat diunduh.

## Deploy ke Vercel

```bash
npx vercel
```

Atau push repo ke GitHub lalu import di https://vercel.com/new. Jangan lupa set environment variables.

## Roadmap Fase 2

Verifikasi otomatis via API Exness: nomor akun hanya diterima bila terbaca under afiliasi IB; aktivasi lisensi otomatis. Lihat `docs/superpowers/specs/2026-08-26-goldpulsarea-design.md`.

## Testing

```bash
npm test
```
