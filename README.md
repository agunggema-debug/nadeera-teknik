# Nadeera Teknik — Website Jasa AC Bandung

Landing page *lead generation* untuk jasa pemasangan, perawatan, dan perbaikan
AC di **Bandung Raya** yang dibangun dengan **Astro** + **Tailwind CSS** sesuai
rekomendasi *tech stack* pada `PRD_Nadeera_Teknik.md`.

> ✅ Proyek menghasilkan *output statis* murni (`dist/`), sehingga performa cepat
> dan deployment sangat sederhana — **tanpa adapter/SSR**.

---

## Isi

- [Teknologi](#-teknologi)
- [Struktur folder](#-struktur-folder)
- [Perintah](#-perintah)
- [Konfigurasi penting](#konfigurasi-penting)
- [Catatan aset & performa](#catatan-aset--performa)
- [Node version](#node-version)
- [Git & version control](#git--version-control)
- [Deploy ke Vercel](#deploy-ke-vercel)

---

## 🧰 Teknologi

| Bagian | Pilihan |
| :--- | :--- |
| Framework | [Astro 5](https://astro.build) (static/Zero-JS di browser) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Font | Plus Jakarta Sans (Google Fonts) |
| Bahasa | TypeScript (di sandi `src/site.ts`) |

### Halaman & fitur (sesuai PRD)
- **Hero** — headline "Solusi AC Dingin & Sehat di Bandung" + CTA WhatsApp.
- **Layanan Kami** — 4 layanan (Cuci AC, Bongkar Pasang, Perbaikan/Isi Freon, Kontrak Maintenance).
- **Area Layanan** — jangkauan Bandung Raya (Ciparay, Rancaekek, Soreang, dsb.).
- **Harga & Transparansi** — tabel estimasi harga dasar.
- **Testimoni & Portofolio** — social proof + galeri pengerjaan.
- **Floating WhatsApp Button** — tombol melayang di kanan bawah.

---

## 📁 Struktur folder

```
nadeera-teknik/
├─ astro.config.mjs          # konfigurasi Astro (+ plugin Tailwind vite)
├─ package.json              # skrip, dependencies, engines (Node)
├─ tsconfig.json
├─ .nvmrc                    # versi Node yang disarankan
├─ .gitignore                # mengecualikan node_modules, dist, .astro, .vercel
├─ public/                   # aset statis (langsung disajikan di root)
│  ├─ logo.png               # logo (disalin dari logo.png di root)
│  ├─ favicon.svg
│  └─ images/                # ikon layanan & ilustrasi galeri (.svg)
└─ src/
   ├─ site.ts                # ⭐ semua data + kontak (satu sumber kebenaran)
   ├─ styles/global.css      # Tailwind + design tokens warna brand
   ├─ layouts/BaseLayout.astro   # head HTML, meta SEO, font, JSON-LD
   ├─ components/            # Header, Hero, Services, Pricing, Footer, dll.
   └─ pages/index.astro      # halaman tunggal (landing page)
```

---

## ⚡ Perintah

| Tujuan | Perintah |
| :--- | :--- |
| Instal dependency | `npm install` |
| Server pengembangan | `npm run dev` |
| Build produksi (statis) | `npm run build` → hasil di `dist/` |
| Pratinjau build lokal | `npm run preview` |

---

## ⚙️ Konfigurasi penting

Semua data terpusat di **`src/site.ts`**:

- **Kontak** (`SITE`): judul, deskripsi, nama, email, dan **nomor WhatsApp**.
- **Layanan** (`SERVICES`), **Area** (`AREAS`), **Testimoni** (`TESTIMONIALS`), dan helper `waLink()` untuk tombol WhatsApp.

> ⚠️ **Wajib sebelum go-live:** ganti nomor WhatsApp placeholder
> `6281234567890` di `SITE.phoneIntl` dengan nomor resmi (format internasional,
> tanpa `+`/spasi). Semua tombol "Pesan Teknisi" mengarah ke nomor ini.

---

## 🖼️ Catatan aset & performa

- `logo.png` (di root proyek) disalin ke `public/logo.png` dan dipakai di
  header, footer, favicon, dan *structured data* (JSON-LD `HVACBusiness`).
- Gambar galeri/ikon saat ini berupa **ilustrasi SVG ringan** sebagai pengganti
  foto. Untuk memenuhi target performa PRD, ganti dengan **foto asli teknisi
  berformat WebP** di `public/images/` dan perbarui array `gallery` di
  `src/components/Testimonials.astro`.
- Semua `<img>` sudah memakai `loading="lazy"` (kecuali logo utama yang
  `fetchpriority="high"`).
- Skrip menu mobile & JSON-LD di-*inline* oleh Astro → hasil *output* statis
  hampir tanpa JavaScript, bagus untuk skor Lighthouse.

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

## 🚀 Deploy ke Vercel

Karena proyek **fully static**, Vercel cukup menjalankan `npm run build` lalu
menyajikan isi folder `dist/` — **tidak perlu adapter**.

### Opsi A — Integrasi Git (GitHub) + dashboard (disarankan)

1. Push ke GitHub:
   ```bash
   git remote add origin <url-repo-github>
   git push -u origin main
   ```
2. Di dashboard [Vercel](https://vercel.com): **Add New → Project** → import
   repo tersebut.
3. Biarkan pengaturan bawaan (dideteksi otomatis):
   - Install command: `npm install`
   - Build command: `npm run build`
   - **Output directory: `dist`**
4. Klik **Deploy**.

### Opsi B — Vercel CLI (tanpa Git/GitHub)

```bash
npm i -g vercel
vercel            # setup pertama: pilih scope → pilih "Other" → output dir = dist
vercel --prod     # deploy produksi
```

### Pasca-deploy

- **Custom domain**: Project → **Settings → Domains** → tambahkan
  `nadeerateknik.com`, lalu set record DNS sesuai petunjuk Vercel.
- Nilai `site` di `astro.config.mjs` bersifat opsional (berguna untuk sitemap/SEO)
  dan tidak menghalangi deploy.

---

© Nadeera Teknik. Seluruh hak cipta dilindungi.