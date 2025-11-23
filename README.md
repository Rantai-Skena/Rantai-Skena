# Rantai Skena

> Jembatan digital antara musisi alternatif Indonesia, venue lokal, dan agen global — dengan marketplace gigs + chatbot edukasi keuangan & royalti.

Rantai Skena adalah prototipe platform web untuk skena musik alternatif Indonesia (hardcore, emo, pop-punk, indie, dll.) yang menghubungkan band/artist dengan stakeholder (label, promotor, venue, kolektif), sekaligus menyediakan **asisten AI** untuk edukasi keuangan, royalti, dan kesiapan karier global.

Proyek ini dikembangkan sebagai implementasi teknis dari proposal **“Rantai Skena – Infrastruktur Digital & AI untuk Skena Musik Alternatif Indonesia”** pada Kompetisi Inovasi Budaya Go 2025.

---

## Fitur Utama

### 1. Gig Marketplace & Matching Dasar

- Halaman **Explore Gigs** menampilkan daftar event/gig dari berbagai kota dengan:
  - Filter berdasarkan **genre** (Pop, Indie, Hardcore, Emo, dll.)
  - Filter berdasarkan **kota/lokasi**
  - Pencarian teks (nama event, lokasi).
- Event di-generate/diisi lewat backend (termasuk seed data dummy) dengan informasi:
  - Nama event, lokasi, tanggal & jam mulai/selesai
  - Genre utama, deskripsi singkat, status publikasi (`isPublished`).

### 2. Artist Profile & Portofolio Terintegrasi

- Role **artist** dapat:
  - Mengisi **profil musisi** (stage name, kota, genre, bio, social links) lewat endpoint `/artist/profile`.
  - Mengelola **katalog musik** (judul, cover, link Spotify/YouTube/other) lewat route `/artist/music`.
  - Mengelola **gallery** visual (cover, dokumentasi panggung, dsb.) lewat route `/artist/gallery`.

Ini mentransformasi fungsi media sosial band menjadi **profil terstandar** yang mudah dibaca promotor, sebagaimana diusulkan dalam proposal (profil terintegrasi, digital legibility).

### 3. Dashboard Artist & Agent

Frontend menyediakan dua dashboard utama:

- **Dashboard Artist**

  - Mengelola profil musisi
  - Mengelola musik & gallery
  - Melihat daftar gig & apply ke event
  - Melihat status application (pending / approved / rejected / completed).

- **Dashboard Agent**
  - Membuat & mengelola event/gigs
  - Melihat dan memproses application dari band (termasuk update status).
  - Mengakses jadwal & event milik agen melalui tab-tab seperti `My Event`, `My Application`, `My Music`, `Schedule` di komponen `dashboard-agent.tsx`.

### 4. Sistem Application & Status (Cikal Bakal “Verified Gig Record”)

- Artist dapat mengajukan diri ke event lewat route `/application` (POST).
- Artist bisa melihat seluruh application mereka di `/application/my`.
- Agent dapat mengubah status application (`pending`, `approved`, `rejected`, `completed`) lewat `/application/:id/status`, dengan cek kepemilikan event terlebih dahulu.

Data inilah yang ke depan bisa dikembangkan menjadi **“digital legibility”** dan rekam jejak gigs/kerja sama sebagai dasar analisis risiko & bukti legal untuk kebutuhan seperti Visa P-1/O-1.

### 5. Rantai Skena AI Assistant

---

## Arsitektur Teknis

Proyek ini adalah monorepo berbasis **Turborepo** + **pnpm workspaces**.

### Stack Utama

- **Frontend**

  - Next.js 16 (App Router)
  - React 19
  - Tailwind CSS 4 + shadcn/ui
  - `@assistant-ui/react` untuk UI chat
  - PWA-ready (script generate PWA assets tersedia).

- **Backend API**

  - Hono (Node.js) sebagai HTTP framework utama.
  - Drizzle ORM + PostgreSQL untuk persistence.
  - Better-Auth sebagai authentication layer (packages/auth + apps/server).

- **Shared Packages**

  - `@rantai-skena/db` — schema Drizzle + koneksi DB + script seeding.
  - `@rantai-skena/auth` — konfigurasi Better-Auth & tipe-tipe tambahan.
  - `@rantai-skena/api` — lapisan abstraksi API (jika digunakan di web/server).

- **Tooling**
  - Turborepo untuk orkestrasi build/dev/db.
  - Biome, Husky, dsb. dari template Better-T-Stack.

