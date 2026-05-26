import { motion } from 'framer-motion'
import { pains } from '@/data/pains'
import { Mascot } from '@/components/Mascot'

interface Pain { emoji: string; titulo: string; texto: string }

// 4 cards with strong visual contrast — no identical grid
const cardStyles = [
  {
    bg: 'bg-ink border-ink',
    title: 'text-white',
    body: 'text-white/70',
    emojiSize: 'text-5xl',
  },
  {
    bg: 'bg-brand-50 border-brand-200',
    title: 'text-ink',
    body: 'text-muted',
    emojiSize: 'text-4xl',
  },
  {
    bg: 'bg-surface border-border',
    title: 'text-ink',
    body: 'text-muted',
    emojiSize: 'text-4xl',
  },
  {
    bg: 'bg-brand-500 border-brand-500',
    title: 'text-white',
    body: 'text-white/80',
    emojiSize: 'text-5xl',
  },
]

export function PainSection() {
  return (
    <section className="relative py-20 md:py-28 bg-bg overflow-hidden">
      {/* Animated noise-like background */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 0%, oklch(78% 0.14 40 / 0.05) 0%, transparent 60%)',
          animation: 'glow-pulse 14s ease-in-out infinite',
          animationDelay: '2s',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 relative z-10">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink mb-4">
            Si vendes por Instagram, esto te va a sonar
          </h2>
          <p className="text-base text-muted max-w-2xl mx-auto">
            No te juzgamos. La mayoría de tiendas de IG en Venezuela está atrapada en el mismo loop.
            La diferencia entre las que crecen y las que no: las que crecen dejaron de hacer esto.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {(pains as Pain[]).map((pain, i) => {
            const s = cardStyles[i]
            return (
              <motion.div
                key={pain.titulo}
                className={`p-6 md:p-8 border rounded-2xl h-full flex flex-col gap-3
                  hover:-translate-y-0.5 transition-transform duration-200 ${s.bg}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`leading-none ${s.emojiSize}`} role="img" aria-label={pain.titulo}>
                  {pain.emoji}
                </div>
                <h3 className={`font-display font-bold text-[15px] leading-snug ${s.title}`}>
                  {pain.titulo}
                </h3>
                <p className={`text-sm leading-relaxed ${s.body}`}>{pain.texto}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Closing quote */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
            {/* Large quote mark */}
            <span
              className="font-display font-black text-8xl leading-none text-brand-500 opacity-20 select-none hidden md:block"
              aria-hidden="true"
            >
              "
            </span>
            <p className="text-lg md:text-xl text-ink max-w-3xl leading-relaxed font-medium">
              No es tu culpa. Es que nadie te explicó que tu tienda online es el activo que más
              dinero va a producirte después de tu cuenta de Instagram.
            </p>
          </div>
          <div className="shrink-0">
            <Mascot variant="asombrado" width={160} className="w-[130px] md:w-[155px]" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
