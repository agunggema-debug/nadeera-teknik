import { isSupabaseConfigured, supabase } from './supabase';
import { DEFAULT_CONTENT, type SiteContent } from './default-content';

// ---------------------------------------------------------------------------
// Fungsi pembacaan konten dari tabel Supabase `site_content`
// (kolom: section text PRIMARY KEY, content jsonb, updated_at timestamptz).
// Tabel harus mengizinkan anon SELECT (lihat SETUP_SUPABASE.md).
// ---------------------------------------------------------------------------

export type SectionKey = keyof SiteContent;

const SECTION_KEYS: SectionKey[] = [
  'navigation',
  'hero',
  'services',
  'areas',
  'pricing',
  'testimonials',
  'portfolio',
  'cta',
  'footer',
];

/** Gabungkan konten default dengan konten yang tersimpan (deep-merge, array diganti utuh). */
export function mergeContent<T>(defaultValue: T, override: unknown): T {
  if (override === null || override === undefined) return defaultValue;
  if (Array.isArray(defaultValue)) {
    return (Array.isArray(override) ? override : defaultValue) as T;
  }
  if (typeof defaultValue === 'object' && typeof override === 'object') {
    const base = defaultValue as Record<string, unknown>;
    const over = override as Record<string, unknown>;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(over)) {
      if (key in base) {
        out[key] = mergeContent(base[key], over[key]);
      } else {
        out[key] = over[key];
      }
    }
    return out as T;
  }
  // Primitif: pakai nilai override bila ada.
  return override as T;
}

/** Ambil semua konten dari Supabase, digabung dengan default. */
export async function getSiteContent(): Promise<SiteContent> {
  const result: SiteContent = structuredClone(DEFAULT_CONTENT);

  if (!isSupabaseConfigured || !supabase) return result;

  const { data, error } = await supabase
    .from('site_content')
    .select('section, content');

  if (error || !data) return result;

  const stored = new Map<string, unknown>();
  for (const row of data) stored.set(row.section as string, row.content);

  for (const key of SECTION_KEYS) {
    const override = stored.get(key as string);
    if (override !== undefined) {
      result[key] = mergeContent(result[key], override) as SiteContent[typeof key];
    }
  }

  return result;
}

/** Ambil satu seksi saja, digabung default. */
export async function getSection<K extends SectionKey>(key: K): Promise<SiteContent[K]> {
  const all = await getSiteContent();
  return all[key];
}
