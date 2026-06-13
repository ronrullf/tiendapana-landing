import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

// Floating particles for hero background
function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `oklch(78% 0.14 40 / 0.35)`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

const particles = [
  { x: 72, y: 18, size: 6, delay: 0, duration: 4.2 },
  { x: 85, y: 42, size: 4, delay: 1.1, duration: 5.8 },
  { x: 65, y: 68, size: 8, delay: 0.6, duration: 3.9 },
  { x: 90, y: 75, size: 5, delay: 2.0, duration: 6.1 },
  { x: 55, y: 30, size: 3, delay: 1.5, duration: 4.7 },
  { x: 78, y: 55, size: 5, delay: 0.3, duration: 5.2 },
  { x: 95, y: 30, size: 4, delay: 1.8, duration: 4.4 },
]

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[oklch(99%_0.008_40)]" />

      {/* Primary center-top glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, oklch(78% 0.14 40 / 0.14) 0%, transparent 70%)',
          animation: 'glow-pulse 8s ease-in-out infinite',
        }}
      />

      {/* Bottom-right accent */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at bottom right, oklch(78% 0.14 40 / 0.08) 0%, transparent 65%)',
          animation: 'glow-pulse 11s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />

      {/* Dot grid — drifts slowly */}
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

      {/* Diagonal lines layer */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
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

      {/* Floating particles on desktop */}
      <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 w-full py-16 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12 lg:gap-16">

          {/* LEFT: copy */}
          <motion.div
            className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <motion.span
              className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block w-6 h-px bg-brand-500" />
              Tiendas online para cuentas de Instagram
            </motion.span>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.04]">
              <span className="text-brand-500">Vende x5 veces más</span>{' '}
              <span className="underline decoration-brand-500 decoration-[3px] underline-offset-[6px]">esforzándote menos</span>{' '}
              <br className="hidden sm:block" />
              con una tienda online{' '}
              <br className="hidden sm:block" />
              en tu cuenta de instagram.
            </h1>

            <div className="flex flex-col gap-3 items-center md:items-start">
              <OrangeGlowButton size="lg" whatsapp pulse onClick={() => navigate('/pide-tu-demo')}>
                Quiero mi tienda →
              </OrangeGlowButton>
              <p className="text-xs text-muted">
                Sin compromiso · Te respondemos por WhatsApp en minutos
              </p>
            </div>
          </motion.div>

          {/* RIGHT: floating logo */}
          <motion.div
            className="flex-shrink-0 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/logo.png"
              alt="Tienda Pana"
              loading="eager"
              animate={{
                y:      [0, -18, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] lg:w-[380px] lg:h-[380px] object-contain"
              style={{
                filter: 'drop-shadow(0 20px 48px oklch(65% 0.18 40 / 0.30))',
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
