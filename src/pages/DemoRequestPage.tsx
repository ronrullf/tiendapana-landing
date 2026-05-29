import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { trackFormularioDemoEnviado } from '@/lib/analytics'
import { showFieldToast } from '@/lib/fieldToast'
import { WhatsAppPreview } from '@/components/demo-request/WhatsAppPreview'
import { SuccessScreen } from '@/components/demo-request/SuccessScreen'
import { buildWhatsAppMessage, type DemoFormData } from '@/lib/buildWhatsAppMessage'

// ─── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  nombre:           z.string().min(2, "Necesito tu nombre pa' saber cómo decirte").max(50),
  negocio:          z.string().min(3, "Cuéntame qué vendes pa' poder ayudarte mejor").max(100),
  instagram:        z.string()
                      .min(1, "Necesito tu usuario de Instagram pa' echarle un ojo")
                      .regex(/^[a-zA-Z0-9._]{1,30}$/, "Solo letras, números, puntos y guiones bajos"),
  facturacion:      z.string().min(1, 'Elige el rango que más se acerque a tu realidad'),
  cuandoLanzar:     z.string().min(1, 'Dime cuándo te gustaría lanzar'),
  productos:        z.string().optional(),
  whatsappBusiness: z.enum(['si', 'no', '']).optional(),
  algoMas:          z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

