import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { realStores } from '@/data/socialProof'

interface Store {
  nombre: string
  categoria: string
  url: string
}

export function SocialProof() {
  return (
    <section className="py-20 md:py-28 bg-bg">
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
            Tiendas que confiaron en nosotros
          </h2>
          <p className="text-base text-muted max-w-2xl mx-auto">
            Más de 30 tiendas construidas en Caracas, Valencia, Maracaibo y Barquisimeto. Aquí
            algunas que puedes ver en vivo.
          </p>
        </motion.div>

        {/* Real stores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {(realStores as Store[]).map((store, i) => (
            <motion.div
              key={store.nombre}
              className="rounded-2xl border border-border bg-surface overflow-hidden hover:border-brand-300 hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Preview placeholder */}
              <div className="h-40 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                <span className="font-display font-black text-2xl text-brand-400">{store.nombre}</span>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-base text-ink">{store.nombre}</p>
                  <p className="text-xs text-muted mt-0.5">{store.categoria}</p>
                </div>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors min-h-[44px] min-w-[44px] justify-end"
                >
                  Ver tienda <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
