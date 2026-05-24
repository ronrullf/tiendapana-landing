import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface Props {
  nombre: string
  waUrl: string
}

export function SuccessScreen({ nombre, waUrl }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-6 py-12 px-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated checkmark */}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: '#DCF8C6' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <motion.path
            d="M8 20L16 28L32 12"
            stroke="#25D366"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display font-black text-2xl md:text-3xl text-ink">
          ¡Listo, {nombre}! 🎉
        </h2>
        <p className="text-base text-muted max-w-sm leading-relaxed">
          Tu mensaje se abrió en WhatsApp. Si no te abrió automáticamente, dale clic acá:
        </p>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full max-w-xs h-14 rounded-2xl font-semibold text-white text-base transition-all duration-200"
        style={{
          background: '#25D366',
          boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(37,211,102,0.45)'
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(37,211,102,0.35)'
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Abrir WhatsApp manualmente
      </a>

      <Link
        to="/"
        className="text-sm text-muted hover:text-brand-500 transition-colors"
      >
        ← Volver al inicio
      </Link>
    </motion.div>
  )
}
