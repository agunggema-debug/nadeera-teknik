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

> Kunci `anon` itu _public_ dan aman ditampilkan di front-end. Keamanan data
> dijaga lewat **Row Level Security (RLS)** (langkah 4).

---

## 2. Aktifkan login Google

1. Buka **Authentication → Providers → Google**.
2. Aktifkan toggle **Enable Sign in with Google**.
3. Buat **OAuth 2.0 Client ID** di [Google Cloud Console](https://console.cloud.google.com):
   - **Authorized redirect URI** tambahkan dari Supabase di halaman provider,
     biasanya `https://<ref>.supabase.co/auth/v1/callback`.
   - Isi _Client ID_ dan _Client Secret_ ke Supabase.
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
   https://nadeera-teknik.vercel.app/
   ```
2. **Redirect URLs** → daftarkan **semua** domain tempat login dipakai. Sebagai
   contoh, untuk Vercel + custom domain sekaligus pengembangan lokal:
   ```
   https://nadeera-teknik.vercel.app/**
   http://localhost:4321/**
   http://localhost:3000/**
   ```
3. Klik **Save**. Perubahan berlaku langsung tanpa perlu deploy ulang.

> ⚠️ Jika `redirectTo` yang dikirim kode (yaitu `window.location.origin +
'/dashboard'`) **tidak terdaftar** di daftar Redirect URLs, Supabase mengabaikan
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
... site_content`, **hapus** policy tersebut (mis. lewat halaman **Auth →
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

## 4.5. Pencacah pengunjung (footer) via Supabase

Angka **Total pengunjung** dan **Kunjungan hari ini** di footer kini berasal dari
tabel `visitor_stats` (bukan `localStorage`). Tabel menyimpan satu baris; angka
hanya bisa diubah lewat fungsi RPC `record_visit` yang berjalan sebagai
`security definer`, sehingga pengunjung tak bisa menulis langsung ke tabel.

Jalankan di **SQL Editor**:

```sql
-- (a) Tabel satu-baris untuk total pengunjung & kunjungan hari ini.
create table if not exists public.visitor_stats (
  id         int primary key default 1,
  total      bigint not null default 0,
  today      bigint not null default 0,
  today_date date   not null default current_date,
  updated_at timestamptz not null default now()
) with (fillfactor = 100);

-- Kunci selalu satu baris (jangan pernah menambah baris lain).
alter table public.visitor_stats
  drop constraint if exists visitor_stats_single_row;
alter table public.visitor_stats
  add constraint visitor_stats_single_row check (id = 1);

-- RLS diaktifkan dan TANPA policy apa pun:
-- publik tidak boleh SELECT/INSERT/UPDATE/DELETE langsung ke tabel.
alter table public.visitor_stats enable row level security;

-- (b) Fungsi RPC: baca statistik; bila p_increment = true tambah +1.
--     Tanggal hari ini otomatis direset bila berganti hari.
create or replace function public.record_visit(p_increment boolean)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total  bigint;
  v_today  bigint;
  v_date   date := current_date;
  r        public.visitor_stats%rowtype;
begin
  insert into public.visitor_stats (id, total, today, today_date)
  values (1, 0, 0, current_date)
  on conflict (id) do nothing;

  select * into r from public.visitor_stats where id = 1;

  -- Hari berganti -> hitungan "hari ini" direset ke 0.
  if r.today_date is distinct from v_date then
    r.today := 0;
  end if;

  if p_increment then
    r.today := r.today + 1;
    r.total := r.total + 1;
    update public.visitor_stats
       set total      = r.total,
           today      = r.today,
           today_date = v_date,
           updated_at = now()
     where id = 1;
  end if;

  return json_build_object('total', r.total, 'today', r.today);
end;
$$;

-- (c) Izinkan anon & pengguna login memanggil RPC (hanya lewat fungsi ini).
grant execute on function public.record_visit(boolean) to anon, authenticated;
```

> **Cara kerja di sisi website:** `src/components/VisitorCounter.astro` memanggil
> RPC ini dari browser. `localStorage` hanya dipakai sebagai **penanda** agar
> setiap perangkat menambah **+1 per hari** (reload berulang tidak menaikkan
> angka); angka yang ditampilkan sepenuhnya berasal dari Supabase. Bila Supabase
> belum dikonfigurasi, komponen otomatis memakai hitungan `localStorage` lama.

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
> staff menyimpan lewat dashboard, JSON yang sama akan di-_upsert_ ke baris
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

| Gejala                                                                                                | Penyebab & Solusi                                                                                                                                                           |
| :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Klik **Sign in with Google** lalu muncul `Unsupported provider: missing OAuth secret`                 | **Client Secret** di Authentication → Providers → Google masih kosong. Isi dengan Secret dari Google Cloud Console (lihat langkah 2), klik **Save**, muat ulang halaman.    |
| Muncul pesan `Err... invalid client` / `invalid_client`                                               | **Client ID** (atau Secret) salah/tidak cocok di Supabase. Periksa dan salin ulang dari Google Cloud Console.                                                               |
| Pesan `redirect_uri_mismatch` / `not_authorized`                                                      | URL callback (`https://<ref>.supabase.co/auth/v1/callback`) belum ditambahkan ke **Authorized redirect URIs** di Google Cloud Console.                                      |
| Angka pengunjung di footer tidak berubah (tetap `···`) dan konsol browser menampilkan `function public.record_visit(...) does not exist` | Tabel & fungsi RPC `record_visit` belum dibuat di Supabase. Jalankan SQL pada **§ 4.5** (tabel `visitor_stats` + fungsi + grant), lalu muat ulang halaman. |
| Dashboard menampilkan "Supabase belum dikonfigurasi"                                                  | `.env` belum dibuat atau `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` kosong.                                                                                         |
| Setelah login muncul **"Akses Ditolak"** dan kembali ke website                                       | Email Google Anda belum terdaftar di `site_admins`. Tambahkan: `insert into public.site_admins (email) values ('anda@...');`.                                               |
| Konten website tidak berubah setelah disimpan di dashboard                                            | Pastikan policy RLS (langkah 4) mengizinkan **admin** (`is_admin()`) untuk _insert/update_, dan cek Anda sudah login dengan akun admin.                                     |

---

© Nadeera Teknik.
