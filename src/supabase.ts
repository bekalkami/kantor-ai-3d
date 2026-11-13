export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://havpcpyoipfrpxbazcya.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export interface LaporanRow {
  id: string;
  agent_id: string;
  ringkasan: string;
  menunggu: string[];
  mendesak: string[];
  angka: Array<{ label: string; nilai: string }>;
  updated_at?: string;
}

export async function fetchLaporanSupabase(): Promise<Record<string, any> | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kantor_laporan?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) return null;
    const data: LaporanRow[] = await res.json();
    const result: Record<string, any> = {};
    for (const row of data) {
      result[row.agent_id] = {
        ringkasan: row.ringkasan,
        menunggu: row.menunggu || [],
        mendesak: row.mendesak || [],
        angka: row.angka || [],
      };
    }
    return result;
  } catch (err) {
    console.warn('Gagal memuat data dari Supabase, menggunakan data lokal:', err);
    return null;
  }
}
