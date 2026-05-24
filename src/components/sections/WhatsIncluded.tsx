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

interface Pillar {
  icon: string
  titulo: string
  texto: string
}

export function WhatsIncluded() {
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
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink mb-4">
            Lo que recibes con tu tienda Pana
          </h2>
          <p className="text-base text-muted max-w-2xl mx-auto">
            Cinco cosas que separan una tienda profesional de un "catálogo de Stanhome". Todas
            vienen incluidas.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(pillars as Pillar[]).map((pillar, i) => {
            const Icon = iconMap[pillar.icon]
            const isLast = i === pillars.length - 1

            return (
              <motion.div
                key={pillar.titulo}
                className={`p-6 rounded-2xl border border-border bg-white flex flex-col gap-4
                  hover:border-brand-200 hover:shadow-sm transition-all duration-200
                  ${isLast ? 'md:col-span-2 lg:col-span-1' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                    {Icon && <Icon size={22} className="text-brand-500" />}
                  </div>
                  {isLast && (
                    <Mascot variant="con-telefono" width={80} className="w-16 md:w-20 opacity-90" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-ink mb-1.5">{pillar.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{pillar.texto}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
