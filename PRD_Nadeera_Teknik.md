# Product Requirements Document (PRD): Website Nadeera Teknik

## 1. Ringkasan Proyek
**Nadeera Teknik** adalah penyedia jasa pemasangan, perawatan, dan perbaikan AC (Air Conditioner) yang beroperasi di wilayah Bandung dan sekitarnya. Website ini akan berfungsi sebagai kanal utama untuk *lead generation* (mendatangkan pelanggan) dengan menonjolkan profesionalisme, kepercayaan, dan kemudahan akses untuk pemesanan jasa.

## 2. Tujuan Bisnis & Produk
*   **Meningkatkan Konversi:** Mengubah pengunjung website menjadi pelanggan melalui Call-to-Action (CTA) yang jelas dan terhubung langsung ke WhatsApp.
*   **Performa Maksimal:** Memastikan waktu muat (*load time*) di bawah 2 detik untuk mencegah pengunjung kabur karena *loading* lama.
*   **Membangun Kepercayaan:** Menampilkan desain yang memikat, portofolio pengerjaan, dan ulasan pelanggan nyata.
*   **Local SEO:** Mendominasi pencarian lokal dengan kata kunci seperti "Jasa AC Bandung", "Service AC Ciparay", dan sekitarnya.

## 3. Target Pengguna
*   **Pemilik Rumah (B2C):** Membutuhkan perbaikan AC cepat karena rusak atau cuaca panas, serta layanan cuci AC rutin.
*   **Pemilik Bisnis/Kantor/Kafe (B2B):** Membutuhkan instalasi AC baru atau kontrak *maintenance* rutin di area Bandung.

---

## 4. Fitur & Halaman Utama (Scope of Work)

| Halaman/Fitur | Deskripsi & Persyaratan |
| :--- | :--- |
| **Hero Section (Beranda)** | *Headline* yang kuat (misal: "Solusi AC Dingin & Sehat di Bandung"), sub-headline, dan tombol CTA "Pesan Teknisi Sekarang" yang mencolok. |
| **Layanan Kami** | Rincian jasa: Cuci AC, Bongkar Pasang, Perbaikan/Isi Freon, dan Kontrak *Maintenance*. Disertai ikon desain modern. |
| **Area Layanan** | Menampilkan cakupan area di Bandung Raya untuk meyakinkan calon pelanggan bahwa lokasi mereka terjangkau. |
| **Harga & Transparansi** | Tabel estimasi harga dasar (misal: Cuci AC mulai dari Rp XX.000) agar pelanggan merasa aman dari biaya tersembunyi. |
| **Testimoni & Portofolio** | Galeri foto teknisi sedang bekerja (kualitas tinggi) dan *review* pelanggan untuk *social proof*. |
| **Floating WhatsApp Button** | Tombol WhatsApp yang selalu melayang di sudut kanan bawah layar, baik di desktop maupun *mobile*. |

---

## 5. Persyaratan Non-Fungsional (Desain & Performa)

### A. Tampilan yang Memikat (UI/UX)
*   **Mobile-First Design:** Lebih dari 80% pencarian jasa lokal dilakukan melalui *smartphone*. Tampilan harus sempurna dan mudah dinavigasi dengan satu tangan di layar HP.
*   **Skema Warna:** Menggunakan warna yang merepresentasikan kebersihan, teknologi, dan suhu dingin (misal: kombinasi Biru Elektrik, Putih Bersih, dan aksen Oranye/Kuning untuk tombol CTA).
*   **Tipografi:** Font Sans-serif yang modern dan mudah dibaca (seperti Inter atau Plus Jakarta Sans).
*   **Aset Visual:** Hindari *stock photo* yang terlihat kaku. Gunakan aset grafis/ilustrasi modern, atau foto asli teknisi Nadeera Teknik dengan sentuhan *editing* yang profesional.

### B. Kecepatan Akses (Performa)
*   **Skor Lighthouse:** Target minimal 90+ untuk *Performance, Accessibility, Best Practices*, dan *SEO*.
*   **Optimasi Gambar:** Semua gambar wajib menggunakan format WebP dan menerapkan *lazy loading*.
*   **Minim JavaScript:** Hindari animasi berat yang membebani *rendering* halaman di *smartphone* kelas menengah ke bawah.

---

## 6. Rekomendasi Teknologi (Tech Stack)

### Rekomendasi Framework: Astro atau Next.js
  **Opsi Utama: Astro **
    *   **Alasan:** Astro adalah *framework* modern yang secara *default* tidak mengirimkan JavaScript ke *browser* (konsep *Zero-JS*). Ini membuat website memuat konten statis dengan kecepatan ekstrem. Sangat cocok untuk *landing page* jasa teknis yang mengutamakan kecepatan akses baca dan SEO.
    *   **Styling:** Gunakan **Tailwind CSS** untuk mendesain UI yang memikat secara cepat dan dengan ukuran *file* CSS yang sangat kecil.





