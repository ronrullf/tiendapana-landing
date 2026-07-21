import { motion } from 'framer-motion'
import { ExternalLink, Quote } from 'lucide-react'
import { realStores, testimonials, type RealStore } from '@/data/socialProof'
import { Mascot } from '@/components/Mascot'

interface Testimonial {
  texto: string
  autor: string
  ciudad: string
}

export function SocialProof() {
  return (
    <section className="relative py-20 md:py-28 bg-bg overflow-hidden">
      {/* Subtle animated background */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, oklch(78% 0.14 40 / 0.06) 0%, transparent 65%)',
          animation: 'glow-pulse 16s ease-in-out infinite',
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
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center justify-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-brand-500" />
            Prueba social
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink mb-4">
            Panitas que ya confían en nosotros
          </h2>
          <p className="text-base text-muted max-w-2xl mx-auto">
            Tiendas, consultas y negocios reales construidos por nuestro equipo.
            Todos en vivo — dales clic y compruébalo tú mismo.
          </p>
        </motion.div>

        {/* Real stores — semiventanas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16">
          {realStores.map((store: RealStore, i) => (
            <motion.a
              key={store.nombre}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden border border-border bg-white transition-all duration-300 group flex flex-col hover:border-brand-500 hover:-translate-y-1"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              whileHover={{ boxShadow: '0 12px 32px rgba(255,107,0,0.22)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              {/* Semiventana — fake browser chrome */}
              <div
                className="relative h-40 flex flex-col justify-between p-4"
                style={{ background: store.gradient }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="flex-1 h-5 rounded-md bg-white/10 ml-2 flex items-center px-2 min-w-0">
                    <span className="text-[10px] text-white/50 font-mono truncate">
                      {store.url.replace('https://', '').replace(/\/$/, '')}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-1 block">
                    {store.tag}
                  </span>
                  <span className="font-display font-black text-2xl text-white leading-tight block">
                    {store.nombre}
                  </span>
                </div>

                {/* Live dot */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/60 font-medium">en vivo</span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div>
                  <p className="font-display font-bold text-base text-ink">{store.nombre}</p>
                  <p className="text-xs text-brand-500 font-semibold mt-0.5">{store.categoria}</p>
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">{store.descripcion}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 group-hover:text-brand-600 group-hover:gap-2.5 transition-all min-h-[44px] items-center">
                  Ver en vivo <ExternalLink size={14} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted text-center mb-8">
            Lo que dicen los que ya dieron el paso
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {(testimonials as Testimonial[]).map((t, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-200 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Quote size={20} className="text-brand-500 opacity-60 shrink-0" />
              <p className="text-sm text-ink leading-relaxed flex-1 italic">
                "{t.texto}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-50 shrink-0 flex items-center justify-center">
                  <Mascot variant="sonriendo-circulo" width={32} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">{t.autor}</p>
                  <p className="text-xs text-muted">{t.ciudad}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
