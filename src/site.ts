// Konfigurasi data situs — satu tempat untuk kontak & link yang sering dipakai.
//
// GANTI nomor WhatsApp di bawah dengan nomor resmi Nadeera Teknik
// (format internasional, tanpa "+" dan spasi).
export const SITE = {
  title: 'Nadeera Teknik — Jasa AC Bandung',
  description:
    'Jasa pasang, cuci, perbaikan & perawatan AC di Bandung dan sekitarnya. Teknisi berpengalaman, harga transparan, garansi pengerjaan. Pesan sekarang via WhatsApp.',
  phoneDisplay: '+62 812-3456-7890',
  phoneIntl: '6281234567890',
  email: 'halo@nadeerateknik.com',
  domain: 'nadeerateknik.com',
};

export const WHATSAPP_LINK = `https://wa.me/${SITE.phoneIntl}`;

export function waLink(message: string): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

// Daftar layanan & harga estimasi (nilai rupiah mentah).
export const SERVICES = [
  {
    id: 'cuci-ac',
    title: 'Cuci AC',
    short: 'Cuci AC',
    desc: 'Cuci unit indoor & outdoor secara menyeluruh agar AC lebih dingin, hemat listrik, dan lebih sehat.',
    priceStart: 75000,
    image: '/images/icon-cuci.svg',
  },
  {
    id: 'bongkar-pasang',
    title: 'Bongkar & Pasang AC',
    short: 'Bongkar Pasang',
    desc: 'Instalasi AC baru maupun pindahan antar lokasi di Bandung Raya, dengan pemasangan rapih dan aman.',
    priceStart: 300000,
    image: '/images/icon-pasang.svg',
  },
  {
    id: 'perbaikan-freon',
    title: 'Perbaikan & Isi Freon',
    short: 'Perbaikan / Freon',
    desc: 'Diagnosa dan perbaikan AC mati, bocor, kurang dingin, serta isi ulang freon sesuai standar pabrikan.',
    priceStart: 150000,
    image: '/images/icon-perbaikan.svg',
  },
  {
    id: 'maintenance',
    title: 'Kontrak Maintenance',
    short: 'Kontrak Maintenance',
    desc: 'Perawatan berkala untuk rumah, kantor, kafe & usaha. Servis terjadwal supaya AC selalu prima.',
    priceStart: 50000,
    image: '/images/icon-maintenance.svg',
  },
];

export const AREAS = [
  'Kota Bandung',
  'Ciparay',
  'Rancaekek',
  'Maju Kencana',
  'Cileunyi',
  'Jatinangor',
  'Soreang',
  'Katapang',
  'Margahayu',
  'Buah Batu',
  'Cimahi',
  'Ujung Berung',
  'Antapani',
  'Cibiru',
  'Baleendah',
  'Dayeuhkolot',
];

export const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Pemilik Rumah, Antapani',
    star: 5,
    text: 'AC saya cepat sekali didatangi teknisi dan langsung beres. Harga sesuai estimasi, tidak ada biaya tersembunyi. Recommended!',
  },
  {
    name: 'Rina Wijaya',
    role: 'Pemilik Kafe, Buah Batu',
    star: 5,
    text: 'Sudah pakai kontrak maintenance selama setahun. AC kafe selalu adem dan teknisi selalu tepat waktu.',
  },
  {
    name: 'Andri Hermawan',
    role: 'Kantor, Jatinangor',
    star: 5,
    text: 'Pemasangan 8 unit AC baru di kantor selesai dalam sehari. Rapi, berpenampilan profesional, dan diberi garansi.',
  },
  {
    name: 'Sari Purnama',
    role: 'Pemilik Rumah, Ciparay',
    star: 4,
    text: 'Pelayanan ramah, teknisi membawa alas dan menutup lantai supaya tetap bersih. Komunikasi via WhatsApp cepat.',
  },
];

export function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}