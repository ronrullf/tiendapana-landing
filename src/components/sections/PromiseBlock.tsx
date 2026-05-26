import { motion } from 'framer-motion'
import { useDollarRate } from '@/hooks/useDollarRate'

export function PromiseBlock() {
  const { data: rate } = useDollarRate()

  return (
    <section
      className="relative min-h-[65vh] flex items-center justify-center py-24 md:py-32 overflow-hidden"
    >
      {/* Layered animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(99%_0.008_40)]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 50%, oklch(78% 0.14 40 / 0.12) 0%, transparent 70%)',
            animation: 'glow-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.07) 0%, transparent 70%)',
            animation: 'glow-pulse 12s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
        <div
          className="absolute -bottom-20 -left-10 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.06) 0%, transparent 70%)',
            animation: 'glow-pulse 15s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" aria-hidden="true">
          <defs>
            <pattern id="promise-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="oklch(65% 0.18 40)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#promise-grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 lg:px-12 text-center">
        <div className="flex flex-col items-center gap-6 md:gap-8">

          {/* Line 1 */}
          <motion.p
            className="font-display font-black text-2xl md:text-4xl text-ink leading-tight"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Tasa BCV automatizada,
          </motion.p>

          {/* Live rate badge */}
          {rate?.promedio && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4 bg-white border border-brand-200 rounded-2xl px-7 py-5"
              style={{ boxShadow: '0 8px 40px oklch(65% 0.18 40 / 0.13)' }}
            >
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">BCV ahora mismo</span>
                <span className="font-display font-black text-4xl md:text-5xl text-brand-500 leading-none tabular-nums">
                  Bs.&nbsp;{rate.promedio.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-xs font-semibold text-white bg-green-400 px-3 py-1 rounded-full shrink-0">en vivo</span>
            </motion.div>
          )}

          {/* Big statement */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500 flex items-center gap-2">
              <span className="inline-block w-4 h-px bg-brand-500" />
              conectada directamente a tu WhatsApp
              <span className="inline-block w-4 h-px bg-brand-500" />
            </span>
            <span
              className="font-display font-black leading-none text-ink"
              style={{ fontSize: 'clamp(52px, 10vw, 100px)', letterSpacing: '-0.03em' }}
            >
              sin que toques nada.
            </span>
          </motion.div>

          {/* Line 3 */}
          <motion.p
            className="font-display font-black text-xl md:text-2xl text-muted leading-tight max-w-2xl"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            Cada precio se actualiza solo. Tus clientes ven Bs. exactos.
            Tú no buscas la tasa nunca más.
          </motion.p>

        </div>
      </div>
    </section>
  )
}
