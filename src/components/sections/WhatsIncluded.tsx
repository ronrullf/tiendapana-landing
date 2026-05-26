import { motion } from 'framer-motion'
import { Globe, DollarSign, MessageCircle, ShoppingCart, Settings, type LucideProps } from 'lucide-react'
import { pillars } from '@/data/pillars'
import { Mascot } from '@/components/Mascot'

type IconComponent = React.ComponentType<LucideProps>

const iconMap: Record<string, IconComponent> = {
  Globe,
  DollarSign,
  MessageCircle,
  ShoppingCart,
  Settings,
}

// Visual variety: each pillar gets a distinct treatment
const pillarStyles = [
  // 0 — Globe: dark hero card (spans full width on mobile, normal on desktop)
  {
    wrapper: 'md:col-span-2 row-span-1',
    card: 'bg-ink border-ink p-7 md:p-8 flex-row items-center gap-6 md:gap-8',
    iconBg: 'bg-brand-500',
    iconColor: 'text-white',
    title: 'text-white text-xl md:text-2xl',
    body: 'text-white/65 text-base',
    featuredText: 'text-brand-400 font-black text-4xl md:text-5xl leading-none font-display',
  },
  // 1 — DollarSign: orange accent card
  {
    wrapper: '',
    card: 'bg-brand-50 border-brand-200 p-6 flex-col gap-4',
    iconBg: 'bg-brand-500',
    iconColor: 'text-white',
    title: 'text-ink text-base',
    body: 'text-muted text-sm',
    featuredText: '',
  },
  // 2 — MessageCircle: white minimal
  {
    wrapper: '',
    card: 'bg-white border-border p-6 flex-col gap-4',
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    title: 'text-ink text-base',
    body: 'text-muted text-sm',
    featuredText: '',
  },
  // 3 — ShoppingCart: white minimal
  {
    wrapper: '',
    card: 'bg-white border-border p-6 flex-col gap-4',
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    title: 'text-ink text-base',
    body: 'text-muted text-sm',
    featuredText: '',
  },
  // 4 — Settings: surface with mascot
  {
    wrapper: '',
    card: 'bg-surface border-border p-6 flex-col gap-4',
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    title: 'text-ink text-base',
    body: 'text-muted text-sm',
    featuredText: '',
  },
]

interface Pillar {
  icon: string
  titulo: string
  texto: string
}

export function WhatsIncluded() {
  return (
    <section className="relative py-20 md:py-28 bg-surface overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.07) 0%, transparent 70%)',
          animation: 'glow-pulse 14s ease-in-out infinite',
          animationDelay: '1s',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-brand-500" />
            Todo incluido
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink">
            Lo que recibes con tu tienda Pana
          </h2>
          <p className="mt-3 text-base text-muted max-w-2xl">
            Cinco cosas que separan una tienda profesional de un "catálogo de Stanhome". Todas vienen incluidas.
          </p>
        </motion.div>

        {/* Grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {(pillars as Pillar[]).map((pillar, i) => {
            const Icon = iconMap[pillar.icon]
            const s = pillarStyles[i]
            const isLast = i === pillars.length - 1

            return (
              <motion.div
                key={pillar.titulo}
                className={s.wrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`flex border rounded-2xl h-full ${s.card}`}>
                  {i === 0 ? (
                    /* Featured wide card — dark, horizontal */
                    <>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                        {Icon && <Icon size={26} className={s.iconColor} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                          <h3 className={`font-display font-black ${s.title}`}>{pillar.titulo}</h3>
                          <span className={s.featuredText}>.com</span>
                        </div>
                        <p className={s.body}>{pillar.texto}</p>
                      </div>
                    </>
                  ) : (
                    /* Regular cards — vertical */
                    <>
                      <div className="flex items-start justify-between">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                          {Icon && <Icon size={20} className={s.iconColor} />}
                        </div>
                        {isLast && (
                          <Mascot variant="con-telefono" width={64} className="w-12 md:w-16 opacity-90" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-display font-bold mb-1.5 ${s.title}`}>{pillar.titulo}</h3>
                        <p className={s.body}>{pillar.texto}</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
