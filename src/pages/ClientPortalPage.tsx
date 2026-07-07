import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, CheckCircle2, Clock, AlertCircle, Circle,
  ChevronDown, ExternalLink, MessageCircle, Play,
} from 'lucide-react'
import {
  verifyAccess, getPhases, getMaterials, getTutorials, youtubeThumb, isImageUrl,
  type ClientPublic, type Phase, type Material, type Tutorial,
} from '@/lib/portal'

// ── Types ─────────────────────────────────────────────────────────────────────

type PortalData = {
  client: ClientPublic
  phases: Phase[]
  materials: Material[]
  tutorials: Tutorial[]
}

const storageKey = (slug: string) => `tp_portal_${slug}`

// ── Status config ─────────────────────────────────────────────────────────────

const ESTADO: Record<Phase['estado'], { label: string; color: string; bg: string; Icon: typeof Circle }> = {
  pendiente:   { label: 'Pendiente',     color: '#94A3B8', bg: '#F1F5F9', Icon: Circle },
  en_progreso: { label: 'En progreso',   color: '#F97316', bg: '#FFF7ED', Icon: Clock },
  completado:  { label: 'Completado',    color: '#22C55E', bg: '#F0FDF4', Icon: CheckCircle2 },
  bloqueado:   { label: 'Te necesito',   color: '#EF4444', bg: '#FEF2F2', Icon: AlertCircle },
}

const MATERIAL_EMOJI: Record<string, string> = {
  logo: '🎨', whatsapp: '📱', catalogo: '📦',
}

const TIENDA_STEPS = [
  { key: 'comprado',      emoji: '🛒', label: 'Dominio comprado' },
  { key: 'en_desarrollo', emoji: '🛠️', label: 'En desarrollo' },
  { key: 'terminado',     emoji: '🚀', label: 'Terminada y funcionando' },
] as const

