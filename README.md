# Nadeera Teknik — Website Jasa AC Bandung

Landing page *lead generation* untuk jasa pemasangan, perawatan, dan perbaikan
AC di **Bandung Raya** yang dibangun dengan **Astro** + **Tailwind CSS** sesuai
rekomendasi *tech stack* pada `PRD_Nadeera_Teknik.md`.

> 🔐 **Login staff + dashboard konten (Supabase).** Header memakai tombol
> **Login** → popup **Sign in with Google** (khusus untuk staff Nadeera Teknik).
> Staff yang sudah login membuka **`/dashboard`** untuk mengelola (**CRUD**)
> seluruh konten website dari **hero sampai footer**. Konten disimpan di
> Supabase dan situs publik di-render ulang otomatis dari database, sehingga
> proyek ini berjalan sebagai **Server-Side Rendering (SSR)**.

Panduan lengkap menyambungkan Supabase (OAuth Google, tabel, RLS) ada di
**[`SETUP_SUPABASE.md`](SETUP_SUPABASE.md)**.

---

## Isi

- [Teknologi](#-teknologi)
- [Struktur folder](#-struktur-folder)
- [Perintah](#-perintah)
- [Konfigurasi penting](#konfigurasi-penting)
- [Login staff & dashboard](#-login-staff--dashboard)
- [Catatan aset & performa](#-catatan-aset--performa)
- [Node version](#node-version)
- [Git & version control](#git--version-control)
- [Pencacah pengunjung (footer)](#-pencacah-pengunjung-footer)
- [Deploy ke hosting](#deploy-ke-hosting)

---

## 🧰 Teknologi

| Bagian | Pilihan |
| :--- | :--- |
| Framework | [Astro 5](https://astro.build) (SSR via `@astrojs/node`) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Auth & DB | [Supabase](https://supabase.com) (Google OAuth + tabel `site_content`) |
| Font | Plus Jakarta Sans (Google Fonts) |
| Bahasa | TypeScript (`src/site.ts`, `src/lib/*`) |

### Halaman & fitur (sesuai PRD)
- **Hero** — headline "Solusi AC Dingin & Sehat di Bandung" + CTA WhatsApp.
- **Layanan Kami** — 4 layanan (Cuci AC, Bongkar Pasang, Perbaikan/Isi Freon, Kontrak Maintenance).
- **Area Layanan** — jangkauan Bandung Raya (Ciparay, Rancaekek, Soreang, dsb.).
- **Harga & Transparansi** — tabel estimasi harga dasar.
- **Testimoni & Portofolio** — social proof + galeri pengerjaan.
- **Floating WhatsApp Button** — tombol melayang di kanan bawah.
- **Login staff (Google)** — popup di header, hanya akun yang diizinkan.
- **Dashboard `/dashboard`** — CRUD konten hero → footer via Supabase.

---

## 📁 Struktur folder

```
nadeera-teknik/
├─ astro.config.mjs          # konfigurasi Astro (+ plugin Tailwind, adapter Node SSR)
├─ package.json              # skrip, dependencies, engines (Node)
├─ tsconfig.json
├─ .nvmrc                    # versi Node yang disarankan
├─ .gitignore                # mengecualikan node_modules, dist, .astro, .env, .vercel
├─ .env.example              # contoh variabel lingkungan Supabase
├─ SETUP_SUPABASE.md         # ⭐ panduan setup Supabase (login + konten)
├─ public/                   # aset statis (langsung disajikan di root)
│  ├─ logo.png               # logo (disalin dari logo.png di root)
│  ├─ favicon.svg
│  └─ images/                # ikon layanan & ilustrasi galeri (.svg)
└─ src/
   ├─ site.ts                # kontak & helper (nomor WhatsApp, waLink, formatRupiah)
   ├─ lib/
   │  ├─ supabase.ts         # klien Supabase (URL/key dari env)
   │  ├─ default-content.ts  # ⭐ model & konten default seluruh seksi
   │  └─ site-content.ts     # ambil + gabung konten dari Supabase
   ├─ styles/global.css      # Tailwind + design tokens warna brand
   ├─ layouts/BaseLayout.astro   # head HTML, meta SEO, font, JSON-LD
   ├─ components/            # Header, Hero, Services, Pricing, Footer, dll.
   └─ pages/
      ├─ index.astro         # landing page (render konten dari Supabase)
      └─ dashboard.astro     # dashboard admin (login + CRUD konten)
```

---

## ⚡ Perintah

| Tujuan | Perintah |
| :--- | :--- |
| Instal dependency | `npm install` |
| Server pengembangan | `npm run dev` |
| Build produksi (SSR) | `npm run build` → hasil di `dist/` |
| Jalankan hasil build | `npm start` (`node ./dist/server/entry.mjs`) |
| Pratinjau build lokal | `npm run preview` |

---

## ⚙️ Konfigurasi penting

- **Kontak & WhatsApp** di **`src/site.ts`** (`SITE`, `waLink()`, `formatRupiah`).
- **Konten website (hero → footer)** sekarang berada di **`src/lib/default-content.ts`**
  sebagai nilai default, dan dapat diedit runtime dari dashboard via Supabase.

> ⚠️ **Nomor WhatsApp** dikonfigurasi di `SITE.phoneIntl` & `SITE.phoneDisplay`
> (sudah diisi nomor resmi). Ubahlah di `src/site.ts` bila nomor berubah — semua
> tombol "Pesan Teknisi" otomatis mengikuti.

---

## 🔐 Login staff & dashboard

Fitur untuk staf internal mengelola konten website secara **CRUD (hero → footer)**.

- **Tombol Login** ada di header (desktop & menu mobile). Saat diklik muncul
  **popup** berisi tombol **Sign in with Google** dan kalimat
  *"khusus untuk staff nadeera teknik"*.
- Autentikasi memakai **Supabase Auth** (Google OAuth). Akses dibatasi **dua
  lapis**: hanya akun dari domain yang diizinkan (pengaturan provider Google)
  **dan** yang email-nya terdaftar di tabel **`site_admins`** yang bisa membuka
  dashboard (lihat `SETUP_SUPABASE.md`).
- Setelah login, staff membuka **`/dashboard`** untuk mengedit tiap seksi
  (Navigasi, Hero, Layanan, Area, Harga, Testimoni, Portofolio, CTA, Footer),
  menambah/menghapus item, lalu **Simpan** ke tabel `site_content`.
- **Keamanan:** pengecekan admin dilakukan di UI **dan** di database (Row Level
  Security). Akun Google yang benar tapi **bukan admin** → secara otomatis
  di-*logout* dan diarahkan kembali ke halaman website.
- Halaman publik (**`/`**) membaca konten dari Supabase saat diminta (SSR),
  jadi perubahan langsung tampil tanpa build ulang. Tanpa Supabase dikonfigurasi,
  situs tetap tampil memakai **konten default** di `src/lib/default-content.ts`.

---

## 🖼️ Catatan aset & performa

- `logo.png` (di root proyek) disalin ke `public/logo.png` dan dipakai di
  header, footer, favicon, dan *structured data* (JSON-LD `HVACBusiness`).
- Gambar galeri/ikon saat ini berupa **ilustrasi SVG ringan** sebagai pengganti
  foto. Untuk memenuhi target performa PRD, ganti dengan **foto asli teknisi
  berformat WebP** di `public/images/` dan perbarui path pada seksi Portofolio
  (konten bisa diedit dari dashboard).
- Semua `<img>` sudah memakai `loading="lazy"` (kecuali logo utama yang
  `fetchpriority="high"`).
- JavaScript hanya dipakai untuk popup login, menu mobile, dan dashboard
  (halaman publik tetap ringan).

---

## 🔢 Node version

Proyek memakai Node **v22**. Untuk konsistensi build (terutama di CI/Vercel):

- **`.nvmrc`** berisi `22` (untuk pengguna `nvm`).
- **`package.json`** mendeklarasikan `"engines": { "node": ">=20" }`.

Vercel akan memakai versi sesuai file tersebut.

---

## 🧩 Git & version control

Repo sudah di-*initialize* dengan dua commit awal. **`.gitignore`** mengecualikan:

- `node_modules/` dan `dist/` — jangan pernah di-commit.
- `.astro/` — cache/internal Astro.
- `.env`, `.env.production` — kredensial.
- `.vercel` & `.vercel/` — link/token lokal Vercel CLI.
- log debug & file sistem (`.DS_Store`, `Thumbs.db`).

---

## 📊 Pencacah Pengunjung (Footer)

Footer menampilkan **Total pengunjung** dan **Kunjungan hari ini**, dihitung
oleh komponen `src/components/VisitorCounter.astro`:

- **Implementasi:** angka tersimpan di **Supabase** (tabel `visitor_stats`) lewat
  fungsi RPC `record_visit` (lihat `SETUP_SUPABASE.md` § 4.5), sehingga akurat
  lintas-perangkat — bukan sekadar per-perangkat.
- `localStorage` hanya dipakai sebagai **penanda** (`nt_counted-YYYYMMDD`) agar
  setiap perangkat hanya menambah **+1 per hari**; *reload* berulang tidak
  menaikkan angka.
- **Kunjungan hari ini** otomatis reset setiap tengah malam (waktu server).
- Bila Supabase belum dikonfigurasi, komponen otomatis memakai hitungan
  `localStorage` lama sebagai cadangan.

---

## 🚀 Deploy ke hosting (SSR)

Karena konten diambil dari database saat halaman diminta, proyek kini memakai
**Server-Side Rendering (SSR)** dengan adapter **`@astrojs/node`**.

### Opsi A — Hosting Node apa pun (VPS, Railway, Render, Fly.io)

1. Bangun lalu jalankan server Node:
   ```bash
   npm install
   npm run build        # hasil di dist/
   npm start            # node ./dist/server/entry.mjs
   ```
2. Atur variabel lingkungan `PUBLIC_SUPABASE_URL` dan
   `PUBLIC_SUPABASE_ANON_KEY` di platform hosting Anda.

### Opsi B — Vercel / Netlify

Proyek ini memakai adapter Node secara *default*. Untuk platform serupa, pasang
adapter resmi Astro dan sesuaikan `astro.config.mjs`:

- Vercel: `npm i @astrojs/vercel` lalu `import vercel from '@astrojs/vercel/serverless'`
  dan `adapter: vercel()`.
- Netlify: `npm i @astrojs/netlify` lalu `adapter: netlify()`.

Lihat dokumentasi adapter di [docs.astro.build](https://docs.astro.build/en/guides/integrations-guide/vercel).

### Pasca-deploy

- **Custom domain**: atur DNS (mis. `nadeerateknik.com`) sesuai petunjuk penyedia.
- Jangan lupa isi **variabel lingkungan Supabase** di platform hosting.
- Pastikan **URL dashboard** (`https://domain/dashboard`) sudah ditambahkan ke
  **Authorized redirect URIs** pada Google OAuth (lihat `SETUP_SUPABASE.md`).

---

© Nadeera Teknik. Seluruh hak cipta dilindungi.

---
<img width="1813" height="903" alt="image" src="https://github.com/user-attachments/assets/9758fe5a-ac1a-47a3-9999-0b810d0b0506" />

---
<img width="1568" height="905" alt="image" src="https://github.com/user-attachments/assets/bd7fb12b-92aa-44aa-b9ac-c20faa28ad56" />

---
<img width="1888" height="905" alt="image" src="https://github.com/user-attachments/assets/509380ec-a911-4c66-8983-3a5b2d848c28" />


