import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const chips = [
  'Listo en 72 horas',
  'Dominio .com pagado 1 año',
  'Tasa BCV automática',
  'Demo gratis sin compromiso',
]

export function TrustBar() {
  return (
    <section className="bg-surface border-y border-border py-6">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-8">
          {chips.map((chip, i) => (
            <motion.div
              key={chip}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span className="text-sm font-medium text-ink">{chip}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