function TiendaSection({ client }: { client: ClientPublic }) {
  const activeIdx = client.tienda_estado
    ? TIENDA_STEPS.findIndex(s => s.key === client.tienda_estado)
    : -1

  return (
    <div>
      <h2 className="font-display font-black text-xl text-ink mb-4">Tu tienda</h2>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        {activeIdx === -1 && (
          <p className="text-sm text-muted mb-5">
            Aquí verás el estado de tu tienda apenas compremos tu dominio.
          </p>
        )}
        <div className="flex items-start">
          {TIENDA_STEPS.map((step, i) => {
            const done    = i < activeIdx
            const current = i === activeIdx
            const active  = done || current
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {/* connector line */}
                {i > 0 && (
                  <div
                    className="absolute top-6 right-1/2 w-full h-1 -z-0"
                    style={{ background: i <= activeIdx ? '#FF6B00' : '#E5E7EB' }}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 border-4 transition-colors"
                  style={{
                    background: active ? '#FFF7ED' : '#F8FAFC',
                    borderColor: active ? '#FF6B00' : '#E5E7EB',
                    filter: active ? 'none' : 'grayscale(1) opacity(0.5)',
                  }}
                >
                  {done ? '✅' : step.emoji}
                </div>
                <p
                  className={`text-[11px] sm:text-xs font-bold mt-2 text-center px-1 ${
                    active ? 'text-ink' : 'text-muted/60'
                  }`}
                >
                  {step.label}
                </p>
                {current && (
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wide mt-0.5">
                    ● Actual
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {client.tienda_estado === 'terminado' && client.store_url && (
          <div className="mt-5 text-center">
            <a
              href={client.store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)', boxShadow: '0 4px 14px rgba(255,107,0,0.35)' }}
            >
              Ver mi tienda en vivo <ExternalLink size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ slug, initialCode, onSuccess }: { slug: string; initialCode?: string; onSuccess: (d: PortalData) => void }) {
  const [code, setCode]       = useState(initialCode ?? '')
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const autoTried = useRef(false)
  const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string

  const attempt = useCallback(async (codeValue: string) => {
    setError('')
    setLoading(true)
    try {
      const client = await verifyAccess(slug, codeValue)
      if (!client) {
        setError('Código incorrecto. Revisa el mensaje que te enviamos.')
        setLoading(false)
        return
      }
      const [phases, materials, tutorials] = await Promise.all([
        getPhases(client.id),
        getMaterials(client.id),
        getTutorials(client.id),
      ])
      const data: PortalData = { client, phases, materials, tutorials }
      sessionStorage.setItem(storageKey(slug), JSON.stringify(data))
      onSuccess(data)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }, [slug, onSuccess])

  useEffect(() => {
    if (initialCode && !autoTried.current) {
      autoTried.current = true
      attempt(initialCode)
    }
  }, [initialCode, attempt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    attempt(code)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[oklch(99%_0.008_40)]">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Tienda Pana" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-xl text-ink">
              Tienda<span className="text-brand-500">Pana</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <h1 className="font-display font-black text-2xl text-ink mb-1">Tu portal de proyecto</h1>
          <p className="text-sm text-muted mb-6">
            Ingresa el código que te envió Fernando por WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Tu código de acceso"
                autoFocus
                className="w-full h-12 px-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-base text-ink font-mono tracking-widest focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-12 rounded-xl font-bold text-white text-base transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)',
                boxShadow: !loading && code.trim() ? '0 4px 14px rgba(255,107,0,0.35)' : 'none',
              }}
            >
              {loading ? 'Verificando...' : 'Acceder →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          ¿No tienes código?{' '}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, necesito mi código para ingresar al portal 🙏')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-500 hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </motion.div>
    </div>
  )
}

// ── Material toggle item ──────────────────────────────────────────────────────

function MaterialItem({ mat }: { mat: Material }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-white hover:bg-[#FAFAFA] transition-colors text-left"
      >
        <span className="text-xl shrink-0">{MATERIAL_EMOJI[mat.tipo] ?? '📄'}</span>
        <span className="flex-1 text-sm font-semibold text-ink">{mat.titulo}</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: mat.recibido ? '#F0FDF4' : '#FFF7ED',
            color: mat.recibido ? '#16A34A' : '#F97316',
          }}
        >
          {mat.recibido ? '✓ Recibido' : 'Pendiente'}
        </span>
        <ChevronDown
          size={16}
          className="text-muted shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-[#F1F5F9] bg-[#FAFAFA]">
              <p className="text-sm text-muted">
                {mat.notas || 'Sin notas adicionales.'}
              </p>
              {mat.archivo_url && isImageUrl(mat.archivo_url) && (
                <a href={mat.archivo_url} target="_blank" rel="noopener noreferrer" className="block mt-3">
                  <img
                    src={mat.archivo_url}
                    alt={mat.titulo}
                    className="max-h-40 rounded-xl border border-[#E5E7EB] bg-white object-contain"
                    loading="lazy"
                  />
                </a>
              )}
              {mat.archivo_url && (
                <a
                  href={mat.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-brand-500 hover:underline"
                >
                  <ExternalLink size={13} /> Ver archivo
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

function ClientDashboard({ data }: { data: PortalData }) {
  const { client, phases, materials, tutorials } = data
  const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string

  const currentPhase  = phases.find(p => p.estado === 'en_progreso') ?? phases.find(p => p.estado === 'bloqueado')
  const completedCount = phases.filter(p => p.estado === 'completado').length
  const visibleTutorials = tutorials.filter(t => t.visible)

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen bg-[oklch(99%_0.008_40)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Tienda Pana" className="w-6 h-6 object-contain" />
            <span className="font-display font-black text-[15px] text-ink">
              Tienda<span className="text-brand-500">Pana</span>
            </span>
          </div>
          <span className="text-xs text-muted font-medium hidden sm:block">
            Portal de {client.nombre}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-12 flex flex-col gap-8">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display font-black text-3xl md:text-4xl text-ink mb-1">
            ¡Hola, <span className="text-brand-500">{client.nombre}</span>! 👋
          </h1>
          <p className="text-muted text-base">
            Aquí puedes ver el progreso de tu tienda en tiempo real.
          </p>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { label: 'Plan contratado', value: client.plan ?? 'Por confirmar' },
            { label: 'Fecha de inicio',  value: fmt(client.fecha_inicio) },
            { label: 'Entrega estimada', value: fmt(client.fecha_entrega) },
            {
              label: 'Tu tienda',
              value: client.store_url ? 'Ver en vivo ↗' : 'En construcción',
              href: client.store_url ?? undefined,
            },
          ] as const).map((card, i) => (
            <motion.div
              key={card.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <p className="text-[11px] text-muted font-medium uppercase tracking-wide mb-1">{card.label}</p>
              {'href' in card && card.href ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-brand-500 hover:underline"
                >
                  {card.value}
                </a>
              ) : (
                <p className="text-sm font-bold text-ink">{card.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Current phase callout */}
        {currentPhase && (
          <motion.div
            className="rounded-2xl p-5 border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: currentPhase.estado === 'bloqueado' ? '#FEF2F2' : '#FFF7ED',
              borderColor: currentPhase.estado === 'bloqueado' ? '#FECACA' : '#FFEDD5',
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-wide mb-1"
              style={{ color: currentPhase.estado === 'bloqueado' ? '#EF4444' : '#F97316' }}
            >
              {currentPhase.estado === 'bloqueado' ? '🚫 Acción requerida de tu parte' : '📍 Fase actual'}
            </p>
            <p className="font-display font-black text-lg text-ink">
              Fase {currentPhase.fase_num} — {currentPhase.titulo}
            </p>
            {currentPhase.subtitulo && (
              <p className="text-sm text-muted mt-0.5">{currentPhase.subtitulo}</p>
            )}
          </motion.div>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-ink">Progreso general</p>
            <p className="text-sm font-bold text-brand-500">
              {completedCount} de {phases.length} fases completadas
            </p>
          </div>
          <div className="h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF7A33, #FF6B00)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((completedCount / phases.length) * 100)}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Tienda status */}
        <TiendaSection client={client} />

        {/* Roadmap */}
        <div>
          <h2 className="font-display font-black text-xl text-ink mb-4">Roadmap del proyecto</h2>
          <div className="flex flex-col gap-2">
            {phases.map((phase, i) => {
              const cfg = ESTADO[phase.estado]
              const Icon = cfg.Icon
              return (
                <motion.div
                  key={phase.id}
                  className="flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-xl px-5 py-4"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <Icon size={17} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink leading-tight">{phase.titulo}</p>
                    {phase.subtitulo && (
                      <p className="text-xs text-muted mt-0.5">{phase.subtitulo}</p>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Materials */}
        {materials.length > 0 && (
          <div>
            <h2 className="font-display font-black text-xl text-ink mb-4">Material del proyecto</h2>
            <div className="flex flex-col gap-2">
              {materials.map(mat => <MaterialItem key={mat.id} mat={mat} />)}
            </div>
          </div>
        )}

        {/* Tutorials */}
        <div>
          <h2 className="font-display font-black text-xl text-ink mb-4">Tutoriales de tu tienda</h2>
          {visibleTutorials.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🔒</p>
              <p className="text-sm font-bold text-ink">Se desbloquean cuando tu tienda esté en vivo</p>
              <p className="text-xs text-muted mt-1">Esto ocurre en la Fase 6 — Lanzamiento</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {visibleTutorials.map(t => {
                const thumb = youtubeThumb(t.video_url)
                return (
                  <div key={t.id} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                    {thumb && t.video_url && (
                      <a href={t.video_url} target="_blank" rel="noopener noreferrer" className="block relative group">
                        <img
                          src={thumb}
                          alt={t.titulo}
                          className="w-full aspect-video object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play size={20} className="text-brand-500 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </a>
                    )}
                    <div className="p-4">
                      <p className="font-semibold text-ink text-sm mb-1">{t.titulo}</p>
                      {t.descripcion && (
                        <p className="text-xs text-muted mb-2">{t.descripcion}</p>
                      )}
                      {t.video_url && (
                        <a
                          href={t.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:underline"
                        >
                          <Play size={13} /> Ver tutorial
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-display font-black text-base text-ink mb-0.5">¿Tienes dudas?</p>
            <p className="text-sm text-muted">
              Escríbenos por WhatsApp y te respondemos en menos de 12 horas hábiles.
            </p>
          </div>
          {WA_NUMBER && (
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-11 px-5 rounded-xl font-bold text-white text-sm shrink-0"
              style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
            >
              <MessageCircle size={16} /> Escríbenos por WhatsApp
            </a>
          )}
        </div>

        <p className="text-center text-xs text-muted pb-4">
          © {new Date().getFullYear()} TiendaPana · Tu portal de proyecto
        </p>
      </div>
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<PortalData | null>(null)
  const codeFromUrl = searchParams.get('code') ?? undefined

  useEffect(() => {
    if (!slug) return
    try {
      const saved = sessionStorage.getItem(storageKey(slug))
      if (saved) setData(JSON.parse(saved) as PortalData)
    } catch {}
  }, [slug])

  if (!slug) return <p className="p-8 text-center text-muted">URL inválida.</p>

  return (
    <AnimatePresence mode="wait">
      {data ? (
        <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ClientDashboard data={data} />
        </motion.div>
      ) : (
        <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PasswordGate slug={slug} initialCode={codeFromUrl} onSuccess={setData} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
