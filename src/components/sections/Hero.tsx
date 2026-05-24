import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[oklch(99%_0.008_40)]" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, oklch(78% 0.14 40 / 0.13) 0%, transparent 70%)',
          animation: 'glow-pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at bottom right, oklch(78% 0.14 40 / 0.07) 0%, transparent 65%)',
          animation: 'glow-pulse 11s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ animation: 'mesh-drift 18s ease-in-out infinite' }}
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="oklch(65% 0.18 40)" opacity="0.18" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        style={{ animation: 'mesh-drift-reverse 24s ease-in-out infinite' }}
      >
        <defs>
          <pattern id="diagonal-lines" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <line x1="0" y1="48" x2="48" y2="0" stroke="oklch(65% 0.18 40)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>
    </div>
  )
}

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <HeroBackground />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 w-full py-20 md:py-28">
        <div className="flex flex-col items-start">

          {/* Copy */}
          <motion.div
            className="w-full max-w-2xl flex flex-col gap-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display font-black text-5xl md:text-7xl text-ink leading-[1.05]">
              Vendes por Instagram. Pero estás dejando{' '}
              <span className="text-brand-500 draw-underline">plata sobre la mesa</span>{' '}
              todos los días.
            </h1>

            <p className="text-lg md:text-xl text-muted font-medium max-w-xl leading-relaxed">
              Te montamos tu tienda online profesional en{' '}
              <strong className="text-ink">72 horas</strong> — con tu{' '}
              <strong className="text-ink">.com propio</strong>,{' '}
              <strong className="text-ink">tasa BCV automática</strong> y{' '}
              <strong className="text-ink">WhatsApp Business conectado</strong>. Para que dejes
              de responder "el precio está por DM" y empieces a vender hasta dormido.
            </p>

            <div className="flex flex-col gap-3 items-start">
              <OrangeGlowButton size="lg" whatsapp onClick={() => navigate('/pide-tu-demo')}>
                Quiero mi demo →
              </OrangeGlowButton>
              <p className="text-xs text-muted">
                Sin compromiso · Te respondemos por WhatsApp en minutos
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
