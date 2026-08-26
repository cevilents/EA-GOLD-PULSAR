# GoldPulsarEA

Landing page distribusi EA XAUUSD gratis via klaim afiliasi IB Exness.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Setup Form Klaim (Supabase + File Lisensi GitHub)

Form klaim menyimpan pengajuan ke tabel `claims` di Supabase lewat `/api/submit`. Setiap klaim yang disetujui — otomatis saat verifikasi atau manual lewat `/admin` — nomor akun tradingnya langsung ditambahkan ke file lisensi di repo GitHub.

### 1. Supabase

1. Buat project di [supabase.com](https://supabase.com), buka **SQL Editor**, jalankan:
   ```sql
   create table if not exists claims (
     id bigint generated always as identity primary key,
     name text not null,
     email text not null,
     telegram text default '',
     account text not null unique,
     status text not null default 'pending',
     reason text,
     checks jsonb not null default '[]',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );
   ```
2. Ambil **Project URL** dan kunci **service_role** di Settings → API.
3. Salin `.env.example` menjadi `.env.local`, isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`; tambahkan nilai yang sama di Vercel (Project Settings → Environment Variables).

### 2. File lisensi GitHub

Repo publik `aliqasalsabilla5-lang/MEMBERVIP` berisi file `PHOENIXALPHA` yang hanya memuat nomor akun trading teraktivasi, satu per baris. Isi env berikut (lokal maupun Vercel):

```
GITHUB_TOKEN=ghp_tokenmu
GITHUB_REPO=aliqasalsabilla5-lang/MEMBERVIP
LICENSE_FILE_PATH=PHOENIXALPHA
```

`GITHUB_TOKEN` adalah Personal Access Token (classic) dengan scope `repo` pada repo MEMBERVIP; `LICENSE_FILE_PATH` boleh dikosongkan (default `PHOENIXALPHA`).

Caution: karena repo MEMBERVIP publik, siapa pun dapat membaca daftar akun teraktivasi di file `PHOENIXALPHA` — pastikan kamu nyaman dengan itu.

## Admin Panel

Buka `/admin` untuk mengelola klaim secara manual: tab **Klaim** menampilkan semua pengajuan beserta statusnya dan tombol Setujui/Tolak; tab **Pendaftar** menarik daftar klien langsung dari API afiliasi Exness.

1. Tambahkan env berikut (lokal di `.env.local`, produksi di Vercel):
   ```
   ADMIN_PASSWORD=password-admin-yang-kuat
   ADMIN_SESSION_SECRET=string-acak-panjang-minimal-32-karakter
   ```
   `ADMIN_SESSION_SECRET` bertugas menandatangani cookie sesi admin (HMAC, berlaku 8 jam) — isi acak, jangan pernah dipakai ulang untuk keperluan lain.
2. Tab pendaftar hanya berfungsi bila `EXNESS_LOGIN` dan `EXNESS_PASSWORD` sudah diisi.
3. Menyetujui/menolak klaim akan mengubah status di tabel `claims` Supabase dan menambahkan catatan `manual_approve`/`manual_reject` pada riwayat pengecekan; persetujuan juga otomatis menambahkan nomor akun ke file lisensi `PHOENIXALPHA`.

### Verifikasi Otomatis

Klaim pending diverifikasi ulang otomatis tiap 30 menit oleh Vercel Cron yang memanggil `/api/cron/verify` dengan header `Authorization: Bearer $CRON_SECRET`. Set `CRON_SECRET=string-acak` di environment variables Vercel. Verifikasi pertama juga terjadi langsung saat submit. Vercel Hobby hanya mengizinkan cron harian — jadwal `*/30 * * * *` membutuhkan plan Pro; pengguna Hobby bisa mengubah `schedule` di `vercel.json` menjadi harian atau menyetujui klaim manual lewat `/admin`.

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
