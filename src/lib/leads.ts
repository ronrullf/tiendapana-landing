import { getSupabase } from './supabase'
import type { LeadInput } from './whatsapp'

export async function saveLeadToSupabase(
  data: LeadInput,
  fuente: 'hero' | 'final' | 'sticky-mobile'
) {
  const supabase = getSupabase()
  const { error } = await supabase.from('leads').insert({
    nombre: data.nombre,
    instagram: data.instagram,
    que_vende: data.que_vende,
    whatsapp: data.whatsapp ?? null,
    fuente,
    user_agent: navigator.userAgent,
  })
  if (error) throw error
}
