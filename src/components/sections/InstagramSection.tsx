import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

const threePoints = [
  {
    label: 'Tu Instagram',
    text: 'sigue trayendo clientes — eso lo haces tú mejor que nadie.',
    accent: false,
  },
  {
    label: 'Tu tienda',
    text: 'los convierte en ventas mientras duermes — eso lo hacemos nosotros.',
    accent: true,
  },
  {
    label: 'Tu WhatsApp',
    text: 'solo cierra el negocio — sin calculadora, sin buscar precios, sin mandar PDFs.',
    accent: false,
  },
]

export function InstagramSection() {
  const navigate = useNavigate()

  return (
    <section className="py-24 md:py-32 bg-bg">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2 mb-6">
              <span className="inline-block w-6 h-px bg-brand-500" />
              El potencial que ya tienes
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-ink leading-tight">
              Instagram es tu mejor canal de ventas.
              <br />
              El problema es que lo estás usando al{' '}
              <span className="text-brand-500">30%.</span>
            </h2>
          </motion.div>

          {/* Body prose */}
          <motion.div
            className="flex flex-col gap-5 text-base md:text-lg text-muted leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p>
              En Venezuela, Instagram mueve más ventas para tiendas pequeñas que Facebook, TikTok y
              Mercado Libre <strong className="text-ink">juntos</strong>. Tus clientes ya están ahí.
              Te buscan, te encuentran, te siguen, le dan zoom a tus fotos.
            </p>
            <p>
              El problema no es Instagram. <strong className="text-ink">Instagram es oro.</strong>
            </p>
            <p>
              El problema es que después del DM, todo se vuelve manual. Precios, tasas, fotos
              repetidas, catálogos olvidados, recordatorios, cobranza. Tú trabajando como cajero,
              vendedor, calculadora y soporte técnico al mismo tiempo.
            </p>

            {/* Bold callout line */}
            <p className="text-lg md:text-xl font-bold text-ink border-l-0 pl-0">
              Una tienda online no reemplaza tu Instagram. Lo potencia.
            </p>
          </motion.div>

          {/* Three-point breakdown */}
          <div className="flex flex-col gap-4 mb-12">
            {threePoints.map((pt, i) => (
              <motion.div
                key={i}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${
                  pt.accent
                    ? 'bg-brand-50 border-brand-200'
                    : 'bg-surface border-border'
                }`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${pt.accent ? 'bg-brand-500' : 'bg-muted'}`} />
                <p className="text-base text-ink leading-relaxed">
                  <strong>{pt.label}</strong> {pt.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Punch line */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl font-bold text-ink mb-6">
              Eso es vender inteligente. Y eso es exactamente lo que hace Tienda Pana.
            </p>
            <OrangeGlowButton size="lg" whatsapp onClick={() => navigate('/demo')}>
              Quiero mi demo →
            </OrangeGlowButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
