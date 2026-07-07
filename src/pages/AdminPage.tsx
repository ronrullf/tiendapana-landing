import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Plus, Edit2, Trash2, ChevronLeft, ExternalLink,
  Eye, EyeOff, Upload, X, Copy, Check,
} from 'lucide-react'
import {
  adminLogin, adminLogout, getAdminSession,
  getAllClients, createClient, updateClient, deleteClient,
  getPhases, getMaterials, getTutorials,
  updatePhaseEstado, updateMaterial,
  addTutorial, updateTutorial, deleteTutorial,
  uploadMaterialFile,
  createDefaultPhases, createDefaultMaterials,
  toSlug, generateCode, youtubeThumb, buildPortalShareText,
  isImageUrl, deleteMaterialFile,
  type Client, type Phase, type Material, type Tutorial, type TiendaEstado,
} from '@/lib/portal'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ESTADO_CYCLE: Phase['estado'][] = ['pendiente', 'en_progreso', 'completado', 'bloqueado']

const ESTADO_STYLE: Record<Phase['estado'], { label: string; color: string; bg: string }> = {
  pendiente:   { label: 'Pendiente',   color: '#94A3B8', bg: '#F1F5F9' },
  en_progreso: { label: 'En progreso', color: '#F97316', bg: '#FFF7ED' },
  completado:  { label: 'Completado',  color: '#22C55E', bg: '#F0FDF4' },
  bloqueado:   { label: 'Bloqueado',   color: '#EF4444', bg: '#FEF2F2' },
}

const MATERIAL_EMOJI: Record<string, string> = { logo: '🎨', whatsapp: '📱', catalogo: '📦' }

function inputCls(err?: boolean) {
  return `w-full h-11 px-3 rounded-xl border text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors ${err ? 'border-red-400' : 'border-[#E5E7EB]'}`
}

