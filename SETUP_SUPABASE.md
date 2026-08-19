# Setup Supabase untuk Login Staff & Dashboard Konten

Panduan langkah demi langkah agar **login dengan Google** dan **dashboard
pengelolaan konten** (hero → footer) berfungsi. Alur yang dibangun:

1. Staff menekan tombol **Login** di header → popup **Sign in with Google**.
2. Akun Google staff (yang sudah "di-invite" / masuk daftar domain yang
   diizinkan) melewati otentikasi Supabase.
3. Setelah login, staff diarahkan ke **`/dashboard`** dan dapat mengedit konten
   website. Perubahan langsung tampil di situs publik (di-render dari database).

---

## 1. Buat proyek Supabase

1. Daftar/masuk di [supabase.com](https://supabase.com) → **New Project**.
2. Pilih region terdekat dan set **Database Password** (simpan).
3. Setelah proyek jadi, buka **Settings → API** dan catat:
   - `Project URL` → dipakai sebagai `PUBLIC_SUPABASE_URL`
   - `anon public key` → dipakai sebagai `PUBLIC_SUPABASE_ANON_KEY`

Salin nilai tersebut ke file **`.env`** (buat dari `.env.example`):

```env
PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (anon)
```

> Kunci `anon` itu *public* dan aman ditampilkan di front-end. Keamanan data
> dijaga lewat **Row Level Security (RLS)** (langkah 4).

---

## 2. Aktifkan login Google

1. Buka **Authentication → Providers → Google**.
2. Aktifkan toggle **Enable Sign in with Google**.
3. Buat **OAuth 2.0 Client ID** di [Google Cloud Console](https://console.cloud.google.com):
   - **Authorized redirect URI** tambahkan dari Supabase di halaman provider,
     biasanya `https://<ref>.supabase.co/auth/v1/callback`.
   - Isi *Client ID* dan *Client Secret* ke Supabase.
4. **Pembatasan hanya untuk staff (penting):** pada provider Google di Supabase,
   isi **Allowed email domains** dengan domain kantor, misal `nadeerateknik.com`.
   Dengan ini hanya akun Google dengan domain tersebut yang bisa login.

> 💡 Cara alternatif: di **Authentication → Users → Invite user**, masukkan
> alamat email staff. Akun yang di-invite ini yang boleh masuk (gabungkan dengan
> pembatasan domain di atas agar hanya email kantor yang valid).

> ⚠️ **Jika muncul error `Unsupported provider: missing OAuth secret`** saat
> menekan **Sign in with Google**, artinya **Client Secret** Google belum diisi
> (atau kosong/placeholder) pada **Authentication → Providers → Google** di
> Supabase. Ini **bukan** bug pada kode website — **Client ID saja tidak cukup**;
> Anda wajib mengisi **Client Secret** dari Google Cloud Console (tidak pernah
> terlihat lagi setelah dibuat — bikin ulang di Google Console bila lupa), lalu
> klik **Save**. Setelah itu buka halaman login dan coba lagi.

Setelah itu, tombol **Sign in with Google** di header otomatis aktif.

**2.5. Konfigurasi URL (Sangat penting agar redirect login benar)**

Setelah login Google selesai, Supabase mengarahkan browser ke URL tujuan.
Konfigurasi URL yang salah adalah penyebab paling umum kegagalan login di
produksi — gejala khasnya browser diarahkan ke `http://localhost:3000` lalu
muncul `ERR_CONNECTION_REFUSED`, padahal token login sudah berhasil dibuat.

Buka **Authentication → URL Configuration**:

1. **Site URL** → set ke domain produksi (bukan `localhost`):
   ```
   https://nadeerateknik.com
   ```
2. **Redirect URLs** → daftarkan **semua** domain tempat login dipakai. Sebagai
   contoh, untuk Vercel + custom domain sekaligus pengembangan lokal:
   ```
   https://nadeerateknik.com/**
   https://nadeerateknik.com/dashboard
   https://<project>.vercel.app/**
   http://localhost:4321/**
   http://localhost:3000/**
   ```
3. Klik **Save**. Perubahan berlaku langsung tanpa perlu deploy ulang.

> ⚠️ Jika `redirectTo` yang dikirim kode (yaitu `window.location.origin +
> '/dashboard'`) **tidak terdaftar** di daftar Redirect URLs, Supabase mengabaikan
> `redirectTo` tersebut dan memakai **Site URL** sebagai gantinya. Selama Site URL
> masih mengarah ke `localhost`, browser akan gagal terhubung setelah login.

---

## 3. Buat tabel konten

Buka **SQL Editor** → **New query** lalu jalankan:

```sql
create table if not exists public.site_content (
  section    text primary key,
  content    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

> Tabel ini menampung satu baris per seksi: `navigation`, `hero`, `services`,
> `areas`, `pricing`, `testimonials`, `portfolio`, `cta`, dan `footer`.

---

## 4. Tabel admin & keamanan (hanya admin yang boleh mengelola konten)

Agar **tidak semua akun Google** bisa mengubah konten, hanya email yang terdaftar
di tabel `site_admins` yang diizinkan. Proyek menggunakan **keamanan berlapis**:
pengecekan di UI **dan** penegakan di database (RLS), sehingga membuka dashboard
secara manual pun tetap diblokir bila bukan admin.

Jalankan di **SQL Editor**:

```sql
-- (a) Daftar admin yang diizinkan.
create table if not exists public.site_admins (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- (b) Fungsi aman: apakah pengguna yang sedang login adalah admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.site_admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- (c) RLS: daftar admin hanya bisa dibaca oleh admin (anti-tamper).
alter table public.site_admins enable row level security;
create policy "admins can read site_admins"
  on public.site_admins for select
  using (public.is_admin());
create policy "admins can manage site_admins"
  on public.site_admins for all
  using (public.is_admin())
  with check (public.is_admin());

-- (d) Konten: publik boleh baca; HANYA admin yang boleh menulis.
alter table public.site_content enable row level security;

create policy "public can read site_content"
  on public.site_content for select
  using (true);

create policy "only admins can insert site_content"
  on public.site_content for insert
  with check (public.is_admin());

create policy "only admins can update site_content"
  on public.site_content for update
  using (public.is_admin());

create policy "only admins can delete site_content"
  on public.site_content for delete
  using (public.is_admin());
```

> ⚠️ Jika sebelumnya Anda sudah menjalankan policy lama `authenticated can
> ... site_content`, **hapus** policy tersebut (mis. lewat halaman **Auth →
> Policies**) agar non-admin tidak lagi bisa menulis. Policy baru di atas sudah
> menggantikannya.

### Mendaftarkan admin

Tambahkan email staf yang berhak mengakses dashboard:

```sql
insert into public.site_admins (email) values ('nama@nadeerateknik.com');
```

> Untuk pengguna yang belum terdaftar, buka **Authentication → Users → Invite
> user** lalu masukkan email tersebut, dan tambahkan email-nya ke `site_admins`.
> Seorang pengguna hanya bisa membuka dashboard bila **logged-in dengan Google
> AND email-nya berada di `site_admins`**; selain itu dashboard tidak tersedia
> dan pengguna diarahkan kembali ke website.

---

## 5. Isi konten awal (opsional)

Jika tabel kosong, website tetap menampilkan **konten default** yang sudah
dibundel di `src/lib/default-content.ts`. Untuk menyimpan konten default ke
database (agar mulai diedit dari dashboard), jalankan di SQL Editor:

```sql
insert into public.site_content (section, content) values
  ('navigation', '{"links":[{"href":"#layanan","label":"Layanan"},{"href":"#area","label":"Area Layanan"},{"href":"#harga","label":"Harga"},{"href":"#testimoni","label":"Testimoni"}]}'::jsonb),
  ('hero', '{"eyebrow":"Melayani Bandung Raya & Sekitarnya","titleStart":"Solusi AC","titleHighlight":["Dingin","Sehat"],"titleEnd":"di Bandung","subtitle":"Teknisi berpengalaman, harga transparan, dan garansi pengerjaan.","ctaPrimary":"Pesan Teknisi Sekarang","ctaSecondary":"Lihat Layanan","tempLabel":"24°C","tempCaption":"Dingin & bebas bakteri","trust":[{"title":"Respon Cepat","desc":"Teknisi siap dijadwalkan hari ini"},{"title":"Harga Transparan","desc":"Tanpa biaya tersembunyi"},{"title":"Garansi Pengerjaan","desc":"Dijamin oleh Nadeera Teknik"}]}'::jsonb)
on conflict (section) do nothing;
```

> Isi kolom `content` mengikuti struktur JSON di `default-content.ts`. Saat
> staff menyimpan lewat dashboard, JSON yang sama akan di-*upsert* ke baris
> seksi tersebut.

---

## 6. Jalankan & uji

```bash
npm install
npm run dev
```

- Buka **`/`** → klik **Login** di header → popup **Sign in with Google**.
- Login dengan akun staff (domain yang diizinkan **dan** terdaftar di `site_admins`).
- Setelah login, buka **`/dashboard`** → edit seksi → klik **Simpan**.
- Muat ulang halaman utama → konten berubah sesuai yang Anda simpan.
- Akun Google lain (tidak terdaftar di `site_admins`): setelah login otomatis
  di-logout dan diarahkan kembali ke halaman website.

---

## 7. Deploy (SSR)

Karena konten diambil dari database saat halaman diminta, proyek kini memakai
**Server-Side Rendering (SSR)** dengan adapter Node (`@astrojs/node`).

- **Hosting Node apa pun** (VPS, Railway, Render, Fly.io): build lalu jalankan:
  ```bash
  npm run build
  npm start            # menjalankan ./dist/server/entry.mjs
  ```
- **Vercel/Netlify**: pasang adapter resminya (`@astrojs/vercel` /
  `@astrojs/netlify`) di `astro.config.mjs` — lihat dokumentasi Astro.
- Pastikan variabel lingkungan `PUBLIC_SUPABASE_URL` dan
  `PUBLIC_SUPABASE_ANON_KEY` ikut diatur pada platform hosting.

---

## 8. Pemecahan masalah (Troubleshooting)

| Gejala | Penyebab & Solusi |
| :--- | :--- |
| Klik **Sign in with Google** lalu muncul `Unsupported provider: missing OAuth secret` | **Client Secret** di Authentication → Providers → Google masih kosong. Isi dengan Secret dari Google Cloud Console (lihat langkah 2), klik **Save**, muat ulang halaman. |
| Muncul pesan `Err... invalid client` / `invalid_client` | **Client ID** (atau Secret) salah/tidak cocok di Supabase. Periksa dan salin ulang dari Google Cloud Console. |
| Pesan `redirect_uri_mismatch` / `not_authorized` | URL callback (`https://<ref>.supabase.co/auth/v1/callback`) belum ditambahkan ke **Authorized redirect URIs** di Google Cloud Console. |
| Konsol browser menampilkan `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` (`api.countapi.xyz`) | CountAPI sudah dihapus dari kode — pencacah pengunjung kini memakai `localStorage` tanpa jaringan eksternal. Pastikan Anda memakai `npm run build` terbaru / `npm run dev`. |
| Dashboard menampilkan "Supabase belum dikonfigurasi" | `.env` belum dibuat atau `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` kosong. |
| Setelah login muncul **"Akses Ditolak"** dan kembali ke website | Email Google Anda belum terdaftar di `site_admins`. Tambahkan: `insert into public.site_admins (email) values ('anda@...');`. |
| Konten website tidak berubah setelah disimpan di dashboard | Pastikan policy RLS (langkah 4) mengizinkan **admin** (`is_admin()`) untuk *insert/update*, dan cek Anda sudah login dengan akun admin. |

---

© Nadeera Teknik.
