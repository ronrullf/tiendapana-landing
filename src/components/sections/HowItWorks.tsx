import { motion } from 'framer-motion'
import { Mascot } from '@/components/Mascot'

const steps = [
  {
    num: '01',
    titulo: 'Pides tu demo gratis',
    texto: 'Llenas el formulario, nos cuentas qué vendes y te respondemos por WhatsApp en minutos. Sin esperar.',
  },
  {
    num: '02',
    titulo: 'Te entregamos la demo en 72 horas',
    texto: 'Con tus productos de muestra, dominio temporal, tasa BCV en vivo y WhatsApp conectado. Pruébala. Mándale el link a un cliente real. Mira la diferencia.',
  },
  {
    num: '03',
    titulo: 'Si te gusta, la activamos',
    texto: 'Pasamos tu demo a producción con tus productos reales y tu dominio .com. Lista para vender. Si no te gusta, no pasa nada. Cero compromiso.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">

        {/* Header — left-aligned for variety */}
        <motion.div
          className="mb-14"
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

        {/* Steps with connector line on desktop */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-brand-200 z-0" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-border relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Step number in a circle so connector line aligns */}
                <div className="w-12 h-12 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center shrink-0 self-start">
                  <span className="font-display font-black text-sm text-brand-500">{step.num}</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-base text-ink mb-2">{step.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.texto}</p>
                </div>

                {i === 2 && (
                  <div className="flex justify-end mt-2">
                    <Mascot variant="pulgar-arriba" width={80} className="w-16 md:w-20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
