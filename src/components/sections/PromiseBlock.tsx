import { motion } from 'framer-motion'

const lines = [
  { text: 'Tu tienda online profesional.', size: 'text-3xl md:text-5xl', color: 'text-ink' },
  { text: '72 horas.', size: 'text-6xl md:text-9xl font-black', color: 'text-brand-500', accent: true },
  { text: 'Sin dejar de vender un solo día.', size: 'text-2xl md:text-4xl', color: 'text-ink' },
]

export function PromiseBlock() {
  return (
    <section
      className="relative min-h-[65vh] flex items-center justify-center py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(99%_0.008_40)]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, oklch(78% 0.14 40 / 0.10) 0%, transparent 70%)',
          }}
        />
        {/* Subtle grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" aria-hidden="true">
          <defs>
            <pattern id="promise-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="oklch(65% 0.18 40)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#promise-grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 text-center">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              {line.accent ? (
                <div className="relative inline-flex flex-col items-center">
                  {/* Label above */}
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-2 flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-brand-500" />
                    Tiempo de entrega garantizado
                    <span className="inline-block w-4 h-px bg-brand-500" />
                  </span>
                  <span
                    className={`font-display font-black leading-none ${line.size} ${line.color}`}
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {line.text}
                  </span>
                </div>
              ) : (
                <p className={`font-display font-black leading-tight ${line.size} ${line.color}`}>
                  {line.text}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
