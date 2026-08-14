# Nadeera Teknik — Website Jasa AC Bandung

Landing page *lead generation* untuk jasa pemasangan, perawatan, dan perbaikan
AC di Bandung Raya, dibangun dengan **Astro** + **Tailwind CSS** (menurut
rekomendasi *tech stack* di `PRD_Nadeera_Teknik.md`).

## Persiapan

1. Instal dependency:

   ```bash
   npm install
   ```

2. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

3. Build produksi (output statis di folder `dist/`):

   ```bash
   npm run build
   npm run preview   # pratinjau build secara lokal
   ```

## Konfigurasi penting

Semua data (kontak WhatsApp, layanan, harga, area, testimoni) terpusat di
**`src/site.ts`**. Ganti nomor WhatsApp pada `site.ts` dengan nomor resmi
format internasional (tanpa `+`/spasi), mis. `6281234567890`.

## Catatan aset

- `logo.png` (di root proyek) disalin ke `public/logo.png` dan dipakai di
  header, footer, favicon, dan *structured data*.
- Gambar galeri/ikon saat ini berupa ilustrasi SVG ringan sebagai pengganti
  foto. Untuk performa sesuai PRD, ganti foto asli teknisi dengan format
  **WebP** (bisa diletakkan di `public/images/`) dan perbarui array `gallery`
  di `src/components/Testimonials.astro`. Semua `<img>` sudah memakai
  `loading="lazy"`.