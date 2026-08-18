import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Klien Supabase tunggal (browser & server).
//
// Nilai diambil dari variabel lingkungan public (aman untuk key "anon").
// Buat file `.env` dari `.env.example` dan isi dengan proyek Supabase Anda.
//
//   PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
//   PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
//
// Jika belum dikonfigurasi, semua fitur Supabase (login & konten dinamis)
// dinonaktifkan dan situs tetap tampil dengan konten default.

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

/** Redirect URL yang dipakai saat Google OAuth selesai. */
export function authRedirectTo(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/dashboard';
  }
  return '/dashboard';
}

/**
 * Ubah error autentikasi Supabase menjadi pesan yang ramah pengguna (Bahasa
 * Indonesia). Beberapa error berasal dari konfigurasi di dashboard Supabase,
 * bukan dari kode — pesan di bawah membantu staf tahu harus perbaiki apa.
 */
export function describeAuthError(err: unknown): string {
  let raw: string = '';
  try {
    const cand = (err as { message?: string })?.message ?? String(err ?? '');
    // Error Supabase terkadang berupa JSON string seperti
    // {"code":400,"error_code":"validation_failed","msg":"Unsupported provider: missing OAuth secret"}
    const parsed = JSON.parse(cand);
    raw = typeof parsed.msg === 'string' ? parsed.msg : JSON.stringify(parsed);
  } catch {
    raw = String((err as { message?: string })?.message ?? err ?? '');
  }
  const lower = raw.toLowerCase();

  if (lower.includes('missing oauth secret') || (lower.includes('unsupported provider') && lower.includes('oauth'))) {
    return (
      'Login Google belum aktif di Supabase. Buka Authentication → Providers → Google, ' +
      'lalu isi Client Secret (dari Google Cloud Console), simpan, lalu coba lagi.'
    );
  }
  if (lower.includes('invalid client_id') || lower.includes('invalid client') || lower.includes('invalid_client')) {
    return 'Kredensial Google tidak valid. Periksa Client ID pada provider Google di Supabase.';
  }
  if (
    lower.includes('redirect_uri') ||
    lower.includes('redirect uri') ||
    lower.includes('callback') ||
    lower.includes('not_authorized')
  ) {
    return 'URL redirect belum terdaftar di Google Cloud Console. Tambahkan URL callback dari Supabase ke "Authorized redirect URIs".';
  }
  return 'Gagal menghubungkan ke Google. Silakan coba lagi, atau periksa pengaturan provider di Supabase.';
}
