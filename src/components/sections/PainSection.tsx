import { motion } from 'framer-motion'
import { pains } from '@/data/pains'
import { Mascot } from '@/components/Mascot'

interface Pain { emoji: string; titulo: string; texto: string }

// 4 cards: 2×2 grid with color variety
const cardStyles = [
  { cols: '', bg: 'bg-ink border-ink',                   title: 'text-white', body: 'text-white/70', emojiSize: 'text-5xl' },
  { cols: '', bg: 'bg-brand-50 border-brand-200',        title: 'text-ink',   body: 'text-muted',    emojiSize: 'text-4xl' },
  { cols: '', bg: 'bg-surface border-border',            title: 'text-ink',   body: 'text-muted',    emojiSize: 'text-4xl' },
  { cols: '', bg: 'bg-brand-500 border-brand-500',       title: 'text-white', body: 'text-white/80', emojiSize: 'text-5xl' },
]

export function PainSection() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">

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

        {/* 6-card asymmetric grid: 2+2+2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {(pains as Pain[]).map((pain, i) => {
            const s = cardStyles[i]
            return (
              <motion.div
                key={pain.titulo}
                className={s.cols}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`p-6 md:p-7 border rounded-2xl h-full flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200 ${s.bg}`}>
                  <div className={s.emojiSize}>{pain.emoji}</div>
                  <h3 className={`font-display font-bold text-[15px] leading-snug ${s.title}`}>
                    {pain.titulo}
                  </h3>
                  <p className={`text-sm leading-relaxed ${s.body}`}>{pain.texto}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Closing validator */}
        <motion.div
          className="mt-14 flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg md:text-xl italic text-ink max-w-3xl text-center md:text-left leading-relaxed">
            "No es tu culpa. Es que nadie te explicó que tu tienda online es el activo que más
            dinero va a producirte después de tu cuenta de Instagram."
          </p>
          <div className="shrink-0">
            <Mascot variant="asombrado" width={160} className="w-[140px] md:w-[160px]" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
