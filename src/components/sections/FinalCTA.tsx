import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '@/components/Mascot'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

export function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(98.5%_0.012_40)]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 100%, oklch(78% 0.14 40 / 0.12) 0%, transparent 65%)',
          }}
        />
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="cta-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="oklch(65% 0.18 40)" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left: copy + mascot */}
          <motion.div
            className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Mascot variant="pulgar-arriba" width={180} className="w-36 md:w-44" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brand-500" />
              Empieza ahora
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-ink leading-tight">
              ¿Listo para dejar de perder ventas?
            </h2>
            <p className="text-base text-muted leading-relaxed max-w-md">
              Te montamos tu demo gratis en 72 horas. Tus productos, tu tasa BCV en vivo, tu
              WhatsApp conectado. Sin propuestas de 40 páginas. Sin reuniones innecesarias.
              De pana a pana.
            </p>

            {/* Trust signals */}
            <div className="flex flex-col gap-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✓</span> Demo lista en 72 horas
              </span>
              <span className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✓</span> Sin compromiso de pago
              </span>
              <span className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✓</span> Sin tarjetas. Sin contratos. Solo WhatsApp.
              </span>
            </div>
          </motion.div>

          {/* Right: CTA card */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="bg-white rounded-3xl border border-border p-8 md:p-10 flex flex-col gap-5 items-center text-center"
              style={{ boxShadow: '0 0 0 1px oklch(65% 0.18 40 / 0.06), 0 16px 48px oklch(65% 0.18 40 / 0.10)' }}
            >
              <p className="font-display font-black text-xl text-ink">
                Toma 60 segundos. Lo prometo.
              </p>
              <p className="text-sm text-muted leading-relaxed max-w-xs">
                Llena el form rápido y te armamos la demo en 72 horas. Sin reuniones. Sin propuestas. Solo WhatsApp.
              </p>
              <OrangeGlowButton size="lg" whatsapp fullWidth onClick={() => navigate('/pide-tu-demo')}>
                Quiero mi demo →
              </OrangeGlowButton>
              <p className="text-xs text-muted">Sin tarjetas · Sin contratos · Solo WhatsApp</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