// ─── Radio card options ────────────────────────────────────────────────────────
const FACTURACION_OPTS = ['Menos de $500', '$500 - $1.500', '$1.500 - $3.000', 'Más de $3.000']
const CUANDO_OPTS      = ['Cuanto antes, en 72 horas 🔥', 'En 1-2 semanas', 'Solo estoy explorando']
const PRODUCTOS_OPTS   = ['1 - 15 productos', '15 - 50 productos', '50 - 200 productos', 'Más de 200 productos', 'Aún no sé']
const WA_OPTS          = [{ value: 'si', label: 'Sí, ya lo uso' }, { value: 'no', label: 'No todavía' }]

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="text-xs mt-1.5"
          style={{ color: '#DC2626' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-semibold text-[#0F172A] mb-2">
      {children}
      {required && <span className="text-[#F97316] ml-1">*</span>}
    </p>
  )
}

function RadioCards({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: string[] | { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  cols?: number
}) {
  const normalized = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )
  return (
    <div className={`grid gap-2.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {normalized.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected ? '' : opt.value)}
            className="text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 active:scale-[0.97]"
            style={{
              background:  selected ? '#FEF3E2' : '#FFFFFF',
              borderColor: selected ? '#F97316' : '#E5E7EB',
              color:       selected ? '#0F172A' : '#64748B',
              boxShadow:   selected ? '0 0 0 2px #F97316' : 'none',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function inputStyle(hasError: boolean) {
  return {
    background:  '#FFFFFF',
    border:      `1px solid ${hasError ? '#DC2626' : '#E5E7EB'}`,
    borderRadius: '12px',
    padding:     '12px 16px',
    fontSize:    '16px',        // prevents iOS zoom
    color:       '#0F172A',
    width:       '100%',
    outline:     'none',
    transition:  'box-shadow 150ms, border-color 150ms',
  } as const
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DemoRequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [waUrl, setWaUrl]         = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '', negocio: '', instagram: '',
      facturacion: '', cuandoLanzar: '',
      productos: '', whatsappBusiness: '', algoMas: '',
    },
  })

  const watchedValues = watch()
  // Strip @ from instagram for preview
  const previewData: Partial<DemoFormData> = {
    ...watchedValues,
    instagram: watchedValues.instagram?.replace(/^@/, ''),
    whatsappBusiness: (watchedValues.whatsappBusiness as 'si' | 'no' | '') || undefined,
  }

  const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string

  const onSubmit = (data: FormValues) => {
    if (!WA_NUMBER) {
      toast.error("Ups, aún no configuramos nuestro WhatsApp. Escríbenos a contacto@tiendapana.com")
      return
    }

    setLoading(true)

    const cleanData: DemoFormData = {
      ...data,
      instagram: data.instagram.replace(/^@/, ''),
      whatsappBusiness: (data.whatsappBusiness as 'si' | 'no') || undefined,
      productos: data.productos || undefined,
      algoMas:   data.algoMas  || undefined,
    }

    const message = buildWhatsAppMessage(cleanData)
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
    setWaUrl(url)

    setTimeout(() => {
      trackFormularioDemoEnviado()
      window.open(url, '_blank')
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  const FIELD_LABELS: Partial<Record<keyof FormValues, string>> = {
    nombre:       'tu nombre',
    negocio:      'el tipo de negocio',
    instagram:    'tu usuario de Instagram',
    facturacion:  'el rango de facturación mensual',
    cuandoLanzar: 'cuándo quieres lanzar la tienda',
  }

  const onError = (errs: typeof errors) => {
    const order: (keyof FormValues)[] = ['nombre', 'negocio', 'instagram', 'facturacion', 'cuandoLanzar']
    const firstField = order.find(f => errs[f])
    if (firstField && FIELD_LABELS[firstField]) {
      showFieldToast(FIELD_LABELS[firstField]!)
    }
    setTimeout(() => {
      document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  const algoMasValue = watchedValues.algoMas ?? ''

  return (
    <div className="min-h-screen" style={{ background: '#FEF3E2' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB]"
        style={{ background: 'rgba(254,243,226,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-black text-base text-[#0F172A] tracking-tight">
            <img src="/logo.png" alt="Tienda Pana" className="w-7 h-7 object-contain" />
            Tienda<span className="text-[#F97316]">Pana</span>
          </Link>
          <Link to="/" className="text-sm text-[#64748B] hover:text-[#F97316] transition-colors flex items-center gap-1">
            ← Volver
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessScreen key="success" nombre={watchedValues.nombre} waUrl={waUrl} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Page headline */}
              <div className="mb-8">
                <h1 className="font-display font-black text-[26px] md:text-4xl text-[#0F172A] leading-tight mb-2">
                  Quiero mi tienda online
                </h1>
                <p className="text-base text-[#64748B]">
                  Llena el form rápido, te respondemos por WhatsApp en minutos. Cero compromiso.
                </p>
                <p className="text-sm text-[#F97316] font-semibold mt-1">Toma 60 segundos. Lo prometo.</p>
              </div>

              {/* Two-column layout */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                {/* ── FORM ── */}
                <form
                  className="flex-1 w-full flex flex-col gap-6"
                  onSubmit={handleSubmit(onSubmit, onError)}
                  noValidate
                >
                  {/* 1 — Nombre */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Label required>Panita, ¿cómo te llamas?</Label>
                    <input
                      {...register('nombre')}
                      placeholder="Tu nombre"
                      style={inputStyle(!!errors.nombre)}
                      onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; e.target.style.borderColor = '#F97316' }}
                      onBlur={e  => { e.target.style.boxShadow = 'none'; if (!errors.nombre) e.target.style.borderColor = '#E5E7EB' }}
                    />
                    <div data-field-error><FieldError message={errors.nombre?.message} /></div>
                  </motion.div>

                  {/* 2 — Negocio */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Label required>¿Qué tipo de negocio tienes?</Label>
                    <input
                      {...register('negocio')}
                      placeholder="Ej: Ropa femenina, repostería, cosméticos importados..."
                      style={inputStyle(!!errors.negocio)}
                      onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; e.target.style.borderColor = '#F97316' }}
                      onBlur={e  => { e.target.style.boxShadow = 'none'; if (!errors.negocio) e.target.style.borderColor = '#E5E7EB' }}
                    />
                    <div data-field-error><FieldError message={errors.negocio?.message} /></div>
                  </motion.div>

                  {/* 3 — Instagram */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Label required>¿Cómo te consigo en Instagram?</Label>
                    <div className="flex items-center gap-0">
                      <span className="h-12 px-3 flex items-center rounded-l-xl border border-r-0 border-[#E5E7EB] bg-[#F1F5F9] text-[#64748B] font-semibold text-base select-none" style={{ borderRadius: '12px 0 0 12px' }}>
                        @
                      </span>
                      <input
                        {...register('instagram')}
                        placeholder="tuusuario"
                        style={{ ...inputStyle(!!errors.instagram), borderRadius: '0 12px 12px 0', borderLeft: 'none' }}
                        onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; e.target.style.borderColor = '#F97316' }}
                        onBlur={e  => {
                          e.target.style.boxShadow = 'none'
                          if (!errors.instagram) e.target.style.borderColor = '#E5E7EB'
                          // Strip @ on blur
                          if (e.target.value.startsWith('@')) {
                            e.target.value = e.target.value.replace(/^@/, '')
                          }
                        }}
                      />
                    </div>
                    <div data-field-error><FieldError message={errors.instagram?.message} /></div>
                  </motion.div>

                  {/* 4 — Facturación */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Label required>Sé honesto, ¿cuánto facturas al mes?</Label>
                    <p className="text-xs text-[#64748B] mb-2.5">Esto nos ayuda a armar tu tienda según tu nivel. Cero juicio.</p>
                    <Controller
                      control={control}
                      name="facturacion"
                      render={({ field }) => (
                        <RadioCards options={FACTURACION_OPTS} value={field.value} onChange={field.onChange} />
                      )}
                    />
                    <div data-field-error><FieldError message={errors.facturacion?.message} /></div>
                  </motion.div>

                  {/* 5 — Cuándo lanzar */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Label required>¿Cuándo quieres lanzar tu tienda?</Label>
                    <p className="text-xs text-[#64748B] mb-2.5">Mientras más cerca, más rápido te respondemos.</p>
                    <Controller
                      control={control}
                      name="cuandoLanzar"
                      render={({ field }) => (
                        <RadioCards options={CUANDO_OPTS} value={field.value} onChange={field.onChange} />
                      )}
                    />
                    <div data-field-error><FieldError message={errors.cuandoLanzar?.message} /></div>
                  </motion.div>

                  {/* 6 — Productos (opcional) */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Label>¿Cuántos productos vas a subir? <span className="text-[#94A3B8] font-normal">(opcional)</span></Label>
                    <Controller
                      control={control}
                      name="productos"
                      render={({ field }) => (
                        <RadioCards options={PRODUCTOS_OPTS} value={field.value ?? ''} onChange={v => field.onChange(v === field.value ? '' : v)} cols={1} />
                      )}
                    />
                  </motion.div>

                  {/* 7 — WA Business (opcional) */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <Label>¿Ya usas WhatsApp Business? <span className="text-[#94A3B8] font-normal">(opcional)</span></Label>
                    <Controller
                      control={control}
                      name="whatsappBusiness"
                      render={({ field }) => (
                        <RadioCards
                          options={WA_OPTS}
                          value={field.value ?? ''}
                          onChange={v => field.onChange(v === field.value ? '' : v)}
                        />
                      )}
                    />
                  </motion.div>

                  {/* 8 — Algo más (opcional) */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Label>¿Algo más que quieras contarnos? <span className="text-[#94A3B8] font-normal">(opcional)</span></Label>
                    <textarea
                      {...register('algoMas')}
                      rows={3}
                      placeholder="Ej: Tengo un evento próximo, ya tengo logo, mi web actual está rota..."
                      maxLength={500}
                      style={{ ...inputStyle(!!errors.algoMas), resize: 'none' }}
                      onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; e.target.style.borderColor = '#F97316' }}
                      onBlur={e  => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#E5E7EB' }}
                    />
                    <p className="text-xs text-[#94A3B8] mt-1 text-right">{algoMasValue.length} / 500</p>
                  </motion.div>

                  {/* Mobile preview toggle */}
                  <div className="lg:hidden">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(p => !p)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#0F172A]"
                    >
                      {previewOpen ? 'Ocultar vista previa ▲' : 'Ver vista previa del mensaje ▼'}
                      {previewOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {previewOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="mt-3">
                            <WhatsAppPreview data={previewData} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-col gap-2"
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.97]"
                      style={{
                        background: loading ? '#1FAD52' : '#25D366',
                        boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
                        cursor: loading ? 'wait' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (!loading) {
                          const el = e.currentTarget
                          el.style.boxShadow = '0 6px 20px rgba(37,211,102,0.45)'
                          el.style.transform = 'translateY(-2px)'
                        }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.boxShadow = '0 4px 14px rgba(37,211,102,0.35)'
                        el.style.transform = 'translateY(0)'
                      }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                            <path d="M21 12a9 9 0 00-9-9"/>
                          </svg>
                          Abriendo WhatsApp...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Mandar por WhatsApp
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-[#94A3B8]">
                      Al darle clic, se abre WhatsApp con tu mensaje listo. Tú solo confirmas.
                    </p>
                  </motion.div>
                </form>

                {/* ── DESKTOP PREVIEW ── */}
                <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-[#64748B]" />
                    Vista previa de tu mensaje
                  </p>
                  <WhatsAppPreview data={previewData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
