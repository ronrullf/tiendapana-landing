import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  if (!url || !key) {
    throw new Error('Supabase env vars not set (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
  }
  _client = createClient(url, key)
  return _client
}
