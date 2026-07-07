import { getSupabase } from './supabase'

// ── Types ────────────────────────────────────────────────────────────────────

export type ClientPublic = {
  id: string
  nombre: string
  plan: string | null
  fecha_inicio: string | null
  fecha_entrega: string | null
  store_url: string | null
  whatsapp: string | null
  fase_actual: number
}

export type Client = ClientPublic & {
  slug: string
  access_code: string
  created_at: string
}

export type Phase = {
  id: string
  client_id: string
  fase_num: number
  titulo: string
  subtitulo: string | null
  quien: string | null
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'bloqueado'
  updated_at: string
}

export type Material = {
  id: string
  client_id: string
  tipo: string
  titulo: string
  recibido: boolean
  notas: string | null
  archivo_url: string | null
  updated_at: string
}

export type Tutorial = {
  id: string
  client_id: string
  titulo: string
  video_url: string | null
  descripcion: string | null
  orden: number
  visible: boolean
  updated_at: string
}

// ── Client portal ─────────────────────────────────────────────────────────────

export async function verifyAccess(slug: string, code: string): Promise<ClientPublic | null> {
  const { data, error } = await getSupabase()
    .rpc('get_client_by_access', { p_slug: slug.toLowerCase(), p_code: code.trim() })
  if (error || !data?.length) return null
  return data[0] as ClientPublic
}

export async function findClientByCode(code: string): Promise<(ClientPublic & { slug: string }) | null> {
  const { data, error } = await getSupabase()
    .rpc('get_client_by_code', { p_code: code.trim() })
  if (error || !data?.length) return null
  return data[0] as ClientPublic & { slug: string }
}

export async function getPhases(clientId: string): Promise<Phase[]> {
  const { data } = await getSupabase()
    .from('project_phases')
    .select('*')
    .eq('client_id', clientId)
    .order('fase_num')
  return (data ?? []) as Phase[]
}

export async function getMaterials(clientId: string): Promise<Material[]> {
  const { data } = await getSupabase()
    .from('materials')
    .select('*')
    .eq('client_id', clientId)
    .order('tipo')
  return (data ?? []) as Material[]
}

export async function getTutorials(clientId: string): Promise<Tutorial[]> {
  const { data } = await getSupabase()
    .from('tutorials')
    .select('*')
    .eq('client_id', clientId)
    .order('orden')
  return (data ?? []) as Tutorial[]
}

// ── Admin auth ────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  return getSupabase().auth.signInWithPassword({ email, password })
}

export async function adminLogout() {
  return getSupabase().auth.signOut()
}

export async function getAdminSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export async function getAllClients(): Promise<Client[]> {
  const { data } = await getSupabase()
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Client[]
}

export async function createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
  const { data, error } = await getSupabase()
    .from('clients')
    .insert(client)
    .select()
    .single()
  if (error) throw error
  return data as Client
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const { error } = await getSupabase()
    .from('clients')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteClient(id: string) {
  const { error } = await getSupabase()
    .from('clients')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function updatePhaseEstado(id: string, estado: Phase['estado']) {
  const { error } = await getSupabase()
    .from('project_phases')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function updateMaterial(id: string, updates: Partial<Omit<Material, 'id' | 'client_id'>>) {
  const { error } = await getSupabase()
    .from('materials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function addTutorial(tutorial: Omit<Tutorial, 'id' | 'updated_at'>) {
  const { error } = await getSupabase()
    .from('tutorials')
    .insert({ ...tutorial, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function updateTutorial(id: string, updates: Partial<Omit<Tutorial, 'id' | 'client_id'>>) {
  const { error } = await getSupabase()
    .from('tutorials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteTutorial(id: string) {
  const { error } = await getSupabase()
    .from('tutorials')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── File upload (Supabase Storage) ───────────────────────────────────────────

export async function uploadMaterialFile(clientId: string, tipo: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${clientId}/${tipo}/${Date.now()}.${ext}`
  const { error } = await getSupabase()
    .storage
    .from('client-files')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = getSupabase()
    .storage
    .from('client-files')
    .getPublicUrl(path)
  return data.publicUrl
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_PHASES: Array<Omit<Phase, 'id' | 'client_id' | 'updated_at'>> = [
  { fase_num: 1, titulo: 'Onboarding — Envío de material', subtitulo: 'Tú me mandas logo, WhatsApp y productos', quien: 'Cliente', estado: 'en_progreso' },
  { fase_num: 2, titulo: 'Diseño — Setup visual e identidad', subtitulo: 'Yo armo la base con tu marca', quien: 'Fernando', estado: 'pendiente' },
  { fase_num: 3, titulo: 'Carga de productos', subtitulo: 'Yo cargo todos tus productos', quien: 'Fernando', estado: 'pendiente' },
  { fase_num: 4, titulo: 'Integraciones — BCV, WhatsApp, dominio', subtitulo: 'Yo conecto todo el sistema', quien: 'Fernando', estado: 'pendiente' },
  { fase_num: 5, titulo: 'Revisión — Tú pruebas la tienda', subtitulo: 'Tú revisas y apruebas', quien: 'Cliente', estado: 'pendiente' },
  { fase_num: 6, titulo: 'Lanzamiento — Tienda en vivo', subtitulo: 'Yo lanzo y te entrego todos los accesos', quien: 'Fernando', estado: 'pendiente' },
]

export const DEFAULT_MATERIALS: Array<Omit<Material, 'id' | 'client_id' | 'updated_at'>> = [
  { tipo: 'logo', titulo: 'Tu Logotipo', recibido: false, notas: null, archivo_url: null },
  { tipo: 'whatsapp', titulo: 'Tu WhatsApp Business', recibido: false, notas: null, archivo_url: null },
  { tipo: 'catalogo', titulo: 'Tu Catálogo de Productos', recibido: false, notas: null, archivo_url: null },
]

export async function createDefaultPhases(clientId: string) {
  const { error } = await getSupabase()
    .from('project_phases')
    .insert(DEFAULT_PHASES.map(p => ({ ...p, client_id: clientId })))
  if (error) throw error
}

export async function createDefaultMaterials(clientId: string) {
  const { error } = await getSupabase()
    .from('materials')
    .insert(DEFAULT_MATERIALS.map(m => ({ ...m, client_id: clientId })))
  if (error) throw error
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function youtubeThumb(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null
}

export function buildPortalShareText(slug: string, accessCode: string): string {
  const link = `${window.location.origin}/cliente/${slug}`
  return `¡Hola! 👋 Este es tu portal de proyecto TiendaPana:\n\n${link}\n\nTu código de acceso: ${accessCode}\n\nAhí puedes ver el progreso de tu tienda en tiempo real.`
}
