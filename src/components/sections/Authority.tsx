import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mascot } from '@/components/Mascot'
import { useCountUp } from '@/hooks/useCountUp'

function AnimatedStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { count, start } = useCountUp(num)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [start])

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      <span className="font-display font-black text-3xl md:text-4xl text-brand-500 tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}

export function Authority() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Mascot */}
          <motion.div
            className="flex-shrink-0 flex justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center overflow-hidden">
              <Mascot variant="sonriendo-grande" width={200} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brand-500" />
              Quiénes somos
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-ink">
              Soy Fernando del equipo Tienda Pana.
            </h2>
            <div className="flex flex-col gap-4 text-base text-muted leading-relaxed">
              <p>
                Llevo 3 años trabajando con tiendas de Instagram en toda Venezuela. He ayudado a
                montar desde una ferretería en Maracay que facturaba en PDFs de WhatsApp, hasta
                una tienda de cosméticos en Valencia que mandaba la tasa BCV a mano 30 veces al día.
              </p>
              <p>
                He visto los mismos errores repetirse: dominios raros, tasas inventadas, catálogos
                que nadie abre, ventas que se pierden por desconfianza. Por eso construimos Tienda
                Pana: rápido, accesible y sin que pares de vender ni un día.
              </p>
            </div>

            {/* Animated stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              <AnimatedStat num={30} suffix="+" label="tiendas construidas" />
              <div className="w-px bg-border self-stretch" />
              <AnimatedStat num={72} suffix="h" label="tiempo promedio de entrega" />
              <div className="w-px bg-border self-stretch" />
              <AnimatedStat num={3} suffix=" años" label="en el mercado venezolano" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
