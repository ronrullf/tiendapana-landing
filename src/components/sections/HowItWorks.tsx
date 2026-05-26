import { motion } from 'framer-motion'
import { Mascot } from '@/components/Mascot'

const steps = [
  {
    num: '01',
    titulo: 'Pides tu demo gratis',
    texto: 'Llenas el formulario, nos cuentas qué vendes y te respondemos por WhatsApp en minutos. Sin esperar.',
    badge: null,
  },
  {
    num: '02',
    titulo: 'Te entregamos en 72 horas',
    texto: 'Con tus productos de muestra, dominio temporal, tasa BCV en vivo y WhatsApp conectado. Pruébala. Mándale el link a un cliente real.',
    badge: '72h garantizadas',
  },
  {
    num: '03',
    titulo: 'Si te gusta, la activamos',
    texto: 'Pasamos tu demo a producción con tus productos reales y tu dominio .com. Si no te gusta, no pasa nada. Cero compromiso.',
    badge: null,
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28 bg-bg overflow-hidden">
      {/* Animated background orb */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.06) 0%, transparent 70%)',
          animation: 'glow-pulse 12s ease-in-out infinite',
          animationDelay: '2s',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-brand-500" />
            El proceso
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink">
            Así de simple es trabajar con nosotros
          </h2>
        </motion.div>

        {/* Steps — editorial layout with giant numbers */}
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 py-10
                ${i < steps.length - 1 ? 'border-b border-border' : ''}
              `}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Giant number */}
              <div className="shrink-0 w-28 md:w-36 flex items-center justify-start md:justify-center">
                <span
                  className="font-display font-black leading-none text-[72px] md:text-[96px] select-none"
                  style={{ color: 'oklch(78% 0.14 40 / 0.18)', letterSpacing: '-0.04em' }}
                  aria-hidden="true"
                >
                  {step.num}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-display font-black text-xl md:text-2xl text-ink">
                    {step.titulo}
                  </h3>
                  {step.badge && (
                    <span className="text-xs font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full"
                      style={{ background: 'linear-gradient(135deg, oklch(68% 0.18 40), oklch(62% 0.20 40))' }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-base text-muted leading-relaxed max-w-lg">{step.texto}</p>
              </div>

              {/* Mascot on last step */}
              {i === 2 && (
                <div className="shrink-0 self-center">
                  <Mascot variant="pulgar-arriba" width={80} className="w-16 md:w-20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
