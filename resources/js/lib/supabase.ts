import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export async function pingSupabase() {
  const { data, error } = await supabase.from('pg_stat_statements' as any).select('*').limit(1);
  // Not all projects have this view; ignore errors and return basic info
  return { ok: !error, error: error?.message };
}