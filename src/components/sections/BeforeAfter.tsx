import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { beforeItems, afterItems } from '@/data/beforeAfter'

export function BeforeAfter() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink">
            Lo que tienes hoy vs.{' '}
            <span className="text-brand-500">lo que vas a tener</span>
          </h2>
        </motion.div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Before */}
          <motion.div
            className="rounded-2xl border border-border bg-surface overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-5 border-b border-border">
              <span className="font-display font-black text-2xl text-muted">Hoy</span>
            </div>
            <div className="flex flex-col">
              {beforeItems.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0"
                >
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <X size={13} className="text-red-400" />
                  </div>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            className="rounded-2xl border border-brand-200 bg-brand-50 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-5 border-b border-brand-200">
              <span className="font-display font-black text-2xl text-ink">Con Tienda Pana</span>
            </div>
            <div className="flex flex-col">
              {afterItems.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-brand-100 last:border-0"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <Check size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-ink">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