// ── Admin login ───────────────────────────────────────────────────────────────

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await adminLogin(email, pass)
    if (err) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-white">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Tienda Pana" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-xl text-ink">
              Tienda<span className="text-brand-500">Pana</span>
              <span className="ml-2 text-xs font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full align-middle">ADMIN</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-8" style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.08)' }}>
          <h1 className="font-display font-black text-xl text-ink mb-5">Panel de administración</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoFocus
              className={inputCls()}
            />
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="Contraseña"
                className={`${inputCls()} pr-10`}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email || !pass}
              className="h-11 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
            >
              {loading ? 'Entrando...' : 'Entrar al panel →'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// ── Client list ───────────────────────────────────────────────────────────────

function ClientCard({
  client,
  phases,
  onEdit,
  onDelete,
}: {
  client: Client
  phases: Phase[]
  onEdit: () => void
  onDelete: () => void
}) {
  const currentPhase = phases.find(p => p.estado === 'en_progreso') ??
    phases.find(p => p.estado === 'bloqueado')
  const style = currentPhase ? ESTADO_STYLE[currentPhase.estado] : ESTADO_STYLE.pendiente
  const completed = phases.filter(p => p.estado === 'completado').length
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(buildPortalShareText(client.slug, client.access_code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display font-black text-base text-ink">{client.nombre}</p>
          <p className="text-xs text-muted font-mono">/{client.slug}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={copyLink}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-muted hover:text-brand-500 hover:border-brand-300 transition-colors"
            title="Copiar enlace + código para el cliente"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <a
            href={`/cliente/${client.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-muted hover:text-brand-500 hover:border-brand-300 transition-colors"
            title="Ver portal como lo ve el cliente"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-muted hover:text-brand-500 hover:border-brand-300 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-muted hover:text-red-500 hover:border-red-300 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{client.plan ?? 'Sin plan'}</p>
        {currentPhase && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: style.bg, color: style.color }}
          >
            Fase {currentPhase.fase_num} · {style.label}
          </span>
        )}
      </div>

      {phases.length > 0 && (
        <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FF7A33, #FF6B00)',
              width: `${Math.round((completed / phases.length) * 100)}%`,
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-muted">
        <span>Código: <span className="font-mono font-bold text-ink">{client.access_code}</span></span>
        <span>{completed}/{phases.length} fases</span>
      </div>
    </div>
  )
}

// ── Create / Edit form (info tab) ─────────────────────────────────────────────

type ClientFormData = {
  nombre: string
  slug: string
  plan: string
  fecha_inicio: string
  fecha_entrega: string
  store_url: string
  whatsapp: string
  access_code: string
  fase_actual: number
  tienda_estado: string
}

function blankForm(): ClientFormData {
  return {
    nombre: '', slug: '', plan: '', fecha_inicio: '', fecha_entrega: '',
    store_url: '', whatsapp: '', access_code: generateCode(), fase_actual: 1,
    tienda_estado: '',
  }
}

function fromClient(c: Client): ClientFormData {
  return {
    nombre:        c.nombre,
    slug:          c.slug,
    plan:          c.plan ?? '',
    fecha_inicio:  c.fecha_inicio ?? '',
    fecha_entrega: c.fecha_entrega ?? '',
    store_url:     c.store_url ?? '',
    whatsapp:      c.whatsapp ?? '',
    access_code:   c.access_code,
    fase_actual:   c.fase_actual,
    tienda_estado: c.tienda_estado ?? '',
  }
}

const TIENDA_OPTIONS: { value: string; label: string }[] = [
  { value: '',              label: '— Dominio aún no comprado —' },
  { value: 'comprado',      label: '🛒 Comprado' },
  { value: 'en_desarrollo', label: '🛠️ En desarrollo' },
  { value: 'terminado',     label: '🚀 Terminado y funcionando' },
]

function SaveBar({ dirty, saving, onSave }: { dirty: boolean; saving: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        onClick={onSave}
        disabled={!dirty || saving}
        className="h-11 px-6 rounded-xl font-bold text-white text-sm disabled:opacity-40 transition-all"
        style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
      {dirty && !saving && (
        <p className="text-xs text-brand-500 font-medium">Tienes cambios sin guardar</p>
      )}
    </div>
  )
}

// ── Phases tab ────────────────────────────────────────────────────────────────

function PhasesTab({ phases, onSaved }: { phases: Phase[]; onSaved: (updated: Phase[]) => void }) {
  const [draft, setDraft]   = useState<Record<string, Phase['estado']>>({})
  const [saving, setSaving] = useState(false)

  const estadoOf = (p: Phase) => draft[p.id] ?? p.estado
  const dirty = phases.some(p => draft[p.id] !== undefined && draft[p.id] !== p.estado)

  const save = async () => {
    setSaving(true)
    try {
      const changed = phases.filter(p => draft[p.id] !== undefined && draft[p.id] !== p.estado)
      await Promise.all(changed.map(p => updatePhaseEstado(p.id, draft[p.id])))
      onSaved(phases.map(p => draft[p.id] !== undefined ? { ...p, estado: draft[p.id] } : p))
      setDraft({})
    } catch (err: unknown) {
      alert('Error al guardar: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {phases.map(p => {
        const estado = estadoOf(p)
        const style = ESTADO_STYLE[estado]
        return (
          <div key={p.id} className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3">
            <span className="text-xs font-bold text-muted w-5 shrink-0">{p.fase_num}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">{p.titulo}</p>
              {p.subtitulo && <p className="text-xs text-muted">{p.subtitulo}</p>}
            </div>
            <select
              value={estado}
              onChange={e => setDraft(d => ({ ...d, [p.id]: e.target.value as Phase['estado'] }))}
              className="text-xs font-bold px-3 py-2 rounded-xl border cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-200"
              style={{ background: style.bg, color: style.color, borderColor: `${style.color}55` }}
            >
              {ESTADO_CYCLE.map(es => (
                <option key={es} value={es}>{ESTADO_STYLE[es].label}</option>
              ))}
            </select>
          </div>
        )
      })}
      <SaveBar dirty={dirty} saving={saving} onSave={save} />
    </div>
  )
}

// ── Materials tab ─────────────────────────────────────────────────────────────

function MaterialsTab({
  materials,
  clientId,
  onUpdate,
}: {
  materials: Material[]
  clientId: string
  onUpdate: (id: string, updates: Partial<Material>) => Promise<void>
}) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [draft, setDraft]   = useState<Record<string, { recibido?: boolean; notas?: string }>>({})
  const [saving, setSaving] = useState(false)

  const recibidoOf = (m: Material) => draft[m.id]?.recibido ?? m.recibido
  const notasOf    = (m: Material) => draft[m.id]?.notas ?? m.notas ?? ''

  const dirty = materials.some(m => {
    const d = draft[m.id]
    if (!d) return false
    return (d.recibido !== undefined && d.recibido !== m.recibido) ||
           (d.notas !== undefined && d.notas !== (m.notas ?? ''))
  })

  const save = async () => {
    setSaving(true)
    try {
      const changed = materials.filter(m => draft[m.id])
      await Promise.all(changed.map(m => onUpdate(m.id, draft[m.id])))
      setDraft({})
    } catch (err: unknown) {
      alert('Error al guardar: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (mat: Material, file: File) => {
    setUploading(mat.id)
    try {
      const url = await uploadMaterialFile(clientId, mat.tipo, file)
      await onUpdate(mat.id, { archivo_url: url, recibido: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Error al subir el archivo: ${msg}\n\nSi dice "row-level security" o "policy", falta correr las políticas del bucket en el SQL Editor de Supabase.`)
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteFile = async (mat: Material) => {
    if (!confirm('¿Eliminar este archivo?')) return
    try { await deleteMaterialFile(mat.archivo_url!) } catch {}
    await onUpdate(mat.id, { archivo_url: null })
  }

  return (
    <div className="flex flex-col gap-4">
      {materials.map(mat => (
        <div key={mat.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">{MATERIAL_EMOJI[mat.tipo] ?? '📄'}</span>
            <p className="font-semibold text-ink text-sm flex-1">{mat.titulo}</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setDraft(d => ({ ...d, [mat.id]: { ...d[mat.id], recibido: !recibidoOf(mat) } }))}
                className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center ${recibidoOf(mat) ? 'bg-green-500' : 'bg-[#E5E7EB]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 mx-1 ${recibidoOf(mat) ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-xs font-medium text-muted">Recibido</span>
            </label>
          </div>

          {/* Notes */}
          <textarea
            rows={2}
            value={notasOf(mat)}
            onChange={e => setDraft(d => ({ ...d, [mat.id]: { ...d[mat.id], notas: e.target.value } }))}
            placeholder="Notas (ej: logo recibido sin fondo)"
            className="w-full px-3 py-2 text-sm rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 resize-none bg-[#FAFAFA]"
          />

          {/* File preview + actions */}
          <input
            type="file"
            className="hidden"
            ref={el => { fileInputRefs.current[mat.id] = el }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(mat, file)
              e.target.value = ''
            }}
          />

          {mat.archivo_url ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#F1F5F9]">
              {isImageUrl(mat.archivo_url) ? (
                <a href={mat.archivo_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <img
                    src={mat.archivo_url}
                    alt={mat.titulo}
                    className="w-16 h-16 object-contain rounded-lg border border-[#E5E7EB] bg-white"
                  />
                </a>
              ) : (
                <a
                  href={mat.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-ink shrink-0"
                >
                  <span className="text-2xl">📄</span>
                  <span className="text-brand-500 hover:underline text-xs font-bold">Ver archivo</span>
                </a>
              )}
              <div className="ml-auto flex gap-2 shrink-0">
                <button
                  onClick={() => fileInputRefs.current[mat.id]?.click()}
                  disabled={uploading === mat.id}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:border-brand-300 hover:text-brand-500 transition-colors disabled:opacity-50"
                >
                  <Upload size={13} />
                  {uploading === mat.id ? 'Subiendo...' : 'Reemplazar'}
                </button>
                <button
                  onClick={() => handleDeleteFile(mat)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-muted hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} /> Eliminar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRefs.current[mat.id]?.click()}
              disabled={uploading === mat.id}
              className="flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border-2 border-dashed border-[#E5E7EB] text-muted hover:border-brand-300 hover:text-brand-500 transition-colors disabled:opacity-50"
            >
              <Upload size={13} />
              {uploading === mat.id ? 'Subiendo...' : 'Subir archivo (imagen, PDF, Excel, CSV...)'}
            </button>
          )}
        </div>
      ))}
      <SaveBar dirty={dirty} saving={saving} onSave={save} />
    </div>
  )
}

// ── Tutorials tab ─────────────────────────────────────────────────────────────

function TutorialsTab({
  tutorials,
  clientId,
  onAdd,
  onUpdate,
  onDelete,
}: {
  tutorials: Tutorial[]
  clientId: string
  onAdd: (t: Omit<Tutorial, 'id' | 'updated_at'>) => void
  onUpdate: (id: string, updates: Partial<Tutorial>) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState({ titulo: '', video_url: '', descripcion: '' })
  const [adding, setAdding] = useState(false)
  const [draft, setDraft]   = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const visibleOf = (t: Tutorial) => draft[t.id] ?? t.visible
  const dirty = tutorials.some(t => draft[t.id] !== undefined && draft[t.id] !== t.visible)

  const save = async () => {
    setSaving(true)
    try {
      const changed = tutorials.filter(t => draft[t.id] !== undefined && draft[t.id] !== t.visible)
      await Promise.all(changed.map(t => onUpdate(t.id, { visible: draft[t.id] })))
      setDraft({})
    } catch (err: unknown) {
      alert('Error al guardar: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = () => {
    if (!form.titulo.trim()) return
    onAdd({
      client_id: clientId,
      titulo: form.titulo.trim(),
      video_url: form.video_url.trim() || null,
      descripcion: form.descripcion.trim() || null,
      orden: tutorials.length,
      visible: false,
    })
    setForm({ titulo: '', video_url: '', descripcion: '' })
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {tutorials.map(t => (
        <div key={t.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {youtubeThumb(t.video_url) && (
              <a href={t.video_url!} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img
                  src={youtubeThumb(t.video_url)!}
                  alt={t.titulo}
                  className="w-28 h-16 rounded-lg object-cover border border-[#E5E7EB]"
                  loading="lazy"
                />
              </a>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink text-sm">{t.titulo}</p>
              {t.descripcion && <p className="text-xs text-muted mt-0.5">{t.descripcion}</p>}
              {t.video_url && (
                <a href={t.video_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-500 hover:underline mt-1 inline-block break-all">
                  {t.video_url}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => setDraft(d => ({ ...d, [t.id]: !visibleOf(t) }))}
                  className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center ${visibleOf(t) ? 'bg-green-500' : 'bg-[#E5E7EB]'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${visibleOf(t) ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-[11px] text-muted">{visibleOf(t) ? 'Visible' : 'Oculto'}</span>
              </label>
              <button onClick={() => onDelete(t.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="bg-white border border-brand-200 rounded-xl p-5 flex flex-col gap-3">
          <input
            placeholder="Título del tutorial *"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
            className={inputCls()}
            autoFocus
          />
          <input
            placeholder="URL del video (YouTube, Loom, etc.)"
            value={form.video_url}
            onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
            className={inputCls()}
          />
          <input
            placeholder="Descripción corta (opcional)"
            value={form.descripcion}
            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            className={inputCls()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.titulo.trim()}
              className="h-9 px-4 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              Agregar
            </button>
            <button
              onClick={() => setAdding(false)}
              className="h-9 px-4 rounded-xl text-sm font-medium text-muted border border-[#E5E7EB] hover:border-[#CBD5E1] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="h-11 rounded-xl border-2 border-dashed border-[#E5E7EB] text-sm font-medium text-muted hover:border-brand-300 hover:text-brand-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={15} /> Añadir tutorial
        </button>
      )}
      <SaveBar dirty={dirty} saving={saving} onSave={save} />
    </div>
  )
}

// ── Client editor ─────────────────────────────────────────────────────────────

type EditTab = 'info' | 'fases' | 'material' | 'tutoriales'

function ClientEditor({
  client,
  onBack,
  onSaved,
}: {
  client: Client | null // null = creating new
  onBack: () => void
  onSaved: () => void
}) {
  const isNew = client === null
  const [tab, setTab] = useState<EditTab>('info')
  const [form, setForm] = useState<ClientFormData>(isNew ? blankForm() : fromClient(client!))
  const [saving, setSaving] = useState(false)
  const [phases, setPhases] = useState<Phase[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [clientId, setClientId] = useState<string | null>(client?.id ?? null)
  const [copied, setCopied] = useState(false)

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(buildPortalShareText(form.slug, form.access_code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (clientId) {
      Promise.all([
        getPhases(clientId),
        getMaterials(clientId),
        getTutorials(clientId),
      ]).then(([p, m, t]) => {
        setPhases(p)
        setMaterials(m)
        setTutorials(t)
      })
    }
  }, [clientId])

  const handleNameChange = (nombre: string) => {
    setForm(f => ({
      ...f,
      nombre,
      slug: isNew ? toSlug(nombre) : f.slug,
    }))
  }

  const saveInfo = async () => {
    if (!form.nombre.trim() || !form.slug.trim() || !form.access_code.trim()) {
      alert('Nombre, slug y código de acceso son obligatorios.')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        const created = await createClient({
          nombre:        form.nombre.trim(),
          slug:          form.slug.trim(),
          plan:          form.plan.trim() || null,
          fecha_inicio:  form.fecha_inicio || null,
          fecha_entrega: form.fecha_entrega || null,
          store_url:     form.store_url.trim() || null,
          whatsapp:      form.whatsapp.trim() || null,
          access_code:   form.access_code.trim(),
          fase_actual:   1,
          tienda_estado: (form.tienda_estado || null) as TiendaEstado | null,
        })
        await Promise.all([
          createDefaultPhases(created.id),
          createDefaultMaterials(created.id),
        ])
        setClientId(created.id)
        const [p, m] = await Promise.all([getPhases(created.id), getMaterials(created.id)])
        setPhases(p)
        setMaterials(m)
        alert(`¡Cliente creado! Comparte este enlace:\ntiendapana.com/cliente/${created.slug}\nCódigo: ${created.access_code}`)
        setTab('fases')
      } else {
        await updateClient(client!.id, {
          nombre:        form.nombre.trim(),
          slug:          form.slug.trim(),
          plan:          form.plan.trim() || null,
          fecha_inicio:  form.fecha_inicio || null,
          fecha_entrega: form.fecha_entrega || null,
          store_url:     form.store_url.trim() || null,
          whatsapp:      form.whatsapp.trim() || null,
          access_code:   form.access_code.trim(),
          tienda_estado: (form.tienda_estado || null) as TiendaEstado | null,
        })
        alert('Guardado.')
      }
      onSaved()
    } catch (err: unknown) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleMaterialUpdate = async (id: string, updates: Partial<Material>) => {
    await updateMaterial(id, updates)
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const handleAddTutorial = async (t: Omit<Tutorial, 'id' | 'updated_at'>) => {
    await addTutorial(t)
    const updated = await getTutorials(clientId!)
    setTutorials(updated)
  }

  const handleUpdateTutorial = async (id: string, updates: Partial<Tutorial>) => {
    await updateTutorial(id, updates)
    setTutorials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const handleDeleteTutorial = async (id: string) => {
    if (!confirm('¿Eliminar este tutorial?')) return
    await deleteTutorial(id)
    setTutorials(prev => prev.filter(t => t.id !== id))
  }

  const TABS: { key: EditTab; label: string; disabled?: boolean }[] = [
    { key: 'info',       label: 'Información' },
    { key: 'fases',      label: 'Fases',      disabled: !clientId },
    { key: 'material',   label: 'Material',   disabled: !clientId },
    { key: 'tutoriales', label: 'Tutoriales', disabled: !clientId },
  ]

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
          <ChevronLeft size={16} /> Volver
        </button>
        <div className="h-4 w-px bg-[#E5E7EB]" />
        <h2 className="font-display font-black text-base text-ink">
          {isNew ? 'Nuevo cliente' : client!.nombre}
        </h2>
        {!isNew && (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#E5E7EB] text-xs font-bold text-muted hover:text-brand-500 hover:border-brand-300 transition-colors"
            >
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
            <a
              href={`/cliente/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
            >
              <ExternalLink size={13} /> Ver como cliente
            </a>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E5E7EB] pb-px">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => !t.disabled && setTab(t.key)}
            disabled={t.disabled}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? 'text-brand-500 border-b-2 border-brand-500 -mb-px'
                : t.disabled
                ? 'text-muted/50 cursor-not-allowed'
                : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'info' && (
            <div className="flex flex-col gap-4 max-w-lg">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Nombre del cliente *</label>
                <input
                  value={form.nombre}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Bodegon Carlos Rengel"
                  className={inputCls(!form.nombre.trim())}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Slug (URL) *</label>
                <div className="flex items-center gap-0">
                  <span className="h-11 px-3 flex items-center bg-[#F8FAFC] border border-r-0 border-[#E5E7EB] rounded-l-xl text-xs text-muted font-mono shrink-0">
                    /cliente/
                  </span>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="bodegon-carlos"
                    className="w-full h-11 px-3 border border-[#E5E7EB] rounded-r-xl text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Código de acceso *</label>
                <div className="flex gap-2">
                  <input
                    value={form.access_code}
                    onChange={e => setForm(f => ({ ...f, access_code: e.target.value.toUpperCase() }))}
                    placeholder="PANA25"
                    className={`${inputCls(!form.access_code.trim())} font-mono tracking-widest uppercase`}
                  />
                  <button
                    onClick={() => setForm(f => ({ ...f, access_code: generateCode() }))}
                    className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-xs text-muted hover:border-brand-300 hover:text-brand-500 transition-colors shrink-0"
                  >
                    Generar
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Plan contratado</label>
                <input
                  value={form.plan}
                  onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                  placeholder="Express $197"
                  className={inputCls()}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Fecha de inicio</label>
                  <input
                    type="date"
                    value={form.fecha_inicio}
                    onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
                    className={inputCls()}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Entrega estimada</label>
                  <input
                    type="date"
                    value={form.fecha_entrega}
                    onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))}
                    className={inputCls()}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">URL de la tienda</label>
                <input
                  value={form.store_url}
                  onChange={e => setForm(f => ({ ...f, store_url: e.target.value }))}
                  placeholder="https://sutienda.com"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Estado de la tienda (dominio)</label>
                <select
                  value={form.tienda_estado}
                  onChange={e => setForm(f => ({ ...f, tienda_estado: e.target.value }))}
                  className={`${inputCls()} cursor-pointer`}
                >
                  {TIENDA_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <p className="text-[11px] text-muted mt-1">El cliente lo ve en la sección "Tu tienda" de su portal</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">WhatsApp Business</label>
                <input
                  value={form.whatsapp}
                  onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="584241234567"
                  className={inputCls()}
                />
              </div>
              <button
                onClick={saveInfo}
                disabled={saving}
                className="h-11 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
              >
                {saving ? 'Guardando...' : isNew ? 'Crear cliente →' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {tab === 'fases' && clientId && (
            <PhasesTab phases={phases} onSaved={setPhases} />
          )}

          {tab === 'material' && clientId && (
            <MaterialsTab
              materials={materials}
              clientId={clientId}
              onUpdate={handleMaterialUpdate}
            />
          )}

          {tab === 'tutoriales' && clientId && (
            <TutorialsTab
              tutorials={tutorials}
              clientId={clientId}
              onAdd={handleAddTutorial}
              onUpdate={handleUpdateTutorial}
              onDelete={handleDeleteTutorial}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Admin page root ───────────────────────────────────────────────────────────

type Screen =
  | { name: 'list' }
  | { name: 'create' }
  | { name: 'edit'; client: Client }

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false)
  const [checking, setChecking] = useState(true)
  const [screen, setScreen]     = useState<Screen>({ name: 'list' })
  const [clients, setClients]   = useState<Client[]>([])
  const [allPhases, setAllPhases] = useState<Record<string, Phase[]>>({})

  useEffect(() => {
    getAdminSession().then(s => {
      setAuthed(!!s)
      setChecking(false)
    })
  }, [])

  const loadClients = async () => {
    const list = await getAllClients()
    setClients(list)
    const phaseMap: Record<string, Phase[]> = {}
    await Promise.all(list.map(async c => {
      phaseMap[c.id] = await getPhases(c.id)
    }))
    setAllPhases(phaseMap)
  }

  useEffect(() => {
    if (authed) loadClients()
  }, [authed])

  const handleLogout = async () => {
    await adminLogout()
    setAuthed(false)
    setScreen({ name: 'list' })
  }

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre} y todos sus datos? Esta acción no se puede deshacer.`)) return
    await deleteClient(id)
    await loadClients()
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Tienda Pana" className="w-7 h-7 object-contain" />
            <span className="font-display font-black text-base text-ink">
              Tienda<span className="text-brand-500">Pana</span>
            </span>
            <span className="ml-1 text-[10px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
          >
            <LogOut size={15} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {screen.name === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display font-black text-2xl text-ink">Clientes</h1>
                  <p className="text-sm text-muted">{clients.length} tiendas activas</p>
                </div>
                <button
                  onClick={() => setScreen({ name: 'create' })}
                  className="flex items-center gap-2 h-10 px-4 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
                >
                  <Plus size={16} /> Nuevo cliente
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-3">🏪</p>
                  <p className="font-bold text-ink">Todavía no tienes clientes</p>
                  <p className="text-sm text-muted mt-1">Crea el primero con el botón de arriba.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map(c => (
                    <ClientCard
                      key={c.id}
                      client={c}
                      phases={allPhases[c.id] ?? []}
                      onEdit={() => setScreen({ name: 'edit', client: c })}
                      onDelete={() => handleDelete(c.id, c.nombre)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {(screen.name === 'create' || screen.name === 'edit') && (
            <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8">
              <ClientEditor
                client={screen.name === 'edit' ? screen.client : null}
                onBack={() => { setScreen({ name: 'list' }); loadClients() }}
                onSaved={loadClients}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
