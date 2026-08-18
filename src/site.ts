// Konfigurasi data situs — satu tempat untuk kontak & link yang sering dipakai.
//
// GANTI nomor WhatsApp di bawah dengan nomor resmi Nadeera Teknik
// (format internasional, tanpa "+" dan spasi).
export const SITE = {
  title: "Nadeera Teknik — Jasa AC Bandung",
  description: "Jasa pasang, cuci, perbaikan & perawatan AC di Bandung dan sekitarnya. Teknisi berpengalaman, harga transparan, garansi pengerjaan. Pesan sekarang via WhatsApp.",
  phoneDisplay: "+62 858-6122-9676",
  phoneIntl: "6285861229676",
  email: "halo@nadeerateknik.com",
  domain: "nadeerateknik.com",
};

export const WHATSAPP_LINK = `https://wa.me/${SITE.phoneIntl}`;

export function waLink(message: string): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