---

## Struktur Proyek

```txt
rantai-skena/
├── apps/
│   ├── web/                # Frontend Next.js (landing, explore gigs, dashboard, chat)
│   └── server/             # Backend Hono API (auth, artist, agent, events, chat, dll.)
├── packages/
│   ├── api/                # (Opsional) Abstraksi API & klien
│   ├── auth/               # Konfigurasi Better-Auth (provider, plugins, hooks)
│   └── db/                 # Schema Drizzle, koneksi, dan seed data
├── pnpm-workspace.yaml     # Konfigurasi workspaces
├── turbo.json              # Konfigurasi Turborepo tasks
└── README.md               # Dokumentasi proyek (file ini)
```

---

## Menjalankan Secara Lokal

### 1. Prasyarat

- **Node.js** v20+ (direkomendasikan)
- **pnpm** (package manager)
- **PostgreSQL** lokal atau managed (Neon, Railway, dsb.)

### 2. Clone & Install

```bash
git clone <url-repo-ini> rantai-skena
cd rantai-skena

pnpm install
```

### 3. Konfigurasi Environment

Buat file `.env` berdasarkan `.env.example`:

**Backend (`apps/server/.env`)**

```bash
cp apps/server/.env.example apps/server/.env
```

Isi variabel berikut:

```env
DATABASE_URL=postgres://user:password@host:port/dbname
BETTER_AUTH_SECRET=some-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

**Frontend (`apps/web/.env`)**

```bash
cp apps/web/.env.example apps/web/.env
```

Isi:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

> `NEXT_PUBLIC_SERVER_URL` akan digunakan oleh auth client & API client di Next.js untuk memanggil Hono server.

### 4. Setup Database

Pastikan PostgreSQL sudah berjalan dan `DATABASE_URL` benar.

Jalankan migrasi/schema push dari root:

```bash
pnpm run db:push
```

Perintah ini akan menjalankan task Turborepo `db:push` yang mengarah ke workspace DB/Server.

Opsional: buka Drizzle Studio untuk menginspeksi data:

```bash
pnpm run db:studio
```

### 5. (Opsional) Seed Data Gigs

Di dalam `@rantai-skena/db` terdapat script seed event yang dapat dijalankan langsung (menambahkan event acak untuk bulan Desember 2025, lengkap dengan genre, lokasi, dan deskripsi).

Contoh (jalankan dari root dengan runner TS pilihan kamu, sesuaikan dengan setup lokal):

```bash
# Contoh: menggunakan tsx atau node -r ts-node/register
pnpm --filter @rantai-skena/db exec tsx src/seed/events.seed.ts
```

Setelah sukses, kamu akan melihat log seperti:

```text
✅ Seeded XX events (randomized, Dec 2025)
✅ Seed events finished
```

### 6. Jalankan Aplikasi

Dari root monorepo:

```bash
# Menjalankan web + server sekaligus
pnpm run dev
```

- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend API (Hono): [http://localhost:3000](http://localhost:3000)

Atau jalankan terpisah:

```bash
# Hanya web
pnpm run dev:web

# Hanya server
pnpm run dev:server
```

---

## Script yang Tersedia

Dari root:

- `pnpm run dev` — Menjalankan semua apps dalam mode development
- `pnpm run dev:web` — Menjalankan hanya Next.js web
- `pnpm run dev:server` — Menjalankan hanya Hono server
- `pnpm run build` — Build semua aplikasi
- `pnpm run check-types` — Cek type TypeScript seluruh workspace
- `pnpm run db:push` — Menerapkan schema Drizzle ke database
- `pnpm run db:studio` — Membuka Drizzle Studio
- `pnpm run check` — Format + lint dengan Biome
- `cd apps/web && pnpm run generate-pwa-assets` — Generate aset PWA (icon, manifest, dll.)

---

## Roadmap Singkat

Beberapa hal yang direncanakan (sesuai proposal, belum semua terimplementasi di kode):

- **Digital Legibility & Scoring**: skor keterbacaan digital band berdasarkan rekam jejak gigs & ekonomi (honor, royalti, pajak).
- **Visa Moat & Compliance-as-a-Service**: paket data terverifikasi untuk keperluan aplikasi Visa P-1/O-1, kerja sama lintas negara, dan regulasi setempat.
- **RAG Service Terpisah**: layanan AI khusus (FastAPI + LangChain + Pinecone) untuk rekomendasi dan advice yang lebih kaya.
