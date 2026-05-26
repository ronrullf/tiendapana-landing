import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { beforeItems, afterItems } from '@/data/beforeAfter'

export function BeforeAfter() {
  return (
    <section className="relative py-20 md:py-28 bg-surface overflow-hidden">
      {/* Background animation */}
      <div
        className="absolute right-1/4 bottom-0 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, oklch(78% 0.14 40 / 0.09) 0%, transparent 65%)',
          animation: 'glow-pulse 10s ease-in-out infinite',
          animationDelay: '4s',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 relative z-10">

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
            className="rounded-2xl border border-border bg-white overflow-hidden"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <span className="font-display font-black text-2xl text-muted">Hoy</span>
            </div>
            <div className="flex flex-col">
              {(beforeItems as string[]).map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                >
                  <div className="w-5 h-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <X size={11} className="text-red-400" />
                  </div>
                  <span className="text-sm text-muted">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            className="rounded-2xl border border-brand-200 bg-brand-50 overflow-hidden"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 py-5 border-b border-brand-200 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <span className="font-display font-black text-2xl text-ink">Con Tienda Pana</span>
            </div>
            <div className="flex flex-col">
              {(afterItems as string[]).map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-brand-100 last:border-0"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                >
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-ink">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
