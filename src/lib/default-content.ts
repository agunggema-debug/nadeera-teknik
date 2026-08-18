// ---------------------------------------------------------------------------
// Model konten website + nilai default.
//
// Seluruh teks/isi halaman dari header → footer disimpan sebagai satu
// struktur JSON yang bisa diedit dari dashboard admin dan disimpan ke tabel
// Supabase `site_content` (satu baris per seksi). Nilai di bawah ini menjadi
// fallback bila Supabase belum dikonfigurasi atau tabel masih kosong.
// ---------------------------------------------------------------------------

export interface NavLink {
  href: string;
  label: string;
}

export interface HeroTrust {
  title: string;
  desc: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  short: string;
  desc: string;
  priceStart: number;
  image: string;
}

export interface PricingRow {
  service: string;
  unit: string;
  price: number;
  note: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  star: number;
  text: string;
}

export interface PortfolioItem {
  src: string;
  alt: string;
  label: string;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface SiteContent {
  navigation: { links: NavLink[] };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string[];
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    tempLabel: string;
    tempCaption: string;
    trust: HeroTrust[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pricePrefix: string;
    ctaLabel: string;
    items: ServiceItem[];
  };
  areas: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaNote: string;
    ctaLink: string;
    items: string[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    headerLayanan: string;
    headerSatuan: string;
    headerEstimasi: string;
    headerCatatan: string;
    footnote: string;
    cta: string;
    rows: PricingRow[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  portfolio: {
    eyebrow: string;
    title: string;
    note: string;
    items: PortfolioItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    about: string;
    hours: string;
    quickLinksTitle: string;
    quickLinks: FooterLink[];
    contactTitle: string;
    email: string;
    rights: string;
    tagline: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  navigation: {
    links: [
      { href: '#layanan', label: 'Layanan' },
      { href: '#area', label: 'Area Layanan' },
      { href: '#harga', label: 'Harga' },
      { href: '#testimoni', label: 'Testimoni' },
    ],
  },
  hero: {
    eyebrow: 'Melayani Bandung Raya & Sekitarnya',
    titleStart: 'Solusi AC',
    titleHighlight: ['Dingin', 'Sehat'],
    titleEnd: 'di Bandung',
    subtitle:
      'Teknisi berpengalaman, harga transparan, dan garansi pengerjaan. Dari cuci, pasang, perbaikan, hingga kontrak maintenance — pesan sekarang dan AC Anda beres hari ini juga.',
    ctaPrimary: 'Pesan Teknisi Sekarang',
    ctaSecondary: 'Lihat Layanan',
    tempLabel: '24°C',
    tempCaption: 'Dingin & bebas bakteri',
    trust: [
      { title: 'Respon Cepat', desc: 'Teknisi siap dijadwalkan hari ini' },
      { title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi' },
      { title: 'Garansi Pengerjaan', desc: 'Dijamin oleh Nadeera Teknik' },
    ],
  },
  services: {
    eyebrow: 'Layanan Kami',
    title: 'Perawatan AC lengkap, satu tim andal',
    subtitle:
      'Semua kebutuhan AC Anda — rumah, kantor, hingga kafe — ditangani teknisi berpengalaman dengan hasil rapi dan berjangka waktu pasti.',
    pricePrefix: 'Mulai dari',
    ctaLabel: 'Tanya via WhatsApp',
    items: [
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
    ],
  },
  areas: {
    eyebrow: 'Area Layanan',
    title: 'Menjangkau Bandung Raya & sekitarnya',
    subtitle:
      'Teknisi kami siap meluncur ke lokasi Anda. Jika area belum tertera, tanyakan langsung — kami tetap bisa membantu selama terjangkau.',
    ctaNote: 'Di luar daftar di atas?',
    ctaLink: 'Cek jangkauan via WhatsApp',
    items: [
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
    ],
  },
  pricing: {
    eyebrow: 'Harga & Transparansi',
    title: 'Estimasi harga dasar, tanpa biaya tersembunyi',
    subtitle:
      'Anda tahu perkiraan biaya sebelum teknisi datang. Harga final dikonfirmasi di awal setelah pengecekan.',
    headerLayanan: 'Layanan',
    headerSatuan: 'Satuan',
    headerEstimasi: 'Estimasi',
    headerCatatan: 'Catatan',
    footnote:
      '* Estimasi ini adalah angka dasar dan dapat berubah sesuai tipe AC, kapasitas (PK), dan kondisi unit. Biaya dikonfirmasi transparan sebelum pengerjaan dimulai.',
    cta: 'Minta Penawaran Sekarang →',
    rows: [
      { service: 'Cuci AC Indoor + Outdoor', unit: 'per unit', price: 75000, note: 'AC split standar 0.5–1 PK' },
      { service: 'Cuci AC (Unit LG/Inverter)', unit: 'per unit', price: 95000, note: 'Di atas 1.5 PK dikenakan biaya menyesuaikan' },
      { service: 'Isi Freon R32 / R410A', unit: 'per unit', price: 150000, note: 'Tergantung kapasitas & tekanan' },
      { service: 'Bongkar Pasang AC', unit: 'per unit', price: 300000, note: 'Jarak lokasi & ukuran memengaruhi harga' },
      { service: 'Pasang AC Baru (instalasi)', unit: 'per unit', price: 350000, note: 'Belum termasuk pipa & jasa tambahan' },
      { service: 'Kontrak Maintenance', unit: 'per unit/bln', price: 50000, note: 'Min. 3 unit, servis rutin terjadwal' },
    ],
  },
  testimonials: {
    eyebrow: 'Testimoni Pelanggan',
    title: 'Dipercaya pelanggan di Bandung Raya',
    subtitle: 'Kepuasan pelanggan adalah bukti kualitas kami.',
    items: [
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
    ],
  },
  portfolio: {
    eyebrow: 'Portofolio',
    title: 'Pengerjaan yang rapi & profesional',
    note: 'Sebagian dokumentasi pekerjaan tim kami.',
    items: [
      { src: '/images/gallery-teknisi.svg', alt: 'Teknisi Nadeera Teknik sedang menangani unit AC', label: 'Servis rutin' },
      { src: '/images/gallery-pasang.svg', alt: 'Proses pemasangan unit AC baru', label: 'Instalasi baru' },
      { src: '/images/gallery-cuci.svg', alt: 'Pembersihan unit AC indoor', label: 'Cuci AC' },
    ],
  },
  cta: {
    title: 'Siap membuat ruangan Anda kembali dingin & sehat?',
    subtitle:
      'Konsultasi gratis via WhatsApp. Teknisi kami siap membantu hari ini di Bandung Raya & sekitarnya.',
    button: 'Pesan Teknisi Sekarang',
  },
  footer: {
    about:
      'Penyedia jasa pemasangan, perawatan, dan perbaikan AC berbiaya transparan di Bandung dan sekitarnya. Dipercaya untuk hunian maupun bisnis.',
    hours: 'Jam operasional: setiap hari, 08.00–20.00 WIB',
    quickLinksTitle: 'Tautan',
    quickLinks: [
      { href: '#layanan', label: 'Layanan Kami' },
      { href: '#area', label: 'Area Layanan' },
      { href: '#harga', label: 'Harga' },
      { href: '#portofolio', label: 'Portofolio' },
      { href: '#testimoni', label: 'Testimoni' },
    ],
    contactTitle: 'Hubungi Kami',
    email: 'halo@nadeerateknik.com',
    rights: 'Nadeera Teknik. Seluruh hak cipta dilindungi.',
    tagline: 'Jasa Service AC Bandung • & Sekitarnya',
  },
};
