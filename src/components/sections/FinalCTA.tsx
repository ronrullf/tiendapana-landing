import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '@/components/Mascot'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'
import { useDollarRate } from '@/hooks/useDollarRate'

const trustLines = [
  'Demo lista en 72 horas',
  'Sin compromiso de pago',
  'Sin contratos. Solo WhatsApp.',
]

export function FinalCTA() {
  const navigate = useNavigate()
  const { data: rate } = useDollarRate()

  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Rich background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(98.5%_0.012_40)]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 100%, oklch(78% 0.14 40 / 0.14) 0%, transparent 65%)',
          }}
        />
        {/* Secondary orb top-left */}
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.08) 0%, transparent 70%)',
            animation: 'glow-pulse 9s ease-in-out infinite',
          }}
        />
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="cta-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="oklch(65% 0.18 40)" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left: mascot + copy */}
          <motion.div
            className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Mascot variant="pulgar-arriba" width={180} className="w-32 md:w-44" />

            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brand-500" />
              Empieza ahora
            </span>

            <h2 className="font-display font-black text-3xl md:text-5xl text-ink leading-tight">
              Listos para hacerte tu demo.
            </h2>

            <p className="text-base text-muted leading-relaxed max-w-md">
              Llena el formulario y te respondemos por WhatsApp en minutos. Sin
              "déjame mandarte una propuesta de 40 páginas". Solo una conversación
              de pana a pana.
            </p>

            {/* Trust lines */}
            <div className="flex flex-col gap-2.5">
              {trustLines.map((line) => (
                <span key={line} className="flex items-center gap-2.5 text-sm text-muted">
                  <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {line}
                </span>
              ))}
            </div>

            {/* Live BCV trust signal */}
            {rate?.promedio && (
              <motion.div
                className="flex items-center gap-2 text-xs text-muted bg-white border border-border rounded-full px-3 py-1.5"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span>
                  Tasa BCV live:&nbsp;
                  <strong className="text-ink">
                    Bs.&nbsp;{rate.promedio.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                  &nbsp;— ya integrada en tu tienda
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Right: CTA card */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="bg-white rounded-3xl border border-border p-8 md:p-10 flex flex-col gap-6"
              style={{ boxShadow: '0 0 0 1px oklch(65% 0.18 40 / 0.06), 0 20px 60px oklch(65% 0.18 40 / 0.12)' }}
            >
              {/* Card headline */}
              <div className="flex flex-col gap-1">
                <p className="font-display font-black text-xl text-ink">
                  Pídeme mi demo gratis
                </p>
                <p className="text-sm text-muted">
                  Toma 60 segundos. Lo prometo.
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 py-4 border-y border-border">
                {[
                  { num: '30+', label: 'tiendas activas' },
                  { num: '72h', label: 'entrega garantizada' },
                  { num: '$0', label: 'costo de la demo' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 text-center">
                    <p className="font-display font-black text-xl text-brand-500">{s.num}</p>
                    <p className="text-[11px] text-muted leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              <OrangeGlowButton size="lg" whatsapp fullWidth pulse onClick={() => navigate('/demo')}>
                Quiero mi demo →
              </OrangeGlowButton>

              <p className="text-xs text-muted text-center flex items-center justify-center gap-1.5">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <rect x="1" y="5" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 5V3.5C4 2.12 4.89 1 6 1C7.11 1 8 2.12 8 3.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                No spam. No vendemos tu data. Solo WhatsApp.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
